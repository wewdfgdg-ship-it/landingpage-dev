import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { ObjectionMap, ObjectionStrategy, ObjectionType } from './types';
export type { ObjectionMap } from './types';

// ============================================================
// Objection Killer Engine — 규칙 엔진 (AI 호출 없음)
// resistance_map에서 level 3+ 항목을 자동으로 찾아 파괴 전략 배정
// ============================================================

const ACTIVATION_THRESHOLD = 3;

// --- 저항별 파괴 전략 매핑 ---

interface StrategyTemplate {
  strategies: string[];
  injectNear: string[]; // 주입 대상 sectionType
  copyTemplate: (brief: ProductBrief) => string;
}

const STRATEGY_TEMPLATES: Record<ObjectionType, StrategyTemplate> = {
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

function findInjectPositions(
  template: StrategyTemplate,
  blueprint: StrategyBlueprint,
): string[] {
  const positions: string[] = [];

  for (const section of blueprint.structure) {
    if (template.injectNear.includes(section.sectionType)) {
      positions.push(`section_${section.order}_${section.sectionType}`);
    }
  }

  // 배치 대상이 없으면 PROOF/OBJECTION 역할 섹션에 주입
  if (positions.length === 0) {
    for (const section of blueprint.structure) {
      if (section.role === 'PROOF' || section.role === 'OBJECTION') {
        positions.push(`section_${section.order}_${section.sectionType}`);
        break;
      }
    }
  }

  return positions;
}

export function runObjectionKiller(
  brief: ProductBrief,
  blueprint: StrategyBlueprint,
): ObjectionMap {
  const resistances: { type: ObjectionType; level: number }[] = [
    { type: 'price', level: brief.resistanceMap.price.level },
    { type: 'trust', level: brief.resistanceMap.trust.level },
    { type: 'need', level: brief.resistanceMap.need.level },
    { type: 'urgency', level: brief.resistanceMap.urgency.level },
    { type: 'complexity', level: brief.resistanceMap.complexity.level },
  ];

  const activeObjections: ObjectionStrategy[] = resistances
    .filter((r) => r.level >= ACTIVATION_THRESHOLD)
    .sort((a, b) => b.level - a.level) // 높은 레벨 우선
    .map((r) => {
      const template = STRATEGY_TEMPLATES[r.type];
      // level에 따라 전략 수 조정: level 3→2개, 4→3개, 5→4개
      const strategyCount = Math.min(template.strategies.length, r.level - 1);

      return {
        type: r.type,
        level: r.level,
        strategies: template.strategies.slice(0, strategyCount),
        injectAt: findInjectPositions(template, blueprint),
        copyDirection: template.copyTemplate(brief),
      };
    });

  return { activeObjections };
}
