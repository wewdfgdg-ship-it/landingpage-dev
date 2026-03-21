import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// ============================================================
// 업종별 키워드 프리셋 API
// GET  /api/admin/references/keywords → 전체 업종 키워드 조회
// PUT  /api/admin/references/keywords → 업종 키워드 업서트
// ============================================================

interface KeywordRow {
  id: string;
  industry: string;
  keywords: string[];
  updatedAt: Date;
}

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  const adminUser = await db.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!adminUser?.isAdmin) return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });

  const rows = await db.$queryRaw<KeywordRow[]>`
    SELECT id, industry, keywords, "updatedAt"
    FROM "IndustryKeywordPreset"
    ORDER BY industry
  `;

  return NextResponse.json({ presets: rows });
}

export async function PUT(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  const adminUser = await db.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!adminUser?.isAdmin) return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });

  const body = await req.json() as {
    industry?: string;
    keywords?: string[];
  };

  const { industry, keywords } = body;

  if (!industry || !Array.isArray(keywords)) {
    return NextResponse.json({ error: '업종과 키워드 배열 필요' }, { status: 400 });
  }

  // 빈 문자열 제거, 중복 제거
  const cleaned = [...new Set(keywords.map((k) => k.trim()).filter(Boolean))];

  // upsert via raw SQL (Prisma 7 PrismaPg 호환)
  await db.$executeRaw`
    INSERT INTO "IndustryKeywordPreset" (id, industry, keywords, "updatedAt")
    VALUES (gen_random_uuid()::text, ${industry}, ${cleaned}, NOW())
    ON CONFLICT (industry)
    DO UPDATE SET keywords = ${cleaned}, "updatedAt" = NOW()
  `;

  return NextResponse.json({ industry, keywords: cleaned });
}
