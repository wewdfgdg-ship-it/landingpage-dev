// ============================================================
// Conversion Strategy Engine — 규칙/상수
// 전략 유형 매핑, 섹션 수 기본값, AI 시스템 프롬프트
// ============================================================

import type { StrategyType } from './types';

/** 페이지 목표 → 전환 전략 유형 매핑 */
export const STRATEGY_MAP: Record<string, StrategyType> = {
  purchase: 'direct_sale',
  signup: 'free_trial',
  inquiry: 'lead_generation',
  download: 'content_hook',
  registration: 'event_registration',
  newsletter: 'content_hook',
};

/**
 * 의사결정 소요시간 → 기본 섹션 수 매핑
 * 실제 섹션 수는 가격 저항에 따라 보정됨
 */
export const DECISION_TIME_SECTION_COUNT: Record<string, number> = {
  instant: 6,
  '1_day': 9,
  '1_week': 12,
  '1_month_plus': 14,
};

/** 섹션 수 최솟값 */
export const MIN_SECTIONS = 5;

/** 섹션 수 최댓값 */
export const MAX_SECTIONS = 16;

/** 가격 저항이 높을 때 추가 섹션 수 (신뢰 보강) */
export const HIGH_PRICE_RESISTANCE_EXTRA = 2;

/** 가격 저항 임계 레벨 */
export const PRICE_RESISTANCE_THRESHOLD = 4;

/** 섹션 구조 생성 AI 시스템 프롬프트 */
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
}`;
