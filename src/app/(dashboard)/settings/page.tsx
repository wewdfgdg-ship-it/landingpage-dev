import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getUserId } from '@/lib/get-user-id';
import { SettingsClient } from './settings-client';

// ============================================================
// 설정 페이지 — 서버 컴포넌트
// 사용자 프로필, 조직 정보, 구독 요약
// ============================================================

export default async function SettingsPage(): Promise<React.ReactElement> {
  const userId = await getUserId();
  if (!userId) redirect('/login');

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) redirect('/login');

  const membership = await db.membership.findFirst({
    where: { userId },
    include: {
      org: {
        include: {
          _count: { select: { memberships: true, projects: true } },
        },
      },
    },
  });

  const subscription = membership
    ? await db.subscription.findFirst({
        where: { orgId: membership.org.id, status: { in: ['ACTIVE', 'GRACE_PERIOD'] } },
        select: {
          status: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    : null;

  return (
    <SettingsClient
      user={{
        name: user.name ?? '',
        email: user.email,
        image: user.image ?? '',
        createdAt: user.createdAt.toISOString(),
      }}
      org={
        membership
          ? {
              id: membership.org.id,
              name: membership.org.name,
              plan: membership.org.plan,
              role: membership.role,
              memberCount: membership.org._count.memberships,
              projectCount: membership.org._count.projects,
              createdAt: membership.org.createdAt.toISOString(),
            }
          : null
      }
      subscription={
        subscription
          ? {
              status: subscription.status,
              periodStart: subscription.currentPeriodStart.toISOString(),
              periodEnd: subscription.currentPeriodEnd.toISOString(),
            }
          : null
      }
    />
  );
}
