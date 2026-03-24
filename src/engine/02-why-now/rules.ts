// ============================================================
// Why Now Engine — 규칙/상수
// 긴급성 유형 결정을 위한 업종 분류 및 폴백 매핑
// ============================================================

import type { UrgencyType } from './types';

/** 고가/SaaS 업종 목록 → price_anchor 긴급성 우선 */
export const HIGH_PRICE_INDUSTRIES: string[] = ['saas', 'b2b', 'finance'];

/** 라이프스타일 업종 목록 → emotional 긴급성 우선 */
export const LIFESTYLE_INDUSTRIES: string[] = ['lifestyle', 'beauty', 'education'];

/**
 * 1차 긴급성 유형 → 2차(폴백) 긴급성 유형 매핑
 * urgency 저항 레벨 5일 때 복합 적용
 */
export const URGENCY_FALLBACKS: Record<UrgencyType, UrgencyType> = {
  time_based: 'quantity_based',
  quantity_based: 'time_based',
  situational: 'emotional',
  emotional: 'situational',
  price_anchor: 'situational',
};
