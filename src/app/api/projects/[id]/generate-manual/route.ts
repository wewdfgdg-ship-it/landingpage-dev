import { db } from '@/lib/db';
import { getUserId } from '@/lib/get-user-id';
import { createSSEStream, sseHeaders } from '@/lib/sse';
import { getOrgUsage, checkGenerateQuota } from '@/lib/billing';
import { runManualPipeline } from '@/engine/pipeline-manual';
import type { ManualSectionConfig } from '@/engine/pipeline-manual';
import type { SSEEvent } from '@/lib/sse';
import type { SectionKey } from '@/engine/sections/types';

// ============================================================
// SSE 기반 수동 모드 생성 API
// POST /api/projects/[id]/generate-manual
// body: { sections: [{ sectionKey: "HEADER_BANNER", order: 1 }, ...] }
// ============================================================

const VALID_SECTION_KEYS = new Set<SectionKey>([
  'HEADER_BANNER', 'KEY_FEATURES', 'FEATURE_DETAIL_1', 'FEATURE_DETAIL_2',
  'FEATURE_DETAIL_3', 'SPECS', 'HOW_TO_USE', 'TARGET_PERSONA',
  'BEFORE_AFTER', 'LIFESTYLE', 'CERTIFICATION', 'FAQ', 'REVIEWS',
  'SHIPPING', 'CTA', 'STATS_NUMBERS', 'COMPETITOR_COMPARE', 'BRAND_STORY',
  'PACKAGE_CONTENTS', 'PHOTO_REVIEWS', 'SNS_VIRAL', 'BUNDLE_SET',
  'LIMITED_OFFER', 'REFUND_POLICY', 'CUSTOMER_SERVICE', 'PRICE_TABLE',
]);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const userId = await getUserId();
  if (!userId) {
    return new Response(JSON.stringify({ error: '인증 필요' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = await params;

  // 요청 바디 파싱
  const body = await req.json() as { sections?: ManualSectionConfig[] };
  const rawSections = body.sections;

  if (!rawSections || !Array.isArray(rawSections) || rawSections.length === 0) {
    return new Response(JSON.stringify({ error: '섹션을 1개 이상 선택해주세요' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (rawSections.length > 20) {
    return new Response(JSON.stringify({ error: '섹션은 최대 20개까지 선택 가능합니다' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 유효성 검증
  for (const s of rawSections) {
    if (!VALID_SECTION_KEYS.has(s.sectionKey)) {
      return new Response(JSON.stringify({ error: `잘못된 섹션 키: ${s.sectionKey}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // order 재정렬 (1부터 순차)
  const sections: ManualSectionConfig[] = rawSections.map((s, i) => ({
    sectionKey: s.sectionKey,
    order: i + 1,
  }));

  // 권한 확인
  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!membership) {
    return new Response(JSON.stringify({ error: '조직 없음' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
  });

  if (!project) {
    return new Response(JSON.stringify({ error: '프로젝트 없음' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 쿼터 체크
  const usage = await getOrgUsage(membership.orgId);
  const quotaCheck = checkGenerateQuota(usage);
  if (!quotaCheck.allowed) {
    return new Response(JSON.stringify({ error: quotaCheck.reason }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (project.status !== 'DRAFT' && project.status !== 'GENERATED') {
    return new Response(JSON.stringify({ error: '현재 상태에서 생성할 수 없습니다' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 상태 변경
  await db.project.update({
    where: { id },
    data: { status: 'GENERATING' },
  });

  // SSE 스트림
  const stream = createSSEStream(async (send: (e: SSEEvent) => void) => {
    try {
      const result = await runManualPipeline(
        { projectId: id, sections },
        (progress) => {
          send({
            event: 'progress',
            data: {
              step: progress.stepId,
              label: progress.label,
              emoji: progress.emoji,
              status: progress.status,
              current: progress.current,
              total: progress.total,
              percent: progress.percent,
              ...progress.extra,
            },
          });
        },
      );

      send({
        event: 'complete',
        data: {
          success: true,
          totalCost: result.totalCost,
          totalSections: result.totalSections,
          totalImages: result.totalImages,
        },
      });
    } catch (error) {
      await db.project.update({
        where: { id },
        data: { status: 'DRAFT' },
      });

      send({
        event: 'error',
        data: {
          message: error instanceof Error ? error.message : '생성 실패',
        },
      });
    }
  });

  return new Response(stream, { headers: sseHeaders() });
}
