import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/get-user-id';
import { db } from '@/lib/db';

// ============================================================
// 분석 대시보드 API
// GET /api/projects/[id]/analytics?days=7
// ============================================================

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const url = new URL(req.url);
  const days = Math.min(Math.max(parseInt(url.searchParams.get('days') ?? '7', 10), 1), 90);

  const since = new Date();
  since.setDate(since.getDate() - days);

  // 권한 확인
  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  // 병렬 조회
  const [dailyAnalytics, sections, diagnoses] = await Promise.all([
    // 일일 분석
    db.dailyAnalytics.findMany({
      where: { projectId: id, date: { gte: since } },
      orderBy: { date: 'asc' },
    }),

    // 섹션별 분석 (Section + SectionAnalytics)
    db.section.findMany({
      where: { projectId: id },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        order: true,
        role: true,
        type: true,
        headline: true,
        sectionAnalytics: {
          where: { date: { gte: since } },
          orderBy: { date: 'asc' },
        },
      },
    }),

    // 진단 로그
    db.diagnosisLog.findMany({
      where: { projectId: id, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  // 일일 데이터 포맷
  const daily = dailyAnalytics.map((a) => ({
    date: a.date,
    totalVisits: a.totalVisits,
    uniqueVisitors: a.uniqueVisitors,
    totalConversions: a.totalConversions,
    conversionRate: a.conversionRate,
    avgScrollDepth: a.avgScrollDepth,
    avgTimeOnPage: a.avgTimeOnPage,
    bounceRate: a.bounceRate,
    sourceBreakdown: a.sourceBreakdown as Record<string, number> | null,
    deviceBreakdown: a.deviceBreakdown as Record<string, number> | null,
  }));

  // 소스/디바이스 집계
  const sourceTotals: Record<string, number> = {};
  const deviceTotals: Record<string, number> = {};

  for (const d of daily) {
    if (d.sourceBreakdown) {
      for (const [key, val] of Object.entries(d.sourceBreakdown)) {
        sourceTotals[key] = (sourceTotals[key] ?? 0) + val;
      }
    }
    if (d.deviceBreakdown) {
      for (const [key, val] of Object.entries(d.deviceBreakdown)) {
        deviceTotals[key] = (deviceTotals[key] ?? 0) + val;
      }
    }
  }

  // 섹션 히트맵 데이터
  const sectionHeatmap = sections.map((s) => {
    const analytics = s.sectionAnalytics;
    const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
    const totalCtaClicks = analytics.reduce((sum, a) => sum + a.ctaClicks, 0);
    const avgDwellTime = analytics.length > 0
      ? analytics.reduce((sum, a) => sum + a.avgDwellTime, 0) / analytics.length
      : 0;
    const avgExitRate = analytics.length > 0
      ? analytics.reduce((sum, a) => sum + a.exitRate, 0) / analytics.length
      : 0;

    return {
      sectionId: s.id,
      order: s.order,
      role: s.role,
      type: s.type,
      headline: s.headline,
      totalImpressions,
      totalCtaClicks,
      avgDwellTime: Math.round(avgDwellTime * 10) / 10,
      avgExitRate: Math.round(avgExitRate * 10) / 10,
    };
  });

  // 요약 통계
  const summary = {
    totalVisits: daily.reduce((s, d) => s + d.totalVisits, 0),
    totalConversions: daily.reduce((s, d) => s + d.totalConversions, 0),
    avgConversionRate: daily.length > 0
      ? Math.round(daily.reduce((s, d) => s + d.conversionRate, 0) / daily.length * 100) / 100
      : 0,
    avgBounceRate: daily.length > 0
      ? Math.round(daily.reduce((s, d) => s + d.bounceRate, 0) / daily.length * 100) / 100
      : 0,
    avgScrollDepth: daily.length > 0
      ? Math.round(daily.reduce((s, d) => s + d.avgScrollDepth, 0) / daily.length * 10) / 10
      : 0,
    avgTimeOnPage: daily.length > 0
      ? Math.round(daily.reduce((s, d) => s + d.avgTimeOnPage, 0) / daily.length)
      : 0,
  };

  return NextResponse.json({
    summary,
    daily,
    sectionHeatmap,
    sourceTotals,
    deviceTotals,
    diagnoses: diagnoses.map((d) => ({
      id: d.id,
      type: d.diagnosisType,
      severity: d.severity,
      details: d.details,
      prescriptionLevel: d.prescriptionLevel,
      prescription: d.prescription,
      applied: d.applied,
      createdAt: d.createdAt,
    })),
  });
}
