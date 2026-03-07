import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { addCredits, deductCredits } from '@/lib/credit';

// ============================================================
// 관리자 크레딧 수동 조정 API
// POST /api/admin/credits
// ============================================================

export async function POST(req: Request): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const body = (await req.json()) as {
    orgId: string;
    amount: number;
    reason: string;
  };

  if (!body.orgId || !body.amount || !body.reason) {
    return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
  }

  if (body.amount > 0) {
    const result = await addCredits(body.orgId, body.amount, 'ADMIN', body.reason);
    return NextResponse.json({ success: true, balance: result.balance });
  }

  if (body.amount < 0) {
    const result = await deductCredits(body.orgId, Math.abs(body.amount), 'ADMIN', body.reason);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, balance: result.balance });
  }

  return NextResponse.json({ error: 'amount는 0이 아닌 값이어야 합니다' }, { status: 400 });
}
