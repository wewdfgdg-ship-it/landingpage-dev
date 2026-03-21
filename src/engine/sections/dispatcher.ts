// ============================================================
// Section Dispatcher — ③ 전략 → 26개 섹션 에이전트 디스패치
// strategyBlueprint.structure를 기반으로 필요한 섹션 에이전트 선택+실행
// ============================================================

import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint, StructureSection } from '@/engine/03-conversion-strategy/types';
import type { ObjectionMap } from '@/engine/04-objection-killer/types';
import type { SectionAgentInput, SectionAgentOutput, SectionKey } from '@/engine/sections/types';

import { runHeaderBanner } from '@/engine/sections/01-header-banner';
import { runKeyFeatures } from '@/engine/sections/02-key-features';
import { runFeatureDetail1 } from '@/engine/sections/03-feature-detail-1';
import { runFeatureDetail2 } from '@/engine/sections/04-feature-detail-2';
import { runFeatureDetail3 } from '@/engine/sections/05-feature-detail-3';
import { runSpecs } from '@/engine/sections/06-specs';
import { runHowToUse } from '@/engine/sections/07-how-to-use';
import { runTargetPersona } from '@/engine/sections/08-target-persona';
import { runBeforeAfter } from '@/engine/sections/09-before-after';
import { runLifestyle } from '@/engine/sections/10-lifestyle';
import { runCertification } from '@/engine/sections/11-certification';
import { runFaq } from '@/engine/sections/12-faq';
import { runReviews } from '@/engine/sections/13-reviews';
import { runShipping } from '@/engine/sections/14-shipping';
import { runCta } from '@/engine/sections/15-cta';
import { runStatsNumbers } from '@/engine/sections/16-stats-numbers';
import { runCompetitorCompare } from '@/engine/sections/17-competitor-compare';
import { runBrandStory } from '@/engine/sections/18-brand-story';
import { runPackageContents } from '@/engine/sections/19-package-contents';
import { runPhotoReviews } from '@/engine/sections/20-photo-reviews';
import { runSnsViral } from '@/engine/sections/21-sns-viral';
import { runBundleSet } from '@/engine/sections/22-bundle-set';
import { runLimitedOffer } from '@/engine/sections/23-limited-offer';
import { runRefundPolicy } from '@/engine/sections/24-refund-policy';
import { runCustomerService } from '@/engine/sections/25-customer-service';
import { runPriceTable } from '@/engine/sections/26-price-table';

// ────────────────────────────────────────────────────────────
// 섹션 에이전트 레지스트리
// ────────────────────────────────────────────────────────────

const AGENT_REGISTRY: Record<SectionKey, (input: SectionAgentInput) => SectionAgentOutput> = {
  HEADER_BANNER: runHeaderBanner,
  KEY_FEATURES: runKeyFeatures,
  FEATURE_DETAIL_1: runFeatureDetail1,
  FEATURE_DETAIL_2: runFeatureDetail2,
  FEATURE_DETAIL_3: runFeatureDetail3,
  SPECS: runSpecs,
  HOW_TO_USE: runHowToUse,
  TARGET_PERSONA: runTargetPersona,
  BEFORE_AFTER: runBeforeAfter,
  LIFESTYLE: runLifestyle,
  CERTIFICATION: runCertification,
  FAQ: runFaq,
  REVIEWS: runReviews,
  SHIPPING: runShipping,
  CTA: runCta,
  STATS_NUMBERS: runStatsNumbers,
  COMPETITOR_COMPARE: runCompetitorCompare,
  BRAND_STORY: runBrandStory,
  PACKAGE_CONTENTS: runPackageContents,
  PHOTO_REVIEWS: runPhotoReviews,
  SNS_VIRAL: runSnsViral,
  BUNDLE_SET: runBundleSet,
  LIMITED_OFFER: runLimitedOffer,
  REFUND_POLICY: runRefundPolicy,
  CUSTOMER_SERVICE: runCustomerService,
  PRICE_TABLE: runPriceTable,
};

// ────────────────────────────────────────────────────────────
// sectionType(③ 출력) → SectionKey 매핑
// ③이 출력하는 sectionType 문자열을 26개 SectionKey로 변환
// ────────────────────────────────────────────────────────────

const SECTION_TYPE_MAP: Record<string, SectionKey> = {
  // Hero
  hero_visual: 'HEADER_BANNER',
  hero_banner: 'HEADER_BANNER',
  hero: 'HEADER_BANNER',

  // Features
  benefit_highlight: 'KEY_FEATURES',
  key_features: 'KEY_FEATURES',
  features: 'KEY_FEATURES',
  feature_detail: 'FEATURE_DETAIL_1',
  feature_detail_1: 'FEATURE_DETAIL_1',
  feature_detail_2: 'FEATURE_DETAIL_2',
  feature_detail_3: 'FEATURE_DETAIL_3',

  // Specs & How-to
  specs: 'SPECS',
  specifications: 'SPECS',
  how_to_use: 'HOW_TO_USE',
  usage_guide: 'HOW_TO_USE',

  // Pain & Persona
  pain_point: 'BEFORE_AFTER',
  pain_solution: 'BEFORE_AFTER',
  before_after: 'BEFORE_AFTER',
  target_persona: 'TARGET_PERSONA',
  persona: 'TARGET_PERSONA',

  // Social Proof
  social_proof: 'REVIEWS',
  testimonial: 'REVIEWS',
  reviews: 'REVIEWS',
  photo_reviews: 'PHOTO_REVIEWS',
  certification: 'CERTIFICATION',
  awards: 'CERTIFICATION',
  stats: 'STATS_NUMBERS',
  numbers: 'STATS_NUMBERS',

  // Trust & Objection
  trust_signals: 'CERTIFICATION',
  guarantee: 'REFUND_POLICY',
  refund: 'REFUND_POLICY',
  warranty: 'REFUND_POLICY',

  // Content
  lifestyle: 'LIFESTYLE',
  brand_story: 'BRAND_STORY',
  brand: 'BRAND_STORY',
  faq: 'FAQ',
  shipping: 'SHIPPING',
  delivery: 'SHIPPING',

  // Comparison & Pricing
  comparison: 'COMPETITOR_COMPARE',
  competitor: 'COMPETITOR_COMPARE',
  pricing: 'PRICE_TABLE',
  price_table: 'PRICE_TABLE',

  // CTA & Urgency
  cta: 'CTA',
  final_cta: 'CTA',
  urgency: 'LIMITED_OFFER',
  limited_offer: 'LIMITED_OFFER',
  countdown: 'LIMITED_OFFER',

  // Bundle & Extra
  bundle: 'BUNDLE_SET',
  package: 'PACKAGE_CONTENTS',
  package_contents: 'PACKAGE_CONTENTS',
  sns: 'SNS_VIRAL',
  sns_viral: 'SNS_VIRAL',
  customer_service: 'CUSTOMER_SERVICE',
  support: 'CUSTOMER_SERVICE',
};

function resolveKey(sectionType: string): SectionKey {
  const normalized = sectionType.toLowerCase().trim();
  return SECTION_TYPE_MAP[normalized] ?? 'KEY_FEATURES';
}

// ────────────────────────────────────────────────────────────
// 디스패치 입력/출력
// ────────────────────────────────────────────────────────────

export interface DispatchInput {
  brief: ProductBrief;
  blueprint: StrategyBlueprint;
  objectionMap: ObjectionMap;
  productName: string;
  industry: string;
}

export interface DispatchResult {
  sections: SectionAgentOutput[];
  dispatched: number;
}

// ────────────────────────────────────────────────────────────
// 메인: 디스패치 실행
// ────────────────────────────────────────────────────────────

export function dispatchSections(input: DispatchInput): DispatchResult {
  const { brief, blueprint, objectionMap, productName, industry } = input;

  // 중복 SectionKey 방지 (같은 섹션 두 번 실행 방지)
  const usedKeys = new Set<SectionKey>();
  // feature_detail은 1→2→3 순서로 배정
  let featureDetailIndex = 0;

  const sections: SectionAgentOutput[] = [];

  for (const structSection of blueprint.structure) {
    let sectionKey = resolveKey(structSection.sectionType);

    // feature_detail 순차 배정
    if (structSection.sectionType.includes('feature_detail') && !structSection.sectionType.includes('_1') && !structSection.sectionType.includes('_2') && !structSection.sectionType.includes('_3')) {
      const detailKeys: SectionKey[] = ['FEATURE_DETAIL_1', 'FEATURE_DETAIL_2', 'FEATURE_DETAIL_3'];
      sectionKey = detailKeys[featureDetailIndex % 3];
      featureDetailIndex++;
    }

    // 중복 방지: 같은 키 이미 사용 → 스킵 (CTA는 중복 허용)
    if (usedKeys.has(sectionKey) && sectionKey !== 'CTA') continue;
    usedKeys.add(sectionKey);

    // objection 정보를 strategyHint에 포함
    const objectionHints = buildObjectionHints(structSection, objectionMap);
    const tone = deriveTone(brief.decisionType);
    const emotion = deriveEmotion(structSection.role);

    const agentInput: SectionAgentInput = {
      sectionKey,
      order: structSection.order,
      productName,
      industry,
      brief,
      strategyHint: `${structSection.purpose}. ${objectionHints}`,
      tone,
      targetEmotion: emotion,
    };

    const runner = AGENT_REGISTRY[sectionKey];
    const result = runner(agentInput);
    sections.push(result);
  }

  return { sections, dispatched: sections.length };
}

// ────────────────────────────────────────────────────────────
// 헬퍼
// ────────────────────────────────────────────────────────────

function buildObjectionHints(
  section: StructureSection,
  objectionMap: ObjectionMap,
): string {
  // 섹션 역할에 맞는 반론 전략 힌트 추가
  const hints: string[] = [];

  if (section.role === 'OBJECTION' || section.role === 'PROOF') {
    for (const strategy of objectionMap.activeObjections) {
      hints.push(strategy.copyDirection);
    }
  }

  return hints.length > 0 ? `반론방어: ${hints.join('. ')}` : '';
}

function deriveTone(decisionType: string): string {
  switch (decisionType) {
    case 'impulse': return '강렬하고 직관적';
    case 'analytical': return '논리적이고 전문적';
    case 'cautious': return '안심시키고 신뢰감';
    case 'follower': return '트렌디하고 사회적';
    default: return '깔끔하고 명확';
  }
}

function deriveEmotion(role: string): string {
  switch (role) {
    case 'HOOK': return '즉시 주목';
    case 'PAIN': return '공감과 불편함';
    case 'SOLUTION': return '해결의 기대감';
    case 'PROOF': return '확신과 신뢰';
    case 'OBJECTION': return '안심과 해소';
    case 'URGENCY': return '긴급한 행동 욕구';
    case 'CTA': return '행동 결심';
    default: return '관심과 호기심';
  }
}
