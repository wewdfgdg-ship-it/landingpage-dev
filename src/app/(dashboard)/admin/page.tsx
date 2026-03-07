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

type Tab = 'overview' | 'subscriptions' | 'payments' | 'plans';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: '매출 개요' },
  { id: 'subscriptions', label: '구독 관리' },
  { id: 'payments', label: '결제 내역' },
  { id: 'plans', label: '요금제 관리' },
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
      {tab === 'plans' && <PlansTab onError={setError} onSuccess={setSuccess} />}
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
      .then((d: OverviewData) => setData(d))
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
