// ============================================================
// Package Contents Section Agent — 전용 타입
// 박스 안에 뭐가 들어있는지 (구성품 목록)
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** 구성품 레이아웃 패턴 ID */
export type PackageLayoutPattern =
  | 'package_grid'
  | 'package_exploded'
  | 'package_list';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
