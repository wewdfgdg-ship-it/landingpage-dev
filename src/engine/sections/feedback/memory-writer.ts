// ============================================================
// Section Feedback Loop — Memory Writer
// 섹션 에이전트 memory.md 읽기/쓰기/포맷
// ============================================================

import { readFile, writeFile } from 'fs/promises';
import path from 'path';

import type { SectionKey } from '@/engine/sections/types';
import type {
  FeedbackAction,
  PerformanceGrade,
  SectionPerformanceRecord,
} from '@/engine/sections/feedback/types';

// ---------- SectionKey → 폴더명 매핑 ----------

const SECTION_FOLDER_MAP: Record<SectionKey, string> = {
  HEADER_BANNER: '01-header-banner',
  KEY_FEATURES: '02-key-features',
  FEATURE_DETAIL_1: '03-feature-detail-1',
  FEATURE_DETAIL_2: '04-feature-detail-2',
  FEATURE_DETAIL_3: '05-feature-detail-3',
  SPECS: '06-specs',
  HOW_TO_USE: '07-how-to-use',
  TARGET_PERSONA: '08-target-persona',
  BEFORE_AFTER: '09-before-after',
  LIFESTYLE: '10-lifestyle',
  CERTIFICATION: '11-certification',
  FAQ: '12-faq',
  REVIEWS: '13-reviews',
  SHIPPING: '14-shipping',
  CTA: '15-cta',
  STATS_NUMBERS: '16-stats-numbers',
  COMPETITOR_COMPARE: '17-competitor-compare',
  BRAND_STORY: '18-brand-story',
  PACKAGE_CONTENTS: '19-package-contents',
  PHOTO_REVIEWS: '20-photo-reviews',
  SNS_VIRAL: '21-sns-viral',
  BUNDLE_SET: '22-bundle-set',
  LIMITED_OFFER: '23-limited-offer',
  REFUND_POLICY: '24-refund-policy',
  CUSTOMER_SERVICE: '25-customer-service',
  PRICE_TABLE: '26-price-table',
} as const;

/** 최대 성능 기록 항목 수 (초과 시 오래된 항목 제거) */
const MAX_MEMORY_ENTRIES = 50;

/** 성능 기록 시작을 나타내는 마커 */
const PERFORMANCE_SECTION_HEADER = '## 성능 기록';

/** 개별 기록 항목의 시작 패턴 (### YYYY-MM-DD) */
const ENTRY_PATTERN = /^### \d{4}-\d{2}-\d{2}/;

// ---------- 공개 API ----------

/** SectionKey로부터 memory.md 파일 경로를 반환한다 */
export function getMemoryPath(sectionKey: SectionKey): string {
  const folder = SECTION_FOLDER_MAP[sectionKey];
  return path.join(process.cwd(), 'agent', 'sections', folder, 'memory.md');
}

/** memory.md 파일을 읽어 문자열로 반환한다 */
export async function readMemory(sectionKey: SectionKey): Promise<string> {
  const filePath = getMemoryPath(sectionKey);
  try {
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch {
    return '';
  }
}

/** memory.md에 새 성능 기록을 추가한다 (최대 MAX_MEMORY_ENTRIES 유지) */
export async function appendToMemory(
  sectionKey: SectionKey,
  entry: string,
): Promise<void> {
  const filePath = getMemoryPath(sectionKey);
  const currentContent = await readMemory(sectionKey);

  const updatedContent = insertEntry(currentContent, entry);
  await writeFile(filePath, updatedContent, 'utf-8');
}

/** SectionPerformanceRecord + FeedbackAction[] → 마크다운 문자열 포맷 */
export function formatPerformanceEntry(
  record: SectionPerformanceRecord,
  actions: FeedbackAction[],
): string {
  const { analytics, industry, decisionType, layoutPattern, timestamp } = record;
  const date = timestamp.slice(0, 10); // YYYY-MM-DD

  const grade = determineGrade(analytics.engagementScore, actions);
  const gradeEmoji = grade === 'performing_well' ? '✅ 고성능' : '⚠️ 개선 필요';
  const gradeLabel = `${gradeEmoji} (engagementScore: ${analytics.engagementScore})`;

  const lines: string[] = [
    `### ${date} | ${industry} | ${decisionType} | ${layoutPattern}`,
    `- scrollReach: ${analytics.scrollReach}% | dwellTime: ${analytics.dwellTime}ms | bounceFrom: ${analytics.bounceFrom}%`,
  ];

  if (analytics.ctaClicks > 0 || analytics.ctaRate > 0) {
    lines.push(`- CTA: ${analytics.ctaClicks}클릭 | ctaRate: ${analytics.ctaRate}%`);
  }

  lines.push(`- 평가: ${gradeLabel}`);

  if (actions.length > 0) {
    const actionSummaries = actions.map(
      (a) => `${actionTypeToKorean(a.actionType)}: ${a.reason}`,
    );
    lines.push(`- 조치: ${actionSummaries.join(' / ')}`);
  }

  // 핵심 학습 포인트
  const learning = deriveLearning(record, actions);
  if (learning) {
    lines.push(`- 학습: ${learning}`);
  }

  return lines.join('\n');
}

// ---------- 내부 유틸리티 ----------

/** 기존 memory.md 콘텐츠에 새 항목을 삽입하고, 최대 항목 수를 유지한다 */
function insertEntry(currentContent: string, newEntry: string): string {
  const sectionIndex = currentContent.indexOf(PERFORMANCE_SECTION_HEADER);

  // "## 성능 기록" 섹션이 없으면 파일 끝에 추가
  if (sectionIndex === -1) {
    const separator = currentContent.endsWith('\n') ? '\n' : '\n\n';
    return `${currentContent}${separator}${PERFORMANCE_SECTION_HEADER}\n\n${newEntry}\n`;
  }

  // 기존 성능 기록 섹션의 내용부 추출
  const beforeSection = currentContent.slice(0, sectionIndex + PERFORMANCE_SECTION_HEADER.length);
  const afterHeader = currentContent.slice(sectionIndex + PERFORMANCE_SECTION_HEADER.length);

  // 기존 항목들을 파싱
  const existingEntries = parseEntries(afterHeader);

  // 새 항목을 맨 앞에 추가
  existingEntries.unshift(newEntry);

  // 최대 항목 수 제한
  const trimmedEntries = existingEntries.slice(0, MAX_MEMORY_ENTRIES);

  return `${beforeSection}\n\n${trimmedEntries.join('\n\n')}\n`;
}

/** 마크다운 텍스트에서 ### 로 시작하는 항목들을 파싱한다 */
function parseEntries(text: string): string[] {
  const lines = text.split('\n');
  const entries: string[] = [];
  let currentEntry: string[] = [];

  for (const line of lines) {
    if (ENTRY_PATTERN.test(line)) {
      if (currentEntry.length > 0) {
        entries.push(currentEntry.join('\n').trim());
      }
      currentEntry = [line];
    } else if (currentEntry.length > 0) {
      currentEntry.push(line);
    }
  }

  if (currentEntry.length > 0) {
    const trimmed = currentEntry.join('\n').trim();
    if (trimmed) {
      entries.push(trimmed);
    }
  }

  return entries;
}

/** engagementScore와 액션 목록으로 등급 결정 */
function determineGrade(
  engagementScore: number,
  actions: FeedbackAction[],
): PerformanceGrade {
  if (engagementScore >= 70 && actions.length === 0) {
    return 'performing_well';
  }
  return 'neutral';
}

/** FeedbackActionType → 한국어 라벨 */
function actionTypeToKorean(
  actionType: FeedbackAction['actionType'],
): string {
  const map: Record<FeedbackAction['actionType'], string> = {
    boost_weight: '가중치 상승',
    reduce_weight: '가중치 하락',
    swap_layout: '레이아웃 변경 권장',
    update_copy_style: '카피 스타일 변경 권장',
  };
  return map[actionType];
}

/** 기록과 액션으로부터 학습 포인트를 도출한다 */
function deriveLearning(
  record: SectionPerformanceRecord,
  actions: FeedbackAction[],
): string {
  const { industry, decisionType, layoutPattern, analytics } = record;

  if (analytics.engagementScore >= 70 && actions.length === 0) {
    return `${industry}+${decisionType} 조합에서 ${layoutPattern} 레이아웃이 효과적`;
  }

  if (actions.length > 0) {
    const primaryAction = actions[0];
    return `${industry} 업종에서 ${primaryAction.reason}`;
  }

  return `${industry}+${decisionType} 데이터 축적 중`;
}
