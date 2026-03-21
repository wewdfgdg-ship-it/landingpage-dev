import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/get-user-id';
import { db } from '@/lib/db';
import { getOrgUsage, checkGenerateQuota } from '@/lib/billing';
import { runPipeline } from '@/engine/pipeline';

// ============================================================
// 랜딩페이지 동기 생성 API
// POST /api/projects/[id]/generate
// SSE 불필요한 경우 (Worker, 서버 간 호출 등)
// ============================================================

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;

  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
  });

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  const usage = await getOrgUsage(membership.orgId);
  const quotaCheck = checkGenerateQuota(usage);
  if (!quotaCheck.allowed) {
    return NextResponse.json({ error: quotaCheck.reason }, { status: 403 });
  }

  if (project.status !== 'DRAFT' && project.status !== 'GENERATED') {
    return NextResponse.json(
      { error: '현재 상태에서 생성할 수 없습니다' },
      { status: 400 },
    );
  }

  await db.project.update({
    where: { id },
    data: { status: 'GENERATING' },
  });

  try {
    const result = await runPipeline(id);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    await db.project.update({
      where: { id },
      data: { status: 'DRAFT' },
    });

    const message = error instanceof Error ? error.message : '생성 실패';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
