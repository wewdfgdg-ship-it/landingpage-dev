// ============================================================
// Visual Style Engine — 규칙/상수
// 무드 프리셋 정의, 업종→무드 매핑, 공통 스페이싱
// ============================================================

import type {
  MoodPreset,
  ColorPalette,
  FontFamily,
  ShadowLevel,
  SpacingScale,
} from './types';

/** 무드 프리셋 정의 인터페이스 */
export interface MoodDef {
  id: MoodPreset;
  name: string;
  description: string;
  colors: ColorPalette;
  fontFamily: FontFamily;
  defaultShadow: ShadowLevel;
  radiusPreset: 'sharp' | 'rounded' | 'pill';
}

/** 무드 프리셋 정의 목록 (10개) */
export const MOOD_DEFS: MoodDef[] = [
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

/** 업종 → 무드 프리셋 후보 매핑 (우선순위 순) */
export const INDUSTRY_MOOD_MAP: Record<string, MoodPreset[]> = {
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

/** 공통 스페이싱 스케일 */
export const SPACING: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

/** 공통 섹션 패딩 */
export const SECTION_PADDING = '80px 0';

/** 기본 무드 (업종 매핑 실패 시 폴백) */
export const DEFAULT_MOOD_INDEX = 1; // MOOD_DEFS[1] = 'clean'
