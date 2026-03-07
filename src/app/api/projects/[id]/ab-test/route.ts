import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getActiveTests, concludeTest } from '@/engine/12-learning-loop';

// ============================================================
// A/B 테스트 API
// GET  — 활성 테스트 목록 조회
// POST — 새 A/B 테스트 생성
// ============================================================

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const tests = await getActiveTests(id);

  // 종료된 테스트도 포함
  const concluded = await db.aBTest.findMany({
    where: { projectId: id, status: 'CONCLUDED' },
    orderBy: { concludedAt: 'desc' },
    take: 10,
  });

  return NextResponse.json({
    active: tests,
    concluded: concluded.map((t) => ({
      testId: t.id,
      status: 'concluded',
      controlRate: t.controlConversionRate,
      variantRate: t.variantConversionRate,
      winner: t.winner,
      confidence: t.confidence,
      concludedAt: t.concludedAt,
    })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // 프로젝트 확인
  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null, status: 'DEPLOYED' },
  });

  if (!project) {
    return NextResponse.json(
      { error: '배포된 프로젝트에서만 A/B 테스트를 생성할 수 있습니다' },
      { status: 400 },
    );
  }

  // 이미 활성 테스트가 있는지 확인
  const existingTest = await db.aBTest.findFirst({
    where: { projectId: id, status: 'RUNNING' },
  });

  if (existingTest) {
    return NextResponse.json(
      { error: '이미 진행 중인 A/B 테스트가 있습니다' },
      { status: 409 },
    );
  }

  // 현재 버전을 control로, 새 버전을 variant로 생성
  const latestVersion = await db.pageVersion.findFirst({
    where: { projectId: id },
    orderBy: { version: 'desc' },
  });

  if (!latestVersion) {
    return NextResponse.json(
      { error: '페이지 버전이 없습니다' },
      { status: 400 },
    );
  }

  // variant 버전 생성 (카피/레이아웃 변형은 향후 자동 생성)
  const variantVersion = await db.pageVersion.create({
    data: {
      projectId: id,
      version: latestVersion.version + 1,
      label: `A/B 변형 ${latestVersion.version + 1}`,
      htmlContent: latestVersion.htmlContent, // 향후 자동 변형
      sectionSnapshot: latestVersion.sectionSnapshot
        ? JSON.parse(JSON.stringify(latestVersion.sectionSnapshot))
        : undefined,
      trafficWeight: body.trafficSplit ?? 50,
    },
  });

  // control 트래픽 비율 조정
  await db.pageVersion.update({
    where: { id: latestVersion.id },
    data: { trafficWeight: 100 - (body.trafficSplit ?? 50) },
  });

  // A/B 테스트 생성
  const test = await db.aBTest.create({
    data: {
      projectId: id,
      controlVersionId: latestVersion.id,
      variantVersionId: variantVersion.id,
      optimizationLevel: body.optimizationLevel ?? 1,
      targetMetric: body.targetMetric ?? 'conversion_rate',
      minSampleSize: body.minSampleSize ?? 100,
    },
  });

  return NextResponse.json({
    testId: test.id,
    controlVersionId: latestVersion.id,
    variantVersionId: variantVersion.id,
    status: 'RUNNING',
  });
}

// PATCH — A/B 테스트 종료
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  await params; // consume params
  const body = await req.json();

  if (!body.testId) {
    return NextResponse.json({ error: 'testId 필요' }, { status: 400 });
  }

  const result = await concludeTest(body.testId);
  return NextResponse.json(result);
}
