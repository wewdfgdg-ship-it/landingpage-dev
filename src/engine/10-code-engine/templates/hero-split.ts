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
    min-height: 70vh;
    background: ${c.background};
    color: ${c.textPrimary};
    overflow: hidden;
  }
  [${SCOPE}] .hero-sp__left {
    flex: 1 1 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 72px;
    background: linear-gradient(160deg, ${c.primaryDark} 0%, ${c.primary} 100%);
    color: #fff;
    position: relative;
  }
  [${SCOPE}] .hero-sp__text {
    max-width: 100%;
    position: relative;
    z-index: 2;
  }
  [${SCOPE}] .hero-sp__headline {
    font-size: clamp(3.5rem, 7vw, 6rem);
    font-weight: 900;
    line-height: 1.0;
    margin: 0 0 40px;
    color: #fff;
    word-break: keep-all;
    letter-spacing: -0.02em;
  }
  [${SCOPE}] .hero-sp__subheadline {
    font-size: clamp(1.2rem, 2vw, 1.6rem);
    font-weight: 400;
    line-height: 1.6;
    color: rgba(255,255,255,0.92);
    margin: 0 0 48px;
    word-break: keep-all;
  }
  [${SCOPE}] .hero-sp__cta a {
    background: #fff !important;
    color: ${c.primary} !important;
    padding: 22px 56px !important;
    font-size: 1.35rem !important;
    font-weight: 700 !important;
    border-radius: 12px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    transition: transform 0.2s, box-shadow 0.2s !important;
  }
  [${SCOPE}] .hero-sp__cta a:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0,0,0,0.2);
  }
  [${SCOPE}] .hero-sp__cta p {
    color: rgba(255,255,255,0.75) !important;
    margin-top: 14px !important;
    font-size: 1.1rem !important;
  }
  [${SCOPE}] .hero-sp__right {
    flex: 1 1 50%;
    position: relative;
    min-height: 70vh;
    overflow: hidden;
  }
  [${SCOPE}] .hero-sp__image-wrap {
    position: absolute;
    inset: 0;
  }
  [${SCOPE}] .hero-sp__image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
  }
  [${SCOPE}] .hero-sp__image-wrap > div {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  @media (max-width: 768px) {
    [${SCOPE}] {
      flex-direction: column;
      min-height: 70vh;
    }
    [${SCOPE}] .hero-sp__left {
      padding: 64px 24px;
    }
    [${SCOPE}] .hero-sp__headline {
      font-size: 2rem;
    }
    [${SCOPE}] .hero-sp__right {
      min-height: 50vh;
      position: relative;
    }
  }
</style>`;
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const css = scopedCss(tokens);

  return `${css}
<section ${SCOPE}>
  <div class="hero-sp__left">
    <div class="hero-sp__text">
      <h1 class="hero-sp__headline">${esc(copy.headline)}</h1>
      <p class="hero-sp__subheadline">${esc(copy.subheadline)}</p>
      <div class="hero-sp__cta">
        ${ctaButton(copy.ctaText, c, copy.microCopy)}
      </div>
    </div>
  </div>
  <div class="hero-sp__right">
    <div class="hero-sp__image-wrap">
      ${imageBlock(copy, c, { aspectRatio: 'auto', borderRadius: '0' })}
    </div>
  </div>
</section>`;
}
