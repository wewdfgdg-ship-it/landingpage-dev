import { describe, it, expect } from 'vitest';
import { runTrustArchitecture } from '@/engine/06-trust-architecture';
import { createMockBrief, createHighResistanceBrief, createMockBlueprint } from './fixtures';

describe('Engine 06 — Trust Architecture (신뢰 아키텍처)', () => {
  const blueprint = createMockBlueprint();

  describe('기본 출력', () => {
    it('trustElements와 trustScore를 반환한다', () => {
      const brief = createMockBrief();
      const result = runTrustArchitecture(brief, blueprint);

      expect(result).toHaveProperty('trustElements');
      expect(result).toHaveProperty('trustScore');
      expect(result.trustElements.length).toBeGreaterThan(0);
    });

    it('trustScore는 0~100 범위다', () => {
      const brief = createMockBrief();
      const result = runTrustArchitecture(brief, blueprint);

      expect(result.trustScore).toBeGreaterThanOrEqual(0);
      expect(result.trustScore).toBeLessThanOrEqual(100);
    });
  });

  describe('레벨 제어', () => {
    it('일반 사용자는 최대 Lv5까지 적용한다', () => {
      const brief = createMockBrief({ decisionType: 'analytical' });
      const result = runTrustArchitecture(brief, blueprint);

      const levels = result.trustElements.map((e) => e.level);
      expect(Math.max(...levels)).toBeLessThanOrEqual(5);
    });

    it('follower 유형이면 Lv6도 포함한다', () => {
      const brief = createMockBrief({ decisionType: 'follower' });
      const result = runTrustArchitecture(brief, blueprint);

      const levels = result.trustElements.map((e) => e.level);
      expect(levels).toContain(6);
    });

    it('신뢰 저항 4 이상이면 Lv6도 포함한다', () => {
      const brief = createHighResistanceBrief(); // trust:5
      const result = runTrustArchitecture(brief, blueprint);

      const levels = result.trustElements.map((e) => e.level);
      expect(levels).toContain(6);
    });
  });

  describe('요소 구조', () => {
    it('각 요소는 필수 필드를 가진다', () => {
      const brief = createMockBrief();
      const result = runTrustArchitecture(brief, blueprint);

      for (const el of result.trustElements) {
        expect(el).toHaveProperty('level');
        expect(el).toHaveProperty('name');
        expect(el).toHaveProperty('customerPsychology');
        expect(el).toHaveProperty('elements');
        expect(el).toHaveProperty('placement');
        expect(el).toHaveProperty('sectionOrder');
        expect(el.elements.length).toBeGreaterThan(0);
      }
    });
  });
});
