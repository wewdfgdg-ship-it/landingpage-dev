import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';
import { injectContent, tokensToCssVars } from './template-engine';

// ChatGPT 생성 템플릿
import * as pinkGradient from './templates/hero/pink-gradient';
import * as darkAward from './templates/hero/dark-award';
import * as darkLuxuryPro from './templates/hero/dark-luxury-pro';
import * as awardLight from './templates/hero/award-light';
import * as darkBoldRed from './templates/hero/dark-bold-red';
import * as sleekEvent from './templates/hero/sleek-event';
import * as techSpecs from './templates/hero/tech-specs';
import * as saleCloud from './templates/hero/sale-cloud';
import * as neonRetinol from './templates/hero/neon-retinol';
import * as eventPromo from './templates/hero/event-promo';
import * as highConverting from './templates/hero/high-converting';
import * as featHighConverting from './templates/features/high-converting';
import * as verticalShowcase from './templates/hero/vertical-showcase';
import * as dynamicPoster from './templates/hero/dynamic-poster';
import * as myfitPoster from './templates/hero/myfit-poster';
import * as pressShot from './templates/hero/press-shot';
import * as mamondeCream from './templates/hero/mamonde-cream';
import * as fromeatPoster from './templates/hero/fromeat-poster';
import * as collagenEffect from './templates/hero/collagen-effect';
import * as shillaVvip from './templates/hero/shilla-vvip';

// 본문 (Feature) 파츠
import * as theDanbaekGrid from './templates/feature/the-danbaek-grid';
import * as steamList from './templates/feature/steam-list';
import * as elegantGrid from './templates/feature/elegant-grid';
import * as zigzagShowcase from './templates/feature/zigzag-showcase';
import * as b2bThreeCols from './templates/feature/b2b-three-cols';
import * as pointShowcase from './templates/feature/point-showcase';
import * as darkGlowFeature from './templates/feature/dark-glow-feature';
import * as stepListVertical from './templates/feature/step-list-vertical';
import * as targetChecklist from './templates/feature/target-checklist';
import * as beforeAfterArrow from './templates/feature/before-after-arrow';
import * as lifestyleOverlay from './templates/feature/lifestyle-overlay';
import * as sideStatsProof from './templates/feature/side-stats-proof';
import * as qaCardList from './templates/feature/qa-card-list';
import * as floatingReviewBubbles from './templates/feature/floating-review-bubbles';
import * as bentoBenefitsGrid from './templates/feature/bento-benefits-grid';
import * as ticketCta from './templates/feature/ticket-cta';
import * as satisfactionBarChart from './templates/feature/satisfaction-bar-chart';
import * as vsComparisonTable from './templates/feature/vs-comparison-table';
import * as brandStatement from './templates/feature/brand-statement';
import * as instaPhotoReview from './templates/feature/insta-photo-review';
import * as influencerChatReviews from './templates/feature/influencer-chat-reviews';
import * as bundleLineupCards from './templates/feature/bundle-lineup-cards';
import * as specialOfferCard from './templates/feature/special-offer-card';
import * as refundGuarantee from './templates/feature/refund-guarantee';
import * as csChannelGuide from './templates/feature/cs-channel-guide';
import * as horizontalPriceCard from './templates/feature/horizontal-price-card';

// 직접 작성 (폴백용)
import * as splitProduct from './templates/hero/split-product';
import * as statsCenter from './templates/hero/stats-center';
import * as colorBold from './templates/hero/color-bold';
import * as darkPremium from './templates/hero/dark-premium';

// ============================================================
// Template Registry v2
// ============================================================

interface Template { html: string; css: string }

const TEMPLATE_MAP: Record<string, Template> = {
  // ChatGPT 생성 (고퀄리티 추가분)
  feature_horizontal_price_card: horizontalPriceCard,
  feature_cs_channel_guide: csChannelGuide,
  feature_refund_guarantee: refundGuarantee,
  feature_special_offer_card: specialOfferCard,
  feature_bundle_lineup_cards: bundleLineupCards,
  feature_influencer_chat_reviews: influencerChatReviews,
  feature_insta_photo_review: instaPhotoReview,
  feature_brand_statement: brandStatement,
  feature_vs_comparison_table: vsComparisonTable,
  feature_satisfaction_bar_chart: satisfactionBarChart,
  feature_ticket_cta: ticketCta,
  feature_bento_benefits_grid: bentoBenefitsGrid,
  feature_floating_review_bubbles: floatingReviewBubbles,
  feature_qa_card_list: qaCardList,
  feature_side_stats_proof: sideStatsProof,
  feature_lifestyle_overlay: lifestyleOverlay,
  feature_before_after_arrow: beforeAfterArrow,
  feature_target_checklist: targetChecklist,
  feature_step_list_vertical: stepListVertical,
  feature_dark_glow_feature: darkGlowFeature,
  feature_point_showcase: pointShowcase,
  feature_b2b_three_cols: b2bThreeCols,
  feature_zigzag_showcase: zigzagShowcase,
  feature_elegant_grid: elegantGrid,
  feature_steam_list: steamList,
  feature_the_danbaek_grid: theDanbaekGrid,
  hero_shilla_vvip: shillaVvip,
  hero_collagen_effect: collagenEffect,
  hero_fromeat_poster: fromeatPoster,
  hero_mamonde_cream: mamondeCream,
  hero_press_shot: pressShot,
  hero_myfit_poster: myfitPoster,
  hero_dynamic_poster: dynamicPoster,
  hero_vertical_showcase: verticalShowcase,
  hero_high_converting: highConverting,
  hero_pink_gradient: pinkGradient,
  hero_fullscreen_center: highConverting,
  hero_gradient: darkLuxuryPro,
  hero_product_center: darkLuxuryPro,
  hero_gradient_overlay: darkAward,
  hero_video_style: darkAward,
  hero_award_light: awardLight,
  hero_dark_bold: darkBoldRed,
  hero_sleek_event: sleekEvent,
  hero_tech_specs: techSpecs,
  hero_sale_cloud: saleCloud,
  hero_neon_dark: neonRetinol,
  hero_event_promo: eventPromo,

  // Section 2 - Features (고퀄리티)
  feat_high_converting: featHighConverting,
  features_3col_cards: featHighConverting,
  feat_3col_grid: featHighConverting,
  feat_card_grid: featHighConverting,

  // 직접 작성 (폴백)
  hero_split_left: splitProduct,
  hero_split_right: splitProduct,
  hero_left_right: splitProduct,
  hero_split: splitProduct,
  hero_card: splitProduct,
  hero_minimal_typo: statsCenter,
  hero_video_bg: colorBold,
};

export function renderWithTemplate(
  patternId: string,
  copy: CopyBlock,
  tokens: DesignTokens,
): { html: string; css: string } | null {
  const template = TEMPLATE_MAP[patternId];
  if (!template) return null;

  const renderedHtml = injectContent(template.html, copy);
  const renderedCss = tokensToCssVars(tokens) + '\n' + template.css;

  return { html: renderedHtml, css: renderedCss };
}

export function getRegisteredPatterns(): string[] {
  return Object.keys(TEMPLATE_MAP);
}

export function getAllTemplateNames(): string[] {
  const unique = new Set(Object.values(TEMPLATE_MAP).map((t) => {
    const match = t.html.match(/class="([a-z]+-hero|dlp-hero|hero-bg)/);
    return match?.[1] ?? 'unknown';
  }));
  return [...unique];
}
