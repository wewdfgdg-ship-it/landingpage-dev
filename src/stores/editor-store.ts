import { create } from 'zustand';
import type { CopyBlock, SectionCopy, CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { SectionLayout, LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';

// ============================================================
// Editor Store — 에디터 상태 관리
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
  isLiveUpdating: boolean;

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
  moveSection: (fromOrder: number, toOrder: number) => void;
  deleteSection: (order: number) => void;
  addSection: (sectionType: string) => void;
  duplicateSection: (order: number) => void;
  setPreviewHtml: (html: string) => void;
  setSaving: (saving: boolean) => void;
  setRebuilding: (rebuilding: boolean) => void;
  setLiveUpdating: (updating: boolean) => void;
  markClean: () => void;

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
  isLiveUpdating: false,

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
    });
  },

  selectSection: (order) => set({ selectedSectionOrder: order }),

  updateCopy: (order, field, value) =>
    set((state) => ({
      isDirty: true,
      sections: state.sections.map((s) =>
        s.order === order
          ? { ...s, copy: { ...s.copy, [field]: value } }
          : s,
      ),
    })),

  changePattern: (order, patternId, patternName) =>
    set((state) => ({
      isDirty: true,
      sections: state.sections.map((s) =>
        s.order === order ? { ...s, patternId, patternName } : s,
      ),
    })),

  reorderSections: (fromIndex, toIndex) =>
    set((state) => {
      const newSections = [...state.sections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);
      // order 재할당
      const reordered = newSections.map((s, i) => ({ ...s, order: i + 1 }));
      return { sections: reordered, isDirty: true };
    }),

  moveSection: (fromOrder, toOrder) =>
    set((state) => {
      const fromIndex = state.sections.findIndex((s) => s.order === fromOrder);
      const toIndex = state.sections.findIndex((s) => s.order === toOrder);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return state;
      const newSections = [...state.sections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);
      const reordered = newSections.map((s, i) => ({ ...s, order: i + 1 }));
      return { sections: reordered, isDirty: true };
    }),

  deleteSection: (order) =>
    set((state) => {
      const filtered = state.sections.filter((s) => s.order !== order);
      const reordered = filtered.map((s, i) => ({ ...s, order: i + 1 }));
      return {
        sections: reordered,
        isDirty: true,
        selectedSectionOrder:
          state.selectedSectionOrder === order ? null : state.selectedSectionOrder,
      };
    }),

  addSection: (sectionType) =>
    set((state) => {
      const newOrder = state.sections.length + 1;
      const newSection: EditorSection = {
        order: newOrder,
        role: sectionType,
        sectionType,
        patternId: '',
        patternName: '',
        copy: {
          headline: '',
          subheadline: '',
          body: '',
          bulletPoints: [],
          ctaText: '',
          microCopy: '',
          imageDirection: '',
        },
      };
      return {
        sections: [...state.sections, newSection],
        isDirty: true,
        selectedSectionOrder: newOrder,
      };
    }),

  duplicateSection: (order) =>
    set((state) => {
      const target = state.sections.find((s) => s.order === order);
      if (!target) return state;
      const insertIndex = state.sections.findIndex((s) => s.order === order) + 1;
      const newSection: EditorSection = {
        ...target,
        order: 0, // 임시값, 재할당됨
        copy: {
          ...target.copy,
          bulletPoints: [...target.copy.bulletPoints],
          headline: target.copy.headline ? `${target.copy.headline} (복사본)` : '',
        },
      };
      const newSections = [...state.sections];
      newSections.splice(insertIndex, 0, newSection);
      const reordered = newSections.map((s, i) => ({ ...s, order: i + 1 }));
      const duplicatedOrder = reordered[insertIndex].order;
      return {
        sections: reordered,
        isDirty: true,
        selectedSectionOrder: duplicatedOrder,
      };
    }),

  setPreviewHtml: (html) => set({ previewHtml: html }),
  setSaving: (saving) => set({ isSaving: saving }),
  setRebuilding: (rebuilding) => set({ isRebuilding: rebuilding }),
  setLiveUpdating: (updating) => set({ isLiveUpdating: updating }),
  markClean: () => set({ isDirty: false }),

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
