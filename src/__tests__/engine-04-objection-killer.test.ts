import { describe, it, expect } from 'vitest';
import { runObjectionKiller } from '@/engine/04-objection-killer';
import { createMockBrief, createHighResistanceBrief, createImpulseBrief, createMockBlueprint } from './fixtures';

describe('Engine 04 — Objection Killer (반론 파괴)', () => {
  const blueprint = createMockBlueprint();

  describe('활성화 규칙', () => {
    it('저항 레벨 3 이상인 항목만 활성화된다', () => {
      const brief = createMockBrief(); // price:3, need:3
      const result = runObjectionKiller(brief, blueprint);

      const types = result.activeObjections.map((o) => o.type);
      expect(types).toContain('price');
      expect(types).toContain('need');
      expect(types).not.toContain('trust'); // level 2
      expect(types).not.toContain('urgency'); // level 2
      expect(types).not.toContain('complexity'); // level 1
    });

    it('모든 저항이 낮으면 빈 배열을 반환한다', () => {
      const brief = createImpulseBrief(); // 모든 저항 1~2
      const result = runObjectionKiller(brief, blueprint);
      expect(result.activeObjections).toHaveLength(0);
    });

    it('모든 저항이 높으면 5개 모두 활성화된다', () => {
      const brief = createHighResistanceBrief();
      const result = runObjectionKiller(brief, blueprint);
      expect(result.activeObjections.length).toBe(5);
    });
  });

  describe('정렬 규칙', () => {
    it('높은 저항 레벨이 먼저 온다', () => {
      const brief = createHighResistanceBrief();
      const result = runObjectionKiller(brief, blueprint);

      for (let i = 1; i < result.activeObjections.length; i++) {
        expect(result.activeObjections[i - 1].level).toBeGreaterThanOrEqual(
          result.activeObjections[i].level,
        );
      }
    });
  });

  describe('전략 수 결정', () => {
    it('저항 레벨 3이면 전략 2개', () => {
      const brief = createMockBrief(); // price:3
      const result = runObjectionKiller(brief, blueprint);
      const priceObj = result.activeObjections.find((o) => o.type === 'price');
      expect(priceObj?.strategies).toHaveLength(2);
    });

    it('저항 레벨 5이면 전략 4개', () => {
      const brief = createHighResistanceBrief(); // price:5
      const result = runObjectionKiller(brief, blueprint);
      const priceObj = result.activeObjections.find((o) => o.type === 'price');
      expect(priceObj?.strategies).toHaveLength(4);
    });
  });

  describe('주입 위치', () => {
    it('injectAt 배열이 비어있지 않다', () => {
      const brief = createHighResistanceBrief();
      const result = runObjectionKiller(brief, blueprint);

      for (const obj of result.activeObjections) {
        expect(obj.injectAt.length).toBeGreaterThan(0);
      }
    });

    it('copyDirection이 빈 문자열이 아니다', () => {
      const brief = createHighResistanceBrief();
      const result = runObjectionKiller(brief, blueprint);

      for (const obj of result.activeObjections) {
        expect(obj.copyDirection.length).toBeGreaterThan(0);
      }
    });
  });
});
