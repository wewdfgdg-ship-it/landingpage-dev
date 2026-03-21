import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// ============================================================
// 레퍼런스 수집 현황 통계 API
// GET /api/admin/references/stats
// → 섹션×업종 매트릭스 + 트리트먼트별 통계
// ============================================================

interface MatrixRow {
  sectionType: string;
  industry: string;
  total: bigint;
  approved: bigint;
  pending: bigint;
  rejected: bigint;
}

interface TreatmentRow {
  treatment: string;
  total: bigint;
  approved: bigint;
}

interface OverallRow {
  total: bigint;
  approved: bigint;
  pending: bigint;
  rejected: bigint;
}

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) {
    return NextResponse.json({ error: '관리자 권한 필요' }, { status: 403 });
  }

  const [matrix, treatments, overall] = await Promise.all([
    // 섹션 × 업종 매트릭스
    db.$queryRaw<MatrixRow[]>`
      SELECT
        "sectionType",
        industry,
        count(*) as total,
        count(*) FILTER (WHERE status = 'APPROVED') as approved,
        count(*) FILTER (WHERE status = 'PENDING') as pending,
        count(*) FILTER (WHERE status = 'REJECTED') as rejected
      FROM "SectionReference"
      GROUP BY "sectionType", industry
      ORDER BY "sectionType", industry
    `,
    // 트리트먼트별 통계
    db.$queryRaw<TreatmentRow[]>`
      SELECT
        treatment,
        count(*) as total,
        count(*) FILTER (WHERE status = 'APPROVED') as approved
      FROM "SectionReference"
      GROUP BY treatment
      ORDER BY treatment
    `,
    // 전체 통계
    db.$queryRaw<OverallRow[]>`
      SELECT
        count(*) as total,
        count(*) FILTER (WHERE status = 'APPROVED') as approved,
        count(*) FILTER (WHERE status = 'PENDING') as pending,
        count(*) FILTER (WHERE status = 'REJECTED') as rejected
      FROM "SectionReference"
    `,
  ]);

  return NextResponse.json({
    matrix: matrix.map((r) => ({
      sectionType: r.sectionType,
      industry: r.industry,
      total: Number(r.total),
      approved: Number(r.approved),
      pending: Number(r.pending),
      rejected: Number(r.rejected),
    })),
    treatments: treatments.map((r) => ({
      treatment: r.treatment,
      total: Number(r.total),
      approved: Number(r.approved),
    })),
    overall: {
      total: Number(overall[0]?.total ?? 0),
      approved: Number(overall[0]?.approved ?? 0),
      pending: Number(overall[0]?.pending ?? 0),
      rejected: Number(overall[0]?.rejected ?? 0),
    },
  });
}
