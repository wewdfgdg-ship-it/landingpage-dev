import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

// ============================================================
// Feature Template — 3열 그리드 특징 카드
// ============================================================

export interface TemplateConfig {
  patternId: string;
  name: string;
  category: 'hero' | 'feature' | 'proof' | 'pricing' | 'cta' | 'faq' | 'misc';
  description: string;
  imageSpec: {
    required: boolean;
    aspectRatio: string;
    cutout: boolean;
    maxWidth: number;
  };
}

export const config: TemplateConfig = {
  patternId: 'feat_3col_grid',
  name: '3열 그리드 카드',
  category: 'feature',
  description: '3열 그리드로 특징 카드를 배치. 각 카드에 아이콘/이미지, 제목, 설명 포함. 호버 시 그림자 상승 효과.',
  imageSpec: {
    required: false,
    aspectRatio: '1:1',
    cutout: false,
    maxWidth: 80,
  },
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const SCOPE = 'data-tpl-feat3col';

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;
  const sp = tokens.spacing;
  const r = tokens.radius;

  const items = copy.bulletPoints.slice(0, 6);
  const iconPool = ['💡', '⚡', '🎯', '🔒', '📊', '🚀'];

  const cards = items
    .map((item, i) => {
      const icon = iconPool[i % iconPool.length];
      return `<div ${SCOPE}-card>
        <div ${SCOPE}-icon>${icon}</div>
        <h3 ${SCOPE}-card-title>${esc(item)}</h3>
        <p ${SCOPE}-card-desc>${esc(copy.body)}</p>
      </div>`;
    })
    .join('');

  const emptyState = items.length === 0
    ? `<p ${SCOPE}-empty>${esc(copy.body)}</p>`
    : '';

  const css = `<style>
[${SCOPE}] {
  padding: ${tokens.sectionPadding};
  background: ${c.background};
  color: ${c.textPrimary};
}
[${SCOPE}-inner] {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}
[${SCOPE}-title] {
  font-size: ${t.h2.size};
  font-weight: ${t.h2.weight};
  line-height: ${t.h2.lineHeight};
  margin: 0 0 ${sp.sm}px 0;
}
[${SCOPE}-subtitle] {
  font-size: ${t.body.size};
  color: ${c.textSecondary};
  margin: 0 0 ${sp.xl}px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
[${SCOPE}-grid] {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${sp.lg}px;
}
[${SCOPE}-card] {
  padding: ${sp.lg}px;
  background: ${c.surface};
  border-radius: ${r.lg}px;
  border: 1px solid ${c.border};
  text-align: center;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  cursor: default;
}
[${SCOPE}-card]:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transform: translateY(-4px);
}
[${SCOPE}-icon] {
  font-size: 2rem;
  margin-bottom: ${sp.sm}px;
}
[${SCOPE}-card-title] {
  font-size: ${t.h4.size};
  font-weight: ${t.h4.weight};
  line-height: ${t.h4.lineHeight};
  margin: 0 0 ${sp.xs}px 0;
}
[${SCOPE}-card-desc] {
  font-size: ${t.small.size};
  color: ${c.textSecondary};
  line-height: ${t.small.lineHeight};
  margin: 0;
}
[${SCOPE}-empty] {
  font-size: ${t.body.size};
  color: ${c.textSecondary};
}
@media (max-width: 768px) {
  [${SCOPE}-grid] {
    grid-template-columns: 1fr;
    gap: ${sp.md}px;
  }
  [${SCOPE}-title] {
    font-size: 1.5rem;
  }
}
</style>`;

  return `${css}
<section ${SCOPE}>
  <div ${SCOPE}-inner>
    <h2 ${SCOPE}-title>${esc(copy.headline)}</h2>
    <p ${SCOPE}-subtitle>${esc(copy.subheadline)}</p>
    <div ${SCOPE}-grid>
      ${cards}${emptyState}
    </div>
  </div>
</section>`;
}
