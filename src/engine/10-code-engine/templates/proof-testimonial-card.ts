import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

// ============================================================
// Template: proof-testimonial-card
// 고객 후기 카드 그리드 (2~3열)
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
  patternId: 'proof_testimonial_card',
  name: '고객 후기 카드 그리드',
  category: 'proof',
  description: '별점 + 후기 텍스트 + 고객명이 포함된 카드 그리드 (2~3열)',
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

function renderStars(count: number): string {
  const filled = Math.min(Math.max(Math.round(count), 0), 5);
  const empty = 5 - filled;
  return '<span aria-label="' + filled + '점">' + '★'.repeat(filled) + '☆'.repeat(empty) + '</span>';
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const sp = tokens.spacing;
  const r = tokens.radius;
  const tpl = 'proof-testimonial';
  const items = copy.bulletPoints.slice(0, 5);

  if (!items.length) {
    return '';
  }

  const cards = items
    .map(
      (item, i) =>
        `<div data-tpl-card="${tpl}">
      <div data-tpl-quote="${tpl}">\u201C</div>
      <div data-tpl-stars="${tpl}">${renderStars(5)}</div>
      <p data-tpl-text="${tpl}">${esc(item)}</p>
      <p data-tpl-author="${tpl}">\u2014 고객 ${i + 1}</p>
    </div>`,
    )
    .join('\n      ');

  return `<style>
  [data-tpl="${tpl}"] {
    padding: ${tokens.sectionPadding};
    background: ${c.surface};
    color: ${c.textPrimary};
  }
  [data-tpl-inner="${tpl}"] {
    max-width: 1100px;
    margin: 0 auto;
    text-align: center;
  }
  [data-tpl-heading="${tpl}"] {
    font-size: ${tokens.typography.h2.size};
    font-weight: ${tokens.typography.h2.weight};
    line-height: ${tokens.typography.h2.lineHeight};
    margin-bottom: ${sp.xl}px;
  }
  [data-tpl-grid="${tpl}"] {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${sp.lg}px;
  }
  [data-tpl-card="${tpl}"] {
    position: relative;
    padding: ${sp.xl}px ${sp.lg}px;
    background: ${c.background};
    border-radius: ${r.lg}px;
    border: 1px solid ${c.border};
    text-align: left;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  [data-tpl-quote="${tpl}"] {
    position: absolute;
    top: ${sp.md}px;
    right: ${sp.lg}px;
    font-size: 3rem;
    line-height: 1;
    color: ${c.primaryLight};
    opacity: 0.4;
    pointer-events: none;
  }
  [data-tpl-stars="${tpl}"] {
    color: #f59e0b;
    font-size: 1rem;
    margin-bottom: ${sp.sm}px;
    letter-spacing: 2px;
  }
  [data-tpl-text="${tpl}"] {
    font-size: ${tokens.typography.body.size};
    line-height: ${tokens.typography.body.lineHeight};
    color: ${c.textSecondary};
    font-style: italic;
    margin-bottom: ${sp.md}px;
  }
  [data-tpl-author="${tpl}"] {
    font-size: ${tokens.typography.small.size};
    font-weight: 600;
    color: ${c.textPrimary};
  }
  @media (max-width: 768px) {
    [data-tpl-grid="${tpl}"] {
      grid-template-columns: 1fr;
    }
  }
</style>
<section data-tpl="${tpl}">
  <div data-tpl-inner="${tpl}">
    <h2 data-tpl-heading="${tpl}">${esc(copy.headline)}</h2>
    <div data-tpl-grid="${tpl}">
      ${cards}
    </div>
  </div>
</section>`;
}
