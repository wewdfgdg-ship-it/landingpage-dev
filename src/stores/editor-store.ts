import { create } from 'zustand';
import type { CopyBlock, SectionCopy, CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { SectionLayout, LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';

// ============================================================
// Editor Store — 에디터 상태 관리
// 드래그 정렬, 실시간 미리보기, 양방향 섹션 연동
// ============================================================

export interface EditorSection {
  order: number;
  role: string;
  sectionType: string;
  patternId: string;
  patternName: string;
  copy: CopyBlock;
}

interface EditorState {
  // 데이터
  projectId: string;
  sections: EditorSection[];
  styleConfig: StyleConfig | null;
  originalHtml: string;
  previewHtml: string;

  // UI 상태
  selectedSectionOrder: number | null;
  isDirty: boolean;
  isSaving: boolean;
  isRebuilding: boolean;

  // 드래그 상태
  dragIndex: number | null;
  dragOverIndex: number | null;

  // 미리보기 연동
  previewHighlightOrder: number | null;
  editVersion: number;

  // 액션
  initialize: (
    projectId: string,
    copyBlocks: CopyBlocks,
    layoutConfig: LayoutConfig,
    styleConfig: StyleConfig,
    html: string,
  ) => void;
  selectSection: (order: number | null) => void;
  updateCopy: (order: number, field: keyof CopyBlock, value: string | string[]) => void;
  changePattern: (order: number, patternId: string, patternName: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  deleteSection: (order: number) => void;
  setPreviewHtml: (html: string) => void;
  setSaving: (saving: boolean) => void;
  setRebuilding: (rebuilding: boolean) => void;
  markClean: () => void;

  // 드래그 액션
  setDragIndex: (index: number | null) => void;
  setDragOverIndex: (index: number | null) => void;

  // 미리보기 연동 액션
  setPreviewHighlight: (order: number | null) => void;
  scrollToSection: (order: number) => void;

  // 데이터 추출
  toCopyBlocks: () => CopyBlocks;
  toLayoutSections: () => SectionLayout[];
}

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: '',
  sections: [],
  styleConfig: null,
  originalHtml: '',
  previewHtml: '',
  selectedSectionOrder: null,
  isDirty: false,
  isSaving: false,
  isRebuilding: false,
  dragIndex: null,
  dragOverIndex: null,
  previewHighlightOrder: null,
  editVersion: 0,

  initialize: (projectId, copyBlocks, layoutConfig, styleConfig, html) => {
    const sections: EditorSection[] = layoutConfig.sections.map((layout) => {
      const sectionCopy = copyBlocks.sections.find(
        (s) => s.sectionOrder === layout.order,
      );
      return {
        order: layout.order,
        role: layout.role,
        sectionType: layout.sectionType,
        patternId: layout.selectedPattern,
        patternName: layout.patternName,
        copy: sectionCopy?.copy ?? {
          headline: layout.sectionType,
          subheadline: '',
          body: '',
          bulletPoints: [],
          ctaText: '',
          microCopy: '',
          imageDirection: '',
        },
      };
    });

    set({
      projectId,
      sections: sections.sort((a, b) => a.order - b.order),
      styleConfig,
      originalHtml: html,
      previewHtml: html,
      selectedSectionOrder: null,
      isDirty: false,
      editVersion: 0,
    });
  },

  selectSection: (order) => set({ selectedSectionOrder: order, previewHighlightOrder: order }),

  updateCopy: (order, field, value) =>
    set((state) => ({
      isDirty: true,
      editVersion: state.editVersion + 1,
      sections: state.sections.map((s) =>
        s.order === order
          ? { ...s, copy: { ...s.copy, [field]: value } }
          : s,
      ),
    })),

  changePattern: (order, patternId, patternName) =>
    set((state) => ({
      isDirty: true,
      editVersion: state.editVersion + 1,
      sections: state.sections.map((s) =>
        s.order === order ? { ...s, patternId, patternName } : s,
      ),
    })),

  reorderSections: (fromIndex, toIndex) =>
    set((state) => {
      const newSections = [...state.sections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);
      const reordered = newSections.map((s, i) => ({ ...s, order: i + 1 }));
      return { sections: reordered, isDirty: true, editVersion: state.editVersion + 1 };
    }),

  deleteSection: (order) =>
    set((state) => {
      const filtered = state.sections.filter((s) => s.order !== order);
      const reordered = filtered.map((s, i) => ({ ...s, order: i + 1 }));
      return {
        sections: reordered,
        isDirty: true,
        editVersion: state.editVersion + 1,
        selectedSectionOrder:
          state.selectedSectionOrder === order ? null : state.selectedSectionOrder,
      };
    }),

  setPreviewHtml: (html) => set({ previewHtml: html }),
  setSaving: (saving) => set({ isSaving: saving }),
  setRebuilding: (rebuilding) => set({ isRebuilding: rebuilding }),
  markClean: () => set({ isDirty: false }),

  // 드래그
  setDragIndex: (index) => set({ dragIndex: index }),
  setDragOverIndex: (index) => set({ dragOverIndex: index }),

  // 미리보기 연동
  setPreviewHighlight: (order) => set({ previewHighlightOrder: order }),
  scrollToSection: (order) => set({ selectedSectionOrder: order, previewHighlightOrder: order }),

  toCopyBlocks: () => {
    const sections: SectionCopy[] = get().sections.map((s) => ({
      sectionOrder: s.order,
      role: s.role,
      sectionType: s.sectionType,
      copy: s.copy,
    }));
    return { sections, tone: '', qualityScore: 0 };
  },

  toLayoutSections: () =>
    get().sections.map((s) => ({
      order: s.order,
      role: s.role,
      sectionType: s.sectionType,
      selectedPattern: s.patternId,
      patternName: s.patternName,
      score: 100,
      reasoning: '에디터에서 수정됨',
    })),
}));
