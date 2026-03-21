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

  initialize: (projectId, copyBlocks, layoutConfig, styleConfig, html): void => {
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

  selectSection: (order): void => set({ selectedSectionOrder: order }),

  updateCopy: (order, field, value): void =>
    set((state) => ({
      isDirty: true,
      sections: state.sections.map((s) =>
        s.order === order
          ? { ...s, copy: { ...s.copy, [field]: value } }
          : s,
      ),
    })),

  changePattern: (order, patternId, patternName): void =>
    set((state) => ({
      isDirty: true,
      sections: state.sections.map((s) =>
        s.order === order ? { ...s, patternId, patternName } : s,
      ),
    })),

  reorderSections: (fromIndex, toIndex): void =>
    set((state) => {
      const newSections = [...state.sections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);
      // order 재할당
      const reordered = newSections.map((s, i) => ({ ...s, order: i + 1 }));
      return { sections: reordered, isDirty: true };
    }),

  deleteSection: (order): void =>
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

  setPreviewHtml: (html): void => set({ previewHtml: html }),
  setSaving: (saving): void => set({ isSaving: saving }),
  setRebuilding: (rebuilding): void => set({ isRebuilding: rebuilding }),
  markClean: (): void => set({ isDirty: false }),

  toCopyBlocks: (): CopyBlocks => {
    const sections: SectionCopy[] = get().sections.map((s) => ({
      sectionOrder: s.order,
      role: s.role,
      sectionType: s.sectionType,
      copy: s.copy,
    }));
    return { sections, tone: '', qualityScore: 0 };
  },

  toLayoutSections: (): SectionLayout[] =>
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
