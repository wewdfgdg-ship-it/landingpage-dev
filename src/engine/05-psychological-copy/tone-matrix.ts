// ============================================================
// 톤 매트릭스 — 규칙 엔진 (AI 호출 없음)
// 산업(industry) × 톤 일관성 검사
// 카피가 해당 산업의 톤 가이드라인에 맞는지 점수화
// ============================================================

import type { CopyBlock } from './types';

/** 톤 규칙: 특정 산업에서 기대되는 카피 특성 */
export interface ToneRule {
  id: string;
  label: string;
  weight: number;
  check: (copy: CopyBlock) => boolean;
}

export interface ToneProfile {
  industry: string;
  description: string;
  rules: ToneRule[];
}

// --- 공통 검사 함수 ---

/** 문장이 짧고 임팩트 있는지 (15자 이하 헤드라인) */
const isShortHeadline = (c: CopyBlock): boolean =>
  c.headline.trim().length > 0 && c.headline.trim().length <= 18;

/** 본문이 간결한지 (200자 이내) */
const isConciseBody = (c: CopyBlock): boolean =>
  c.body.trim().length > 0 && c.body.trim().length <= 200;

/** 수치/데이터가 포함되어 있는지 */
const hasNumbers = (c: CopyBlock): boolean =>
  /\d/.test(c.body) || /\d/.test(c.headline) || c.bulletPoints.some((b) => /\d/.test(b));

/** 감성적 표현이 있는지 (느낌, 감정, 경험 관련 키워드) */
const hasEmotionalWords = (c: CopyBlock): boolean => {
  const text = `${c.headline} ${c.subheadline} ${c.body}`;
  return /느끼|경험|감동|설레|행복|편안|자신감|만족|특별|아름다|빛나|사랑/.test(text);
};

/** 전문 용어 / 신뢰 표현이 있는지 */
const hasProfessionalTerms = (c: CopyBlock): boolean => {
  const text = `${c.headline} ${c.subheadline} ${c.body} ${c.bulletPoints.join(' ')}`;
  return /인증|특허|검증|임상|연구|전문|기술|시스템|솔루션|플랫폼|분석|데이터|보장/.test(text);
};

/** 행동 유도 CTA가 강한지 */
const hasStrongCta = (c: CopyBlock): boolean =>
  c.ctaText.trim().length >= 3 && c.ctaText.trim().length <= 12;

/** 불릿 포인트가 충분한지 */
const hasEnoughBullets = (c: CopyBlock): boolean =>
  c.bulletPoints.filter((b) => b.trim().length > 0).length >= 3;

/** 혜택 중심 표현인지 */
const hasBenefitLanguage = (c: CopyBlock): boolean => {
  const text = `${c.headline} ${c.subheadline} ${c.body} ${c.bulletPoints.join(' ')}`;
  return /할인|무료|혜택|절약|특가|이벤트|선물|보너스|적립|쿠폰|%/.test(text);
};

/** 신뢰 요소가 있는지 */
const hasTrustSignals = (c: CopyBlock): boolean => {
  const text = `${c.body} ${c.bulletPoints.join(' ')} ${c.microCopy}`;
  return /후기|리뷰|만족|고객|이상|보장|환불|인증|수상|평점|★/.test(text);
};

// --- 산업별 톤 프로필 ---

const PROFILES: Record<string, ToneProfile> = {
  saas: {
    industry: 'saas',
    description: '명확하고 간결한, 데이터 중심',
    rules: [
      { id: 'short_headline', label: '간결한 헤드라인', weight: 0.2, check: isShortHeadline },
      { id: 'concise_body', label: '간결한 본문', weight: 0.15, check: isConciseBody },
      { id: 'data_driven', label: '수치 기반', weight: 0.2, check: hasNumbers },
      { id: 'professional', label: '전문 용어 사용', weight: 0.15, check: hasProfessionalTerms },
      { id: 'strong_cta', label: '명확한 CTA', weight: 0.15, check: hasStrongCta },
      { id: 'trust_signals', label: '신뢰 신호', weight: 0.15, check: hasTrustSignals },
    ],
  },
  ecommerce: {
    industry: 'ecommerce',
    description: '친근하고 직관적인, 혜택 강조',
    rules: [
      { id: 'short_headline', label: '직관적 헤드라인', weight: 0.15, check: isShortHeadline },
      { id: 'benefit_language', label: '혜택 표현', weight: 0.2, check: hasBenefitLanguage },
      { id: 'enough_bullets', label: '충분한 불릿', weight: 0.15, check: hasEnoughBullets },
      { id: 'strong_cta', label: '강한 CTA', weight: 0.2, check: hasStrongCta },
      { id: 'trust_signals', label: '신뢰 요소', weight: 0.15, check: hasTrustSignals },
      { id: 'numbers', label: '구체적 수치', weight: 0.15, check: hasNumbers },
    ],
  },
  beauty: {
    industry: 'beauty',
    description: '감성적이고 트렌디한, 비주얼 중심',
    rules: [
      { id: 'emotional', label: '감성적 표현', weight: 0.25, check: hasEmotionalWords },
      { id: 'short_headline', label: '감각적 헤드라인', weight: 0.15, check: isShortHeadline },
      { id: 'concise_body', label: '간결한 본문', weight: 0.15, check: isConciseBody },
      { id: 'trust_signals', label: '신뢰 요소', weight: 0.15, check: hasTrustSignals },
      { id: 'visual_direction', label: '이미지 디렉션', weight: 0.15, check: (c) => c.imageDirection.trim().length >= 5 },
      { id: 'strong_cta', label: 'CTA', weight: 0.15, check: hasStrongCta },
    ],
  },
  health: {
    industry: 'health',
    description: '신뢰감 있는, 전문적이면서 따뜻한',
    rules: [
      { id: 'professional', label: '전문 표현', weight: 0.2, check: hasProfessionalTerms },
      { id: 'trust_signals', label: '신뢰 신호', weight: 0.2, check: hasTrustSignals },
      { id: 'data_driven', label: '수치 근거', weight: 0.2, check: hasNumbers },
      { id: 'emotional', label: '따뜻한 감성', weight: 0.15, check: hasEmotionalWords },
      { id: 'enough_bullets', label: '정보 불릿', weight: 0.15, check: hasEnoughBullets },
      { id: 'strong_cta', label: 'CTA', weight: 0.1, check: hasStrongCta },
    ],
  },
  food: {
    industry: 'food',
    description: '자연스럽고 건강한, 신뢰감 있는',
    rules: [
      { id: 'emotional', label: '감성적 표현', weight: 0.2, check: hasEmotionalWords },
      { id: 'trust_signals', label: '신뢰 요소', weight: 0.2, check: hasTrustSignals },
      { id: 'numbers', label: '구체적 수치', weight: 0.15, check: hasNumbers },
      { id: 'short_headline', label: '간결한 헤드라인', weight: 0.15, check: isShortHeadline },
      { id: 'enough_bullets', label: '불릿 포인트', weight: 0.15, check: hasEnoughBullets },
      { id: 'strong_cta', label: 'CTA', weight: 0.15, check: hasStrongCta },
    ],
  },
  education: {
    industry: 'education',
    description: '동기부여하는, 구체적 결과 중심',
    rules: [
      { id: 'data_driven', label: '결과 수치', weight: 0.2, check: hasNumbers },
      { id: 'benefit_language', label: '혜택 표현', weight: 0.2, check: hasBenefitLanguage },
      { id: 'trust_signals', label: '신뢰 요소', weight: 0.15, check: hasTrustSignals },
      { id: 'emotional', label: '동기부여', weight: 0.15, check: hasEmotionalWords },
      { id: 'enough_bullets', label: '커리큘럼 불릿', weight: 0.15, check: hasEnoughBullets },
      { id: 'strong_cta', label: 'CTA', weight: 0.15, check: hasStrongCta },
    ],
  },
  finance: {
    industry: 'finance',
    description: '보수적이고 신뢰감 있는, 수치 중심',
    rules: [
      { id: 'data_driven', label: '수치 근거', weight: 0.25, check: hasNumbers },
      { id: 'professional', label: '전문 용어', weight: 0.2, check: hasProfessionalTerms },
      { id: 'trust_signals', label: '신뢰 신호', weight: 0.2, check: hasTrustSignals },
      { id: 'concise_body', label: '간결한 본문', weight: 0.15, check: isConciseBody },
      { id: 'strong_cta', label: 'CTA', weight: 0.1, check: hasStrongCta },
      { id: 'enough_bullets', label: '불릿', weight: 0.1, check: hasEnoughBullets },
    ],
  },
  b2b: {
    industry: 'b2b',
    description: '전문적이고 논리적인, ROI 중심',
    rules: [
      { id: 'professional', label: '전문 표현', weight: 0.2, check: hasProfessionalTerms },
      { id: 'data_driven', label: 'ROI 수치', weight: 0.2, check: hasNumbers },
      { id: 'enough_bullets', label: '기능 불릿', weight: 0.2, check: hasEnoughBullets },
      { id: 'concise_body', label: '논리적 본문', weight: 0.15, check: isConciseBody },
      { id: 'trust_signals', label: '신뢰 신호', weight: 0.15, check: hasTrustSignals },
      { id: 'strong_cta', label: 'CTA', weight: 0.1, check: hasStrongCta },
    ],
  },
  lifestyle: {
    industry: 'lifestyle',
    description: '감정적이고 공감하는, 스토리텔링',
    rules: [
      { id: 'emotional', label: '감성적 표현', weight: 0.25, check: hasEmotionalWords },
      { id: 'short_headline', label: '감각적 헤드라인', weight: 0.15, check: isShortHeadline },
      { id: 'trust_signals', label: '신뢰 요소', weight: 0.15, check: hasTrustSignals },
      { id: 'visual_direction', label: '이미지 디렉션', weight: 0.15, check: (c) => c.imageDirection.trim().length >= 5 },
      { id: 'strong_cta', label: 'CTA', weight: 0.15, check: hasStrongCta },
      { id: 'enough_bullets', label: '불릿', weight: 0.15, check: hasEnoughBullets },
    ],
  },
};

// 기본 프로필 (매핑 안 되는 산업용)
const DEFAULT_PROFILE: ToneProfile = {
  industry: 'other',
  description: '명확하고 설득력 있는, 균형 잡힌',
  rules: [
    { id: 'short_headline', label: '간결한 헤드라인', weight: 0.2, check: isShortHeadline },
    { id: 'concise_body', label: '간결한 본문', weight: 0.2, check: isConciseBody },
    { id: 'numbers', label: '구체적 수치', weight: 0.15, check: hasNumbers },
    { id: 'strong_cta', label: 'CTA', weight: 0.15, check: hasStrongCta },
    { id: 'enough_bullets', label: '불릿', weight: 0.15, check: hasEnoughBullets },
    { id: 'trust_signals', label: '신뢰 요소', weight: 0.15, check: hasTrustSignals },
  ],
};

/** 산업별 톤 프로필 반환 */
export function getToneProfile(industry: string): ToneProfile {
  return PROFILES[industry] ?? DEFAULT_PROFILE;
}

/** 톤 점수 결과 */
export interface ToneScoreResult {
  score: number;
  industry: string;
  passedRules: string[];
  failedRules: string[];
}

/** 단일 섹션의 톤 일관성 점수 (0~100) */
export function scoreTone(industry: string, copy: CopyBlock): ToneScoreResult {
  const profile = getToneProfile(industry);
  let score = 0;
  const passedRules: string[] = [];
  const failedRules: string[] = [];

  for (const rule of profile.rules) {
    if (rule.check(copy)) {
      score += rule.weight * 100;
      passedRules.push(rule.label);
    } else {
      failedRules.push(rule.label);
    }
  }

  return {
    score: Math.round(score),
    industry: profile.industry,
    passedRules,
    failedRules,
  };
}
