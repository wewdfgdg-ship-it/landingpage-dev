// ============================================================
// Vercel API 클라이언트 — 커스텀 도메인 자동 등록/삭제
// ============================================================

const VERCEL_API = 'https://api.vercel.com';

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

function teamQuery() {
  return process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : '';
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

  const res = await fetch(url, {
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

  const res = await fetch(url, {
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

  const res = await fetch(url, {
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
