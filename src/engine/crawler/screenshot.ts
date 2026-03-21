// ============================================================
// Playwright 스크린샷 엔진
// URL 방문 → 풀페이지 스크린샷 + 섹션 크롭
// ============================================================

import type { CrawlConfig } from './types';

type PlaywrightBrowser = Awaited<ReturnType<typeof import('playwright')['chromium']['launch']>>;
type PlaywrightPage = Awaited<ReturnType<PlaywrightBrowser['newPage']>>;

let browserInstance: PlaywrightBrowser | null = null;

/**
 * 브라우저 인스턴스 (재사용)
 */
async function getBrowser(): Promise<PlaywrightBrowser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    const { chromium } = await import('playwright');
    browserInstance = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
  }
  return browserInstance;
}

/**
 * 페이지 로드 후 자동 스크롤 — lazy-load 이미지 트리거
 */
async function autoScroll(page: PlaywrightPage, maxHeight: number): Promise<void> {
  await page.evaluate(async (max: number) => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight || totalHeight >= max) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  }, maxHeight);
  // 스크롤 후 이미지 로딩 대기
  await page.waitForTimeout(1500);
}

/**
 * 팝업/오버레이 닫기 시도
 */
async function dismissOverlays(page: PlaywrightPage): Promise<void> {
  const selectors = [
    '[class*="popup"] [class*="close"]',
    '[class*="modal"] [class*="close"]',
    '[class*="overlay"] [class*="close"]',
    '[class*="cookie"] button',
    '[class*="consent"] button',
    'button[aria-label="Close"]',
    'button[aria-label="닫기"]',
  ];

  for (const selector of selectors) {
    try {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 500 })) {
        await btn.click({ timeout: 1000 });
        await page.waitForTimeout(300);
      }
    } catch {
      // 해당 오버레이가 없으면 무시
    }
  }
}

/**
 * 풀페이지 스크린샷 촬영
 *
 * 1. Playwright 헤드리스 브라우저로 URL 방문
 * 2. 팝업/오버레이 닫기
 * 3. 자동 스크롤로 lazy-load 트리거
 * 4. JPEG 풀페이지 스크린샷 반환
 *
 * @param url - 캡처할 페이지 URL
 * @param config - 크롤링 설정 (뷰포트, 타임아웃 등)
 * @returns JPEG Buffer
 * @throws 네비게이션 실패, 타임아웃 시 에러
 */
export async function captureFullPage(
  url: string,
  config: CrawlConfig,
): Promise<Buffer> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: {
      width: config.viewportWidth,
      height: config.viewportHeight,
    },
    locale: 'ko-KR',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: config.navigationTimeout,
    });

    await dismissOverlays(page);
    await autoScroll(page, config.maxCaptureHeight);

    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: 'jpeg',
      quality: config.jpegQuality,
      clip: pageHeight > config.maxCaptureHeight
        ? { x: 0, y: 0, width: config.viewportWidth, height: config.maxCaptureHeight }
        : undefined,
    });

    return Buffer.from(screenshotBuffer);
  } finally {
    await context.close();
  }
}

/**
 * 스크린샷에서 특정 섹션 영역 크롭
 *
 * sharp 미사용 — Playwright의 clip 기능으로 대체하기 어려우므로
 * Canvas-free 방식: JPEG 디코딩 → 픽셀 슬라이스 → JPEG 인코딩
 * 실제 구현은 sharp가 설치되어 있다면 사용하고, 없으면 전체 이미지 반환
 *
 * @param fullScreenshot - 풀페이지 JPEG Buffer
 * @param y - 크롭 시작 y좌표 (px)
 * @param height - 크롭 높이 (px)
 * @param pageWidth - 페이지 너비 (px)
 * @returns 크롭된 JPEG Buffer (실패 시 원본 반환)
 */
export async function cropSection(
  fullScreenshot: Buffer,
  y: number,
  height: number,
  pageWidth: number,
): Promise<Buffer> {
  try {
    // sharp가 설치되어 있으면 사용
    const sharp = await import('sharp').then((m) => m.default);
    const metadata = await sharp(fullScreenshot).metadata();

    const imgWidth = metadata.width ?? pageWidth;
    const imgHeight = metadata.height ?? 0;

    if (imgWidth === 0 || imgHeight === 0) {
      return fullScreenshot;
    }

    // y, height를 이미지 실제 크기에 맞게 클램핑
    const clampedY = Math.max(0, Math.min(y, imgHeight - 1));
    const clampedHeight = Math.min(height, imgHeight - clampedY);

    if (clampedHeight <= 0) {
      return fullScreenshot;
    }

    const cropped = await sharp(fullScreenshot)
      .extract({
        left: 0,
        top: clampedY,
        width: imgWidth,
        height: clampedHeight,
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    return cropped;
  } catch {
    // sharp 미설치 또는 크롭 실패 시 원본 반환
    return fullScreenshot;
  }
}

/** 페이지가 열려있는 상태의 스크린샷 결과 */
export interface LiveScreenshotResult {
  url: string;
  screenshotBuffer: Buffer;
  pageTitle: string;
  pageHeight: number;
  page: PlaywrightPage;
  context: Awaited<ReturnType<PlaywrightBrowser['newContext']>>;
}

/**
 * URL 방문 → 풀페이지 스크린샷 + 페이지 유지
 * 뷰포트 스캔(crop.ts)을 위해 페이지를 닫지 않고 반환
 * 호출자가 context.close()로 정리해야 함
 */
export async function takeScreenshotKeepOpen(url: string): Promise<LiveScreenshotResult> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ko-KR',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 30_000,
  });

  await dismissOverlays(page);
  await autoScroll(page, 15_000);

  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const pageTitle = await page.title();

  const screenshotBuffer = await page.screenshot({
    fullPage: true,
    type: 'jpeg',
    quality: 85,
    clip: pageHeight > 15_000
      ? { x: 0, y: 0, width: 1440, height: 15_000 }
      : undefined,
  });

  return {
    url,
    screenshotBuffer: Buffer.from(screenshotBuffer),
    pageTitle,
    pageHeight,
    page,
    context,
  };
}

/**
 * 브라우저 종료 — 워커 셧다운 시 호출
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
