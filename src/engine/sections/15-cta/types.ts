// ============================================================
// CTA Section Agent — 전용 타입
// 강력한 행동 유도 섹션
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** CTA 레이아웃 패턴 ID */
export type CtaLayoutPattern =
  | 'cta_centered'
  | 'cta_split'
  | 'cta_floating';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
