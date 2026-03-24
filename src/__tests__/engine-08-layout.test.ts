import { describe, it, expect } from 'vitest';
import { runLayoutIntelligence } from '@/engine/08-layout-intelligence';
import { runAttentionArchitecture } from '@/engine/07-attention-architecture';
import { createMockBrief, createMockBlueprint } from './fixtures';

describe('Engine 08 — Layout Intelligence (레이아웃 지능)', () => {
  const brief = createMockBrief();
  const blueprint = createMockBlueprint();
  const attention = runAttentionArchitecture(brief, blueprint, 'saas');

  describe('기본 출력', () => {
    it('sections, diversityScore, mobileReadyScore를 반환한다', () => {
      const result = runLayoutIntelligence(brief, blueprint, attention);

      expect(result).toHaveProperty('sections');
      expect(result).toHaveProperty('diversityScore');
      expect(result).toHaveProperty('mobileReadyScore');
    });

    it('blueprint 섹션 수만큼 레이아웃을 생성한다', () => {
      const result = runLayoutIntelligence(brief, blueprint, attention);
      expect(result.sections.length).toBe(blueprint.structure.length);
    });
  });

  describe('점수 범위', () => {
    it('diversityScore는 0~100 범위다', () => {
      const result = runLayoutIntelligence(brief, blueprint, attention);
      expect(result.diversityScore).toBeGreaterThanOrEqual(0);
      expect(result.diversityScore).toBeLessThanOrEqual(100);
    });

    it('mobileReadyScore는 0~100 범위다', () => {
      const result = runLayoutIntelligence(brief, blueprint, attention);
      expect(result.mobileReadyScore).toBeGreaterThanOrEqual(0);
      expect(result.mobileReadyScore).toBeLessThanOrEqual(100);
    });
  });

  describe('섹션 속성', () => {
    it('각 섹션은 필수 필드를 가진다', () => {
      const result = runLayoutIntelligence(brief, blueprint, attention);

      for (const section of result.sections) {
        expect(section).toHaveProperty('order');
        expect(section).toHaveProperty('role');
        expect(section).toHaveProperty('sectionType');
        expect(section).toHaveProperty('selectedPattern');
        expect(section).toHaveProperty('patternName');
        expect(section).toHaveProperty('score');
        expect(section).toHaveProperty('reasoning');
        expect(section.score).toBeGreaterThan(0);
      }
    });

    it('order는 blueprint 순서와 일치한다', () => {
      const result = runLayoutIntelligence(brief, blueprint, attention);
      const orders = result.sections.map((s) => s.order);
      const expected = blueprint.structure.map((s) => s.order);
      expect(orders).toEqual(expected);
    });
  });

  describe('시각적 다양성', () => {
    it('중복 패턴이 최소화된다', () => {
      const result = runLayoutIntelligence(brief, blueprint, attention);
      const patterns = result.sections.map((s) => s.selectedPattern);
      const unique = new Set(patterns);
      // 최소 50% 이상은 고유 패턴
      expect(unique.size / patterns.length).toBeGreaterThanOrEqual(0.5);
    });
  });
});
