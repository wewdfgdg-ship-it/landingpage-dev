import { describe, it, expect } from 'vitest';
import { runAttentionArchitecture } from '@/engine/07-attention-architecture';
import { createMockBrief, createHighResistanceBrief, createMockBlueprint } from './fixtures';

describe('Engine 07 — Attention Architecture (주의력 설계)', () => {
  const blueprint = createMockBlueprint();

  describe('Hook 유형 선택', () => {
    it('analytical → question_hook', () => {
      const brief = createMockBrief({ decisionType: 'analytical' });
      const result = runAttentionArchitecture(brief, blueprint, 'saas');
      expect(result.hookType).toBe('question_hook');
    });

    it('impulse → visual_hook', () => {
      const brief = createMockBrief({ decisionType: 'impulse' });
      const result = runAttentionArchitecture(brief, blueprint, 'ecommerce');
      expect(result.hookType).toBe('visual_hook');
    });

    it('cautious → result_hook', () => {
      const brief = createMockBrief({ decisionType: 'cautious' });
      const result = runAttentionArchitecture(brief, blueprint, 'health');
      expect(result.hookType).toBe('result_hook');
    });

    it('follower → social_hook', () => {
      const brief = createMockBrief({ decisionType: 'follower' });
      const result = runAttentionArchitecture(brief, blueprint, 'beauty');
      expect(result.hookType).toBe('social_hook');
    });
  });

  describe('시선 패턴', () => {
    it('SaaS → f_pattern', () => {
      const brief = createMockBrief();
      const result = runAttentionArchitecture(brief, blueprint, 'saas');
      expect(result.gazePattern).toBe('f_pattern');
    });

    it('ecommerce → z_pattern', () => {
      const brief = createMockBrief();
      const result = runAttentionArchitecture(brief, blueprint, 'ecommerce');
      expect(result.gazePattern).toBe('z_pattern');
    });

    it('lifestyle → center_focus', () => {
      const brief = createMockBrief();
      const result = runAttentionArchitecture(brief, blueprint, 'lifestyle');
      expect(result.gazePattern).toBe('center_focus');
    });

    it('알 수 없는 업종 → z_pattern 기본값', () => {
      const brief = createMockBrief();
      const result = runAttentionArchitecture(brief, blueprint, 'unknown_industry');
      expect(result.gazePattern).toBe('z_pattern');
    });
  });

  describe('4 Zone 구조', () => {
    it('항상 4개 Zone을 생성한다', () => {
      const brief = createMockBrief();
      const result = runAttentionArchitecture(brief, blueprint, 'saas');
      expect(result.zones).toHaveLength(4);
    });

    it('Zone 이름은 first_view, interest, desire, action 순서다', () => {
      const brief = createMockBrief();
      const result = runAttentionArchitecture(brief, blueprint, 'saas');
      const names = result.zones.map((z) => z.zone);
      expect(names).toEqual(['first_view', 'interest', 'desire', 'action']);
    });

    it('Zone의 pixelRange가 연속적이다', () => {
      const brief = createMockBrief();
      const result = runAttentionArchitecture(brief, blueprint, 'saas');

      for (let i = 1; i < result.zones.length; i++) {
        expect(result.zones[i].pixelRange.start).toBe(result.zones[i - 1].pixelRange.end);
      }
    });
  });

  describe('Sticky CTA & Exit Intent', () => {
    it('urgency 저항 4 이상이면 stickyCtaEnabled', () => {
      const brief = createHighResistanceBrief(); // urgency:5
      const result = runAttentionArchitecture(brief, blueprint, 'saas');
      expect(result.stickyCtaEnabled).toBe(true);
    });

    it('price 저항 4 이상이면 exitIntentEnabled', () => {
      const brief = createHighResistanceBrief(); // price:5
      const result = runAttentionArchitecture(brief, blueprint, 'saas');
      expect(result.exitIntentEnabled).toBe(true);
    });

    it('낮은 저항이면 둘 다 비활성', () => {
      const brief = createMockBrief({
        resistanceMap: {
          price: { level: 1, reason: '' },
          trust: { level: 1, reason: '' },
          need: { level: 1, reason: '' },
          urgency: { level: 1, reason: '' },
          complexity: { level: 1, reason: '' },
        },
      });
      const result = runAttentionArchitecture(brief, createMockBlueprint({ totalSections: 5 }), 'saas');
      expect(result.stickyCtaEnabled).toBe(false);
      expect(result.exitIntentEnabled).toBe(false);
    });
  });
});
