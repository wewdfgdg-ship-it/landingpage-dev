// ============================================================
// 고객센터 Section Agent — 전용 타입
// 고객 지원 채널 안내
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 고객센터 레이아웃 패턴 ID */
export type CustomerServiceLayoutPattern =
  | 'cs_cards'
  | 'cs_split'
  | 'cs_inline';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
