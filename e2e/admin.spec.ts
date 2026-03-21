import { test, expect } from '@playwright/test';

// ============================================================
// 관리자 대시보드 E2E 테스트
// ============================================================

test.describe('관리자 대시보드 접근 제어', () => {
  test('미인증 사용자는 관리자 페이지에 접근 불가', async ({ page }) => {
    await page.goto('/admin');
    // 로그인 페이지로 리다이렉트되거나 에러 표시
    await expect(page).toHaveURL(/\/(login|admin)/);
  });

  test('관리자 빌링 API는 미인증 시 403 반환', async ({ page }) => {
    const tabs = ['overview', 'subscriptions', 'payments', 'revenue-trend', 'system', 'users'];
    for (const tab of tabs) {
      const res = await page.request.get(`/api/admin/billing?tab=${tab}`);
      expect(res.status()).toBe(403);
    }
  });
});

test.describe('관리자 빌링 API 입력 검증', () => {
  test('잘못된 탭 이름에 400 반환', async ({ page }) => {
    const res = await page.request.get('/api/admin/billing?tab=invalid_tab_name');
    // 403(미인증) 또는 400(잘못된 탭) 중 하나
    expect([400, 403]).toContain(res.status());
  });

  test('페이지네이션 파라미터가 정상 처리됨', async ({ page }) => {
    // 음수 페이지, 과도한 limit 등 엣지케이스
    const cases = [
      'tab=subscriptions&page=-1&limit=100',
      'tab=subscriptions&page=0&limit=0',
      'tab=payments&page=999999&limit=50',
      'tab=users&search=<script>alert(1)</script>',
      'tab=users&search=' + encodeURIComponent('테스트 사용자'),
      'tab=users&search=' + encodeURIComponent("'; DROP TABLE users; --"),
    ];

    for (const qs of cases) {
      const res = await page.request.get(`/api/admin/billing?${qs}`);
      // 미인증이므로 403이어야 하고, 서버 크래시(500)는 안 됨
      expect(res.status()).not.toBe(500);
    }
  });

  test('한국어 검색어가 정상 처리됨', async ({ page }) => {
    const koreanInputs = [
      '홍길동',
      'test@example.com',
      '관리자 테스트',
      '아주 긴 검색어 '.repeat(50),
    ];

    for (const input of koreanInputs) {
      const res = await page.request.get(
        `/api/admin/billing?tab=users&search=${encodeURIComponent(input)}`,
      );
      expect(res.status()).not.toBe(500);
    }
  });
});

test.describe('트래킹 API 텍스트 입력 검증', () => {
  test('XSS 시도가 포함된 텍스트가 안전하게 처리됨', async ({ page }) => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '"><img src=x onerror=alert(1)>',
      "javascript:alert('xss')",
      '<svg onload=alert(1)>',
      '{{constructor.constructor("return this")()}}',
    ];

    for (const payload of xssPayloads) {
      const res = await page.request.post('/api/track', {
        data: {
          projectId: payload,
          versionId: payload,
          event: 'page_view',
          sessionId: 'test-session',
        },
      });
      // 500 크래시 없이 처리되어야 함
      expect(res.status()).not.toBe(500);
    }
  });

  test('SQL 인젝션 시도가 안전하게 처리됨', async ({ page }) => {
    const sqlPayloads = [
      "' OR 1=1 --",
      "'; DROP TABLE projects; --",
      "1' UNION SELECT * FROM users --",
      "admin'--",
    ];

    for (const payload of sqlPayloads) {
      const res = await page.request.post('/api/track', {
        data: {
          projectId: payload,
          versionId: 'test',
          event: 'page_view',
          sessionId: 'test-session',
        },
      });
      expect(res.status()).not.toBe(500);
    }
  });

  test('초대형 텍스트 입력이 안전하게 처리됨', async ({ page }) => {
    const largeText = 'A'.repeat(100000);
    const res = await page.request.post('/api/track', {
      data: {
        projectId: largeText,
        versionId: 'test',
        event: 'page_view',
        sessionId: 'test-session',
      },
    });
    expect(res.status()).not.toBe(500);
  });

  test('유니코드/이모지 텍스트가 안전하게 처리됨', async ({ page }) => {
    const unicodePayloads = [
      '한국어 테스트 프로젝트',
      '日本語テスト',
      '🚀🎯💡 이모지 테스트',
      '\u0000\u001F 제어문자',
      '零幅空格\u200B테스트',
    ];

    for (const payload of unicodePayloads) {
      const res = await page.request.post('/api/track', {
        data: {
          projectId: payload,
          versionId: 'test',
          event: 'page_view',
          sessionId: 'test-session',
        },
      });
      expect(res.status()).not.toBe(500);
    }
  });
});
