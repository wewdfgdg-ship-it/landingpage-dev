import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { resolve } from 'dns/promises';
import { addDomainToVercel, removeDomainFromVercel, checkDomainConfig } from '@/lib/vercel';

// ============================================================
// 커스텀 도메인 API
// GET  /api/projects/[id]/domain — 현재 도메인 + 검증 상태
// PUT  /api/projects/[id]/domain — 도메인 설정/변경
// DELETE /api/projects/[id]/domain — 도메인 제거
// ============================================================

async function getProjectWithAuth(
  userId: string,
  projectId: string,
): Promise<{ id: string; slug: string | null; customDomain: string | null; isDeployed: boolean } | null> {
  const membership = await db.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!membership) return null;

  return db.project.findFirst({
    where: { id: projectId, orgId: membership.orgId, deletedAt: null },
    select: { id: true, slug: true, customDomain: true, isDeployed: true },
  });
}

// ============================================================
// GET — 현재 도메인 정보 + DNS 검증 상태
// ============================================================

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectWithAuth(session.user.id, id);

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  if (!project.customDomain) {
    return NextResponse.json({
      domain: null,
      verified: false,
      instructions: null,
    });
  }

  // DNS 검증 + SSL 상태
  const [verification, sslStatus] = await Promise.all([
    verifyDomain(project.customDomain),
    checkDomainConfig(project.customDomain).catch(() => ({
      configured: false,
      ssl: 'error' as const,
    })),
  ]);

  return NextResponse.json({
    domain: project.customDomain,
    verified: verification.verified,
    ssl: sslStatus.ssl,
    dnsRecords: verification.records,
    instructions: getDnsInstructions(project.customDomain),
  });
}

// ============================================================
// PUT — 도메인 설정/변경
// ============================================================

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectWithAuth(session.user.id, id);

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  const body = (await req.json()) as { domain: string };
  const domain = normalizeDomain(body.domain);

  if (!domain) {
    return NextResponse.json({ error: '유효하지 않은 도메인' }, { status: 400 });
  }

  // 중복 검사
  const existing = await db.project.findFirst({
    where: { customDomain: domain, id: { not: id } },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: '이미 사용 중인 도메인입니다' }, { status: 409 });
  }

  // 기존 도메인이 있으면 Vercel에서 제거
  if (project.customDomain && project.customDomain !== domain) {
    await removeDomainFromVercel(project.customDomain).catch(() => {});
  }

  await db.project.update({
    where: { id },
    data: { customDomain: domain },
  });

  // Vercel 프로젝트에 도메인 등록 (SSL 자동 발급)
  const vercelResult = await addDomainToVercel(domain);

  return NextResponse.json({
    domain,
    vercel: vercelResult,
    instructions: getDnsInstructions(domain),
  });
}

// ============================================================
// DELETE — 도메인 제거
// ============================================================

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectWithAuth(session.user.id, id);

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  // Vercel에서 도메인 제거
  if (project.customDomain) {
    await removeDomainFromVercel(project.customDomain).catch(() => {});
  }

  await db.project.update({
    where: { id },
    data: { customDomain: null },
  });

  return NextResponse.json({ success: true });
}

// ============================================================
// DNS 검증
// ============================================================

interface DnsVerification {
  verified: boolean;
  records: { type: string; value: string; status: string }[];
}

async function verifyDomain(domain: string): Promise<DnsVerification> {
  const records: { type: string; value: string; status: string }[] = [];

  // CNAME 확인
  try {
    const cnames = await resolve(domain, 'CNAME');
    const hasCname = cnames.some((c) =>
      c.toLowerCase().includes('vercel') || c.toLowerCase().includes('cname.vercel-dns.com'),
    );
    records.push({
      type: 'CNAME',
      value: cnames.join(', ') || '없음',
      status: hasCname ? 'verified' : 'mismatch',
    });
  } catch {
    records.push({ type: 'CNAME', value: '없음', status: 'not_found' });
  }

  // A 레코드 확인 (대체)
  try {
    const aRecords = await resolve(domain, 'A');
    // Vercel IP: 76.76.21.21
    const hasVercelA = aRecords.includes('76.76.21.21');
    records.push({
      type: 'A',
      value: aRecords.join(', ') || '없음',
      status: hasVercelA ? 'verified' : 'mismatch',
    });
  } catch {
    records.push({ type: 'A', value: '없음', status: 'not_found' });
  }

  const verified = records.some((r) => r.status === 'verified');
  return { verified, records };
}

// ============================================================
// 헬퍼
// ============================================================

function normalizeDomain(raw: string): string | null {
  if (!raw) return null;
  let domain = raw.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/\/.*$/, '');
  domain = domain.replace(/^www\./, '');

  // 기본 검증: 최소 도메인 형식
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) {
    return null;
  }

  return domain;
}

function getDnsInstructions(domain: string): { cname: string; a: string; txt: string } {
  return {
    cname: `CNAME ${domain} → cname.vercel-dns.com`,
    a: `A ${domain} → 76.76.21.21`,
    txt: `Vercel 대시보드에서 도메인을 추가한 후 자동으로 SSL이 활성화됩니다`,
  };
}
