'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';

// ============================================================
// 프로젝트 목록 페이지
// ============================================================

interface ProjectItem {
  id: string;
  name: string;
  slug: string | null;
  status: string;
  inputScore: number | null;
  isDeployed: boolean;
  createdAt: string;
  updatedAt: string;
}

type StatusFilter = 'ALL' | 'DRAFT' | 'GENERATING' | 'GENERATED' | 'EDITING' | 'DEPLOYED' | 'ARCHIVED';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT: { label: '초안', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  GENERATING: { label: '생성 중', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  GENERATED: { label: '생성 완료', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  EDITING: { label: '편집 중', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  DEPLOYED: { label: '배포됨', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  ARCHIVED: { label: '보관됨', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-300' },
};

const FILTER_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'DRAFT', label: '초안' },
  { key: 'GENERATED', label: '생성 완료' },
  { key: 'DEPLOYED', label: '배포됨' },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return formatDate(iso);
}

function StatusBadge({ status }: { status: string }): React.ReactElement {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function ProjectCard({ project }: { project: ProjectItem }): React.ReactElement {
  const hasScore = project.inputScore !== null && project.inputScore > 0;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-gray-700">
            {project.name}
          </h3>
          {project.slug && project.isDeployed && (
            <p className="mt-0.5 truncate text-xs text-gray-400">
              /p/{project.slug}
            </p>
          )}
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{formatRelative(project.updatedAt)}</span>
        <div className="flex items-center gap-3">
          {hasScore && (
            <span className="flex items-center gap-1">
              <svg className="size-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {project.inputScore}점
            </span>
          )}
          <span>{formatDate(project.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage(): React.ReactElement {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('ALL');

  const fetchProjects = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/projects');
      if (!res.ok) {
        throw new Error('프로젝트 목록을 불러올 수 없습니다');
      }
      const data = await res.json() as { projects: ProjectItem[] };
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const filtered = filter === 'ALL'
    ? projects
    : projects.filter((p) => p.status === filter);

  const statusCounts = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <ErrorState
          title="프로젝트 로드 실패"
          message={error}
          onRetry={() => void fetchProjects()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로젝트</h1>
          <p className="mt-1 text-sm text-gray-500">
            AI 마케팅 엔진으로 랜딩페이지를 생성하세요
          </p>
        </div>
        <Button size="lg" onClick={() => router.push('/projects/new')}>
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          새 프로젝트
        </Button>
      </div>

      {/* 필터 탭 */}
      {projects.length > 0 && (
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {FILTER_TABS.map((tab) => {
            const count = tab.key === 'ALL' ? projects.length : (statusCounts[tab.key] ?? 0);
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 프로젝트 목록 */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-200 py-20">
          <div className="flex size-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">아직 프로젝트가 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">
              AI 마케팅 엔진으로 첫 번째 랜딩페이지를 만들어보세요
            </p>
          </div>
          <Button size="lg" onClick={() => router.push('/projects/new')}>
            첫 프로젝트 만들기
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-16">
          <p className="text-sm text-gray-500">
            해당 상태의 프로젝트가 없습니다
          </p>
          <button
            onClick={() => setFilter('ALL')}
            className="text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600"
          >
            전체 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
