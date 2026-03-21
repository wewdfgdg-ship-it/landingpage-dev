// ============================================================
// Competitor Compare Section Agent — 전용 타입
// 경쟁사 대비 우위점 비교 테이블
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 비교표 레이아웃 패턴 ID */
export type CompareLayoutPattern =
  | 'compare_table'
  | 'compare_cards'
  | 'compare_checklist';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;

/** 시장 경쟁 수준 */
export type CompetitionLevel =
  | 'red_ocean'
  | 'blue_ocean'
  | 'niche';
