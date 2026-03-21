import { db } from '@/lib/db';
import { getUserId } from '@/lib/get-user-id';
import { crawlQueue } from '@/lib/queue';

// ============================================================
// 크롤링 작업 관리 API
// POST /api/admin/crawl — 새 크롤링 작업 생성 + BullMQ 큐 등록
// GET /api/admin/crawl — 크롤링 작업 목록 조회
// ============================================================

interface CreateCrawlBody {
  sectionType: string;
  industry: string;
  treatment: string;
  count: number;
  keywords?: string[];
  sourceSites?: string[];
  memo?: string;
}

export async function POST(req: Request): Promise<Response> {
  const userId = await getUserId();
  if (!userId) {
    return Response.json({ error: '인증 필요' }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) {
    return Response.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const body = await req.json() as CreateCrawlBody;

  if (!body.sectionType || !body.industry || !body.treatment || !body.count) {
    return Response.json({ error: '필수 필드 누락 (sectionType, industry, treatment, count)' }, { status: 400 });
  }

  if (body.count < 1 || body.count > 50) {
    return Response.json({ error: '수량은 1~50 사이여야 합니다' }, { status: 400 });
  }

  const job = await db.crawlJob.create({
    data: {
      sectionType: body.sectionType,
      industry: body.industry,
      treatment: body.treatment,
      count: body.count,
      keywords: body.keywords ?? [],
      sourceSites: body.sourceSites ?? [],
      memo: body.memo,
      status: 'QUEUED',
    },
  });

  // BullMQ 큐에 크롤링 작업 등록
  await crawlQueue.add('crawl', {
    crawlJobId: job.id,
    sectionType: body.sectionType,
    industry: body.industry,
    treatment: body.treatment,
    count: body.count,
    sourceSites: body.sourceSites ?? [],
    keywords: body.keywords ?? [],
    memo: body.memo ?? null,
  }, {
    jobId: job.id,
  });

  return Response.json({ jobId: job.id, status: job.status }, { status: 201 });
}

export async function GET(req: Request): Promise<Response> {
  const userId = await getUserId();
  if (!userId) {
    return Response.json({ error: '인증 필요' }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) {
    return Response.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10), 100);

  const jobs = await db.crawlJob.findMany({
    where: status ? { status: status as 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return Response.json({ jobs, total: jobs.length });
}
