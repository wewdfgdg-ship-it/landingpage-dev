import { describe, it, expect } from 'vitest';
import { runWhyNow } from '@/engine/02-why-now';
import { createMockBrief, createHighResistanceBrief, createImpulseBrief } from './fixtures';

describe('Engine 02 — Why Now (긴급성 전략)', () => {
  describe('기본 출력 구조', () => {
    it('UrgencyBrief 필수 필드를 모두 반환한다', () => {
      const brief = createMockBrief();
      const result = runWhyNow(brief, 'saas', '50,000원/월');

      expect(result).toHaveProperty('primaryType');
      expect(result).toHaveProperty('secondaryType');
      expect(result).toHaveProperty('urgencyElements');
      expect(result).toHaveProperty('ctaUrgencyLevel');
      expect(result).toHaveProperty('placement');
      expect(result.urgencyElements.length).toBeGreaterThan(0);
    });

    it('ctaUrgencyLevel은 1~5 범위다', () => {
      const brief = createMockBrief();
      const result = runWhyNow(brief, 'saas', '50,000원/월');

      expect(result.ctaUrgencyLevel).toBeGreaterThanOrEqual(1);
      expect(result.ctaUrgencyLevel).toBeLessThanOrEqual(5);
    });
  });

  describe('업종별 긴급성 유형 선택', () => {
    it('고가/SaaS 업종은 price_anchor를 선택한다', () => {
      const brief = createMockBrief({
        resistanceMap: {
          price: { level: 2, reason: '' },
          trust: { level: 2, reason: '' },
          need: { level: 2, reason: '' },
          urgency: { level: 2, reason: '' },
          complexity: { level: 2, reason: '' },
        },
      });
      const result = runWhyNow(brief, 'saas', '500,000원');
      expect(result.primaryType).toBe('price_anchor');
    });

    it('라이프스타일 업종은 emotional을 선택한다', () => {
      const brief = createMockBrief({
        resistanceMap: {
          price: { level: 2, reason: '' },
          trust: { level: 2, reason: '' },
          need: { level: 2, reason: '' },
          urgency: { level: 2, reason: '' },
          complexity: { level: 2, reason: '' },
        },
      });
      const result = runWhyNow(brief, 'lifestyle', '30,000원');
      expect(result.primaryType).toBe('emotional');
    });

    it('문제 해결형 제품 + 높은 need는 situational을 선택한다', () => {
      const brief = createMockBrief({
        customerFear: {
          problem: '광고비 매일 낭비 중',
          opportunity: '',
          social: '',
        },
        resistanceMap: {
          price: { level: 2, reason: '' },
          trust: { level: 2, reason: '' },
          need: { level: 3, reason: '' },
          urgency: { level: 2, reason: '' },
          complexity: { level: 2, reason: '' },
        },
      });
      const result = runWhyNow(brief, 'other', '10,000원');
      expect(result.primaryType).toBe('situational');
    });
  });

  describe('2차 긴급성 (복합 적용)', () => {
    it('urgency 저항 5이면 secondaryType이 있다', () => {
      const brief = createHighResistanceBrief();
      const result = runWhyNow(brief, 'other', '10,000원');
      expect(result.secondaryType).not.toBeNull();
    });

    it('urgency 저항 4 이하이면 secondaryType이 null이다', () => {
      const brief = createImpulseBrief();
      const result = runWhyNow(brief, 'other', '10,000원');
      expect(result.secondaryType).toBeNull();
    });
  });

  describe('배치 규칙', () => {
    it('placement에 항상 final_cta가 포함된다', () => {
      const brief = createMockBrief();
      const result = runWhyNow(brief, 'other', '10,000원');
      expect(result.placement).toContain('final_cta');
    });

    it('price_anchor이면 pricing 배치를 포함한다', () => {
      const brief = createMockBrief({
        resistanceMap: {
          price: { level: 2, reason: '' },
          trust: { level: 2, reason: '' },
          need: { level: 2, reason: '' },
          urgency: { level: 2, reason: '' },
          complexity: { level: 2, reason: '' },
        },
      });
      const result = runWhyNow(brief, 'saas', '500,000원');
      expect(result.placement).toContain('pricing');
    });

    it('urgency 저항 4 이상이면 mid_page 배치를 포함한다', () => {
      const brief = createHighResistanceBrief();
      const result = runWhyNow(brief, 'other', '10,000원');
      expect(result.placement).toContain('mid_page');
    });
  });
});
