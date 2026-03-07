import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { runCodeEngine } from '@/engine/10-code-engine';
import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig, SectionLayout } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
  });

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  return NextResponse.json({ project });
}

// ============================================================
// PATCH — 에디터 저장 (카피/레이아웃 수정 → Code Engine 재실행)
// ============================================================

interface EditorSaveBody {
  copyBlocks: CopyBlocks;
  layoutSections: SectionLayout[];
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
  });

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  const body = (await req.json()) as EditorSaveBody;

  // 기존 설정 복원
  const styleConfig = project.styleConfig as unknown as StyleConfig;
  const attentionConfig = project.attentionConfig as unknown as { stickyCtaEnabled: boolean };
  const inputData = project.inputData as unknown as { basicInfo: { productName: string } };

  // 새 레이아웃 설정 구성
  const layoutConfig: LayoutConfig = {
    sections: body.layoutSections,
    diversityScore: 80,
    mobileReadyScore: 85,
  };

  // Code Engine 재실행
  const generatedPage = runCodeEngine(
    inputData.basicInfo.productName,
    body.copyBlocks,
    layoutConfig,
    styleConfig,
    attentionConfig?.stickyCtaEnabled ?? false,
    id,
  );

  const toJson = <T>(data: T): ReturnType<typeof JSON.parse> =>
    JSON.parse(JSON.stringify(data));

  await db.project.update({
    where: { id },
    data: {
      copyBlocks: toJson(body.copyBlocks),
      layoutConfig: toJson(layoutConfig),
      generatedHtml: generatedPage.fullHtml,
      generatedPage: toJson(generatedPage),
      status: 'GENERATED',
    },
  });

  return NextResponse.json({
    success: true,
    html: generatedPage.fullHtml,
    totalSections: generatedPage.totalSections,
  });
}
