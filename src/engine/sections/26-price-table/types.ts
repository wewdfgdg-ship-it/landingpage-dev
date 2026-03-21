// ============================================================
// 가격표 Section Agent — 전용 타입
// 요금제/가격 비교 테이블
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 가격표 레이아웃 패턴 ID */
export type PriceTableLayoutPattern =
  | 'price_columns'
  | 'price_cards'
  | 'price_simple';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
