import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
import { db } from '@/lib/db';
import { getOrgUsage, checkProjectQuota } from '@/lib/billing';

interface CreateProjectBody {
  name: string;
  inputData: {
    basicInfo: {
      productName: string;
      industry: string;
      priceRange: string;
      pageGoal: string;
      targetAudience: string;
      competitorUrl: string;
    };
    images: { storageKey: string }[];
    deepAnswers: { question: string; answer: string }[];
  };
  inputScore: number;
}

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('authjs.session-token')?.value ??
    cookieStore.get('__Secure-authjs.session-token')?.value;

  if (!token) return null;

  try {
    const decoded = await decode({
      token,
      secret: process.env.AUTH_SECRET!,
      salt: cookieStore.has('__Secure-authjs.session-token')
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token',
    });
    return (decoded?.id as string) ?? (decoded?.sub as string) ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  // 유저의 Organization 조회
  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  const body = (await req.json()) as CreateProjectBody;
  const { name, inputData, inputScore } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: '프로젝트명 필수' }, { status: 400 });
  }

  try {
    // 쿼터 체크
    const usage = await getOrgUsage(membership.orgId);
    const quotaCheck = checkProjectQuota(usage);
    if (!quotaCheck.allowed) {
      return NextResponse.json({ error: quotaCheck.reason }, { status: 403 });
    }

    const slug = `${name.trim().toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-')}-${Date.now().toString(36)}`;

    const project = await db.project.create({
      data: {
        orgId: membership.orgId,
        name: name.trim(),
        slug,
        status: 'DRAFT',
        inputData,
        inputScore,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/projects] 프로젝트 생성 실패:', err);
    return NextResponse.json(
      { error: '프로젝트 생성 실패', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<NextResponse> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ projects: [] });
  }

  const projects = await db.project.findMany({
    where: {
      orgId: membership.orgId,
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      inputScore: true,
      isDeployed: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ projects });
}
