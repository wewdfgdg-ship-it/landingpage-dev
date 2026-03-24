import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { runCodeEngine } from '@/engine/10-code-engine';
import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig, SectionLayout } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';

// ============================================================
// POST /api/projects/[id]/preview-live
// 에디터 실시간 미리보기 — 저장 없이 HTML만 즉시 생성 반환
// ============================================================

interface LivePreviewBody {
  copyBlocks: CopyBlocks;
  layoutSections: SectionLayout[];
}

export async function POST(
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
    select: {
      styleConfig: true,
      attentionConfig: true,
      inputData: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  const body = (await req.json()) as LivePreviewBody;

  const styleConfig = project.styleConfig as unknown as StyleConfig;
  const attentionConfig = project.attentionConfig as unknown as { stickyCtaEnabled: boolean };
  const inputData = project.inputData as unknown as { basicInfo: { productName: string } };

  const layoutConfig: LayoutConfig = {
    sections: body.layoutSections,
    diversityScore: 80,
    mobileReadyScore: 85,
  };

  const generatedPage = runCodeEngine(
    inputData.basicInfo.productName,
    body.copyBlocks,
    layoutConfig,
    styleConfig,
    attentionConfig?.stickyCtaEnabled ?? false,
    id,
  );

  return NextResponse.json({ html: generatedPage.fullHtml });
}
