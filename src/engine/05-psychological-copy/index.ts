import { askClaude } from '@/lib/ai/claude';
import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { UrgencyBrief } from '@/engine/02-why-now/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { ObjectionMap } from '@/engine/04-objection-killer/types';
import type { CopyBlocks, SectionCopy } from './types';
import {
  evaluateCopyQuality,
  buildRetryPrompt,
  mergeCopy,
  MAX_RETRIES,
  type QualityGateResult,
} from './quality-gate';
import { TONE_MAP, SYSTEM_PROMPT, buildCopyMessage } from './prompts';
export type { CopyBlocks } from './types';
export type { QualityGateResult } from './quality-gate';

// ============================================================
// Psychological Copy Engine — AI 1회
// 전체 섹션의 카피를 한 번에 생성
// ============================================================

export interface CopyEngineResult {
  copyBlocks: CopyBlocks;
  cost: number;
  qualityGate: QualityGateResult;
  retryCount: number;
}

export async function runPsychologicalCopy(
  brief: ProductBrief,
  urgency: UrgencyBrief,
  blueprint: StrategyBlueprint,
  objectionMap: ObjectionMap,
  industry: string,
  onRetry?: (attempt: number, failedCount: number) => void,
): Promise<CopyEngineResult> {
  const userMessage = buildCopyMessage(brief, urgency, blueprint, objectionMap, industry);
  const tone = TONE_MAP[industry] ?? TONE_MAP.other;
  let totalCost = 0;

  // 1차 생성
  const result = await askClaude<{
    sections: SectionCopy[];
    qualityScore: number;
  }>(SYSTEM_PROMPT, userMessage);
  totalCost += result.cost;

  let copyBlocks: CopyBlocks = {
    sections: result.data.sections,
    tone,
    qualityScore: result.data.qualityScore,
  };

  // 품질 게이트 루프
  let retryCount = 0;
  let qualityGate = evaluateCopyQuality(copyBlocks, industry);

  while (!qualityGate.passed && retryCount < MAX_RETRIES) {
    retryCount++;
    onRetry?.(retryCount, qualityGate.failedSections.length);

    const retryPrompt = buildRetryPrompt(qualityGate.failedSections, copyBlocks);
    const retryResult = await askClaude<{
      sections: SectionCopy[];
    }>(SYSTEM_PROMPT, retryPrompt);
    totalCost += retryResult.cost;

    copyBlocks = mergeCopy(copyBlocks, retryResult.data.sections);
    qualityGate = evaluateCopyQuality(copyBlocks, industry);
  }

  // 최종 점수를 qualityScore에 반영
  copyBlocks.qualityScore = qualityGate.overallScore;

  return {
    copyBlocks,
    cost: totalCost,
    qualityGate,
    retryCount,
  };
}
