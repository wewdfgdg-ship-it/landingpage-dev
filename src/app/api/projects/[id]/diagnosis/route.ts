import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/get-user-id';
import { db } from '@/lib/db';

// ============================================================
// 진단 결과 조회 API
// GET /api/projects/[id]/diagnosis
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

  // 최근 진단 로그 (최근 7일)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const diagnoses = await db.diagnosisLog.findMany({
    where: { projectId: id, createdAt: { gte: sevenDaysAgo } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // 최근 7일 일일 분석
  const dailyAnalytics = await db.dailyAnalytics.findMany({
    where: { projectId: id, date: { gte: sevenDaysAgo } },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json({
    diagnoses: diagnoses.map((d) => ({
      id: d.id,
      type: d.diagnosisType,
      severity: d.severity,
      details: d.details,
      prescriptionLevel: d.prescriptionLevel,
      prescription: d.prescription,
      applied: d.applied,
      appliedAt: d.appliedAt,
      createdAt: d.createdAt,
    })),
    dailyAnalytics: dailyAnalytics.map((a) => ({
      date: a.date,
      totalVisits: a.totalVisits,
      uniqueVisitors: a.uniqueVisitors,
      totalConversions: a.totalConversions,
      conversionRate: a.conversionRate,
      avgScrollDepth: a.avgScrollDepth,
      avgTimeOnPage: a.avgTimeOnPage,
      bounceRate: a.bounceRate,
    })),
  });
}
