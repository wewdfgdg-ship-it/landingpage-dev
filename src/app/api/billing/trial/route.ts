import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/get-user-id';
import { db } from '@/lib/db';
import { startTrial } from '@/lib/credit';

// ============================================================
// Trial 시작 API
// POST /api/billing/trial
// ============================================================

export async function POST(req: Request): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const body = (await req.json()) as { plan: string };

  if (!body.plan || !['PRO', 'BUSINESS'].includes(body.plan)) {
    return NextResponse.json({ error: 'PRO 또는 BUSINESS 플랜만 체험 가능합니다' }, { status: 400 });
  }

  // 조직 찾기
  const membership = await db.membership.findFirst({
    where: { userId, role: 'OWNER' },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 소유자만 체험을 시작할 수 있습니다' }, { status: 403 });
  }

  // 현재 FREE 플랜인지 확인
  const org = await db.organization.findUnique({
    where: { id: membership.orgId },
    select: { plan: true },
  });

  if (org?.plan !== 'FREE') {
    return NextResponse.json({ error: '이미 유료 플랜을 사용 중입니다' }, { status: 400 });
  }

  const result = await startTrial(membership.orgId, body.plan);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    trialEnd: result.trialEnd.toISOString(),
    bonusCredits: result.credits,
    message: `${body.plan} 플랜 7일 무료 체험이 시작되었습니다. ${result.credits}회 생성 크레딧이 지급되었습니다.`,
  });
}
