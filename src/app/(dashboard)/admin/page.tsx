'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

// ============================================================
// 타입
// ============================================================

interface OverviewData {
  totalRevenue: number;
  monthlyRevenue: number;
  prevMonthRevenue: number;
  growthRate: number;
  activeSubscriptions: number;
  planDistribution: { plan: string; count: number }[];
  recentPayments: {
    id: string;
    orgName: string;
    amount: number;
    status: string;
    createdAt: string;
  }[];
}

interface SubscriptionItem {
  id: string;
  orgId: string;
  orgName: string;
  plan: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelReason: string | null;
  createdAt: string;
}

interface PaymentItem {
  id: string;
  orgId: string;
  orgName: string;
  amount: number;
  status: string;
  provider: string;
  externalId: string | null;
  createdAt: string;
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

interface CouponItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  applicablePlans: string[];
  minAmount: number;
  maxUses: number;
  maxUsesPerOrg: number;
  usedCount: number;
  startsAt: string;
  expiresAt: string | null;
  isActive: boolean;
  redemptionCount: number;
  createdAt: string;
}

interface RevenueTrendData {
  monthly: { month: string; revenue: number; count: number }[];
}

interface SystemStatsData {
  totalUsers: number;
  totalOrgs: number;
  totalProjects: number;
  deployedProjects: number;
  totalGenerations: number;
  totalABTests: number;
  concludedABTests: number;
  avgConversionRate: number;
  recentDiagnoses: number;
  subscriptionBreakdown: { status: string; count: number }[];
}

interface UserItem {
  id: string;
  email: string | null;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
  orgName: string | null;
  plan: string | null;
}

type Tab = 'overview' | 'subscriptions' | 'payments' | 'plans' | 'coupons' | 'credits' | 'revenue-trend' | 'system' | 'users';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: '매출 개요' },
  { id: 'revenue-trend', label: '매출 트렌드' },
  { id: 'subscriptions', label: '구독 관리' },
  { id: 'payments', label: '결제 내역' },
  { id: 'users', label: '사용자' },
  { id: 'system', label: '시스템' },
  { id: 'plans', label: '요금제' },
  { id: 'coupons', label: '쿠폰' },
  { id: 'credits', label: '크레딧' },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PAST_DUE: 'bg-red-100 text-red-700',
  GRACE_PERIOD: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  COMPLETED: 'bg-green-100 text-green-700',
  PENDING: 'bg-blue-100 text-blue-700',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-yellow-100 text-yellow-700',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: '활성',
  PAST_DUE: '연체',
  GRACE_PERIOD: '유예',
  CANCELLED: '해지',
  COMPLETED: '완료',
  PENDING: '대기',
  FAILED: '실패',
  REFUNDED: '환불',
};

// ============================================================
// 페이지
// ============================================================

export default function AdminPage(): React.ReactElement {
  const [tab, setTab] = useState<Tab>('overview');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'subscriptions' && <SubscriptionsTab onError={setError} onSuccess={setSuccess} />}
      {tab === 'payments' && <PaymentsTab onError={setError} onSuccess={setSuccess} />}
      {tab === 'revenue-trend' && <RevenueTrendTab />}
      {tab === 'system' && <SystemTab />}
      {tab === 'users' && <UsersTab onError={setError} />}
      {tab === 'plans' && <PlansTab onError={setError} onSuccess={setSuccess} />}
      {tab === 'coupons' && <CouponsTab onError={setError} onSuccess={setSuccess} />}
      {tab === 'credits' && <CreditsTab onError={setError} onSuccess={setSuccess} />}
    </div>
  );
}

// ============================================================
// 매출 개요 탭
// ============================================================

function OverviewTab(): React.ReactElement {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch('/api/admin/billing?tab=overview')
      .then((r) => r.json())
      .then((d: OverviewData) => {
          if (d && typeof d.totalRevenue === 'number') setData(d);
        })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-500">데이터를 불러올 수 없습니다. 관리자 권한을 확인하세요.</p>;
  }

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="전체 매출" value={`${data.totalRevenue.toLocaleString()}원`} />
        <StatCard
          label="이번 달 매출"
          value={`${data.monthlyRevenue.toLocaleString()}원`}
          sub={data.growthRate !== 0 ? `전월 대비 ${data.growthRate > 0 ? '+' : ''}${data.growthRate}%` : undefined}
          subColor={data.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <StatCard label="지난 달 매출" value={`${data.prevMonthRevenue.toLocaleString()}원`} />
        <StatCard label="활성 구독" value={`${data.activeSubscriptions}건`} />
      </div>

      {/* 플랜별 분포 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-base font-bold text-gray-900">플랜별 조직 분포</h3>
        <div className="flex gap-6">
          {data.planDistribution.map((p) => (
            <div key={p.plan} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{p.count}</div>
              <div className="text-sm text-gray-500">{p.plan}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 결제 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-base font-bold text-gray-900">최근 결제</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
              <th className="pb-2 font-medium">조직</th>
              <th className="pb-2 font-medium">금액</th>
              <th className="pb-2 font-medium">상태</th>
              <th className="pb-2 font-medium">날짜</th>
            </tr>
          </thead>
          <tbody>
            {data.recentPayments.map((p) => (
              <tr key={p.id} className="border-b border-gray-50">
                <td className="py-2.5 text-gray-700">{p.orgName}</td>
                <td className="py-2.5 font-medium text-gray-900">{p.amount.toLocaleString()}원</td>
                <td className="py-2.5">
                  <StatusBadge status={p.status} />
                </td>
                <td className="py-2.5 text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// 구독 관리 탭
// ============================================================

function SubscriptionsTab({
  onError,
}: {
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}): React.ReactElement {
  const [data, setData] = useState<PaginatedResult<SubscriptionItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tab: 'subscriptions', page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/billing?${params}`);
      if (!res.ok) throw new Error();
      setData(await res.json() as PaginatedResult<SubscriptionItem>);
    } catch {
      onError('구독 목록 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, onError]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex gap-2">
        {['', 'ACTIVE', 'PAST_DUE', 'GRACE_PERIOD', 'CANCELLED'].map((s) => (
          <button
            key={s}
            type="button"
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => { setStatusFilter(s); setPage(1); }}
          >
            {s ? STATUS_LABELS[s] ?? s : '전체'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      ) : !data?.items.length ? (
        <p className="py-8 text-center text-gray-500">구독 내역이 없습니다</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="p-3 font-medium">조직</th>
                  <th className="p-3 font-medium">플랜</th>
                  <th className="p-3 font-medium">상태</th>
                  <th className="p-3 font-medium">기간</th>
                  <th className="p-3 font-medium">해지 예약</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-700">{s.orgName}</td>
                    <td className="p-3 font-medium text-gray-900">{s.plan}</td>
                    <td className="p-3"><StatusBadge status={s.status} /></td>
                    <td className="p-3 text-gray-500 text-xs">
                      {new Date(s.currentPeriodStart).toLocaleDateString('ko-KR')}
                      {' ~ '}
                      {new Date(s.currentPeriodEnd).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="p-3">
                      {s.cancelAtPeriodEnd ? (
                        <span className="text-xs text-red-600">예약됨</span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

// ============================================================
// 결제 내역 탭
// ============================================================

function PaymentsTab({
  onError,
  onSuccess,
}: {
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}): React.ReactElement {
  const [data, setData] = useState<PaginatedResult<PaymentItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [refunding, setRefunding] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tab: 'payments', page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/billing?${params}`);
      if (!res.ok) throw new Error();
      setData(await res.json() as PaginatedResult<PaymentItem>);
    } catch {
      onError('결제 내역 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, onError]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleRefund = async (paymentId: string): Promise<void> => {
    if (!confirm('환불을 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    setRefunding(paymentId);
    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, reason: '관리자 환불' }),
      });
      const result = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(result.error ?? '환불 실패');
      onSuccess('환불 처리가 완료되었습니다');
      await fetchData();
    } catch (err) {
      onError(err instanceof Error ? err.message : '환불 실패');
    } finally {
      setRefunding(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['', 'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'].map((s) => (
          <button
            key={s}
            type="button"
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => { setStatusFilter(s); setPage(1); }}
          >
            {s ? STATUS_LABELS[s] ?? s : '전체'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      ) : !data?.items.length ? (
        <p className="py-8 text-center text-gray-500">결제 내역이 없습니다</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="p-3 font-medium">조직</th>
                  <th className="p-3 font-medium">금액</th>
                  <th className="p-3 font-medium">상태</th>
                  <th className="p-3 font-medium">결제사</th>
                  <th className="p-3 font-medium">날짜</th>
                  <th className="p-3 font-medium">작업</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-700">{p.orgName}</td>
                    <td className="p-3 font-medium text-gray-900">{p.amount.toLocaleString()}원</td>
                    <td className="p-3"><StatusBadge status={p.status} /></td>
                    <td className="p-3 text-gray-500">{p.provider}</td>
                    <td className="p-3 text-gray-500 text-xs">
                      {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="p-3">
                      {p.status === 'COMPLETED' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={refunding !== null}
                          onClick={() => void handleRefund(p.id)}
                        >
                          {refunding === p.id ? '처리 중...' : '환불'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

// ============================================================
// 요금제 관리 탭
// ============================================================

interface PlanFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  quotaLimit: number;
  features: string[];
  generateLimit: number;
  deployLimit: number;
  exportEnabled: boolean;
  customDomainEnabled: boolean;
  analyticsEnabled: boolean;
  abTestEnabled: boolean;
  sortOrder: number;
  isActive: boolean;
}

function PlansTab({
  onError,
  onSuccess,
}: {
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}): React.ReactElement {
  const [plans, setPlans] = useState<PlanFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editing, setEditing] = useState<PlanFormData | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/plans');
      if (!res.ok) throw new Error();
      const data = await res.json() as { plans: PlanFormData[] };
      setPlans(data.plans);
    } catch {
      onError('요금제 목록 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  const savePlan = async (plan: PlanFormData): Promise<void> => {
    setSaving(plan.id);
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      });
      if (!res.ok) throw new Error();
      onSuccess(`${plan.name} 플랜이 저장되었습니다`);
      setEditing(null);
      await fetchPlans();
    } catch {
      onError('플랜 저장 실패');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl bg-gray-100" />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
              <span className={`text-xs font-medium ${plan.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {plan.isActive ? '활성' : '비활성'}
              </span>
            </div>
            <p className="mb-2 text-xs text-gray-500">{plan.description}</p>
            <div className="mb-3 text-xl font-bold text-gray-900">
              {plan.price === 0 ? '무료' : `${plan.price.toLocaleString()}원/월`}
            </div>
            <div className="mb-4 space-y-1 text-xs text-gray-500">
              <p>프로젝트: {plan.quotaLimit}개</p>
              <p>생성: {plan.generateLimit === -1 ? '무제한' : `${plan.generateLimit}회/월`}</p>
              <p>배포: {plan.deployLimit === -1 ? '무제한' : `${plan.deployLimit}개`}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setEditing({ ...plan })}
            >
              수정
            </Button>
          </div>
        ))}
      </div>

      {/* 플랜 편집 모달 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">{editing.name} 플랜 편집</h3>

            <div className="space-y-3">
              <Field label="ID (변경 불가)" value={editing.id} disabled />
              <Field label="이름" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Field label="설명" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} />
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="월 가격 (원)" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} />
                <NumberField label="연간 가격 (원/월)" value={editing.yearlyPrice} onChange={(v) => setEditing({ ...editing, yearlyPrice: v })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <NumberField label="프로젝트 한도" value={editing.quotaLimit} onChange={(v) => setEditing({ ...editing, quotaLimit: v })} />
                <NumberField label="생성 한도" value={editing.generateLimit} onChange={(v) => setEditing({ ...editing, generateLimit: v })} />
                <NumberField label="배포 한도" value={editing.deployLimit} onChange={(v) => setEditing({ ...editing, deployLimit: v })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CheckboxField label="내보내기" checked={editing.exportEnabled} onChange={(v) => setEditing({ ...editing, exportEnabled: v })} />
                <CheckboxField label="커스텀 도메인" checked={editing.customDomainEnabled} onChange={(v) => setEditing({ ...editing, customDomainEnabled: v })} />
                <CheckboxField label="분석" checked={editing.analyticsEnabled} onChange={(v) => setEditing({ ...editing, analyticsEnabled: v })} />
                <CheckboxField label="A/B 테스트" checked={editing.abTestEnabled} onChange={(v) => setEditing({ ...editing, abTestEnabled: v })} />
                <CheckboxField label="활성" checked={editing.isActive} onChange={(v) => setEditing({ ...editing, isActive: v })} />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(null)} disabled={saving !== null}>
                취소
              </Button>
              <Button className="flex-1" onClick={() => void savePlan(editing)} disabled={saving !== null}>
                {saving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 공통 서브 컴포넌트
// ============================================================

function StatCard({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}): React.ReactElement {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className={`mt-0.5 text-xs ${subColor ?? 'text-gray-400'}`}>{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }): React.ReactElement {
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {page} / {totalPages} 페이지
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          이전
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          다음
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}): React.ReactElement {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}): React.ReactElement {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}): React.ReactElement {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300"
      />
      {label}
    </label>
  );
}

// ============================================================
// 쿠폰 관리 탭
// ============================================================

const EMPTY_COUPON: CouponItem = {
  id: '',
  code: '',
  name: '',
  description: null,
  discountType: 'PERCENT',
  discountValue: 10,
  applicablePlans: [],
  minAmount: 0,
  maxUses: 0,
  maxUsesPerOrg: 1,
  usedCount: 0,
  startsAt: new Date().toISOString(),
  expiresAt: null,
  isActive: true,
  redemptionCount: 0,
  createdAt: '',
};

function CouponsTab({
  onError,
  onSuccess,
}: {
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}): React.ReactElement {
  const [data, setData] = useState<PaginatedResult<CouponItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<CouponItem | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons?page=${page}&limit=20`);
      if (!res.ok) throw new Error();
      setData(await res.json() as PaginatedResult<CouponItem>);
    } catch {
      onError('쿠폰 목록 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, [page, onError]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const saveCoupon = async (coupon: CouponItem): Promise<void> => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        applicablePlans: coupon.applicablePlans,
        minAmount: coupon.minAmount,
        maxUses: coupon.maxUses,
        maxUsesPerOrg: coupon.maxUsesPerOrg,
        startsAt: coupon.startsAt,
        expiresAt: coupon.expiresAt,
        isActive: coupon.isActive,
      };
      if (coupon.id) payload.id = coupon.id;

      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json() as { error?: string };
      if (!res.ok) throw new Error(result.error ?? '저장 실패');

      onSuccess(coupon.id ? '쿠폰이 수정되었습니다' : '쿠폰이 생성되었습니다');
      setEditing(null);
      await fetchData();
    } catch (err) {
      onError(err instanceof Error ? err.message : '쿠폰 저장 실패');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditing({ ...EMPTY_COUPON })}>
          쿠폰 추가
        </Button>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      ) : !data?.items.length ? (
        <p className="py-8 text-center text-gray-500">쿠폰이 없습니다</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="p-3 font-medium">코드</th>
                  <th className="p-3 font-medium">이름</th>
                  <th className="p-3 font-medium">할인</th>
                  <th className="p-3 font-medium">사용</th>
                  <th className="p-3 font-medium">상태</th>
                  <th className="p-3 font-medium">만료</th>
                  <th className="p-3 font-medium">작업</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-xs font-bold text-gray-900">{c.code}</td>
                    <td className="p-3 text-gray-700">{c.name}</td>
                    <td className="p-3 text-gray-900">
                      {c.discountType === 'PERCENT'
                        ? `${c.discountValue}%`
                        : `${c.discountValue.toLocaleString()}원`}
                    </td>
                    <td className="p-3 text-gray-500">
                      {c.redemptionCount}{c.maxUses > 0 ? `/${c.maxUses}` : ''}회
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${
                        c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {c.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-500">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('ko-KR') : '무제한'}
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm" onClick={() => setEditing({ ...c })}>
                        수정
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      {/* 쿠폰 편집 모달 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              {editing.id ? '쿠폰 수정' : '쿠폰 생성'}
            </h3>

            <div className="space-y-3">
              <Field
                label="쿠폰 코드"
                value={editing.code}
                onChange={(v) => setEditing({ ...editing, code: v.toUpperCase() })}
                disabled={!!editing.id}
              />
              <Field label="이름" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Field
                label="설명 (선택)"
                value={editing.description ?? ''}
                onChange={(v) => setEditing({ ...editing, description: v || null })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">할인 타입</label>
                  <select
                    value={editing.discountType}
                    onChange={(e) => setEditing({ ...editing, discountType: e.target.value as 'PERCENT' | 'FIXED' })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="PERCENT">퍼센트 (%)</option>
                    <option value="FIXED">정액 (원)</option>
                  </select>
                </div>
                <NumberField
                  label={editing.discountType === 'PERCENT' ? '할인율 (%)' : '할인액 (원)'}
                  value={editing.discountValue}
                  onChange={(v) => setEditing({ ...editing, discountValue: v })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <NumberField label="최소 금액" value={editing.minAmount} onChange={(v) => setEditing({ ...editing, minAmount: v })} />
                <NumberField label="최대 사용 (0=무제한)" value={editing.maxUses} onChange={(v) => setEditing({ ...editing, maxUses: v })} />
                <NumberField label="조직당 한도" value={editing.maxUsesPerOrg} onChange={(v) => setEditing({ ...editing, maxUsesPerOrg: v })} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">적용 플랜</label>
                <div className="flex gap-3">
                  {['FREE', 'PRO', 'BUSINESS'].map((p) => (
                    <label key={p} className="flex items-center gap-1.5 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={editing.applicablePlans.includes(p)}
                        onChange={(e) => {
                          const plans = e.target.checked
                            ? [...editing.applicablePlans, p]
                            : editing.applicablePlans.filter((x) => x !== p);
                          setEditing({ ...editing, applicablePlans: plans });
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">만료일 (선택)</label>
                  <input
                    type="date"
                    value={editing.expiresAt ? editing.expiresAt.slice(0, 10) : ''}
                    onChange={(e) => setEditing({
                      ...editing,
                      expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <CheckboxField
                    label="활성"
                    checked={editing.isActive}
                    onChange={(v) => setEditing({ ...editing, isActive: v })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(null)} disabled={saving}>
                취소
              </Button>
              <Button className="flex-1" onClick={() => void saveCoupon(editing)} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 매출 트렌드 탭
// ============================================================

function RevenueTrendTab(): React.ReactElement {
  const [data, setData] = useState<RevenueTrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch('/api/admin/billing?tab=revenue-trend')
      .then((r) => r.json())
      .then((d: RevenueTrendData) => {
        if (d?.monthly) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-80 animate-pulse rounded-xl bg-gray-100" />;
  }

  if (!data?.monthly.length) {
    return <p className="py-8 text-center text-gray-500">매출 데이터가 없습니다</p>;
  }

  const maxRevenue = Math.max(...data.monthly.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6">
      {/* 바 차트 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-6 text-base font-bold text-gray-900">월별 매출 추이 (최근 12개월)</h3>
        <div className="flex items-end gap-2" style={{ height: 240 }}>
          {data.monthly.map((m) => {
            const heightPct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={m.month} className="group flex flex-1 flex-col items-center">
                {/* 툴팁 */}
                <div className="mb-1 hidden text-center group-hover:block">
                  <span className="rounded bg-gray-800 px-2 py-1 text-xs text-white whitespace-nowrap">
                    {m.revenue.toLocaleString()}원 ({m.count}건)
                  </span>
                </div>
                {/* 바 */}
                <div
                  className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                  style={{ height: `${Math.max(heightPct, 2)}%`, minHeight: 4 }}
                />
                {/* 라벨 */}
                <span className="mt-2 text-[10px] text-gray-500">
                  {m.month.slice(5)}월
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
              <th className="p-3 font-medium">월</th>
              <th className="p-3 font-medium text-right">매출</th>
              <th className="p-3 font-medium text-right">건수</th>
            </tr>
          </thead>
          <tbody>
            {[...data.monthly].reverse().map((m) => (
              <tr key={m.month} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-3 text-gray-700">{m.month}</td>
                <td className="p-3 text-right font-medium text-gray-900">
                  {m.revenue.toLocaleString()}원
                </td>
                <td className="p-3 text-right text-gray-500">{m.count}건</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// 시스템 현황 탭
// ============================================================

function SystemTab(): React.ReactElement {
  const [data, setData] = useState<SystemStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch('/api/admin/billing?tab=system')
      .then((r) => r.json())
      .then((d: SystemStatsData) => {
        if (d && typeof d.totalUsers === 'number') setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="py-8 text-center text-gray-500">시스템 데이터를 불러올 수 없습니다</p>;
  }

  const deployRate = data.totalProjects > 0
    ? Math.round((data.deployedProjects / data.totalProjects) * 100)
    : 0;

  const abConcludeRate = data.totalABTests > 0
    ? Math.round((data.concludedABTests / data.totalABTests) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="전체 사용자" value={`${data.totalUsers.toLocaleString()}명`} />
        <StatCard label="전체 조직" value={`${data.totalOrgs.toLocaleString()}개`} />
        <StatCard
          label="프로젝트"
          value={`${data.totalProjects.toLocaleString()}개`}
          sub={`배포됨: ${data.deployedProjects} (${deployRate}%)`}
          subColor="text-blue-600"
        />
        <StatCard
          label="AI 생성"
          value={`${data.totalGenerations.toLocaleString()}회`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="A/B 테스트"
          value={`${data.totalABTests}개`}
          sub={`완료: ${data.concludedABTests} (${abConcludeRate}%)`}
          subColor="text-green-600"
        />
        <StatCard
          label="평균 전환율"
          value={`${data.avgConversionRate.toFixed(2)}%`}
          sub="방문 10회 이상 기준"
          subColor="text-gray-400"
        />
        <StatCard
          label="최근 진단"
          value={`${data.recentDiagnoses}건`}
          sub="최근 7일"
          subColor="text-gray-400"
        />
      </div>

      {/* 구독 상태 분포 */}
      {data.subscriptionBreakdown.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-base font-bold text-gray-900">구독 상태 분포</h3>
          <div className="flex gap-6">
            {data.subscriptionBreakdown.map((s) => (
              <div key={s.status} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{s.count}</div>
                <div className="mt-1">
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 사용자 관리 탭
// ============================================================

function UsersTab({ onError }: { onError: (msg: string) => void }): React.ReactElement {
  const [data, setData] = useState<PaginatedResult<UserItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tab: 'users', page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/billing?${params}`);
      if (!res.ok) throw new Error();
      setData(await res.json() as PaginatedResult<UserItem>);
    } catch {
      onError('사용자 목록 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, [page, search, onError]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSearch = (): void => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* 검색 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          placeholder="이메일 또는 이름으로 검색"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
        />
        <Button size="sm" onClick={handleSearch}>
          검색
        </Button>
        {search && (
          <Button variant="outline" size="sm" onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}>
            초기화
          </Button>
        )}
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      ) : !data?.items.length ? (
        <p className="py-8 text-center text-gray-500">
          {search ? `"${search}" 검색 결과가 없습니다` : '사용자가 없습니다'}
        </p>
      ) : (
        <>
          <div className="text-xs text-gray-500">
            총 {data.total.toLocaleString()}명
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="p-3 font-medium">이메일</th>
                  <th className="p-3 font-medium">이름</th>
                  <th className="p-3 font-medium">조직</th>
                  <th className="p-3 font-medium">플랜</th>
                  <th className="p-3 font-medium">권한</th>
                  <th className="p-3 font-medium">가입일</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-700">{u.email ?? '-'}</td>
                    <td className="p-3 text-gray-900 font-medium">{u.name ?? '-'}</td>
                    <td className="p-3 text-gray-500">{u.orgName ?? '-'}</td>
                    <td className="p-3">
                      {u.plan ? (
                        <span className="inline-flex rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                          {u.plan}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {u.isAdmin ? (
                        <span className="inline-flex rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700">
                          관리자
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">일반</span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

// ============================================================
// 크레딧 관리 탭
// ============================================================

function CreditsTab({
  onError,
  onSuccess,
}: {
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}): React.ReactElement {
  const [orgId, setOrgId] = useState('');
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<{ orgId: string; balance: number } | null>(null);

  const handleSubmit = async (): Promise<void> => {
    if (!orgId.trim()) {
      onError('조직 ID를 입력하세요');
      return;
    }
    if (amount === 0) {
      onError('크레딧 수량은 0이 아닌 값이어야 합니다');
      return;
    }
    if (!reason.trim()) {
      onError('사유를 입력하세요');
      return;
    }

    const action = amount > 0 ? '충전' : '차감';
    if (!confirm(`${orgId}에 ${Math.abs(amount)} 크레딧을 ${action}하시겠습니까?`)) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId: orgId.trim(), amount, reason: reason.trim() }),
      });
      const result = await res.json() as { success?: boolean; balance?: number; error?: string };
      if (!res.ok) throw new Error(result.error ?? '크레딧 조정 실패');

      onSuccess(`크레딧 ${action} 완료 — 잔액: ${result.balance ?? 0}`);
      setLastResult({ orgId: orgId.trim(), balance: result.balance ?? 0 });
      setAmount(0);
      setReason('');
    } catch (err) {
      onError(err instanceof Error ? err.message : '크레딧 조정 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-base font-bold text-gray-900">크레딧 수동 조정</h3>
        <p className="mb-4 text-xs text-gray-500">
          조직의 크레딧을 수동으로 충전하거나 차감합니다. 양수: 충전, 음수: 차감
        </p>

        <div className="space-y-3">
          <Field label="조직 ID" value={orgId} onChange={setOrgId} />
          <NumberField label="크레딧 수량 (양수=충전, 음수=차감)" value={amount} onChange={setAmount} />
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">사유</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="크레딧 조정 사유를 입력하세요"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-blue-400 focus:outline-none"
            />
          </div>

          <Button className="w-full" onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? '처리 중...' : amount >= 0 ? '크레딧 충전' : '크레딧 차감'}
          </Button>
        </div>
      </div>

      {lastResult && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">최근 조정 결과</p>
          <p className="mt-1 text-xs text-green-700">
            조직: {lastResult.orgId} — 잔액: {lastResult.balance} 크레딧
          </p>
        </div>
      )}
    </div>
  );
}
