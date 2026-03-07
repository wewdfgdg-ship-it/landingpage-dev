// ============================================================
// Layout Intelligence Engine — 타입 정의
// ============================================================

export type LayoutCategory =
  | 'hero'
  | 'feature'
  | 'social_proof'
  | 'pricing'
  | 'cta'
  | 'faq'
  | 'misc';

export interface LayoutPattern {
  id: string;
  category: LayoutCategory;
  name: string;
  description: string;
  mobileScore: number; // 0~100 모바일 친화도
  bestForDecisionTypes: string[]; // impulse, analytical 등
  bestForZones: string[]; // first_view, interest, desire, action
  minContentAmount: number; // 최소 콘텐츠 양 (1~5)
  maxContentAmount: number; // 최대 콘텐츠 양 (1~5)
}

export interface SectionLayout {
  order: number;
  role: string;
  sectionType: string;
  selectedPattern: string; // LayoutPattern.id
  patternName: string;
  score: number; // 선택 점수 (0~100)
  reasoning: string;
}

export interface LayoutConfig {
  sections: SectionLayout[];
  diversityScore: number; // 패턴 다양성 점수 0~100
  mobileReadyScore: number; // 전체 모바일 적합도 0~100
}
