import { db } from '@/lib/db';
import { getUserId } from '@/lib/get-user-id';
import { processSectionFeedback } from '@/engine/sections/feedback';
import type { SectionAnalytics } from '@/engine/sections/feedback/types';
import type { SectionKey } from '@/engine/sections/types';

// ============================================================
// 섹션 피드백 루프 API
// POST /api/projects/[id]/feedback — 트래킹 데이터 기반 자동 진단 + 개선 제안
// GET  /api/projects/[id]/feedback — 최근 진단 로그 조회
// ============================================================

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: '인증 필요' }, { status: 401 });

  const { id } = await params;

  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });
  if (!membership) return Response.json({ error: '조직 없음' }, { status: 403 });

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
    include: {
      sections: {
        include: {
          sectionAnalytics: {
            orderBy: { date: 'desc' },
            take: 7,
          },
        },
      },
    },
  });
  if (!project) return Response.json({ error: '프로젝트 없음' }, { status: 404 });

  // 섹션 분석 데이터 → SectionAnalytics[] 변환
  const analyticsList: SectionAnalytics[] = [];

  for (const section of project.sections) {
    if (section.sectionAnalytics.length === 0) continue;

    const data = section.sectionAnalytics;
    const totalImpressions = data.reduce((s, a) => s + a.impressions, 0);
    const avgDwell = data.reduce((s, a) => s + a.avgDwellTime, 0) / data.length;
    const avgExit = data.reduce((s, a) => s + a.exitRate, 0) / data.length;
    const totalCtaClicks = data.reduce((s, a) => s + a.ctaClicks, 0);

    analyticsList.push({
      sectionKey: (section.type ?? 'KEY_FEATURES') as SectionKey,
      projectId: id,
      scrollReach: 100 - avgExit,
      dwellTime: avgDwell * 1000,
      bounceFrom: avgExit,
      ctaClicks: totalCtaClicks,
      ctaRate: totalImpressions > 0 ? (totalCtaClicks / totalImpressions) * 100 : 0,
      impressions: totalImpressions,
      engagementScore: Math.min(100, Math.round(
        (100 - avgExit) * 0.3 + Math.min(avgDwell * 10, 30) + Math.min(totalCtaClicks * 5, 40),
      )),
    });
  }

  if (analyticsList.length === 0) {
    return Response.json({
      message: '분석할 트래킹 데이터가 없습니다',
      actions: [],
    });
  }

  const result = await processSectionFeedback(id, analyticsList);

  // 진단 로그 DB 저장
  for (const action of result.actions) {
    const isPositive = action.actionType === 'boost_weight' && action.details.metric === 'engagementScore';
    await db.diagnosisLog.create({
      data: {
        projectId: id,
        diagnosisType: action.actionType,
        severity: isPositive ? 'low' : 'high',
        details: {
          sectionKey: action.sectionKey,
          reason: action.reason,
          ...action.details,
        },
        prescriptionLevel: isPositive ? 1 : 2,
        prescription: {
          actionType: action.actionType,
          target: action.sectionKey,
          reason: action.reason,
        },
      },
    });
  }

  return Response.json({
    totalSections: analyticsList.length,
    actions: result.actions,
    updatedMemories: result.updatedMemories,
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: '인증 필요' }, { status: 401 });

  const { id } = await params;

  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });
  if (!membership) return Response.json({ error: '조직 없음' }, { status: 403 });

  const logs = await db.diagnosisLog.findMany({
    where: { projectId: id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return Response.json({ logs, total: logs.length });
}
