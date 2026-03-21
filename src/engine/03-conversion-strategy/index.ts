import { askClaude } from '@/lib/ai/claude';
import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { UrgencyBrief } from '@/engine/02-why-now/types';
import type { StrategyBlueprint, StrategyType, StructureSection } from './types';
import { SYSTEM_PROMPT, buildStrategyMessage } from './prompts';
export type { StrategyBlueprint } from './types';

// ============================================================
// Conversion Strategy Engine — AI 1회 + 규칙 엔진
// 페이지 전체 구조(섹션 배열)를 결정
// ============================================================

// --- 규칙: 전략 유형 선택 ---

const STRATEGY_MAP: Record<string, StrategyType> = {
  purchase: 'direct_sale',
  signup: 'free_trial',
  inquiry: 'lead_generation',
  download: 'content_hook',
  registration: 'event_registration',
  newsletter: 'content_hook',
};

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
  let base: number;

  switch (brief.marketContext.decisionTime) {
    case 'instant':
      base = 6;
      break;
    case '1_day':
      base = 9;
      break;
    case '1_week':
      base = 12;
      break;
    case '1_month_plus':
      base = 14;
      break;
    default:
      base = 9;
  }

  // 가격 저항 높으면 +2 (신뢰 보강 필요)
  if (brief.resistanceMap.price.level >= 4) {
    base += 2;
  }

  return Math.min(16, Math.max(5, base));
}

// --- AI: 섹션 구조 생성 ---

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
