// ============================================================
// 설득 프레임 매칭 — 규칙 엔진 (AI 호출 없음)
// 섹션 역할(role) × sectionType → 필수 설득 요소 정의
// 카피가 각 요소를 충족하는지 점수화
// ============================================================

import type { CopyBlock } from './types';

/** 설득 프레임: 해당 섹션에 반드시 들어가야 할 요소 */
export interface PersuasionFrame {
  role: string;
  requiredElements: FrameElement[];
}

export interface FrameElement {
  id: string;
  label: string;
  weight: number; // 0~1, 합계 1.0
  check: (copy: CopyBlock) => boolean;
}

// --- 공통 검사 함수 ---

const hasLength = (s: string, min: number): boolean => s.trim().length >= min;
const hasNumber = (s: string): boolean => /\d/.test(s);
const hasBullets = (arr: string[], min: number): boolean =>
  arr.filter((b) => b.trim().length > 0).length >= min;
const hasCta = (copy: CopyBlock): boolean => hasLength(copy.ctaText, 2);
const hasImageDir = (copy: CopyBlock): boolean => hasLength(copy.imageDirection, 5);

// --- 역할별 설득 프레임 ---

const HOOK_FRAME: PersuasionFrame = {
  role: 'HOOK',
  requiredElements: [
    { id: 'headline_impact', label: '임팩트 헤드라인', weight: 0.25, check: (c) => hasLength(c.headline, 5) && c.headline.length <= 20 },
    { id: 'subheadline_clarity', label: '명확한 서브헤드라인', weight: 0.2, check: (c) => hasLength(c.subheadline, 10) },
    { id: 'emotional_hook', label: '감정 자극 요소', weight: 0.15, check: (c) => hasLength(c.body, 20) },
    { id: 'cta_present', label: 'CTA 존재', weight: 0.15, check: hasCta },
    { id: 'visual_direction', label: '비주얼 디렉션', weight: 0.15, check: hasImageDir },
    { id: 'micro_copy', label: '마이크로 카피', weight: 0.1, check: (c) => hasLength(c.microCopy, 3) },
  ],
};

const PAIN_FRAME: PersuasionFrame = {
  role: 'PAIN',
  requiredElements: [
    { id: 'pain_headline', label: '고통점 헤드라인', weight: 0.25, check: (c) => hasLength(c.headline, 5) },
    { id: 'empathy_body', label: '공감 본문', weight: 0.25, check: (c) => hasLength(c.body, 30) },
    { id: 'pain_bullets', label: '구체적 고통 나열', weight: 0.25, check: (c) => hasBullets(c.bulletPoints, 3) },
    { id: 'transition_sub', label: '전환 서브헤드라인', weight: 0.15, check: (c) => hasLength(c.subheadline, 8) },
    { id: 'visual_direction', label: '비주얼 디렉션', weight: 0.1, check: hasImageDir },
  ],
};

const SOLUTION_FRAME: PersuasionFrame = {
  role: 'SOLUTION',
  requiredElements: [
    { id: 'benefit_headline', label: '혜택 중심 헤드라인', weight: 0.2, check: (c) => hasLength(c.headline, 5) },
    { id: 'how_it_works', label: '작동 방식 설명', weight: 0.2, check: (c) => hasLength(c.body, 30) },
    { id: 'feature_bullets', label: '기능/혜택 불릿', weight: 0.2, check: (c) => hasBullets(c.bulletPoints, 3) },
    { id: 'specific_numbers', label: '구체적 수치', weight: 0.15, check: (c) => hasNumber(c.body) || c.bulletPoints.some(hasNumber) },
    { id: 'cta_present', label: 'CTA 존재', weight: 0.15, check: hasCta },
    { id: 'visual_direction', label: '비주얼 디렉션', weight: 0.1, check: hasImageDir },
  ],
};

const PROOF_FRAME: PersuasionFrame = {
  role: 'PROOF',
  requiredElements: [
    { id: 'social_headline', label: '사회적 증거 헤드라인', weight: 0.2, check: (c) => hasLength(c.headline, 5) },
    { id: 'proof_body', label: '증거 본문', weight: 0.25, check: (c) => hasLength(c.body, 20) },
    { id: 'proof_items', label: '증거 항목(불릿)', weight: 0.25, check: (c) => hasBullets(c.bulletPoints, 2) },
    { id: 'credibility_numbers', label: '신뢰 수치', weight: 0.2, check: (c) => hasNumber(c.headline) || hasNumber(c.body) },
    { id: 'subheadline', label: '보조 설명', weight: 0.1, check: (c) => hasLength(c.subheadline, 5) },
  ],
};

const OBJECTION_FRAME: PersuasionFrame = {
  role: 'OBJECTION',
  requiredElements: [
    { id: 'objection_headline', label: '반론 해소 헤드라인', weight: 0.2, check: (c) => hasLength(c.headline, 5) },
    { id: 'counter_body', label: '반박 본문', weight: 0.25, check: (c) => hasLength(c.body, 20) },
    { id: 'reassurance_bullets', label: '안심 포인트', weight: 0.25, check: (c) => hasBullets(c.bulletPoints, 2) },
    { id: 'guarantee', label: '보증/마이크로카피', weight: 0.2, check: (c) => hasLength(c.microCopy, 3) },
    { id: 'subheadline', label: '보조 설명', weight: 0.1, check: (c) => hasLength(c.subheadline, 5) },
  ],
};

const URGENCY_FRAME: PersuasionFrame = {
  role: 'URGENCY',
  requiredElements: [
    { id: 'urgency_headline', label: '긴급성 헤드라인', weight: 0.25, check: (c) => hasLength(c.headline, 5) },
    { id: 'scarcity_body', label: '희소성 본문', weight: 0.25, check: (c) => hasLength(c.body, 15) },
    { id: 'deadline_elements', label: '마감 요소', weight: 0.2, check: (c) => hasNumber(c.body) || hasNumber(c.headline) },
    { id: 'cta_present', label: 'CTA 존재', weight: 0.2, check: hasCta },
    { id: 'micro_copy', label: '마이크로 카피', weight: 0.1, check: (c) => hasLength(c.microCopy, 3) },
  ],
};

const CTA_FRAME: PersuasionFrame = {
  role: 'CTA',
  requiredElements: [
    { id: 'action_headline', label: '행동 유도 헤드라인', weight: 0.2, check: (c) => hasLength(c.headline, 3) },
    { id: 'value_summary', label: '가치 요약 본문', weight: 0.2, check: (c) => hasLength(c.body, 10) },
    { id: 'strong_cta', label: '강력한 CTA', weight: 0.3, check: (c) => hasLength(c.ctaText, 3) && c.ctaText.length <= 12 },
    { id: 'risk_reversal', label: '리스크 제거 마이크로카피', weight: 0.2, check: (c) => hasLength(c.microCopy, 5) },
    { id: 'subheadline', label: '보조 메시지', weight: 0.1, check: (c) => hasLength(c.subheadline, 5) },
  ],
};

// --- 프레임 매핑 ---

const FRAME_MAP: Record<string, PersuasionFrame> = {
  HOOK: HOOK_FRAME,
  PAIN: PAIN_FRAME,
  SOLUTION: SOLUTION_FRAME,
  PROOF: PROOF_FRAME,
  OBJECTION: OBJECTION_FRAME,
  URGENCY: URGENCY_FRAME,
  CTA: CTA_FRAME,
};

// 기본 프레임 (매핑 안 되는 역할용)
const DEFAULT_FRAME: PersuasionFrame = {
  role: 'DEFAULT',
  requiredElements: [
    { id: 'headline', label: '헤드라인', weight: 0.3, check: (c) => hasLength(c.headline, 3) },
    { id: 'body', label: '본문', weight: 0.3, check: (c) => hasLength(c.body, 10) },
    { id: 'subheadline', label: '서브헤드라인', weight: 0.2, check: (c) => hasLength(c.subheadline, 5) },
    { id: 'bullets', label: '불릿', weight: 0.2, check: (c) => hasBullets(c.bulletPoints, 1) },
  ],
};

/** 섹션 역할에 맞는 설득 프레임 반환 */
export function getFrame(role: string): PersuasionFrame {
  return FRAME_MAP[role] ?? DEFAULT_FRAME;
}

/** 단일 섹션의 프레임 점수 (0~100) + 실패 요소 목록 */
export interface FrameScoreResult {
  score: number;
  passedElements: string[];
  failedElements: string[];
}

export function scoreByFrame(role: string, copy: CopyBlock): FrameScoreResult {
  const frame = getFrame(role);
  let score = 0;
  const passedElements: string[] = [];
  const failedElements: string[] = [];

  for (const el of frame.requiredElements) {
    if (el.check(copy)) {
      score += el.weight * 100;
      passedElements.push(el.label);
    } else {
      failedElements.push(el.label);
    }
  }

  return {
    score: Math.round(score),
    passedElements,
    failedElements,
  };
}
