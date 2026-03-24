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

