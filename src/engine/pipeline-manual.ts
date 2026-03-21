// ============================================================
// Manual Pipeline — 수동 모드 파이프라인
// ①~④ 전략 엔진 스킵, 사용자가 선택한 섹션만 생성
// ============================================================

import { db } from '@/lib/db';
import type { ProductIntelligenceInput } from '@/engine/01-product-intelligence';
import { runProductIntelligence } from '@/engine/01-product-intelligence';
import { refineCopy } from '@/engine/05-psychological-copy';
import { runVisualStyle } from '@/engine/09-visual-style';
import { runCodeEngine } from '@/engine/10-code-engine';
import { runImageGeneration } from '@/engine/image-generation';
import { toCopyBlocks, toLayoutConfig, toAttentionConfig } from '@/engine/sections/adapter';
import type { SectionKey, SectionAgentInput, SectionAgentOutput } from '@/engine/sections/types';
import type { ProgressCallback, PipelineResult } from '@/engine/pipeline';

// 섹션 에이전트 레지스트리 (dispatcher에서 가져옴)
import { runHeaderBanner } from '@/engine/sections/01-header-banner';
import { runKeyFeatures } from '@/engine/sections/02-key-features';
import { runFeatureDetail1 } from '@/engine/sections/03-feature-detail-1';
import { runFeatureDetail2 } from '@/engine/sections/04-feature-detail-2';
import { runFeatureDetail3 } from '@/engine/sections/05-feature-detail-3';
import { runSpecs } from '@/engine/sections/06-specs';
import { runHowToUse } from '@/engine/sections/07-how-to-use';
import { runTargetPersona } from '@/engine/sections/08-target-persona';
import { runBeforeAfter } from '@/engine/sections/09-before-after';
import { runLifestyle } from '@/engine/sections/10-lifestyle';
import { runCertification } from '@/engine/sections/11-certification';
import { runFaq } from '@/engine/sections/12-faq';
import { runReviews } from '@/engine/sections/13-reviews';
import { runShipping } from '@/engine/sections/14-shipping';
import { runCta } from '@/engine/sections/15-cta';
import { runStatsNumbers } from '@/engine/sections/16-stats-numbers';
import { runCompetitorCompare } from '@/engine/sections/17-competitor-compare';
import { runBrandStory } from '@/engine/sections/18-brand-story';
import { runPackageContents } from '@/engine/sections/19-package-contents';
import { runPhotoReviews } from '@/engine/sections/20-photo-reviews';
import { runSnsViral } from '@/engine/sections/21-sns-viral';
import { runBundleSet } from '@/engine/sections/22-bundle-set';
import { runLimitedOffer } from '@/engine/sections/23-limited-offer';
import { runRefundPolicy } from '@/engine/sections/24-refund-policy';
import { runCustomerService } from '@/engine/sections/25-customer-service';
import { runPriceTable } from '@/engine/sections/26-price-table';

// ============================================================
// 타입
// ============================================================

export interface ManualSectionConfig {
  sectionKey: SectionKey;
  order: number;
}

export interface ManualPipelineInput {
  projectId: string;
  sections: ManualSectionConfig[];
}

// ============================================================
// 에이전트 레지스트리
// ============================================================

const AGENT_REGISTRY: Record<SectionKey, (input: SectionAgentInput) => SectionAgentOutput> = {
  HEADER_BANNER: runHeaderBanner,
  KEY_FEATURES: runKeyFeatures,
  FEATURE_DETAIL_1: runFeatureDetail1,
  FEATURE_DETAIL_2: runFeatureDetail2,
  FEATURE_DETAIL_3: runFeatureDetail3,
  SPECS: runSpecs,
  HOW_TO_USE: runHowToUse,
  TARGET_PERSONA: runTargetPersona,
  BEFORE_AFTER: runBeforeAfter,
  LIFESTYLE: runLifestyle,
  CERTIFICATION: runCertification,
  FAQ: runFaq,
  REVIEWS: runReviews,
  SHIPPING: runShipping,
  CTA: runCta,
  STATS_NUMBERS: runStatsNumbers,
  COMPETITOR_COMPARE: runCompetitorCompare,
  BRAND_STORY: runBrandStory,
  PACKAGE_CONTENTS: runPackageContents,
  PHOTO_REVIEWS: runPhotoReviews,
  SNS_VIRAL: runSnsViral,
  BUNDLE_SET: runBundleSet,
  LIMITED_OFFER: runLimitedOffer,
  REFUND_POLICY: runRefundPolicy,
  CUSTOMER_SERVICE: runCustomerService,
  PRICE_TABLE: runPriceTable,
};

// ============================================================
// 섹션 메타데이터 (UI에서도 사용)
// ============================================================

export interface SectionMeta {
  key: SectionKey;
  label: string;
  description: string;
  category: '필수' | '제품' | '신뢰' | '전환' | '부가';
}

export const SECTION_CATALOG: SectionMeta[] = [
  // 필수
  { key: 'HEADER_BANNER', label: '헤더 배너', description: '시선을 사로잡는 메인 비주얼', category: '필수' },
  { key: 'CTA', label: '행동 유도', description: '구매/가입 등 최종 행동 촉구', category: '필수' },

  // 제품
  { key: 'KEY_FEATURES', label: '핵심 기능', description: '제품의 주요 특장점 3~4가지', category: '제품' },
  { key: 'FEATURE_DETAIL_1', label: '기능 상세 1', description: '첫 번째 핵심 기능 딥다이브', category: '제품' },
  { key: 'FEATURE_DETAIL_2', label: '기능 상세 2', description: '두 번째 핵심 기능 딥다이브', category: '제품' },
  { key: 'FEATURE_DETAIL_3', label: '기능 상세 3', description: '세 번째 핵심 기능 딥다이브', category: '제품' },
  { key: 'SPECS', label: '상세 스펙', description: '제품 사양/스펙 테이블', category: '제품' },
  { key: 'HOW_TO_USE', label: '사용 방법', description: '단계별 사용법 가이드', category: '제품' },
  { key: 'PACKAGE_CONTENTS', label: '구성품', description: '패키지 구성 내용물', category: '제품' },
  { key: 'LIFESTYLE', label: '라이프스타일', description: '실제 사용 장면 비주얼', category: '제품' },

  // 신뢰
  { key: 'REVIEWS', label: '텍스트 리뷰', description: '고객 텍스트 리뷰 모음', category: '신뢰' },
  { key: 'PHOTO_REVIEWS', label: '포토 리뷰', description: '사진 포함 고객 리뷰', category: '신뢰' },
  { key: 'CERTIFICATION', label: '인증/수상', description: '공인 인증 및 수상 내역', category: '신뢰' },
  { key: 'STATS_NUMBERS', label: '숫자 증명', description: '임상 결과, 판매 수치 등', category: '신뢰' },
  { key: 'COMPETITOR_COMPARE', label: '경쟁사 비교', description: '경쟁 제품 대비 장점', category: '신뢰' },
  { key: 'BRAND_STORY', label: '브랜드 스토리', description: '브랜드의 비전과 철학', category: '신뢰' },
  { key: 'SNS_VIRAL', label: 'SNS 반응', description: 'SNS 바이럴 / 인플루언서', category: '신뢰' },

  // 전환
  { key: 'TARGET_PERSONA', label: '타겟 페르소나', description: '이런 분께 추천합니다', category: '전환' },
  { key: 'BEFORE_AFTER', label: '비포/애프터', description: '사용 전후 변화 비교', category: '전환' },
  { key: 'FAQ', label: '자주 묻는 질문', description: '구매 전 궁금증 해소', category: '전환' },
  { key: 'BUNDLE_SET', label: '번들/세트', description: '세트 상품 구성 비교', category: '전환' },
  { key: 'LIMITED_OFFER', label: '한정 특가', description: '기간/수량 한정 프로모션', category: '전환' },
  { key: 'PRICE_TABLE', label: '가격표', description: '요금제 비교 테이블', category: '전환' },

  // 부가
  { key: 'SHIPPING', label: '배송 정보', description: '배송 방법 및 일정', category: '부가' },
  { key: 'REFUND_POLICY', label: '환불 정책', description: '교환/환불/보증 안내', category: '부가' },
  { key: 'CUSTOMER_SERVICE', label: '고객 지원', description: '상담/지원 채널 안내', category: '부가' },
];

// ============================================================
// 진행률 헬퍼
// ============================================================

const MANUAL_STEPS = [
  { id: 'pi', label: '제품 분석', emoji: '🔍' },
  { id: 'sections', label: '섹션 생성', emoji: '🧩' },
  { id: 'copy', label: 'AI 카피 리파인', emoji: '✍️' },
  { id: 'style', label: '비주얼 스타일', emoji: '🎨' },
  { id: 'image', label: '이미지 생성', emoji: '🖼️' },
  { id: 'code', label: 'HTML 코드 생성', emoji: '💻' },
  { id: 'save', label: '결과 저장', emoji: '💾' },
];

function emitProgress(
  cb: ProgressCallback | undefined,
  stepIndex: number,
  status: 'start' | 'done',
  extra?: Record<string, unknown>,
): void {
  if (!cb) return;
  const step = MANUAL_STEPS[stepIndex];
  cb({
    stepId: step.id,
    label: step.label,
    emoji: step.emoji,
    status,
    current: stepIndex + 1,
    total: MANUAL_STEPS.length,
    percent: Math.round(
      ((stepIndex + (status === 'done' ? 1 : 0)) / MANUAL_STEPS.length) * 100,
    ),
    extra,
  });
}

// ============================================================
// 수동 모드 파이프라인
// ============================================================

export async function runManualPipeline(
  input: ManualPipelineInput,
  onProgress?: ProgressCallback,
): Promise<PipelineResult> {
  const { projectId, sections: sectionConfigs } = input;

  // 프로젝트 조회
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error('프로젝트를 찾을 수 없습니다');

  const inputData = project.inputData as unknown as ProductIntelligenceInput;
  let totalCost = 0;

  // ① Product Intelligence (AI 3회) — 수동모드에서도 제품 분석은 필요
  emitProgress(onProgress, 0, 'start');
  const piResult = await runProductIntelligence(inputData);
  const brief = piResult.brief;
  totalCost += piResult.totalCost;
  emitProgress(onProgress, 0, 'done', { cost: piResult.totalCost });

  // 섹션 에이전트 실행 (사용자 선택 섹션만)
  emitProgress(onProgress, 1, 'start');
  const sectionOutputs: SectionAgentOutput[] = [];

  for (const config of sectionConfigs) {
    const runner = AGENT_REGISTRY[config.sectionKey];
    const agentInput: SectionAgentInput = {
      sectionKey: config.sectionKey,
      order: config.order,
      productName: inputData.basicInfo.productName,
      industry: inputData.basicInfo.industry,
      brief,
      strategyHint: '수동 모드 — 사용자 선택 섹션',
      tone: brief.decisionType === 'impulse' ? '강렬하고 직관적' :
            brief.decisionType === 'analytical' ? '논리적이고 전문적' :
            brief.decisionType === 'cautious' ? '안심시키고 신뢰감' : '깔끔하고 명확',
      targetEmotion: '관심과 호기심',
    };

    const result = runner(agentInput);
    sectionOutputs.push(result);
  }

  // 어댑터 변환
  const rawCopyBlocks = toCopyBlocks(sectionOutputs);
  const layoutConfig = toLayoutConfig(sectionOutputs);
  const attentionConfig = toAttentionConfig(sectionOutputs);
  emitProgress(onProgress, 1, 'done', { sections: sectionOutputs.length });

  // ⑤ AI 카피 리파인
  emitProgress(onProgress, 2, 'start');
  const copyResult = await refineCopy(
    brief,
    rawCopyBlocks,
    inputData.basicInfo.productName,
    inputData.basicInfo.industry,
  );
  const copyBlocks = copyResult.refined;
  totalCost += copyResult.cost;
  emitProgress(onProgress, 2, 'done', {
    cost: copyResult.cost,
    qualityScore: copyResult.qualityGate.overallScore,
  });

  // ⑨ Visual Style
  emitProgress(onProgress, 3, 'start');
  const styleConfig = runVisualStyle(brief, inputData.basicInfo.industry);
  emitProgress(onProgress, 3, 'done');

  // ⑩ Image Generation
  emitProgress(onProgress, 4, 'start');
  const imageResult = await runImageGeneration(
    projectId,
    inputData.basicInfo.productName,
    inputData.basicInfo.industry,
    styleConfig.mood,
    copyBlocks,
    layoutConfig,
  );
  totalCost += imageResult.totalCost;

  for (const img of imageResult.images) {
    const section = copyBlocks.sections.find(
      (s) => s.sectionOrder === img.sectionOrder,
    );
    if (section) {
      section.copy.imageUrl = img.cdnUrl;
    }
  }
  emitProgress(onProgress, 4, 'done', {
    images: imageResult.totalImages,
    cost: imageResult.totalCost,
  });

  // ⑪ Code Engine
  emitProgress(onProgress, 5, 'start');
  const generatedPage = runCodeEngine(
    inputData.basicInfo.productName,
    copyBlocks,
    layoutConfig,
    styleConfig,
    attentionConfig.stickyCtaEnabled,
    projectId,
  );
  emitProgress(onProgress, 5, 'done', {
    totalSections: generatedPage.totalSections,
  });

  // ⑫ 저장
  emitProgress(onProgress, 6, 'start');
  const toJson = <T>(data: T): ReturnType<typeof JSON.parse> =>
    JSON.parse(JSON.stringify(data));

  await db.project.update({
    where: { id: projectId },
    data: {
      productBrief: toJson(brief),
      copyBlocks: toJson(copyBlocks),
      attentionConfig: toJson(attentionConfig),
      layoutConfig: toJson(layoutConfig),
      styleConfig: toJson(styleConfig),
      generatedHtml: generatedPage.fullHtml,
      generatedPage: toJson(generatedPage),
      status: 'GENERATED',
    },
  });
  emitProgress(onProgress, 6, 'done');

  return {
    totalCost,
    totalSections: generatedPage.totalSections,
    totalImages: imageResult.totalImages,
  };
}
