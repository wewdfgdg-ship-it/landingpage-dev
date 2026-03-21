import { test, expect } from '@playwright/test';

// ============================================================
// 인증 플로우 E2E 테스트
// ============================================================

test.describe('로그인 페이지', () => {
  test('로그인 페이지가 정상 렌더링된다', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
    await expect(page.getByText('AI 마케팅 엔진에 오신 것을 환영합니다')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Google로 계속하기' })).toBeVisible();
  });

  test('Google OAuth 버튼이 form submit을 트리거한다', async ({ page }) => {
    await page.goto('/login');

    const button = page.getByRole('button', { name: 'Google로 계속하기' });
    await expect(button).toBeEnabled();
    // form 안에 있는지 확인
    const form = page.locator('form');
    await expect(form).toBeVisible();
    await expect(form.getByRole('button', { name: 'Google로 계속하기' })).toBeVisible();
  });
});

test.describe('인증 리다이렉트', () => {
  test('미인증 사용자가 /projects 접근 시 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fprojects/);
  });

  test('미인증 사용자가 /settings 접근 시 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsettings/);
  });

  test('미인증 사용자가 /projects/new 접근 시 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/projects/new');
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fprojects%2Fnew/);
  });

  test('미인증 사용자가 에디터 접근 시 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/projects/test-id/editor');
    await expect(page).toHaveURL(/\/login\?callbackUrl/);
  });

  test('callbackUrl이 올바르게 전달된다', async ({ page }) => {
    await page.goto('/projects');
    const url = new URL(page.url());
    expect(url.searchParams.get('callbackUrl')).toBe('/projects');
  });
});

test.describe('공개 페이지 접근', () => {
  test('루트 페이지는 인증 없이 접근 가능', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('요금제 페이지는 인증 없이 접근 가능', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveURL('/pricing');
    await expect(page.getByText('심플한 요금제')).toBeVisible();
  });

  test('로그인 페이지는 인증 없이 접근 가능', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
  });
});
