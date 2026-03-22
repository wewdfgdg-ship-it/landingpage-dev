import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { esc } from './utils';

// ============================================================
// Template: price-single-card
// 단일 가격 카드 (중앙 배치, 할인 전/후 표시)
// ============================================================

export const config: TemplateConfig = {
  patternId: 'price_single_card',
  name: '단일 가격 카드',
  category: 'pricing',
  description: '단일 가격 카드 중앙 배치 — 할인 전/후 가격 + 기능 리스트 + CTA',
  imageSpec: {
    required: false,
    aspectRatio: '1:1',
    cutout: false,
    maxWidth: 0,
  },
};

interface PriceInfo {
  original: string;
  current: string;
  hasDiscount: boolean;
}

function parsePrice(body: string): PriceInfo {
  // "99,000원 → 49,000원" 또는 "99,000원 > 49,000원" 형태
  const arrowMatch = body.match(/(\S+?원?)\s*[→>]\s*(\S+?원?)/);
  if (arrowMatch) {
    return { original: arrowMatch[1], current: arrowMatch[2], hasDiscount: true };
  }
  // "49,000원" 단일 가격
  const singleMatch = body.match(/([\d,]+\.?\d*\s*원)/);
  if (singleMatch) {
    return { original: '', current: singleMatch[1], hasDiscount: false };
  }
  return { original: '', current: body, hasDiscount: false };
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const sp = tokens.spacing;
  const r = tokens.radius;
  const tpl = 'price-single';
  const price = parsePrice(copy.body);
  const features = copy.bulletPoints.slice(0, 7);

  const featList = features
    .map((f) => `<li data-tpl-feat="${tpl}"><span data-tpl-check="${tpl}">\u2713</span>${esc(f)}</li>`)
    .join('\n        ');

  const priceBlock = price.hasDiscount
    ? `<p data-tpl-original="${tpl}">${esc(price.original)}</p>
      <p data-tpl-current="${tpl}">${esc(price.current)}</p>`
    : `<p data-tpl-current="${tpl}">${esc(price.current)}</p>`;

  return `<style>
  [data-tpl="${tpl}"] {
    padding: ${tokens.sectionPadding};
    background: ${c.surface};
    color: ${c.textPrimary};
  }
  [data-tpl-inner="${tpl}"] {
    max-width: 480px;
    margin: 0 auto;
    text-align: center;
  }
  [data-tpl-heading="${tpl}"] {
    font-size: ${tokens.typography.h2.size};
    font-weight: ${tokens.typography.h2.weight};
    line-height: ${tokens.typography.h2.lineHeight};
    margin-bottom: ${sp.sm}px;
    word-break: keep-all;
  }
  [data-tpl-sub="${tpl}"] {
    font-size: ${tokens.typography.body.size};
    color: ${c.textSecondary};
    margin-bottom: ${sp.xl}px;
  }
  [data-tpl-card="${tpl}"] {
    background: ${c.background};
    border-radius: ${r.xl}px;
    border: 2px solid ${c.primary};
    padding: ${sp['2xl']}px ${sp.xl}px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }
  [data-tpl-original="${tpl}"] {
    font-size: ${tokens.typography.body.size};
    color: ${c.textMuted};
    text-decoration: line-through;
    margin-bottom: ${sp.xs}px;
  }
  [data-tpl-current="${tpl}"] {
    font-size: ${tokens.typography.display.size};
    font-weight: ${tokens.typography.display.weight};
    color: ${c.primary};
    margin-bottom: ${sp.lg}px;
    line-height: 1.1;
  }
  [data-tpl-divider="${tpl}"] {
    width: 60px;
    height: 2px;
    background: ${c.border};
    margin: 0 auto ${sp.lg}px;
  }
  [data-tpl-features="${tpl}"] {
    list-style: none;
    padding: 0;
    margin: 0 0 ${sp.xl}px;
    text-align: left;
  }
  [data-tpl-feat="${tpl}"] {
    padding: ${sp.sm}px 0;
    font-size: ${tokens.typography.body.size};
    color: ${c.textSecondary};
    display: flex;
    align-items: center;
    gap: ${sp.sm}px;
    border-bottom: 1px solid ${c.border};
  }
  [data-tpl-feat="${tpl}"]:last-child {
    border-bottom: none;
  }
  [data-tpl-check="${tpl}"] {
    color: ${c.primary};
    font-weight: 700;
    flex-shrink: 0;
  }
  [data-tpl-cta="${tpl}"] {
    display: inline-block;
    width: 100%;
    padding: ${sp.md}px;
    background: ${c.primary};
    color: #fff;
    border: none;
    border-radius: ${r.md}px;
    text-decoration: none;
    font-weight: 600;
    font-size: ${tokens.typography.button.size};
    box-sizing: border-box;
    transition: opacity 0.2s;
  }
  [data-tpl-micro="${tpl}"] {
    margin-top: ${sp.sm}px;
    font-size: ${tokens.typography.caption.size};
    color: ${c.textMuted};
  }
  @media (max-width: 768px) {
    [data-tpl-inner="${tpl}"] {
      max-width: 100%;
      padding: 0 ${sp.md}px;
    }
  }
</style>
<section data-tpl="${tpl}">
  <div data-tpl-inner="${tpl}">
    <h2 data-tpl-heading="${tpl}">${esc(copy.headline)}</h2>
    <p data-tpl-sub="${tpl}">${esc(copy.subheadline)}</p>
    <div data-tpl-card="${tpl}">
      ${priceBlock}
      <div data-tpl-divider="${tpl}"></div>
      <ul data-tpl-features="${tpl}">
        ${featList}
      </ul>
      <a href="#cta" data-tpl-cta="${tpl}">${esc(copy.ctaText || '\uC2DC\uC791\uD558\uAE30')}</a>
      ${copy.microCopy ? `<p data-tpl-micro="${tpl}">${esc(copy.microCopy)}</p>` : ''}
    </div>
  </div>
</section>`;
}
