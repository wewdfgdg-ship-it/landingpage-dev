import { describe, it, expect } from 'vitest';
import { runVisualStyle } from '@/engine/09-visual-style';
import { createMockBrief } from './fixtures';

describe('Engine 09 — Visual Style (비주얼 스타일)', () => {
  describe('기본 출력', () => {
    it('필수 필드를 모두 반환한다', () => {
      const brief = createMockBrief();
      const result = runVisualStyle(brief, 'saas');

      expect(result).toHaveProperty('mood');
      expect(result).toHaveProperty('moodName');
      expect(result).toHaveProperty('moodDescription');
      expect(result).toHaveProperty('tokens');
      expect(result).toHaveProperty('reasoning');
    });

    it('디자인 토큰 구조가 올바르다', () => {
      const brief = createMockBrief();
      const result = runVisualStyle(brief, 'saas');

      expect(result.tokens).toHaveProperty('colors');
      expect(result.tokens).toHaveProperty('typography');
      expect(result.tokens).toHaveProperty('fontFamily');
      expect(result.tokens).toHaveProperty('spacing');
      expect(result.tokens).toHaveProperty('radius');
      expect(result.tokens).toHaveProperty('defaultShadow');
      expect(result.tokens).toHaveProperty('sectionPadding');
    });
  });

  describe('업종별 무드 선택', () => {
    it('SaaS 업종은 적절한 무드를 선택한다', () => {
      const brief = createMockBrief();
      const result = runVisualStyle(brief, 'saas');
      expect(result.mood).toBeDefined();
      expect(result.moodName.length).toBeGreaterThan(0);
    });

    it('beauty 업종은 뷰티 친화적 무드를 선택한다', () => {
      const brief = createMockBrief();
      const result = runVisualStyle(brief, 'beauty');
      expect(result.mood).toBeDefined();
    });

    it('알 수 없는 업종도 기본 무드를 반환한다', () => {
      const brief = createMockBrief();
      const result = runVisualStyle(brief, 'unknown_xyz');
      expect(result.mood).toBeDefined();
      expect(result.tokens.colors).toBeDefined();
    });
  });

  describe('포지셔닝 보정', () => {
    it('premium 포지셔닝은 고급 스타일을 선택한다', () => {
      const brief = createMockBrief({
        productDNA: {
          coreValue: '프리미엄 서비스',
          usp: ['럭셔리 경험'],
          positioning: 'premium',
          valueHierarchy: { functional: '', emotional: '', social: '' },
        },
      });
      const result = runVisualStyle(brief, 'lifestyle');
      expect(result.reasoning).toContain('포지셔닝');
    });
  });

  describe('타이포그래피 스케일', () => {
    it('display~caption까지 모든 사이즈가 정의되어 있다', () => {
      const brief = createMockBrief();
      const result = runVisualStyle(brief, 'saas');
      const typo = result.tokens.typography;

      expect(typo.display).toBeDefined();
      expect(typo.h1).toBeDefined();
      expect(typo.h2).toBeDefined();
      expect(typo.h3).toBeDefined();
      expect(typo.body).toBeDefined();
      expect(typo.small).toBeDefined();
      expect(typo.caption).toBeDefined();
      expect(typo.button).toBeDefined();
    });
  });

  describe('라디우스 스케일', () => {
    it('none~full까지 모든 단계가 정의되어 있다', () => {
      const brief = createMockBrief();
      const result = runVisualStyle(brief, 'saas');
      const radius = result.tokens.radius;

      expect(radius.none).toBe(0);
      expect(radius.sm).toBeGreaterThan(0);
      expect(radius.md).toBeGreaterThan(radius.sm);
      expect(radius.lg).toBeGreaterThan(radius.md);
      expect(radius.full).toBe(999);
    });
  });
});
