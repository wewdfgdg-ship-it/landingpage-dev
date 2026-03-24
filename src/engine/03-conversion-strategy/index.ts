import { askClaude } from '@/lib/ai/claude';
import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { UrgencyBrief } from '@/engine/02-why-now/types';
import type { StrategyBlueprint, StrategyType, StructureSection } from './types';
export type { StrategyBlueprint } from './types';
import {
  STRATEGY_MAP,
  DECISION_TIME_SECTION_COUNT,
  MIN_SECTIONS,
  MAX_SECTIONS,
  HIGH_PRICE_RESISTANCE_EXTRA,
  PRICE_RESISTANCE_THRESHOLD,
} from './rules';
import { SYSTEM_PROMPT } from './prompts';

// ============================================================
// Conversion Strategy Engine — AI 1회 + 규칙 엔진
// 페이지 전체 구조(섹션 배열)를 결정
// ============================================================

// --- 규칙: 전략 유형 선택 ---

function selectStrategy(pageGoal: string, industry: string): StrategyType {
  // SaaS는 free_trial 우선
  if (industry === 'saas' && (pageGoal === 'signup' || pageGoal === 'purchase')) {
    return 'free_trial';
  }
  // B2B는 lead_generation 우선
  if (industry === 'b2b') {
    return 'lead_generation';
  }
  return STRATEGY_MAP[pageGoal] ?? 'direct_sale';
}

// --- 규칙: 섹션 수 결정 ---

function decideSectionCount(brief: ProductBrief): number {
  const base = DECISION_TIME_SECTION_COUNT[brief.marketContext.decisionTime] ?? 9;
  const extra = brief.resistanceMap.price.level >= PRICE_RESISTANCE_THRESHOLD
    ? HIGH_PRICE_RESISTANCE_EXTRA
    : 0;

  return Math.min(MAX_SECTIONS, Math.max(MIN_SECTIONS, base + extra));
}

// --- AI: 섹션 구조 생성 ---

function buildStrategyMessage(
  strategyType: StrategyType,
  totalSections: number,
  brief: ProductBrief,
  urgency: UrgencyBrief,
): string {
  return `전략 유형: ${strategyType}
총 섹션 수: ${totalSections}
포지셔닝: ${brief.productDNA.positioning}
의사결정 유형: ${brief.decisionType}
핵심 가치: ${brief.productDNA.coreValue}
USP: ${brief.productDNA.usp.join(', ')}
주요 저항: 가격(${brief.resistanceMap.price.level}), 신뢰(${brief.resistanceMap.trust.level}), 필요성(${brief.resistanceMap.need.level}), 복잡성(${brief.resistanceMap.complexity.level})
긴급성 유형: ${urgency.primaryType}${urgency.secondaryType ? ` + ${urgency.secondaryType}` : ''}
CTA 긴급도: ${urgency.ctaUrgencyLevel}/5`;
}

export async function runConversionStrategy(
  brief: ProductBrief,
  urgency: UrgencyBrief,
  pageGoal: string,
  industry: string,
): Promise<{ blueprint: StrategyBlueprint; cost: number }> {
  const strategyType = selectStrategy(pageGoal, industry);
  const totalSections = decideSectionCount(brief);

  const userMessage = buildStrategyMessage(strategyType, totalSections, brief, urgency);

  const result = await askClaude<{
    structure: StructureSection[];
    ctaPositions: number[];
  }>(SYSTEM_PROMPT, userMessage);

  const blueprint: StrategyBlueprint = {
    strategyType,
    totalSections,
    structure: result.data.structure,
    ctaPositions: result.data.ctaPositions,
    estimatedScrollDepth: `${totalSections * 600}px`,
    targetReadTime: `${Math.ceil(totalSections * 0.5)}분`,
  };

  return { blueprint, cost: result.cost };
}
