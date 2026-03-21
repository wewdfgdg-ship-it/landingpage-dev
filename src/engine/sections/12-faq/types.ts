// ============================================================
// FAQ Section Agent ???„ìš© ?€??
// ?ì£¼ ë¬»ëŠ” ì§ˆë¬¸ ?„ì½”?”ì–¸
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

/** FAQ ?ˆì´?„ì›ƒ ?¨í„´ ID */
export type FaqLayoutPattern =
  | 'faq_accordion'
  | 'faq_two_column'
  | 'faq_cards';

/** ?…ì¢…ë³?4?”ì†Œ ë¹„ì¤‘ ë§?*/
export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;
