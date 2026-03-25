'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditorStore } from '@/stores/editor-store';
import { SectionList } from '@/components/editor/section-list';
import { EditPanel } from '@/components/editor/edit-panel';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { Loading } from '@/components/ui/loading';
import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';

// ============================================================
// 에디터 페이지 — 3패널 레이아웃
// 좌: 섹션 리스트 | 중: 미리보기 | 우: 편집 패널
// ============================================================

interface ProjectData {
  id: string;
  name: string;
  status: string;
  copyBlocks: CopyBlocks | null;
  layoutConfig: LayoutConfig | null;
  styleConfig: StyleConfig | null;
  generatedHtml: string | null;
}

export default function EditorPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectName, setProjectName] = useState('');
  const initRef = useRef(false);

  const {
    isDirty,
    isSaving,
    isRebuilding,
    isLiveUpdating,
    initialize,
    setSaving,
    setRebuilding,
    setLiveUpdating,
    setPreviewHtml,
    markClean,
    toCopyBlocks,
    toLayoutSections,
  } = useEditorStore();

  // sections 변화 감지용 구독
  const sections = useEditorStore((s) => s.sections);

  const fetchAndInit = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error('프로젝트 로딩 실패');
      const data = (await res.json()) as { project: ProjectData };
      const p = data.project;

      if (!p.copyBlocks || !p.layoutConfig || !p.styleConfig || !p.generatedHtml) {
        setError('먼저 AI 분석을 실행해주세요');
        return;
      }

      setProjectName(p.name);
      initialize(p.id, p.copyBlocks, p.layoutConfig, p.styleConfig, p.generatedHtml);
    } catch {
      setError('프로젝트를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  }, [id, initialize]);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      void fetchAndInit();
    }
  }, [fetchAndInit]);

  // 섹션 변경 시 실시간 미리보기 갱신 (debounce 1.2초)
  const liveUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // 초기화 전에는 실행하지 않음
    if (!isInitializedRef.current) {
      if (sections.length > 0) {
        isInitializedRef.current = true;
      }
      return;
    }

    if (liveUpdateTimerRef.current) {
      clearTimeout(liveUpdateTimerRef.current);
    }

    liveUpdateTimerRef.current = setTimeout(() => {
      void (async (): Promise<void> => {
        setLiveUpdating(true);
        try {
          const res = await fetch(`/api/projects/${id}/preview-live`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              copyBlocks: toCopyBlocks(),
              layoutSections: toLayoutSections(),
            }),
          });
          if (res.ok) {
            const data = (await res.json()) as { html: string };
            setPreviewHtml(data.html);
          }
        } finally {
          setLiveUpdating(false);
        }
      })();
    }, 1200);

    return (): void => {
      if (liveUpdateTimerRef.current) {
        clearTimeout(liveUpdateTimerRef.current);
      }
    };
  }, [sections, id, setLiveUpdating, setPreviewHtml, toCopyBlocks, toLayoutSections]);

  // 저장 + Code Engine 재실행
  const handleSave = async (): Promise<void> => {
    setSaving(true);
    setRebuilding(true);

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          copyBlocks: toCopyBlocks(),
          layoutSections: toLayoutSections(),
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error);
      }

      const result = (await res.json()) as { html: string };
      setPreviewHtml(result.html);
      markClean();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setSaving(false);
      setRebuilding(false);
    }
  };

  // 키보드 단축키: Ctrl+S 저장, Esc 선택 해제
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty && !isSaving) {
          void handleSave();
        }
      }
      if (e.key === 'Escape') {
        useEditorStore.getState().selectSection(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return (): void => { window.removeEventListener('keydown', handleKeyDown); };
  }, [isDirty, isSaving]); // eslint-disable-line react-hooks/exhaustive-deps

  // 페이지 떠날 때 저장 안 된 변경 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return (): void => { window.removeEventListener('beforeunload', handleBeforeUnload); };
  }, [isDirty]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push(`/projects/${id}`)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          프로젝트로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 상단 툴바 */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/projects/${id}`)}
            className="rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            &larr; 돌아가기
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-sm font-semibold text-gray-900">{projectName}</h1>
          {isDirty && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
              수정됨
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLiveUpdating && (
            <span className="text-xs text-gray-400 animate-pulse">실시간 미리보기 갱신 중...</span>
          )}
          {isRebuilding && (
            <span className="text-xs text-blue-600 animate-pulse">미리보기 갱신 중...</span>
          )}
          <button
            onClick={() => void handleSave()}
            disabled={!isDirty || isSaving}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              isDirty && !isSaving
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? '저장 중...' : '저장 및 미리보기 갱신'}
          </button>
        </div>
      </header>

      {/* 3패널 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌: 섹션 리스트 */}
        <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          <SectionList />
        </div>

        {/* 중: 미리보기 */}
        <div className="flex-1 overflow-hidden">
          <PreviewPanel />
        </div>

        {/* 우: 편집 패널 */}
        <div className="w-80 flex-shrink-0 overflow-y-auto border-l border-gray-200 bg-white">
          <EditPanel />
        </div>
      </div>
    </div>
  );
}
