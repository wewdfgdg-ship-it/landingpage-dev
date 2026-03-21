import type { GazePattern, HookType, ZoneType } from './types';

// ============================================================
// Attention Architecture Engine — 비즈니스 규칙
// ============================================================

// --- Hook 유형 매핑 (의사결정 유형 → Hook) ---

export const HOOK_TYPE_MAP: Record<string, HookType> = {
  impulse: 'visual_hook',
  analytical: 'question_hook',
  cautious: 'result_hook',
  follower: 'social_hook',
} as const;

export const DEFAULT_HOOK_TYPE: HookType = 'visual_hook';

// --- 시선 동선 패턴 (업종 → 시선 패턴) ---

export const GAZE_MAP: Record<string, GazePattern> = {
  saas: 'f_pattern',
  b2b: 'f_pattern',
  ecommerce: 'z_pattern',
  beauty: 'z_pattern',
  food: 'z_pattern',
  education: 'f_pattern',
  health: 'f_pattern',
  finance: 'f_pattern',
  lifestyle: 'center_focus',
  other: 'z_pattern',
} as const;

export const DEFAULT_GAZE_PATTERN: GazePattern = 'z_pattern';

// --- Zone 설계 상수 ---

export const SECTION_HEIGHT = 600 as const;

export const ZONE_RATIOS = {
  interest: 0.4,
  desire: 0.75,
} as const;

// --- Zone별 콘텐츠 비율 및 메타데이터 ---

export interface ZoneTemplate {
  zone: ZoneType;
  visualRatio: number;
  textRatio: number;
  dataRatio: number;
  ctaRatio: number;
  rhythm: string;
  interactions: string[];
  restrictions: string[];
}

export const ZONE_TEMPLATES: readonly ZoneTemplate[] = [
  {
    zone: 'first_view',
    visualRatio: 80,
    textRatio: 20,
    dataRatio: 0,
    ctaRatio: 0,
    rhythm: '시각적 임팩트 100% — 텍스트 최소화',
    interactions: ['fade_in', 'parallax'],
    restrictions: ['폼/가격/복잡한 정보 배치 금지'],
  },
  {
    zone: 'interest',
    visualRatio: 60,
    textRatio: 40,
    dataRatio: 0,
    ctaRatio: 0,
    rhythm: '밀 → 소 → 밀 (정보 밀도 교차)',
    interactions: ['fade_in', 'icon_sequence', 'counter_animation'],
    restrictions: ['강조 인용구와 미니 CTA로 이탈 방지'],
  },
  {
    zone: 'desire',
    visualRatio: 20,
    textRatio: 50,
    dataRatio: 30,
    ctaRatio: 0,
    rhythm: '증거 → 감정 → 증거 → 감정',
    interactions: ['before_after_slider', 'review_carousel', 'tab_accordion', 'video'],
    restrictions: ['중간 CTA 1~2개 필수'],
  },
  {
    zone: 'action',
    visualRatio: 0,
    textRatio: 0,
    dataRatio: 0,
    ctaRatio: 70,
    rhythm: '가치 요약 + 보증 + CTA + FAQ',
    interactions: ['sticky_cta_bar'],
    restrictions: ['새로운 정보 추가 금지', '깔끔하고 집중된 레이아웃'],
  },
] as const;

// --- Sticky CTA / Exit Intent 임계값 ---

export const STICKY_CTA_URGENCY_THRESHOLD = 4 as const;
export const STICKY_CTA_SECTION_THRESHOLD = 10 as const;
export const EXIT_INTENT_PRICE_THRESHOLD = 4 as const;
