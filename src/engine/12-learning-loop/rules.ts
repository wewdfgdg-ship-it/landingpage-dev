import type { DiagnosisType, Prescription, Diagnosis } from './types';

// ============================================================
// Learning Loop Engine — 비즈니스 규칙
// ============================================================

// --- 진단 임계값 ---

export const THRESHOLDS = {
  bounceRate: { high: 70, critical: 85 },
  conversionRate: { low: 1, veryLow: 0.5 },
  avgScrollDepth: { low: 30, veryLow: 15 },
  avgTimeOnPage: { low: 15, veryLow: 8 },
  sectionExitRate: { high: 40, critical: 60 },
  ctaClickRate: { low: 1, veryLow: 0.3 },
} as const;

// --- 최소 데이터 임계값 ---

export const MIN_DATA_THRESHOLDS = {
  dailyVisits: 10,
  sectionImpressions: 10,
  ctaImpressions: 50,
} as const;

// --- 히어로 섹션 진단 ---

export const HERO_EXIT_RATE_THRESHOLD = 30 as const;
export const HERO_CRITICAL_EXIT_RATE = 50 as const;

// --- A/B 테스트 설정 ---

export const AB_TEST_CONFIG = {
  defaultTrafficSplit: 50,
  fullTrafficWeight: 100,
  noTrafficWeight: 0,
  targetMetric: 'conversion_rate',
  confidenceThreshold: 0.95,
  maxConfidence: 0.9999,
} as const;

// --- A/B 샘플 사이즈 ---

export const AB_SAMPLE_SIZE = {
  highLevel: 200,
  lowLevel: 100,
  highLevelThreshold: 3,
} as const;

// --- 처방 레벨 매핑 ---

export const SEVERITY_LEVEL_MAP = {
  critical: 3,
  high: 2,
  medium: 1,
  low: 1,
} as const;

// --- 처방 액션 생성기 ---

export function buildPrescriptionMap(diag: Diagnosis): Prescription {
  const level = (SEVERITY_LEVEL_MAP[diag.severity] ?? 1) as 1 | 2 | 3;

  const map: Record<DiagnosisType, Prescription> = {
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

  return map[diag.type];
}

// --- Z-Test 상수 (Abramowitz & Stegun 근사) ---

export const Z_TEST_CONSTANTS = {
  t_coeff: 0.2316419,
  d_coeff: 0.3989422804014327,
  a1: 0.319381530,
  a2: -0.356563782,
  a3: 1.781477937,
  a4: -1.821255978,
  a5: 1.330274429,
} as const;

// --- 자동 변형 로그 타입 ---

export const AUTO_VARIANT_LOG_TYPE = 'auto_variant_created' as const;

// --- 처방 레벨 자동 변형 최소 레벨 ---

export const AUTO_VARIANT_MIN_LEVEL = 2 as const;
