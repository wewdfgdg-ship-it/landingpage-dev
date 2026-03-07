// ============================================================
// Conversion Strategy Engine — 타입 정의
// ============================================================

export type StrategyType =
  | 'direct_sale'
  | 'lead_generation'
  | 'free_trial'
  | 'content_hook'
  | 'event_registration';

export type SectionRole =
  | 'HOOK'
  | 'PAIN'
  | 'SOLUTION'
  | 'PROOF'
  | 'OBJECTION'
  | 'URGENCY'
  | 'CTA';

export interface StructureSection {
  order: number;
  role: SectionRole;
  sectionType: string; // hero_visual, pain_point, benefit_highlight 등
  purpose: string;
}

export interface StrategyBlueprint {
  strategyType: StrategyType;
  totalSections: number;
  structure: StructureSection[];
  ctaPositions: number[];
  estimatedScrollDepth: string;
  targetReadTime: string;
}
