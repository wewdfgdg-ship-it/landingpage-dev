// ============================================================
// Hero Template: Fullscreen Center — 전체 화면 중앙 정렬
// ============================================================

import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { ctaButton, esc } from './utils';

export const config: TemplateConfig = {
  patternId: 'hero_fullscreen_center',
  name: '전체 화면 중앙 정렬 히어로',
  category: 'hero',
  description: '100vh 전체 화면에 대형 타이포그래피 중앙 배치. 그라디언트 오버레이 옵션. 임팩트 있는 첫인상.',
  imageSpec: {
    required: false,
    aspectRatio: '16:9',
    cutout: false,
    maxWidth: 1920,
  },
};

const SCOPE = 'data-tpl-hero-fc';

function scopedCss(tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;

  return `
<style>
  [${SCOPE}] {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 24px;
    background: ${c.background};
    color: ${c.textPrimary};
    position: relative;
    overflow: hidden;
  }
  [${SCOPE}] .hero-fc__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      ${c.primaryDark}18 0%,
      ${c.background} 100%
    );
    pointer-events: none;
  }
  [${SCOPE}] .hero-fc__content {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }
  [${SCOPE}] .hero-fc__headline {
    font-size: ${t.display.size};
    font-weight: ${t.display.weight};
    line-height: ${t.display.lineHeight};
    margin: 0 0 16px;
    color: ${c.textPrimary};
    word-break: keep-all;
  }
  [${SCOPE}] .hero-fc__subheadline {
    font-size: ${t.h3.size};
    font-weight: ${t.h3.weight};
    line-height: ${t.h3.lineHeight};
    color: ${c.textSecondary};
    margin: 0 0 24px;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
  }
  [${SCOPE}] .hero-fc__body {
    font-size: ${t.body.size};
    line-height: ${t.body.lineHeight};
    color: ${c.textSecondary};
    margin: 0 0 40px;
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }
  [${SCOPE}] .hero-fc__cta {
    margin-top: 8px;
  }
  @media (max-width: 768px) {
    [${SCOPE}] {
      min-height: 90vh;
      padding: 48px 16px;
    }
    [${SCOPE}] .hero-fc__headline {
      font-size: 2rem;
    }
    [${SCOPE}] .hero-fc__subheadline {
      font-size: 1rem;
    }
  }
</style>`;
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const css = scopedCss(tokens);

  return `${css}
<section ${SCOPE}>
  <div class="hero-fc__overlay"></div>
  <div class="hero-fc__content">
    <h1 class="hero-fc__headline">${esc(copy.headline)}</h1>
    <p class="hero-fc__subheadline">${esc(copy.subheadline)}</p>
    <p class="hero-fc__body">${esc(copy.body)}</p>
    <div class="hero-fc__cta">
      ${ctaButton(copy.ctaText, c, copy.microCopy)}
    </div>
  </div>
</section>`;
}
