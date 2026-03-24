// ============================================================
// Attention Architecture Engine — 규칙/상수
// 업종별 시선 동선 패턴 매핑, Zone 레이아웃 설정
// ============================================================

import type { GazePattern } from './types';

/** 평균 섹션 높이 (px) — Zone 경계 계산 기준 */
export const SECTION_HEIGHT_PX = 600;

/** Zone 경계 비율 */
export const ZONE_RATIO = {
  /** interest Zone 종료 비율 */
  interest: 0.4,
  /** desire Zone 종료 비율 */
  desire: 0.75,
} as const;

/** 업종별 시선 동선 패턴 매핑 */
export const GAZE_MAP: Record<string, GazePattern> = {
  saas: 'f_pattern',
  b2b: 'f_pattern',
  ecommerce: 'z_pattern',
  beauty: 'z_pattern',
  food: 'z_pattern',
  education: 'f_pattern',
  health: 'f_pattern',
  finance: 'f_pattern',
  lifestyle: 'center_focus',
  other: 'z_pattern',
};

/** Sticky CTA 활성화 최소 긴급성 저항 레벨 */
export const STICKY_CTA_URGENCY_THRESHOLD = 4;

/** Sticky CTA 활성화 최소 섹션 수 */
export const STICKY_CTA_MIN_SECTIONS = 10;

/** Exit Intent 활성화 최소 가격 저항 레벨 */
export const EXIT_INTENT_PRICE_THRESHOLD = 4;
