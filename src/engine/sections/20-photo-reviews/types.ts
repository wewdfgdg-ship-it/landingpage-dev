// ============================================================
// Photo Reviews Section Agent — 전용 타입
// 실제 사용자 포토 리뷰 갤러리
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 포토리뷰 레이아웃 패턴 ID */
export type PhotoReviewsLayoutPattern =
  | 'photo_masonry'
  | 'photo_carousel'
  | 'photo_grid';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
