import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

// ============================================================
// CTA Center Template — 중앙 정렬 CTA 블록
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

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
  padding: ${sp.xl}px ${sp.lg}px;
  background: ${c.primary};
  color: #fff;
  text-align: center;
}
[data-tpl="cta-center"] .cta-center__inner {
  max-width: 640px;
  margin: 0 auto;
}
[data-tpl="cta-center"] .cta-center__headline {
  font-size: ${t.h1.size};
  font-weight: ${t.h1.weight};
  line-height: ${t.h1.lineHeight};
  margin: 0 0 ${sp.sm}px;
}
[data-tpl="cta-center"] .cta-center__sub {
  font-size: ${t.body.size};
  line-height: ${t.body.lineHeight};
  opacity: 0.9;
  margin: 0 0 ${sp.md}px;
}
[data-tpl="cta-center"] .cta-center__bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 ${sp.md}px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${sp.sm}px;
}
[data-tpl="cta-center"] .cta-center__bullets li {
  opacity: 0.9;
  font-size: ${t.small.size};
}
[data-tpl="cta-center"] .cta-center__bullets li::before {
  content: "✓ ";
}
[data-tpl="cta-center"] .cta-center__btn {
  display: inline-block;
  padding: 16px 48px;
  min-height: 48px;
  background: #fff;
  color: ${c.primary};
  text-decoration: none;
  border-radius: ${r.md}px;
  font-size: ${t.button.size};
  font-weight: ${t.button.weight};
  transition: opacity 0.2s, transform 0.2s;
}
[data-tpl="cta-center"] .cta-center__btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
[data-tpl="cta-center"] .cta-center__micro {
  margin-top: ${sp.xs}px;
  font-size: ${t.caption.size};
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
