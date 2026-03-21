import { db } from '@/lib/db';
import { getUserId } from '@/lib/get-user-id';
import { NextResponse } from 'next/server';
import { renderBundle, resolveIndustry } from '@/engine/sections/orchestrator';
import { pipelineToProductData, briefToProductData } from '@/engine/sections/pipeline-adapter';
import { getDefaultBundle, getBundle } from '@/engine/sections/landing-bundles';
import type { Industry, BundleVariant } from '@/engine/sections/landing-bundles';
import type { ProductBrief } from '@/engine/01-product-intelligence/types';

// ============================================================
// 번들 기반 랜딩페이지 생성 API
// POST /api/projects/[id]/generate-bundle
// Body: { variant?: 'a'|'b'|'c'|'d'|'e' }
//
// 기존 파이프라인 결과(productBrief)가 있으면 활용,
// 없으면 입력 데이터로 최소 생성
// ============================================================

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const variant = (body.variant || 'a') as BundleVariant;

  // 사용자 조직 확인
  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  // 프로젝트 조회
  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
  });

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  try {
    // 입력 데이터 추출
    const inputData = project.inputData as Record<string, unknown> | null;
    const basicInfo = (inputData?.basicInfo || {}) as Record<string, string>;
    const productName = basicInfo.productName || project.name || '제품';
    const uiIndustry = basicInfo.industry || 'beauty';

    // 업종 매핑
    const industry = resolveIndustry(uiIndustry);

    // 번들 선택
    const bundle = getBundle(industry, variant) || getDefaultBundle(industry);

    // ProductData 생성
    const brief = project.productBrief as unknown as ProductBrief | null;
    const brandColor = (project.styleConfig as Record<string, unknown>)?.brandColor as string || '#4A90D9';
    const images = (project.sections as unknown as { imageUrl?: string }[])?.map(s => s.imageUrl).filter(Boolean) as string[] || [];

    const wizardInput = {
      productName,
      industry: uiIndustry,
      brandColor,
      fontSet: ((project.styleConfig as Record<string, unknown>)?.fontSet as string) || undefined,
      priceRange: basicInfo.priceRange,
      imageUrls: images.length > 0 ? images : undefined,
    };

    let productData;
    if (brief) {
      // 파이프라인 결과 있으면 풀 변환
      const sectionOutputs = (project.copyBlocks as unknown as { sections?: unknown[] })?.sections || [];
      productData = pipelineToProductData(brief, sectionOutputs as never[], wizardInput);
    } else {
      // 없으면 최소 데이터
      productData = {
        productName,
        brandColor,
        headline: productName,
        subheadline: basicInfo.priceRange ? `${basicInfo.priceRange}` : undefined,
        ctaText: '자세히 보기',
      };
    }

    // 렌더
    const html = renderBundle(industry, variant, productData);

    // DB 저장
    await db.project.update({
      where: { id },
      data: {
        generatedHtml: html,
        status: 'GENERATED',
        generatedPage: {
          bundleId: `${industry}-${variant}`,
          bundleLabel: bundle.label,
          sectionCount: bundle.sections.length,
          generatedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      bundleId: `${industry}-${variant}`,
      bundleLabel: bundle.label,
      sectionCount: bundle.sections.length,
      previewUrl: `/p/${project.slug || id}`,
    });
  } catch (error) {
    console.error('Bundle generation failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '생성 실패' },
      { status: 500 },
    );
  }
}
