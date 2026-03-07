// ============================================================
// Objection Killer Engine — 타입 정의
// ============================================================

export type ObjectionType = 'price' | 'trust' | 'need' | 'urgency' | 'complexity';

export interface ObjectionStrategy {
  type: ObjectionType;
  level: number; // 1~5
  strategies: string[]; // daily_split, roi_calculator, anchor_pricing 등
  injectAt: string[]; // 섹션 위치 지시
  copyDirection: string; // 카피 방향성
}

export interface ObjectionMap {
  activeObjections: ObjectionStrategy[];
}
