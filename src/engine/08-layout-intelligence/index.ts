import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { AttentionConfig } from '@/engine/07-attention-architecture/types';
import type { LayoutPattern, SectionLayout, LayoutConfig } from './types';
import {
  PATTERNS,
  ROLE_CATEGORY_MAP,
  DEFAULT_CATEGORIES,
  ZONE_THRESHOLDS,
  SCORING_WEIGHTS,
  CONTENT_AMOUNT_MAP,
  DEFAULT_CONTENT_AMOUNT,
  DEFAULT_MOBILE_SCORE,
} from './rules';
export type { LayoutConfig } from './types';

// ============================================================
// Layout Intelligence Engine — 규칙 엔진 (AI 호출 없음)
// 섹션 타입 × 역할 × Zone → 최적 레이아웃 패턴 자동 선택
// ============================================================

// --- Zone 결정 (섹션 순서 기반) ---

function getZoneForOrder(order: number, totalSections: number): string {
  const ratio = order / totalSections;
  if (order === 1) return 'first_view';
  if (ratio <= ZONE_THRESHOLDS.interest) return 'interest';
  if (ratio <= ZONE_THRESHOLDS.desire) return 'desire';
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

  // Zone 적합성
  if (pattern.bestForZones.includes(zone)) {
    score += SCORING_WEIGHTS.zoneMatch;
  } else {
    score += SCORING_WEIGHTS.zoneDefault;
  }

  // 모바일 친화도
  score += (pattern.mobileScore / 100) * SCORING_WEIGHTS.mobileFriendliness;

  // 의사결정 유형 매칭
  if (pattern.bestForDecisionTypes.includes(decisionType)) {
    score += SCORING_WEIGHTS.decisionTypeMatch;
  } else {
    score += SCORING_WEIGHTS.decisionTypeDefault;
  }

  // 콘텐츠 양 적합
  if (contentAmount >= pattern.minContentAmount && contentAmount <= pattern.maxContentAmount) {
    score += SCORING_WEIGHTS.contentFit;
  } else if (
    Math.abs(contentAmount - pattern.minContentAmount) <= 1 ||
    Math.abs(contentAmount - pattern.maxContentAmount) <= 1
  ) {
    score += SCORING_WEIGHTS.contentNear;
  }

  // 시각적 다양성 — 이전에 사용한 패턴과 겹치면 감점
  if (usedPatterns.has(pattern.id)) {
    score += 0;
  } else if (usedPatterns.has(pattern.category)) {
    score += SCORING_WEIGHTS.diversitySameCategory;
  } else {
    score += SCORING_WEIGHTS.diversityNew;
  }

  return Math.round(score);
}

// --- 콘텐츠 양 추정 (역할 기반) ---

function estimateContentAmount(role: string): number {
  return CONTENT_AMOUNT_MAP[role] ?? DEFAULT_CONTENT_AMOUNT;
}

// --- 메인 엔진 ---

export function runLayoutIntelligence(
  brief: ProductBrief,
  blueprint: StrategyBlueprint,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _attention: AttentionConfig,
): LayoutConfig {
  const usedPatterns = new Set<string>();
  const sections: SectionLayout[] = [];

  for (const section of blueprint.structure) {
    const zone = getZoneForOrder(section.order, blueprint.totalSections);
    const contentAmount = estimateContentAmount(section.role);

    // 역할에 맞는 카테고리 필터
    const allowedCategories = ROLE_CATEGORY_MAP[section.role] ?? DEFAULT_CATEGORIES;
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
    return pattern?.mobileScore ?? DEFAULT_MOBILE_SCORE;
  });
  const mobileReadyScore = Math.round(
    mobileScores.reduce((a, b) => a + b, 0) / Math.max(mobileScores.length, 1),
  );

  return { sections, diversityScore, mobileReadyScore };
}
