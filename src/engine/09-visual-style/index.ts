import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type {
  MoodPreset,
  ColorPalette,
  TypographyScale,
  DesignTokens,
  StyleConfig,
  FontFamily,
  SpacingScale,
  RadiusScale,
  ShadowLevel,
} from './types';
export type { StyleConfig } from './types';

// ============================================================
// Visual Style Engine — 규칙 엔진 (AI 호출 없음)
// 무드 프리셋 자동 선택 + 디자인 토큰 생성
// ============================================================

// --- 무드 프리셋 정의 ---

interface MoodDef {
  id: MoodPreset;
  name: string;
  description: string;
  colors: ColorPalette;
  fontFamily: FontFamily;
  defaultShadow: ShadowLevel;
  radiusPreset: 'sharp' | 'rounded' | 'pill';
}

const MOOD_DEFS: MoodDef[] = [
  {
    id: 'luxury',
    name: 'Luxury',
    description: '다크+골드, 세리프, 넓은 여백, 고급 질감',
    colors: {
      primary: '#C9A96E', primaryLight: '#E0C992', primaryDark: '#A68B4B',
      secondary: '#1A1A1A', accent: '#D4AF37',
      background: '#0D0D0D', surface: '#1A1A1A',
      textPrimary: '#F5F0E8', textSecondary: '#C9C0B0', textMuted: '#8A8070',
      border: '#2A2520', error: '#E74C3C',
    },
    fontFamily: 'serif',
    defaultShadow: 'lg',
    radiusPreset: 'sharp',
  },
  {
    id: 'clean',
    name: 'Clean',
    description: '화이트+블루, 산세리프, 미니멀, 그리드 정돈',
    colors: {
      primary: '#2563EB', primaryLight: '#60A5FA', primaryDark: '#1D4ED8',
      secondary: '#475569', accent: '#0EA5E9',
      background: '#FFFFFF', surface: '#F8FAFC',
      textPrimary: '#0F172A', textSecondary: '#475569', textMuted: '#94A3B8',
      border: '#E2E8F0', error: '#EF4444',
    },
    fontFamily: 'sans',
    defaultShadow: 'sm',
    radiusPreset: 'rounded',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: '다크+네온, 모노스페이스, 그라디언트, 기하학',
    colors: {
      primary: '#8B5CF6', primaryLight: '#A78BFA', primaryDark: '#6D28D9',
      secondary: '#06B6D4', accent: '#22D3EE',
      background: '#0F0F1A', surface: '#1A1A2E',
      textPrimary: '#E8E8F0', textSecondary: '#A0A0C0', textMuted: '#6060A0',
      border: '#2A2A4A', error: '#F43F5E',
    },
    fontFamily: 'mono',
    defaultShadow: 'md',
    radiusPreset: 'rounded',
  },
  {
    id: 'natural',
    name: 'Natural',
    description: '어스톤, 라운드, 유기적 형태, 텍스처',
    colors: {
      primary: '#65A30D', primaryLight: '#84CC16', primaryDark: '#4D7C0F',
      secondary: '#92400E', accent: '#D97706',
      background: '#FEFCE8', surface: '#FEF9C3',
      textPrimary: '#1C1917', textSecondary: '#57534E', textMuted: '#A8A29E',
      border: '#D6D3D1', error: '#DC2626',
    },
    fontFamily: 'sans',
    defaultShadow: 'sm',
    radiusPreset: 'pill',
  },
  {
    id: 'fun_pop',
    name: 'Fun/Pop',
    description: '비비드, 볼드 타이포, 일러스트, 동적',
    colors: {
      primary: '#EC4899', primaryLight: '#F472B6', primaryDark: '#DB2777',
      secondary: '#8B5CF6', accent: '#F59E0B',
      background: '#FFFBEB', surface: '#FFF7ED',
      textPrimary: '#1E1B4B', textSecondary: '#4C1D95', textMuted: '#9CA3AF',
      border: '#FDE68A', error: '#EF4444',
    },
    fontFamily: 'sans',
    defaultShadow: 'md',
    radiusPreset: 'pill',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: '네이비+그레이, 클래식, 정돈된 그리드',
    colors: {
      primary: '#1E3A5F', primaryLight: '#2563EB', primaryDark: '#172554',
      secondary: '#475569', accent: '#0284C7',
      background: '#FFFFFF', surface: '#F1F5F9',
      textPrimary: '#0F172A', textSecondary: '#334155', textMuted: '#94A3B8',
      border: '#CBD5E1', error: '#DC2626',
    },
    fontFamily: 'sans',
    defaultShadow: 'sm',
    radiusPreset: 'sharp',
  },
  {
    id: 'startup',
    name: 'Startup',
    description: '밝은+퍼플, 현대적, 일러스트, 친근',
    colors: {
      primary: '#7C3AED', primaryLight: '#A78BFA', primaryDark: '#5B21B6',
      secondary: '#06B6D4', accent: '#F472B6',
      background: '#FAFAFA', surface: '#F5F3FF',
      textPrimary: '#18181B', textSecondary: '#52525B', textMuted: '#A1A1AA',
      border: '#E4E4E7', error: '#EF4444',
    },
    fontFamily: 'sans',
    defaultShadow: 'md',
    radiusPreset: 'rounded',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: '딥블루+화이트, 고급 사진, 큰 여백',
    colors: {
      primary: '#1E40AF', primaryLight: '#3B82F6', primaryDark: '#1E3A8A',
      secondary: '#64748B', accent: '#0EA5E9',
      background: '#FFFFFF', surface: '#F0F4FF',
      textPrimary: '#0C1B33', textSecondary: '#475569', textMuted: '#94A3B8',
      border: '#DBEAFE', error: '#DC2626',
    },
    fontFamily: 'serif',
    defaultShadow: 'md',
    radiusPreset: 'sharp',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: '강렬한 대비, 큰 타이포, 블록 컬러',
    colors: {
      primary: '#EF4444', primaryLight: '#F87171', primaryDark: '#DC2626',
      secondary: '#000000', accent: '#FBBF24',
      background: '#FFFFFF', surface: '#FEF2F2',
      textPrimary: '#000000', textSecondary: '#374151', textMuted: '#9CA3AF',
      border: '#E5E7EB', error: '#B91C1C',
    },
    fontFamily: 'sans',
    defaultShadow: 'lg',
    radiusPreset: 'sharp',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: '흑백+액센트 1색, 극도의 여백, 타이포 중심',
    colors: {
      primary: '#18181B', primaryLight: '#3F3F46', primaryDark: '#09090B',
      secondary: '#71717A', accent: '#EF4444',
      background: '#FFFFFF', surface: '#FAFAFA',
      textPrimary: '#09090B', textSecondary: '#52525B', textMuted: '#A1A1AA',
      border: '#E4E4E7', error: '#DC2626',
    },
    fontFamily: 'sans',
    defaultShadow: 'none',
    radiusPreset: 'sharp',
  },
];

// --- 업종 → 무드 매핑 ---

const INDUSTRY_MOOD_MAP: Record<string, MoodPreset[]> = {
  saas: ['tech', 'startup', 'clean'],
  b2b: ['professional', 'clean', 'premium'],
  ecommerce: ['clean', 'bold', 'fun_pop'],
  beauty: ['luxury', 'clean', 'premium'],
  food: ['natural', 'fun_pop', 'clean'],
  education: ['clean', 'startup', 'professional'],
  health: ['clean', 'natural', 'professional'],
  finance: ['professional', 'premium', 'clean'],
  lifestyle: ['minimal', 'clean', 'natural'],
  other: ['clean', 'startup', 'professional'],
};

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

// --- 스페이싱 (공통) ---

const SPACING: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

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
  const moodDef = MOOD_DEFS.find((m) => m.id === selectedMood) ?? MOOD_DEFS[1]; // clean 기본

  // 4. 디자인 토큰 조합
  const tokens: DesignTokens = {
    colors: moodDef.colors,
    typography: buildTypography(moodDef.fontFamily),
    fontFamily: moodDef.fontFamily,
    spacing: SPACING,
    radius: buildRadius(moodDef.radiusPreset),
    defaultShadow: moodDef.defaultShadow,
    sectionPadding: '80px 0',
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
