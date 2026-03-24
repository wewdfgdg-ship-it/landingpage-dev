import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { ObjectionMap, ObjectionStrategy, ObjectionType } from './types';
export type { ObjectionMap } from './types';
import { ACTIVATION_THRESHOLD, STRATEGY_TEMPLATES, type StrategyTemplate } from './rules';

// ============================================================
// Objection Killer Engine — 규칙 엔진 (AI 호출 없음)
// resistance_map에서 level 3+ 항목을 자동으로 찾아 파괴 전략 배정
// ============================================================

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
