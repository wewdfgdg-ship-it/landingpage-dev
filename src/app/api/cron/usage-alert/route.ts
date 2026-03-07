import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getOrgUsage } from '@/lib/billing';
import { sendUsageWarning } from '@/lib/email';

// ============================================================
// 사용량 임계치 알림 크론 — 매일 실행
// GET /api/cron/usage-alert
// Authorization: Bearer CRON_SECRET
//
// 프로젝트 수, 월 생성 횟수, 배포 수가 한도의 80% 이상이면 경고 이메일
// ============================================================

const THRESHOLD = 0.8; // 80%

export async function GET(req: Request): Promise<NextResponse> {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 유료 플랜 조직만 조회 (FREE는 한도가 낮아서 경고가 너무 잦음)
  const orgs = await db.organization.findMany({
    where: { plan: { not: 'FREE' } },
    select: { id: true },
  });

  let alertsSent = 0;

  for (const org of orgs) {
    try {
      const usage = await getOrgUsage(org.id);

      const ownerEmail = await getOrgOwnerEmail(org.id);
      if (!ownerEmail) continue;

      // 프로젝트 수 체크
      if (
        usage.quotaLimit > 0 &&
        usage.projectCount / usage.quotaLimit >= THRESHOLD
      ) {
        await sendUsageWarning(
          ownerEmail,
          '프로젝트',
          usage.projectCount,
          usage.quotaLimit,
          usage.planConfig.name,
        );
        alertsSent++;
      }

      // 월 생성 횟수 체크
      if (
        usage.generateLimit > 0 &&
        usage.monthlyGenerateCount / usage.generateLimit >= THRESHOLD
      ) {
        await sendUsageWarning(
          ownerEmail,
          '월 생성 횟수',
          usage.monthlyGenerateCount,
          usage.generateLimit,
          usage.planConfig.name,
        );
        alertsSent++;
      }

      // 배포 수 체크
      if (
        usage.deployLimit > 0 &&
        usage.deployCount / usage.deployLimit >= THRESHOLD
      ) {
        await sendUsageWarning(
          ownerEmail,
          '배포',
          usage.deployCount,
          usage.deployLimit,
          usage.planConfig.name,
        );
        alertsSent++;
      }
    } catch {
      // 개별 조직 오류는 무시하고 계속 진행
    }
  }

  return NextResponse.json({
    processedAt: new Date().toISOString(),
    orgsChecked: orgs.length,
    alertsSent,
  });
}

async function getOrgOwnerEmail(orgId: string): Promise<string | null> {
  const membership = await db.membership.findFirst({
    where: { orgId, role: 'OWNER' },
    include: { user: { select: { email: true } } },
  });
  return membership?.user?.email ?? null;
}
