import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/get-user-id';
import { db } from '@/lib/db';
import { getActiveTests, concludeTest } from '@/engine/12-learning-loop';
import {
  calculateMinSampleSize,
  estimateTestDuration,
  shouldStopEarly,
} from '@/lib/ab-routing';

// ============================================================
// A/B 테스트 API
// GET   — 활성 테스트 목록 + 통계 요약
// POST  — 새 A/B 테스트 생성
// PATCH — 테스트 종료 (수동 또는 조기 종료)
// ============================================================

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const tests = await getActiveTests(id);

  // 활성 테스트에 통계 정보 보강
  const enrichedActive = await Promise.all(
    tests.map(async (t) => {
      const dbTest = await db.aBTest.findUnique({ where: { id: t.testId } });
      if (!dbTest) return t;

      const totalSample = t.sampleSize.control + t.sampleSize.variant;
      const requiredTotal = dbTest.minSampleSize * 2;
      const fractionComplete = requiredTotal > 0 ? totalSample / requiredTotal : 0;

      // 조기 종료 가능 여부
      const canStopEarly = shouldStopEarly(t.confidence, fractionComplete);

      // 예상 남은 기간 (최근 7일 평균 방문자)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const recentAnalytics = await db.dailyAnalytics.findMany({
        where: { projectId: id, date: { gte: weekAgo } },
        select: { totalVisits: true },
      });

      const avgDailyVisitors =
        recentAnalytics.length > 0
          ? recentAnalytics.reduce((sum, a) => sum + a.totalVisits, 0) / recentAnalytics.length
          : 0;

      const remainingSample = Math.max(0, dbTest.minSampleSize - Math.min(t.sampleSize.control, t.sampleSize.variant));
      const estimatedDaysLeft = avgDailyVisitors > 0
        ? estimateTestDuration(remainingSample, avgDailyVisitors, 50)
        : null;

      return {
        ...t,
        minSampleSize: dbTest.minSampleSize,
        fractionComplete: Math.min(fractionComplete, 1),
        canStopEarly,
        estimatedDaysLeft,
        avgDailyVisitors: Math.round(avgDailyVisitors),
        startedAt: dbTest.startedAt,
      };
    }),
  );

  // 종료된 테스트
  const concluded = await db.aBTest.findMany({
    where: { projectId: id, status: 'CONCLUDED' },
    orderBy: { concludedAt: 'desc' },
    take: 10,
  });

  return NextResponse.json({
    active: enrichedActive,
    concluded: concluded.map((t) => ({
      testId: t.id,
      status: 'concluded',
      controlRate: t.controlConversionRate,
      variantRate: t.variantConversionRate,
      winner: t.winner,
      confidence: t.confidence,
      concludedAt: t.concludedAt,
      startedAt: t.startedAt,
    })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // 프로젝트 확인
  const membership = await db.membership.findFirst({
    where: { userId },
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

  // 최소 샘플 크기 자동 계산 (현재 전환율 기반)
  const currentRate = latestVersion.conversionRate / 100; // DB는 %
  const mde = body.mde ?? 0.02; // 기본 MDE: 2%p
  const autoMinSample = currentRate > 0
    ? calculateMinSampleSize(currentRate, mde)
    : 100;
  const minSampleSize = body.minSampleSize ?? Math.min(autoMinSample, 10000);

  // variant 버전 생성
  const variantVersion = await db.pageVersion.create({
    data: {
      projectId: id,
      version: latestVersion.version + 1,
      label: `A/B 변형 v${latestVersion.version + 1}`,
      htmlContent: latestVersion.htmlContent,
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
      minSampleSize,
    },
  });

  // 예상 기간 계산
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentAnalytics = await db.dailyAnalytics.findMany({
    where: { projectId: id, date: { gte: weekAgo } },
    select: { totalVisits: true },
  });
  const avgDailyVisitors =
    recentAnalytics.length > 0
      ? recentAnalytics.reduce((sum, a) => sum + a.totalVisits, 0) / recentAnalytics.length
      : 0;
  const estimatedDays = avgDailyVisitors > 0
    ? estimateTestDuration(minSampleSize, avgDailyVisitors, body.trafficSplit ?? 50)
    : null;

  return NextResponse.json({
    testId: test.id,
    controlVersionId: latestVersion.id,
    variantVersionId: variantVersion.id,
    status: 'RUNNING',
    minSampleSize,
    estimatedDays,
    currentConversionRate: latestVersion.conversionRate,
  });
}

// PATCH — A/B 테스트 종료
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  await params;
  const body = await req.json();

  if (!body.testId) {
    return NextResponse.json({ error: 'testId 필요' }, { status: 400 });
  }

  const result = await concludeTest(body.testId);
  return NextResponse.json(result);
}
