// ============================================================
// Learning Loop Engine — 규칙/상수
// 진단 임계값, 처방 매핑 템플릿
// ============================================================

import type { DiagnosisType, Diagnosis, Prescription } from './types';

/** 일일 진단 임계값 */
export const THRESHOLDS = {
  bounceRate: { high: 70, critical: 85 },
  conversionRate: { low: 1, veryLow: 0.5 },
  avgScrollDepth: { low: 30, veryLow: 15 },
  avgTimeOnPage: { low: 15, veryLow: 8 },
  sectionExitRate: { high: 40, critical: 60 },
  ctaClickRate: { low: 1, veryLow: 0.3 },
} as const;

/** 진단 데이터 최소 방문자 수 (이하 데이터 부족으로 스킵) */
export const MIN_VISIT_COUNT = 10;

/** 섹션 통계 최소 노출 수 (이하 스킵) */
export const MIN_SECTION_IMPRESSIONS = 10;

/** 히어로 섹션 이탈률 경고 임계값 */
export const HERO_EXIT_RATE_WARNING = 30;

/** 히어로 섹션 이탈률 critical 임계값 */
export const HERO_EXIT_RATE_CRITICAL = 50;

/** A/B 테스트 승자 확정 최소 신뢰도 */
export const AB_TEST_MIN_CONFIDENCE = 0.95;

/** A/B 테스트 기본 트래픽 배분 (%) */
export const AB_TEST_TRAFFIC_SPLIT = 50;

/** A/B 테스트 승자 트래픽 (%) */
export const AB_TEST_WINNER_TRAFFIC = 100;

/** 처방 레벨 기준 */
export const PRESCRIPTION_LEVEL = {
  critical: 3,
  high: 2,
  medium: 1,
} as const;

/** 처방 레벨별 A/B 테스트 최소 샘플 사이즈 */
export const AB_TEST_MIN_SAMPLE: Record<number, number> = {
  3: 200,
  2: 100,
  1: 100,
};

/**
 * 진단 유형별 처방 생성 팩토리
 * level은 호출 시점에 주입 (generatePrescriptionLevel 결과)
 */
export function buildPrescriptionMap(
  diag: Diagnosis,
  level: 1 | 2 | 3,
): Record<DiagnosisType, Prescription> {
  return {
    hero_weak: {
      level,
      actions: [
        {
          type: level >= 2 ? 'layout_swap' : 'copy_tweak',
          target: diag.details.affectedSection,
          description: '히어로 헤드라인/서브헤드라인 변경 또는 레이아웃 교체',
          expectedImprovement: level >= 2 ? 15 : 8,
        },
      ],
    },
    section_dropout: {
      level,
      actions: [
        {
          type: level >= 2 ? 'section_reorder' : 'copy_tweak',
          target: diag.details.affectedSection,
          description: '이탈 섹션 위치 변경 또는 카피 수정',
          expectedImprovement: level >= 2 ? 12 : 5,
        },
      ],
    },
    cta_ignored: {
      level,
      actions: [
        {
          type: 'copy_tweak',
          target: diag.details.affectedSection ?? 'all',
          description: 'CTA 문구, 색상, 위치 변경',
          expectedImprovement: 10,
        },
      ],
    },
    scroll_cliff: {
      level,
      actions: [
        {
          type: 'section_reorder',
          description: '관심도 높은 섹션을 상단으로 이동',
          expectedImprovement: 12,
        },
      ],
    },
    mobile_gap: {
      level,
      actions: [
        {
          type: 'layout_swap',
          description: '모바일 최적화 레이아웃으로 교체',
          expectedImprovement: 10,
        },
      ],
    },
    bounce_high: {
      level,
      actions: [
        {
          type: level >= 3 ? 'full_regenerate' : 'copy_tweak',
          description: '히어로 섹션 전면 개편 또는 전체 재생성',
          expectedImprovement: level >= 3 ? 25 : 10,
        },
      ],
    },
    dwell_low: {
      level,
      actions: [
        {
          type: 'copy_tweak',
          description: '본문 카피 강화, 구체적 수치/사례 추가',
          expectedImprovement: 8,
        },
      ],
    },
  };
}
