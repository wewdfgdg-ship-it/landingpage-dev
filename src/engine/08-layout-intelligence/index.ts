import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { AttentionConfig } from '@/engine/07-attention-architecture/types';
import type { LayoutPattern, LayoutCategory, SectionLayout, LayoutConfig } from './types';
export type { LayoutConfig } from './types';
import { PATTERNS, ROLE_CATEGORY_MAP, ZONE_RATIOS, SCORE_WEIGHTS } from './rules';

// ============================================================
// Layout Intelligence Engine — 규칙 엔진 (AI 호출 없음)
// 섹션 타입 × 역할 × Zone → 최적 레이아웃 패턴 자동 선택
// ============================================================

// --- Zone 결정 (섹션 순서 기반) ---

function getZoneForOrder(order: number, totalSections: number): string {
  const ratio = order / totalSections;
  if (order === 1) return 'first_view';
  if (ratio <= ZONE_RATIOS.interest) return 'interest';
  if (ratio <= ZONE_RATIOS.desire) return 'desire';
  return 'action';
}

// --- 패턴 점수 계산 ---

function scorePattern(
  pattern: LayoutPattern,
  zone: string,
  decisionType: string,
  contentAmount: number,
  usedPatterns: Set<string>,
): number {
  let score = 0;

  // Zone 적합성 (30%)
  score += pattern.bestForZones.includes(zone)
    ? SCORE_WEIGHTS.zone
    : SCORE_WEIGHTS.zoneFallback;

  // 모바일 친화도 (25%)
  score += (pattern.mobileScore / 100) * SCORE_WEIGHTS.mobile;

  // 의사결정 유형 매칭 (20%)
  score += pattern.bestForDecisionTypes.includes(decisionType)
    ? SCORE_WEIGHTS.decisionType
    : SCORE_WEIGHTS.decisionTypeFallback;

  // 콘텐츠 양 적합 (15%)
  if (contentAmount >= pattern.minContentAmount && contentAmount <= pattern.maxContentAmount) {
    score += SCORE_WEIGHTS.contentFit;
  } else if (
    Math.abs(contentAmount - pattern.minContentAmount) <= 1 ||
    Math.abs(contentAmount - pattern.maxContentAmount) <= 1
  ) {
    score += SCORE_WEIGHTS.contentNearFit;
  }

  // 시각적 다양성 (10%) — 이전에 사용한 패턴과 겹치면 감점
  if (usedPatterns.has(pattern.id)) {
    score += 0;
  } else if (usedPatterns.has(pattern.category)) {
    score += SCORE_WEIGHTS.diversitySameCategory;
  } else {
    score += SCORE_WEIGHTS.diversity;
  }

  return Math.round(score);
}

// --- 콘텐츠 양 추정 (역할 기반) ---

function estimateContentAmount(role: string): number {
  switch (role) {
    case 'HOOK':
      return 2;
    case 'PAIN':
      return 3;
    case 'SOLUTION':
      return 4;
    case 'PROOF':
      return 4;
    case 'OBJECTION':
      return 4;
    case 'URGENCY':
      return 2;
    case 'CTA':
      return 1;
    default:
      return 3;
  }
}

// --- 메인 엔진 ---

export function runLayoutIntelligence(
  brief: ProductBrief,
  blueprint: StrategyBlueprint,
  _attention: AttentionConfig,
): LayoutConfig {
  const usedPatterns = new Set<string>();
  const sections: SectionLayout[] = [];

  for (const section of blueprint.structure) {
    const zone = getZoneForOrder(section.order, blueprint.totalSections);
    const contentAmount = estimateContentAmount(section.role);

    // 역할에 맞는 카테고리 필터
    const allowedCategories = ROLE_CATEGORY_MAP[section.role] ?? ['feature', 'misc'];
    const candidates = PATTERNS.filter((p) => allowedCategories.includes(p.category));

    // 점수 계산 + 정렬
    const scored = candidates
      .map((p) => ({
        pattern: p,
        score: scorePattern(p, zone, brief.decisionType, contentAmount, usedPatterns),
      }))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (!best) continue;

    usedPatterns.add(best.pattern.id);
    usedPatterns.add(best.pattern.category);

    sections.push({
      order: section.order,
      role: section.role,
      sectionType: section.sectionType,
      selectedPattern: best.pattern.id,
      patternName: best.pattern.name,
      score: best.score,
      reasoning: `Zone(${zone}) + ${brief.decisionType} + 콘텐츠(${contentAmount})`,
    });
  }

  // 다양성 점수: 고유 카테고리 수 / 전체 섹션 수
  const uniquePatterns = new Set(sections.map((s) => s.selectedPattern));
  const diversityScore = Math.round(
    (uniquePatterns.size / Math.max(sections.length, 1)) * 100,
  );

  // 모바일 준비도: 전체 섹션의 mobileScore 평균
  const mobileScores = sections.map((s) => {
    const pattern = PATTERNS.find((p) => p.id === s.selectedPattern);
    return pattern?.mobileScore ?? 80;
  });
  const mobileReadyScore = Math.round(
    mobileScores.reduce((a, b) => a + b, 0) / Math.max(mobileScores.length, 1),
  );

  return { sections, diversityScore, mobileReadyScore };
}
