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

test.describe('랜딩페이지 상세 렌더링', () => {
  test('히어로 섹션 텍스트와 링크가 정확하다', async ({ page }) => {
    await page.goto('/');
    // 메인 헤드라인 일부 포함 확인
    await expect(page.locator('h1')).toContainText('입력 한 번으로');
    // 부제목
    await expect(page.getByText('제품 정보만 입력하면')).toBeVisible();
    // 두 번째 CTA 링크 (요금제 보기)
    await expect(page.getByRole('link', { name: '요금제 보기' }).first()).toBeVisible();
  });

  test('기능 섹션 4개 카드가 모두 렌더링된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('12단계 AI 엔진')).toBeVisible();
    await expect(page.getByText('전환율 최적화')).toBeVisible();
    await expect(page.getByText('자동 A/B 테스트')).toBeVisible();
    await expect(page.getByText('완전한 랜딩페이지')).toBeVisible();
  });

  test('3단계 섹션의 단계 번호와 제목이 표시된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('01')).toBeVisible();
    await expect(page.getByText('02')).toBeVisible();
    await expect(page.getByText('03')).toBeVisible();
    await expect(page.getByText('제품 정보 입력')).toBeVisible();
    await expect(page.getByText('AI 분석 & 생성')).toBeVisible();
    await expect(page.getByText('편집 & 배포')).toBeVisible();
  });

  test('통계 섹션의 숫자가 표시된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('42', { exact: true })).toBeVisible();
    await expect(page.getByText('레이아웃 패턴', { exact: true })).toBeVisible();
    await expect(page.getByText('<3분', { exact: true })).toBeVisible();
    await expect(page.getByText('생성 시간', { exact: true })).toBeVisible();
  });

  test('CTA 섹션의 혜택 체크리스트가 표시된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('카드 불필요')).toBeVisible();
    await expect(page.getByText('즉시 시작')).toBeVisible();
    await expect(page.getByText('언제든 업그레이드')).toBeVisible();
  });

  test('푸터 링크가 올바른 href를 가진다', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: '요금제' })).toHaveAttribute('href', '/pricing');
    await expect(footer.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
  });

  test('네비게이션 로고 클릭 시 홈으로 이동', async ({ page }) => {
    await page.goto('/pricing');
    await page.getByRole('link', { name: '마케팅 엔진' }).first().click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('요금제 페이지 상세 렌더링', () => {
  test('각 플랜 CTA 버튼이 로그인으로 연결된다', async ({ page }) => {
    await page.goto('/pricing');
    const ctaLinks = page.getByRole('link', { name: /시작/ });
    await expect(ctaLinks.first()).toBeVisible();
    // 모든 플랜 CTA는 /login 링크
    const count = await ctaLinks.count();
    for (let i = 0; i < count; i++) {
      await expect(ctaLinks.nth(i)).toHaveAttribute('href', '/login');
    }
  });

  test('연간 결제 할인 가격이 표시된다', async ({ page }) => {
    await page.goto('/pricing');
    // 프로 플랜 연간 할인 가격
    await expect(page.getByText('24,000원/월')).toBeVisible();
    // 비즈니스 플랜 연간 할인 가격
    await expect(page.getByText('66,000원/월')).toBeVisible();
  });

  test('FAQ 항목이 4개 렌더링된다', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('언제든 플랜을 변경할 수 있나요?')).toBeVisible();
    await expect(page.getByText('환불이 가능한가요?')).toBeVisible();
    await expect(page.getByText('연간 결제 시 할인이 있나요?')).toBeVisible();
  });

  test('요금제 페이지 푸터에 홈 링크가 있다', async ({ page }) => {
    await page.goto('/pricing');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: '홈' })).toHaveAttribute('href', '/');
  });
});
