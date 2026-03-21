// ============================================================
// Stats Numbers Section Agent — 전용 타입
// 핵심 수치(만족도, 판매량 등)를 임팩트 있게 표시
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 숫자/통계 레이아웃 패턴 ID */
export type StatsLayoutPattern =
  | 'stats_counter'
  | 'stats_cards'
  | 'stats_inline';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
