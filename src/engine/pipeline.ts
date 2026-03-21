// ============================================================
// Pipeline Orchestrator — 섹션 에이전트 기반 파이프라인
// ①②③④ 전략 → 26개 섹션 에이전트 → ⑤카피 리파인 → ⑨스타일 → ⑩이미지 → ⑪코드 → ⑫저장
// ============================================================

import { db } from '@/lib/db';
import { runProductIntelligence } from '@/engine/01-product-intelligence';
import type { ProductIntelligenceInput } from '@/engine/01-product-intelligence';
import { runWhyNow } from '@/engine/02-why-now';
import { runConversionStrategy } from '@/engine/03-conversion-strategy';
import { runObjectionKiller } from '@/engine/04-objection-killer';
import { refineCopy } from '@/engine/05-psychological-copy';
import { runVisualStyle } from '@/engine/09-visual-style';
import { runCodeEngine } from '@/engine/10-code-engine';
import { runImageGeneration } from '@/engine/image-generation';
import { dispatchSections } from '@/engine/sections/dispatcher';
import { toCopyBlocks, toLayoutConfig, toAttentionConfig } from '@/engine/sections/adapter';

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
  { id: 'sections', label: '섹션 에이전트 실행', emoji: '🧩' },
  { id: 'copy', label: 'AI 카피 리파인', emoji: '✍️' },
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

  // ⑤~⑧ 대체: 26개 섹션 에이전트 디스패치 (규칙 엔진, AI 호출 없음)
  emitProgress(onProgress, 4, 'start');
  const dispatchResult = dispatchSections({
    brief,
    blueprint: strategyBlueprint,
    objectionMap,
    productName: inputData.basicInfo.productName,
    industry: inputData.basicInfo.industry,
  });

  // 섹션 에이전트 출력 → 기존 엔진 포맷으로 변환
  const rawCopyBlocks = toCopyBlocks(dispatchResult.sections);
  const layoutConfig = toLayoutConfig(dispatchResult.sections);
  const attentionConfig = toAttentionConfig(dispatchResult.sections);
  emitProgress(onProgress, 4, 'done', {
    dispatched: dispatchResult.dispatched,
    sections: rawCopyBlocks.sections.length,
  });

  // ⑤ AI 카피 리파인 (Claude 1회 + 품질게이트 재시도 최대 2회)
  emitProgress(onProgress, 5, 'start');
  const copyResult = await refineCopy(
    brief,
    rawCopyBlocks,
    inputData.basicInfo.productName,
    inputData.basicInfo.industry,
  );
  const copyBlocks = copyResult.refined;
  totalCost += copyResult.cost;
  emitProgress(onProgress, 5, 'done', {
    cost: copyResult.cost,
    qualityScore: copyResult.qualityGate.overallScore,
    retries: copyResult.retryCount,
  });

  // ⑨ Visual Style (규칙) — 글로벌 디자인 토큰
  emitProgress(onProgress, 6, 'start');
  const styleConfig = runVisualStyle(brief, inputData.basicInfo.industry);
  emitProgress(onProgress, 6, 'done');

  // ⑩ Image Generation (AI N회)
  emitProgress(onProgress, 7, 'start');
  const imageResult = await runImageGeneration(
    projectId,
    inputData.basicInfo.productName,
    inputData.basicInfo.industry,
    styleConfig.mood,
    copyBlocks,
    layoutConfig,
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
  emitProgress(onProgress, 7, 'done', {
    images: imageResult.totalImages,
    failed: imageResult.failedSections.length,
    cost: imageResult.totalCost,
  });

  // ⑪ Code Engine (규칙)
  emitProgress(onProgress, 8, 'start');
  const generatedPage = runCodeEngine(
    inputData.basicInfo.productName,
    copyBlocks,
    layoutConfig,
    styleConfig,
    attentionConfig.stickyCtaEnabled,
    projectId,
  );
  emitProgress(onProgress, 8, 'done', {
    totalSections: generatedPage.totalSections,
  });

  // ⑫ 결과 저장
  emitProgress(onProgress, 9, 'start');
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
      attentionConfig: toJson(attentionConfig),
      layoutConfig: toJson(layoutConfig),
      styleConfig: toJson(styleConfig),
      generatedHtml: generatedPage.fullHtml,
      generatedPage: toJson(generatedPage),
      status: 'GENERATED',
    },
  });
  emitProgress(onProgress, 9, 'done');

  return {
    totalCost,
    totalSections: generatedPage.totalSections,
    totalImages: imageResult.totalImages,
  };
}
