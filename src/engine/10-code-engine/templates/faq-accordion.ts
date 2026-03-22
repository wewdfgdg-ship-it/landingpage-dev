import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { esc } from './utils';

// ============================================================
// FAQ Accordion Template — CSS-only 아코디언 FAQ
// ============================================================

export const config: TemplateConfig = {
  patternId: 'faq_accordion',
  name: 'FAQ 아코디언',
  category: 'faq',
  description: 'bulletPoints를 Q&A 쌍으로 변환하는 CSS-only 아코디언 (details/summary)',
  imageSpec: {
    required: false,
    aspectRatio: '1:1',
    cutout: false,
    maxWidth: 0,
  },
};

interface QAPair {
  question: string;
  answer: string | null;
}

function parseQAPairs(bulletPoints: readonly string[]): QAPair[] {
  const pairs: QAPair[] = [];
  for (let i = 0; i < bulletPoints.length; i += 2) {
    pairs.push({
      question: bulletPoints[i] ?? '',
      answer: i + 1 < bulletPoints.length ? (bulletPoints[i + 1] ?? null) : null,
    });
  }
  return pairs;
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;
  const sp = tokens.spacing;

  const qaPairs = parseQAPairs(copy.bulletPoints);

  const itemsHtml = qaPairs
    .map((pair) => {
      const answerHtml = pair.answer !== null
        ? `<p class="faq-accordion__answer">${esc(pair.answer)}</p>`
        : `<p class="faq-accordion__answer faq-accordion__answer--empty">답변이 준비 중입니다.</p>`;
      return `<details class="faq-accordion__item">
      <summary class="faq-accordion__question">${esc(pair.question)}</summary>
      ${answerHtml}
    </details>`;
    })
    .join('\n    ');

  return `<style>
[data-tpl="faq-accordion"] {
  padding: ${sp.xl}px ${sp.lg}px;
  background: ${c.background};
  color: ${c.textPrimary};
}
[data-tpl="faq-accordion"] .faq-accordion__inner {
  max-width: 720px;
  margin: 0 auto;
}
[data-tpl="faq-accordion"] .faq-accordion__headline {
  font-size: ${t.h2.size};
  font-weight: ${t.h2.weight};
  line-height: ${t.h2.lineHeight};
  text-align: center;
  margin: 0 0 ${sp.lg}px;
  word-break: keep-all;
}
[data-tpl="faq-accordion"] .faq-accordion__item {
  border-bottom: 1px solid ${c.border};
}
[data-tpl="faq-accordion"] .faq-accordion__question {
  cursor: pointer;
  padding: ${sp.md}px 0;
  font-size: ${t.body.size};
  font-weight: 600;
  line-height: ${t.body.lineHeight};
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${sp.sm}px;
}
[data-tpl="faq-accordion"] .faq-accordion__question::-webkit-details-marker {
  display: none;
}
[data-tpl="faq-accordion"] .faq-accordion__question::after {
  content: "";
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid ${c.textMuted};
  border-bottom: 2px solid ${c.textMuted};
  transform: rotate(45deg);
  transition: transform 0.25s;
}
[data-tpl="faq-accordion"] .faq-accordion__item[open] .faq-accordion__question::after {
  transform: rotate(-135deg);
}
[data-tpl="faq-accordion"] .faq-accordion__answer {
  padding: 0 0 ${sp.md}px;
  margin: 0;
  font-size: ${t.body.size};
  line-height: ${t.body.lineHeight};
  color: ${c.textSecondary};
}
[data-tpl="faq-accordion"] .faq-accordion__answer--empty {
  font-style: italic;
  color: ${c.textMuted};
}
@media (max-width: 768px) {
  [data-tpl="faq-accordion"] {
    padding: ${sp.lg}px ${sp.sm}px;
  }
  [data-tpl="faq-accordion"] .faq-accordion__headline {
    font-size: ${t.h3.size};
  }
}
</style>
<section data-tpl="faq-accordion">
  <div class="faq-accordion__inner">
    <h2 class="faq-accordion__headline">${esc(copy.headline)}</h2>
    ${itemsHtml}
  </div>
</section>`;
}
