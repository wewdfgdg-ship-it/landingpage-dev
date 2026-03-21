/**
 * 번들 오케스트레이터 — 번들 데이터 → 실제 HTML 렌더
 *
 * 사용:
 *   const html = renderBundle('beauty', 'a', productData);
 *   const html = renderBundleWithDefaults('beauty', productData);
 */

import { getBundle, getDefaultBundle, type BundleSection, type Industry, type BundleVariant, type LandingBundle } from "./landing-bundles";
import { sectionTokenCSS } from "./common-tokens/tokens";
import { renderHeroBanner, type LayoutData as HeroLayoutData } from "./01-header-banner/render";
import type { HeroMood } from "./01-header-banner/types";
import type { FontSetId } from "./01-header-banner/fonts";
import { getFontLinks, getFontFamilies } from "./01-header-banner/fonts";
import { globalCtaCSS } from "./common-tokens/cta";

// ── Section Renderers ──
import { renderSection as renderKF } from "./02-key-features/index";
import { keyFeaturesStyles } from "./02-key-features/styles";
import { renderSection as renderFD } from "./common-feature-detail/index";
import { featureDetailStyles } from "./common-feature-detail/styles";
import { renderSection as renderSI } from "./common-spec-info/index";
import { specInfoStyles } from "./common-spec-info/styles";
import { renderSection as renderBA } from "./common-before-after/index";
import { beforeAfterStyles } from "./common-before-after/styles";
import { renderSection as renderLS } from "./common-lifestyle/index";
import { lifestyleStyles } from "./common-lifestyle/styles";
import { renderSection as renderTR } from "./common-trust/index";
import { trustStyles } from "./common-trust/styles";
import { renderSection as renderFaq } from "./common-faq/index";
import { faqStyles } from "./common-faq/styles";
import { renderSection as renderRV } from "./common-reviews/index";
import { reviewsStyles } from "./common-reviews/styles";
import { renderSection as renderCTA } from "./common-cta/index";
import { ctaStyles } from "./common-cta/styles";
import { renderSection as renderST } from "./common-stats/index";
import { statsStyles } from "./common-stats/styles";
import { renderSection as renderCM } from "./common-comparison/index";
import { comparisonStyles } from "./common-comparison/styles";
import { renderSection as renderBN } from "./common-bundle/index";
import { bundleStyles } from "./common-bundle/styles";
import { renderSection as renderPH } from "./common-photo-review/index";
import { photoReviewStyles } from "./common-photo-review/styles";
import { renderSection as renderPL } from "./common-promo/index";
import { promoStyles } from "./common-promo/styles";
import { renderSection as renderPR } from "./common-pricing/index";
import { pricingStyles } from "./common-pricing/styles";

// ── UI → Engine 업종 매핑 ──
const INDUSTRY_MAP: Record<string, Industry> = {
  beauty: "beauty",
  food: "food",
  electronics: "electronics",
  fashion: "fashion",
  living: "living",
  saas: "saas",
  education: "education",
  enterprise: "enterprise",
  b2b: "enterprise",
  ecommerce: "electronics",
  health: "food",
  finance: "enterprise",
  lifestyle: "living",
  other: "beauty",
};

export function resolveIndustry(uiIndustry: string): Industry {
  return INDUSTRY_MAP[uiIndustry.toLowerCase()] || "beauty";
}

// ── 모든 CSS 합치기 ──
export function getAllStyles(): string {
  return [
    sectionTokenCSS,
    globalCtaCSS,
    keyFeaturesStyles,
    featureDetailStyles,
    specInfoStyles,
    beforeAfterStyles,
    lifestyleStyles,
    trustStyles,
    faqStyles,
    reviewsStyles,
    ctaStyles,
    statsStyles,
    comparisonStyles,
    bundleStyles,
    photoReviewStyles,
    promoStyles,
    pricingStyles,
  ].join("\n");
}

// ── 제품 데이터 타입 ──
export type ProductData = {
  productName: string;
  brandColor?: string;
  headline?: string;
  subheadline?: string;
  features?: { title: string; description?: string; icon?: string; imageUrl?: string; badge?: string }[];
  specs?: { label: string; value?: string; description?: string; icon?: string; note?: string; badge?: string }[];
  reviews?: { quote: string; author: string; meta?: string; rating?: number; imageUrl?: string; tags?: string[] }[];
  faqItems?: { question: string; answer: string }[];
  stats?: { number: string; unit?: string; label: string; description?: string }[];
  awards?: { name: string; icon?: string; description?: string }[];
  benefits?: { icon?: string; text: string }[];
  bundleItems?: { name: string; quantity?: number; imageUrl?: string; badge?: string }[];
  compareRows?: { label: string; ours: string; theirs?: string }[];
  photoReviews?: { imageUrl: string; quote?: string; author?: string; rating?: number }[];
  pricing?: {
    originalPrice?: string;
    salePrice?: string;
    discount?: string;
    plans?: { name: string; price: string; originalPrice?: string; period?: string; benefits: { text: string }[]; badge?: string; recommended?: boolean; ctaText?: string }[];
  };
  images?: { url: string; alt?: string; caption?: string }[];
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  microCopy?: string;
  heroImageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  promoDeadline?: string;
  stockPercent?: number;
  averageRating?: number;
  totalReviews?: number;
  statSource?: string;
  /** AI가 결정하는 폰트셋 (SET-1~12). 없으면 기본 Pretendard */
  fontSet?: string;
};

// ── 섹션 렌더 매핑 ──
function renderSectionByFamily(
  section: BundleSection,
  data: ProductData,
  brandColor: string,
): string {
  const mood = section.mood;
  const bc = brandColor;

  switch (section.family) {
    case "hero": {
      // 번들 layoutId (hero-a~e) → 엔진 LayoutId (A~J) 매핑
      const HERO_LAYOUT_MAP: Record<string, string> = {
        "hero-a": "A",
        "hero-b": "B",
        "hero-c": "C",
        "hero-d": "G",
        "hero-e": "J",
      };
      const HERO_MOOD_MAP: Record<string, HeroMood> = {
        clean: "mood-clean",
        soft: "mood-soft",
        dark: "mood-dark",
        warm: "mood-warm",
        navy: "mood-navy",
      };
      const heroLayoutId = HERO_LAYOUT_MAP[section.layoutId] || "A";
      const heroMood = HERO_MOOD_MAP[mood] || "mood-dark";

      const heroData: HeroLayoutData = {
        layoutId: heroLayoutId as any,
        mood: heroMood,
        fontSet: (data.fontSet || "SET-1") as FontSetId,
        brandColor: bc,
        productName: data.productName,
        eyebrow: data.features?.[0]?.title || "",
        headline: data.headline || data.productName,
        subheadline: data.subheadline || "",
        desc: data.features?.map((f) => f.description).filter(Boolean).join(" · ") || "",
        stats: (data.stats || []).map((s) => ({ number: s.number, unit: s.unit || "", label: s.label })),
        awards: (data.awards || []).map((a) => a.name),
        ctaText: data.ctaText || "자세히 보기",
        microCopy: data.microCopy || "",
        imageUrl: data.heroImageUrl,
      };
      return renderHeroBanner(heroData);
    }

    case "t1":
      return renderKF({
        headline: data.headline || `${data.productName} 핵심 기능`,
        subheadline: data.subheadline,
        features: data.features,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t2":
      const fdIdx = section.order - 1;
      const feat = data.features?.[fdIdx] || data.features?.[0];
      return renderFD({
        sectionId: `0${Math.min(section.order, 5)}`,
        eyebrow: `POINT ${String(section.order - 1).padStart(2, "0")}`,
        headline: feat?.title || data.headline || "핵심 기능",
        body: feat?.description,
        imageUrl: feat?.imageUrl || data.heroImageUrl,
        mood, brandColor: bc, layoutId: section.layoutId as any,
        imageRight: section.order % 2 === 1,
      });

    case "t3":
      return renderSI({
        sectionId: `spec-${section.order}`,
        headline: "상세 정보",
        items: data.specs,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t4":
      return renderBA({
        headline: "사용 전후 비교",
        beforeImageUrl: data.beforeImageUrl,
        afterImageUrl: data.afterImageUrl,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t5":
      return renderLS({
        headline: data.headline || "일상 속 제품",
        subheadline: data.subheadline,
        images: data.images,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t6":
      return renderTR({
        headline: "인증 및 수상",
        awards: data.awards,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t7":
      return renderFaq({
        headline: "자주 묻는 질문",
        items: data.faqItems,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t8":
      return renderRV({
        headline: "고객 후기",
        reviews: data.reviews,
        averageRating: data.averageRating,
        totalCount: data.totalReviews,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t9":
      return renderCTA({
        headline: data.ctaText ? `${data.productName}, 지금 시작하세요` : "지금 시작하세요",
        benefits: data.benefits,
        cta: { text: data.ctaText || "구매하기", href: data.ctaHref },
        secondaryAction: data.secondaryCtaText ? { text: data.secondaryCtaText } : undefined,
        microCopy: data.microCopy,
        mood, brandColor: bc,
      });

    case "t10":
      return renderST({
        headline: "숫자로 증명합니다",
        stats: data.stats,
        source: data.statSource,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t11":
      return renderCM({
        headline: "비교 분석",
        ourName: data.productName,
        rows: data.compareRows,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t12":
      return renderBN({
        headline: "세트 구성",
        items: data.bundleItems,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t13":
      return renderPH({
        headline: "포토 리뷰",
        reviews: data.photoReviews,
        totalCount: data.totalReviews,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t14":
      return renderPL({
        headline: "한정 특가",
        deadline: data.promoDeadline,
        stockPercent: data.stockPercent,
        benefits: data.benefits,
        cta: { text: data.ctaText || "지금 구매하기" },
        microCopy: data.microCopy,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    case "t15":
      return renderPR({
        headline: "가격 안내",
        originalPrice: data.pricing?.originalPrice,
        salePrice: data.pricing?.salePrice,
        discount: data.pricing?.discount,
        plans: data.pricing?.plans,
        benefits: data.benefits,
        cta: { text: data.ctaText || "구매하기" },
        microCopy: data.microCopy,
        mood, brandColor: bc, layoutId: section.layoutId as any,
      });

    default:
      return `<!-- UNKNOWN FAMILY: ${section.family} -->`;
  }
}

// ── 메인: 번들 렌더 ──
export function renderBundleSections(bundle: LandingBundle, data: ProductData): string[] {
  const bc = data.brandColor || "#4A90D9";
  return bundle.sections.map((section) => renderSectionByFamily(section, data, bc));
}

export function renderBundleHTML(bundle: LandingBundle, data: ProductData): string {
  const sections = renderBundleSections(bundle, data);
  const fontSetId = (data.fontSet || "SET-1") as FontSetId;
  const fonts = getFontFamilies(fontSetId);
  const fontLinks = getFontLinks(fontSetId);

  const fontOverrideCSS = `
:root {
  --s-font-headline: ${fonts.headline};
  --s-font-sub: ${fonts.sub};
  --s-font-micro: ${fonts.micro};
  --s-font: ${fonts.sub};
}
[class$="__headline"],
[class$="__card-title"],
[class$="__stat-num"],
[class$="__big-num"],
[class$="__price-sale"],
[class$="__plan-name"] {
  font-family: var(--s-font-headline) !important;
}
[class$="__sub"],
[class$="__body"],
[class$="__desc"],
[class$="__card-desc"],
[class$="__step-desc"],
[class$="__quote"],
[class$="__a-text"],
[class$="__benefit-text"],
[class$="__q-text"] {
  font-family: var(--s-font-sub) !important;
}
[class$="__eyebrow"],
[class$="__micro"],
[class$="__footnote"],
[class$="__source"],
[class$="__caption"],
[class$="__author-meta"],
.s-cta-micro {
  font-family: var(--s-font-micro) !important;
}
`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.productName}</title>
  ${fontLinks}
  <style>${getAllStyles()}${fontOverrideCSS}</style>
</head>
<body>
  <div style="max-width:960px;margin:0 auto;">
    ${sections.join("\n")}
  </div>
</body>
</html>`;
}

/** 업종 + 변형으로 풀 HTML 렌더 */
export function renderBundle(industry: Industry, variant: BundleVariant, data: ProductData): string {
  const bundle = getBundle(industry, variant);
  if (!bundle) throw new Error(`Bundle not found: ${industry}-${variant}`);
  return renderBundleHTML(bundle, data);
}

/** 업종 기본 번들로 렌더 */
export function renderDefaultBundle(industry: Industry, data: ProductData): string {
  const bundle = getDefaultBundle(industry);
  return renderBundleHTML(bundle, data);
}

/** UI 업종명으로 기본 번들 렌더 (ecommerce → electronics 등 자동 매핑) */
export function renderFromUI(uiIndustry: string, data: ProductData): string {
  const industry = resolveIndustry(uiIndustry);
  return renderDefaultBundle(industry, data);
}
