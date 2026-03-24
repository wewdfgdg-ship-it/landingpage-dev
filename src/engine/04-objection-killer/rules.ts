// ============================================================
// Objection Killer Engine — 규칙/상수
// 저항 활성화 임계값, 저항 유형별 파괴 전략 템플릿
// ============================================================

import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { ObjectionType } from './types';

/** 저항 활성화 최소 레벨 (이 레벨 이상이면 파괴 전략 적용) */
export const ACTIVATION_THRESHOLD = 3;

/** 저항 유형별 파괴 전략 템플릿 */
export interface StrategyTemplate {
  strategies: string[];
  injectNear: string[]; // 주입 대상 sectionType
  copyTemplate: (brief: ProductBrief) => string;
}

export const STRATEGY_TEMPLATES: Record<ObjectionType, StrategyTemplate> = {
  price: {
    strategies: ['daily_split', 'roi_calculator', 'anchor_pricing', 'bundle_discount'],
    injectNear: ['pricing', 'final_cta'],
    copyTemplate: (brief) =>
      brief.productDNA.valueHierarchy.functional
        ? `합리적 투자로 ${brief.productDNA.valueHierarchy.functional}`
        : '하루 작은 투자로 큰 변화를 경험하세요',
  },
  trust: {
    strategies: ['review_highlight', 'guarantee_badge', 'logo_bar', 'expert_endorsement'],
    injectNear: ['social_proof', 'testimonials', 'benefit_highlight'],
    copyTemplate: () => '이미 수많은 고객이 검증했습니다',
  },
  need: {
    strategies: ['before_after', 'loss_framing', 'statistics', 'empathy_story'],
    injectNear: ['pain_point', 'problem_agitation'],
    copyTemplate: (brief) =>
      brief.customerFear.problem || '지금 해결하지 않으면 문제가 계속됩니다',
  },
  urgency: {
    strategies: ['countdown', 'scarcity_indicator', 'social_proof_realtime'],
    injectNear: ['urgency_counter', 'final_cta', 'mini_cta'],
    copyTemplate: () => '지금이 시작할 최적의 타이밍입니다',
  },
  complexity: {
    strategies: ['three_step_guide', 'demo_video', 'comparison_table', 'support_highlight'],
    injectNear: ['how_it_works', 'feature_showcase'],
    copyTemplate: () => '3단계만 따라하면 됩니다',
  },
};
