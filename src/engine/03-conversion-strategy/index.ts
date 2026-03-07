import { askClaude } from '@/lib/ai/claude';
import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { UrgencyBrief } from '@/engine/02-why-now/types';
import type { StrategyBlueprint, StrategyType, StructureSection } from './types';
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

const SYSTEM_PROMPT = `당신은 랜딩페이지 전환 전략가입니다.
주어진 전략 유형과 섹션 수에 맞춰 최적의 페이지 섹션 구조를 설계합니다.

각 섹션의 역할(role):
- HOOK: 시선 잡기 (1개, 최상단)
- PAIN: 문제 인식 (1~2개)
- SOLUTION: 해결책 제시 (1~2개)
- PROOF: 증거/신뢰 (2~3개)
- OBJECTION: 저항 해소 (1~2개)
- URGENCY: 긴급성 (1개)
- CTA: 행동 촉구 (1~2개)

sectionType 예시: hero_visual, hero_text, pain_point, problem_agitation,
benefit_highlight, feature_showcase, how_it_works, social_proof,
testimonials, logo_bar, pricing, faq, guarantee, before_after,
comparison, urgency_counter, final_cta, mini_cta

JSON으로 응답:
{
  "structure": [
    { "order": 1, "role": "HOOK", "sectionType": "hero_visual", "purpose": "설명" },
    ...
  ],
  "ctaPositions": [5, 8, 10]
}`;

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
