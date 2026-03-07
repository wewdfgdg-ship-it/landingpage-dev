import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getOrgUsage, checkDeployQuota } from '@/lib/billing';
import { runDeploy } from '@/engine/11-deploy';

// ============================================================
// 프로젝트 배포 API
// POST /api/projects/[id]/deploy
// ============================================================

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  // 배포 쿼터 체크
  const usage = await getOrgUsage(membership.orgId);
  const deployCheck = checkDeployQuota(usage);
  if (!deployCheck.allowed) {
    return NextResponse.json({ error: deployCheck.reason }, { status: 403 });
  }

  try {
    const result = await runDeploy({
      projectId: id,
      orgId: membership.orgId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : '배포 실패';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
