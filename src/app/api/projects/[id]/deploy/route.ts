import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/get-user-id';
import { db } from '@/lib/db';
import { getOrgUsage, checkDeployQuota } from '@/lib/billing';
import { runDeploy, rollbackDeploy, getDeployHistory } from '@/engine/11-deploy';
import { sendDeploySuccess, getOrgOwnerEmail } from '@/lib/email';

// ============================================================
// 프로젝트 배포 API
// GET    /api/projects/[id]/deploy — 배포 이력 조회
// POST   /api/projects/[id]/deploy — 배포 실행 또는 미리보기 토큰 생성
// PUT    /api/projects/[id]/deploy — 롤백 (특정 버전으로 되돌리기)
// ============================================================

async function getOrgId(userId: string): Promise<string | null> {
  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });
  return membership?.orgId ?? null;
}

// GET — 배포 이력
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 });

  const { id } = await params;
  const orgId = await getOrgId(userId);
  if (!orgId) return NextResponse.json({ error: '조직 없음' }, { status: 403 });

  // 프로젝트 소유 확인
  const project = await db.project.findFirst({
    where: { id, orgId, deletedAt: null },
    select: { id: true, isDeployed: true, deployedAt: true, slug: true, previewToken: true },
  });

  if (!project) return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });

  const history = await getDeployHistory(id);

  return NextResponse.json({
    isDeployed: project.isDeployed,
    deployedAt: project.deployedAt,
    slug: project.slug,
    previewToken: project.previewToken,
    previewUrl: project.previewToken ? `/preview/${project.previewToken}` : null,
    history,
  });
}

// POST — 배포 실행 또는 미리보기 토큰 생성
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 });

  const { id } = await params;
  const orgId = await getOrgId(userId);
  if (!orgId) return NextResponse.json({ error: '조직 없음' }, { status: 403 });

  // action: 'deploy' (기본) | 'preview'
  let action = 'deploy';
  try {
    const body = (await req.json()) as { action?: string };
    if (body.action) action = body.action;
  } catch {
    // body 없으면 기본값 deploy
  }

  // 미리보기 토큰 생성
  if (action === 'preview') {
    const token = randomBytes(16).toString('hex');
    await db.project.update({
      where: { id },
      data: { previewToken: token },
    });
    return NextResponse.json({
      previewToken: token,
      previewUrl: `/preview/${token}`,
    });
  }

  // 배포 쿼터 체크
  const usage = await getOrgUsage(orgId);
  const deployCheck = checkDeployQuota(usage);
  if (!deployCheck.allowed) {
    return NextResponse.json({ error: deployCheck.reason }, { status: 403 });
  }

  try {
    const result = await runDeploy({ projectId: id, orgId });

    // 배포 성공 이메일 (비동기, 실패해도 무시)
    const projectInfo = await db.project.findFirst({
      where: { id },
      select: { name: true },
    });
    const ownerEmail = await getOrgOwnerEmail(orgId);
    if (ownerEmail && projectInfo) {
      sendDeploySuccess(
        ownerEmail,
        projectInfo.name,
        result.slug,
        result.version ?? 1,
      ).catch(() => {});
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : '배포 실패';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// PUT — 롤백
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: '인증 필요' }, { status: 401 });

  const { id } = await params;
  const orgId = await getOrgId(userId);
  if (!orgId) return NextResponse.json({ error: '조직 없음' }, { status: 403 });

  const body = (await req.json()) as { version: number };
  if (!body.version || typeof body.version !== 'number') {
    return NextResponse.json({ error: '롤백 대상 버전 번호 필요' }, { status: 400 });
  }

  try {
    const result = await rollbackDeploy(id, orgId, body.version);
    return NextResponse.json({ success: true, rolledBackTo: body.version, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : '롤백 실패';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
