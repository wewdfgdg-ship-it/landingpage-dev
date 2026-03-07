import { test, expect } from '@playwright/test';

// ============================================================
// 모바일 반응형 E2E 테스트
// ============================================================

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test.describe('모바일 반응형', () => {
  test('랜딩페이지가 모바일에서 올바르게 렌더링', async ({ page }) => {
    await page.goto('/');

    // 네비게이션
    await expect(page.locator('nav')).toBeVisible();

    // 히어로 텍스트
    await expect(page.locator('h1')).toBeVisible();

    // CTA 버튼 터치 가능 크기 (최소 44px)
    const cta = page.getByRole('link', { name: '무료로 시작하기' }).first();
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(44);

    // 가로 스크롤 없음 (콘텐츠가 뷰포트 안에 있어야 함)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('요금제 페이지가 모바일에서 세로 스택', async ({ page }) => {
    await page.goto('/pricing');

    // 3개 플랜 카드 렌더링
    await expect(page.getByRole('heading', { name: '무료', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '프로', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '비즈니스', exact: true })).toBeVisible();

    // 가로 스크롤 없음
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('로그인 페이지가 모바일에서 동작', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Google로 계속하기')).toBeVisible();

    const button = page.getByRole('button', { name: /Google/ });
    const box = await button.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
