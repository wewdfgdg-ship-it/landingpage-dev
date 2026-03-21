'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { ExportPanel } from '@/components/export/export-panel';
import { SectionSelector } from '@/components/manual-mode/SectionSelector';
import type { SectionKey } from '@/engine/sections/types';

interface Project {
  id: string;
  name: string;
  slug: string | null;
  status: string;
  inputScore: number | null;
  isDeployed: boolean;
  createdAt: string;
  updatedAt: string;
  productBrief: Record<string, unknown> | null;
  generatedHtml: string | null;
}

type TabId = 'overview' | 'preview' | 'engines' | 'analytics' | 'export';
type GenerateMode = 'auto' | 'manual' | null;

interface ProgressStep {
  id: string;
  label: string;
  emoji: string;
  status: 'pending' | 'running' | 'done';
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: '초안', color: 'bg-gray-100 text-gray-700' },
  GENERATING: { label: '생성 중', color: 'bg-blue-100 text-blue-700' },
  GENERATED: { label: '생성 완료', color: 'bg-green-100 text-green-700' },
  EDITING: { label: '편집 중', color: 'bg-yellow-100 text-yellow-700' },
  DEPLOYED: { label: '배포됨', color: 'bg-purple-100 text-purple-700' },
  ARCHIVED: { label: '보관됨', color: 'bg-gray-100 text-gray-500' },
};

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: '개요' },
  { id: 'preview', label: '미리보기' },
  { id: 'engines', label: '엔진 데이터' },
  { id: 'analytics', label: '분석' },
  { id: 'export', label: '내보내기' },
];

export default function ProjectDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [generateMode, setGenerateMode] = useState<GenerateMode>(null);

  const fetchProject = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('프로젝트 로딩 실패');
      const data = (await res.json()) as { project: Project };
      setProject(data.project);
    } catch {
      setError('프로젝트를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    void fetchProject();
  }, [fetchProject]);

  const readSSEStream = useCallback(async (response: Response): Promise<void> => {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('스트림을 열 수 없습니다');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      let eventType = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith('data: ') && eventType) {
          try {
            const data = JSON.parse(line.slice(6)) as Record<string, unknown>;

            if (eventType === 'progress') {
              const stepId = data.step as string;
              const status = data.status as 'start' | 'done';
              const label = data.label as string;
              const emoji = data.emoji as string;
              const percent = data.percent as number;

              setProgressPercent(percent);
              setProgressSteps((prev) => {
                const existing = prev.find((s) => s.id === stepId);
                if (existing) {
                  return prev.map((s) =>
                    s.id === stepId
                      ? { ...s, status: status === 'done' ? 'done' : 'running' }
                      : s,
                  );
                }
                return [...prev, { id: stepId, label, emoji, status: status === 'done' ? 'done' : 'running' }];
              });
            } else if (eventType === 'complete') {
              await fetchProject();
              setActiveTab('preview');
            } else if (eventType === 'error') {
              throw new Error(data.message as string);
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
              throw parseErr;
            }
          }
          eventType = '';
        }
      }
    }
  }, [fetchProject]);

  const handleGenerate = async (): Promise<void> => {
    setGenerating(true);
    setError('');
    setProgressSteps([]);
    setProgressPercent(0);

    try {
      const res = await fetch(`/api/projects/${id}/generate-stream`, { method: 'POST' });
      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error);
      }
      await readSSEStream(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성 실패');
    } finally {
      setGenerating(false);
    }
  };

  const handleManualGenerate = async (
    sections: { sectionKey: SectionKey; order: number }[],
  ): Promise<void> => {
    setGenerating(true);
    setError('');
    setProgressSteps([]);
    setProgressPercent(0);

    try {
      const res = await fetch(`/api/projects/${id}/generate-manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error);
      }
      await readSSEStream(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성 실패');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeploy = async (): Promise<void> => {
    setDeploying(true);
    try {
      const res = await fetch(`/api/projects/${id}/deploy`, { method: 'POST' });
      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error);
      }
      await fetchProject();
    } catch (err) {
      setError(err instanceof Error ? err.message : '배포 실패');
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!project) {
    return (
      <ErrorState
        message={error || '프로젝트를 찾을 수 없습니다'}
        onRetry={() => {
          setError('');
          setLoading(true);
          void fetchProject();
        }}
      />
    );
  }

  const statusInfo = STATUS_LABELS[project.status] ?? STATUS_LABELS.DRAFT;
  const hasGenerated = project.status === 'GENERATED' || project.status === 'DEPLOYED';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 에러 배너 */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setError('')}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              닫기
            </button>
            <button
              onClick={async () => {
                setError('');
                await fetchProject();
                void handleGenerate();
              }}
              className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            품질 점수: {project.inputScore ?? 0}점 · 생성일:{' '}
            {new Date(project.createdAt).toLocaleDateString('ko-KR')}
            {project.slug && project.isDeployed && (
              <> · <a href={`/p/${project.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">배포 페이지 보기 ↗</a></>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/projects')}>
            목록
          </Button>
          {hasGenerated && (
            <Button variant="outline" onClick={() => router.push(`/projects/${id}/editor`)}>
              에디터
            </Button>
          )}
          {hasGenerated && !project.isDeployed && (
            <Button onClick={handleDeploy} disabled={deploying}>
              {deploying ? '배포 중...' : '배포하기'}
            </Button>
          )}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === 'overview' && (
        <>
          {(project.status === 'GENERATING' || generating) && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              {/* 프로그레스 바 */}
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-700">
                    {progressSteps.length > 0
                      ? `${progressSteps.find((s) => s.status === 'running')?.emoji ?? '⏳'} ${progressSteps.find((s) => s.status === 'running')?.label ?? '준비 중'}...`
                      : 'AI가 제품을 분석하고 있습니다...'}
                  </p>
                  <span className="text-xs font-medium text-blue-600">{progressPercent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 단계 목록 */}
              {progressSteps.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
                  {progressSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                        step.status === 'done'
                          ? 'bg-green-50 text-green-700'
                          : step.status === 'running'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <span>{step.status === 'done' ? '✅' : step.status === 'running' ? '🔄' : '⏳'}</span>
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {hasGenerated && project.productBrief && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">상태</p>
                <p className="mt-1 text-lg font-bold text-green-600">생성 완료</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">배포</p>
                <p className="mt-1 text-lg font-bold">{project.isDeployed ? '배포됨' : '미배포'}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">입력 품질</p>
                <p className="mt-1 text-lg font-bold">{project.inputScore ?? 0}점</p>
              </div>
            </div>
          )}

          {(project.status === 'DRAFT' || project.status === 'GENERATED') && !generating && generateMode === null && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {project.status === 'GENERATED' ? '페이지 재생성' : '랜딩페이지 생성 방식 선택'}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* 자동 모드 카드 */}
                <button
                  type="button"
                  onClick={() => {
                    setGenerateMode('auto');
                    void handleGenerate();
                  }}
                  className="group rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-blue-400 hover:shadow-md"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl group-hover:bg-blue-100">
                    🤖
                  </div>
                  <h3 className="text-base font-bold text-gray-900">AI 자동 생성</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    AI가 제품을 분석하고 최적의 섹션 구성, 카피, 디자인을 자동으로 결정합니다
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">전략 분석</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">섹션 자동 배치</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">10단계 파이프라인</span>
                  </div>
                </button>

                {/* 수동 모드 카드 */}
                <button
                  type="button"
                  onClick={() => setGenerateMode('manual')}
                  className="group rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-purple-400 hover:shadow-md"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-2xl group-hover:bg-purple-100">
                    🎯
                  </div>
                  <h3 className="text-base font-bold text-gray-900">수동 섹션 선택</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    26개 섹션 중 원하는 것만 골라 순서를 지정하세요. AI가 카피와 디자인을 생성합니다
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">섹션 직접 선택</span>
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">순서 커스텀</span>
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">7단계 파이프라인</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 수동 모드: 섹션 선택기 */}
          {generateMode === 'manual' && !generating && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">섹션 선택</h2>
                <Button variant="outline" size="sm" onClick={() => setGenerateMode(null)}>
                  ← 모드 선택으로
                </Button>
              </div>
              <SectionSelector
                projectId={id}
                onGenerate={handleManualGenerate}
                isGenerating={generating}
              />
            </div>
          )}
        </>
      )}

      {activeTab === 'preview' && (
        <div className="space-y-4">
          {hasGenerated ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      previewDevice === 'desktop'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    데스크톱
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      previewDevice === 'mobile'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    모바일
                  </button>
                </div>
                <a
                  href={`/api/projects/${id}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  새 탭에서 열기 ↗
                </a>
              </div>

              <div className="flex justify-center rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div
                  className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg transition-all"
                  style={{
                    width: previewDevice === 'mobile' ? '375px' : '100%',
                    maxWidth: '100%',
                  }}
                >
                  <iframe
                    src={`/api/projects/${id}/preview`}
                    className="h-[700px] w-full"
                    title="페이지 미리보기"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 py-16">
              <p className="text-gray-500">먼저 AI 분석을 실행하세요</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'engines' && (
        <div className="space-y-4">
          {project.productBrief ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">Product Intelligence 분석 결과</h3>
              <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap text-sm text-gray-700">
                {JSON.stringify(project.productBrief, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 py-16">
              <p className="text-gray-500">엔진 데이터가 없습니다</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <AnalyticsDashboard projectId={id} />
      )}

      {activeTab === 'export' && (
        <ExportPanel
          projectId={id}
          hasGenerated={hasGenerated}
          isDeployed={project.isDeployed}
          slug={project.slug}
        />
      )}
    </div>
  );
}
