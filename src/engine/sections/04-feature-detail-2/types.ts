// ============================================================
// Feature Detail 2 Section Agent — 전용 타입
// 두 번째 USP를 깊이있게 설명 (미러 레이아웃)
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 특징2 상세 레이아웃 패턴 ID */
export type FeatureDetail2LayoutPattern =
  | 'detail_split_left'
  | 'detail_split_right'
  | 'detail_fullwidth';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
