// ============================================================
// How To Use Section Agent — 전용 타입
// 사용 방법을 단계별(1→2→3)로 설명
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 사용법 레이아웃 패턴 ID */
export type HowToUseLayoutPattern =
  | 'steps_horizontal'
  | 'steps_vertical'
  | 'steps_cards';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
