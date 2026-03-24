// ============================================================
// Pipeline Orchestrator — 12엔진 순차 실행
// generate/route.ts, generate-stream/route.ts, worker.ts 공용
// ============================================================

import { db } from '@/lib/db';
import { runProductIntelligence } from '@/engine/01-product-intelligence';
import type { ProductIntelligenceInput } from '@/engine/01-product-intelligence';
import { runWhyNow } from '@/engine/02-why-now';
import { runConversionStrategy } from '@/engine/03-conversion-strategy';
import { runObjectionKiller } from '@/engine/04-objection-killer';
import { runPsychologicalCopy } from '@/engine/05-psychological-copy';
import { runTrustArchitecture } from '@/engine/06-trust-architecture';
import { runAttentionArchitecture } from '@/engine/07-attention-architecture';
import { runLayoutIntelligence } from '@/engine/08-layout-intelligence';
import { runVisualStyle } from '@/engine/09-visual-style';
import { runCodeEngine } from '@/engine/10-code-engine';
import { runImageGeneration } from '@/engine/image-generation';
import { IMAGE_REQUIRED_PATTERNS } from '@/engine/image-generation/types';
import { runCrossEngineBridge, injectZoneAttributes } from '@/engine/cross-engine-bridge';
import { getCdnUrl, getObjectBuffer } from '@/lib/r2';

// ============================================================
// 타입 정의
// ============================================================

export interface PipelineStep {
  id: string;
  label: string;
  emoji: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 'pi', label: '제품 분석', emoji: '🔍' },
  { id: 'whynow', label: '긴급성 분석', emoji: '⏰' },
  { id: 'cs', label: '전환 전략 수립', emoji: '🎯' },
  { id: 'objection', label: '반론 방어 설계', emoji: '🛡️' },
  { id: 'copy', label: '설득 카피 작성', emoji: '✍️' },
  { id: 'trust', label: '신뢰 구조 설계', emoji: '🤝' },
  { id: 'attention', label: '주목도 설계', emoji: '👁️' },
  { id: 'layout', label: '레이아웃 구성', emoji: '📐' },
  { id: 'style', label: '비주얼 스타일', emoji: '🎨' },
  { id: 'image', label: '이미지 생성', emoji: '🖼️' },
  { id: 'code', label: 'HTML 코드 생성', emoji: '💻' },
  { id: 'save', label: '결과 저장', emoji: '💾' },
];

export interface PipelineProgress {
  stepId: string;
  label: string;
  emoji: string;
  status: 'start' | 'done';
  current: number;
  total: number;
  percent: number;
  extra?: Record<string, unknown>;
}

export type ProgressCallback = (progress: PipelineProgress) => void;

export interface PipelineResult {
  totalCost: number;
  totalSections: number;
  totalImages: number;
}

// ============================================================
// 진행률 헬퍼
// ============================================================

function emitProgress(
  cb: ProgressCallback | undefined,
  stepIndex: number,
  status: 'start' | 'done',
  extra?: Record<string, unknown>,
): void {
  if (!cb) return;
  const step = PIPELINE_STEPS[stepIndex];
  cb({
    stepId: step.id,
    label: step.label,
    emoji: step.emoji,
    status,
    current: stepIndex + 1,
    total: PIPELINE_STEPS.length,
    percent: Math.round(
      ((stepIndex + (status === 'done' ? 1 : 0)) / PIPELINE_STEPS.length) * 100,
    ),
    extra,
  });
}

// ============================================================
// 메인 파이프라인
// ============================================================

export async function runPipeline(
  projectId: string,
  onProgress?: ProgressCallback,
): Promise<PipelineResult> {
  // 프로젝트 조회
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error('프로젝트를 찾을 수 없습니다');

  const inputData = project.inputData as unknown as ProductIntelligenceInput;
  let totalCost = 0;

  // ① Product Intelligence (AI 3회)
  emitProgress(onProgress, 0, 'start');
  const piResult = await runProductIntelligence(inputData);
  const brief = piResult.brief;
  totalCost += piResult.totalCost;
  emitProgress(onProgress, 0, 'done', { cost: piResult.totalCost });

  // ② Why Now (규칙)
  emitProgress(onProgress, 1, 'start');
  const urgencyBrief = runWhyNow(
    brief,
    inputData.basicInfo.industry,
    inputData.basicInfo.priceRange,
  );
  emitProgress(onProgress, 1, 'done');

  // ③ Conversion Strategy (AI 1회)
  emitProgress(onProgress, 2, 'start');
  const csResult = await runConversionStrategy(
    brief,
    urgencyBrief,
    inputData.basicInfo.pageGoal,
    inputData.basicInfo.industry,
  );
  const strategyBlueprint = csResult.blueprint;
  totalCost += csResult.cost;
  emitProgress(onProgress, 2, 'done', { cost: csResult.cost });

  // ④ Objection Killer (규칙)
  emitProgress(onProgress, 3, 'start');
  const objectionMap = runObjectionKiller(brief, strategyBlueprint);
  emitProgress(onProgress, 3, 'done');

  // ⑤ Psychological Copy (AI 1회 + 품질 게이트 재생성)
  emitProgress(onProgress, 4, 'start');
  const copyResult = await runPsychologicalCopy(
    brief,
    urgencyBrief,
    strategyBlueprint,
    objectionMap,
    inputData.basicInfo.industry,
    (attempt, failedCount) => {
      emitProgress(onProgress, 4, 'start', {
        retry: attempt,
        failedSections: failedCount,
        message: `카피 품질 개선 중 (${attempt}차 재생성, ${failedCount}개 섹션)`,
      });
    },
  );
  let copyBlocks = copyResult.copyBlocks;
  totalCost += copyResult.cost;
  emitProgress(onProgress, 4, 'done', {
    cost: copyResult.cost,
    sections: copyBlocks.sections.length,
    qualityScore: copyResult.qualityGate.overallScore,
    retries: copyResult.retryCount,
  });

  // ⑥ Trust Architecture (규칙)
  emitProgress(onProgress, 5, 'start');
  const trustConfig = runTrustArchitecture(brief, strategyBlueprint);
  emitProgress(onProgress, 5, 'done');

  // ⑦ Attention Architecture (규칙)
  emitProgress(onProgress, 6, 'start');
  const attentionConfig = runAttentionArchitecture(
    brief,
    strategyBlueprint,
    inputData.basicInfo.industry,
  );
  emitProgress(onProgress, 6, 'done');

  // ⑧ Layout Intelligence (규칙)
  emitProgress(onProgress, 7, 'start');
  let layoutConfig = runLayoutIntelligence(brief, strategyBlueprint, attentionConfig);
  emitProgress(onProgress, 7, 'done');

  // ⑨ Visual Style (규칙)
  emitProgress(onProgress, 8, 'start');
  const styleConfig = runVisualStyle(brief, inputData.basicInfo.industry);
  emitProgress(onProgress, 8, 'done');

  // 엔진 간 교차 반영 (Objection→Copy, Trust→Layout, Attention→Zone)
  const bridgeResult = runCrossEngineBridge(
    copyBlocks,
    objectionMap,
    trustConfig,
    attentionConfig,
    layoutConfig,
  );
  copyBlocks = bridgeResult.copyBlocks;
  layoutConfig = bridgeResult.layoutConfig;

  // ⑩ Image Generation (AI N회)
  emitProgress(onProgress, 9, 'start');

  // 사용자 업로드 이미지 → 이미지 필요 섹션에 배치
  const userImages: Array<{ storageKey: string }> =
    (inputData as unknown as { images?: Array<{ storageKey: string }> }).images ?? [];
  const userCdnUrls = userImages
    .filter((img) => img.storageKey)
    .map((img) => getCdnUrl(img.storageKey));

  // 이미지 필요 섹션 순서대로 추출 (hero → feature)
  const imageRequiredSections = layoutConfig.sections
    .filter((s) => IMAGE_REQUIRED_PATTERNS.has(s.selectedPattern))
    .sort((a, b) => a.order - b.order);

  // 원본 이미지를 섹션에 순서대로 배치
  const preAssignedImages = new Map<number, string>();
  for (let i = 0; i < Math.min(userCdnUrls.length, imageRequiredSections.length); i++) {
    preAssignedImages.set(imageRequiredSections[i].order, userCdnUrls[i]);
  }

  // 첫 번째 업로드 이미지를 참조 이미지(base64)로 변환 — AI가 스타일 참고
  let referenceImageBase64: string | undefined;
  if (userImages.length > 0 && userImages[0].storageKey) {
    try {
      const buf = await getObjectBuffer(userImages[0].storageKey);
      referenceImageBase64 = buf.toString('base64');
    } catch {
      // 참조 이미지 로드 실패 시 AI 자체 생성으로 진행
    }
  }

  const imageResult = await runImageGeneration(
    projectId,
    inputData.basicInfo.productName,
    inputData.basicInfo.industry,
    styleConfig.mood,
    copyBlocks,
    layoutConfig,
    referenceImageBase64,
    preAssignedImages,
  );
  totalCost += imageResult.totalCost;

  // 이미지 URL을 카피블록에 주입
  for (const img of imageResult.images) {
    const section = copyBlocks.sections.find(
      (s) => s.sectionOrder === img.sectionOrder,
    );
    if (section) {
      section.copy.imageUrl = img.cdnUrl;
    }
  }
  emitProgress(onProgress, 9, 'done', {
    images: imageResult.totalImages,
    failed: imageResult.failedSections.length,
    cost: imageResult.totalCost,
  });

  // ⑪ Code Engine (규칙)
  emitProgress(onProgress, 10, 'start');
  const generatedPage = runCodeEngine(
    inputData.basicInfo.productName,
    copyBlocks,
    layoutConfig,
    styleConfig,
    attentionConfig.stickyCtaEnabled,
    projectId,
  );

  // Zone 어노테이션을 HTML에 주입
  generatedPage.fullHtml = injectZoneAttributes(
    generatedPage.fullHtml,
    bridgeResult.zoneAnnotations,
  );
  emitProgress(onProgress, 10, 'done', {
    totalSections: generatedPage.totalSections,
    bridge: bridgeResult.stats,
  });

  // ⑫ 결과 저장
  emitProgress(onProgress, 11, 'start');
  const toJson = <T>(data: T): ReturnType<typeof JSON.parse> =>
    JSON.parse(JSON.stringify(data));

  await db.project.update({
    where: { id: projectId },
    data: {
      productBrief: toJson(brief),
      urgencyBrief: toJson(urgencyBrief),
      strategyBlueprint: toJson(strategyBlueprint),
      objectionMap: toJson(objectionMap),
      copyBlocks: toJson(copyBlocks),
      trustConfig: toJson(trustConfig),
      attentionConfig: toJson(attentionConfig),
      layoutConfig: toJson(layoutConfig),
      styleConfig: toJson(styleConfig),
      generatedHtml: generatedPage.fullHtml,
      generatedPage: toJson(generatedPage),
      status: 'GENERATED',
    },
  });
  emitProgress(onProgress, 11, 'done');

  return {
    totalCost,
    totalSections: generatedPage.totalSections,
    totalImages: imageResult.totalImages,
  };
}
