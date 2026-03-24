import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';

/** 기본 ProductBrief mock — 중간 수준의 저항 */
export function createMockBrief(overrides?: Partial<ProductBrief>): ProductBrief {
  return {
    productDNA: {
      coreValue: '시간을 절약하는 자동화 도구',
      usp: ['AI 기반 자동화', '3분 안에 완성'],
      positioning: 'innovation',
      valueHierarchy: {
        functional: '매일 2시간 절약',
        emotional: '불필요한 반복 작업에서 해방',
        social: '팀에서 효율적인 사람으로 인정',
      },
    },
    customerDesire: {
      surface: '빠르게 랜딩페이지를 만들고 싶다',
      real: '마케팅 성과를 빠르게 검증하고 싶다',
      hidden: '전문가처럼 보이고 싶다',
    },
    customerFear: {
      problem: '랜딩페이지 없이 광고비를 낭비하고 있다',
      opportunity: '경쟁사보다 빠르게 시장을 선점해야 한다',
      social: '마케팅 못하는 사람으로 보일까 두렵다',
    },
    resistanceMap: {
      price: { level: 3, reason: '가격 대비 가치 불확실' },
      trust: { level: 2, reason: '신규 서비스라 신뢰 부족' },
      need: { level: 3, reason: '기존 도구로도 가능하다고 생각' },
      urgency: { level: 2, reason: '급하지 않다고 느낌' },
      complexity: { level: 1, reason: '사용법이 간단해 보임' },
    },
    decisionType: 'analytical',
    marketContext: {
      competitionLevel: 'red_ocean',
      priceSensitivity: 'medium',
      purchaseCycle: 'subscription',
      decisionTime: '1_day',
      primaryChannel: 'direct_online',
    },
    confidenceScore: 85,
    ...overrides,
  };
}

/** 고저항 ProductBrief — 모든 저항이 높음 */
export function createHighResistanceBrief(): ProductBrief {
  return createMockBrief({
    resistanceMap: {
      price: { level: 5, reason: '너무 비싸다' },
      trust: { level: 5, reason: '전혀 모르는 회사' },
      need: { level: 4, reason: '필요성 못 느낌' },
      urgency: { level: 5, reason: '나중에 해도 된다' },
      complexity: { level: 4, reason: '어려워 보인다' },
    },
    decisionType: 'cautious',
  });
}

/** 충동 구매형 ProductBrief */
export function createImpulseBrief(): ProductBrief {
  return createMockBrief({
    resistanceMap: {
      price: { level: 1, reason: '가격 부담 없음' },
      trust: { level: 1, reason: '유명 브랜드' },
      need: { level: 2, reason: '약간 필요' },
      urgency: { level: 1, reason: '바로 사용 가능' },
      complexity: { level: 1, reason: '쉬운 사용' },
    },
    decisionType: 'impulse',
  });
}

/** 기본 StrategyBlueprint mock */
export function createMockBlueprint(overrides?: Partial<StrategyBlueprint>): StrategyBlueprint {
  return {
    strategyType: 'direct_sale',
    totalSections: 8,
    structure: [
      { order: 1, role: 'HOOK', sectionType: 'hero_visual', purpose: '첫인상' },
      { order: 2, role: 'PAIN', sectionType: 'pain_point', purpose: '고통 인식' },
      { order: 3, role: 'SOLUTION', sectionType: 'benefit_highlight', purpose: '솔루션 제시' },
      { order: 4, role: 'PROOF', sectionType: 'social_proof', purpose: '사회적 증거' },
      { order: 5, role: 'PROOF', sectionType: 'testimonials', purpose: '후기' },
      { order: 6, role: 'OBJECTION', sectionType: 'pricing', purpose: '가격 제시' },
      { order: 7, role: 'URGENCY', sectionType: 'urgency_counter', purpose: '긴급성' },
      { order: 8, role: 'CTA', sectionType: 'final_cta', purpose: '행동 유도' },
    ],
    ctaPositions: [3, 6, 8],
    estimatedScrollDepth: '85%',
    targetReadTime: '4분',
    ...overrides,
  };
}
