// ============================================================
// Conversion Strategy Engine — 비즈니스 규칙
// 전략 매핑, 섹션 수 결정, AI 프롬프트, 스크롤/읽기 계수
// ============================================================

import type { StrategyType } from './types';

/** 페이지 목표 → 전략 유형 매핑 */
export const STRATEGY_MAP: Record<string, StrategyType> = {
  purchase: 'direct_sale',
  signup: 'free_trial',
  inquiry: 'lead_generation',
  download: 'content_hook',
  registration: 'event_registration',
  newsletter: 'content_hook',
} as const;

/** 의사결정 소요시간 → 기본 섹션 수 */
export const SECTION_COUNT_BY_DECISION_TIME: Record<string, number> = {
  instant: 6,
  '1_day': 9,
  '1_week': 12,
  '1_month_plus': 14,
} as const;

/** 기본 섹션 수 (매핑되지 않는 경우) */
export const DEFAULT_SECTION_COUNT = 9 as const;

/** 가격 저항 보정: 이 레벨 이상이면 섹션 +2 */
export const PRICE_RESISTANCE_BONUS_THRESHOLD = 4 as const;

/** 가격 저항 보정 섹션 수 */
export const PRICE_RESISTANCE_BONUS_SECTIONS = 2 as const;

/** 섹션 수 범위 제한 */
export const MIN_SECTIONS = 5 as const;
export const MAX_SECTIONS = 16 as const;

/** 섹션당 예상 스크롤 깊이 (px) */
export const SCROLL_DEPTH_PER_SECTION = 600 as const;

/** 섹션당 예상 읽기 시간 (분) */
export const READ_TIME_PER_SECTION = 0.5 as const;

/** AI 시스템 프롬프트: 섹션 구조 설계 */
export const STRUCTURE_SYSTEM_PROMPT = `당신은 랜딩페이지 전환 전략가입니다.
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
