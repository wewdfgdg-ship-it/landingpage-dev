import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { esc } from './utils';

// ============================================================
// Feature Template — 수직 아이콘 리스트
// ============================================================

export const config: TemplateConfig = {
  patternId: 'feat_icon_list',
  name: '수직 아이콘 리스트',
  category: 'feature',
  description: '수직으로 나열된 아이콘 리스트. 각 항목에 체크 아이콘과 텍스트. 좌측 라인으로 항목 연결.',
  imageSpec: {
    required: false,
    aspectRatio: '1:1',
    cutout: false,
    maxWidth: 0,
  },
};

const SCOPE = 'data-tpl-featicon';

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;
  const sp = tokens.spacing;
  const r = tokens.radius;

  const items = copy.bulletPoints.slice(0, 8);

  const listItems = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      return `<li ${SCOPE}-item>
        <div ${SCOPE}-icon-wrap>
          <div ${SCOPE}-icon-circle>
            <svg ${SCOPE}-icon-svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          ${!isLast ? `<div ${SCOPE}-line></div>` : ''}
        </div>
        <div ${SCOPE}-content>
          <p ${SCOPE}-item-text>${esc(item)}</p>
        </div>
      </li>`;
    })
    .join('');

  const emptyState = items.length === 0
    ? `<p ${SCOPE}-empty>${esc(copy.body)}</p>`
    : '';

  const css = `<style>
[${SCOPE}] {
  padding: ${tokens.sectionPadding};
  background: ${c.surface};
  color: ${c.textPrimary};
}
[${SCOPE}-inner] {
  max-width: 640px;
  margin: 0 auto;
}
[${SCOPE}-title] {
  font-size: ${t.h2.size};
  font-weight: ${t.h2.weight};
  line-height: ${t.h2.lineHeight};
  text-align: center;
  margin: 0 0 ${sp.sm}px 0;
  word-break: keep-all;
}
[${SCOPE}-subtitle] {
  font-size: ${t.body.size};
  color: ${c.textSecondary};
  text-align: center;
  line-height: ${t.body.lineHeight};
  margin: 0 0 ${sp.xl}px 0;
}
[${SCOPE}-list] {
  list-style: none;
  padding: 0;
  margin: 0;
}
[${SCOPE}-item] {
  display: flex;
  gap: ${sp.md}px;
}
[${SCOPE}-icon-wrap] {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
[${SCOPE}-icon-circle] {
  width: 32px;
  height: 32px;
  border-radius: ${r.full}px;
  background: ${c.primaryLight};
  color: ${c.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
[${SCOPE}-line] {
  width: 2px;
  flex: 1;
  background: ${c.border};
  min-height: ${sp.md}px;
}
[${SCOPE}-content] {
  padding-bottom: ${sp.lg}px;
  padding-top: 4px;
}
[${SCOPE}-item-text] {
  font-size: ${t.body.size};
  font-weight: ${t.body.weight};
  line-height: ${t.body.lineHeight};
  margin: 0;
}
[${SCOPE}-empty] {
  font-size: ${t.body.size};
  color: ${c.textSecondary};
  text-align: center;
}
@media (max-width: 768px) {
  [${SCOPE}-title] {
    font-size: 1.5rem;
  }
  [${SCOPE}-inner] {
    max-width: 100%;
  }
}
</style>`;

  return `${css}
<section ${SCOPE}>
  <div ${SCOPE}-inner>
    <h2 ${SCOPE}-title>${esc(copy.headline)}</h2>
    <p ${SCOPE}-subtitle>${esc(copy.subheadline)}</p>
    <ul ${SCOPE}-list>
      ${listItems}${emptyState}
    </ul>
  </div>
</section>`;
}
