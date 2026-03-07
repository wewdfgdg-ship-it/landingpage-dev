// ============================================================
// Trust Architecture Engine — 타입 정의
// ============================================================

export type TrustLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface TrustElement {
  level: TrustLevel;
  name: string; // 존재감, 전문성, 제3자검증, 사회증명, 안전장치, 동료압력
  customerPsychology: string;
  elements: string[]; // 로고, 프로디자인, 리뷰 등
  placement: string; // Hero, Solution직후, CTA직전 등
  sectionOrder: number; // 배치할 섹션 순서
}

export interface TrustConfig {
  trustElements: TrustElement[];
  trustScore: number; // 신뢰 요소 커버리지 0~100
}
