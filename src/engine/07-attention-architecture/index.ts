import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { AttentionConfig, HookType, GazePattern, ZoneConfig } from './types';
import {
  HOOK_TYPE_MAP,
  DEFAULT_HOOK_TYPE,
  GAZE_MAP,
  DEFAULT_GAZE_PATTERN,
  SECTION_HEIGHT,
  ZONE_RATIOS,
  ZONE_TEMPLATES,
  STICKY_CTA_URGENCY_THRESHOLD,
  STICKY_CTA_SECTION_THRESHOLD,
  EXIT_INTENT_PRICE_THRESHOLD,
} from './rules';
export type { AttentionConfig } from './types';

// ============================================================
// Attention Architecture Engine — 규칙 엔진 (AI 호출 없음)
// 4 Zone 설계 + Hook/시선 패턴 자동 결정
// ============================================================

// --- Hook 유형 선택 (의사결정 유형 기반) ---

function selectHookType(decisionType: string): HookType {
  return HOOK_TYPE_MAP[decisionType] ?? DEFAULT_HOOK_TYPE;
}

// --- 시선 동선 패턴 (업종 기반) ---

function selectGazePattern(industry: string): GazePattern {
  return GAZE_MAP[industry] ?? DEFAULT_GAZE_PATTERN;
}

// --- 4 Zone 설계 ---

function buildZones(totalSections: number): ZoneConfig[] {
  const totalHeight = totalSections * SECTION_HEIGHT;

  const z1End = SECTION_HEIGHT;
  const z2End = Math.round(totalHeight * ZONE_RATIOS.interest);
  const z3End = Math.round(totalHeight * ZONE_RATIOS.desire);

  const pixelRanges = [
    { start: 0, end: z1End },
    { start: z1End, end: z2End },
    { start: z2End, end: z3End },
    { start: z3End, end: totalHeight },
  ];

  return ZONE_TEMPLATES.map((template, i) => ({
    zone: template.zone,
    pixelRange: pixelRanges[i],
    visualRatio: template.visualRatio,
    textRatio: template.textRatio,
    dataRatio: template.dataRatio,
    ctaRatio: template.ctaRatio,
    rhythm: template.rhythm,
    interactions: [...template.interactions],
    restrictions: [...template.restrictions],
  }));
}

export function runAttentionArchitecture(
  brief: ProductBrief,
  blueprint: StrategyBlueprint,
  industry: string,
): AttentionConfig {
  const hookType = selectHookType(brief.decisionType);
  const gazePattern = selectGazePattern(industry);
  const zones = buildZones(blueprint.totalSections);

  const stickyCtaEnabled =
    brief.resistanceMap.urgency.level >= STICKY_CTA_URGENCY_THRESHOLD ||
    blueprint.totalSections >= STICKY_CTA_SECTION_THRESHOLD;

  const exitIntentEnabled =
    brief.resistanceMap.price.level >= EXIT_INTENT_PRICE_THRESHOLD;

  return {
    hookType,
    gazePattern,
    zones,
    stickyCtaEnabled,
    exitIntentEnabled,
  };
}
