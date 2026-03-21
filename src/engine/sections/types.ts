// ============================================================
// Section Agent — 공통 타입 정의
// 26개 섹션 에이전트가 공유하는 인터페이스
// ============================================================

import type { ProductBrief } from '@/engine/01-product-intelligence/types';

/** 섹션 키 (26개) */
export type SectionKey =
  | 'HEADER_BANNER'
  | 'KEY_FEATURES'
  | 'FEATURE_DETAIL_1'
  | 'FEATURE_DETAIL_2'
  | 'FEATURE_DETAIL_3'
  | 'SPECS'
  | 'HOW_TO_USE'
  | 'TARGET_PERSONA'
  | 'BEFORE_AFTER'
  | 'LIFESTYLE'
  | 'CERTIFICATION'
  | 'FAQ'
  | 'REVIEWS'
  | 'SHIPPING'
  | 'CTA'
  | 'STATS_NUMBERS'
  | 'COMPETITOR_COMPARE'
  | 'BRAND_STORY'
  | 'PACKAGE_CONTENTS'
  | 'PHOTO_REVIEWS'
  | 'SNS_VIRAL'
  | 'BUNDLE_SET'
  | 'LIMITED_OFFER'
  | 'REFUND_POLICY'
  | 'CUSTOMER_SERVICE'
  | 'PRICE_TABLE';

/** 4요소 비중 */
export interface ElementWeight {
  photo: number;      // 0~100
  text: number;       // 0~100
  graphic: number;    // 0~100
  animation: number;  // 0~100
}

/** 레이아웃 요소 */
export interface LayoutElement {
  element: string;    // 'image' | 'text_block' | 'card' | 'badge' 등
  position: string;   // 'left' | 'right' | 'center' | 'top' | 'bottom'
  width: string;      // '50%' | '100%' | 'auto'
}

/** 섹션 에이전트 입력 */
export interface SectionAgentInput {
  sectionKey: SectionKey;
  order: number;
  productName: string;
  industry: string;
  brief: ProductBrief;
  strategyHint: string;       // ③이 전달하는 전략 지시
  tone: string;               // 톤 지시
  targetEmotion: string;      // 목표 감정
}

/** 섹션 에이전트 출력 */
export interface SectionAgentOutput {
  sectionKey: SectionKey;
  order: number;
  copy: {
    headline: string;
    subheadline: string;
    body: string;
    bulletPoints: string[];
    ctaText: string;
    microCopy: string;
  };
  layout: {
    type: string;              // 레이아웃 패턴 ID
    structure: LayoutElement[];
  };
  style: {
    background: string;
    textColor: string;
    accentColor: string;
    fontSize: {
      headline: string;
      body: string;
    };
    spacing: string;
  };
  imagePrompt: string;
  elementWeight: ElementWeight;
  /** v4 Header-Banner 전용 메타데이터 (렌더링 시 renderHeroBanner에 전달) */
  v4Meta?: {
    layoutId: string;
    mood: string;
    fontSet: string;
    brandColor: string;
  };
}

/** 섹션 에이전트 실행 함수 시그니처 */
export type SectionAgentRunner = (input: SectionAgentInput) => SectionAgentOutput;
