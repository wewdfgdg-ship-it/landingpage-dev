import { db } from '@/lib/db';
import type { CreditTxType } from '@/generated/prisma/client';

// ============================================================
// 크레딧 시스템 — 충전/차감/조회
// ============================================================

// ---------- 잔액 조회 ----------

export async function getBalance(orgId: string): Promise<number> {
  const balance = await db.creditBalance.findUnique({
    where: { orgId },
    select: { balance: true },
  });
  return balance?.balance ?? 0;
}

// ---------- 크레딧 충전 ----------

export async function addCredits(
  orgId: string,
  amount: number,
  type: CreditTxType,
  reason: string,
  referenceId?: string,
): Promise<{ balance: number }> {
  const result = await db.$transaction(async (tx) => {
    const creditBalance = await tx.creditBalance.upsert({
      where: { orgId },
      create: { orgId, balance: amount },
      update: { balance: { increment: amount } },
    });

    await tx.creditTransaction.create({
      data: {
        creditBalanceId: creditBalance.id,
        type,
        amount,
        reason,
        referenceId,
      },
    });

    return creditBalance;
  });

  return { balance: result.balance };
}

// ---------- 크레딧 차감 ----------

export async function deductCredits(
  orgId: string,
  amount: number,
  type: CreditTxType,
  reason: string,
  referenceId?: string,
): Promise<{ success: boolean; balance: number; error?: string }> {
  const current = await getBalance(orgId);

  if (current < amount) {
    return {
      success: false,
      balance: current,
      error: `크레딧 부족 (보유: ${current}, 필요: ${amount})`,
    };
  }

  const result = await db.$transaction(async (tx) => {
    const creditBalance = await tx.creditBalance.update({
      where: { orgId },
      data: {
        balance: { decrement: amount },
        totalUsed: { increment: amount },
      },
    });

    await tx.creditTransaction.create({
      data: {
        creditBalanceId: creditBalance.id,
        type,
        amount: -amount,
        reason,
        referenceId,
      },
    });

    return creditBalance;
  });

  return { success: true, balance: result.balance };
}

// ---------- 거래 내역 조회 ----------

export async function getTransactions(
  orgId: string,
  page: number = 1,
  limit: number = 20,
): Promise<{
  items: {
    id: string;
    type: CreditTxType;
    amount: number;
    reason: string;
    referenceId: string | null;
    createdAt: Date;
  }[];
  total: number;
}> {
  const creditBalance = await db.creditBalance.findUnique({
    where: { orgId },
    select: { id: true },
  });

  if (!creditBalance) {
    return { items: [], total: 0 };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    db.creditTransaction.findMany({
      where: { creditBalanceId: creditBalance.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        amount: true,
        reason: true,
        referenceId: true,
        createdAt: true,
      },
    }),
    db.creditTransaction.count({
      where: { creditBalanceId: creditBalance.id },
    }),
  ]);

  return { items, total };
}

// ============================================================
// Trial 시작 — 7일 무료 체험 + 보너스 크레딧
// ============================================================

const TRIAL_DAYS = 7;
const TRIAL_BONUS_CREDITS = 5; // 5회 생성 크레딧

export async function startTrial(orgId: string, plan: string): Promise<{
  success: boolean;
  trialEnd: Date;
  credits: number;
  error?: string;
}> {
  // 이미 트라이얼 사용 여부 확인
  const existingTrial = await db.subscription.findFirst({
    where: { orgId, isTrial: true },
  });

  if (existingTrial) {
    return {
      success: false,
      trialEnd: new Date(),
      credits: 0,
      error: '이미 무료 체험을 사용하셨습니다',
    };
  }

  const now = new Date();
  const trialEnd = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  await db.$transaction(async (tx) => {
    // 트라이얼 구독 생성
    await tx.subscription.create({
      data: {
        orgId,
        status: 'ACTIVE',
        plan: plan as 'PRO' | 'BUSINESS',
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
        isTrial: true,
        trialEnd,
      },
    });

    // 조직 플랜 업그레이드
    const planConfig = await tx.plan.findUnique({ where: { id: plan } });
    await tx.organization.update({
      where: { id: orgId },
      data: {
        plan: plan as 'PRO' | 'BUSINESS',
        quotaLimit: planConfig?.quotaLimit ?? 10,
      },
    });

    // 보너스 크레딧 지급
    const creditBalance = await tx.creditBalance.upsert({
      where: { orgId },
      create: { orgId, balance: TRIAL_BONUS_CREDITS },
      update: { balance: { increment: TRIAL_BONUS_CREDITS } },
    });

    await tx.creditTransaction.create({
      data: {
        creditBalanceId: creditBalance.id,
        type: 'TRIAL_BONUS',
        amount: TRIAL_BONUS_CREDITS,
        reason: `${plan} 무료 체험 시작 — ${TRIAL_BONUS_CREDITS}회 생성 크레딧`,
      },
    });
  });

  return {
    success: true,
    trialEnd,
    credits: TRIAL_BONUS_CREDITS,
  };
}
