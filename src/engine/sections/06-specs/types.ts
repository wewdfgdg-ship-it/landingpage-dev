// ============================================================
// Specs Section Agent — 전용 타입
// 제품 상세 스펙/성분/규격을 표/리스트로 표시
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 상세스펙 레이아웃 패턴 ID */
export type SpecsLayoutPattern =
  | 'specs_table'
  | 'specs_accordion'
  | 'specs_two_column';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
