// ============================================================
// Template Registry — patternId → v2 template 매핑
// v2 템플릿이 없는 패턴은 fallback으로 처리
// ============================================================

import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './templates/types';

// --- 템플릿 모듈 타입 ---

export interface TemplateModule {
  config: TemplateConfig;
  render: (copy: CopyBlock, tokens: DesignTokens, order?: number) => string;
}

// --- v2 템플릿 모듈 import ---

import * as heroFullscreenCenter from './templates/hero-fullscreen-center';
import * as heroLeftRight from './templates/hero-left-right';
import * as heroProductCenter from './templates/hero-product-center';
import * as heroSplit from './templates/hero-split';
import * as feat3colGrid from './templates/feat-3col-grid';
import * as featZigzag from './templates/feat-zigzag';
import * as featIconList from './templates/feat-icon-list';
import * as featNumberedSteps from './templates/feat-numbered-steps';
import * as proofTestimonialCard from './templates/proof-testimonial-card';
import * as proofNumberCounter from './templates/proof-number-counter';
import * as price3colCompare from './templates/price-3col-compare';
import * as priceSingleCard from './templates/price-single-card';
import * as ctaCenter from './templates/cta-center';
import * as ctaFullBanner from './templates/cta-full-banner';
import * as faqAccordion from './templates/faq-accordion';
import * as miscBeforeAfter from './templates/misc-before-after';

// --- v2 템플릿 목록 (config.patternId 기준) ---

const V2_TEMPLATES: readonly TemplateModule[] = [
  heroFullscreenCenter,
  heroLeftRight,
  heroProductCenter,
  heroSplit,
  feat3colGrid,
  featZigzag,
  featIconList,
  featNumberedSteps,
  proofTestimonialCard,
  proofNumberCounter,
  price3colCompare,
  priceSingleCard,
  ctaCenter,
  ctaFullBanner,
  faqAccordion,
  miscBeforeAfter,
];

// --- alias 매핑: v1 patternId → v2 patternId ---
// v1 renderers.ts에서 여러 alias가 같은 렌더러를 가리키던 것을 정리

const ALIAS_MAP: Readonly<Record<string, string>> = {
  // Hero aliases
  hero_gradient: 'hero_fullscreen_center',
  hero_minimal_typo: 'hero_fullscreen_center',
  hero_video_bg: 'hero_fullscreen_center',
  hero_card: 'hero_left_right',

  // Feature aliases
  feat_card_grid: 'feat_3col_grid',
  feat_comparison: 'feat_3col_grid',
  feat_large_img_bullets: 'feat_zigzag',
  feat_accordion: 'feat_icon_list',
  feat_tab: 'feat_icon_list',
  feat_infographic: 'feat_numbered_steps',

  // Proof aliases
  proof_review_carousel: 'proof_testimonial_card',
  proof_rating_text: 'proof_testimonial_card',
  proof_sns_grid: 'proof_testimonial_card',
  proof_logo_bar: 'proof_number_counter',

  // CTA aliases
  cta_left_right: 'cta_center',
  cta_sticky_bar: 'cta_center',
  cta_popup: 'cta_center',

  // FAQ aliases
  faq_2col: 'faq_accordion',
  faq_search: 'faq_accordion',

  // Misc aliases
  misc_timeline: 'feat_numbered_steps',
  misc_process_flow: 'feat_numbered_steps',
};

// --- 레지스트리 빌드 ---

const registry = new Map<string, TemplateModule>();

for (const tpl of V2_TEMPLATES) {
  registry.set(tpl.config.patternId, tpl);
}

// --- Public API ---

/** patternId(또는 alias)로 v2 템플릿 모듈 조회. 없으면 null. */
export function getTemplate(patternId: string): TemplateModule | null {
  const direct = registry.get(patternId);
  if (direct) return direct;

  const resolved = ALIAS_MAP[patternId];
  if (resolved) {
    return registry.get(resolved) ?? null;
  }

  return null;
}

/** 등록된 v2 템플릿의 전체 config 목록 */
export function getAllTemplateConfigs(): readonly TemplateConfig[] {
  return V2_TEMPLATES.map((t) => t.config);
}

/** patternId가 v2 레지스트리에서 처리 가능한지 여부 */
export function hasTemplate(patternId: string): boolean {
  return getTemplate(patternId) !== null;
}
