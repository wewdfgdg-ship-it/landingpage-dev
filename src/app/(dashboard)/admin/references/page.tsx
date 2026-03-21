'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';

// ============================================================
// 타입
// ============================================================

interface ReferenceItem {
  id: string;
  sectionType: string;
  industry: string;
  treatment: string;
  status: string;
  imageUrl: string;
  sourceUrl: string | null;
  createdAt: string;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
}

interface ApiResponse {
  items: ReferenceItem[];
  total: number;
  page: number;
  totalPages: number;
  stats: Stats;
}

interface CrawlJob {
  id: string;
  sectionType: string;
  industry: string;
  treatment: string;
  count: number;
  status: string;
  sourceSites: string[];
  keywords: string[];
  memo: string | null;
  collected: number;
  errorMsg: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

interface CrawlJobsResponse {
  items: CrawlJob[];
  total: number;
  page: number;
  totalPages: number;
  stats: {
    queued: number;
    running: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
}

interface MatrixCell {
  sectionType: string;
  industry: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

interface StatsResponse {
  matrix: MatrixCell[];
  treatments: { treatment: string; total: number; approved: number }[];
  overall: { total: number; approved: number; pending: number; rejected: number };
}

// ============================================================
// 라벨 매핑
// ============================================================

const SECTION_LABELS: Record<string, string> = {
  HEADER_BANNER: '헤더배너',
  KEY_FEATURES: '핵심특징',
  FEATURE_DETAIL_1: '특징1 상세',
  FEATURE_DETAIL_2: '특징2 상세',
  FEATURE_DETAIL_3: '특징3 상세',
  SPECS: '상세스펙',
  HOW_TO_USE: '사용법',
  TARGET_PERSONA: '타겟고객',
  BEFORE_AFTER: '비포애프터',
  LIFESTYLE: '라이프스타일',
  CERTIFICATION: '인증/수상',
  FAQ: 'FAQ',
  REVIEWS: '리뷰',
  SHIPPING: '배송안내',
  CTA: 'CTA',
  STATS_NUMBERS: '숫자로 보는 실적',
  COMPETITOR_COMPARE: '경쟁사 비교표',
  BRAND_STORY: '브랜드 스토리',
  PACKAGE_CONTENTS: '패키지 구성',
  PHOTO_REVIEWS: '포토리뷰',
  SNS_VIRAL: 'SNS 바이럴',
  BUNDLE_SET: '번들/세트 구성',
  LIMITED_OFFER: '한정특가 배너',
  REFUND_POLICY: '환불보장 정책',
  CUSTOMER_SERVICE: '고객센터 안내',
  PRICE_TABLE: '가격표',
};

const INDUSTRY_LABELS: Record<string, string> = {
  beauty: '뷰티/화장품',
  food: '식품/건강식품',
  fashion: '의류/패션',
  electronics: '전자기기/가전',
  furniture: '가구/인테리어',
  kids: '유아/키즈',
  pets: '반려동물',
  sports: '스포츠/아웃도어',
  saas: 'SaaS/소프트웨어',
  education: '교육/온라인강의',
  finance: '금융/보험',
  realestate: '부동산',
  travel: '여행/호텔',
  clinic: '병원/클리닉',
  legal: '법률/세무',
  enterprise: '기업솔루션',
  marketing: '마케팅/광고대행',
  consulting: '컨설팅',
};

const TREATMENT_LABELS: Record<string, string> = {
  photo: '사진',
  text: '텍스트',
  graphic: '그래픽',
  animation: '애니메이션',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중',
  APPROVED: '승인',
  REJECTED: '거절',
};

const CRAWL_STATUS_COLORS: Record<string, string> = {
  QUEUED: 'bg-gray-100 text-gray-700',
  RUNNING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-orange-100 text-orange-700',
};

const CRAWL_STATUS_LABELS: Record<string, string> = {
  QUEUED: '대기',
  RUNNING: '진행중',
  COMPLETED: '완료',
  FAILED: '실패',
  CANCELLED: '취소',
};

const SECTION_KEYS = Object.keys(SECTION_LABELS);
const INDUSTRY_KEYS = Object.keys(INDUSTRY_LABELS);
const TREATMENT_KEYS = Object.keys(TREATMENT_LABELS);

// 추천 소스 사이트 (기본 제안용)
const DEFAULT_SITES = [
  'smartstore.naver.com',
  'coupang.com',
  'kakaocommerce.com',
  'wadiz.kr',
  'tumblbug.com',
  'idus.com',
  'ohou.se',
  'musinsa.com',
  'oliveyoung.co.kr',
  'kurly.com',
];

// ============================================================
// 멀티셀렉트 칩 드롭다운
// ============================================================

interface MultiSelectProps {
  label: string;
  options: { key: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allSelected = selected.length === options.length;
  const noneSelected = selected.length === 0;

  const toggleAll = (): void => {
    onChange(allSelected ? [] : options.map((o) => o.key));
  };

  const toggle = (key: string): void => {
    onChange(
      selected.includes(key)
        ? selected.filter((s) => s !== key)
        : [...selected, key],
    );
  };

  // 표시 텍스트
  const displayText = noneSelected
    ? `전체 (${options.length}개)`
    : selected.length <= 3
      ? selected.map((k) => options.find((o) => o.key === k)?.label ?? k).join(', ')
      : `${selected.length}개 선택`;

  return (
    <div ref={ref} className="relative">
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm hover:border-gray-300"
      >
        <span className={noneSelected ? 'text-blue-600 font-medium' : 'text-gray-900'}>{displayText}</span>
        <svg className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 선택된 칩들 */}
      {!noneSelected && selected.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {selected.map((key) => {
            const opt = options.find((o) => o.key === key);
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
              >
                {opt?.label ?? key}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggle(key); }}
                  className="ml-0.5 text-blue-400 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* 드롭다운 */}
      {open && (
        <div className="absolute left-0 z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
          {/* 전체 토글 */}
          <label className="flex cursor-pointer items-center gap-2 border-b px-3 py-2 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm font-medium text-blue-600">전체 ({options.length}개)</span>
          </label>
          {options.map((opt) => (
            <label key={opt.key} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selected.includes(opt.key)}
                onChange={() => toggle(opt.key)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 탭 타입
// ============================================================
type TabType = 'dashboard' | 'review' | 'crawl' | 'matrix' | 'keywords';

// ============================================================
// 메인 컴포넌트
// ============================================================

export default function ReferencesPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'dashboard', label: '대시보드' },
    { id: 'review', label: '심사 (O/X)' },
    { id: 'crawl', label: '크롤링 요청' },
    { id: 'matrix', label: '수집 현황' },
    { id: 'keywords', label: '키워드 설정' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">섹션 레퍼런스 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          26섹션 × 18업종 × 4트리트먼트 — 수집 · 심사 · 분석
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 rounded-xl border bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'review' && <ReviewTab />}
      {activeTab === 'crawl' && <CrawlTab />}
      {activeTab === 'matrix' && <MatrixTab />}
      {activeTab === 'keywords' && <KeywordsTab />}
    </div>
  );
}

// ============================================================
// 1. 대시보드 탭
// ============================================================

function DashboardTab(): React.ReactElement {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/references/stats')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: StatsResponse) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-400">불러오는 중...</div>;
  if (!stats?.overall) return <div className="py-20 text-center text-red-500">통계 로드 실패 — 관리자 권한을 확인하세요</div>;

  const { overall, treatments } = stats;
  const approvalRate = overall.total > 0 ? Math.round((overall.approved / overall.total) * 100) : 0;

  // 섹션별 통계
  const sectionStats = SECTION_KEYS.map((sk) => {
    const cells = stats.matrix.filter((m) => m.sectionType === sk);
    const total = cells.reduce((a, c) => a + c.total, 0);
    const approved = cells.reduce((a, c) => a + c.approved, 0);
    const pending = cells.reduce((a, c) => a + c.pending, 0);
    return { key: sk, label: SECTION_LABELS[sk] ?? sk, total, approved, pending };
  });

  // 업종별 통계
  const industryStats = INDUSTRY_KEYS.map((ik) => {
    const cells = stats.matrix.filter((m) => m.industry === ik);
    const total = cells.reduce((a, c) => a + c.total, 0);
    const approved = cells.reduce((a, c) => a + c.approved, 0);
    return { key: ik, label: INDUSTRY_LABELS[ik] ?? ik, total, approved };
  });

  return (
    <div className="space-y-6">
      {/* 전체 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="전체 수집" value={overall.total} color="text-gray-900" />
        <StatCard label="승인됨" value={overall.approved} color="text-green-600" />
        <StatCard label="심사 대기" value={overall.pending} color="text-yellow-600" />
        <StatCard label="승인율" value={`${approvalRate}%`} color="text-blue-600" />
      </div>

      {/* 트리트먼트별 */}
      <div className="rounded-xl border bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">트리트먼트별 현황</h3>
        <div className="grid grid-cols-4 gap-3">
          {treatments.map((t) => (
            <div key={t.treatment} className="rounded-lg border p-3 text-center">
              <div className="text-xs text-gray-500">{TREATMENT_LABELS[t.treatment] ?? t.treatment}</div>
              <div className="mt-1 text-lg font-bold">{t.approved}</div>
              <div className="text-xs text-gray-400">/ {t.total} 수집</div>
            </div>
          ))}
        </div>
      </div>

      {/* 섹션별 수집 현황 바 */}
      <div className="rounded-xl border bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">섹션별 수집 현황 (승인/전체)</h3>
        <div className="space-y-2">
          {sectionStats.map((s) => {
            const maxTotal = Math.max(...sectionStats.map((x) => x.total), 1);
            const barWidth = (s.total / maxTotal) * 100;
            const approvedWidth = s.total > 0 ? (s.approved / s.total) * 100 : 0;
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className="w-28 shrink-0 truncate text-xs text-gray-600">{s.label}</div>
                <div className="relative h-5 flex-1 overflow-hidden rounded bg-gray-100">
                  <div
                    className="absolute inset-y-0 left-0 rounded bg-gray-200"
                    style={{ width: `${barWidth}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded bg-green-400"
                    style={{ width: `${barWidth * approvedWidth / 100}%` }}
                  />
                </div>
                <div className="w-16 shrink-0 text-right text-xs text-gray-500">
                  {s.approved}/{s.total}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 업종별 현황 */}
      <div className="rounded-xl border bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">업종별 수집 현황</h3>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {industryStats.map((ind) => (
            <div key={ind.key} className="rounded-lg border p-2 text-center">
              <div className="truncate text-xs text-gray-500">{ind.label}</div>
              <div className="text-sm font-bold">{ind.approved}<span className="text-xs font-normal text-gray-400">/{ind.total}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }): React.ReactElement {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

// ============================================================
// 2. 심사 탭 (기존 O/X 기능 강화)
// ============================================================

function ReviewTab(): React.ReactElement {
  const [items, setItems] = useState<ReferenceItem[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<ReferenceItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // 필터
  const [sectionType, setSectionType] = useState('');
  const [industry, setIndustry] = useState('');
  const [treatment, setTreatment] = useState('');
  const [status, setStatus] = useState('PENDING');

  useEffect(() => {
    let cancelled = false;
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (sectionType) params.set('sectionType', sectionType);
      if (industry) params.set('industry', industry);
      if (treatment) params.set('treatment', treatment);
      if (status) params.set('status', status);
      params.set('page', String(page));
      params.set('limit', '30');

      try {
        const res = await fetch(`/api/admin/references?${params.toString()}`);
        if (cancelled) return;
        if (!res.ok) {
          const errData = await res.json().catch(() => ({})) as { error?: string };
          setError(errData.error ?? `API 오류 (${res.status})`);
          setLoading(false);
          return;
        }
        const data: ApiResponse = await res.json();
        if (cancelled) return;
        setItems(data.items);
        setStats(data.stats);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch {
        if (!cancelled) setError('네트워크 오류');
      }
      if (!cancelled) setLoading(false);
    };
    void fetchData();
    return () => { cancelled = true; };
  }, [sectionType, industry, treatment, status, page]);

  const handleJudge = async (id: string, judgment: 'APPROVED' | 'REJECTED'): Promise<void> => {
    await fetch('/api/admin/references', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: judgment }),
    });
    setItems((prev) => prev.filter((item) => item.id !== id));
    setStats((prev) => ({
      ...prev,
      pending: prev.pending - 1,
      [judgment === 'APPROVED' ? 'approved' : 'rejected']:
        prev[judgment === 'APPROVED' ? 'approved' : 'rejected'] + 1,
    }));
    // 이미지 모달 열려있으면 닫기
    if (selectedImage?.id === id) setSelectedImage(null);
  };

  return (
    <div className="space-y-4">
      {/* 통계 바 */}
      <div className="flex items-center gap-4 rounded-xl border bg-white px-4 py-3">
        <span className="text-sm text-gray-500">대기 <strong className="text-yellow-600">{stats.pending}</strong></span>
        <span className="text-sm text-gray-500">승인 <strong className="text-green-600">{stats.approved}</strong></span>
        <span className="text-sm text-gray-500">거절 <strong className="text-red-600">{stats.rejected}</strong></span>
        <div className="flex-1" />
        <span className="text-xs text-gray-400">{total}개 결과</span>
        <Button size="sm" onClick={() => setShowUploadModal(true)}>+ 수동 추가</Button>
      </div>

      {/* 수동 추가 모달 */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploaded={() => {
            setShowUploadModal(false);
            setStatus('');
            setPage(1);
          }}
        />
      )}

      {/* 필터 */}
      <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4">
        <select value={sectionType} onChange={(e) => { setSectionType(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option value="">전체 섹션</option>
          {SECTION_KEYS.map((st) => <option key={st} value={st}>{SECTION_LABELS[st]}</option>)}
        </select>
        <select value={industry} onChange={(e) => { setIndustry(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option value="">전체 업종</option>
          {INDUSTRY_KEYS.map((ind) => <option key={ind} value={ind}>{INDUSTRY_LABELS[ind]}</option>)}
        </select>
        <select value={treatment} onChange={(e) => { setTreatment(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option value="">전체 트리트먼트</option>
          {TREATMENT_KEYS.map((tr) => <option key={tr} value={tr}>{TREATMENT_LABELS[tr]}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option value="">전체 상태</option>
          <option value="PENDING">대기중</option>
          <option value="APPROVED">승인</option>
          <option value="REJECTED">거절</option>
        </select>
        <Button size="sm" variant="outline" onClick={() => { setSectionType(''); setIndustry(''); setTreatment(''); setStatus('PENDING'); setPage(1); }}>
          초기화
        </Button>
      </div>

      {/* 그리드 */}
      {error ? (
        <div className="py-20 text-center text-red-500">{error}</div>
      ) : loading ? (
        <div className="py-20 text-center text-gray-400">불러오는 중...</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-gray-400">레퍼런스가 없습니다</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-xl border bg-white">
                {/* 이미지 (클릭하면 확대) */}
                <button
                  type="button"
                  className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100"
                  onClick={() => setSelectedImage(item)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={`${SECTION_LABELS[item.sectionType] ?? item.sectionType}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </button>

                {/* 정보 */}
                <div className="space-y-2 p-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
                      {SECTION_LABELS[item.sectionType] ?? item.sectionType}
                    </span>
                    <span className="rounded bg-purple-50 px-1.5 py-0.5 text-xs text-purple-700">
                      {INDUSTRY_LABELS[item.industry] ?? item.industry}
                    </span>
                    <span className="rounded bg-orange-50 px-1.5 py-0.5 text-xs text-orange-700">
                      {TREATMENT_LABELS[item.treatment] ?? item.treatment}
                    </span>
                  </div>

                  {item.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-green-300 text-green-700 hover:bg-green-50" onClick={() => void handleJudge(item.id, 'APPROVED')}>
                        O
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50" onClick={() => void handleJudge(item.id, 'REJECTED')}>
                        X
                      </Button>
                    </div>
                  )}

                  {item.sourceUrl && (
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-xs text-gray-400 hover:text-gray-600">
                      {item.sourceUrl}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>이전</Button>
              <span className="text-sm text-gray-500">{page} / {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>다음</Button>
            </div>
          )}
        </>
      )}

      {/* 이미지 확대 모달 */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelectedImage(null)}>
          <div className="relative max-h-[90vh] max-w-3xl overflow-auto rounded-2xl bg-white p-2" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage.imageUrl} alt="" className="max-h-[75vh] w-auto rounded-xl" />
            <div className="mt-3 flex items-center justify-between px-2 pb-2">
              <div className="flex gap-2">
                <span className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">{SECTION_LABELS[selectedImage.sectionType]}</span>
                <span className="rounded bg-purple-50 px-2 py-1 text-xs text-purple-700">{INDUSTRY_LABELS[selectedImage.industry]}</span>
                <span className="rounded bg-orange-50 px-2 py-1 text-xs text-orange-700">{TREATMENT_LABELS[selectedImage.treatment]}</span>
              </div>
              {selectedImage.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => void handleJudge(selectedImage.id, 'APPROVED')}>
                    O 승인
                  </Button>
                  <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => void handleJudge(selectedImage.id, 'REJECTED')}>
                    X 거절
                  </Button>
                </div>
              )}
            </div>
            {selectedImage.sourceUrl && (
              <a href={selectedImage.sourceUrl} target="_blank" rel="noopener noreferrer" className="block px-2 pb-2 text-xs text-gray-400 hover:text-blue-500">
                {selectedImage.sourceUrl}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 3. 크롤링 요청 탭
// ============================================================

function CrawlTab(): React.ReactElement {
  // 요청 폼
  const [selSections, setSelSections] = useState<string[]>([]);   // [] = 전체
  const [selIndustries, setSelIndustries] = useState<string[]>([]);
  const [selTreatments, setSelTreatments] = useState<string[]>([]);
  const [formCount, setFormCount] = useState(10);
  const [formSites, setFormSites] = useState<string[]>([]);
  const [formKeywords, setFormKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [formMemo, setFormMemo] = useState('');

  // 키워드 프리셋
  const [keywordPresets, setKeywordPresets] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  // 작업 목록
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [jobStats, setJobStats] = useState({ queued: 0, running: 0, completed: 0, failed: 0, cancelled: 0 });
  const [jobFilter, setJobFilter] = useState('');
  const [jobPage, setJobPage] = useState(1);
  const [jobTotalPages, setJobTotalPages] = useState(1);
  const [jobsLoading, setJobsLoading] = useState(true);

  // 실제 요청할 조합 계산 (빈 배열 = 전체)
  const sections = selSections.length > 0 ? selSections : SECTION_KEYS;
  const industries = selIndustries.length > 0 ? selIndustries : INDUSTRY_KEYS;
  const treatments = selTreatments.length > 0 ? selTreatments : TREATMENT_KEYS;
  const totalJobs = sections.length * industries.length * treatments.length;

  // MultiSelect용 옵션
  const sectionOptions = SECTION_KEYS.map((k) => ({ key: k, label: SECTION_LABELS[k] ?? k }));
  const industryOptions = INDUSTRY_KEYS.map((k) => ({ key: k, label: INDUSTRY_LABELS[k] ?? k }));
  const treatmentOptions = TREATMENT_KEYS.map((k) => ({ key: k, label: TREATMENT_LABELS[k] ?? k }));

  // 키워드 프리셋 로드
  useEffect(() => {
    fetch('/api/admin/references/keywords')
      .then((r) => r.json())
      .then((data: { presets?: Array<{ industry: string; keywords: string[] }> }) => {
        const map: Record<string, string[]> = {};
        for (const p of data.presets ?? []) {
          map[p.industry] = p.keywords;
        }
        setKeywordPresets(map);
      })
      .catch(() => { /* ignore */ });
  }, []);

  // 업종 선택 변경 시 키워드 프리셋 자동 적용
  const handleIndustriesChange = useCallback((selected: string[]): void => {
    setSelIndustries(selected);
    if (Object.keys(keywordPresets).length === 0) return;
    if (selected.length === 0) {
      setFormKeywords([]);
      return;
    }
    const merged = new Set<string>();
    for (const ind of selected) {
      for (const kw of keywordPresets[ind] ?? []) {
        merged.add(kw);
      }
    }
    setFormKeywords([...merged]);
  }, [keywordPresets]);

  const fetchJobs = useCallback(async (): Promise<void> => {
    setJobsLoading(true);
    const params = new URLSearchParams();
    if (jobFilter) params.set('status', jobFilter);
    params.set('page', String(jobPage));
    try {
      const res = await fetch(`/api/admin/crawl-jobs?${params.toString()}`);
      const data: CrawlJobsResponse = await res.json();
      setJobs(data.items);
      setJobStats(data.stats);
      setJobTotalPages(data.totalPages);
    } catch { /* ignore */ }
    setJobsLoading(false);
  }, [jobFilter, jobPage]);

  useEffect(() => {
    let cancelled = false;
    const load = async (): Promise<void> => {
      setJobsLoading(true);
      const params = new URLSearchParams();
      if (jobFilter) params.set('status', jobFilter);
      params.set('page', String(jobPage));
      try {
        const res = await fetch(`/api/admin/crawl-jobs?${params.toString()}`);
        const data: CrawlJobsResponse = await res.json();
        if (cancelled) return;
        setJobs(data.items);
        setJobStats(data.stats);
        setJobTotalPages(data.totalPages);
      } catch { /* ignore */ }
      if (!cancelled) setJobsLoading(false);
    };
    void load();
    return () => { cancelled = true; };
  }, [jobFilter, jobPage]);

  const handleSubmit = async (): Promise<void> => {
    setSubmitting(true);
    setSubmitMsg('');
    let count = 0;
    let lastError = '';
    try {
      for (const sec of sections) {
        for (const ind of industries) {
          for (const tr of treatments) {
            const res = await fetch('/api/admin/crawl-jobs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sectionType: sec,
                industry: ind,
                treatment: tr,
                count: formCount,
                sourceSites: formSites.length > 0 ? formSites : undefined,
                keywords: formKeywords.length > 0 ? formKeywords : undefined,
                memo: formMemo || undefined,
              }),
            });
            if (res.ok) {
              count++;
            } else {
              const err = await res.json() as { error?: string };
              lastError = err.error ?? '알 수 없는 오류';
            }
          }
        }
      }
      if (count > 0) {
        setSubmitMsg(`${count}건 요청 등록 완료${lastError ? ` (일부 오류: ${lastError})` : ''}`);
      } else {
        setSubmitMsg(`오류: ${lastError}`);
      }
      void fetchJobs();
    } catch {
      setSubmitMsg('네트워크 오류');
    }
    setSubmitting(false);
  };

  const handleCancel = async (id: string): Promise<void> => {
    await fetch('/api/admin/crawl-jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'CANCELLED' }),
    });
    void fetchJobs();
  };

  const [siteInput, setSiteInput] = useState('');

  const addSite = (site: string): void => {
    const trimmed = site.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
    if (trimmed && !formSites.includes(trimmed)) {
      setFormSites((prev) => [...prev, trimmed]);
    }
    setSiteInput('');
  };

  const removeSite = (site: string): void => {
    setFormSites((prev) => prev.filter((s) => s !== site));
  };

  const toggleSuggestedSite = (site: string): void => {
    if (formSites.includes(site)) {
      removeSite(site);
    } else {
      setFormSites((prev) => [...prev, site]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 요청 폼 */}
      <div className="rounded-xl border bg-white p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900">크롤링 요청</h3>
          <p className="mt-0.5 text-xs text-gray-400">&quot;전체&quot; 선택 시 해당 항목의 모든 조합으로 일괄 요청됩니다</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <MultiSelect label="섹션 타입" options={sectionOptions} selected={selSections} onChange={setSelSections} />
          <MultiSelect label="업종" options={industryOptions} selected={selIndustries} onChange={handleIndustriesChange} />
          <MultiSelect label="트리트먼트" options={treatmentOptions} selected={selTreatments} onChange={setSelTreatments} />
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">수량 (장)</label>
            <input
              type="number"
              min={1}
              max={50}
              value={formCount}
              onChange={(e) => setFormCount(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* 고급 옵션 */}
        <div className="mt-4 space-y-3">
            {/* 소스 사이트 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">소스 사이트</label>

              {/* 직접 입력 */}
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={siteInput}
                  onChange={(e) => setSiteInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSite(siteInput); } }}
                  placeholder="사이트 주소 입력 (예: brand.com)"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                />
                <Button size="sm" variant="outline" onClick={() => addSite(siteInput)} disabled={!siteInput.trim()}>
                  추가
                </Button>
              </div>

              {/* 선택된 사이트 칩 (삭제 가능) */}
              {formSites.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {formSites.map((site) => (
                    <span key={site} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700 ring-1 ring-blue-200">
                      {site}
                      <button type="button" onClick={() => removeSite(site)} className="ml-0.5 text-blue-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                  <button type="button" onClick={() => setFormSites([])} className="text-xs text-gray-400 hover:text-red-500">전체 삭제</button>
                </div>
              )}

              {/* 추천 사이트 (빠른 추가) */}
              <div className="flex flex-wrap gap-1.5">
                <span className="self-center text-xs text-gray-400">추천:</span>
                {DEFAULT_SITES.filter((s) => !formSites.includes(s)).map((site) => (
                  <button
                    key={site}
                    type="button"
                    onClick={() => toggleSuggestedSite(site)}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    + {site}
                  </button>
                ))}
                {DEFAULT_SITES.filter((s) => !formSites.includes(s)).length === 0 && (
                  <span className="text-xs text-gray-300">모두 추가됨</span>
                )}
              </div>
            </div>

            {/* 키워드 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                검색 키워드
                {selIndustries.length > 0 && formKeywords.length > 0 && (
                  <span className="ml-1.5 font-normal text-blue-500">프리셋 자동 적용됨</span>
                )}
              </label>

              {/* 키워드 칩 */}
              {formKeywords.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {formKeywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs text-violet-700 ring-1 ring-violet-200">
                      {kw}
                      <button
                        type="button"
                        onClick={() => setFormKeywords((prev) => prev.filter((k) => k !== kw))}
                        className="ml-0.5 text-violet-400 hover:text-red-500"
                      >×</button>
                    </span>
                  ))}
                  <button type="button" onClick={() => setFormKeywords([])} className="text-xs text-gray-400 hover:text-red-500">전체 삭제</button>
                </div>
              )}

              {/* 키워드 직접 입력 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const trimmed = keywordInput.trim();
                      if (trimmed && !formKeywords.includes(trimmed)) {
                        setFormKeywords((prev) => [...prev, trimmed]);
                      }
                      setKeywordInput('');
                    }
                  }}
                  placeholder="키워드 직접 입력 후 Enter"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const trimmed = keywordInput.trim();
                    if (trimmed && !formKeywords.includes(trimmed)) {
                      setFormKeywords((prev) => [...prev, trimmed]);
                    }
                    setKeywordInput('');
                  }}
                  disabled={!keywordInput.trim()}
                >
                  추가
                </Button>
              </div>
            </div>

            {/* 메모 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">메모 (선택)</label>
              <input
                type="text"
                value={formMemo}
                onChange={(e) => setFormMemo(e.target.value)}
                placeholder="관리자 메모"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

        {/* 제출 */}
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? '요청 중...' : totalJobs === 1 ? '크롤링 요청' : `일괄 요청 (${totalJobs}건)`}
          </Button>
          {totalJobs > 1 && (
            <span className="text-xs text-gray-400">
              {sections.length}섹션 × {industries.length}업종 × {treatments.length}트리트먼트
            </span>
          )}
          {submitMsg && (
            <span className={`text-sm ${submitMsg.startsWith('오류') ? 'text-red-500' : 'text-green-600'}`}>
              {submitMsg}
            </span>
          )}
        </div>
      </div>

      {/* 작업 목록 */}
      <div className="rounded-xl border bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">크롤링 작업 목록</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>대기 <strong>{jobStats.queued}</strong></span>
            <span>진행 <strong className="text-blue-600">{jobStats.running}</strong></span>
            <span>완료 <strong className="text-green-600">{jobStats.completed}</strong></span>
            <span>실패 <strong className="text-red-600">{jobStats.failed}</strong></span>
          </div>
        </div>

        {/* 필터 */}
        <div className="mb-3 flex gap-2">
          {['', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'].map((f) => (
            <button
              key={f}
              onClick={() => { setJobFilter(f); setJobPage(1); }}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                jobFilter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f === '' ? '전체' : CRAWL_STATUS_LABELS[f] ?? f}
            </button>
          ))}
        </div>

        {/* 테이블 */}
        {jobsLoading ? (
          <div className="py-10 text-center text-gray-400">불러오는 중...</div>
        ) : jobs.length === 0 ? (
          <div className="py-10 text-center text-gray-400">작업이 없습니다</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-gray-500">
                  <th className="pb-2 font-medium">섹션</th>
                  <th className="pb-2 font-medium">업종</th>
                  <th className="pb-2 font-medium">트리트먼트</th>
                  <th className="pb-2 font-medium">수집/요청</th>
                  <th className="pb-2 font-medium">상태</th>
                  <th className="pb-2 font-medium">키워드</th>
                  <th className="pb-2 font-medium">생성일</th>
                  <th className="pb-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-2.5 text-xs">{SECTION_LABELS[job.sectionType] ?? job.sectionType}</td>
                    <td className="py-2.5 text-xs">{INDUSTRY_LABELS[job.industry] ?? job.industry}</td>
                    <td className="py-2.5 text-xs">{TREATMENT_LABELS[job.treatment] ?? job.treatment}</td>
                    <td className="py-2.5 text-xs font-medium">{job.collected}/{job.count}</td>
                    <td className="py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CRAWL_STATUS_COLORS[job.status]}`}>
                        {CRAWL_STATUS_LABELS[job.status] ?? job.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-xs text-gray-400">
                      {job.keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {job.keywords.slice(0, 3).map((kw) => (
                            <span key={kw} className="rounded bg-violet-50 px-1.5 py-0.5 text-violet-600">{kw}</span>
                          ))}
                          {job.keywords.length > 3 && <span className="text-gray-300">+{job.keywords.length - 3}</span>}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-2.5 text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td className="py-2.5">
                      {(job.status === 'QUEUED' || job.status === 'RUNNING') && (
                        <button onClick={() => void handleCancel(job.id)} className="text-xs text-red-500 hover:text-red-700">취소</button>
                      )}
                      {job.errorMsg && (
                        <span className="text-xs text-red-400" title={job.errorMsg}>오류</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {jobTotalPages > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <Button size="sm" variant="outline" disabled={jobPage <= 1} onClick={() => setJobPage((p) => p - 1)}>이전</Button>
            <span className="text-sm text-gray-500">{jobPage} / {jobTotalPages}</span>
            <Button size="sm" variant="outline" disabled={jobPage >= jobTotalPages} onClick={() => setJobPage((p) => p + 1)}>다음</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 4. 수집 현황 매트릭스 탭
// ============================================================

function MatrixTab(): React.ReactElement {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'approved' | 'total' | 'pending'>('approved');

  useEffect(() => {
    fetch('/api/admin/references/stats')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: StatsResponse) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-400">불러오는 중...</div>;
  if (!stats?.matrix) return <div className="py-20 text-center text-red-500">통계 로드 실패 — 관리자 권한을 확인하세요</div>;

  const getCell = (section: string, industry: string): MatrixCell | undefined => {
    return stats.matrix.find((m) => m.sectionType === section && m.industry === industry);
  };

  const getValue = (cell: MatrixCell | undefined): number => {
    if (!cell) return 0;
    if (viewMode === 'approved') return cell.approved;
    if (viewMode === 'pending') return cell.pending;
    return cell.total;
  };

  const getCellColor = (val: number): string => {
    if (val === 0) return 'bg-gray-50 text-gray-300';
    if (val < 3) return 'bg-red-50 text-red-600';
    if (val < 5) return 'bg-yellow-50 text-yellow-600';
    if (val < 10) return 'bg-blue-50 text-blue-600';
    return 'bg-green-50 text-green-700 font-semibold';
  };

  // 섹션별 합계
  const sectionTotals = SECTION_KEYS.map((sk) => {
    return INDUSTRY_KEYS.reduce((sum, ik) => sum + getValue(getCell(sk, ik)), 0);
  });

  // 업종별 합계
  const industryTotals = INDUSTRY_KEYS.map((ik) => {
    return SECTION_KEYS.reduce((sum, sk) => sum + getValue(getCell(sk, ik)), 0);
  });

  return (
    <div className="space-y-4">
      {/* 뷰모드 토글 */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">보기:</span>
        {[
          { id: 'approved' as const, label: '승인됨', color: 'bg-green-100 text-green-700' },
          { id: 'total' as const, label: '전체', color: 'bg-gray-100 text-gray-700' },
          { id: 'pending' as const, label: '대기중', color: 'bg-yellow-100 text-yellow-700' },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              viewMode === mode.id ? mode.color + ' ring-1 ring-current' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}
          >
            {mode.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex gap-2 text-xs text-gray-400">
          <span className="rounded bg-red-50 px-1.5 py-0.5 text-red-500">0~2</span>
          <span className="rounded bg-yellow-50 px-1.5 py-0.5 text-yellow-600">3~4</span>
          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-600">5~9</span>
          <span className="rounded bg-green-50 px-1.5 py-0.5 text-green-700">10+</span>
        </div>
      </div>

      {/* 매트릭스 테이블 */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-center text-xs">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="sticky left-0 z-10 bg-gray-50 px-2 py-2 text-left font-medium text-gray-600">섹션 \ 업종</th>
              {INDUSTRY_KEYS.map((ik) => (
                <th key={ik} className="px-1 py-2 font-medium text-gray-500" title={INDUSTRY_LABELS[ik]}>
                  <div className="w-10 truncate">{INDUSTRY_LABELS[ik]?.split('/')[0]}</div>
                </th>
              ))}
              <th className="border-l px-2 py-2 font-semibold text-gray-700">합계</th>
            </tr>
          </thead>
          <tbody>
            {SECTION_KEYS.map((sk, si) => (
              <tr key={sk} className="border-b border-gray-50 hover:bg-gray-50/30">
                <td className="sticky left-0 z-10 bg-white px-2 py-1.5 text-left font-medium text-gray-600" title={SECTION_LABELS[sk]}>
                  <div className="w-24 truncate">{SECTION_LABELS[sk]}</div>
                </td>
                {INDUSTRY_KEYS.map((ik) => {
                  const cell = getCell(sk, ik);
                  const val = getValue(cell);
                  return (
                    <td key={ik} className="px-1 py-1.5">
                      <div className={`mx-auto flex h-7 w-9 items-center justify-center rounded text-xs ${getCellColor(val)}`}>
                        {val > 0 ? val : '·'}
                      </div>
                    </td>
                  );
                })}
                <td className="border-l px-2 py-1.5 font-semibold text-gray-700">{sectionTotals[si]}</td>
              </tr>
            ))}
            {/* 업종 합계 행 */}
            <tr className="border-t-2 bg-gray-50">
              <td className="sticky left-0 z-10 bg-gray-50 px-2 py-2 text-left font-semibold text-gray-700">합계</td>
              {INDUSTRY_KEYS.map((ik, ii) => (
                <td key={ik} className="px-1 py-2 font-semibold text-gray-700">{industryTotals[ii]}</td>
              ))}
              <td className="border-l px-2 py-2 font-bold text-gray-900">
                {sectionTotals.reduce((a, b) => a + b, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 범례 설명 */}
      <div className="rounded-xl border bg-white p-4 text-xs text-gray-500">
        <p>목표: 섹션당 업종별 최소 10장 승인 → 전체 {SECTION_KEYS.length} × {INDUSTRY_KEYS.length} = {SECTION_KEYS.length * INDUSTRY_KEYS.length}칸 모두 초록색</p>
        <p className="mt-1">현재 진행률: {stats.matrix.length > 0 ? Math.round((stats.matrix.filter((m) => m.approved >= 10).length / (SECTION_KEYS.length * INDUSTRY_KEYS.length)) * 100) : 0}% ({stats.matrix.filter((m) => m.approved >= 10).length}/{SECTION_KEYS.length * INDUSTRY_KEYS.length})</p>
      </div>
    </div>
  );
}

// ============================================================
// 5. 키워드 설정 탭
// ============================================================

interface KeywordPreset {
  industry: string;
  keywords: string[];
}

function KeywordsTab(): React.ReactElement {
  const [presets, setPresets] = useState<KeywordPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null); // 저장중인 업종
  const [editingIndustry, setEditingIndustry] = useState<string | null>(null);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchPresets = async (): Promise<void> => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/references/keywords');
        const data = await res.json() as { presets: KeywordPreset[] };
        if (cancelled) return;
        const map = new Map(data.presets.map((p) => [p.industry, p.keywords]));
        const all = INDUSTRY_KEYS.map((k) => ({
          industry: k,
          keywords: map.get(k) ?? [],
        }));
        setPresets(all);
      } catch { /* ignore */ }
      if (!cancelled) setLoading(false);
    };
    void fetchPresets();
    return () => { cancelled = true; };
  }, []);

  const saveKeywords = async (industry: string, keywords: string[]): Promise<void> => {
    setSaving(industry);
    try {
      await fetch('/api/admin/references/keywords', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, keywords }),
      });
      setPresets((prev) =>
        prev.map((p) => (p.industry === industry ? { ...p, keywords } : p)),
      );
    } catch { /* ignore */ }
    setSaving(null);
  };

  const addKeyword = (industry: string): void => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;
    const preset = presets.find((p) => p.industry === industry);
    if (!preset) return;
    if (preset.keywords.includes(trimmed)) {
      setNewKeyword('');
      return;
    }
    const updated = [...preset.keywords, trimmed];
    setPresets((prev) =>
      prev.map((p) => (p.industry === industry ? { ...p, keywords: updated } : p)),
    );
    setNewKeyword('');
    void saveKeywords(industry, updated);
  };

  const removeKeyword = (industry: string, keyword: string): void => {
    const preset = presets.find((p) => p.industry === industry);
    if (!preset) return;
    const updated = preset.keywords.filter((k) => k !== keyword);
    setPresets((prev) =>
      prev.map((p) => (p.industry === industry ? { ...p, keywords: updated } : p)),
    );
    void saveKeywords(industry, updated);
  };

  if (loading) return <div className="py-20 text-center text-gray-400">불러오는 중...</div>;

  const totalKeywords = presets.reduce((sum, p) => sum + p.keywords.length, 0);
  const emptyCount = presets.filter((p) => p.keywords.length === 0).length;

  return (
    <div className="space-y-4">
      {/* 요약 */}
      <div className="flex items-center gap-4 rounded-xl border bg-white px-4 py-3">
        <span className="text-sm text-gray-500">전체 업종 <strong className="text-gray-900">{presets.length}</strong></span>
        <span className="text-sm text-gray-500">총 키워드 <strong className="text-blue-600">{totalKeywords}</strong></span>
        {emptyCount > 0 && (
          <span className="text-sm text-gray-500">미설정 <strong className="text-red-500">{emptyCount}</strong></span>
        )}
        <div className="flex-1" />
        <span className="text-xs text-gray-400">크롤링 시 업종에 맞는 키워드가 자동 적용됩니다</span>
      </div>

      {/* 업종별 키워드 카드 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {presets.map((preset) => {
          const isEditing = editingIndustry === preset.industry;
          const isSaving = saving === preset.industry;

          return (
            <div
              key={preset.industry}
              className={`rounded-xl border bg-white p-4 transition-shadow ${
                isEditing ? 'ring-2 ring-blue-300 shadow-md' : 'hover:shadow-sm'
              }`}
            >
              {/* 헤더 */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {INDUSTRY_LABELS[preset.industry] ?? preset.industry}
                  </h4>
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                    {preset.keywords.length}개
                  </span>
                  {isSaving && <span className="text-xs text-blue-500">저장중...</span>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingIndustry(isEditing ? null : preset.industry);
                    setNewKeyword('');
                  }}
                  className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                    isEditing
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  }`}
                >
                  {isEditing ? '완료' : '편집'}
                </button>
              </div>

              {/* 키워드 칩 */}
              <div className="flex flex-wrap gap-1.5">
                {preset.keywords.length === 0 ? (
                  <span className="text-xs text-gray-300">키워드 없음</span>
                ) : (
                  preset.keywords.map((kw) => (
                    <span
                      key={kw}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                        isEditing
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {kw}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeKeyword(preset.industry, kw)}
                          className="ml-0.5 text-blue-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>

              {/* 편집 모드: 키워드 추가 입력 */}
              {isEditing && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword(preset.industry);
                      }
                    }}
                    placeholder="키워드 입력 후 Enter"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addKeyword(preset.industry)}
                    disabled={!newKeyword.trim()}
                  >
                    추가
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 안내 */}
      <div className="rounded-xl border bg-white p-4 text-xs text-gray-500">
        <p>각 업종의 키워드는 크롤링 요청 시 해당 업종에 자동으로 적용됩니다.</p>
        <p className="mt-1">&quot;편집&quot; 버튼을 눌러 키워드를 추가/삭제할 수 있습니다. 변경 사항은 즉시 저장됩니다.</p>
      </div>
    </div>
  );
}

// ============================================================
// 수동 업로드 모달
// ============================================================

function UploadModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }): React.ReactElement {
  const [uploadSectionType, setUploadSectionType] = useState(SECTION_KEYS[0]);
  const [uploadIndustry, setUploadIndustry] = useState(INDUSTRY_KEYS[0]);
  const [uploadTreatment, setUploadTreatment] = useState(TREATMENT_KEYS[0]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selected = e.target.files;
    if (!selected) return;
    const imageFiles = Array.from(selected).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...imageFiles]);
  };

  const removeFile = (idx: number): void => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async (): Promise<void> => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`${i + 1}/${files.length} 업로드 중...`);

        // 1. FormData로 서버 경유 업로드 + DB 등록
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sectionType', uploadSectionType);
        formData.append('industry', uploadIndustry);
        formData.append('treatment', uploadTreatment);
        if (sourceUrl) formData.append('sourceUrl', sourceUrl);

        const createRes = await fetch('/api/admin/references/upload', {
          method: 'POST',
          body: formData,
        });
        if (!createRes.ok) {
          const err = await createRes.json().catch(() => ({})) as { error?: string };
          throw new Error(err.error ?? 'DB 등록 실패');
        }
      }

      setUploadProgress('');
      onUploaded();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : '업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-bold text-gray-900">레퍼런스 수동 추가</h3>

        <div className="space-y-4">
          {/* 섹션 타입 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">섹션 타입</label>
            <select value={uploadSectionType} onChange={(e) => setUploadSectionType(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              {SECTION_KEYS.map((st) => <option key={st} value={st}>{SECTION_LABELS[st]}</option>)}
            </select>
          </div>

          {/* 업종 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">업종</label>
            <select value={uploadIndustry} onChange={(e) => setUploadIndustry(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              {INDUSTRY_KEYS.map((ind) => <option key={ind} value={ind}>{INDUSTRY_LABELS[ind]}</option>)}
            </select>
          </div>

          {/* 트리트먼트 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">트리트먼트</label>
            <select value={uploadTreatment} onChange={(e) => setUploadTreatment(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              {TREATMENT_KEYS.map((tr) => <option key={tr} value={tr}>{TREATMENT_LABELS[tr]}</option>)}
            </select>
          </div>

          {/* 출처 URL (선택) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">출처 URL <span className="text-gray-400">(선택)</span></label>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          {/* 파일 선택 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">이미지 파일</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-500"
            >
              클릭하여 이미지 선택 (여러 장 가능)
            </button>

            {/* 선택된 파일 목록 */}
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <div key={`${f.name}-${i}`} className="flex items-center justify-between rounded bg-gray-50 px-3 py-1.5 text-sm">
                    <span className="truncate text-gray-700">{f.name} <span className="text-gray-400">({(f.size / 1024).toFixed(0)}KB)</span></span>
                    <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 에러 */}
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

          {/* 진행 상황 */}
          {uploadProgress && <p className="text-sm text-blue-500">{uploadProgress}</p>}

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={uploading} className="flex-1">취소</Button>
            <Button onClick={() => void handleUpload()} disabled={uploading || files.length === 0} className="flex-1">
              {uploading ? '업로드 중...' : `${files.length}개 업로드`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
