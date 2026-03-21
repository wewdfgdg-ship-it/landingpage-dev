import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { crawlQueue } from '@/lib/queue';

// ============================================================
// 크롤링 작업 관리 API (raw SQL — Prisma 7 PrismaPg 호환)
// GET    /api/admin/crawl-jobs?status=&page=1&limit=20
// POST   /api/admin/crawl-jobs  { sectionType, industry, treatment, count, sourceSites?, keywords?, memo? }
// PATCH  /api/admin/crawl-jobs  { id, status: "CANCELLED" }
// ============================================================

interface CrawlJobRow {
  id: string;
  sectionType: string;
  industry: string;
  treatment: string;
  count: number;
  status: string;
  sourceSites: string[];
  keywords: string[];
  memo: string | null;
  collected: number;
  errorMsg: string | null;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}

interface CountRow { count: bigint }
interface StatsRow { status: string; cnt: bigint }

export async function GET(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  const adminUser = await db.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!adminUser?.isAdmin) return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });

  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '20')));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIdx = 1;

  if (status) {
    conditions.push(`status = $${paramIdx++}`);
    params.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [items, countResult, statsResult] = await Promise.all([
    db.$queryRawUnsafe<CrawlJobRow[]>(
      `SELECT * FROM "CrawlJob" ${whereClause} ORDER BY "createdAt" DESC LIMIT ${limit} OFFSET ${offset}`,
      ...params,
    ),
    db.$queryRawUnsafe<CountRow[]>(
      `SELECT count(*) FROM "CrawlJob" ${whereClause}`,
      ...params,
    ),
    db.$queryRaw<StatsRow[]>`SELECT status, count(*) as cnt FROM "CrawlJob" GROUP BY status`,
  ]);

  const total = Number(countResult[0]?.count ?? 0);

  return NextResponse.json({
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats: {
      queued: Number(statsResult.find((s) => s.status === 'QUEUED')?.cnt ?? 0),
      running: Number(statsResult.find((s) => s.status === 'RUNNING')?.cnt ?? 0),
      completed: Number(statsResult.find((s) => s.status === 'COMPLETED')?.cnt ?? 0),
      failed: Number(statsResult.find((s) => s.status === 'FAILED')?.cnt ?? 0),
      cancelled: Number(statsResult.find((s) => s.status === 'CANCELLED')?.cnt ?? 0),
    },
  });
}

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  const adminUser = await db.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!adminUser?.isAdmin) return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });

  const body = await req.json() as {
    sectionType?: string;
    industry?: string;
    treatment?: string;
    count?: number;
    sourceSites?: string[];
    keywords?: string[];
    memo?: string;
  };

  const { sectionType, industry, treatment, count, sourceSites, keywords, memo } = body;

  if (!sectionType || !industry || !treatment || !count || count < 1 || count > 50) {
    return NextResponse.json({ error: '필수 항목 누락 또는 수량 초과 (1~50)' }, { status: 400 });
  }

  const id = `crawl-${Date.now()}`;
  const sites = sourceSites ?? [];

  await db.$executeRaw`
    INSERT INTO "CrawlJob" (id, "sectionType", industry, treatment, count, status, "sourceSites", keywords, memo, collected, "createdAt")
    VALUES (${id}, ${sectionType}, ${industry}, ${treatment}, ${count}, 'QUEUED', ${sites}, ${keywords ?? []}, ${memo ?? null}, 0, NOW())
  `;

  // BullMQ 큐에 크롤링 작업 등록
  await crawlQueue.add('crawl', {
    crawlJobId: id,
    sectionType,
    industry,
    treatment,
    count,
    sourceSites: sites,
    keywords: keywords ?? [],
    memo: memo ?? null,
  }, {
    jobId: id,
  });

  return NextResponse.json({ id, status: 'QUEUED' }, { status: 201 });
}

export async function PATCH(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  const adminUser = await db.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!adminUser?.isAdmin) return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });

  const body = await req.json() as { id?: string; status?: string };
  const { id, status } = body;

  if (!id || status !== 'CANCELLED') {
    return NextResponse.json({ error: '취소만 가능합니다' }, { status: 400 });
  }

  await db.$executeRaw`
    UPDATE "CrawlJob"
    SET status = 'CANCELLED'
    WHERE id = ${id} AND status IN ('QUEUED', 'RUNNING')
  `;

  return NextResponse.json({ id, status: 'CANCELLED' });
}
