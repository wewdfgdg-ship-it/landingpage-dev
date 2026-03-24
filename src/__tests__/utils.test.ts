import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn() — 클래스명 병합 유틸리티', () => {
  it('단일 클래스를 반환한다', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('여러 클래스를 합친다', () => {
    expect(cn('p-4', 'mt-2')).toBe('p-4 mt-2');
  });

  it('Tailwind 충돌 클래스를 병합한다', () => {
    // p-4와 p-2가 겹치면 나중 것이 우선
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('조건부 클래스를 처리한다', () => {
    expect(cn('base', false && 'hidden', true && 'block')).toBe('base block');
  });

  it('undefined, null을 무시한다', () => {
    expect(cn('text-sm', undefined, null, 'font-bold')).toBe('text-sm font-bold');
  });

  it('빈 입력은 빈 문자열을 반환한다', () => {
    expect(cn()).toBe('');
  });
});
