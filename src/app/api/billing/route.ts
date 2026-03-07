import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getOrgUsage, getPlans, getPlanConfig, PLANS } from '@/lib/billing';
import type { PlanType } from '@/lib/billing';
import { requestPayment, registerRebill, cancelRebill } from '@/lib/payapp';
import { validateCoupon } from '@/lib/coupon';

// ============================================================
// 결제 API
// GET  /api/billing — 현재 플랜 + 사용량 + 구독 정보
// POST /api/billing — 플랜 변경 (업그레이드/다운그레이드)
// ============================================================

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  const usage = await getOrgUsage(membership.orgId);

  // 활성 구독 조회
  const subscription = await db.subscription.findFirst({
    where: { orgId: membership.orgId, status: { in: ['ACTIVE', 'PAST_DUE', 'GRACE_PERIOD'] } },
    orderBy: { createdAt: 'desc' },
  });

  // 최근 결제 내역
  const recentPayments = await db.payment.findMany({
    where: { orgId: membership.orgId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return NextResponse.json({
    usage: {
      plan: usage.plan,
      planName: usage.planConfig.name,
      projectCount: usage.projectCount,
      quotaLimit: usage.quotaLimit,
      monthlyGenerateCount: usage.monthlyGenerateCount,
      generateLimit: usage.generateLimit,
      deployCount: usage.deployCount,
      deployLimit: usage.deployLimit,
    },
    subscription: subscription
      ? {
          id: subscription.id,
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          cancelReason: subscription.cancelReason,
        }
      : null,
    payments: recentPayments.map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      provider: p.provider,
      createdAt: p.createdAt,
    })),
    plans: await getPlans(),
  });
}

// ============================================================
// POST — 플랜 변경
// 유료: PayApp 결제 요청 → PENDING 대기 → 웹훅에서 확정
// 무료: 기간 종료 해지 예약 (cancelAtPeriodEnd)
// ============================================================

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id, role: 'OWNER' },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '소유자만 플랜을 변경할 수 있습니다' }, { status: 403 });
  }

  const body = (await req.json()) as {
    plan: string;
    cancelReason?: string;
    phone?: string;        // 결제 수신 휴대폰
    billingCycle?: 'monthly' | 'yearly';
    couponCode?: string;   // 쿠폰 코드
  };
  const newPlan = body.plan as PlanType;

  const planConfig = await getPlanConfig(newPlan);
  if (!planConfig) {
    return NextResponse.json({ error: '유효하지 않은 플랜' }, { status: 400 });
  }

  const org = await db.organization.findUniqueOrThrow({
    where: { id: membership.orgId },
    select: { plan: true },
  });

  const currentPlan = org.plan as PlanType;

  if (currentPlan === newPlan) {
    return NextResponse.json({ error: '이미 사용 중인 플랜입니다' }, { status: 400 });
  }

  const isUpgrade = getPlanRank(newPlan) > getPlanRank(currentPlan);
  const isDowngrade = getPlanRank(newPlan) < getPlanRank(currentPlan);

  // ============================================================
  // 무료 플랜으로 다운그레이드
  // ============================================================
  if (newPlan === 'FREE') {
    const activeSubscription = await db.subscription.findFirst({
      where: { orgId: membership.orgId, status: 'ACTIVE' },
    });

    if (activeSubscription) {
      // 기간 종료 해지 예약
      await db.subscription.update({
        where: { id: activeSubscription.id },
        data: {
          cancelAtPeriodEnd: true,
          cancelReason: body.cancelReason ?? '사용자 요청',
        },
      });

      // PayApp 정기결제 해지 (externalId가 있는 경우)
      if (activeSubscription.externalId) {
        try {
          await cancelRebill(activeSubscription.externalId);
        } catch {
          // 정기결제 해지 실패해도 DB 예약은 유지
        }
      }

      return NextResponse.json({
        success: true,
        message: `현재 구독 기간이 끝나면 무료 플랜으로 전환됩니다. (${new Date(activeSubscription.currentPeriodEnd).toLocaleDateString('ko-KR')})`,
        effectiveDate: activeSubscription.currentPeriodEnd,
      });
    }

    // 구독이 없으면 즉시 변경
    await db.organization.update({
      where: { id: membership.orgId },
      data: { plan: 'FREE', quotaLimit: planConfig.quotaLimit },
    });

    return NextResponse.json({
      success: true,
      message: '무료 플랜으로 변경되었습니다.',
    });
  }

  // ============================================================
  // 유료 플랜 변경 — PayApp 결제 요청
  // ============================================================

  const phone = body.phone;
  if (!phone) {
    return NextResponse.json(
      { error: '결제 수신 휴대폰 번호가 필요합니다', requirePhone: true },
      { status: 400 },
    );
  }

  const billingCycle = body.billingCycle ?? 'monthly';
  let price = billingCycle === 'yearly'
    ? planConfig.yearlyPrice * 12 // 연간 일시불
    : planConfig.price;

  // 쿠폰 할인 적용
  let couponId: string | undefined;
  let discountAmount = 0;
  if (body.couponCode) {
    const couponResult = await validateCoupon(body.couponCode, membership.orgId, newPlan, price);
    if (!couponResult.valid) {
      return NextResponse.json({ error: couponResult.error }, { status: 400 });
    }
    couponId = couponResult.couponId;
    discountAmount = couponResult.discountAmount ?? 0;
    price = Math.max(0, price - discountAmount);
  }

  // 중복 결제 방지 — 5분 이내 같은 플랜 PENDING 결제 존재 시 차단
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const existingPending = await db.payment.findFirst({
    where: {
      orgId: membership.orgId,
      status: 'PENDING',
      createdAt: { gte: fiveMinAgo },
    },
  });
  if (existingPending) {
    return NextResponse.json(
      { error: '이미 결제가 진행 중입니다. 잠시 후 다시 시도해 주세요.' },
      { status: 409 },
    );
  }

  // PENDING 결제 레코드 생성
  const payment = await db.payment.create({
    data: {
      orgId: membership.orgId,
      amount: price,
      currency: 'KRW',
      status: 'PENDING',
      provider: 'payapp',
      metadata: {
        plan: newPlan,
        type: isUpgrade ? 'upgrade' : isDowngrade ? 'downgrade' : 'change',
        billingCycle,
        currentPlan,
        ...(couponId ? { couponId, discountAmount: String(discountAmount) } : {}),
      },
    },
  });

  try {
    if (billingCycle === 'monthly') {
      // 정기결제 등록 (매월 자동 결제)
      const rebillExpire = new Date();
      rebillExpire.setFullYear(rebillExpire.getFullYear() + 10); // 10년 후 만료
      const expireStr = rebillExpire.toISOString().slice(0, 10).replace(/-/g, '');

      const result = await registerRebill({
        goodname: `${planConfig.name} 플랜 (월간)`,
        price: planConfig.price,
        recvphone: phone,
        rebillCycleType: 'month',
        rebillCycle: 1,
        rebillExpire: expireStr,
        var1: membership.orgId,
        var2: newPlan,
      });

      if (result.state !== 1) {
        // 결제 요청 실패 → PENDING 결제 삭제
        await db.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });
        return NextResponse.json(
          { error: result.errorMessage || '결제 요청 실패' },
          { status: 400 },
        );
      }

      // mulNo 저장
      await db.payment.update({
        where: { id: payment.id },
        data: { externalId: result.mulNo },
      });

      return NextResponse.json({
        success: true,
        message: '결제 요청이 전송되었습니다. 결제 완료 후 플랜이 변경됩니다.',
        paymentId: payment.id,
        mulNo: result.mulNo,
        pending: true,
      });
    } else {
      // 연간 일시불 (단건 결제)
      const result = await requestPayment({
        goodname: `${planConfig.name} 플랜 (연간)`,
        price,
        recvphone: phone,
        var1: membership.orgId,
        var2: newPlan,
      });

      if (result.state !== 1) {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });
        return NextResponse.json(
          { error: result.errorMessage || '결제 요청 실패' },
          { status: 400 },
        );
      }

      await db.payment.update({
        where: { id: payment.id },
        data: { externalId: result.mulNo },
      });

      return NextResponse.json({
        success: true,
        message: '결제 요청이 전송되었습니다. 결제 완료 후 플랜이 변경됩니다.',
        paymentId: payment.id,
        payUrl: result.payUrl,
        mulNo: result.mulNo,
        pending: true,
      });
    }
  } catch (err) {
    await db.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '결제 요청 중 오류 발생' },
      { status: 500 },
    );
  }
}

function getPlanRank(plan: PlanType): number {
  switch (plan) {
    case 'FREE': return 0;
    case 'PRO': return 1;
    case 'BUSINESS': return 2;
    default: return 0;
  }
}
