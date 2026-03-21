import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getPlanConfig } from '@/lib/billing';
import { cancelRebill } from '@/lib/payapp';
import {
  sendSubscriptionCancelled,
  sendPaymentFailed,
  sendSubscriptionExpiring,
  sendGracePeriodWarning,
  getOrgOwnerEmail,
} from '@/lib/email';

// ============================================================
// 구독 만료 크론 — 매일 실행
// GET /api/cron/subscription-expire
// Authorization: Bearer CRON_SECRET
//
// 1. cancelAtPeriodEnd=true인 구독이 기간 종료 → FREE 다운그레이드
// 2. 기간 지나도 갱신 안 된 구독 → PAST_DUE 전환
// 3. PAST_DUE 7일 초과 → GRACE_PERIOD
// 4. GRACE_PERIOD 14일 초과 → CANCELLED + FREE 다운그레이드
// ============================================================

export async function GET(req: Request): Promise<NextResponse> {
  const isVercelCron = req.headers.get('x-vercel-cron-signature') !== null;
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!isVercelCron && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const results = {
    expiringWarned: 0, // 만료 3일 전 경고 발송
    trialExpired: 0,   // Trial 만료 → FREE 다운그레이드
    cancelled: 0,      // cancelAtPeriodEnd → 해지 완료
    pastDue: 0,        // 기간 만료 → PAST_DUE
    gracePeriod: 0,    // PAST_DUE 7일 초과 → GRACE_PERIOD
    terminated: 0,     // GRACE_PERIOD 14일 초과 → 강제 해지
  };

  // ============================================================
  // -1. 만료 3일 전 경고 이메일 (아직 ACTIVE인 구독)
  // ============================================================
  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  const expiringSoon = await db.subscription.findMany({
    where: {
      status: 'ACTIVE',
      cancelAtPeriodEnd: true,
      isTrial: false,
      currentPeriodEnd: { gt: now, lte: threeDaysLater },
    },
  });

  for (const sub of expiringSoon) {
    const email = await getOrgOwnerEmail(sub.orgId);
    if (email) {
      const planConfig = await getPlanConfig(sub.plan);
      await sendSubscriptionExpiring(email, planConfig.name, sub.currentPeriodEnd).catch(() => {});
    }
    results.expiringWarned++;
  }

  // ============================================================
  // 0. Trial 만료 → FREE 다운그레이드 (결제 없이 바로 해지)
  // ============================================================
  const expiredTrials = await db.subscription.findMany({
    where: {
      status: 'ACTIVE',
      isTrial: true,
      trialEnd: { lte: now },
    },
  });

  for (const sub of expiredTrials) {
    await db.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { id: sub.id },
        data: { status: 'CANCELLED', cancelReason: '무료 체험 기간 만료' },
      });

      await tx.organization.update({
        where: { id: sub.orgId },
        data: { plan: 'FREE', quotaLimit: (await getPlanConfig('FREE')).quotaLimit },
      });
    });

    const email = await getOrgOwnerEmail(sub.orgId);
    if (email) {
      const planConfig = await getPlanConfig(sub.plan);
      await sendSubscriptionCancelled(email, planConfig.name).catch(() => {});
    }
    results.trialExpired++;
  }

  // ============================================================
  // 1. cancelAtPeriodEnd=true이고 기간 종료된 구독 → 해지 + FREE
  // ============================================================
  const expiredCancelReserved = await db.subscription.findMany({
    where: {
      status: 'ACTIVE',
      cancelAtPeriodEnd: true,
      currentPeriodEnd: { lte: now },
    },
  });

  for (const sub of expiredCancelReserved) {
    // PayApp 정기결제 해지 (billing POST에서 이미 호출했을 수도 있지만 안전하게 재호출)
    if (sub.externalId) {
      await cancelRebill(sub.externalId).catch(() => {});
    }

    await db.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { id: sub.id },
        data: { status: 'CANCELLED' },
      });

      const otherActive = await tx.subscription.findFirst({
        where: {
          orgId: sub.orgId,
          status: 'ACTIVE',
          id: { not: sub.id },
        },
      });

      if (!otherActive) {
        await tx.organization.update({
          where: { id: sub.orgId },
          data: { plan: 'FREE', quotaLimit: (await getPlanConfig('FREE')).quotaLimit },
        });
      }
    });

    const email = await getOrgOwnerEmail(sub.orgId);
    if (email) {
      const planConfig = await getPlanConfig(sub.plan);
      await sendSubscriptionCancelled(email, planConfig.name).catch(() => {});
    }
    results.cancelled++;
  }

  // ============================================================
  // 2. 기간 만료 + 해지 예약 아닌 ACTIVE 구독 → PAST_DUE
  //    (정기결제 갱신이 안 된 경우)
  // ============================================================
  const expiredActive = await db.subscription.findMany({
    where: {
      status: 'ACTIVE',
      cancelAtPeriodEnd: false,
      isTrial: false,
      currentPeriodEnd: { lte: now },
    },
  });

  for (const sub of expiredActive) {
    await db.subscription.update({
      where: { id: sub.id },
      data: { status: 'PAST_DUE' },
    });

    const email = await getOrgOwnerEmail(sub.orgId);
    if (email) {
      const planConfig = await getPlanConfig(sub.plan);
      await sendPaymentFailed(email, planConfig.name).catch(() => {});
    }
    results.pastDue++;
  }

  // ============================================================
  // 3. PAST_DUE 7일 초과 → GRACE_PERIOD
  // ============================================================
  const pastDueThreshold = new Date(now);
  pastDueThreshold.setDate(pastDueThreshold.getDate() - 7);

  const longPastDue = await db.subscription.findMany({
    where: {
      status: 'PAST_DUE',
      currentPeriodEnd: { lte: pastDueThreshold },
    },
  });

  for (const sub of longPastDue) {
    await db.subscription.update({
      where: { id: sub.id },
      data: { status: 'GRACE_PERIOD' },
    });

    const email = await getOrgOwnerEmail(sub.orgId);
    if (email) {
      const planConfig = await getPlanConfig(sub.plan);
      await sendGracePeriodWarning(email, planConfig.name, 14).catch(() => {});
    }
    results.gracePeriod++;
  }

  // ============================================================
  // 4. GRACE_PERIOD 14일 초과 → CANCELLED + FREE 강제 다운그레이드
  // ============================================================
  const graceThreshold = new Date(now);
  graceThreshold.setDate(graceThreshold.getDate() - 14);

  const longGrace = await db.subscription.findMany({
    where: {
      status: 'GRACE_PERIOD',
      currentPeriodEnd: { lte: graceThreshold },
    },
  });

  for (const sub of longGrace) {
    // PayApp 정기결제 해지
    if (sub.externalId) {
      await cancelRebill(sub.externalId).catch(() => {});
    }

    await db.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { id: sub.id },
        data: { status: 'CANCELLED', cancelReason: '결제 미갱신 (유예 기간 만료)' },
      });

      await tx.organization.update({
        where: { id: sub.orgId },
        data: { plan: 'FREE', quotaLimit: (await getPlanConfig('FREE')).quotaLimit },
      });
    });

    const email = await getOrgOwnerEmail(sub.orgId);
    if (email) {
      const planConfig = await getPlanConfig(sub.plan);
      await sendSubscriptionCancelled(email, planConfig.name).catch(() => {});
    }
    results.terminated++;
  }

  return NextResponse.json({
    processedAt: now.toISOString(),
    results,
    total: results.expiringWarned + results.trialExpired + results.cancelled + results.pastDue + results.gracePeriod + results.terminated,
  });
}

