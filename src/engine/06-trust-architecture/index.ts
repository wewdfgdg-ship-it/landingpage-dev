import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { TrustConfig, TrustElement, TrustLevel } from './types';
export type { TrustConfig } from './types';

// ============================================================
// Trust Architecture Engine — 규칙 엔진 (AI 호출 없음)
// 신뢰 6레벨을 순서대로 배치 (건너뛰기 금지)
// ============================================================

interface TrustLevelTemplate {
  level: TrustLevel;
  name: string;
  customerPsychology: string;
  elements: string[];
  targetRoles: string[]; // 배치 대상 역할
}

const TRUST_TEMPLATES: TrustLevelTemplate[] = [
  {
    level: 1,
    name: '존재감',
    customerPsychology: '이 브랜드 실재하는구나',
    elements: ['브랜드 로고', '프로페셔널 디자인', '커스텀 도메인'],
    targetRoles: ['HOOK'],
  },
  {
    level: 2,
    name: '전문성',
    customerPsychology: '이 분야를 아는구나',
    elements: ['상세 스펙', '기술 설명', '전문 용어 활용'],
    targetRoles: ['SOLUTION'],
  },
  {
    level: 3,
    name: '제3자 검증',
    customerPsychology: '다른 사람도 인정하는구나',
    elements: ['인증 마크', '특허', '수상 경력', '미디어 소개'],
    targetRoles: ['PROOF'],
  },
  {
    level: 4,
    name: '사회 증명',
    customerPsychology: '많은 사람이 쓰는구나',
    elements: ['고객 리뷰', '판매량', '고객사 로고', '별점'],
    targetRoles: ['PROOF'],
  },
  {
    level: 5,
    name: '안전장치',
    customerPsychology: '실패해도 괜찮겠구나',
    elements: ['환불 보증', 'AS 정책', 'FAQ', '고객센터'],
    targetRoles: ['OBJECTION', 'CTA'],
  },
  {
    level: 6,
    name: '동료 압력',
    customerPsychology: '다른 사람도 지금 보고 있구나',
    elements: ['실시간 조회 수', '최근 구매 알림'],
    targetRoles: ['CTA'],
  },
];

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
