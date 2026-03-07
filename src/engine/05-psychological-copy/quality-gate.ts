// ============================================================
// 카피 품질 게이트 — 규칙 엔진 (AI 호출 없음)
// frames.ts + tone-matrix.ts 결합 → 종합 점수 산출
// 80점 미만 섹션 식별 → 재생성 피드백 생성
// ============================================================

import type { CopyBlocks, SectionCopy } from './types';
import { scoreByFrame, type FrameScoreResult } from './frames';
import { scoreTone, type ToneScoreResult } from './tone-matrix';

// --- 설정 ---

/** 통과 최소 점수 */
export const QUALITY_THRESHOLD = 80;

/** 최대 재생성 시도 횟수 */
export const MAX_RETRIES = 2;

/** 프레임 점수 vs 톤 점수 비중 */
const FRAME_WEIGHT = 0.6;
const TONE_WEIGHT = 0.4;

// --- 타입 ---

export interface SectionQualityResult {
  sectionOrder: number;
  role: string;
  sectionType: string;
  frameScore: FrameScoreResult;
  toneScore: ToneScoreResult;
  combinedScore: number;
  passed: boolean;
  feedback: string; // 재생성 시 AI에 전달할 개선 지시
}

export interface QualityGateResult {
  overallScore: number;
  totalSections: number;
  passedSections: number;
  failedSections: SectionQualityResult[];
  allResults: SectionQualityResult[];
  passed: boolean;
}

// --- 핵심 함수 ---

/** 단일 섹션 품질 평가 */
export function evaluateSection(
  section: SectionCopy,
  industry: string,
): SectionQualityResult {
  const frameResult = scoreByFrame(section.role, section.copy);
  const toneResult = scoreTone(industry, section.copy);

  const combinedScore = Math.round(
    frameResult.score * FRAME_WEIGHT + toneResult.score * TONE_WEIGHT,
  );

  const passed = combinedScore >= QUALITY_THRESHOLD;

  // 실패 시 구체적 피드백 생성
  let feedback = '';
  if (!passed) {
    const issues: string[] = [];

    if (frameResult.failedElements.length > 0) {
      issues.push(`[설득 구조] 부족한 요소: ${frameResult.failedElements.join(', ')}`);
    }
    if (toneResult.failedRules.length > 0) {
      issues.push(`[톤 일관성] 부족한 요소: ${toneResult.failedRules.join(', ')}`);
    }

    feedback = `섹션 ${section.sectionOrder} (${section.role}/${section.sectionType}) 개선 필요:\n${issues.join('\n')}\n현재 점수: ${combinedScore}점 (기준: ${QUALITY_THRESHOLD}점)`;
  }

  return {
    sectionOrder: section.sectionOrder,
    role: section.role,
    sectionType: section.sectionType,
    frameScore: frameResult,
    toneScore: toneResult,
    combinedScore,
    passed,
    feedback,
  };
}

/** 전체 카피 품질 평가 */
export function evaluateCopyQuality(
  copyBlocks: CopyBlocks,
  industry: string,
): QualityGateResult {
  const allResults = copyBlocks.sections.map((section) =>
    evaluateSection(section, industry),
  );

  const failedSections = allResults.filter((r) => !r.passed);
  const overallScore =
    allResults.length > 0
      ? Math.round(allResults.reduce((sum, r) => sum + r.combinedScore, 0) / allResults.length)
      : 0;

  return {
    overallScore,
    totalSections: allResults.length,
    passedSections: allResults.length - failedSections.length,
    failedSections,
    allResults,
    passed: failedSections.length === 0,
  };
}

/** 실패 섹션들에 대한 재생성 프롬프트 구성 */
export function buildRetryPrompt(
  failedSections: SectionQualityResult[],
  originalCopy: CopyBlocks,
): string {
  const feedbackList = failedSections
    .map((f) => f.feedback)
    .join('\n\n');

  const sectionOrders = failedSections.map((f) => f.sectionOrder);
  const targetSections = originalCopy.sections
    .filter((s) => sectionOrders.includes(s.sectionOrder))
    .map((s) => `  섹션 ${s.sectionOrder} (${s.role}/${s.sectionType}): 현재 헤드라인 "${s.copy.headline}"`)
    .join('\n');

  return `아래 섹션들의 카피 품질이 기준(${QUALITY_THRESHOLD}점)에 미달합니다. 개선해주세요.

■ 대상 섹션
${targetSections}

■ 품질 피드백
${feedbackList}

■ 개선 지침
1. 위 피드백에서 부족한 요소를 반드시 보완
2. 기존 카피의 의도와 방향성은 유지
3. 나머지 섹션은 수정하지 마세요
4. 해당 섹션만 JSON으로 응답:
{
  "sections": [
    {
      "sectionOrder": N,
      "role": "...",
      "sectionType": "...",
      "copy": { "headline": "", "subheadline": "", "body": "", "bulletPoints": [], "ctaText": "", "microCopy": "", "imageDirection": "" }
    }
  ]
}`;
}

/** 재생성된 카피를 원본에 머지 */
export function mergeCopy(
  original: CopyBlocks,
  retried: SectionCopy[],
): CopyBlocks {
  const merged = original.sections.map((s) => {
    const replacement = retried.find((r) => r.sectionOrder === s.sectionOrder);
    return replacement ?? s;
  });

  return {
    ...original,
    sections: merged,
  };
}
