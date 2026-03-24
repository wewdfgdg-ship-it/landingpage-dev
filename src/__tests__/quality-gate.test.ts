import { describe, it, expect } from 'vitest';
import {
  evaluateSection,
  evaluateCopyQuality,
  buildRetryPrompt,
  mergeCopy,
  QUALITY_THRESHOLD,
} from '@/engine/05-psychological-copy/quality-gate';
import type { SectionCopy, CopyBlocks, CopyBlock } from '@/engine/05-psychological-copy/types';

// --- Mock 카피 ---

function createGoodCopy(): CopyBlock {
  return {
    headline: '매출 300% 성장',
    subheadline: 'AI가 만드는 최적의 랜딩페이지로 전환율을 높이세요',
    body: '3,000개 이상의 기업이 검증한 AI 마케팅 플랫폼으로 매일 2시간을 절약하고 전환율을 높이세요.',
    bulletPoints: [
      'AI 기반 자동 최적화로 전환율 30% 향상',
      '3분 만에 전문가 수준의 페이지 완성',
      '실시간 A/B 테스트로 데이터 기반 의사결정',
      '100만 고객 리뷰 평점 4.9★',
    ],
    ctaText: '무료 체험',
    microCopy: '14일 무료, 카드 정보 불필요',
    imageDirection: '깔끔한 대시보드 화면과 성장 그래프를 보여주는 모니터',
  };
}

function createBadCopy(): CopyBlock {
  return {
    headline: '',
    subheadline: '',
    body: '좋은 제품입니다',
    bulletPoints: [],
    ctaText: '',
    microCopy: '',
    imageDirection: '',
  };
}

function createSection(
  order: number,
  role: string,
  sectionType: string,
  copy: CopyBlock,
): SectionCopy {
  return { sectionOrder: order, role, sectionType, copy };
}

describe('Quality Gate — 카피 품질 평가', () => {
  describe('evaluateSection', () => {
    it('좋은 카피는 높은 점수를 받는다', () => {
      const section = createSection(1, 'HOOK', 'hero_visual', createGoodCopy());
      const result = evaluateSection(section, 'saas');

      expect(result.combinedScore).toBeGreaterThanOrEqual(50);
      expect(result.sectionOrder).toBe(1);
      expect(result.role).toBe('HOOK');
    });

    it('나쁜 카피는 낮은 점수를 받는다', () => {
      const section = createSection(1, 'HOOK', 'hero_visual', createBadCopy());
      const result = evaluateSection(section, 'saas');

      expect(result.combinedScore).toBeLessThan(QUALITY_THRESHOLD);
      expect(result.passed).toBe(false);
    });

    it('실패 시 피드백 메시지가 생성된다', () => {
      const section = createSection(1, 'HOOK', 'hero_visual', createBadCopy());
      const result = evaluateSection(section, 'saas');

      expect(result.feedback.length).toBeGreaterThan(0);
      expect(result.feedback).toContain('개선 필요');
    });

    it('통과 시 피드백이 비어있다', () => {
      const section = createSection(1, 'HOOK', 'hero_visual', createGoodCopy());
      const result = evaluateSection(section, 'saas');

      if (result.passed) {
        expect(result.feedback).toBe('');
      }
    });
  });

  describe('evaluateCopyQuality', () => {
    it('전체 카피 품질을 종합 평가한다', () => {
      const copyBlocks: CopyBlocks = {
        sections: [
          createSection(1, 'HOOK', 'hero_visual', createGoodCopy()),
          createSection(2, 'PAIN', 'pain_point', createGoodCopy()),
        ],
        tone: '전문적이고 신뢰감 있는',
        qualityScore: 0,
      };

      const result = evaluateCopyQuality(copyBlocks, 'saas');

      expect(result).toHaveProperty('overallScore');
      expect(result).toHaveProperty('totalSections');
      expect(result).toHaveProperty('passedSections');
      expect(result).toHaveProperty('failedSections');
      expect(result.totalSections).toBe(2);
    });

    it('빈 섹션이면 overallScore가 0이다', () => {
      const copyBlocks: CopyBlocks = { sections: [], tone: '', qualityScore: 0 };
      const result = evaluateCopyQuality(copyBlocks, 'saas');
      expect(result.overallScore).toBe(0);
      expect(result.passed).toBe(true); // 실패 섹션 없음
    });
  });

  describe('buildRetryPrompt', () => {
    it('실패 섹션 정보를 포함한 재생성 프롬프트를 반환한다', () => {
      const section = createSection(1, 'HOOK', 'hero_visual', createBadCopy());
      const result = evaluateSection(section, 'saas');
      const copyBlocks: CopyBlocks = {
        sections: [section],
        tone: '',
        qualityScore: 0,
      };

      const prompt = buildRetryPrompt([result], copyBlocks);

      expect(prompt).toContain('개선');
      expect(prompt).toContain('섹션 1');
      expect(prompt).toContain(String(QUALITY_THRESHOLD));
    });
  });

  describe('mergeCopy', () => {
    it('재생성된 섹션을 원본에 머지한다', () => {
      const original: CopyBlocks = {
        sections: [
          createSection(1, 'HOOK', 'hero_visual', createBadCopy()),
          createSection(2, 'PAIN', 'pain_point', createGoodCopy()),
        ],
        tone: '',
        qualityScore: 0,
      };

      const retried = [createSection(1, 'HOOK', 'hero_visual', createGoodCopy())];
      const merged = mergeCopy(original, retried);

      expect(merged.sections[0].copy.headline).toBe('매출 300% 성장');
      expect(merged.sections[1]).toEqual(original.sections[1]); // 변경 없음
    });

    it('매칭 안 되는 섹션은 원본 유지', () => {
      const original: CopyBlocks = {
        sections: [createSection(1, 'HOOK', 'hero', createBadCopy())],
        tone: '',
        qualityScore: 0,
      };

      const retried = [createSection(99, 'CTA', 'final', createGoodCopy())];
      const merged = mergeCopy(original, retried);

      expect(merged.sections[0].copy.headline).toBe('');
    });
  });
});
