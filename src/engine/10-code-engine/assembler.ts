// ============================================================
// Template Assembler — 무드별 DesignTokens 프리셋 + 패턴 조합
// 6개 무드(Luxury/Tech/Clean/Bold/Natural/Premium)의 전체 스타일을
// DesignTokens로 변환하여 Code Engine에 주입
// ============================================================

import type {
  MoodPreset,
  DesignTokens,
  ColorPalette,
  TypographyScale,
  FontFamily,
  SpacingScale,
  RadiusScale,
  ShadowLevel,
} from '@/engine/09-visual-style/types';

// ============================================================
// 1. 무드별 Google Fonts URL
// ============================================================

export interface MoodFontConfig {
  url: string;
  displayFont: string;
  bodyFont: string;
  fontFamily: FontFamily;
}

const MOOD_FONTS: Record<string, MoodFontConfig> = {
  luxury: {
    url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Noto+Serif+KR:wght@400;700;900&display=swap',
    displayFont: "'Playfair Display', 'Noto Serif KR', serif",
    bodyFont: "'Cormorant', 'Noto Serif KR', serif",
    fontFamily: 'serif',
  },
  tech: {
    url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
    displayFont: "'Outfit', 'Noto Sans KR', sans-serif",
    bodyFont: "'Noto Sans KR', 'Outfit', sans-serif",
    fontFamily: 'sans',
  },
  clean: {
    url: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
    displayFont: "'Instrument Serif', 'Noto Sans KR', serif",
    bodyFont: "'DM Sans', 'Noto Sans KR', sans-serif",
    fontFamily: 'sans',
  },
  bold: {
    url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
    displayFont: "'Bebas Neue', sans-serif",
    bodyFont: "'Noto Sans KR', sans-serif",
    fontFamily: 'sans',
  },
  natural: {
    url: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Josefin+Sans:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap',
    displayFont: "'Lora', 'Noto Sans KR', serif",
    bodyFont: "'Josefin Sans', 'Noto Sans KR', sans-serif",
    fontFamily: 'serif',
  },
  premium: {
    url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&family=Noto+Sans+KR:wght@300;400;500;700&display=swap',
    displayFont: "'Cormorant Garamond', 'Noto Sans KR', serif",
    bodyFont: "'Outfit', 'Noto Sans KR', sans-serif",
    fontFamily: 'serif',
  },
} as const;

// ============================================================
// 2. 무드별 ColorPalette
// ============================================================

const MOOD_COLORS: Record<string, ColorPalette> = {
  luxury: {
    primary: '#C6A44E',
    primaryLight: '#E8D5A0',
    primaryDark: '#A08030',
    secondary: '#0F0C08',
    accent: '#C6A44E',
    background: '#080604',
    surface: '#161210',
    textPrimary: '#F5EFE0',
    textSecondary: 'rgba(245,239,224,.55)',
    textMuted: 'rgba(245,239,224,.25)',
    border: 'rgba(198,164,78,.15)',
    error: '#E53E3E',
  },
  tech: {
    primary: '#7C3AED',
    primaryLight: '#A78BFA',
    primaryDark: '#5B21B6',
    secondary: '#06D6A0',
    accent: '#F472B6',
    background: '#07070E',
    surface: '#0E0E1A',
    textPrimary: '#F0F0F5',
    textSecondary: '#A0A0BE',
    textMuted: '#606080',
    border: '#1E1E35',
    error: '#EF4444',
  },
  clean: {
    primary: '#E63225',
    primaryLight: '#FF6B5E',
    primaryDark: '#C41E12',
    secondary: '#FAFAF8',
    accent: '#E63225',
    background: '#FAFAF8',
    surface: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#777777',
    textMuted: '#AAAAAA',
    border: '#E0E0E0',
    error: '#E63225',
  },
  bold: {
    primary: '#FF2D20',
    primaryLight: '#FF6B5E',
    primaryDark: '#CC1810',
    secondary: '#FFD60A',
    accent: '#FFD60A',
    background: '#000000',
    surface: '#111111',
    textPrimary: '#FFFFFF',
    textSecondary: '#888888',
    textMuted: 'rgba(255,255,255,.1)',
    border: 'rgba(255,255,255,.1)',
    error: '#FF2D20',
  },
  natural: {
    primary: '#2D5F3F',
    primaryLight: '#3A7A52',
    primaryDark: '#1E3F2A',
    secondary: '#8B6914',
    accent: '#8B6914',
    background: '#F5F0E8',
    surface: '#FAF7F0',
    textPrimary: '#1A1812',
    textSecondary: '#8A8070',
    textMuted: 'rgba(0,0,0,.08)',
    border: 'rgba(0,0,0,.08)',
    error: '#DC2626',
  },
  premium: {
    primary: '#9DC4E0',
    primaryLight: '#B8DCF0',
    primaryDark: '#7AA8C8',
    secondary: '#0E1F3D',
    accent: '#B8DCF0',
    background: '#0A1628',
    surface: '#0E1F3D',
    textPrimary: '#FFFFFF',
    textSecondary: '#B8C8D8',
    textMuted: 'rgba(157,196,224,.18)',
    border: 'rgba(157,196,224,.18)',
    error: '#EF4444',
  },
} as const;

// ============================================================
// 3. 무드별 Typography Scale
// ============================================================

const BASE_TYPOGRAPHY: TypographyScale = {
  display: { size: 'clamp(3rem, 7vw, 5.5rem)', weight: 400, lineHeight: '1.0' },
  h1: { size: 'clamp(2.4rem, 5vw, 4rem)', weight: 400, lineHeight: '1.15' },
  h2: { size: 'clamp(1.8rem, 3.5vw, 2.8rem)', weight: 400, lineHeight: '1.2' },
  h3: { size: 'clamp(1.2rem, 1.8vw, 1.5rem)', weight: 600, lineHeight: '1.3' },
  h4: { size: '1.1rem', weight: 600, lineHeight: '1.4' },
  body: { size: '1rem', weight: 400, lineHeight: '1.7' },
  small: { size: '0.875rem', weight: 400, lineHeight: '1.5' },
  caption: { size: '0.75rem', weight: 400, lineHeight: '1.4' },
  button: { size: '0.9rem', weight: 600, lineHeight: '1' },
};

const MOOD_TYPOGRAPHY_OVERRIDES: Record<string, Partial<TypographyScale>> = {
  luxury: {
    display: { size: 'clamp(3rem, 5vw, 5.5rem)', weight: 400, lineHeight: '1.1' },
    h1: { size: 'clamp(2.4rem, 5vw, 4rem)', weight: 400, lineHeight: '1.15' },
    body: { size: '1rem', weight: 300, lineHeight: '1.8' },
  },
  tech: {
    display: { size: 'clamp(3rem, 7vw, 5rem)', weight: 800, lineHeight: '1.0' },
    h3: { size: 'clamp(1.2rem, 1.8vw, 1.5rem)', weight: 700, lineHeight: '1.3' },
    button: { size: '0.85rem', weight: 700, lineHeight: '1' },
  },
  bold: {
    display: { size: 'clamp(4rem, 10vw, 8rem)', weight: 400, lineHeight: '0.9' },
    h1: { size: 'clamp(3rem, 8vw, 6rem)', weight: 400, lineHeight: '0.95' },
    h2: { size: 'clamp(2rem, 4vw, 3.5rem)', weight: 400, lineHeight: '1.0' },
  },
  premium: {
    display: { size: 'clamp(3.2rem, 7.5vw, 6.5rem)', weight: 500, lineHeight: '0.95' },
    body: { size: '0.95rem', weight: 400, lineHeight: '1.9' },
    caption: { size: '0.7rem', weight: 400, lineHeight: '1.4' },
  },
};

// ============================================================
// 4. 무드별 Spacing / Radius / Shadow
// ============================================================

const MOOD_SPACING: Record<string, SpacingScale> = {
  luxury: { xs: 4, sm: 8, md: 16, lg: 32, xl: 64, '2xl': 120 },
  tech: { xs: 4, sm: 8, md: 16, lg: 24, xl: 48, '2xl': 96 },
  clean: { xs: 4, sm: 8, md: 16, lg: 32, xl: 64, '2xl': 100 },
  bold: { xs: 4, sm: 8, md: 16, lg: 24, xl: 48, '2xl': 80 },
  natural: { xs: 4, sm: 8, md: 16, lg: 32, xl: 64, '2xl': 100 },
  premium: { xs: 4, sm: 8, md: 16, lg: 32, xl: 64, '2xl': 120 },
};

const MOOD_RADIUS: Record<string, RadiusScale> = {
  luxury: { none: 0, sm: 0, md: 0, lg: 0, xl: 0, full: 9999 },
  tech: { none: 0, sm: 4, md: 8, lg: 16, xl: 24, full: 9999 },
  clean: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  bold: { none: 0, sm: 0, md: 0, lg: 0, xl: 0, full: 9999 },
  natural: { none: 0, sm: 6, md: 10, lg: 14, xl: 16, full: 9999 },
  premium: { none: 0, sm: 0, md: 0, lg: 0, xl: 0, full: 9999 },
};

const MOOD_SHADOW: Record<string, ShadowLevel> = {
  luxury: 'none',
  tech: 'lg',
  clean: 'sm',
  bold: 'none',
  natural: 'md',
  premium: 'none',
};

const MOOD_SECTION_PADDING: Record<string, string> = {
  luxury: 'clamp(80px, 10vw, 140px) clamp(24px, 4vw, 64px)',
  tech: 'clamp(64px, 8vw, 120px) clamp(20px, 3vw, 48px)',
  clean: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 48px)',
  bold: 'clamp(48px, 6vw, 80px) clamp(20px, 3vw, 40px)',
  natural: 'clamp(48px, 6vw, 80px) clamp(20px, 3vw, 40px)',
  premium: 'clamp(64px, 8vw, 120px) clamp(20px, 4vw, 48px)',
};

// ============================================================
// 5. 무드별 추천 패턴 조합
// ============================================================

export interface MoodPatternPreset {
  hero: string;
  features: string;
  proof: string;
  stats: string;
  products: string;
  fullbleed: string;
  gallery: string;
  beforeAfter: string;
  pricing: string;
  reviews: string;
  process: string;
  faq: string;
  cta: string;
}

const MOOD_PATTERNS: Record<string, MoodPatternPreset> = {
  luxury: {
    hero: 'hero_split',
    features: 'feat_zigzag',
    proof: 'proof_testimonial_card',
    stats: 'proof_number_counter',
    products: 'feat_3col_grid',
    fullbleed: 'hero_left_right',
    gallery: 'feat_3col_grid',
    beforeAfter: 'misc_before_after',
    pricing: 'price_single_card',
    reviews: 'proof_testimonial_card',
    process: 'feat_numbered_steps',
    faq: 'faq_accordion',
    cta: 'cta_center',
  },
  tech: {
    hero: 'hero_fullscreen_center',
    features: 'feat_3col_grid',
    proof: 'proof_number_counter',
    stats: 'proof_number_counter',
    products: 'feat_3col_grid',
    fullbleed: 'hero_fullscreen_center',
    gallery: 'feat_3col_grid',
    beforeAfter: 'misc_before_after',
    pricing: 'price_3col_compare',
    reviews: 'proof_testimonial_card',
    process: 'feat_numbered_steps',
    faq: 'faq_accordion',
    cta: 'cta_full_banner',
  },
  clean: {
    hero: 'hero_fullscreen_center',
    features: 'feat_3col_grid',
    proof: 'proof_testimonial_card',
    stats: 'proof_number_counter',
    products: 'feat_3col_grid',
    fullbleed: 'hero_left_right',
    gallery: 'feat_3col_grid',
    beforeAfter: 'misc_before_after',
    pricing: 'price_single_card',
    reviews: 'proof_testimonial_card',
    process: 'feat_numbered_steps',
    faq: 'faq_accordion',
    cta: 'cta_center',
  },
  bold: {
    hero: 'hero_fullscreen_center',
    features: 'feat_zigzag',
    proof: 'proof_number_counter',
    stats: 'proof_number_counter',
    products: 'feat_3col_grid',
    fullbleed: 'hero_fullscreen_center',
    gallery: 'feat_3col_grid',
    beforeAfter: 'misc_before_after',
    pricing: 'price_single_card',
    reviews: 'proof_testimonial_card',
    process: 'feat_numbered_steps',
    faq: 'faq_accordion',
    cta: 'cta_full_banner',
  },
  natural: {
    hero: 'hero_product_center',
    features: 'feat_3col_grid',
    proof: 'proof_testimonial_card',
    stats: 'proof_number_counter',
    products: 'feat_3col_grid',
    fullbleed: 'hero_left_right',
    gallery: 'feat_3col_grid',
    beforeAfter: 'misc_before_after',
    pricing: 'price_single_card',
    reviews: 'proof_testimonial_card',
    process: 'feat_numbered_steps',
    faq: 'faq_accordion',
    cta: 'cta_center',
  },
  premium: {
    hero: 'hero_fullscreen_center',
    features: 'feat_zigzag',
    proof: 'proof_testimonial_card',
    stats: 'proof_number_counter',
    products: 'feat_3col_grid',
    fullbleed: 'hero_left_right',
    gallery: 'feat_3col_grid',
    beforeAfter: 'misc_before_after',
    pricing: 'price_3col_compare',
    reviews: 'proof_testimonial_card',
    process: 'feat_numbered_steps',
    faq: 'faq_accordion',
    cta: 'cta_center',
  },
};

// ============================================================
// 6. Public API
// ============================================================

/** 무드 키 목록 (MoodPreset 호환 + 확장) */
export type AssemblerMood = 'luxury' | 'tech' | 'clean' | 'bold' | 'natural' | 'premium';

const ASSEMBLER_MOODS: readonly AssemblerMood[] = [
  'luxury', 'tech', 'clean', 'bold', 'natural', 'premium',
] as const;

/** 무드가 assembler에서 지원되는지 확인 */
export function isSupportedMood(mood: string): mood is AssemblerMood {
  return ASSEMBLER_MOODS.includes(mood as AssemblerMood);
}

/** 지원되는 전체 무드 목록 */
export function getSupportedMoods(): readonly AssemblerMood[] {
  return ASSEMBLER_MOODS;
}

/** 무드별 DesignTokens 생성 */
export function buildTokensForMood(mood: AssemblerMood): DesignTokens {
  const typographyOverrides = MOOD_TYPOGRAPHY_OVERRIDES[mood] ?? {};
  const typography: TypographyScale = {
    ...BASE_TYPOGRAPHY,
    ...typographyOverrides,
  };

  return {
    colors: MOOD_COLORS[mood],
    typography,
    fontFamily: MOOD_FONTS[mood].fontFamily,
    spacing: MOOD_SPACING[mood],
    radius: MOOD_RADIUS[mood],
    defaultShadow: MOOD_SHADOW[mood],
    sectionPadding: MOOD_SECTION_PADDING[mood],
  };
}

/** 무드별 폰트 설정 */
export function getFontConfig(mood: AssemblerMood): MoodFontConfig {
  return MOOD_FONTS[mood];
}

/** 무드별 추천 패턴 조합 */
export function getPatternPreset(mood: AssemblerMood): MoodPatternPreset {
  return MOOD_PATTERNS[mood];
}

/** MoodPreset(09-visual-style) → AssemblerMood 변환 (호환 레이어) */
export function resolveAssemblerMood(mood: MoodPreset): AssemblerMood {
  const mapping: Record<MoodPreset, AssemblerMood> = {
    luxury: 'luxury',
    clean: 'clean',
    tech: 'tech',
    natural: 'natural',
    bold: 'bold',
    premium: 'premium',
    fun_pop: 'bold',
    professional: 'clean',
    startup: 'tech',
    minimal: 'clean',
  };
  return mapping[mood];
}

/** 전체 무드 프리셋 (tokens + fonts + patterns) */
export interface MoodAssembly {
  mood: AssemblerMood;
  tokens: DesignTokens;
  fonts: MoodFontConfig;
  patterns: MoodPatternPreset;
}

/** 무드 하나의 전체 어셈블리 */
export function assembleMood(mood: AssemblerMood): MoodAssembly {
  return {
    mood,
    tokens: buildTokensForMood(mood),
    fonts: getFontConfig(mood),
    patterns: getPatternPreset(mood),
  };
}

/** 전체 6개 무드 어셈블리 맵 */
export function assembleAllMoods(): Record<AssemblerMood, MoodAssembly> {
  const result = {} as Record<AssemblerMood, MoodAssembly>;
  for (const mood of ASSEMBLER_MOODS) {
    result[mood] = assembleMood(mood);
  }
  return result;
}
