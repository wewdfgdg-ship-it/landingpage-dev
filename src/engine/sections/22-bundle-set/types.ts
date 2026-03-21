// ============================================================
// 번들/세트 Section Agent — 전용 타입
// 세트 구성/번들 할인 안내
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 번들/세트 레이아웃 패턴 ID */
export type BundleSetLayoutPattern =
  | 'bundle_compare'
  | 'bundle_cards'
  | 'bundle_stacked';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
