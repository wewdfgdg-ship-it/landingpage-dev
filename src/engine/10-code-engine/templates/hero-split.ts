// ============================================================
// Hero Template: Split — 50:50 분할 레이아웃
// ============================================================

import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { bullets, ctaButton, esc, imageBlock } from './utils';

export const config: TemplateConfig = {
  patternId: 'hero_split',
  name: '50:50 분할 히어로',
  category: 'hero',
  description: '좌측 풀컬러 배경 + 우측 이미지. 대각선 또는 곡선 분할 옵션. 강렬한 비주얼 임팩트.',
  imageSpec: {
    required: true,
    aspectRatio: '3:4',
    cutout: false,
    maxWidth: 960,
  },
};

const SCOPE = 'data-tpl-hero-sp';

function scopedCss(tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;

  return `
<style>
  [${SCOPE}] {
    display: flex;
    min-height: 100vh;
    background: ${c.background};
    color: ${c.textPrimary};
    overflow: hidden;
  }
  [${SCOPE}] .hero-sp__left {
    flex: 1 1 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 48px;
    background: ${c.primary};
    color: #fff;
    position: relative;
  }
  [${SCOPE}] .hero-sp__left::after {
    content: '';
    position: absolute;
    top: 0;
    right: -40px;
    width: 80px;
    height: 100%;
    background: ${c.primary};
    clip-path: ellipse(50% 55% at 0% 50%);
    z-index: 1;
  }
  [${SCOPE}] .hero-sp__text {
    max-width: 480px;
    position: relative;
    z-index: 2;
  }
  [${SCOPE}] .hero-sp__headline {
    font-size: ${t.h1.size};
    font-weight: ${t.h1.weight};
    line-height: ${t.h1.lineHeight};
    margin: 0 0 16px;
    color: #fff;
    word-break: keep-all;
  }
  [${SCOPE}] .hero-sp__subheadline {
    font-size: ${t.h3.size};
    font-weight: ${t.h3.weight};
    line-height: ${t.h3.lineHeight};
    color: rgba(255,255,255,0.85);
    margin: 0 0 16px;
  }
  [${SCOPE}] .hero-sp__body {
    font-size: ${t.body.size};
    line-height: ${t.body.lineHeight};
    color: rgba(255,255,255,0.8);
    margin: 0 0 24px;
  }
  [${SCOPE}] .hero-sp__bullets ul {
    color: rgba(255,255,255,0.9);
    margin-bottom: 32px;
  }
  [${SCOPE}] .hero-sp__cta a {
    background: #fff !important;
    color: ${c.primary} !important;
  }
  [${SCOPE}] .hero-sp__cta p {
    color: rgba(255,255,255,0.7) !important;
  }
  [${SCOPE}] .hero-sp__right {
    flex: 1 1 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
  }
  [${SCOPE}] .hero-sp__image-wrap {
    width: 100%;
    max-width: 560px;
  }
  [${SCOPE}] .hero-sp__image-wrap img,
  [${SCOPE}] .hero-sp__image-wrap > div {
    width: 100%;
    border-radius: ${tokens.radius.lg}px;
  }
  @media (max-width: 768px) {
    [${SCOPE}] {
      flex-direction: column;
      min-height: auto;
    }
    [${SCOPE}] .hero-sp__left {
      padding: 48px 24px;
    }
    [${SCOPE}] .hero-sp__left::after {
      display: none;
    }
    [${SCOPE}] .hero-sp__headline {
      font-size: 2rem;
    }
    [${SCOPE}] .hero-sp__right {
      padding: 24px 16px 48px;
    }
  }
</style>`;
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const css = scopedCss(tokens);
  const hasBullets = copy.bulletPoints.length > 0;

  return `${css}
<section ${SCOPE}>
  <div class="hero-sp__left">
    <div class="hero-sp__text">
      <h1 class="hero-sp__headline">${esc(copy.headline)}</h1>
      <p class="hero-sp__subheadline">${esc(copy.subheadline)}</p>
      <p class="hero-sp__body">${esc(copy.body)}</p>
      ${hasBullets ? `<div class="hero-sp__bullets">${bullets(copy.bulletPoints)}</div>` : ''}
      <div class="hero-sp__cta">
        ${ctaButton(copy.ctaText, c, copy.microCopy)}
      </div>
    </div>
  </div>
  <div class="hero-sp__right">
    <div class="hero-sp__image-wrap">
      ${imageBlock(copy, c, { aspectRatio: '3/4', borderRadius: `${tokens.radius.lg}px` })}
    </div>
  </div>
</section>`;
}
