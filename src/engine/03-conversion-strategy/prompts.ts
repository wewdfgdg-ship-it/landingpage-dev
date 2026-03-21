import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { UrgencyBrief } from '@/engine/02-why-now/types';
import type { StrategyType } from './types';

// ============================================================
// Conversion Strategy Engine — AI 프롬프트
// ============================================================

export const SYSTEM_PROMPT = `당신은 랜딩페이지 전환 전략가입니다.
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
}` as const;

export function buildStrategyMessage(
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
