import { test, expect } from '@playwright/test';

// ============================================================
// 마케팅 랜딩페이지 E2E 테스트
// ============================================================

test.describe('마케팅 랜딩페이지', () => {
  test('루트 페이지가 랜딩 콘텐츠를 보여준다', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('랜딩페이지');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: '요금제' })).toBeVisible();
    await expect(page.getByRole('link', { name: '시작하기' }).first()).toBeVisible();
  });

  test('네비게이션 링크가 올바르게 연결된다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: '요금제' }).click();
    await expect(page).toHaveURL('/pricing');
  });

  test('CTA 버튼이 로그인으로 연결된다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '무료로 시작하기' }).first().click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('주요 섹션이 모두 렌더링된다', async ({ page }) => {
    await page.goto('/');
    // 히어로
    await expect(page.locator('h1')).toBeVisible();
    // 숫자 섹션
    await expect(page.getByText('12', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('AI 엔진', { exact: true })).toBeVisible();
    // 기능 섹션
    await expect(page.getByText('왜 마케팅 엔진인가요?')).toBeVisible();
    // 3단계 섹션
    await expect(page.getByText('3단계로 완성')).toBeVisible();
    // CTA 섹션
    await expect(page.getByText('지금 무료로 시작하세요')).toBeVisible();
    // 푸터
    await expect(page.locator('footer')).toBeVisible();
  });
});

test.describe('요금제 페이지', () => {
  test('3개 플랜 카드가 표시된다', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('심플한 요금제')).toBeVisible();
    await expect(page.getByRole('heading', { name: '무료', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '프로', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '비즈니스', exact: true })).toBeVisible();
  });

  test('프로 플랜에 인기 배지가 있다', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('인기')).toBeVisible();
  });

  test('FAQ 섹션이 렌더링된다', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('자주 묻는 질문')).toBeVisible();
    await expect(page.getByText('무료 플랜으로 무엇을 할 수 있나요?')).toBeVisible();
  });

  test('가격 정보가 올바르게 표시된다', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('29,000원')).toBeVisible();
    await expect(page.getByText('79,000원')).toBeVisible();
  });
});

test.describe('인증 흐름', () => {
  test('보호된 페이지는 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveURL(/\/login/);
  });

  test('로그인 페이지가 정상 렌더링', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('로그인')).toBeVisible();
    await expect(page.getByText('Google로 계속하기')).toBeVisible();
  });
});

test.describe('공개 배포 페이지', () => {
  test('존재하지 않는 슬러그는 에러 반환', async ({ page }) => {
    const response = await page.goto('/p/nonexistent-slug-12345');
    // DB 미연결 시 500, 정상 시 404
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });
});
