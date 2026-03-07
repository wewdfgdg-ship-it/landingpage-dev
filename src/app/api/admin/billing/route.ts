import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

// ============================================================
// 관리자 빌링 대시보드 API
// GET /api/admin/billing
// ?tab=overview|subscriptions|payments
// &page=1&limit=20
// &status=ACTIVE|PAST_DUE|...
// &plan=FREE|PRO|BUSINESS
// ============================================================

export async function GET(req: Request): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const url = new URL(req.url);
  const tab = url.searchParams.get('tab') ?? 'overview';
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '20')));
  const skip = (page - 1) * limit;

  if (tab === 'overview') {
    return NextResponse.json(await getOverview());
  }

  if (tab === 'subscriptions') {
    const status = url.searchParams.get('status');
    const plan = url.searchParams.get('plan');
    return NextResponse.json(await getSubscriptions({ status, plan, skip, limit }));
  }

  if (tab === 'payments') {
    const status = url.searchParams.get('status');
    return NextResponse.json(await getPayments({ status, skip, limit }));
  }

  return NextResponse.json({ error: '잘못된 탭' }, { status: 400 });
}

// ============================================================
// 매출 개요
// ============================================================

async function getOverview() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalRevenue,
    monthlyRevenue,
    prevMonthRevenue,
    activeSubscriptions,
    planDistribution,
    recentPayments,
  ] = await Promise.all([
    // 전체 매출
    db.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    // 이번 달 매출
    db.payment.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
    // 지난 달 매출
    db.payment.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: prevMonthStart, lt: monthStart },
      },
      _sum: { amount: true },
    }),
    // 활성 구독 수
    db.subscription.count({ where: { status: 'ACTIVE' } }),
    // 플랜별 분포
    db.organization.groupBy({
      by: ['plan'],
      _count: { id: true },
    }),
    // 최근 결제 5건
    db.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { org: { select: { name: true } } },
    }),
  ]);

  const monthlyAmount = monthlyRevenue._sum.amount ?? 0;
  const prevMonthAmount = prevMonthRevenue._sum.amount ?? 0;
  const growthRate =
    prevMonthAmount > 0
      ? Math.round(((monthlyAmount - prevMonthAmount) / prevMonthAmount) * 100)
      : 0;

  return {
    totalRevenue: totalRevenue._sum.amount ?? 0,
    monthlyRevenue: monthlyAmount,
    prevMonthRevenue: prevMonthAmount,
    growthRate,
    activeSubscriptions,
    planDistribution: planDistribution.map((p) => ({
      plan: p.plan,
      count: p._count.id,
    })),
    recentPayments: recentPayments.map((p) => ({
      id: p.id,
      orgName: p.org.name,
      amount: p.amount,
      status: p.status,
      createdAt: p.createdAt,
    })),
  };
}

// ============================================================
// 구독 목록
// ============================================================

interface ListParams {
  status: string | null;
  plan?: string | null;
  skip: number;
  limit: number;
}

async function getSubscriptions({ status, plan, skip, limit }: ListParams) {
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (plan) where.plan = plan;

  const [items, total] = await Promise.all([
    db.subscription.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        org: { select: { id: true, name: true, plan: true } },
      },
    }),
    db.subscription.count({ where }),
  ]);

  return {
    items: items.map((s) => ({
      id: s.id,
      orgId: s.org.id,
      orgName: s.org.name,
      plan: s.plan,
      status: s.status,
      currentPeriodStart: s.currentPeriodStart,
      currentPeriodEnd: s.currentPeriodEnd,
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
      cancelReason: s.cancelReason,
      createdAt: s.createdAt,
    })),
    total,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// 결제 내역
// ============================================================

async function getPayments({ status, skip, limit }: Omit<ListParams, 'plan'>) {
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    db.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        org: { select: { id: true, name: true } },
      },
    }),
    db.payment.count({ where }),
  ]);

  return {
    items: items.map((p) => ({
      id: p.id,
      orgId: p.org.id,
      orgName: p.org.name,
      amount: p.amount,
      status: p.status,
      provider: p.provider,
      externalId: p.externalId,
      metadata: p.metadata,
      createdAt: p.createdAt,
    })),
    total,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit),
  };
}
