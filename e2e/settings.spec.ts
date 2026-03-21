import { test, expect } from '@playwright/test';

// ============================================================
// 설정 페이지 E2E 테스트
// ============================================================

test.describe('설정 페이지 접근 제어', () => {
  test('미인증 시 설정 페이지가 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/login/);
  });

  test('callbackUrl에 설정 경로가 포함된다', async ({ page }) => {
    await page.goto('/settings');
    const url = new URL(page.url());
    expect(url.searchParams.get('callbackUrl')).toBe('/settings');
  });
});

test.describe('설정 관련 API', () => {
  test('미인증 시 사용자 프로필 API는 에러 반환', async ({ request }) => {
    const response = await request.get('/api/user/profile');
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('미인증 시 프로필 수정 API는 에러 반환', async ({ request }) => {
    const response = await request.patch('/api/user/profile', {
      data: { name: '테스트 사용자' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('관리자 페이지 접근 제어', () => {
  test('미인증 시 관리자 페이지가 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('결제 페이지 접근 제어', () => {
  test('미인증 시 결제 페이지가 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/billing');
    await expect(page).toHaveURL(/\/login/);
  });
});
