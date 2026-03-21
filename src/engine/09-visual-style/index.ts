import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type {
  MoodPreset,
  TypographyScale,
  DesignTokens,
  StyleConfig,
  FontFamily,
} from './types';
import {
  MOOD_DEFS,
  INDUSTRY_MOOD_MAP,
  POSITIONING_KEYWORDS,
  RADIUS_PRESETS,
  SPACING,
  SECTION_PADDING,
  DEFAULT_MOOD_INDEX,
} from './rules';
export type { StyleConfig } from './types';

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

  for (const group of POSITIONING_KEYWORDS) {
    if (group.keywords.some((kw) => posLower.includes(kw))) {
      const match = group.moods.find((m) => candidates.includes(m));
      if (match) return match;
    }
  }

  return candidates[0];
}

// --- 타이포그래피 스케일 생성 ---

function buildTypography(fontFamily: FontFamily): TypographyScale {
  const baseWeight = fontFamily === 'serif' ? 400 : 500;
  const boldWeight = 700;

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
  const moodDef = MOOD_DEFS.find((m) => m.id === selectedMood) ?? MOOD_DEFS[DEFAULT_MOOD_INDEX];

  // 4. 디자인 토큰 조합
  const tokens: DesignTokens = {
    colors: moodDef.colors,
    typography: buildTypography(moodDef.fontFamily),
    fontFamily: moodDef.fontFamily,
    spacing: SPACING,
    radius: RADIUS_PRESETS[moodDef.radiusPreset],
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
