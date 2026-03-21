// ============================================================
// 크롤러 엔진 — 메인 파이프라인
// 검색 → 스크린샷 → Gemini Vision 섹션 감지 → 크롭 → 저장
// ============================================================

import { db } from '@/lib/db';
import { uploadBuffer, getCdnUrl } from '@/lib/r2';
import { findCrawlTargets } from './search';
import { takeScreenshotKeepOpen, closeBrowser } from './screenshot';
import { detectAndCaptureSections } from './crop';
import type {
  CrawlConfig,
  CrawlJobData,
  CrawlJobResult,
  CrawlProgress,
  CrawlResult,
  DetectedSection,
  SectionDetectionResponse,
} from './types';
import { DEFAULT_CRAWL_CONFIG } from './types';

// 시스템에서 사용하는 섹션 타입 목록
const KNOWN_SECTION_TYPES = [
  'HEADER_BANNER', 'HERO', 'KEY_FEATURES', 'BENEFITS',
  'BEFORE_AFTER', 'PRODUCT_DETAIL', 'INGREDIENTS', 'HOW_TO_USE',
  'REVIEWS', 'TESTIMONIAL', 'SOCIAL_PROOF',
  'FAQ', 'CTA', 'PRICE_TABLE', 'COMPARISON',
  'BRAND_STORY', 'TEAM', 'PARTNERS', 'STATS',
  'GUARANTEE', 'PROCESS', 'GALLERY', 'VIDEO',
  'NEWSLETTER', 'CONTACT', 'FOOTER',
] as const;

/**
 * Gemini Vision API로 스크린샷에서 섹션 영역 감지
 *
 * @param screenshotBase64 - JPEG 이미지의 base64 문자열
 * @returns 감지된 섹션 배열 (y좌표 오름차순, confidence >= 0.5)
 */
export async function detectSections(
  screenshotBase64: string,
): Promise<DetectedSection[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return [];
  }

  const { GoogleGenAI } = await import('@google/genai');
  const genai = new GoogleGenAI({ apiKey });

  const sectionList = KNOWN_SECTION_TYPES.join(', ');

  const prompt = `당신은 랜딩페이지/상세페이지의 섹션 구조를 분석하는 전문가입니다.

이 풀페이지 스크린샷을 분석하여 각 섹션의 위치를 식별해주세요.

## 섹션 타입 목록
${sectionList}

## 응답 형식 (순수 JSON만 반환)
{
  "sections": [
    {
      "sectionType": "HEADER_BANNER",
      "confidence": 0.95,
      "y": 0,
      "height": 600,
      "description": "메인 히어로 배너, 제품 이미지와 CTA 버튼"
    }
  ],
  "pageDescription": "뷰티 브랜드 랜딩페이지"
}

## 규칙
1. y좌표는 페이지 최상단(0px)부터의 절대 위치
2. height는 해당 섹션의 세로 크기 (px)
3. confidence는 0.0~1.0 (0.5 미만은 제외)
4. 같은 sectionType이 여러 번 나올 수 있음
5. 이미지 내 비율로 추정하여 실제 px 좌표 계산
6. sections 배열은 y좌표 오름차순 정렬`;

  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: screenshotBase64,
          },
        },
        { text: prompt },
      ],
    }],
    config: {
      responseMimeType: 'application/json',
    },
  });

  const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

  let parsed: SectionDetectionResponse;
  try {
    parsed = JSON.parse(rawText) as SectionDetectionResponse;
  } catch {
    return [];
  }

  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    return [];
  }

  return parsed.sections
    .filter((s) => s.confidence >= 0.5 && s.height > 50)
    .sort((a, b) => a.y - b.y);
}

/**
 * 크롤링 작업 실행 (메인 엔트리포인트)
 *
 * 1. DB에서 CrawlJob 읽기, 상태 RUNNING 전환
 * 2. 검색 쿼리 빌드 → Google Custom Search로 URL 수집
 * 3. 각 URL: Playwright 스크린샷 → Gemini Vision 섹션 감지 → 크롭 → 업로드
 * 4. SectionReference 레코드 생성
 * 5. CrawlJob 상태 업데이트 (COMPLETED/FAILED)
 *
 * 단일 페이지 실패 시 건너뛰고 다음 페이지 계속 처리
 */
export async function runCrawlJob(
  jobId: string,
  config: CrawlConfig = DEFAULT_CRAWL_CONFIG,
  onProgress?: (progress: CrawlProgress) => void,
): Promise<CrawlJobResult> {
  const result: CrawlJobResult = {
    crawlJobId: jobId,
    totalPages: 0,
    collected: 0,
    failed: 0,
    pageResults: [],
    errors: [],
  };

  try {
    // DB에서 CrawlJob 읽기
    const job = await db.$queryRaw<Array<{
      id: string;
      sectionType: string;
      industry: string;
      treatment: string;
      count: number;
      sourceSites: string[];
      keywords: string[];
      status: string;
    }>>`
      SELECT id, "sectionType", industry, treatment, count, "sourceSites", keywords, status
      FROM "CrawlJob"
      WHERE id = ${jobId}
    `;

    if (job.length === 0) {
      result.errors.push(`CrawlJob ${jobId} 없음`);
      return result;
    }

    const crawlJob = job[0];

    if (crawlJob.status !== 'QUEUED') {
      result.errors.push(`CrawlJob 상태가 QUEUED가 아닙니다: ${crawlJob.status}`);
      return result;
    }

    // 상태 → RUNNING
    await db.$executeRaw`
      UPDATE "CrawlJob"
      SET status = 'RUNNING', "startedAt" = NOW(), "updatedAt" = NOW()
      WHERE id = ${jobId}
    `;

    // 검색 쿼리 빌드 + URL 수집
    onProgress?.({
      currentPage: 0,
      totalPages: 0,
      collected: 0,
      targetCount: crawlJob.count,
      currentUrl: '',
      phase: 'searching',
      percent: 5,
    });

    const targetCount = Math.max(crawlJob.count * 2, 10);
    const targets = await findCrawlTargets(
      crawlJob.keywords,
      crawlJob.industry,
      crawlJob.sectionType,
      crawlJob.sourceSites,
      targetCount,
    );

    if (targets.length === 0) {
      result.errors.push('검색 결과 없음: URL을 찾을 수 없습니다');
      await completeJob(jobId, 0, result.errors[0]);
      return result;
    }

    result.totalPages = targets.length;

    // 각 URL 처리
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];

      // 목표 수량 달성 시 종료
      if (result.collected >= crawlJob.count) break;

      // 취소 확인
      const cancelled = await isJobCancelled(jobId);
      if (cancelled) {
        result.errors.push('작업 취소됨');
        break;
      }

      // 진행률 보고
      const percent = Math.round(10 + (i / targets.length) * 85);
      onProgress?.({
        currentPage: i + 1,
        totalPages: targets.length,
        collected: result.collected,
        targetCount: crawlJob.count,
        currentUrl: target.url,
        phase: 'crawling',
        percent,
      });

      const pageResult = await processPage(
        target.url,
        crawlJob.sectionType,
        crawlJob.industry,
        crawlJob.treatment,
        config,
      );

      result.pageResults.push(pageResult);
      result.collected += pageResult.sectionsUploaded;

      if (pageResult.errors.length > 0) {
        result.failed++;
        result.errors.push(...pageResult.errors);
      }

      // 수집 진행 상황 DB 업데이트
      await db.$executeRaw`
        UPDATE "CrawlJob"
        SET collected = ${result.collected}, "updatedAt" = NOW()
        WHERE id = ${jobId}
      `;

      // 페이지 간 대기
      if (config.delayBetweenPages > 0) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, config.delayBetweenPages);
        });
      }
    }

    // 완료 진행률
    onProgress?.({
      currentPage: targets.length,
      totalPages: targets.length,
      collected: result.collected,
      targetCount: crawlJob.count,
      currentUrl: '',
      phase: 'done',
      percent: 100,
    });

    // 완료 처리
    const errorSummary = result.errors.length > 0
      ? result.errors.slice(0, 5).join('; ')
      : undefined;
    await completeJob(jobId, result.collected, errorSummary);

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : '알 수 없는 오류';
    result.errors.push(errorMsg);
    await failJob(jobId, errorMsg);
  } finally {
    await closeBrowser();
  }

  return result;
}

/**
 * 단일 페이지 처리 — 뷰포트 스캔 방식
 * takeScreenshotKeepOpen → detectAndCaptureSections → 업로드
 */
async function processPage(
  url: string,
  targetSectionType: string,
  industry: string,
  treatment: string,
  _config: CrawlConfig,
): Promise<CrawlResult> {
  const pageResult: CrawlResult = {
    url,
    pageTitle: '',
    sectionsFound: 0,
    sectionsUploaded: 0,
    screenshotBase64: null,
    errors: [],
  };

  let context: Awaited<ReturnType<typeof takeScreenshotKeepOpen>>['context'] | null = null;

  try {
    // 1. 페이지 열기 + 풀페이지 스크린샷 (페이지 유지)
    const live = await takeScreenshotKeepOpen(url);
    context = live.context;
    pageResult.pageTitle = live.pageTitle;
    pageResult.screenshotBase64 = live.screenshotBuffer.toString('base64');

    // 2. DOM 우선 + AI 폴백 섹션 감지
    const allSections = await detectAndCaptureSections(live.page, live.screenshotBuffer);
    pageResult.sectionsFound = allSections.length;

    if (allSections.length === 0) {
      return pageResult;
    }

    // 3. 타겟 섹션 필터 (없으면 전체 수집)
    const targetSections = allSections.filter(
      (s) => s.sectionType === targetSectionType && s.confidence >= 0.6,
    );

    const sectionsToUpload = targetSections.length > 0
      ? targetSections
      : allSections;

    // 4. 각 섹션 업로드 (이미 크롭된 뷰포트 이미지)
    for (const section of sectionsToUpload) {
      try {
        // R2 업로드
        const timestamp = Date.now();
        const key = `references/${industry}/${section.sectionType}/${timestamp}.jpg`;
        await uploadBuffer(key, section.imageBuffer, 'image/jpeg');
        const imageUrl = getCdnUrl(key);

        // SectionReference 생성
        await db.$executeRaw`
          INSERT INTO "SectionReference" (
            id, "sectionType", industry, treatment, status,
            "imageUrl", "sourceUrl", "createdAt", "updatedAt"
          )
          VALUES (
            gen_random_uuid()::text,
            ${section.sectionType},
            ${industry},
            ${treatment},
            'PENDING',
            ${imageUrl},
            ${url},
            NOW(),
            NOW()
          )
        `;

        pageResult.sectionsUploaded++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : '섹션 업로드 오류';
        pageResult.errors.push(`${section.sectionType}: ${msg}`);
      }
    }

  } catch (err) {
    const msg = err instanceof Error ? err.message : '페이지 처리 오류';
    pageResult.errors.push(`${url}: ${msg}`);
  } finally {
    // 페이지/컨텍스트 정리
    if (context) {
      await context.close().catch(() => {});
    }
  }

  return pageResult;
}

// ============================================================
// CrawlJob 상태 관리 헬퍼
// ============================================================

async function completeJob(
  id: string,
  collected: number,
  errorMsg?: string,
): Promise<void> {
  await db.$executeRaw`
    UPDATE "CrawlJob"
    SET status = 'COMPLETED',
        collected = ${collected},
        "errorMsg" = ${errorMsg ?? null},
        "completedAt" = NOW(),
        "updatedAt" = NOW()
    WHERE id = ${id}
  `;
}

async function failJob(id: string, errorMsg: string): Promise<void> {
  await db.$executeRaw`
    UPDATE "CrawlJob"
    SET status = 'FAILED',
        "errorMsg" = ${errorMsg},
        "completedAt" = NOW(),
        "updatedAt" = NOW()
    WHERE id = ${id}
  `;
}

async function isJobCancelled(id: string): Promise<boolean> {
  const rows = await db.$queryRaw<Array<{ status: string }>>`
    SELECT status FROM "CrawlJob" WHERE id = ${id}
  `;
  return rows[0]?.status === 'CANCELLED';
}

/**
 * runCrawler — worker.ts 호환 래퍼
 * CrawlJobData를 받아 runCrawlJob에 위임
 */
export async function runCrawler(
  data: CrawlJobData,
  onProgress?: (progress: CrawlProgress) => void,
): Promise<CrawlJobResult> {
  return runCrawlJob(data.crawlJobId, DEFAULT_CRAWL_CONFIG, onProgress);
}

// Re-export for external use
export { buildSearchQuery } from './search';
export { captureFullPage, cropSection, takeScreenshotKeepOpen, closeBrowser } from './screenshot';
export { detectAndCaptureSections } from './crop';
export type {
  CrawlConfig,
  CrawlJobResult,
  CrawlProgress,
  CrawlResult,
  DetectedSection,
  CrawlJobData,
  CroppedSection,
} from './types';
export { DEFAULT_CRAWL_CONFIG } from './types';
