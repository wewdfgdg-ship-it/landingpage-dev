import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { esc } from './utils';

// ============================================================
// CTA Center Template — 중앙 정렬 CTA 블록
// ============================================================

export const config: TemplateConfig = {
  patternId: 'cta_center',
  name: 'CTA 중앙 정렬',
  category: 'cta',
  description: '큰 헤드라인 + 서브카피 + CTA 버튼 + 마이크로카피가 중앙 정렬된 전환 블록',
  imageSpec: {
    required: false,
    aspectRatio: '16:9',
    cutout: false,
    maxWidth: 0,
  },
};

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;
  const sp = tokens.spacing;
  const r = tokens.radius;

  const microHtml = copy.microCopy
    ? `<p class="cta-center__micro">${esc(copy.microCopy)}</p>`
    : '';

  const bulletsHtml = copy.bulletPoints.length
    ? `<ul class="cta-center__bullets">${copy.bulletPoints
        .map((item) => `<li>${esc(item)}</li>`)
        .join('')}</ul>`
    : '';

  return `<style>
[data-tpl="cta-center"] {
  padding: 80px 24px;
  background: linear-gradient(160deg, ${c.primaryDark} 0%, ${c.primary} 100%);
  color: #fff;
  text-align: center;
}
[data-tpl="cta-center"] .cta-center__inner {
  max-width: 800px;
  margin: 0 auto;
}
[data-tpl="cta-center"] .cta-center__headline {
  font-size: clamp(2.4rem, 4.5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #fff;
  margin: 0 0 ${sp.sm}px;
  word-break: keep-all;
}
[data-tpl="cta-center"] .cta-center__sub {
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  line-height: 1.6;
  opacity: 0.92;
  margin: 0 0 ${sp.md}px;
  word-break: keep-all;
}
[data-tpl="cta-center"] .cta-center__bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 ${sp.md}px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
[data-tpl="cta-center"] .cta-center__bullets li {
  opacity: 0.95;
  font-size: 1rem;
}
[data-tpl="cta-center"] .cta-center__bullets li::before {
  content: "✓ ";
}
[data-tpl="cta-center"] .cta-center__btn {
  display: inline-block;
  padding: 24px 64px;
  min-height: 48px;
  background: #fff;
  color: ${c.primary};
  text-decoration: none;
  border-radius: 12px;
  font-size: 1.4rem;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(0,0,0,0.18);
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}
[data-tpl="cta-center"] .cta-center__btn:hover {
  opacity: 0.95;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
[data-tpl="cta-center"] .cta-center__micro {
  margin-top: 16px;
  font-size: 1.05rem;
  opacity: 0.75;
}
@media (max-width: 768px) {
  [data-tpl="cta-center"] {
    padding: ${sp.lg}px ${sp.sm}px;
  }
  [data-tpl="cta-center"] .cta-center__headline {
    font-size: ${t.h2.size};
  }
  [data-tpl="cta-center"] .cta-center__bullets {
    flex-direction: column;
    align-items: center;
  }
}
</style>
<section data-tpl="cta-center" id="cta">
  <div class="cta-center__inner">
    <h2 class="cta-center__headline">${esc(copy.headline)}</h2>
    <p class="cta-center__sub">${esc(copy.subheadline)}</p>
    ${bulletsHtml}
    <a href="#cta" class="cta-center__btn">${esc(copy.ctaText)}</a>
    ${microHtml}
  </div>
</section>`;
}
