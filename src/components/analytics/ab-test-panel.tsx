'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================================
// A/B 테스트 관리 패널
// - 활성 테스트 현황 (진행률, 조기종료 가능 여부, 승률)
// - 테스트 생성/종료 액션
// - 종료된 테스트 이력
// ============================================================

interface ActiveTest {
  testId: string;
  status: string;
  controlRate: number;
  variantRate: number;
  confidence: number;
  sampleSize: { control: number; variant: number };
  minSampleSize: number;
  fractionComplete: number;
  canStopEarly: boolean;
  estimatedDaysLeft: number | null;
  avgDailyVisitors: number;
  startedAt: string;
}

interface ConcludedTest {
  testId: string;
  status: string;
  controlRate: number | null;
  variantRate: number | null;
  winner: string | null;
  confidence: number | null;
  concludedAt: string | null;
  startedAt: string;
}

interface ABTestData {
  active: ActiveTest[];
  concluded: ConcludedTest[];
}

interface Props {
  projectId: string;
}

export default function ABTestPanel({ projectId }: Props): React.ReactElement {
  const [data, setData] = useState<ABTestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [concluding, setConcluding] = useState<string | null>(null);

  const fetchTests = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`/api/projects/${projectId}/ab-test`);
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleCreate = async (): Promise<void> => {
    setCreating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/ab-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trafficSplit: 50 }),
      });
      if (res.ok) {
        await fetchTests();
      }
    } finally {
      setCreating(false);
    }
  };

  const handleConclude = async (testId: string): Promise<void> => {
    setConcluding(testId);
    try {
      const res = await fetch(`/api/projects/${projectId}/ab-test`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId }),
      });
      if (res.ok) {
        await fetchTests();
      }
    } finally {
      setConcluding(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="h-32 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  const hasActive = data?.active && data.active.length > 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">A/B 테스트</h3>
        {!hasActive && (
          <button
            onClick={handleCreate}
            disabled={creating}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? '생성 중...' : '새 테스트 시작'}
          </button>
        )}
      </div>

      {/* 활성 테스트 */}
      {hasActive && data.active.map((test) => (
        <ActiveTestCard
          key={test.testId}
          test={test}
          onConclude={handleConclude}
          concluding={concluding === test.testId}
        />
      ))}

      {/* 활성 테스트 없음 */}
      {!hasActive && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">
            진행 중인 A/B 테스트가 없습니다.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            새 테스트를 시작하면 방문자에게 다른 버전을 보여주고 전환율을 비교합니다.
          </p>
        </div>
      )}

      {/* 종료된 테스트 이력 */}
      {data?.concluded && data.concluded.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">종료된 테스트</h4>
          <div className="space-y-2">
            {data.concluded.map((test) => (
              <ConcludedTestRow key={test.testId} test={test} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 활성 테스트 카드
// ============================================================

function ActiveTestCard({
  test,
  onConclude,
  concluding,
}: {
  test: ActiveTest;
  onConclude: (id: string) => Promise<void>;
  concluding: boolean;
}): React.ReactElement {
  const controlTotal = test.sampleSize.control;
  const variantTotal = test.sampleSize.variant;
  const progressPercent = Math.round(test.fractionComplete * 100);
  const confidencePercent = Math.round(test.confidence * 100);

  const controlWinning = test.controlRate >= test.variantRate;
  const diff = Math.abs(test.variantRate - test.controlRate);

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-6">
      {/* 상단 뱃지 */}
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          진행 중
        </span>
        {test.canStopEarly && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            조기 종료 가능
          </span>
        )}
        <span className="ml-auto text-xs text-gray-500">
          시작: {new Date(test.startedAt).toLocaleDateString('ko-KR')}
        </span>
      </div>

      {/* 진행률 바 */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-gray-600">
          <span>진행률</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* 대결 현황 */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className={`rounded-lg p-4 ${controlWinning ? 'bg-green-50 ring-2 ring-green-200' : 'bg-white'}`}>
          <p className="text-xs font-medium text-gray-500">원본 (Control)</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {test.controlRate.toFixed(2)}%
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {controlTotal.toLocaleString()}명 방문
          </p>
        </div>
        <div className={`rounded-lg p-4 ${!controlWinning ? 'bg-green-50 ring-2 ring-green-200' : 'bg-white'}`}>
          <p className="text-xs font-medium text-gray-500">변형 (Variant)</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {test.variantRate.toFixed(2)}%
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {variantTotal.toLocaleString()}명 방문
          </p>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-gray-500">차이</p>
          <p className="text-sm font-semibold text-gray-900">
            {diff > 0 ? (controlWinning ? '-' : '+') : ''}{diff.toFixed(2)}%p
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">신뢰도</p>
          <p className={`text-sm font-semibold ${confidencePercent >= 95 ? 'text-green-600' : confidencePercent >= 80 ? 'text-yellow-600' : 'text-gray-900'}`}>
            {confidencePercent}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">예상 남은 기간</p>
          <p className="text-sm font-semibold text-gray-900">
            {test.estimatedDaysLeft != null ? `${test.estimatedDaysLeft}일` : '-'}
          </p>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onConclude(test.testId)}
          disabled={concluding}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            test.canStopEarly
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } disabled:opacity-50`}
        >
          {concluding ? '종료 중...' : test.canStopEarly ? '승자 확정' : '수동 종료'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 종료된 테스트 행
// ============================================================

function ConcludedTestRow({ test }: { test: ConcludedTest }): React.ReactElement {
  const winnerLabel = test.winner === 'variant' ? '변형 승리' : test.winner === 'control' ? '원본 유지' : '무승부';
  const winnerColor = test.winner === 'variant' ? 'text-green-600 bg-green-50' : test.winner === 'control' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 bg-gray-50';

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${winnerColor}`}>
          {winnerLabel}
        </span>
        <span className="text-sm text-gray-600">
          원본 {test.controlRate?.toFixed(1) ?? '-'}% vs 변형 {test.variantRate?.toFixed(1) ?? '-'}%
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>신뢰도 {test.confidence != null ? `${Math.round(test.confidence)}%` : '-'}</span>
        <span>{test.concludedAt ? new Date(test.concludedAt).toLocaleDateString('ko-KR') : '-'}</span>
      </div>
    </div>
  );
}
