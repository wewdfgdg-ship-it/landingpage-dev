// ============================================================
// Brand Story Section Agent — 전용 타입
// 브랜드 철학과 탄생 배경
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 브랜드스토리 레이아웃 패턴 ID */
export type BrandStoryLayoutPattern =
  | 'story_timeline'
  | 'story_fullwidth'
  | 'story_split';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
