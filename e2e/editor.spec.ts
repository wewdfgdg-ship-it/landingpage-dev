import { test, expect } from '@playwright/test';

// ============================================================
// 에디터 E2E 테스트
// 3패널 에디터: 좌(섹션 리스트) | 중(미리보기) | 우(편집 패널)
// ============================================================

test.describe('에디터 접근 제어', () => {
  test('미인증 시 에디터 페이지가 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/projects/test-id/editor');
    await expect(page).toHaveURL(/\/login/);
  });

  test('callbackUrl에 에디터 경로가 포함된다', async ({ page }) => {
    await page.goto('/projects/abc-123/editor');
    const url = new URL(page.url());
    expect(url.searchParams.get('callbackUrl')).toContain('/projects/abc-123/editor');
  });
});

test.describe('에디터 API', () => {
  test('미인증 GET /api/projects/:id는 에러 반환', async ({ request }) => {
    const response = await request.get('/api/projects/test-id');
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('미인증 PATCH /api/projects/:id는 에러 반환', async ({ request }) => {
    const response = await request.patch('/api/projects/test-id', {
      data: {
        copyBlocks: {},
        layoutSections: [],
      },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('에디터 미리보기 API', () => {
  test('미인증 GET /api/projects/:id/preview는 에러 반환', async ({ request }) => {
    const response = await request.get('/api/projects/test-id/preview');
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('에디터 페이지 구조 (스모크)', () => {
  test('에디터 경로가 올바르게 매핑된다', async ({ page }) => {
    // 에디터 URL 패턴: /projects/:id/editor
    await page.goto('/projects/any-project-id/editor');
    // 미인증 → 로그인으로 리다이렉트 (에디터 경로가 보호됨을 확인)
    await expect(page).toHaveURL(/\/login/);
    const url = new URL(page.url());
    expect(url.searchParams.get('callbackUrl')).toBe('/projects/any-project-id/editor');
  });
});
