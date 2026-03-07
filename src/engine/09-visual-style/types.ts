// ============================================================
// Visual Style Engine — 타입 정의
// ============================================================

export type MoodPreset =
  | 'luxury'
  | 'clean'
  | 'tech'
  | 'natural'
  | 'fun_pop'
  | 'professional'
  | 'startup'
  | 'premium'
  | 'bold'
  | 'minimal';

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
}

export interface TypographyScale {
  display: { size: string; weight: number; lineHeight: string };
  h1: { size: string; weight: number; lineHeight: string };
  h2: { size: string; weight: number; lineHeight: string };
  h3: { size: string; weight: number; lineHeight: string };
  h4: { size: string; weight: number; lineHeight: string };
  body: { size: string; weight: number; lineHeight: string };
  small: { size: string; weight: number; lineHeight: string };
  caption: { size: string; weight: number; lineHeight: string };
  button: { size: string; weight: number; lineHeight: string };
}

export type FontFamily = 'sans' | 'serif' | 'mono';

export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export interface RadiusScale {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'inner';

export interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyScale;
  fontFamily: FontFamily;
  spacing: SpacingScale;
  radius: RadiusScale;
  defaultShadow: ShadowLevel;
  sectionPadding: string;
}

export interface StyleConfig {
  mood: MoodPreset;
  moodName: string;
  moodDescription: string;
  tokens: DesignTokens;
  reasoning: string;
}
