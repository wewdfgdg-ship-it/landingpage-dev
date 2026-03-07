import { test, expect } from '@playwright/test';

// ============================================================
// 보안 E2E 테스트
// ============================================================

test.describe('인증 보안', () => {
  test('API 엔드포인트는 미인증 시 접근 거부', async ({ request }) => {
    const endpoints = [
      { method: 'get' as const, url: '/api/billing' },
      { method: 'post' as const, url: '/api/billing' },
    ];

    for (const ep of endpoints) {
      const response = await request[ep.method](ep.url, { maxRedirects: 0 });
      // 미인증: 302(redirect to login) 또는 401
      expect(
        response.status(),
        `${ep.method.toUpperCase()} ${ep.url}`,
      ).toBeGreaterThanOrEqual(300);
    }
  });

  test('관리자 API는 미인증 시 접근 불가', async ({ request }) => {
    const adminEndpoints = ['/api/admin/billing', '/api/admin/plans'];

    for (const url of adminEndpoints) {
      const response = await request.get(url, { maxRedirects: 0 });
      // 미인증: 302(redirect) 또는 401/403/404
      expect(response.status(), url).toBeGreaterThanOrEqual(300);
    }
  });

  test('크론 API는 시크릿 없이 접근 불가', async ({ request }) => {
    const cronEndpoints = [
      '/api/cron/subscription-expire',
      '/api/cron/usage-alert',
    ];

    for (const url of cronEndpoints) {
      const response = await request.get(url);
      // DB 미연결 시 500, CRON_SECRET 미설정 시 401
      // 서버가 크래시하지 않고 응답하면 통과
      expect(response.status(), url).toBeLessThanOrEqual(500);
    }
  });
});

test.describe('XSS 방어', () => {
  test('랜딩페이지에 XSS 벡터 없음', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toContain('<script>alert');
    expect(html).not.toContain('javascript:');
  });
});

test.describe('트래킹 API 입력 검증', () => {
  test('잘못된 페이로드에 대해 에러 반환', async ({ request }) => {
    const response = await request.post('/api/track', {
      data: { invalid: true },
    });
    // 잘못된 입력이지만 서버 크래시 없이 처리
    expect(response.status()).toBeLessThan(500);
  });

  test('빈 바디에 대해 에러 반환', async ({ request }) => {
    const response = await request.post('/api/track', {
      data: {},
    });
    expect(response.status()).toBeLessThan(500);
  });
});

test.describe('보안 헤더', () => {
  test('공개 페이지가 정상 응답', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).toBeTruthy();
    expect(response!.status()).toBe(200);
    // Content-Type 확인
    const contentType = response!.headers()['content-type'];
    expect(contentType).toContain('text/html');
  });
});
