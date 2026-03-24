import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { TrustConfig, TrustElement, TrustLevel } from './types';
export type { TrustConfig } from './types';
import { TRUST_TEMPLATES, type TrustLevelTemplate } from './rules';

// ============================================================
// Trust Architecture Engine — 규칙 엔진 (AI 호출 없음)
// 신뢰 6레벨을 순서대로 배치 (건너뛰기 금지)
// ============================================================

function findSectionOrder(
  targetRoles: string[],
  blueprint: StrategyBlueprint,
  usedOrders: Set<number>,
): number {
  for (const role of targetRoles) {
    for (const section of blueprint.structure) {
      if (section.role === role && !usedOrders.has(section.order)) {
        return section.order;
      }
    }
  }
  // 못 찾으면 마지막 섹션
  return blueprint.totalSections;
}

function selectRelevantElements(
  template: TrustLevelTemplate,
  brief: ProductBrief,
): string[] {
  // 신뢰 저항이 높으면 더 많은 요소 활성화
  const trustLevel = brief.resistanceMap.trust.level;
  const count = trustLevel >= 4 ? template.elements.length : Math.min(2, template.elements.length);
  return template.elements.slice(0, count);
}

export function runTrustArchitecture(
  brief: ProductBrief,
  blueprint: StrategyBlueprint,
): TrustConfig {
  const usedOrders = new Set<number>();
  const trustElements: TrustElement[] = [];

  // Lv6(동료 압력)은 선택적: 의사결정 유형이 follower이거나 신뢰 저항 높을 때만
  const maxLevel: TrustLevel =
    brief.decisionType === 'follower' || brief.resistanceMap.trust.level >= 4 ? 6 : 5;

  for (const template of TRUST_TEMPLATES) {
    if (template.level > maxLevel) continue;

    const sectionOrder = findSectionOrder(template.targetRoles, blueprint, usedOrders);
    usedOrders.add(sectionOrder);

    const elements = selectRelevantElements(template, brief);

    trustElements.push({
      level: template.level,
      name: template.name,
      customerPsychology: template.customerPsychology,
      elements,
      placement: template.targetRoles[0],
      sectionOrder,
    });
  }

  // 커버리지 점수: 활성 레벨 수 / 전체 레벨 수 * 100
  const trustScore = Math.round((trustElements.length / 6) * 100);

  return { trustElements, trustScore };
}
