/**
 * 파이프라인 → ProductData 어댑터
 *
 * AI 파이프라인(01~09) 출력을 오케스트레이터의 ProductData로 변환
 *
 * 사용:
 *   const productData = pipelineToProductData(brief, sections, wizardInput);
 *   const html = renderBundle('beauty', 'a', productData);
 */

import type { ProductBrief } from "@/engine/01-product-intelligence/types";
import type { SectionAgentOutput, SectionKey } from "@/engine/sections/types";
import type { ProductData } from "./orchestrator";

/** 위저드 입력 (최소 필요 정보) */
export interface WizardInput {
  productName: string;
  industry: string;
  priceRange?: string;
  brandColor?: string;
  fontSet?: string;
  imageUrls?: string[];
}

/** 섹션 출력에서 특정 키의 카피 추출 */
function findSection(sections: SectionAgentOutput[], key: SectionKey): SectionAgentOutput | undefined {
  return sections.find((s) => s.sectionKey === key);
}

/** USP 배열 → features 변환 */
function briefToFeatures(brief: ProductBrief): ProductData["features"] {
  return brief.productDNA.usp.map((usp, i) => ({
    title: usp,
    description: "",
    icon: ["⚡", "💧", "🛡️", "✨", "🎯"][i] || "•",
  }));
}

/** 섹션 출력에서 stats 추출 */
function extractStats(sections: SectionAgentOutput[]): ProductData["stats"] {
  const statsSection = findSection(sections, "STATS_NUMBERS");
  if (!statsSection) return undefined;

  // bulletPoints에서 숫자 추출 시도
  return statsSection.copy.bulletPoints.slice(0, 4).map((bp) => {
    const match = bp.match(/^(\d[\d,.]*)\s*(\S+)?\s*(.*)$/);
    if (match) {
      return { number: match[1], unit: match[2] || "", label: match[3] || bp };
    }
    return { number: "", unit: "", label: bp };
  }).filter((s) => s.number || s.label);
}

/** 섹션 출력에서 reviews 추출 */
function extractReviews(sections: SectionAgentOutput[]): ProductData["reviews"] {
  const reviewSection = findSection(sections, "REVIEWS");
  if (!reviewSection) return undefined;

  return reviewSection.copy.bulletPoints.slice(0, 3).map((bp, i) => ({
    quote: bp,
    author: `고객 ${String.fromCharCode(65 + i)}`,
    rating: 5,
  }));
}

/** 섹션 출력에서 FAQ 추출 */
function extractFaq(sections: SectionAgentOutput[]): ProductData["faqItems"] {
  const faqSection = findSection(sections, "FAQ");
  if (!faqSection) return undefined;

  return faqSection.copy.bulletPoints.slice(0, 5).map((bp) => {
    const parts = bp.split(/[?？]/, 2);
    return {
      question: (parts[0] || bp).trim() + "?",
      answer: (parts[1] || "자세한 내용은 고객센터로 문의해주세요.").trim(),
    };
  });
}

/** 섹션 출력에서 awards 추출 */
function extractAwards(sections: SectionAgentOutput[]): ProductData["awards"] {
  const certSection = findSection(sections, "CERTIFICATION");
  if (!certSection) return undefined;

  return certSection.copy.bulletPoints.slice(0, 4).map((bp) => ({
    name: bp,
    icon: "🏅",
  }));
}

/** 메인: 파이프라인 출력 → ProductData */
export function pipelineToProductData(
  brief: ProductBrief,
  sections: SectionAgentOutput[],
  wizard: WizardInput,
): ProductData {
  const heroSection = findSection(sections, "HEADER_BANNER");
  const kfSection = findSection(sections, "KEY_FEATURES");
  const ctaSection = findSection(sections, "CTA");
  const specsSection = findSection(sections, "SPECS");

  return {
    productName: wizard.productName,
    brandColor: wizard.brandColor || ctaSection?.style.accentColor || "#4A90D9",
    fontSet: wizard.fontSet,

    // 카피
    headline: heroSection?.copy.headline || brief.productDNA.coreValue,
    subheadline: heroSection?.copy.subheadline || brief.productDNA.usp[0] || "",

    // Hero 이미지
    heroImageUrl: wizard.imageUrls?.[0],

    // 특징 (KF에서 추출, 없으면 USP에서)
    features: kfSection
      ? kfSection.copy.bulletPoints.map((bp, i) => ({
          title: bp,
          description: "",
          icon: ["⚡", "💧", "🛡️", "✨", "🎯"][i] || "•",
        }))
      : briefToFeatures(brief),

    // 스펙
    specs: specsSection
      ? specsSection.copy.bulletPoints.map((bp) => {
          const [label, ...rest] = bp.split(/[:：]/);
          return { label: label.trim(), value: rest.join(":").trim() || undefined };
        })
      : undefined,

    // 리뷰
    reviews: extractReviews(sections),

    // FAQ
    faqItems: extractFaq(sections),

    // 숫자 실적
    stats: extractStats(sections),

    // 수상/인증
    awards: extractAwards(sections),

    // CTA
    ctaText: ctaSection?.copy.ctaText || heroSection?.copy.ctaText || "자세히 보기",
    microCopy: ctaSection?.copy.microCopy || "",

    // 혜택 (CTA bulletPoints에서)
    benefits: ctaSection
      ? ctaSection.copy.bulletPoints.map((bp) => ({ text: bp }))
      : brief.productDNA.usp.map((usp) => ({ text: usp })),

    // 비교 (경쟁사 비교 섹션에서)
    compareRows: findSection(sections, "COMPETITOR_COMPARE")
      ? findSection(sections, "COMPETITOR_COMPARE")!.copy.bulletPoints.map((bp) => {
          const [label, ...rest] = bp.split(/[:：]/);
          return { label: label.trim(), ours: "✅", theirs: rest.join(":").trim() || "❌" };
        })
      : undefined,

    // 가격
    pricing: wizard.priceRange
      ? { salePrice: wizard.priceRange }
      : undefined,

    // 이미지
    images: wizard.imageUrls?.map((url) => ({ url })),
  };
}

/** ProductBrief만으로 최소 ProductData 생성 (섹션 출력 없이) */
export function briefToProductData(brief: ProductBrief, wizard: WizardInput): ProductData {
  return {
    productName: wizard.productName,
    brandColor: wizard.brandColor || "#4A90D9",
    fontSet: wizard.fontSet,
    headline: brief.productDNA.coreValue,
    subheadline: brief.productDNA.usp[0] || "",
    heroImageUrl: wizard.imageUrls?.[0],
    features: briefToFeatures(brief),
    benefits: brief.productDNA.usp.map((usp) => ({ text: usp })),
    ctaText: "자세히 보기",
  };
}
