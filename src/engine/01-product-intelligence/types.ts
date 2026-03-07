// ============================================================
// Product Intelligence Engine — 타입 정의
// ============================================================

/** 제품 DNA */
export interface ProductDNA {
  coreValue: string; // 이 제품이 존재하는 이유 1문장
  usp: string[]; // 유일한 차별점 1~3개
  positioning: 'premium' | 'value' | 'innovation' | 'tradition';
  valueHierarchy: {
    functional: string; // 기능적 가치
    emotional: string; // 감정적 가치
    social: string; // 사회적 가치
  };
}

/** 고객 욕망 */
export interface CustomerDesire {
  surface: string; // 표면 욕망
  real: string; // 진짜 욕망
  hidden: string; // 숨은 욕망
}

/** 고객 공포 */
export interface CustomerFear {
  problem: string; // 문제 공포
  opportunity: string; // 기회 공포
  social: string; // 사회 공포
}

/** 구매 저항 항목 */
export interface ResistanceItem {
  level: number; // 1~5
  reason: string;
}

/** 구매 저항 지도 */
export interface ResistanceMap {
  price: ResistanceItem;
  trust: ResistanceItem;
  need: ResistanceItem;
  urgency: ResistanceItem;
  complexity: ResistanceItem;
}

/** 의사결정 유형 */
export type DecisionType = 'impulse' | 'analytical' | 'cautious' | 'follower';

/** 시장 컨텍스트 */
export interface MarketContext {
  competitionLevel: 'red_ocean' | 'blue_ocean' | 'niche';
  priceSensitivity: 'high' | 'medium' | 'low';
  purchaseCycle: 'one_time' | 'repeat' | 'subscription';
  decisionTime: 'instant' | '1_day' | '1_week' | '1_month_plus';
  primaryChannel: 'direct_online' | 'comparison' | 'referral';
}

/** Product Brief — 이 엔진의 최종 출력 */
export interface ProductBrief {
  productDNA: ProductDNA;
  customerDesire: CustomerDesire;
  customerFear: CustomerFear;
  resistanceMap: ResistanceMap;
  decisionType: DecisionType;
  marketContext: MarketContext;
  confidenceScore: number; // 0~100
}

/** 엔진 입력: 위저드에서 수집한 데이터 */
export interface ProductIntelligenceInput {
  basicInfo: {
    productName: string;
    industry: string;
    priceRange: string;
    pageGoal: string;
    targetAudience: string;
    competitorUrl: string;
  };
  images: { storageKey: string }[];
  deepAnswers: { question: string; answer: string }[];
}
