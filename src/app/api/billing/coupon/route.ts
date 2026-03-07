import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { validateCoupon } from '@/lib/coupon';
import type { PlanType } from '@/generated/prisma/client';

// ============================================================
// 쿠폰 검증 API — 결제 전 할인 금액 확인
// POST /api/billing/coupon
// ============================================================

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const body = (await req.json()) as {
    code: string;
    plan: PlanType;
    amount: number;
  };

  if (!body.code || !body.plan || !body.amount) {
    return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
  }

  // 조직 찾기
  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 404 });
  }

  const result = await validateCoupon(body.code, membership.orgId, body.plan, body.amount);

  if (!result.valid) {
    return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    couponId: result.couponId,
    couponName: result.couponName,
    discountAmount: result.discountAmount,
    finalAmount: body.amount - (result.discountAmount ?? 0),
  });
}
