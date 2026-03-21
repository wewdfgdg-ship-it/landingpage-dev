// ============================================================
// 한정 혜택/카운트다운 Section Agent — 전용 타입
// 한정 혜택, 카운트다운 타이머, 긴급성
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 한정 혜택 레이아웃 패턴 ID */
export type LimitedOfferLayoutPattern =
  | 'offer_countdown'
  | 'offer_banner'
  | 'offer_modal';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
