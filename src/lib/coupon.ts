import { db } from '@/lib/db';
import type { PlanType } from '@/generated/prisma/client';

// ============================================================
// 쿠폰 검증 & 적용
// ============================================================

interface CouponValidation {
  valid: boolean;
  error?: string;
  discountAmount?: number;
  couponId?: string;
  couponName?: string;
}

export async function validateCoupon(
  code: string,
  orgId: string,
  plan: PlanType,
  amount: number,
): Promise<CouponValidation> {
  const coupon = await db.coupon.findUnique({
    where: { code: code.toUpperCase().trim() },
    include: {
      redemptions: { where: { orgId } },
    },
  });

  if (!coupon) {
    return { valid: false, error: '유효하지 않은 쿠폰 코드입니다' };
  }

  if (!coupon.isActive) {
    return { valid: false, error: '비활성화된 쿠폰입니다' };
  }

  // 기간 검증
  const now = new Date();
  if (now < coupon.startsAt) {
    return { valid: false, error: '아직 사용할 수 없는 쿠폰입니다' };
  }
  if (coupon.expiresAt && now > coupon.expiresAt) {
    return { valid: false, error: '만료된 쿠폰입니다' };
  }

  // 사용 횟수 검증
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: '사용 한도를 초과한 쿠폰입니다' };
  }

  // 조직당 사용 횟수 검증
  if (coupon.maxUsesPerOrg > 0 && coupon.redemptions.length >= coupon.maxUsesPerOrg) {
    return { valid: false, error: '이미 사용한 쿠폰입니다' };
  }

  // 적용 가능 플랜 검증
  if (coupon.applicablePlans.length > 0 && !coupon.applicablePlans.includes(plan)) {
    return { valid: false, error: '이 요금제에 적용할 수 없는 쿠폰입니다' };
  }

  // 최소 금액 검증
  if (amount < coupon.minAmount) {
    return {
      valid: false,
      error: `최소 결제 금액 ${coupon.minAmount.toLocaleString()}원 이상이어야 합니다`,
    };
  }

  // 할인 금액 계산
  let discountAmount: number;
  if (coupon.discountType === 'PERCENT') {
    discountAmount = Math.floor(amount * (coupon.discountValue / 100));
  } else {
    discountAmount = Math.min(coupon.discountValue, amount);
  }

  return {
    valid: true,
    discountAmount,
    couponId: coupon.id,
    couponName: coupon.name,
  };
}

export async function redeemCoupon(
  couponId: string,
  orgId: string,
  discountAmount: number,
): Promise<void> {
  await db.$transaction([
    db.couponRedemption.create({
      data: {
        couponId,
        orgId,
        amount: discountAmount,
      },
    }),
    db.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    }),
  ]);
}
