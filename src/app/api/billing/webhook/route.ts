import { db } from '@/lib/db';
import {
  verifyWebhook,
  isPaymentCompleted,
  isCancelled,
  type PayAppWebhookPayload,
} from '@/lib/payapp';
import { getPlanConfig } from '@/lib/billing';
import type { PlanType } from '@/generated/prisma/client';
import {
  sendSubscriptionStarted,
  sendRefundCompleted,
  getOrgOwnerEmail,
} from '@/lib/email';
import { redeemCoupon } from '@/lib/coupon';

// ============================================================
// PayApp 결제 웹훅 (피드백 URL)
// POST /api/billing/webhook
// PayApp 서버에서 결제 완료/취소 시 호출
// 반드시 "SUCCESS" 문자열 응답 필요
// ============================================================

export async function POST(req: Request): Promise<Response> {
  let payload: PayAppWebhookPayload;

  try {
    // PayApp은 application/x-www-form-urlencoded로 전송
    const formData = await req.formData();
    payload = {
      pay_state: (formData.get('pay_state') as string) ?? '',
      pay_date: (formData.get('pay_date') as string) ?? '',
      pay_type: (formData.get('pay_type') as string) ?? '',
      mul_no: (formData.get('mul_no') as string) ?? '',
      linkkey: (formData.get('linkkey') as string) ?? '',
      linkval: (formData.get('linkval') as string) ?? '',
      var1: (formData.get('var1') as string) ?? undefined,
      var2: (formData.get('var2') as string) ?? undefined,
      price: (formData.get('price') as string) ?? undefined,
      goodname: (formData.get('goodname') as string) ?? undefined,
    };
  } catch {
    return new Response('FAIL', { status: 400 });
  }

  // 인증 검증
  if (!verifyWebhook(payload)) {
    return new Response('FAIL', { status: 401 });
  }

  const mulNo = payload.mul_no;
  if (!mulNo) {
    return new Response('FAIL', { status: 400 });
  }

  // ============================================================
  // 결제 완료 처리
  // ============================================================
  if (isPaymentCompleted(payload.pay_state)) {
    await handlePaymentCompleted(payload);
    return new Response('SUCCESS');
  }

  // ============================================================
  // 취소 승인 처리
  // ============================================================
  if (isCancelled(payload.pay_state)) {
    await handlePaymentCancelled(payload);
    return new Response('SUCCESS');
  }

  // 기타 상태 (취소 요청 등) — 별도 처리 없이 SUCCESS 응답
  return new Response('SUCCESS');
}

// ============================================================
// 결제 완료 핸들러
// ============================================================

async function handlePaymentCompleted(payload: PayAppWebhookPayload): Promise<void> {
  const mulNo = payload.mul_no;

  // Case 1: PENDING 상태의 결제 (최초 결제)
  const payment = await db.payment.findFirst({
    where: { externalId: mulNo, status: 'PENDING' },
  });

  if (payment) {
    await processInitialPayment(payment, payload);
    return;
  }

  // Case 2: 정기결제 갱신 — PENDING은 없고, var1(orgId)로 활성 구독 찾기
  const orgId = payload.var1;
  if (orgId) {
    await processRenewalPayment(orgId, payload);
    return;
  }

  // Case 3: 이미 처리되었거나 존재하지 않는 결제 — 무시
}

// ============================================================
// 최초 결제 처리 (PENDING Payment → COMPLETED)
// ============================================================

async function processInitialPayment(
  payment: { id: string; orgId: string; metadata: unknown },
  payload: PayAppWebhookPayload,
): Promise<void> {
  const mulNo = payload.mul_no;
  const orgId = payment.orgId;
  const metadata = payment.metadata as Record<string, string> | null;
  const newPlan = (metadata?.plan ?? 'FREE') as PlanType;
  const billingCycle = metadata?.billingCycle ?? 'monthly';
  const planConfig = await getPlanConfig(newPlan);

  const now = new Date();
  const periodEnd = new Date(now);
  if (billingCycle === 'yearly') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  await db.$transaction(async (tx) => {
    // 1. 결제 상태 → COMPLETED
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        metadata: {
          ...(metadata ?? {}),
          pay_date: payload.pay_date,
          pay_type: payload.pay_type,
        },
      },
    });

    // 2. 기존 활성 구독 비활성화
    await tx.subscription.updateMany({
      where: { orgId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' },
    });

    // 3. 새 구독 생성
    await tx.subscription.create({
      data: {
        orgId,
        plan: newPlan,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        externalId: mulNo,
      },
    });

    // 4. 조직 플랜 업데이트
    await tx.organization.update({
      where: { id: orgId },
      data: { plan: newPlan, quotaLimit: planConfig.quotaLimit },
    });
  });

  // 쿠폰 사용 처리 (결제 성공 후)
  if (metadata?.couponId) {
    await redeemCoupon(
      metadata.couponId,
      orgId,
      Number(metadata.discountAmount ?? 0),
    ).catch(() => {});
  }

  const ownerEmail = await getOrgOwnerEmail(orgId);
  if (ownerEmail) {
    await sendSubscriptionStarted(ownerEmail, planConfig.name, periodEnd).catch(() => {});
  }
}

// ============================================================
// 정기결제 갱신 처리 (새 mul_no로 구독 기간 연장)
// ============================================================

async function processRenewalPayment(
  orgId: string,
  payload: PayAppWebhookPayload,
): Promise<void> {
  const mulNo = payload.mul_no;

  // 이미 이 mul_no로 처리된 결제가 있으면 중복 — 무시
  const alreadyProcessed = await db.payment.findFirst({
    where: { externalId: mulNo, status: 'COMPLETED' },
  });
  if (alreadyProcessed) return;

  // 현재 활성 구독 찾기 (ACTIVE 또는 PAST_DUE — 갱신하면 다시 ACTIVE)
  const subscription = await db.subscription.findFirst({
    where: { orgId, status: { in: ['ACTIVE', 'PAST_DUE', 'GRACE_PERIOD'] } },
    orderBy: { createdAt: 'desc' },
  });

  if (!subscription) return;

  const planConfig = await getPlanConfig(subscription.plan);
  const now = new Date();
  const newPeriodStart = now;
  const newPeriodEnd = new Date(now);
  newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

  await db.$transaction(async (tx) => {
    // 1. 갱신 결제 기록 생성
    await tx.payment.create({
      data: {
        orgId,
        amount: Number(payload.price ?? planConfig.price),
        currency: 'KRW',
        status: 'COMPLETED',
        provider: 'payapp',
        externalId: mulNo,
        metadata: {
          plan: subscription.plan,
          type: 'renewal',
          pay_date: payload.pay_date,
          pay_type: payload.pay_type,
        },
      },
    });

    // 2. 구독 기간 갱신 + 상태 ACTIVE로 복구
    await tx.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: newPeriodStart,
        currentPeriodEnd: newPeriodEnd,
        externalId: mulNo,
        cancelAtPeriodEnd: false, // 갱신되면 해지 예약 해제
      },
    });

    // 3. 조직 플랜 확인 (PAST_DUE에서 복구 시)
    await tx.organization.update({
      where: { id: orgId },
      data: { plan: subscription.plan, quotaLimit: planConfig.quotaLimit },
    });
  });

  const ownerEmail = await getOrgOwnerEmail(orgId);
  if (ownerEmail) {
    await sendSubscriptionStarted(ownerEmail, planConfig.name, newPeriodEnd).catch(() => {});
  }
}

// ============================================================
// 취소 승인 핸들러
// ============================================================

async function handlePaymentCancelled(payload: PayAppWebhookPayload): Promise<void> {
  const mulNo = payload.mul_no;

  // 해당 결제 찾기
  const payment = await db.payment.findFirst({
    where: { externalId: mulNo },
  });

  if (!payment) return;

  const orgId = payment.orgId;

  await db.$transaction(async (tx) => {
    // 1. 결제 상태 → REFUNDED
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED' },
    });

    // 2. 해당 구독 비활성화
    const subscription = await tx.subscription.findFirst({
      where: { orgId, externalId: mulNo },
    });

    if (subscription) {
      await tx.subscription.update({
        where: { id: subscription.id },
        data: { status: 'CANCELLED' },
      });
    }

    // 3. 남은 활성 구독이 있는지 확인
    const activeSubscription = await tx.subscription.findFirst({
      where: { orgId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeSubscription) {
      // 활성 구독 없으면 FREE로 다운그레이드
      const freePlan = await getPlanConfig('FREE');
      await tx.organization.update({
        where: { id: orgId },
        data: { plan: 'FREE', quotaLimit: freePlan.quotaLimit },
      });
    }
  });

  // 환불 이메일 알림
  const ownerEmail = await getOrgOwnerEmail(orgId);
  if (ownerEmail) {
    const amount = payment.amount;
    const planName = (payment.metadata as Record<string, string> | null)?.plan ?? '유료';
    await sendRefundCompleted(ownerEmail, amount, planName).catch(() => {});
  }
}

