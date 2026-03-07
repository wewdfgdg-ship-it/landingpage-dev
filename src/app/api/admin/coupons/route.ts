import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import type { DiscountType, PlanType } from '@/generated/prisma/client';

// ============================================================
// 관리자 쿠폰 CRUD API
// GET  /api/admin/coupons — 전체 쿠폰 목록
// POST /api/admin/coupons — 쿠폰 생성/수정
// ============================================================

export async function GET(req: Request): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const limit = parseInt(url.searchParams.get('limit') ?? '20');
  const skip = (page - 1) * limit;

  const [coupons, total] = await Promise.all([
    db.coupon.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { redemptions: true } },
      },
    }),
    db.coupon.count(),
  ]);

  return NextResponse.json({
    items: coupons.map((c) => ({
      ...c,
      redemptionCount: c._count.redemptions,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

interface CouponCreateBody {
  id?: string;
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  applicablePlans?: PlanType[];
  minAmount?: number;
  maxUses?: number;
  maxUsesPerOrg?: number;
  startsAt?: string;
  expiresAt?: string;
  isActive?: boolean;
}

export async function POST(req: Request): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const body = (await req.json()) as CouponCreateBody;
  const code = body.code.toUpperCase().trim();

  if (!code || !body.name || !body.discountValue) {
    return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
  }

  if (body.id) {
    // 수정
    const coupon = await db.coupon.update({
      where: { id: body.id },
      data: {
        code,
        name: body.name,
        description: body.description,
        discountType: body.discountType,
        discountValue: body.discountValue,
        applicablePlans: body.applicablePlans ?? [],
        minAmount: body.minAmount ?? 0,
        maxUses: body.maxUses ?? 0,
        maxUsesPerOrg: body.maxUsesPerOrg ?? 1,
        startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(coupon);
  }

  // 중복 검사
  const existing = await db.coupon.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: '이미 존재하는 쿠폰 코드입니다' }, { status: 409 });
  }

  // 생성
  const coupon = await db.coupon.create({
    data: {
      code,
      name: body.name,
      description: body.description,
      discountType: body.discountType,
      discountValue: body.discountValue,
      applicablePlans: body.applicablePlans ?? [],
      minAmount: body.minAmount ?? 0,
      maxUses: body.maxUses ?? 0,
      maxUsesPerOrg: body.maxUsesPerOrg ?? 1,
      startsAt: body.startsAt ? new Date(body.startsAt) : new Date(),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}
