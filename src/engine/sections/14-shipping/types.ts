// ============================================================
// Shipping Section Agent ???„ìš© ?€??
// ë°°ì†¡/êµí™˜/ë°˜í’ˆ ?•ë³´
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';

/** ?…ì¢… ë¶„ë¥˜ ??*/
export type IndustryCategory =
  | 'beauty'
  | 'food'
  | 'electronics'
  | 'fashion'
  | 'living'
  | 'saas'
  | 'education'
  | 'enterprise'
  | 'default';

/** ë°°ì†¡ ?ˆì´?„ì›ƒ ?¨í„´ ID */
export type ShippingLayoutPattern =
  | 'shipping_icons'
  | 'shipping_table'
  | 'shipping_steps';

/** ?…ì¢…ë³?4?”ì†Œ ë¹„ì¤‘ ë§?*/
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
