'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User, Building2, CreditCard, LogOut } from 'lucide-react';

// ============================================================
// 설정 페이지 — 클라이언트 컴포넌트
// ============================================================

interface SettingsClientProps {
  user: {
    name: string;
    email: string;
    image: string;
    createdAt: string;
  };
  org: {
    id: string;
    name: string;
    plan: string;
    role: string;
    memberCount: number;
    projectCount: number;
    createdAt: string;
  } | null;
  subscription: {
    status: string;
    periodStart: string;
    periodEnd: string;
  } | null;
}

const PLAN_LABELS: Record<string, string> = {
  FREE: '무료',
  PRO: '프로',
  BUSINESS: '비즈니스',
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: '소유자',
  ADMIN: '관리자',
  MEMBER: '멤버',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: '활성', color: 'bg-green-100 text-green-700' },
  GRACE_PERIOD: { label: '유예 기간', color: 'bg-yellow-100 text-yellow-700' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function InfoRow({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

export function SettingsClient({ user, org, subscription }: SettingsClientProps): React.ReactElement {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">설정</h1>

      {/* 프로필 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">프로필</h2>
        </div>
        <div className="flex items-center gap-4 mb-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="h-16 w-16 rounded-full border border-gray-200"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-400">
              {user.name?.[0] ?? '?'}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-gray-900">{user.name || '이름 없음'}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <InfoRow label="가입일" value={formatDate(user.createdAt)} />
      </section>

      {/* 조직 */}
      {org && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">워크스페이스</h2>
          </div>
          <InfoRow label="이름" value={org.name} />
          <InfoRow label="역할" value={ROLE_LABELS[org.role] ?? org.role} />
          <InfoRow label="요금제" value={PLAN_LABELS[org.plan] ?? org.plan} />
          <InfoRow label="멤버 수" value={`${org.memberCount}명`} />
          <InfoRow label="프로젝트 수" value={`${org.projectCount}개`} />
          <InfoRow label="생성일" value={formatDate(org.createdAt)} />
        </section>
      )}

      {/* 구독 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">구독</h2>
        </div>
        {subscription ? (
          <>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">상태</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_LABELS[subscription.status]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[subscription.status]?.label ?? subscription.status}
              </span>
            </div>
            <InfoRow label="현재 기간 시작" value={formatDate(subscription.periodStart)} />
            <InfoRow label="현재 기간 종료" value={formatDate(subscription.periodEnd)} />
          </>
        ) : (
          <p className="text-sm text-gray-400">활성 구독이 없습니다. 무료 플랜을 사용 중입니다.</p>
        )}
      </section>

      {/* 로그아웃 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">로그아웃</h2>
            <p className="text-xs text-gray-400 mt-0.5">현재 세션에서 로그아웃합니다</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </section>
    </div>
  );
}
