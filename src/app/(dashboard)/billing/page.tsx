'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

// ============================================================
// 타입
// ============================================================

interface PlanInfo {
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
}

interface UsageInfo {
  plan: string;
  planName: string;
  projectCount: number;
  quotaLimit: number;
  monthlyGenerateCount: number;
  generateLimit: number;
  deployCount: number;
  deployLimit: number;
}

interface SubscriptionInfo {
  id: string;
  plan: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelReason: string | null;
}

interface PaymentInfo {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
}

interface BillingData {
  usage: UsageInfo;
  subscription: SubscriptionInfo | null;
  payments: PaymentInfo[];
  plans: PlanInfo[];
}

// ============================================================
// 상수
// ============================================================

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: '활성', color: 'bg-green-100 text-green-700' },
  PAST_DUE: { label: '연체', color: 'bg-red-100 text-red-700' },
  GRACE_PERIOD: { label: '유예 기간', color: 'bg-yellow-100 text-yellow-700' },
  CANCELLED: { label: '해지됨', color: 'bg-gray-100 text-gray-500' },
};

const PAYMENT_STATUS: Record<string, string> = {
  COMPLETED: '완료',
  PENDING: '대기',
  FAILED: '실패',
  REFUNDED: '환불',
};

// ============================================================
// 페이지
// ============================================================

export default function BillingPage(): React.ReactElement {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 결제 모달 상태
  const [payModal, setPayModal] = useState<{ planId: string; planName: string; price: number; yearlyPrice: number } | null>(null);
  const [phone, setPhone] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const fetchBilling = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch('/api/billing');
      if (!res.ok) throw new Error('결제 정보 로딩 실패');
      const json = (await res.json()) as BillingData;
      setData(json);
    } catch {
      setError('결제 정보를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBilling();
  }, [fetchBilling]);

  const handlePlanChange = (planId: string, planConfig?: PlanInfo): void => {
    // 유료 플랜 → 결제 모달 열기
    if (planConfig && planConfig.price > 0) {
      setPayModal({
        planId: planConfig.id,
        planName: planConfig.name,
        price: planConfig.price,
        yearlyPrice: planConfig.yearlyPrice,
      });
      return;
    }

    // 무료 전환 → 해지 사유 모달
    if (planId === 'FREE') {
      setCancelModal(true);
    }
  };

  const submitPayment = async (): Promise<void> => {
    if (!payModal) return;
    if (!phone.trim()) {
      setError('결제 수신 휴대폰 번호를 입력하세요');
      return;
    }

    setChanging(payModal.planId);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: payModal.planId,
          phone: phone.replace(/-/g, ''),
          billingCycle,
        }),
      });

      const result = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
        pending?: boolean;
        payUrl?: string;
      };

      if (!res.ok) throw new Error(result.error ?? '결제 요청 실패');

      if (result.payUrl) {
        window.open(result.payUrl, '_blank');
      }

      setSuccess(result.message ?? '결제 요청이 전송되었습니다.');
      setPayModal(null);
      setPhone('');
      await fetchBilling();
    } catch (err) {
      setError(err instanceof Error ? err.message : '결제 요청 실패');
    } finally {
      setChanging(null);
    }
  };

  const submitCancel = async (): Promise<void> => {
    setChanging('FREE');
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'FREE', cancelReason: cancelReason || '사용자 요청' }),
      });

      const result = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (!res.ok) throw new Error(result.error ?? '해지 실패');

      setSuccess(result.message ?? '해지가 예약되었습니다.');
      setCancelModal(false);
      setCancelReason('');
      await fetchBilling();
    } catch (err) {
      setError(err instanceof Error ? err.message : '해지 실패');
    } finally {
      setChanging(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">결제</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900">결제</h1>
        <p className="mt-4 text-gray-500">{error || '데이터를 불러올 수 없습니다'}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">결제</h1>

      {/* 상태 메시지 */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      {/* 현재 사용량 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">현재 플랜: {data.usage.planName}</h2>
          {data.subscription && (
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_LABELS[data.subscription.status]?.color ?? 'bg-gray-100 text-gray-500'}`}>
              {STATUS_LABELS[data.subscription.status]?.label ?? data.subscription.status}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UsageMeter label="프로젝트" current={data.usage.projectCount} limit={data.usage.quotaLimit} />
          <UsageMeter label="이번 달 생성" current={data.usage.monthlyGenerateCount} limit={data.usage.generateLimit} />
          <UsageMeter label="배포" current={data.usage.deployCount} limit={data.usage.deployLimit} />
        </div>

        {data.subscription?.cancelAtPeriodEnd && (
          <div className="mt-4 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
            구독이 {new Date(data.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}에 만료됩니다.
            {data.subscription.cancelReason && (
              <span className="ml-1 text-yellow-600">사유: {data.subscription.cancelReason}</span>
            )}
          </div>
        )}

        {data.subscription?.status === 'PAST_DUE' && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            결제가 연체 중입니다. 7일 이내 결제하지 않으면 유예 기간으로 전환됩니다.
          </div>
        )}

        {data.subscription?.status === 'GRACE_PERIOD' && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            유예 기간입니다. 14일 이내 결제하지 않으면 무료 플랜으로 강제 전환됩니다.
          </div>
        )}
      </div>

      {/* 플랜 선택 */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">플랜 선택</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.plans.map((plan) => {
            const isCurrent = data.usage.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-6 transition-colors ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-3 left-4 rounded-full bg-blue-500 px-3 py-0.5 text-xs font-medium text-white">
                    현재 플랜
                  </span>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{plan.description}</p>
                </div>

                <div className="mb-5">
                  {plan.price === 0 ? (
                    <p className="text-3xl font-black text-gray-900">무료</p>
                  ) : (
                    <>
                      <p className="text-3xl font-black text-gray-900">
                        {plan.price.toLocaleString()}
                        <span className="text-base font-normal text-gray-500">원/월</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        연간 결제 시 {plan.yearlyPrice.toLocaleString()}원/월
                      </p>
                    </>
                  )}
                </div>

                <ul className="mb-6 space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                  disabled={isCurrent || changing !== null}
                  onClick={() => handlePlanChange(plan.id, plan)}
                >
                  {changing === plan.id
                    ? '처리 중...'
                    : isCurrent
                      ? '사용 중'
                      : plan.price === 0
                        ? '무료로 전환'
                        : '업그레이드'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 결제 내역 */}
      {data.payments.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-gray-900">결제 내역</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="pb-2 font-medium">날짜</th>
                  <th className="pb-2 font-medium">금액</th>
                  <th className="pb-2 font-medium">상태</th>
                  <th className="pb-2 font-medium">결제사</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-2.5 text-gray-700">
                      {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="py-2.5 font-medium text-gray-900">
                      {p.amount.toLocaleString()}원
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${
                        p.status === 'COMPLETED' ? 'bg-green-100 text-green-700'
                          : p.status === 'FAILED' ? 'bg-red-100 text-red-700'
                            : p.status === 'REFUNDED' ? 'bg-yellow-100 text-yellow-700'
                              : p.status === 'PENDING' ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                      }`}>
                        {PAYMENT_STATUS[p.status] ?? p.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-500">{p.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 결제 모달 */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">{payModal.planName} 플랜 결제</h3>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">결제 주기</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    billingCycle === 'monthly'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  <div className="font-bold">{payModal.price.toLocaleString()}원/월</div>
                  <div className="text-xs text-gray-500">월간 정기결제</div>
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    billingCycle === 'yearly'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  <div className="font-bold">{(payModal.yearlyPrice * 12).toLocaleString()}원/년</div>
                  <div className="text-xs text-green-600">월 {payModal.yearlyPrice.toLocaleString()}원</div>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                결제 수신 휴대폰 번호
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                PayApp 결제 링크가 해당 번호로 전송됩니다
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">결제 금액</span>
                <span className="text-lg font-bold text-gray-900">
                  {(billingCycle === 'yearly'
                    ? payModal.yearlyPrice * 12
                    : payModal.price
                  ).toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setPayModal(null); setPhone(''); }}
                disabled={changing !== null}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={() => void submitPayment()}
                disabled={changing !== null}
              >
                {changing ? '처리 중...' : '결제하기'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 해지 사유 모달 */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">무료 플랜으로 전환</h3>
            <p className="mt-2 text-sm text-gray-500">
              현재 구독 기간이 끝나면 무료 플랜으로 전환됩니다.
              남은 기간 동안은 현재 플랜의 기능을 계속 사용할 수 있습니다.
            </p>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                해지 사유 (선택)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="서비스 개선에 참고하겠습니다"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setCancelModal(false); setCancelReason(''); }}
                disabled={changing !== null}
              >
                유지하기
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => void submitCancel()}
                disabled={changing !== null}
              >
                {changing ? '처리 중...' : '해지 예약'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 서브 컴포넌트
// ============================================================

function UsageMeter({
  label,
  current,
  limit,
}: {
  label: string;
  current: number;
  limit: number;
}): React.ReactElement {
  const isUnlimited = limit === -1;
  const percent = isUnlimited ? 0 : Math.min((current / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percent >= 80;

  return (
    <div className="rounded-lg border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <span className={`text-sm font-bold ${isNearLimit ? 'text-red-600' : 'text-gray-900'}`}>
          {current}{isUnlimited ? '' : `/${limit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${
              isNearLimit ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
      {isUnlimited && (
        <p className="mt-1 text-xs text-gray-400">무제한</p>
      )}
    </div>
  );
}
