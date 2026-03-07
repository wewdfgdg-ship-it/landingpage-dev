import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createSSEStream, sseHeaders } from '@/lib/sse';
import { getOrgUsage, checkGenerateQuota } from '@/lib/billing';
import { runPipeline } from '@/engine/pipeline';
import type { SSEEvent } from '@/lib/sse';

// ============================================================
// SSE 기반 랜딩페이지 생성 스트림 API
// POST /api/projects/[id]/generate-stream
// 단계별 진행률을 실시간 SSE로 전송
// ============================================================

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: '인증 필요' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = await params;

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
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

  await db.project.update({
    where: { id },
    data: { status: 'GENERATING' },
  });

  const stream = createSSEStream(async (send: (e: SSEEvent) => void) => {
    try {
      const result = await runPipeline(id, (progress) => {
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
      });

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
