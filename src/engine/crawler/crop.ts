// ============================================================
// 섹션 이미지 캡처 — DOM 우선 + AI Vision 폴백
// 전략 1: DOM 경계 감지 (pixel-perfect) → AI 분류
// 전략 2: AI Vision 경계 감지 (범용) → Sharp 크롭
// DOM이 3개 이상 섹션 찾으면 DOM 사용, 아니면 AI 폴백
// ============================================================

import type { Page } from 'playwright';
import type { CroppedSection } from './types';

/** 레퍼런스 수집 대상에서 제외할 저가치 섹션 */
const EXCLUDED_SECTION_TYPES = new Set([
  'FOOTER',
  'CONTACT',
  'NEWSLETTER',
  'UNKNOWN',
]);

const MIN_SECTION_HEIGHT = 150;
const MAX_SECTION_HEIGHT = 2000;
const DOM_MIN_SECTIONS = 3; // DOM 결과 최소 기준

// ============================================================
// 전략 1: DOM 기반 — pixel-perfect 경계
// ============================================================

interface DomSection {
  y: number;
  height: number;
  tagName: string;
  className: string;
}

/**
 * DOM에서 섹션 경계를 감지
 */
async function detectDomSections(page: Page): Promise<DomSection[]> {
  const sections = await page.evaluate((minHeight: number) => {
    const results: Array<{ y: number; height: number; tagName: string; className: string }> = [];
    const seen = new Set<Element>();

    const selectors = [
      'section',
      'article',
      '[role="region"]',
      'main > *',
      '[data-section]',
      '[class*="section"]',
      '[class*="block"]',
      '[class*="module"]',
    ];

    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (seen.has(el)) continue;

          // 부모가 이미 감지됐으면 스킵
          let parent = el.parentElement;
          let parentSeen = false;
          while (parent) {
            if (seen.has(parent)) { parentSeen = true; break; }
            parent = parent.parentElement;
          }
          if (parentSeen) continue;

          const rect = el.getBoundingClientRect();
          const absY = rect.top + window.scrollY;
          const h = (el as HTMLElement).offsetHeight || rect.height;

          if (h < minHeight || rect.width < 200) continue;

          seen.add(el);
          results.push({
            y: Math.round(absY),
            height: Math.round(h),
            tagName: el.tagName.toLowerCase(),
            className: (el.className && typeof el.className === 'string')
              ? el.className.slice(0, 100) : '',
          });
        }
      } catch { /* selector 실패 무시 */ }
    }

    results.sort((a, b) => a.y - b.y);

    // 겹치는 섹션 제거
    const deduped: typeof results = [];
    for (const sec of results) {
      const last = deduped.length > 0 ? deduped[deduped.length - 1] : null;
      if (last && Math.abs(sec.y - last.y) < 50) {
        if (sec.height > last.height) deduped[deduped.length - 1] = sec;
        continue;
      }
      deduped.push(sec);
    }

    return deduped;
  }, MIN_SECTION_HEIGHT);

  return sections;
}

// ============================================================
// 전략 1.5: 픽셀 분석 — 배경색 전환점으로 경계 감지
// ============================================================

interface PixelBoundary {
  y: number;
  height: number;
}

async function detectBoundariesByPixelAnalysis(
  fullScreenshot: Buffer,
  imageWidth: number,
  imageHeight: number,
): Promise<PixelBoundary[]> {
  const sharp = await import('sharp').then((m) => m.default);

  // 분석 속도를 위해 가로 축소 (100px)
  const analysisWidth = 100;
  const raw = await sharp(fullScreenshot)
    .resize(analysisWidth, imageHeight, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer();

  const channels = 3;
  const rowBytes = analysisWidth * channels;

  // 각 행의 가운데 60% 평균 색상
  function getRowColor(row: number): [number, number, number] {
    const start = Math.floor(analysisWidth * 0.2);
    const end = Math.floor(analysisWidth * 0.8);
    let r = 0, g = 0, b = 0, count = 0;
    for (let x = start; x < end; x++) {
      const offset = row * rowBytes + x * channels;
      r += raw[offset];
      g += raw[offset + 1];
      b += raw[offset + 2];
      count++;
    }
    return [r / count, g / count, b / count];
  }

  function colorDistance(a: [number, number, number], b: [number, number, number]): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  }

  // 매 5행마다 색상 샘플링 → 변화량 계산
  const step = 5;
  const changes: Array<{ row: number; diff: number }> = [];

  for (let row = step; row < imageHeight - step; row += step) {
    const prev = getRowColor(row - step);
    const curr = getRowColor(row);
    const diff = colorDistance(prev, curr);
    if (diff > 30) {
      changes.push({ row, diff });
    }
  }

  if (changes.length === 0) return [];

  // 연속된 변화를 하나의 경계로 병합 (50px 이내)
  const boundaries: number[] = [];
  let lastBoundary = -100;
  for (const ch of changes) {
    if (ch.row - lastBoundary > 50) {
      boundaries.push(ch.row);
      lastBoundary = ch.row;
    }
  }

  // 경계로부터 섹션 영역 생성
  const regions: PixelBoundary[] = [];
  const allPoints = [0, ...boundaries, imageHeight];

  for (let i = 0; i < allPoints.length - 1; i++) {
    const y = allPoints[i];
    const height = allPoints[i + 1] - y;
    if (height >= MIN_SECTION_HEIGHT && height <= MAX_SECTION_HEIGHT) {
      regions.push({ y, height });
    }
  }

  return regions;
}

// ============================================================
// 전략 2: AI Vision — 범용 폴백
// ============================================================

interface SectionBoundary {
  sectionType: string;
  confidence: number;
  yStart: number;
  yEnd: number;
  description: string;
}

async function detectSectionBoundariesByAI(
  screenshotBase64: string,
  imageWidth: number,
  imageHeight: number,
): Promise<SectionBoundary[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const { GoogleGenAI } = await import('@google/genai');
  const genai = new GoogleGenAI({ apiKey });

  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{
      role: 'user',
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: screenshotBase64 } },
        {
          text: `이 이미지는 웹페이지의 풀페이지 스크린샷입니다.
정확한 이미지 크기: **${imageWidth}px × ${imageHeight}px**

각 섹션의 **시작 y좌표(yStart)와 끝 y좌표(yEnd)**를 픽셀 단위로 식별해주세요.

## 응답 형식 (순수 JSON 배열만)
[{"sectionType": "HERO", "confidence": 0.95, "yStart": 0, "yEnd": 650, "description": "메인 히어로 배너"}]

## 규칙
1. yStart/yEnd는 이미지의 실제 픽셀 좌표 (0 ~ ${imageHeight})
2. 섹션은 겹치지 않음 (이전 yEnd ≤ 다음 yStart)
3. 섹션 높이 최소 ${MIN_SECTION_HEIGHT}px
4. **배경색/디자인이 바뀌는 정확한 경계에서 끊으세요**:
   - 각 섹션의 yStart는 해당 섹션 고유의 배경색이 시작되는 지점
   - 각 섹션의 yEnd는 해당 섹션 고유의 배경색이 끝나는 지점
   - 이전 섹션의 배경색이 포함되면 안 됨 (위쪽 오염 금지)
   - 다음 섹션의 배경색이 포함되면 안 됨 (아래쪽 오염 금지)
5. 해당 섹션의 콘텐츠는 빠짐없이 포함되어야 함

## 제외 대상
- 푸터, 사이트맵, 네비게이션 링크, 법적 고지, 빈 여백

## 섹션 타입
HEADER_BANNER, HERO, KEY_FEATURES, BENEFITS, BEFORE_AFTER, PRODUCT_DETAIL,
INGREDIENTS, HOW_TO_USE, REVIEWS, TESTIMONIAL, SOCIAL_PROOF, FAQ, CTA,
PRICE_TABLE, COMPARISON, BRAND_STORY, TEAM, PARTNERS, STATS, GUARANTEE,
PROCESS, GALLERY, VIDEO`,
        },
      ],
    }],
    config: {
      responseMimeType: 'application/json',
      temperature: 0,
    },
  });

  const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';

  let parsed: SectionBoundary[];
  try {
    parsed = JSON.parse(rawText) as SectionBoundary[];
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((s) =>
      s.yStart >= 0 && s.yEnd > s.yStart &&
      (s.yEnd - s.yStart) >= MIN_SECTION_HEIGHT &&
      s.confidence >= 0.5,
    )
    .map((s) => ({
      ...s,
      yStart: Math.max(0, Math.round(s.yStart)),
      yEnd: Math.min(imageHeight, Math.round(s.yEnd)),
    }))
    .sort((a, b) => a.yStart - b.yStart);
}

// ============================================================
// 공통: Sharp 크롭 + 테두리 자동 트림 + AI 분류
// ============================================================

/** 크롭 이미지의 위/아래 이질적 색상 줄을 제거 (오염 방지) */
const TRIM_MAX_ROWS = 15; // 최대 트림 행 수 (보수적)
const COLOR_DIFF_THRESHOLD = 60; // RGB 차이 허용치 (높을수록 보수적)
const SAFETY_MARGIN = 3; // 무조건 잘라내는 안전 마진 (px)

async function trimBorderRows(
  imageBuffer: Buffer,
  width: number,
  height: number,
): Promise<{ imageBuffer: Buffer; width: number; height: number }> {
  const sharp = await import('sharp').then((m) => m.default);

  // raw 픽셀 데이터 추출 (RGB)
  const raw = await sharp(imageBuffer)
    .removeAlpha()
    .raw()
    .toBuffer();

  const channels = 3;
  const rowBytes = width * channels;

  // 행의 평균 색상 구하기 (가운데 60% 영역)
  function getRowAvgColor(row: number): [number, number, number] {
    const start = Math.floor(width * 0.2);
    const end = Math.floor(width * 0.8);
    let r = 0, g = 0, b = 0, count = 0;
    for (let x = start; x < end; x++) {
      const offset = row * rowBytes + x * channels;
      r += raw[offset];
      g += raw[offset + 1];
      b += raw[offset + 2];
      count++;
    }
    return [r / count, g / count, b / count];
  }

  function colorDiff(a: [number, number, number], b: [number, number, number]): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  }

  // 본문 기준색: 위에서 15% 지점, 아래에서 15% 지점
  const refTopRow = Math.floor(height * 0.15);
  const refBotRow = Math.floor(height * 0.85);
  const refTopColor = getRowAvgColor(refTopRow);
  const refBotColor = getRowAvgColor(refBotRow);

  // 위쪽 트림: 맨 위부터 연속 이질 행만 제거 (본문색 만나면 즉시 중단)
  let trimTop = 0;
  for (let row = 0; row < Math.min(TRIM_MAX_ROWS, height); row++) {
    const rowColor = getRowAvgColor(row);
    if (colorDiff(rowColor, refTopColor) > COLOR_DIFF_THRESHOLD) {
      trimTop = row + 1;
    } else {
      break;
    }
  }

  // 아래쪽 트림: 맨 아래부터 연속 이질 행만 제거 (본문색 만나면 즉시 중단)
  let trimBottom = 0;
  for (let row = height - 1; row >= Math.max(height - TRIM_MAX_ROWS, 0); row--) {
    const rowColor = getRowAvgColor(row);
    if (colorDiff(rowColor, refBotColor) > COLOR_DIFF_THRESHOLD) {
      trimBottom = height - row;
    } else {
      break;
    }
  }

  const newHeight = height - trimTop - trimBottom;
  if (newHeight < MIN_SECTION_HEIGHT || (trimTop === 0 && trimBottom === 0)) {
    return { imageBuffer, width, height };
  }

  const trimmed = await sharp(imageBuffer)
    .extract({ left: 0, top: trimTop, width, height: newHeight })
    .jpeg({ quality: 90 })
    .toBuffer();

  return { imageBuffer: trimmed, width, height: newHeight };
}

async function cropFromFullPage(
  fullScreenshot: Buffer,
  regions: Array<{ y: number; height: number }>,
  imageWidth: number,
  imageHeight: number,
): Promise<Array<{ imageBuffer: Buffer; width: number; height: number }>> {
  const sharp = await import('sharp').then((m) => m.default);
  const results: Array<{ imageBuffer: Buffer; width: number; height: number }> = [];

  for (const region of regions) {
    try {
      // 위/아래 2px 안쪽으로 크롭 (인접 섹션 색상 오염 방지)
      const margin = SAFETY_MARGIN;
      const y = Math.max(0, Math.min(region.y + margin, imageHeight - 1));
      let h = Math.min(region.height - margin * 2, imageHeight - y);
      if (h > MAX_SECTION_HEIGHT) h = MAX_SECTION_HEIGHT;
      if (h < MIN_SECTION_HEIGHT) continue;

      const cropped = await sharp(fullScreenshot)
        .extract({ left: 0, top: y, width: imageWidth, height: h })
        .jpeg({ quality: 90 })
        .toBuffer();

      // 추가 테두리 자동 트림
      const trimmed = await trimBorderRows(cropped, imageWidth, h);
      results.push(trimmed);
    } catch { /* 크롭 실패 스킵 */ }
  }

  return results;
}

/**
 * 크롭된 이미지를 Gemini로 분류
 */
async function classifySections(
  crops: Array<{ imageBuffer: Buffer; width: number; height: number }>,
): Promise<CroppedSection[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const { GoogleGenAI } = await import('@google/genai');
  const genai = new GoogleGenAI({ apiKey });
  const classified: CroppedSection[] = [];

  for (const crop of crops) {
    try {
      const base64 = crop.imageBuffer.toString('base64');

      const response = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{
          role: 'user',
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64 } },
            {
              text: `이 웹페이지 섹션 스크린샷의 타입을 분류해주세요.

응답 (순수 JSON만):
{"sectionType": "HERO", "confidence": 0.95, "isEmpty": false}

규칙:
1. 빈 여백/푸터/법적고지/링크모음 → isEmpty: true
2. 명확한 섹션 → confidence 0.8+
3. 애매하면 confidence 0.5 이하

타입: HEADER_BANNER, HERO, KEY_FEATURES, BENEFITS, BEFORE_AFTER, PRODUCT_DETAIL,
INGREDIENTS, HOW_TO_USE, REVIEWS, TESTIMONIAL, SOCIAL_PROOF, FAQ, CTA,
PRICE_TABLE, COMPARISON, BRAND_STORY, TEAM, PARTNERS, STATS, GUARANTEE,
PROCESS, GALLERY, VIDEO`,
            },
          ],
        }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0,
        },
      });

      const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
      const parsed = JSON.parse(rawText) as {
        sectionType?: string;
        confidence?: number;
        isEmpty?: boolean;
      };

      if (parsed.isEmpty) continue;

      classified.push({
        sectionType: parsed.sectionType ?? 'UNKNOWN',
        confidence: parsed.confidence ?? 0.5,
        imageBuffer: crop.imageBuffer,
        width: crop.width,
        height: crop.height,
      });
    } catch { /* 분류 실패 스킵 */ }
  }

  return classified;
}

// ============================================================
// 통합 함수: DOM 우선, AI 폴백
// ============================================================

/**
 * DOM 기반 + AI 폴백 섹션 캡처
 *
 * @param page - Playwright 페이지 (열려있는 상태, DOM 접근 필요)
 * @param fullScreenshot - fullPage 스크린샷 JPEG Buffer
 * @returns 분류된 섹션 이미지 배열
 */
export async function detectAndCaptureSections(
  page: Page | null,
  fullScreenshot: Buffer,
): Promise<CroppedSection[]> {
  const sharp = await import('sharp').then((m) => m.default);
  const metadata = await sharp(fullScreenshot).metadata();
  const imageWidth = metadata.width ?? 0;
  const imageHeight = metadata.height ?? 0;

  if (imageWidth === 0 || imageHeight === 0) return [];

  // === 전략 1: DOM 감지 시도 ===
  let regions: Array<{ y: number; height: number }> = [];
  let strategy = 'AI';

  try {
    if (!page) throw new Error('no page');
    const domSections = await detectDomSections(page);

    if (domSections.length >= DOM_MIN_SECTIONS) {
      strategy = 'DOM';
      regions = domSections.map((s) => ({ y: s.y, height: s.height }));
    }
  } catch {
    // DOM 감지 실패 → AI 폴백
  }

  // === 전략 1.5: 픽셀 분석 경계 감지 ===
  if (strategy === 'AI') {
    const pixelRegions = await detectBoundariesByPixelAnalysis(
      fullScreenshot, imageWidth, imageHeight,
    );
    if (pixelRegions.length >= DOM_MIN_SECTIONS) {
      strategy = 'PIXEL';
      regions = pixelRegions;
    }
  }

  // === 전략 2: AI Vision 폴백 (픽셀 분석도 실패 시) ===
  if (strategy === 'AI') {
    const base64 = fullScreenshot.toString('base64');
    const boundaries = await detectSectionBoundariesByAI(base64, imageWidth, imageHeight);

    if (boundaries.length === 0) return [];

    regions = boundaries.map((b) => ({
      y: b.yStart,
      height: b.yEnd - b.yStart,
    }));

    // AI가 이미 분류했으므로 바로 크롭 + 반환
    const crops = await cropFromFullPage(fullScreenshot, regions, imageWidth, imageHeight);
    const result: CroppedSection[] = [];

    for (let i = 0; i < crops.length && i < boundaries.length; i++) {
      const b = boundaries[i];
      if (!EXCLUDED_SECTION_TYPES.has(b.sectionType) && b.confidence >= 0.6) {
        result.push({
          sectionType: b.sectionType,
          confidence: b.confidence,
          imageBuffer: crops[i].imageBuffer,
          width: crops[i].width,
          height: crops[i].height,
        });
      }
    }

    return result;
  }

  // === DOM 경로: 크롭 → AI 분류 ===
  const crops = await cropFromFullPage(fullScreenshot, regions, imageWidth, imageHeight);

  if (crops.length === 0) return [];

  const classified = await classifySections(crops);

  return classified.filter(
    (s) => s.confidence >= 0.6 && !EXCLUDED_SECTION_TYPES.has(s.sectionType),
  );
}
