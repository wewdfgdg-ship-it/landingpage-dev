import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { AttentionConfig, HookType, GazePattern, ZoneConfig } from './types';
export type { AttentionConfig } from './types';

// ============================================================
// Attention Architecture Engine — 규칙 엔진 (AI 호출 없음)
// 4 Zone 설계 + Hook/시선 패턴 자동 결정
// ============================================================

// --- Hook 유형 선택 (의사결정 유형 기반) ---

function selectHookType(decisionType: string): HookType {
  switch (decisionType) {
    case 'impulse':
      return 'visual_hook';
    case 'analytical':
      return 'question_hook';
    case 'cautious':
      return 'result_hook';
    case 'follower':
      return 'social_hook';
    default:
      return 'visual_hook';
  }
}

// --- 시선 동선 패턴 (업종 기반) ---

const GAZE_MAP: Record<string, GazePattern> = {
  saas: 'f_pattern',
  b2b: 'f_pattern',
  ecommerce: 'z_pattern',
  beauty: 'z_pattern',
  food: 'z_pattern',
  education: 'f_pattern',
  health: 'f_pattern',
  finance: 'f_pattern',
  lifestyle: 'center_focus',
  other: 'z_pattern',
};

function selectGazePattern(industry: string): GazePattern {
  return GAZE_MAP[industry] ?? 'z_pattern';
}

// --- 4 Zone 설계 ---

function buildZones(totalSections: number): ZoneConfig[] {
  const sectionHeight = 600; // 평균 섹션 높이
  const totalHeight = totalSections * sectionHeight;

  // Zone 경계 계산 (비율 기반)
  const z1End = sectionHeight; // 첫 섹션
  const z2End = Math.round(totalHeight * 0.4);
  const z3End = Math.round(totalHeight * 0.75);

  return [
    {
      zone: 'first_view',
      pixelRange: { start: 0, end: z1End },
      visualRatio: 80,
      textRatio: 20,
      dataRatio: 0,
      ctaRatio: 0,
      rhythm: '시각적 임팩트 100% — 텍스트 최소화',
      interactions: ['fade_in', 'parallax'],
      restrictions: ['폼/가격/복잡한 정보 배치 금지'],
    },
    {
      zone: 'interest',
      pixelRange: { start: z1End, end: z2End },
      visualRatio: 60,
      textRatio: 40,
      dataRatio: 0,
      ctaRatio: 0,
      rhythm: '밀 → 소 → 밀 (정보 밀도 교차)',
      interactions: ['fade_in', 'icon_sequence', 'counter_animation'],
      restrictions: ['강조 인용구와 미니 CTA로 이탈 방지'],
    },
    {
      zone: 'desire',
      pixelRange: { start: z2End, end: z3End },
      visualRatio: 20,
      textRatio: 50,
      dataRatio: 30,
      ctaRatio: 0,
      rhythm: '증거 → 감정 → 증거 → 감정',
      interactions: ['before_after_slider', 'review_carousel', 'tab_accordion', 'video'],
      restrictions: ['중간 CTA 1~2개 필수'],
    },
    {
      zone: 'action',
      pixelRange: { start: z3End, end: totalHeight },
      visualRatio: 0,
      textRatio: 0,
      dataRatio: 0,
      ctaRatio: 70,
      rhythm: '가치 요약 + 보증 + CTA + FAQ',
      interactions: ['sticky_cta_bar'],
      restrictions: ['새로운 정보 추가 금지', '깔끔하고 집중된 레이아웃'],
    },
  ];
}

export function runAttentionArchitecture(
  brief: ProductBrief,
  blueprint: StrategyBlueprint,
  industry: string,
): AttentionConfig {
  const hookType = selectHookType(brief.decisionType);
  const gazePattern = selectGazePattern(industry);
  const zones = buildZones(blueprint.totalSections);

  // Sticky CTA: 긴급성 저항 높거나 섹션 많을 때
  const stickyCtaEnabled =
    brief.resistanceMap.urgency.level >= 4 || blueprint.totalSections >= 10;

  // Exit Intent: 가격 저항 높을 때
  const exitIntentEnabled = brief.resistanceMap.price.level >= 4;

  return {
    hookType,
    gazePattern,
    zones,
    stickyCtaEnabled,
    exitIntentEnabled,
  };
}
