// ============================================================
// Vercel API 클라이언트 — 커스텀 도메인 자동 등록/삭제
// 재시도 로직 포함 (지수 백오프, 최대 3회)
// ============================================================

const VERCEL_API = 'https://api.vercel.com';
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function getHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

function teamQuery(): string {
  return process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : '';
}

/**
 * fetch + 지수 백오프 재시도 (429, 500, 502, 503, 504)
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries: number = MAX_RETRIES,
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, init);

    // 성공 또는 클라이언트 에러 (재시도 무의미)
    if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
      return res;
    }

    // 마지막 시도면 그대로 반환
    if (attempt === retries) {
      return res;
    }

    // 재시도 대기 (429: Retry-After 헤더 존재 시 사용)
    const retryAfter = res.headers.get('retry-after');
    const delay = retryAfter
      ? parseInt(retryAfter, 10) * 1000
      : BASE_DELAY_MS * Math.pow(2, attempt);

    await new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // TypeScript 도달 불가하지만 안전장치
  return fetch(url, init);
}

// ============================================================
// 도메인 추가 → Vercel 프로젝트에 커스텀 도메인 등록 + SSL 자동 발급
// ============================================================
export async function addDomainToVercel(domain: string): Promise<{
  success: boolean;
  error?: string;
  verification?: { type: string; domain: string; value: string }[];
}> {
  if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT_ID) {
    return { success: false, error: 'Vercel 설정 누락' };
  }

  const projectId = process.env.VERCEL_PROJECT_ID;
  const url = `${VERCEL_API}/v10/projects/${projectId}/domains${teamQuery()}`;

  const res = await fetchWithRetry(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name: domain }),
  });

  if (res.ok) {
    return { success: true };
  }

  const data = (await res.json()) as {
    error?: { code: string; message: string };
    verification?: { type: string; domain: string; value: string }[];
  };

  // 이미 등록된 도메인
  if (data.error?.code === 'domain_already_in_use') {
    return { success: true };
  }

  // DNS 검증 필요
  if (data.error?.code === 'domain_verification_failed' && data.verification) {
    return {
      success: false,
      error: 'DNS 검증 필요',
      verification: data.verification,
    };
  }

  return {
    success: false,
    error: data.error?.message ?? `Vercel API 오류 (${res.status})`,
  };
}

// ============================================================
// 도메인 제거 → Vercel 프로젝트에서 커스텀 도메인 삭제
// ============================================================
export async function removeDomainFromVercel(domain: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT_ID) {
    return { success: false, error: 'Vercel 설정 누락' };
  }

  const projectId = process.env.VERCEL_PROJECT_ID;
  const url = `${VERCEL_API}/v9/projects/${projectId}/domains/${domain}${teamQuery()}`;

  const res = await fetchWithRetry(url, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (res.ok || res.status === 404) {
    return { success: true };
  }

  const data = (await res.json()) as { error?: { message: string } };
  return {
    success: false,
    error: data.error?.message ?? `Vercel API 오류 (${res.status})`,
  };
}

// ============================================================
// 도메인 SSL 상태 확인
// ============================================================
export async function checkDomainConfig(domain: string): Promise<{
  configured: boolean;
  ssl: 'pending' | 'active' | 'error';
  error?: string;
}> {
  if (!process.env.VERCEL_TOKEN) {
    return { configured: false, ssl: 'error', error: 'Vercel 설정 누락' };
  }

  const url = `${VERCEL_API}/v6/domains/${domain}/config${teamQuery()}`;

  const res = await fetchWithRetry(url, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    return { configured: false, ssl: 'error', error: `API 오류 (${res.status})` };
  }

  const data = (await res.json()) as {
    configuredBy: string | null;
    misconfigured: boolean;
  };

  return {
    configured: !data.misconfigured,
    ssl: data.misconfigured ? 'pending' : 'active',
  };
}
