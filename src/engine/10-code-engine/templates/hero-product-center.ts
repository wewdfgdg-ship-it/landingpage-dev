// ============================================================
// Hero Template: Product Center — 제품 이미지 중앙 배치
// ============================================================

import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { ctaButton, esc, imageBlock, shadowCss } from './utils';

export const config: TemplateConfig = {
  patternId: 'hero_product_center',
  name: '제품 중앙 히어로',
  category: 'hero',
  description: '상단 헤드라인 + 중앙 제품 이미지 + 하단 CTA. 제품 이미지에 그림자/플로팅 효과.',
  imageSpec: {
    required: true,
    aspectRatio: '1:1',
    cutout: true,
    maxWidth: 480,
  },
};

const SCOPE = 'data-tpl-hero-pc';

function scopedCss(tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;
  const shadow = shadowCss(tokens.defaultShadow === 'none' ? 'lg' : tokens.defaultShadow);

  return `
<style>
  [${SCOPE}] {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 24px;
    background: ${c.background};
    color: ${c.textPrimary};
  }
  [${SCOPE}] .hero-pc__header {
    max-width: 640px;
    margin-bottom: 48px;
  }
  [${SCOPE}] .hero-pc__headline {
    font-size: ${t.display.size};
    font-weight: ${t.display.weight};
    line-height: ${t.display.lineHeight};
    margin: 0 0 16px;
    color: ${c.textPrimary};
    word-break: keep-all;
  }
  [${SCOPE}] .hero-pc__subheadline {
    font-size: ${t.h3.size};
    font-weight: ${t.h3.weight};
    line-height: ${t.h3.lineHeight};
    color: ${c.textSecondary};
    margin: 0;
  }
  [${SCOPE}] .hero-pc__product {
    position: relative;
    max-width: 480px;
    width: 100%;
    margin-bottom: 48px;
  }
  [${SCOPE}] .hero-pc__product-float {
    animation: hero-pc-float 3s ease-in-out infinite;
    filter: drop-shadow(${shadow});
  }
  [${SCOPE}] .hero-pc__product-float img,
  [${SCOPE}] .hero-pc__product-float > div {
    width: 100%;
  }
  [${SCOPE}] .hero-pc__glow {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 32px;
    background: radial-gradient(ellipse, ${c.primary}22 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  [${SCOPE}] .hero-pc__footer {
    max-width: 480px;
  }
  [${SCOPE}] .hero-pc__body {
    font-size: ${t.body.size};
    line-height: ${t.body.lineHeight};
    color: ${c.textSecondary};
    margin: 0 0 32px;
  }
  @keyframes hero-pc-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @media (max-width: 768px) {
    [${SCOPE}] {
      min-height: auto;
      padding: 48px 16px;
    }
    [${SCOPE}] .hero-pc__headline {
      font-size: 2rem;
    }
    [${SCOPE}] .hero-pc__product {
      max-width: 320px;
      margin-bottom: 32px;
    }
    [${SCOPE}] .hero-pc__header {
      margin-bottom: 32px;
    }
  }
</style>`;
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const css = scopedCss(tokens);

  return `${css}
<section ${SCOPE}>
  <div class="hero-pc__header">
    <h1 class="hero-pc__headline">${esc(copy.headline)}</h1>
    <p class="hero-pc__subheadline">${esc(copy.subheadline)}</p>
  </div>
  <div class="hero-pc__product">
    <div class="hero-pc__product-float">
      ${imageBlock(copy, c, { maxWidth: '480px', aspectRatio: '1/1', cutout: true, borderRadius: '16px' })}
    </div>
    <div class="hero-pc__glow"></div>
  </div>
  <div class="hero-pc__footer">
    <p class="hero-pc__body">${esc(copy.body)}</p>
    ${ctaButton(copy.ctaText, c, copy.microCopy)}
  </div>
</section>`;
}
