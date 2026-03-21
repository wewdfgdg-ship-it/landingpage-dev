// ============================================================
// 환불/보증 Section Agent — 전용 타입
// 환불 정책, 만족 보증, 안심 구매
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 환불/보증 레이아웃 패턴 ID */
export type RefundPolicyLayoutPattern =
  | 'refund_shield'
  | 'refund_steps'
  | 'refund_cards';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
