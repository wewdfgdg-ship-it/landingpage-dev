import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

// ============================================================
// 관리자 요금제 관리 API
// GET  /api/admin/plans — 전체 플랜 목록 (비활성 포함)
// POST /api/admin/plans — 플랜 생성/수정 (upsert)
// ============================================================

export async function GET(): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const plans = await db.plan.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json({ plans });
}

export async function POST(req: Request): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const body = await req.json();
  const {
    id,
    name,
    description,
    price,
    yearlyPrice,
    quotaLimit,
    features,
    generateLimit,
    deployLimit,
    exportEnabled,
    customDomainEnabled,
    analyticsEnabled,
    abTestEnabled,
    sortOrder,
    isActive,
  } = body;

  if (!id || !name) {
    return NextResponse.json({ error: 'id, name 필수' }, { status: 400 });
  }

  const data = {
    name: name as string,
    description: (description as string) ?? '',
    price: Number(price) || 0,
    yearlyPrice: Number(yearlyPrice) || 0,
    quotaLimit: Number(quotaLimit) || 3,
    features: features ?? [],
    generateLimit: Number(generateLimit) ?? 5,
    deployLimit: Number(deployLimit) ?? 1,
    exportEnabled: Boolean(exportEnabled ?? true),
    customDomainEnabled: Boolean(customDomainEnabled ?? false),
    analyticsEnabled: Boolean(analyticsEnabled ?? true),
    abTestEnabled: Boolean(abTestEnabled ?? false),
    sortOrder: Number(sortOrder) ?? 0,
    isActive: Boolean(isActive ?? true),
  };

  const plan = await db.plan.upsert({
    where: { id: id as string },
    update: data,
    create: { id: id as string, ...data },
  });

  return NextResponse.json({ plan });
}
