// ============================================================
// Why Now Engine — 타입 정의
// ============================================================

export type UrgencyType =
  | 'time_based'
  | 'quantity_based'
  | 'situational'
  | 'emotional'
  | 'price_anchor';

export interface UrgencyElement {
  type: string; // loss_calculator, price_comparison, countdown 등
  message: string;
}

export type UrgencyPlacement = 'mid_page' | 'final_cta' | 'sticky_bar' | 'hero' | 'pricing';

export interface UrgencyBrief {
  primaryType: UrgencyType;
  secondaryType: UrgencyType | null;
  urgencyElements: UrgencyElement[];
  ctaUrgencyLevel: number; // 1~5
  placement: UrgencyPlacement[];
}
