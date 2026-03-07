// ============================================================
// Attention Architecture Engine — 타입 정의
// ============================================================

export type ZoneType = 'first_view' | 'interest' | 'desire' | 'action';

export type HookType = 'visual_hook' | 'question_hook' | 'result_hook' | 'social_hook';
export type GazePattern = 'f_pattern' | 'z_pattern' | 'center_focus';

export interface ZoneConfig {
  zone: ZoneType;
  pixelRange: { start: number; end: number };
  visualRatio: number; // 0~100%
  textRatio: number;
  dataRatio: number;
  ctaRatio: number;
  rhythm: string;
  interactions: string[];
  restrictions: string[];
}

export interface AttentionConfig {
  hookType: HookType;
  gazePattern: GazePattern;
  zones: ZoneConfig[];
  stickyCtaEnabled: boolean;
  exitIntentEnabled: boolean;
}
