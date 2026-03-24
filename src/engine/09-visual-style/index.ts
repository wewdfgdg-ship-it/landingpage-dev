import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type {
  MoodPreset,
  TypographyScale,
  DesignTokens,
  StyleConfig,
  FontFamily,
  RadiusScale,
} from './types';
export type { StyleConfig } from './types';
import {
  MOOD_DEFS,
  INDUSTRY_MOOD_MAP,
  SPACING,
  SECTION_PADDING,
  DEFAULT_MOOD_INDEX,
  type MoodDef,
} from './rules';

// ============================================================
// Visual Style Engine — 규칙 엔진 (AI 호출 없음)
// 무드 프리셋 자동 선택 + 디자인 토큰 생성
// ============================================================

// --- 포지셔닝 기반 보정 ---

function adjustByPositioning(
  candidates: MoodPreset[],
  positioning: string,
): MoodPreset {
  const posLower = positioning.toLowerCase();

  if (posLower.includes('프리미엄') || posLower.includes('고급') || posLower.includes('럭셔리')) {
    if (candidates.includes('luxury')) return 'luxury';
    if (candidates.includes('premium')) return 'premium';
  }
  if (posLower.includes('혁신') || posLower.includes('기술') || posLower.includes('테크')) {
    if (candidates.includes('tech')) return 'tech';
    if (candidates.includes('startup')) return 'startup';
  }
  if (posLower.includes('친근') || posLower.includes('재미') || posLower.includes('젊은')) {
    if (candidates.includes('fun_pop')) return 'fun_pop';
    if (candidates.includes('startup')) return 'startup';
  }
  if (posLower.includes('미니멀') || posLower.includes('심플') || posLower.includes('깔끔')) {
    if (candidates.includes('minimal')) return 'minimal';
    if (candidates.includes('clean')) return 'clean';
  }
  if (posLower.includes('전문') || posLower.includes('신뢰') || posLower.includes('안정')) {
    if (candidates.includes('professional')) return 'professional';
    if (candidates.includes('premium')) return 'premium';
  }

  return candidates[0];
}

// --- 타이포그래피 스케일 생성 ---

function buildTypography(fontFamily: FontFamily): TypographyScale {
  const baseWeight = fontFamily === 'serif' ? 400 : 500;
  const boldWeight = fontFamily === 'serif' ? 700 : 700;

  return {
    display: { size: '4.5rem', weight: boldWeight, lineHeight: '1.1' },
    h1: { size: '3rem', weight: boldWeight, lineHeight: '1.2' },
    h2: { size: '2.25rem', weight: boldWeight, lineHeight: '1.25' },
    h3: { size: '1.5rem', weight: 600, lineHeight: '1.3' },
    h4: { size: '1.25rem', weight: 600, lineHeight: '1.4' },
    body: { size: '1rem', weight: baseWeight, lineHeight: '1.6' },
    small: { size: '0.875rem', weight: baseWeight, lineHeight: '1.5' },
    caption: { size: '0.75rem', weight: baseWeight, lineHeight: '1.5' },
    button: { size: '1rem', weight: 600, lineHeight: '1.4' },
  };
}

// --- 라디우스 프리셋 ---

function buildRadius(preset: 'sharp' | 'rounded' | 'pill'): RadiusScale {
  switch (preset) {
    case 'sharp':
      return { none: 0, sm: 2, md: 4, lg: 6, xl: 8, full: 999 };
    case 'rounded':
      return { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 999 };
    case 'pill':
      return { none: 0, sm: 8, md: 12, lg: 16, xl: 24, full: 999 };
  }
}

// --- 메인 엔진 ---

export function runVisualStyle(
  brief: ProductBrief,
  industry: string,
): StyleConfig {
  // 1. 업종 기반 후보 선택
  const candidates = INDUSTRY_MOOD_MAP[industry] ?? INDUSTRY_MOOD_MAP['other'];

  // 2. 포지셔닝 기반 최종 무드 선택
  const selectedMood = adjustByPositioning(candidates, brief.productDNA.positioning);

  // 3. 무드 정의 찾기
  const moodDef = MOOD_DEFS.find((m) => m.id === selectedMood) ?? MOOD_DEFS[DEFAULT_MOOD_INDEX]; // clean 기본

  // 4. 디자인 토큰 조합
  const tokens: DesignTokens = {
    colors: moodDef.colors,
    typography: buildTypography(moodDef.fontFamily),
    fontFamily: moodDef.fontFamily,
    spacing: SPACING,
    radius: buildRadius(moodDef.radiusPreset),
    defaultShadow: moodDef.defaultShadow,
    sectionPadding: SECTION_PADDING,
  };

  // 5. 선택 이유 생성
  const reasoning = `업종(${industry}) → 후보(${candidates.join(',')}) → 포지셔닝(${brief.productDNA.positioning}) → ${moodDef.name}`;

  return {
    mood: moodDef.id,
    moodName: moodDef.name,
    moodDescription: moodDef.description,
    tokens,
    reasoning,
  };
}
