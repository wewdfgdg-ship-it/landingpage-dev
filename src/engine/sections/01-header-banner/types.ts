// ============================================================
// Header Banner (Hero) Section Agent — v4 타입
// v4 프롬프트 문서 기반: 15 레이아웃 × 14 무드 × 12 폰트셋
// ============================================================

import type { ElementWeight } from '@/engine/sections/types';

// ── 레이아웃 15개 ──

/** 제품 배너 레이아웃 (A~J) */
export type ProductLayoutId =
  | 'A'   // 센터 임팩트
  | 'B'   // 좌우 분할
  | 'C'   // 가격 전면
  | 'D'   // 신뢰 스토리
  | 'E'   // 비주얼 히어로 (풀블리드)
  | 'F'   // 배지 강조 (1위)
  | 'G'   // 미니멀 럭셔리
  | 'H'   // 플로팅 오브제
  | 'I'   // 숫자 임팩트
  | 'J';  // 긴급 카운트다운

/** 모델 배너 레이아웃 (MA~ME) */
export type ModelLayoutId =
  | 'MA'  // 모델 풀블리드 + 하단 오버레이
  | 'MB'  // 헤드라인 dominant + 모델 하단
  | 'MC'  // vivid overlap Z교차
  | 'MD'  // 모델 상단 + 대각선 분할
  | 'ME'; // 모델 풀블리드 + 플로팅 배지

export type LayoutId = ProductLayoutId | ModelLayoutId;

// ── 이미지 배치 mode 6개 ──

export type ProductMode =
  | 'hero-flow'      // A, C, D, F, G, I, J
  | 'hero-absolute'  // H
  | 'background'     // E, MA, MD, ME
  | 'flow'           // B
  | 'overlap'        // MC
  | 'contain';       // MB

// ── 무드 14개 ──

export type ProductMood =
  | 'mood-dark'
  | 'mood-vivid'
  | 'mood-clean'
  | 'mood-soft'
  | 'mood-red'
  | 'mood-navy'
  | 'mood-organic'
  | 'mood-warm'
  | 'mood-mono'
  | 'mood-playful';

export type ModelMood =
  | 'mood-model-dark'
  | 'mood-model-vivid'
  | 'mood-model-soft'
  | 'mood-model-clean';

export type HeroMood = ProductMood | ModelMood;

// ── 폰트셋 12개 ──

export type FontSetId =
  | 'SET-1'   // 임팩트: 넥슨카트고딕
  | 'SET-2'   // 프리미엄: 넥슨Lv.1고딕
  | 'SET-3'   // 커머스: 고도체
  | 'SET-4'   // 감성: 카페24빛나는별
  | 'SET-5'   // 강렬: 순우리체
  | 'SET-6'   // 소프트: 나눔스퀘어라운드
  | 'SET-7'   // 유쾌: Jua
  | 'SET-8'   // 어그로: 어그로체
  | 'SET-9'   // 클래식고딕: 조선견고딕
  | 'SET-10'  // 전통명조: 독립체
  | 'SET-11'  // 감성필기: 한교안심상장체
  | 'SET-12'  // 세련세리프: 서강체
  | 'SET-13'  // 뷰티프리미엄: 나눔명조
  | 'SET-14'  // 모던클린: Gmarket Sans
  | 'SET-15'; // 에디토리얼: Noto Serif KR

// ── ANALYZE 6개 필드 ──

export interface ImageAnalyze {
  source: 'reference' | 'derived';
  contentType: 'photo' | 'graphic' | 'number' | 'text';
  composition: 'center' | 'left' | 'right';
  subjectSize: 'small' | 'medium' | 'large';
  subjectPosition: 'top' | 'middle' | 'bottom';
  backgroundType: 'clean' | 'textured' | 'complex';
  angle: 'straight' | 'tilted';
}

// ── 업종 카테고리 ──

export type IndustryCategory =
  | 'beauty'
  | 'cosmetics'
  | 'perfume'
  | 'health'
  | 'organic'
  | 'food'
  | 'cafe'
  | 'sports'
  | 'tech'
  | 'fashion'
  | 'kids'
  | 'pet'
  | 'interior'
  | 'medical'
  | 'b2b'
  | 'default';

// ── brandColor 기본값 맵 ──

export const BRAND_COLOR_MAP: Record<IndustryCategory, string> = {
  beauty: '#C9A96E',
  cosmetics: '#E91E8C',
  perfume: '#8B5CF6',
  health: '#2E7D32',
  organic: '#4A7C59',
  food: '#DC2626',
  cafe: '#C25E1A',
  sports: '#2563EB',
  tech: '#0EA5E9',
  fashion: '#0A0A0A',
  kids: '#FF6B6B',
  pet: '#FF9800',
  interior: '#78716C',
  medical: '#0369A1',
  b2b: '#1D4ED8',
  default: '#4A90D9',
};

// ── 기존 호환 타입 ──

export type { ElementWeight };

export type HeroLayoutPattern =
  | 'hero_fullscreen_center'
  | 'hero_split_left'
  | 'hero_split_right'
  | 'hero_gradient_overlay'
  | 'hero_video_style';

export type IndustryWeightMap = Record<IndustryCategory, ElementWeight>;

export interface DecisionStylePreset {
  background: string;
  textColor: string;
  accentColor: string;
  fontSize: { headline: string; body: string };
  spacing: string;
}
