import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/get-user-id';
import { db } from '@/lib/db';
import { getBalance, getTransactions } from '@/lib/credit';

// ============================================================
// 크레딧 조회 API
// GET /api/billing/credits — 잔액 + 거래 내역
// ============================================================

export async function GET(req: Request): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 404 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const limit = parseInt(url.searchParams.get('limit') ?? '20');

  const [balance, transactions] = await Promise.all([
    getBalance(membership.orgId),
    getTransactions(membership.orgId, page, limit),
  ]);

  return NextResponse.json({
    balance,
    transactions: transactions.items,
    total: transactions.total,
    page,
    totalPages: Math.ceil(transactions.total / limit),
  });
}
