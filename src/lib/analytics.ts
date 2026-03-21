import { db } from '@/lib/db';

// ============================================================
// 타입
// ============================================================

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DailyStat {
  date: string;
  visits: number;
  uniqueVisitors: number;
  conversions: number;
  conversionRate: number;
  avgScrollDepth: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface ProjectAnalyticsSummary {
  totalVisits: number;
  totalUniqueVisitors: number;
  totalConversions: number;
  overallConversionRate: number;
  avgScrollDepth: number;
  avgTimeOnPage: number;
  avgBounceRate: number;
  dailyStats: DailyStat[];
}

export interface SectionStat {
  sectionId: string;
  sectionType: string;
  sectionOrder: number;
  totalImpressions: number;
  avgDwellTime: number;
  avgExitRate: number;
  totalCtaClicks: number;
}

export interface ConversionFunnel {
  sectionOrder: number;
  sectionType: string;
  impressions: number;
  dropOffRate: number;
}

// ============================================================
// 트래킹 헬퍼 — 일별 분석 데이터 기록
// ============================================================

export async function trackPageView(
  projectId: string,
  data: {
    isUnique: boolean;
    source?: string;
    device?: string;
  },
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await db.dailyAnalytics.upsert({
    where: {
      projectId_date: { projectId, date: today },
    },
    create: {
      projectId,
      date: today,
      totalVisits: 1,
      uniqueVisitors: data.isUnique ? 1 : 0,
    },
    update: {
      totalVisits: { increment: 1 },
      ...(data.isUnique ? { uniqueVisitors: { increment: 1 } } : {}),
    },
  });
}

export async function trackConversion(projectId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await db.dailyAnalytics.findUnique({
    where: { projectId_date: { projectId, date: today } },
  });

  if (!record) return;

  const newConversions = record.totalConversions + 1;
  const newRate = record.totalVisits > 0
    ? (newConversions / record.totalVisits) * 100
    : 0;

  await db.dailyAnalytics.update({
    where: { projectId_date: { projectId, date: today } },
    data: {
      totalConversions: newConversions,
      conversionRate: newRate,
    },
  });
}

export async function trackEngagement(
  projectId: string,
  data: {
    scrollDepth: number;
    timeOnPage: number;
    bounced: boolean;
  },
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await db.dailyAnalytics.findUnique({
    where: { projectId_date: { projectId, date: today } },
  });

  if (!record) return;

  const visits = record.totalVisits || 1;
  const newAvgScroll =
    (record.avgScrollDepth * (visits - 1) + data.scrollDepth) / visits;
  const newAvgTime =
    (record.avgTimeOnPage * (visits - 1) + data.timeOnPage) / visits;
  const newBounceRate =
    (record.bounceRate * (visits - 1) + (data.bounced ? 100 : 0)) / visits;

  await db.dailyAnalytics.update({
    where: { projectId_date: { projectId, date: today } },
    data: {
      avgScrollDepth: newAvgScroll,
      avgTimeOnPage: newAvgTime,
      bounceRate: newBounceRate,
    },
  });
}

export async function trackSectionView(
  sectionId: string,
  data: {
    dwellTime: number;
    exited: boolean;
    ctaClicked: boolean;
  },
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await db.sectionAnalytics.upsert({
    where: {
      sectionId_date: { sectionId, date: today },
    },
    create: {
      sectionId,
      date: today,
      impressions: 1,
      avgDwellTime: data.dwellTime,
      exitRate: data.exited ? 100 : 0,
      ctaClicks: data.ctaClicked ? 1 : 0,
    },
    update: {
      impressions: { increment: 1 },
      ...(data.ctaClicked ? { ctaClicks: { increment: 1 } } : {}),
    },
  });
}

// ============================================================
// 집계 쿼리 — 프로젝트 분석 요약
// ============================================================

export async function getProjectAnalytics(
  projectId: string,
  range: DateRange,
): Promise<ProjectAnalyticsSummary> {
  const records = await db.dailyAnalytics.findMany({
    where: {
      projectId,
      date: { gte: range.start, lte: range.end },
    },
    orderBy: { date: 'asc' },
  });

  if (records.length === 0) {
    return {
      totalVisits: 0,
      totalUniqueVisitors: 0,
      totalConversions: 0,
      overallConversionRate: 0,
      avgScrollDepth: 0,
      avgTimeOnPage: 0,
      avgBounceRate: 0,
      dailyStats: [],
    };
  }

  const totalVisits = records.reduce((sum, r) => sum + r.totalVisits, 0);
  const totalUniqueVisitors = records.reduce((sum, r) => sum + r.uniqueVisitors, 0);
  const totalConversions = records.reduce((sum, r) => sum + r.totalConversions, 0);

  const daysWithTraffic = records.filter((r) => r.totalVisits > 0);
  const dayCount = daysWithTraffic.length || 1;

  const avgScrollDepth =
    daysWithTraffic.reduce((sum, r) => sum + r.avgScrollDepth, 0) / dayCount;
  const avgTimeOnPage =
    daysWithTraffic.reduce((sum, r) => sum + r.avgTimeOnPage, 0) / dayCount;
  const avgBounceRate =
    daysWithTraffic.reduce((sum, r) => sum + r.bounceRate, 0) / dayCount;

  const dailyStats: DailyStat[] = records.map((r) => ({
    date: r.date.toISOString().split('T')[0],
    visits: r.totalVisits,
    uniqueVisitors: r.uniqueVisitors,
    conversions: r.totalConversions,
    conversionRate: r.conversionRate,
    avgScrollDepth: r.avgScrollDepth,
    avgTimeOnPage: r.avgTimeOnPage,
    bounceRate: r.bounceRate,
  }));

  return {
    totalVisits,
    totalUniqueVisitors,
    totalConversions,
    overallConversionRate: computeConversionRate(totalConversions, totalVisits),
    avgScrollDepth,
    avgTimeOnPage,
    avgBounceRate,
    dailyStats,
  };
}

export async function getSectionAnalytics(
  projectId: string,
  range: DateRange,
): Promise<SectionStat[]> {
  const sections = await db.section.findMany({
    where: { projectId },
    orderBy: { order: 'asc' },
    include: {
      sectionAnalytics: {
        where: { date: { gte: range.start, lte: range.end } },
      },
    },
  });

  return sections.map((section) => {
    const analytics = section.sectionAnalytics;
    const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
    const totalCtaClicks = analytics.reduce((sum, a) => sum + a.ctaClicks, 0);
    const dayCount = analytics.length || 1;
    const avgDwellTime =
      analytics.reduce((sum, a) => sum + a.avgDwellTime, 0) / dayCount;
    const avgExitRate =
      analytics.reduce((sum, a) => sum + a.exitRate, 0) / dayCount;

    return {
      sectionId: section.id,
      sectionType: section.type,
      sectionOrder: section.order,
      totalImpressions,
      avgDwellTime,
      avgExitRate,
      totalCtaClicks,
    };
  });
}

// ============================================================
// 전환율 계산
// ============================================================

/** 전환율 계산 (%) */
export function computeConversionRate(
  conversions: number,
  visits: number,
): number {
  if (visits === 0) return 0;
  return Number(((conversions / visits) * 100).toFixed(2));
}

/** 전환율 변화량 (pp, percentage points) */
export function computeConversionDelta(
  currentRate: number,
  previousRate: number,
): number {
  return Number((currentRate - previousRate).toFixed(2));
}

/** 전환율 개선율 (%) */
export function computeImprovementRate(
  currentRate: number,
  previousRate: number,
): number {
  if (previousRate === 0) return currentRate > 0 ? 100 : 0;
  return Number((((currentRate - previousRate) / previousRate) * 100).toFixed(1));
}

/** 퍼널 드롭오프 분석 */
export function computeConversionFunnel(
  sectionStats: SectionStat[],
): ConversionFunnel[] {
  const sorted = [...sectionStats].sort(
    (a, b) => a.sectionOrder - b.sectionOrder,
  );

  return sorted.map((section, index) => {
    const prevImpressions =
      index > 0 ? sorted[index - 1].totalImpressions : section.totalImpressions;
    const dropOffRate =
      prevImpressions > 0
        ? computeConversionRate(
            prevImpressions - section.totalImpressions,
            prevImpressions,
          )
        : 0;

    return {
      sectionOrder: section.sectionOrder,
      sectionType: section.sectionType,
      impressions: section.totalImpressions,
      dropOffRate,
    };
  });
}

// ============================================================
// 날짜 범위 헬퍼
// ============================================================

export function getDateRange(period: '7d' | '14d' | '30d' | '90d'): DateRange {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const days: Record<string, number> = {
    '7d': 7,
    '14d': 14,
    '30d': 30,
    '90d': 90,
  };

  start.setDate(start.getDate() - (days[period] - 1));
  return { start, end };
}
