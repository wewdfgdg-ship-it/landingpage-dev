// ============================================================
// Template Engine — v2 템플릿 렌더링 + v1 fallback
// v2 레지스트리에 없는 패턴은 renderers.ts로 fallback
// ============================================================

import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import { getTemplate } from './template-registry';
import { renderByPatternId } from './renderers';

/**
 * patternId에 해당하는 섹션 HTML을 렌더링한다.
 *
 * 1. v2 레지스트리에서 템플릿 조회 → render() 호출
 * 2. v2에 없으면 v1 renderers.ts의 renderByPatternId()로 fallback
 */
export function renderSection(
  patternId: string,
  copy: CopyBlock,
  tokens: DesignTokens,
  order: number,
): string {
  const template = getTemplate(patternId);

  if (template) {
    return template.render(copy, tokens, order);
  }

  // v1 fallback — v2에 없는 패턴 (price_toggle, misc_team 등)
  return renderByPatternId(patternId, copy, tokens, order);
}
