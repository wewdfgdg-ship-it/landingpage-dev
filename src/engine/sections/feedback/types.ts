// ============================================================
// Section Feedback Loop — 타입 정의
// ⑫ Learning Loop → 26 섹션 에이전트 피드백 시스템
// ============================================================

import type { SectionKey } from '@/engine/sections/types';

/** 섹션 단위 분석 데이터 (SectionMetrics 확장) */
export interface SectionAnalytics {
  sectionKey: SectionKey;
  projectId: string;
  /** 이 섹션까지 스크롤한 비율 (0~100) */
  scrollReach: number;
  /** 평균 체류 시간 (ms) */
  dwellTime: number;
  /** 이 섹션에서 이탈한 비율 (0~100) */
  bounceFrom: number;
  /** CTA 클릭 수 (CTA가 있는 섹션만 유효) */
  ctaClicks: number;
  /** CTA 전환율 (0~100) */
  ctaRate: number;
  /** 노출 수 */
  impressions: number;
  /** 종합 점수 (0~100) */
  engagementScore: number;
}

/** 섹션 성능 기록 (memory.md에 기록되는 단위) */
export interface SectionPerformanceRecord {
  sectionKey: SectionKey;
  industry: string;
  decisionType: string;
  layoutPattern: string;
  analytics: SectionAnalytics;
  timestamp: string;
}

/** 피드백 조치 유형 */
export type FeedbackActionType =
  | 'boost_weight'
  | 'reduce_weight'
  | 'swap_layout'
  | 'update_copy_style';

/** 피드백 시스템이 생성하는 개별 조치 */
export interface FeedbackAction {
  sectionKey: SectionKey;
  actionType: FeedbackActionType;
  reason: string;
  details: Record<string, unknown>;
}

/** 피드백 처리 결과 */
export interface FeedbackResult {
  processed: number;
  actions: FeedbackAction[];
  /** memory.md가 업데이트된 섹션 키 목록 */
  updatedMemories: string[];
}

/** 섹션 평가 등급 */
export type PerformanceGrade =
  | 'performing_well'
  | 'neutral'
  | 'low_visibility'
  | 'low_engagement'
  | 'high_exit'
  | 'weak_cta';
