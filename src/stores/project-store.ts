import { create } from 'zustand';

// ============================================================
// Project Store — 프로젝트 목록 상태 관리
// ============================================================

export type ProjectStatus =
  | 'DRAFT'
  | 'GENERATING'
  | 'GENERATED'
  | 'EDITING'
  | 'DEPLOYED'
  | 'ARCHIVED';

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  slug: string | null;
  inputScore: number | null;
  isDeployed: boolean;
  createdAt: string;
  updatedAt: string;
}

type SortField = 'createdAt' | 'updatedAt' | 'name';
type SortOrder = 'asc' | 'desc';

interface ProjectState {
  // 데이터
  projects: ProjectSummary[];

  // 필터/검색
  searchQuery: string;
  statusFilter: ProjectStatus | 'ALL';
  sortField: SortField;
  sortOrder: SortOrder;

  // 로딩 상태
  isLoading: boolean;
  error: string | null;

  // 계산된 값
  filteredProjects: () => ProjectSummary[];

  // 액션
  setProjects: (projects: ProjectSummary[]) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: ProjectStatus | 'ALL') => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProjects: () => Promise<void>;
}

function sortProjects(
  projects: ProjectSummary[],
  field: SortField,
  order: SortOrder,
): ProjectSummary[] {
  return [...projects].sort((a, b) => {
    let cmp = 0;
    if (field === 'name') {
      cmp = a.name.localeCompare(b.name, 'ko');
    } else {
      cmp = new Date(a[field]).getTime() - new Date(b[field]).getTime();
    }
    return order === 'asc' ? cmp : -cmp;
  });
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // 초기값
  projects: [],
  searchQuery: '',
  statusFilter: 'ALL',
  sortField: 'updatedAt',
  sortOrder: 'desc',
  isLoading: false,
  error: null,

  // 필터링된 프로젝트 목록
  filteredProjects: () => {
    const { projects, searchQuery, statusFilter, sortField, sortOrder } = get();
    let filtered = projects;

    // 상태 필터
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // 검색
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }

    // 정렬
    return sortProjects(filtered, sortField, sortOrder);
  },

  // 액션
  setProjects: (projects) => set({ projects }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSortField: (sortField) => set({ sortField }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) {
        throw new Error('프로젝트 목록을 불러올 수 없습니다');
      }
      const data = (await res.json()) as { projects: ProjectSummary[] };
      set({ projects: data.projects, isLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      set({ error: message, isLoading: false });
    }
  },
}));
