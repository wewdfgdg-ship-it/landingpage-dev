// ============================================================
// Hero Template: Left-Right — 좌측 텍스트 + 우측 이미지
// ============================================================

import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { bullets, ctaButton, esc, imageBlock } from './utils';

export const config: TemplateConfig = {
  patternId: 'hero_left_right',
  name: '좌우 분할 히어로',
  category: 'hero',
  description: '좌측 텍스트 + 우측 이미지 레이아웃. 커터아웃(투명 배경) 또는 풀 이미지 지원. 모바일에서 수직 스택.',
  imageSpec: {
    required: true,
    aspectRatio: '4:3',
    cutout: true,
    maxWidth: 600,
  },
};

const SCOPE = 'data-tpl-hero-lr';

function scopedCss(tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;

  return `
<style>
  [${SCOPE}] {
    display: flex;
    flex-wrap: wrap;
    min-height: 90vh;
    align-items: center;
    padding: 80px 24px;
    background: ${c.background};
    color: ${c.textPrimary};
  }
  [${SCOPE}] .hero-lr__text {
    flex: 1 1 400px;
    min-width: 0;
    padding: 40px 32px 40px 0;
  }
  [${SCOPE}] .hero-lr__headline {
    font-size: ${t.h1.size};
    font-weight: ${t.h1.weight};
    line-height: ${t.h1.lineHeight};
    margin: 0 0 16px;
    color: ${c.textPrimary};
    word-break: keep-all;
  }
  [${SCOPE}] .hero-lr__subheadline {
    font-size: ${t.h3.size};
    font-weight: ${t.h3.weight};
    line-height: ${t.h3.lineHeight};
    color: ${c.textSecondary};
    margin: 0 0 16px;
  }
  [${SCOPE}] .hero-lr__body {
    font-size: ${t.body.size};
    line-height: ${t.body.lineHeight};
    color: ${c.textSecondary};
    margin: 0 0 24px;
  }
  [${SCOPE}] .hero-lr__bullets {
    margin-bottom: 32px;
  }
  [${SCOPE}] .hero-lr__cta {
    margin-top: 8px;
  }
  [${SCOPE}] .hero-lr__image {
    flex: 1 1 400px;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0 40px 32px;
  }
  @media (max-width: 768px) {
    [${SCOPE}] {
      min-height: auto;
      padding: 48px 16px;
    }
    [${SCOPE}] .hero-lr__text {
      flex-basis: 100%;
      padding: 0 0 32px;
    }
    [${SCOPE}] .hero-lr__headline {
      font-size: 2rem;
    }
    [${SCOPE}] .hero-lr__image {
      flex-basis: 100%;
      padding: 0;
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
  <div class="hero-lr__text">
    <h1 class="hero-lr__headline">${esc(copy.headline)}</h1>
    <p class="hero-lr__subheadline">${esc(copy.subheadline)}</p>
    <p class="hero-lr__body">${esc(copy.body)}</p>
    ${hasBullets ? `<div class="hero-lr__bullets">${bullets(copy.bulletPoints)}</div>` : ''}
    <div class="hero-lr__cta">
      ${ctaButton(copy.ctaText, c, copy.microCopy)}
    </div>
  </div>
  <div class="hero-lr__image">
    ${imageBlock(copy, c, { maxWidth: '500px', cutout: config.imageSpec.cutout })}
  </div>
</section>`;
}
