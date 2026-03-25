import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '@/stores/editor-store';
import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';

// --- Mock 데이터 ---

function createMockCopyBlocks(): CopyBlocks {
  return {
    sections: [
      {
        sectionOrder: 1,
        role: 'HOOK',
        sectionType: 'hero_visual',
        copy: {
          headline: '테스트 헤드라인',
          subheadline: '서브 헤드라인',
          body: '본문 텍스트',
          bulletPoints: ['포인트1', '포인트2'],
          ctaText: '시작하기',
          microCopy: '무료 체험',
          imageDirection: '밝은 이미지',
        },
      },
      {
        sectionOrder: 2,
        role: 'PAIN',
        sectionType: 'pain_point',
        copy: {
          headline: '고통점',
          subheadline: '',
          body: '문제 설명',
          bulletPoints: [],
          ctaText: '',
          microCopy: '',
          imageDirection: '',
        },
      },
      {
        sectionOrder: 3,
        role: 'CTA',
        sectionType: 'final_cta',
        copy: {
          headline: '지금 시작',
          subheadline: '',
          body: '',
          bulletPoints: [],
          ctaText: '무료 체험',
          microCopy: '카드 불필요',
          imageDirection: '',
        },
      },
    ],
    tone: '전문적인',
    qualityScore: 85,
  };
}

function createMockLayoutConfig(): LayoutConfig {
  return {
    sections: [
      { order: 1, role: 'HOOK', sectionType: 'hero_visual', selectedPattern: 'hero_fullscreen_center', patternName: '풀스크린 센터', score: 90, reasoning: '' },
      { order: 2, role: 'PAIN', sectionType: 'pain_point', selectedPattern: 'feat_zigzag', patternName: '지그재그', score: 85, reasoning: '' },
      { order: 3, role: 'CTA', sectionType: 'final_cta', selectedPattern: 'cta_center', patternName: '센터 정렬', score: 95, reasoning: '' },
    ],
    diversityScore: 100,
    mobileReadyScore: 90,
  };
}

function createMockStyleConfig(): StyleConfig {
  return {
    mood: 'clean',
    moodName: 'Clean',
    moodDescription: '깔끔한',
    tokens: {
      colors: { primary: '#000', primaryLight: '#333', primaryDark: '#000', secondary: '#666', accent: '#007AFF', background: '#FFF', surface: '#F5F5F5', textPrimary: '#111', textSecondary: '#444', textMuted: '#888', border: '#DDD', error: '#EF4444' },
      typography: {
        display: { size: '4.5rem', weight: 700, lineHeight: '1.1' },
        h1: { size: '3rem', weight: 700, lineHeight: '1.2' },
        h2: { size: '2.25rem', weight: 700, lineHeight: '1.25' },
        h3: { size: '1.5rem', weight: 600, lineHeight: '1.3' },
        h4: { size: '1.25rem', weight: 600, lineHeight: '1.4' },
        body: { size: '1rem', weight: 400, lineHeight: '1.6' },
        small: { size: '0.875rem', weight: 400, lineHeight: '1.5' },
        caption: { size: '0.75rem', weight: 400, lineHeight: '1.5' },
        button: { size: '1rem', weight: 600, lineHeight: '1.4' },
      },
      fontFamily: 'sans',
      spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48 },
      radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 999 },
      defaultShadow: 'md',
      sectionPadding: '80px 0',
    },
    reasoning: '테스트',
  };
}

const MOCK_HTML = '<html><body><div data-zone="section_1_hero">히어로</div></body></html>';

describe('Editor Store — 에디터 상태 관리', () => {
  beforeEach(() => {
    const store = useEditorStore.getState();
    // 초기화
    store.initialize(
      'test-project',
      createMockCopyBlocks(),
      createMockLayoutConfig(),
      createMockStyleConfig(),
      MOCK_HTML,
    );
  });

  describe('initialize', () => {
    it('프로젝트 데이터로 초기화한다', () => {
      const state = useEditorStore.getState();
      expect(state.projectId).toBe('test-project');
      expect(state.sections).toHaveLength(3);
      expect(state.previewHtml).toBe(MOCK_HTML);
      expect(state.isDirty).toBe(false);
    });

    it('섹션이 order 순으로 정렬된다', () => {
      const orders = useEditorStore.getState().sections.map((s) => s.order);
      expect(orders).toEqual([1, 2, 3]);
    });

    it('copy와 layout 데이터가 병합된다', () => {
      const section = useEditorStore.getState().sections[0];
      expect(section.copy.headline).toBe('테스트 헤드라인');
      expect(section.patternId).toBe('hero_fullscreen_center');
    });
  });

  describe('selectSection', () => {
    it('섹션을 선택한다', () => {
      useEditorStore.getState().selectSection(2);
      expect(useEditorStore.getState().selectedSectionOrder).toBe(2);
    });

    it('null로 선택 해제한다', () => {
      useEditorStore.getState().selectSection(2);
      useEditorStore.getState().selectSection(null);
      expect(useEditorStore.getState().selectedSectionOrder).toBeNull();
    });
  });

  describe('updateCopy', () => {
    it('헤드라인을 업데이트한다', () => {
      useEditorStore.getState().updateCopy(1, 'headline', '새 헤드라인');
      const section = useEditorStore.getState().sections[0];
      expect(section.copy.headline).toBe('새 헤드라인');
    });

    it('isDirty가 true로 변한다', () => {
      useEditorStore.getState().updateCopy(1, 'headline', '변경');
      expect(useEditorStore.getState().isDirty).toBe(true);
    });

    it('bulletPoints 배열을 업데이트한다', () => {
      useEditorStore.getState().updateCopy(1, 'bulletPoints', ['새 포인트1', '새 포인트2', '새 포인트3']);
      const bullets = useEditorStore.getState().sections[0].copy.bulletPoints;
      expect(bullets).toEqual(['새 포인트1', '새 포인트2', '새 포인트3']);
    });

    it('다른 섹션은 영향받지 않는다', () => {
      useEditorStore.getState().updateCopy(1, 'headline', '변경');
      expect(useEditorStore.getState().sections[1].copy.headline).toBe('고통점');
    });
  });

  describe('changePattern', () => {
    it('패턴을 변경한다', () => {
      useEditorStore.getState().changePattern(1, 'hero_left_right', '좌카피 + 우이미지');
      const section = useEditorStore.getState().sections[0];
      expect(section.patternId).toBe('hero_left_right');
      expect(section.patternName).toBe('좌카피 + 우이미지');
    });

    it('isDirty가 true로 변한다', () => {
      useEditorStore.getState().changePattern(1, 'hero_left_right', '좌카피');
      expect(useEditorStore.getState().isDirty).toBe(true);
    });
  });

  describe('moveSection', () => {
    it('섹션 순서를 변경한다', () => {
      useEditorStore.getState().moveSection(1, 3);
      const roles = useEditorStore.getState().sections.map((s) => s.role);
      expect(roles).toEqual(['PAIN', 'CTA', 'HOOK']);
    });

    it('order가 재할당된다', () => {
      useEditorStore.getState().moveSection(1, 3);
      const orders = useEditorStore.getState().sections.map((s) => s.order);
      expect(orders).toEqual([1, 2, 3]);
    });

    it('같은 위치면 변경 없음', () => {
      useEditorStore.getState().moveSection(2, 2);
      const state = useEditorStore.getState();
      expect(state.isDirty).toBe(false);
    });
  });

  describe('deleteSection', () => {
    it('섹션을 삭제한다', () => {
      useEditorStore.getState().deleteSection(2);
      expect(useEditorStore.getState().sections).toHaveLength(2);
    });

    it('order가 재할당된다', () => {
      useEditorStore.getState().deleteSection(2);
      const orders = useEditorStore.getState().sections.map((s) => s.order);
      expect(orders).toEqual([1, 2]);
    });

    it('선택된 섹션 삭제 시 선택 해제된다', () => {
      useEditorStore.getState().selectSection(2);
      useEditorStore.getState().deleteSection(2);
      expect(useEditorStore.getState().selectedSectionOrder).toBeNull();
    });

    it('다른 섹션 삭제 시 선택 유지된다', () => {
      useEditorStore.getState().selectSection(1);
      useEditorStore.getState().deleteSection(3);
      expect(useEditorStore.getState().selectedSectionOrder).toBe(1);
    });
  });

  describe('addSection', () => {
    it('새 섹션을 추가한다', () => {
      useEditorStore.getState().addSection('faq');
      expect(useEditorStore.getState().sections).toHaveLength(4);
    });

    it('마지막에 추가된다', () => {
      useEditorStore.getState().addSection('faq');
      const last = useEditorStore.getState().sections[3];
      expect(last.sectionType).toBe('faq');
      expect(last.order).toBe(4);
    });

    it('추가된 섹션이 자동 선택된다', () => {
      useEditorStore.getState().addSection('faq');
      expect(useEditorStore.getState().selectedSectionOrder).toBe(4);
    });
  });

  describe('duplicateSection', () => {
    it('섹션을 복제한다', () => {
      useEditorStore.getState().duplicateSection(1);
      expect(useEditorStore.getState().sections).toHaveLength(4);
    });

    it('복제본이 원본 바로 다음에 삽입된다', () => {
      useEditorStore.getState().duplicateSection(1);
      const sections = useEditorStore.getState().sections;
      expect(sections[0].role).toBe('HOOK');
      expect(sections[1].role).toBe('HOOK'); // 복제본
      expect(sections[1].copy.headline).toContain('복사본');
    });

    it('order가 재할당된다', () => {
      useEditorStore.getState().duplicateSection(1);
      const orders = useEditorStore.getState().sections.map((s) => s.order);
      expect(orders).toEqual([1, 2, 3, 4]);
    });

    it('복제본이 자동 선택된다', () => {
      useEditorStore.getState().duplicateSection(1);
      expect(useEditorStore.getState().selectedSectionOrder).toBe(2);
    });
  });

  describe('데이터 추출', () => {
    it('toCopyBlocks가 CopyBlocks 형식을 반환한다', () => {
      const result = useEditorStore.getState().toCopyBlocks();
      expect(result.sections).toHaveLength(3);
      expect(result.sections[0].sectionOrder).toBe(1);
      expect(result.sections[0].role).toBe('HOOK');
      expect(result.sections[0].copy.headline).toBe('테스트 헤드라인');
    });

    it('toLayoutSections가 SectionLayout[] 형식을 반환한다', () => {
      const result = useEditorStore.getState().toLayoutSections();
      expect(result).toHaveLength(3);
      expect(result[0].order).toBe(1);
      expect(result[0].selectedPattern).toBe('hero_fullscreen_center');
    });
  });

  describe('UI 상태', () => {
    it('markClean이 isDirty를 false로 만든다', () => {
      useEditorStore.getState().updateCopy(1, 'headline', '변경');
      expect(useEditorStore.getState().isDirty).toBe(true);
      useEditorStore.getState().markClean();
      expect(useEditorStore.getState().isDirty).toBe(false);
    });

    it('setPreviewHtml이 previewHtml을 업데이트한다', () => {
      useEditorStore.getState().setPreviewHtml('<div>새 HTML</div>');
      expect(useEditorStore.getState().previewHtml).toBe('<div>새 HTML</div>');
    });

    it('setSaving, setRebuilding, setLiveUpdating이 동작한다', () => {
      useEditorStore.getState().setSaving(true);
      expect(useEditorStore.getState().isSaving).toBe(true);

      useEditorStore.getState().setRebuilding(true);
      expect(useEditorStore.getState().isRebuilding).toBe(true);

      useEditorStore.getState().setLiveUpdating(true);
      expect(useEditorStore.getState().isLiveUpdating).toBe(true);
    });
  });
});
