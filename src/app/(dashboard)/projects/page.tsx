'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Rocket,
  Pencil,
  Loader2,
  FileText,
  Globe,
  Archive,
  Sparkles,
} from 'lucide-react';

import { useProjectStore } from '@/stores/project-store';
import type { ProjectStatus, ProjectSummary } from '@/stores/project-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';

// ============================================================
// 상태 뱃지 설정
// ============================================================

interface StatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  icon: React.ReactNode;
}

const STATUS_MAP: Record<ProjectStatus, StatusConfig> = {
  DRAFT: {
    label: '초안',
    variant: 'outline',
    icon: <FileText className="h-3 w-3" />,
  },
  GENERATING: {
    label: '생성 중',
    variant: 'default',
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  GENERATED: {
    label: '생성 완료',
    variant: 'secondary',
    icon: <Sparkles className="h-3 w-3" />,
  },
  EDITING: {
    label: '편집 중',
    variant: 'secondary',
    icon: <Pencil className="h-3 w-3" />,
  },
  DEPLOYED: {
    label: '배포됨',
    variant: 'default',
    icon: <Globe className="h-3 w-3" />,
  },
  ARCHIVED: {
    label: '보관됨',
    variant: 'outline',
    icon: <Archive className="h-3 w-3" />,
  },
};

const STATUS_OPTIONS: Array<{ value: ProjectStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'DRAFT', label: '초안' },
  { value: 'GENERATING', label: '생성 중' },
  { value: 'GENERATED', label: '생성 완료' },
  { value: 'EDITING', label: '편집 중' },
  { value: 'DEPLOYED', label: '배포됨' },
  { value: 'ARCHIVED', label: '보관됨' },
];

// ============================================================
// 상태 뱃지 컴포넌트
// ============================================================

function StatusBadge({ status }: { status: ProjectStatus }): React.ReactElement {
  const config = STATUS_MAP[status];
  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}

// ============================================================
// 날짜 포맷
// ============================================================

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}

// ============================================================
// 프로젝트 카드 컴포넌트
// ============================================================

function ProjectCard({
  project,
}: {
  project: ProjectSummary;
}): React.ReactElement {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="truncate">{project.name}</span>
            <StatusBadge status={project.status} />
          </CardTitle>
          <CardDescription>
            {formatRelativeDate(project.updatedAt)} 업데이트
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {project.inputScore !== null && (
              <span>입력 품질: {project.inputScore}점</span>
            )}
            {project.isDeployed && (
              <span className="flex items-center gap-1 text-green-600">
                <Rocket className="h-3.5 w-3.5" />
                배포 완료
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <span className="text-xs text-muted-foreground">
            {new Date(project.createdAt).toLocaleDateString('ko-KR')} 생성
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

// ============================================================
// 스켈레톤 로더
// ============================================================

function ProjectCardSkeleton(): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="mt-1 h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-40" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-28" />
      </CardFooter>
    </Card>
  );
}

// ============================================================
// 메인 페이지
// ============================================================

export default function ProjectsPage(): React.ReactElement {
  const {
    searchQuery,
    statusFilter,
    isLoading,
    error,
    filteredProjects,
    setSearchQuery,
    setStatusFilter,
    fetchProjects,
  } = useProjectStore();

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const projects = filteredProjects();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">프로젝트</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI 마케팅 엔진으로 랜딩페이지를 생성하세요
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            새 프로젝트
          </Button>
        </Link>
      </div>

      {/* 검색 & 필터 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="프로젝트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={statusFilter === opt.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 에러 상태 */}
      {error && (
        <ErrorState
          message={error}
          onRetry={() => void fetchProjects()}
        />
      )}

      {/* 로딩 상태 */}
      {isLoading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 프로젝트 그리드 */}
      {!isLoading && !error && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && !error && projects.length === 0 && (
        <EmptyState
          title={searchQuery || statusFilter !== 'ALL' ? '검색 결과 없음' : '아직 프로젝트가 없습니다'}
          description={
            searchQuery || statusFilter !== 'ALL'
              ? '다른 검색어나 필터를 시도해보세요'
              : '첫 번째 랜딩페이지를 만들어보세요'
          }
          icon={<FileText className="h-10 w-10" />}
          actionLabel={!(searchQuery || statusFilter !== 'ALL') ? '새 프로젝트 만들기' : undefined}
          onAction={
            !(searchQuery || statusFilter !== 'ALL')
              ? () => {
                  globalThis.location.href = '/projects/new';
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
