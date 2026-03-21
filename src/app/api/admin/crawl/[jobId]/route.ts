import { db } from '@/lib/db';
import { getUserId } from '@/lib/get-user-id';
import { crawlQueue } from '@/lib/queue';

// ============================================================
// 크롤링 작업 상세 API
// GET  /api/admin/crawl/[jobId] — 작업 상태 조회 + BullMQ 진행률
// POST /api/admin/crawl/[jobId] — 작업 큐 등록 (QUEUED 상태만)
// DELETE /api/admin/crawl/[jobId] — 작업 취소
// ============================================================

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<Response> {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: '인증 필요' }, { status: 401 });

  const user = await db.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  if (!user?.isAdmin) return Response.json({ error: '관리자 권한 필요' }, { status: 403 });

  const { jobId } = await params;
  const job = await db.crawlJob.findUnique({ where: { id: jobId } });
  if (!job) return Response.json({ error: '작업 없음' }, { status: 404 });

  // BullMQ 진행률 조회
  let progress: Record<string, unknown> | null = null;
  try {
    const bullJob = await crawlQueue.getJob(jobId);
    if (bullJob) {
      const raw = bullJob.progress;
      progress = typeof raw === 'object' && raw !== null
        ? raw as Record<string, unknown>
        : null;
    }
  } catch {
    // BullMQ 연결 실패 시 무시
  }

  return Response.json({ job, progress });
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<Response> {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: '인증 필요' }, { status: 401 });

  const user = await db.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  if (!user?.isAdmin) return Response.json({ error: '관리자 권한 필요' }, { status: 403 });

  const { jobId } = await params;
  const job = await db.crawlJob.findUnique({ where: { id: jobId } });
  if (!job) return Response.json({ error: '작업 없음' }, { status: 404 });

  if (job.status !== 'QUEUED') {
    return Response.json({ error: `현재 상태(${job.status})에서 실행할 수 없습니다` }, { status: 400 });
  }

  // BullMQ 큐에 등록 — Worker가 QUEUED→RUNNING 전환
  await crawlQueue.add('crawl', {
    crawlJobId: jobId,
    sectionType: job.sectionType,
    industry: job.industry,
    treatment: job.treatment,
    count: job.count,
    sourceSites: job.sourceSites,
    keywords: job.keywords,
    memo: job.memo,
  }, {
    jobId,
  });

  return Response.json({ jobId, status: 'QUEUED', message: '큐에 등록됨 — Worker가 곧 처리합니다' });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<Response> {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: '인증 필요' }, { status: 401 });

  const user = await db.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  if (!user?.isAdmin) return Response.json({ error: '관리자 권한 필요' }, { status: 403 });

  const { jobId } = await params;
  const job = await db.crawlJob.findUnique({ where: { id: jobId } });
  if (!job) return Response.json({ error: '작업 없음' }, { status: 404 });

  if (job.status === 'COMPLETED' || job.status === 'CANCELLED') {
    return Response.json({ error: '이미 완료/취소된 작업입니다' }, { status: 400 });
  }

  await db.crawlJob.update({
    where: { id: jobId },
    data: { status: 'CANCELLED' },
  });

  return Response.json({ jobId, status: 'CANCELLED' });
}
