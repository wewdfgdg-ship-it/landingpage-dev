// ============================================================
// SNS 바이럴 Section Agent — 전용 타입
// SNS 언급, 인플루언서 추천, 바이럴 콘텐츠
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';
import type { IndustryCategory } from '@/engine/sections/shared';

/** SNS 바이럴 레이아웃 패턴 ID */
export type SnsViralLayoutPattern =
  | 'sns_feed'
  | 'sns_cards'
  | 'sns_embed';

/** 업종별 4요소 비중 맵 */
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
