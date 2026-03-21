import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { cancelPayment } from '@/lib/payapp';
import { getPlanConfig } from '@/lib/billing';
import { sendRefundCompleted, getOrgOwnerEmail } from '@/lib/email';

// ============================================================
// 관리자 환불 처리 API
// POST /api/admin/refund
// { paymentId: string, reason?: string }
//
// 1. PayApp 취소 요청
// 2. 결제 상태 → REFUNDED
// 3. 관련 구독 비활성화
// 4. 활성 구독 없으면 FREE 다운그레이드
// 5. 이메일 알림
// ============================================================

export async function POST(req: Request): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const body = await req.json();
  const paymentId = body.paymentId as string;
  const reason = (body.reason as string) ?? '관리자 환불 처리';

  if (!paymentId) {
    return NextResponse.json({ error: 'paymentId 필수' }, { status: 400 });
  }

  // 결제 조회
  const payment = await db.payment.findUnique({
    where: { id: paymentId },
    include: { org: { select: { id: true, name: true } } },
  });

  if (!payment) {
    return NextResponse.json({ error: '결제를 찾을 수 없음' }, { status: 404 });
  }

  if (payment.status === 'REFUNDED') {
    return NextResponse.json({ error: '이미 환불된 결제' }, { status: 400 });
  }

  if (payment.status !== 'COMPLETED') {
    return NextResponse.json({ error: '완료된 결제만 환불 가능' }, { status: 400 });
  }

  // PayApp 취소 요청 (externalId가 있는 경우)
  if (payment.externalId) {
    try {
      const result = await cancelPayment({
        mulNo: payment.externalId,
        cancelmemo: reason,
      });
      if (result.state !== 1) {
        return NextResponse.json(
          { error: `PayApp 취소 실패: ${result.errorMessage ?? '알 수 없는 오류'}` },
          { status: 502 },
        );
      }
    } catch {
      return NextResponse.json({ error: 'PayApp 통신 실패' }, { status: 502 });
    }
  }

  const orgId = payment.orgId;

  // 트랜잭션: 환불 처리
  await db.$transaction(async (tx) => {
    // 1. 결제 → REFUNDED
    await tx.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    });

    // 2. 관련 구독 비활성화
    if (payment.externalId) {
      const sub = await tx.subscription.findFirst({
        where: { orgId, externalId: payment.externalId },
      });
      if (sub) {
        await tx.subscription.update({
          where: { id: sub.id },
          data: { status: 'CANCELLED', cancelReason: reason },
        });
      }
    }

    // 3. 활성 구독 없으면 FREE 다운그레이드
    const activeSub = await tx.subscription.findFirst({
      where: { orgId, status: 'ACTIVE' },
    });

    if (!activeSub) {
      const freePlan = await getPlanConfig('FREE');
      await tx.organization.update({
        where: { id: orgId },
        data: { plan: 'FREE', quotaLimit: freePlan.quotaLimit },
      });
    }
  });

  // 이메일 알림
  const ownerEmail = await getOrgOwnerEmail(orgId);
  if (ownerEmail) {
    const planName = (payment.metadata as Record<string, string> | null)?.plan ?? '유료';
    await sendRefundCompleted(ownerEmail, payment.amount, planName).catch(() => {});
  }

  return NextResponse.json({
    success: true,
    paymentId,
    amount: payment.amount,
    orgName: payment.org.name,
  });
}
