import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getCdnUrl } from '@/lib/r2';

// ============================================================
// ?πÏÖò ?àÌçº?∞Ïä§ Í¥ÄÎ¶?API (raw SQL ??Prisma 7 PrismaPg ?∏Ìôò)
// GET  /api/admin/references?sectionType=&industry=&treatment=&status=&page=1&limit=30
// PATCH /api/admin/references  { id, status: "APPROVED" | "REJECTED" }
// ============================================================

const SECTION_TYPES = [
  'HEADER_BANNER', 'KEY_FEATURES', 'FEATURE_DETAIL_1', 'FEATURE_DETAIL_2',
  'FEATURE_DETAIL_3', 'SPECS', 'HOW_TO_USE', 'TARGET_PERSONA', 'BEFORE_AFTER',
  'LIFESTYLE', 'CERTIFICATION', 'FAQ', 'REVIEWS', 'SHIPPING', 'CTA',
  'STATS_NUMBERS', 'COMPETITOR_COMPARE', 'BRAND_STORY', 'PACKAGE_CONTENTS',
  'PHOTO_REVIEWS', 'SNS_VIRAL', 'BUNDLE_SET', 'LIMITED_OFFER', 'REFUND_POLICY',
  'CUSTOMER_SERVICE', 'PRICE_TABLE',
] as const;

const INDUSTRIES = [
  'beauty', 'food', 'fashion', 'electronics', 'furniture', 'kids', 'pets',
  'sports', 'saas', 'education', 'finance', 'realestate', 'travel', 'clinic',
  'legal', 'enterprise', 'marketing', 'consulting',
] as const;

const TREATMENTS = ['photo', 'text', 'graphic', 'animation'] as const;

interface ReferenceRow {
  id: string;
  sectionType: string;
  industry: string;
  treatment: string;
  status: string;
  imageUrl: string;
  sourceUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CountRow {
  count: bigint;
}

interface StatsRow {
  status: string;
  cnt: bigint;
}

export async function GET(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Î°úÍ∑∏???ÑÏöî' }, { status: 401 });
  const adminUser = await db.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!adminUser?.isAdmin) return NextResponse.json({ error: 'Í¥ÄÎ¶¨Ïûê Í∂åÌïú ?ÑÏöî' }, { status: 403 });

  const url = new URL(req.url);
  const sectionType = url.searchParams.get('sectionType');
  const industry = url.searchParams.get('industry');
  const treatment = url.searchParams.get('treatment');
  const status = url.searchParams.get('status');
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
  const limit = Math.min(60, Math.max(1, Number(url.searchParams.get('limit') ?? '30')));
  const offset = (page - 1) * limit;

  // ?ôÏ†Å WHERE Ï°∞Í±¥ ?ùÏÑ±
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIdx = 1;

  if (sectionType) {
    conditions.push(`"sectionType" = $${paramIdx++}`);
    params.push(sectionType);
  }
  if (industry) {
    conditions.push(`industry = $${paramIdx++}`);
    params.push(industry);
  }
  if (treatment) {
    conditions.push(`treatment = $${paramIdx++}`);
    params.push(treatment);
  }
  if (status) {
    conditions.push(`status = $${paramIdx++}`);
    params.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // ?∞Ïù¥??Ï°∞Ìöå + Ïπ¥Ïö¥??Î≥ëÎ†¨
  const itemsQuery = `
    SELECT id, "sectionType", industry, treatment, status, "imageUrl", "sourceUrl", "createdAt", "updatedAt"
    FROM "SectionReference"
    ${whereClause}
    ORDER BY "createdAt" DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countQuery = `SELECT count(*) FROM "SectionReference" ${whereClause}`;

  const statsQuery = `SELECT status, count(*) as cnt FROM "SectionReference" GROUP BY status`;

  const [items, countResult, statsResult] = await Promise.all([
    db.$queryRawUnsafe<ReferenceRow[]>(itemsQuery, ...params),
    db.$queryRawUnsafe<CountRow[]>(countQuery, ...params),
    db.$queryRaw<StatsRow[]>`SELECT status, count(*) as cnt FROM "SectionReference" GROUP BY status`,
  ]);

  const total = Number(countResult[0]?.count ?? 0);

  return NextResponse.json({
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats: {
      pending: Number(statsResult.find((s) => s.status === 'PENDING')?.cnt ?? 0),
      approved: Number(statsResult.find((s) => s.status === 'APPROVED')?.cnt ?? 0),
      rejected: Number(statsResult.find((s) => s.status === 'REJECTED')?.cnt ?? 0),
    },
    filters: {
      sectionTypes: SECTION_TYPES,
      industries: INDUSTRIES,
      treatments: TREATMENTS,
    },
  });
}

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Î°úÍ∑∏???ÑÏöî' }, { status: 401 });
  const adminUser = await db.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!adminUser?.isAdmin) return NextResponse.json({ error: 'Í¥ÄÎ¶¨Ïûê Í∂åÌïú ?ÑÏöî' }, { status: 403 });

  const body = await req.json() as {
    sectionType?: string;
    industry?: string;
    treatment?: string;
    storageKey?: string;
    sourceUrl?: string;
  };

  const { sectionType, industry, treatment, storageKey, sourceUrl } = body;

  if (!sectionType || !storageKey || !industry || !treatment) {
    return NextResponse.json({ error: '?πÏÖò?Ä?? ?ÖÏ¢Ö, ?∏Î¶¨?∏Î®º?? storageKey ?ÑÏàò' }, { status: 400 });
  }

  const imageUrl = getCdnUrl(storageKey);

  if (!SECTION_TYPES.includes(sectionType as typeof SECTION_TYPES[number])) {
    return NextResponse.json({ error: '?òÎ™ª???πÏÖò ?Ä?? }, { status: 400 });
  }
  if (!INDUSTRIES.includes(industry as typeof INDUSTRIES[number])) {
    return NextResponse.json({ error: '?òÎ™ª???ÖÏ¢Ö' }, { status: 400 });
  }
  if (!TREATMENTS.includes(treatment as typeof TREATMENTS[number])) {
    return NextResponse.json({ error: '?òÎ™ª???∏Î¶¨?∏Î®º?? }, { status: 400 });
  }

  const id = `ref-${Date.now()}`;

  await db.$executeRaw`
    INSERT INTO "SectionReference" (id, "sectionType", industry, treatment, status, "imageUrl", "sourceUrl", "createdAt", "updatedAt")
    VALUES (${id}, ${sectionType}, ${industry}, ${treatment}, 'APPROVED', ${imageUrl}, ${sourceUrl ?? null}, NOW(), NOW())
  `;

  return NextResponse.json({ id, status: 'APPROVED' }, { status: 201 });
}

export async function PATCH(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Î°úÍ∑∏???ÑÏöî' }, { status: 401 });
  const adminUser = await db.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!adminUser?.isAdmin) return NextResponse.json({ error: 'Í¥ÄÎ¶¨Ïûê Í∂åÌïú ?ÑÏöî' }, { status: 403 });

  const body = await req.json() as { id?: string; status?: string };
  const { id, status } = body;

  if (!id || !status || !['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: '?òÎ™ª???îÏ≤≠' }, { status: 400 });
  }

  await db.$executeRaw`
    UPDATE "SectionReference"
    SET status = ${status}, "updatedAt" = NOW()
    WHERE id = ${id}
  `;

  return NextResponse.json({ id, status });
}
