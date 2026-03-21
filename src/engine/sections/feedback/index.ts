// ============================================================
// Section Feedback Loop — 메인 프로세서
// ⑫ Learning Loop 분석 데이터 → 26 섹션 에이전트 학습 피드백
// ============================================================

import type { SectionKey } from '@/engine/sections/types';
import type {
  FeedbackAction,
  FeedbackResult,
  SectionAnalytics,
  SectionPerformanceRecord,
} from '@/engine/sections/feedback/types';
import {
  appendToMemory,
  formatPerformanceEntry,
} from '@/engine/sections/feedback/memory-writer';

// ---------- 임계값 상수 ----------

/** 스크롤 도달률이 이 미만이면 "낮은 가시성" */
const SCROLL_REACH_LOW = 30;

/** 체류 시간이 이 미만(ms)이면 "낮은 참여" */
const DWELL_TIME_LOW = 2000;

/** 이탈률이 이 초과이면 "높은 이탈" */
const BOUNCE_FROM_HIGH = 40;

/** CTA 전환율이 이 미만이면 "약한 CTA" (CTA 존재 시) */
const CTA_RATE_LOW = 2;

/** 참여 점수가 이 이상이면 "고성능" */
const ENGAGEMENT_HIGH = 70;

/** CTA가 존재하는 섹션 키 목록 */
const SECTIONS_WITH_CTA: ReadonlySet<SectionKey> = new Set<SectionKey>([
  'HEADER_BANNER',
  'CTA',
  'LIMITED_OFFER',
  'BUNDLE_SET',
  'PRICE_TABLE',
]);

// ---------- 메인 프로세서 ----------

/**
 * 프로젝트의 섹션별 분석 데이터를 처리하여 피드백 액션을 생성하고
 * 각 섹션 에이전트의 memory.md를 업데이트한다.
 */
export async function processSectionFeedback(
  projectId: string,
  metrics: SectionAnalytics[],
): Promise<FeedbackResult> {
  const allActions: FeedbackAction[] = [];
  const updatedMemories: string[] = [];

  for (const analytics of metrics) {
    const actions = evaluateSection(analytics);
    allActions.push(...actions);

    const record: SectionPerformanceRecord = {
      sectionKey: analytics.sectionKey,
      industry: '',         // 호출 시 enrichRecord로 보강 가능
      decisionType: '',
      layoutPattern: '',
      analytics,
      timestamp: new Date().toISOString(),
    };

    await updateSectionMemory(analytics.sectionKey, record, actions);
    updatedMemories.push(analytics.sectionKey);
  }

  return {
    processed: metrics.length,
    actions: allActions,
    updatedMemories,
  };
}

/**
 * 프로젝트의 섹션별 분석 데이터를 메타데이터와 함께 처리한다.
 * industry, decisionType, layoutPattern 정보가 있을 때 사용.
 */
export async function processSectionFeedbackWithRecords(
  records: SectionPerformanceRecord[],
): Promise<FeedbackResult> {
  const allActions: FeedbackAction[] = [];
  const updatedMemories: string[] = [];

  for (const record of records) {
    const actions = evaluateSection(record.analytics);
    allActions.push(...actions);

    await updateSectionMemory(record.sectionKey, record, actions);
    updatedMemories.push(record.sectionKey);
  }

  return {
    processed: records.length,
    actions: allActions,
    updatedMemories,
  };
}

// ---------- 평가 로직 ----------

/**
 * 단일 섹션의 분석 데이터를 평가하여 피드백 액션 목록을 반환한다.
 * 순수 함수 — 부수효과 없음.
 */
export function evaluateSection(analytics: SectionAnalytics): FeedbackAction[] {
  const actions: FeedbackAction[] = [];
  const { sectionKey } = analytics;

  // 1. 낮은 가시성: 스크롤 도달률 부족 → 섹션 위치 올리기
  if (analytics.scrollReach < SCROLL_REACH_LOW) {
    actions.push({
      sectionKey,
      actionType: 'boost_weight',
      reason: `스크롤 도달률 ${analytics.scrollReach}%로 낮음 (기준: ${SCROLL_REACH_LOW}%)`,
      details: {
        metric: 'scrollReach',
        currentValue: analytics.scrollReach,
        threshold: SCROLL_REACH_LOW,
        suggestion: '섹션 순서를 위로 이동하거나 이전 섹션의 흐름 개선',
      },
    });
  }

  // 2. 낮은 참여: 체류 시간 부족 → 레이아웃/카피 변경
  if (analytics.dwellTime < DWELL_TIME_LOW) {
    actions.push({
      sectionKey,
      actionType: 'swap_layout',
      reason: `체류시간 ${analytics.dwellTime}ms로 짧음 (기준: ${DWELL_TIME_LOW}ms)`,
      details: {
        metric: 'dwellTime',
        currentValue: analytics.dwellTime,
        threshold: DWELL_TIME_LOW,
        suggestion: '레이아웃 패턴 변경 또는 카피 강화로 관심 유도',
      },
    });
  }

  // 3. 높은 이탈: 이 섹션에서 사람들이 떠남
  if (analytics.bounceFrom > BOUNCE_FROM_HIGH) {
    actions.push({
      sectionKey,
      actionType: 'reduce_weight',
      reason: `이탈률 ${analytics.bounceFrom}%로 높음 (기준: ${BOUNCE_FROM_HIGH}%)`,
      details: {
        metric: 'bounceFrom',
        currentValue: analytics.bounceFrom,
        threshold: BOUNCE_FROM_HIGH,
        suggestion: '섹션 콘텐츠 재검토 또는 섹션 순서 변경',
      },
    });
  }

  // 4. 약한 CTA: CTA가 있는 섹션인데 전환율이 낮음
  const hasCta = SECTIONS_WITH_CTA.has(sectionKey);
  if (hasCta && analytics.ctaRate < CTA_RATE_LOW) {
    actions.push({
      sectionKey,
      actionType: 'update_copy_style',
      reason: `CTA 전환율 ${analytics.ctaRate}%로 낮음 (기준: ${CTA_RATE_LOW}%)`,
      details: {
        metric: 'ctaRate',
        currentValue: analytics.ctaRate,
        threshold: CTA_RATE_LOW,
        ctaClicks: analytics.ctaClicks,
        suggestion: 'CTA 문구, 색상, 위치 변경 권장',
      },
    });
  }

  // 5. 고성능: 잘 되고 있는 패턴 기록 (액션이 없을 때만)
  if (analytics.engagementScore >= ENGAGEMENT_HIGH && actions.length === 0) {
    actions.push({
      sectionKey,
      actionType: 'boost_weight',
      reason: `참여 점수 ${analytics.engagementScore}으로 우수 — 승리 패턴 기록`,
      details: {
        metric: 'engagementScore',
        currentValue: analytics.engagementScore,
        threshold: ENGAGEMENT_HIGH,
        suggestion: '현재 패턴을 업종별 기본값으로 저장',
      },
    });
  }

  return actions;
}

// ---------- 메모리 업데이트 ----------

/**
 * 섹션 에이전트의 memory.md에 새 성능 기록과 액션을 추가한다.
 */
export async function updateSectionMemory(
  sectionKey: SectionKey,
  record: SectionPerformanceRecord,
  actions: FeedbackAction[],
): Promise<void> {
  const entry = formatPerformanceEntry(record, actions);
  await appendToMemory(sectionKey, entry);
}
