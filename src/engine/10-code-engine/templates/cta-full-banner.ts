import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

// ============================================================
// CTA Full Banner Template — 풀 너비 배너 CTA
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
  patternId: 'cta_full_banner',
  name: 'CTA 풀 배너',
  category: 'cta',
  description: '풀 너비 그라디언트 배경 + 좌측 텍스트 + 우측 CTA 버튼, 긴급성 요소 포함',
  imageSpec: {
    required: false,
    aspectRatio: '21:9',
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
    ? `<p class="cta-banner__micro">${esc(copy.microCopy)}</p>`
    : '';

  const urgencyHtml = copy.bulletPoints.length
    ? `<p class="cta-banner__urgency">${esc(copy.bulletPoints[0] ?? '')}</p>`
    : '';

  return `<style>
[data-tpl="cta-full-banner"] {
  padding: ${sp.xl}px ${sp.lg}px;
  background: linear-gradient(135deg, ${c.primary} 0%, ${c.primaryDark} 100%);
  color: #fff;
}
[data-tpl="cta-full-banner"] .cta-banner__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${sp.lg}px;
}
[data-tpl="cta-full-banner"] .cta-banner__text {
  flex: 1;
  min-width: 0;
}
[data-tpl="cta-full-banner"] .cta-banner__headline {
  font-size: ${t.h2.size};
  font-weight: ${t.h2.weight};
  line-height: ${t.h2.lineHeight};
  margin: 0 0 ${sp.xs}px;
}
[data-tpl="cta-full-banner"] .cta-banner__sub {
  font-size: ${t.body.size};
  line-height: ${t.body.lineHeight};
  opacity: 0.9;
  margin: 0 0 ${sp.sm}px;
}
[data-tpl="cta-full-banner"] .cta-banner__urgency {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${r.sm}px;
  font-size: ${t.small.size};
  font-weight: 600;
  margin: 0;
}
[data-tpl="cta-full-banner"] .cta-banner__action {
  flex-shrink: 0;
  text-align: center;
}
[data-tpl="cta-full-banner"] .cta-banner__btn {
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
  white-space: nowrap;
}
[data-tpl="cta-full-banner"] .cta-banner__btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
[data-tpl="cta-full-banner"] .cta-banner__micro {
  margin-top: ${sp.xs}px;
  font-size: ${t.caption.size};
  opacity: 0.75;
}
@media (max-width: 768px) {
  [data-tpl="cta-full-banner"] {
    padding: ${sp.lg}px ${sp.sm}px;
  }
  [data-tpl="cta-full-banner"] .cta-banner__inner {
    flex-direction: column;
    text-align: center;
  }
  [data-tpl="cta-full-banner"] .cta-banner__headline {
    font-size: ${t.h3.size};
  }
}
</style>
<section data-tpl="cta-full-banner" id="cta">
  <div class="cta-banner__inner">
    <div class="cta-banner__text">
      <h2 class="cta-banner__headline">${esc(copy.headline)}</h2>
      <p class="cta-banner__sub">${esc(copy.subheadline)}</p>
      ${urgencyHtml}
    </div>
    <div class="cta-banner__action">
      <a href="#cta" class="cta-banner__btn">${esc(copy.ctaText)}</a>
      ${microHtml}
    </div>
  </div>
</section>`;
}
