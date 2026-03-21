// ============================================================
// Why Now Engine — 비즈니스 규칙
// 산업 분류, 가격 임계값, 긴급성 전략 폴백, 배치 규칙
// ============================================================

import type { UrgencyType } from './types';

/** 고가 제품 판정 대상 산업 */
export const HIGH_PRICE_INDUSTRIES = ['saas', 'b2b', 'finance'] as const;

/** 감정 기반 긴급성 대상 산업 */
export const LIFESTYLE_INDUSTRIES = ['lifestyle', 'beauty', 'education'] as const;

/** 고가 제품 판정 기준 (원) */
export const HIGH_PRICE_THRESHOLD = 100000 as const;

/** 복합 긴급성 적용 최소 저항 레벨 */
export const COMPOUND_URGENCY_THRESHOLD = 5 as const;

/** 긴급성 유형별 폴백 매핑 */
export const URGENCY_FALLBACKS: Record<UrgencyType, UrgencyType> = {
  time_based: 'quantity_based',
  quantity_based: 'time_based',
  situational: 'emotional',
  emotional: 'situational',
  price_anchor: 'situational',
} as const;

/** 필요성 저항 최소 레벨 (상황 기반 긴급성 선택 조건) */
export const NEED_RESISTANCE_THRESHOLD = 3 as const;

/** 중간 페이지 배치 최소 긴급성 저항 레벨 */
export const MID_PAGE_URGENCY_THRESHOLD = 4 as const;

/** CTA 긴급도 범위 */
export const CTA_URGENCY_MIN = 1 as const;
export const CTA_URGENCY_MAX = 5 as const;
