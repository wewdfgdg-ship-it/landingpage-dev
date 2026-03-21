'use client';

import { useEffect, useState, useCallback } from 'react';
import { LineChart } from './line-chart';
import { BarChart } from './bar-chart';
import { SectionHeatmap } from './section-heatmap';
import ABTestPanel from './ab-test-panel';

// ============================================================
// 타입
// ============================================================

interface DailyData {
  date: string;
  totalVisits: number;
  uniqueVisitors: number;
  totalConversions: number;
  conversionRate: number;
  avgScrollDepth: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

interface SectionData {
  sectionId: string;
  order: number;
  role: string;
  type: string;
  headline: string | null;
  totalImpressions: number;
  totalCtaClicks: number;
  avgDwellTime: number;
  avgExitRate: number;
}

interface DiagnosisData {
  id: string;
  type: string;
  severity: string;
  details: Record<string, unknown>;
  prescriptionLevel: number;
  prescription: Record<string, unknown>;
  applied: boolean;
  createdAt: string;
}

interface AnalyticsResponse {
  summary: {
    totalVisits: number;
    totalConversions: number;
    avgConversionRate: number;
    avgBounceRate: number;
    avgScrollDepth: number;
    avgTimeOnPage: number;
  };
  daily: DailyData[];
  sectionHeatmap: SectionData[];
  sourceTotals: Record<string, number>;
  deviceTotals: Record<string, number>;
  diagnoses: DiagnosisData[];
}

interface AnalyticsDashboardProps {
  projectId: string;
}

// ============================================================
// 상수
// ============================================================

const SEVERITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', label: '심각' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', label: '높음' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: '보통' },
  low: { bg: 'bg-green-50', text: 'text-green-700', label: '낮음' },
};

const DIAGNOSIS_LABELS: Record<string, string> = {
  hero_weak: '히어로 약화',
  section_dropout: '섹션 이탈',
  cta_ignored: 'CTA 무시',
  scroll_cliff: '스크롤 절벽',
  mobile_gap: '모바일 격차',
  bounce_high: '높은 이탈률',
  dwell_low: '낮은 체류시간',
};

const SOURCE_LABELS: Record<string, string> = {
  direct: '직접 유입',
  google: 'Google',
  naver: '네이버',
  social: '소셜 미디어',
  referral: '추천 링크',
  email: '이메일',
  paid: '유료 광고',
  other: '기타',
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: '모바일',
  desktop: '데스크톱',
  tablet: '태블릿',
};

const PERIOD_OPTIONS = [
  { value: 7, label: '7일' },
  { value: 14, label: '14일' },
  { value: 30, label: '30일' },
];

// ============================================================
// 컴포넌트
// ============================================================

export function AnalyticsDashboard({ projectId }: AnalyticsDashboardProps): React.ReactElement {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/projects/${projectId}/analytics?days=${days}`);
      if (!res.ok) throw new Error('분석 데이터 로딩 실패');
      const json = (await res.json()) as AnalyticsResponse;
      setData(json);
    } catch {
      setError('분석 데이터를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  }, [projectId, days]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16">
        <p className="text-gray-500">{error || '데이터 없음'}</p>
        <button
          onClick={fetchData}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const hasData = data.daily.length > 0;

  return (
    <div className="space-y-6">
      {/* 기간 선택 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">분석 대시보드</h2>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                days === opt.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <SummaryCard label="총 방문" value={data.summary.totalVisits.toLocaleString()} />
        <SummaryCard label="총 전환" value={data.summary.totalConversions.toLocaleString()} accent />
        <SummaryCard label="전환율" value={`${data.summary.avgConversionRate}%`} accent />
        <SummaryCard label="이탈률" value={`${data.summary.avgBounceRate}%`} warn={data.summary.avgBounceRate > 50} />
        <SummaryCard label="스크롤 깊이" value={`${data.summary.avgScrollDepth}%`} />
        <SummaryCard label="체류시간" value={formatSeconds(data.summary.avgTimeOnPage)} />
      </div>

      {hasData ? (
        <>
          {/* 전환율 차트 */}
          <ChartCard title="전환율 추이">
            <LineChart
              data={data.daily.map((d) => ({
                label: formatDate(d.date),
                value: d.conversionRate,
              }))}
              color="#2563eb"
              formatValue={(v) => `${Math.round(v * 100) / 100}`}
              unit="%"
            />
          </ChartCard>

          {/* 방문자 & 이탈률 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard title="일일 방문자">
              <LineChart
                data={data.daily.map((d) => ({
                  label: formatDate(d.date),
                  value: d.totalVisits,
                }))}
                color="#059669"
                formatValue={(v) => v.toLocaleString()}
              />
            </ChartCard>
            <ChartCard title="이탈률 추이">
              <LineChart
                data={data.daily.map((d) => ({
                  label: formatDate(d.date),
                  value: d.bounceRate,
                }))}
                color="#dc2626"
                formatValue={(v) => `${Math.round(v)}`}
                unit="%"
              />
            </ChartCard>
          </div>

          {/* 디바이스 & 유입원 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard title="디바이스 분포">
              {Object.keys(data.deviceTotals).length > 0 ? (
                <BarChart
                  data={Object.entries(data.deviceTotals).map(([key, val]) => ({
                    label: DEVICE_LABELS[key] ?? key,
                    value: val,
                  }))}
                  showPercent
                />
              ) : (
                <EmptyChart />
              )}
            </ChartCard>
            <ChartCard title="유입원 분석">
              {Object.keys(data.sourceTotals).length > 0 ? (
                <BarChart
                  data={Object.entries(data.sourceTotals)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([key, val]) => ({
                      label: SOURCE_LABELS[key] ?? key,
                      value: val,
                    }))}
                  showPercent
                />
              ) : (
                <EmptyChart />
              )}
            </ChartCard>
          </div>

          {/* 섹션별 히트맵 */}
          {data.sectionHeatmap.length > 0 && (
            <ChartCard title="섹션별 성과">
              <SectionHeatmap sections={data.sectionHeatmap} />
            </ChartCard>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-16">
          <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <p className="font-medium text-gray-500">아직 분석 데이터가 없습니다</p>
          <p className="text-sm text-gray-400">배포 후 방문자가 쌓이면 여기에 분석 결과가 표시됩니다</p>
        </div>
      )}

      {/* A/B 테스트 */}
      <ChartCard title="A/B 테스트">
        <ABTestPanel projectId={projectId} />
      </ChartCard>

      {/* 진단 로그 */}
      {data.diagnoses.length > 0 && (
        <ChartCard title="AI 진단 결과">
          <div className="space-y-2">
            {data.diagnoses.map((d) => {
              const style = SEVERITY_STYLES[d.severity] ?? SEVERITY_STYLES.low;
              return (
                <div
                  key={d.id}
                  className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${style.bg} border-transparent`}
                >
                  <span className={`mt-0.5 inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${style.text}`}>
                    {style.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {DIAGNOSIS_LABELS[d.type] ?? d.type}
                    </p>
                    {d.prescription && typeof d.prescription === 'object' && 'summary' in d.prescription && (
                      <p className="mt-0.5 text-xs text-gray-600">
                        {String((d.prescription as Record<string, unknown>).summary)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {d.applied && (
                      <span className="text-[10px] font-medium text-green-600">적용됨</span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(d.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      )}
    </div>
  );
}

// ============================================================
// 서브 컴포넌트
// ============================================================

function SummaryCard({
  label,
  value,
  accent = false,
  warn = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  warn?: boolean;
}): React.ReactElement {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${warn ? 'text-red-600' : accent ? 'text-blue-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart(): React.ReactElement {
  return (
    <div className="flex items-center justify-center py-8 text-sm text-gray-400">
      데이터가 충분하지 않습니다
    </div>
  );
}

// ============================================================
// 유틸
// ============================================================

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds}초`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}분 ${sec}초`;
}
