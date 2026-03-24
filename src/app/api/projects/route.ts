import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
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

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    // 유저의 Organization 조회
    const membership = await db.membership.findFirst({
      where: { userId: session.user.id },
      select: { orgId: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: '조직 없음', detail: `userId=${session.user.id}에 대한 membership이 없습니다. 다시 로그인해주세요.` },
        { status: 403 },
      );
    }

    const body = (await req.json()) as CreateProjectBody;
    const { name, inputData, inputScore } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: '프로젝트명 필수' }, { status: 400 });
    }

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
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '프로젝트 생성 실패', detail: msg }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ projects: [] });
    }

    const membership = await db.membership.findFirst({
      where: { userId: session.user.id },
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
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ projects: [] });
  }
}
