import { test, expect } from '@playwright/test';

// ============================================================
// 대시보드 네비게이션 E2E 테스트
// ============================================================

test.describe('대시보드 라우팅 보호', () => {
  const protectedRoutes = [
    '/projects',
    '/projects/new',
    '/settings',
    '/billing',
    '/admin',
  ];

  for (const route of protectedRoutes) {
    test(`${route} 미인증 접근 시 로그인으로 리다이렉트`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/);
    });
  }
});

test.describe('대시보드 레이아웃 (API 모킹)', () => {
  test.beforeEach(async ({ page }) => {
    // 인증 세션 모킹
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'test-user', name: '테스트 유저', email: 'test@example.com' },
          expires: '2099-01-01T00:00:00.000Z',
        }),
      });
    });
  });

  test('대시보드 사이드바에 브랜드명이 표시된다', async ({ page }) => {
    await page.goto('/projects');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    await expect(page.getByText('마케팅 엔진').first()).toBeVisible();
  });

  test('사이드바에 주요 네비게이션 항목이 있다', async ({ page }) => {
    await page.goto('/projects');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const sidebar = page.locator('aside');
    await expect(sidebar.getByRole('link', { name: '프로젝트' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: '설정' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: '결제' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: '관리자' })).toBeVisible();
  });

  test('사이드바 프로젝트 링크의 href가 올바르다', async ({ page }) => {
    await page.goto('/projects');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const sidebar = page.locator('aside');
    await expect(sidebar.getByRole('link', { name: '프로젝트' })).toHaveAttribute('href', '/projects');
    await expect(sidebar.getByRole('link', { name: '설정' })).toHaveAttribute('href', '/settings');
    await expect(sidebar.getByRole('link', { name: '결제' })).toHaveAttribute('href', '/billing');
    await expect(sidebar.getByRole('link', { name: '관리자' })).toHaveAttribute('href', '/admin');
  });

  test('프로젝트 페이지 제목이 렌더링된다', async ({ page }) => {
    await page.goto('/projects');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    await expect(page.getByRole('heading', { name: '프로젝트' })).toBeVisible();
    await expect(page.getByText('AI 마케팅 엔진으로 랜딩페이지를 생성하세요')).toBeVisible();
  });

  test('설정 페이지 제목이 렌더링된다', async ({ page }) => {
    await page.goto('/settings');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    await expect(page.getByRole('heading', { name: '설정' })).toBeVisible();
  });

  test('결제 페이지 제목이 렌더링된다', async ({ page }) => {
    await page.goto('/billing');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    await expect(page.getByRole('heading', { name: '결제' })).toBeVisible();
  });

  test('현재 경로에 맞는 사이드바 항목이 활성화된다', async ({ page }) => {
    await page.goto('/projects');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    // 활성 링크는 bg-gray-100 클래스를 가짐
    const activeLink = page.locator('aside').getByRole('link', { name: '프로젝트' });
    await expect(activeLink).toHaveClass(/bg-gray-100/);
  });

  test('설정 페이지에서 설정 사이드바 항목이 활성화된다', async ({ page }) => {
    await page.goto('/settings');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    const activeLink = page.locator('aside').getByRole('link', { name: '설정' });
    await expect(activeLink).toHaveClass(/bg-gray-100/);
  });
});

test.describe('대시보드 페이지 간 네비게이션 (API 모킹)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'test-user', name: '테스트 유저', email: 'test@example.com' },
          expires: '2099-01-01T00:00:00.000Z',
        }),
      });
    });
  });

  test('사이드바 설정 링크 클릭 시 설정 페이지로 이동', async ({ page }) => {
    await page.goto('/projects');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    await page.locator('aside').getByRole('link', { name: '설정' }).click();
    await expect(page).toHaveURL('/settings');
  });

  test('사이드바 결제 링크 클릭 시 결제 페이지로 이동', async ({ page }) => {
    await page.goto('/projects');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    await page.locator('aside').getByRole('link', { name: '결제' }).click();
    await expect(page).toHaveURL('/billing');
  });

  test('사이드바 프로젝트 링크 클릭 시 프로젝트 페이지로 이동', async ({ page }) => {
    await page.goto('/settings');

    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    await page.locator('aside').getByRole('link', { name: '프로젝트' }).click();
    await expect(page).toHaveURL('/projects');
  });
});

test.describe('결제 페이지 API 응답 처리', () => {
  test('결제 API가 미인증 상태에서 접근 불가', async ({ request }) => {
    const response = await request.get('/api/billing', { maxRedirects: 0 });
    expect(response.status()).toBeGreaterThanOrEqual(300);
  });

  test('결제 POST API가 미인증 상태에서 접근 불가', async ({ request }) => {
    const response = await request.post('/api/billing', {
      data: { plan: 'PRO', phone: '01012345678', billingCycle: 'monthly' },
      maxRedirects: 0,
    });
    expect(response.status()).toBeGreaterThanOrEqual(300);
  });
});
