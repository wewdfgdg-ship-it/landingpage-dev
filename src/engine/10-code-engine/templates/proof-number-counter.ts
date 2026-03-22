import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { esc } from './utils';

// ============================================================
// Template: proof-number-counter
// 숫자 카운터 (누적 고객수, 만족도 등)
// ============================================================

export const config: TemplateConfig = {
  patternId: 'proof_number_counter',
  name: '숫자 카운터',
  category: 'proof',
  description: '3~4개 큰 숫자 + 라벨로 실적/성과를 보여주는 섹션',
  imageSpec: {
    required: false,
    aspectRatio: '16:9',
    cutout: false,
    maxWidth: 0,
  },
};

interface CounterItem {
  number: string;
  label: string;
}

function parseCounterItem(raw: string): CounterItem {
  // "10,000+명 이용" → { number: "10,000+", label: "명 이용" }
  // "98% 만족도" → { number: "98%", label: "만족도" }
  // "24시간 고객 지원" → { number: "24", label: "시간 고객 지원" }
  const match = raw.match(/^([\d,]+\.?\d*[+%]?)\s*(.*)$/);
  if (match) {
    return { number: match[1], label: match[2] };
  }
  return { number: raw, label: '' };
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const sp = tokens.spacing;
  const r = tokens.radius;
  const tpl = 'proof-counter';
  const items = copy.bulletPoints.slice(0, 4);

  if (!items.length) {
    return '';
  }

  const counters = items
    .map((item) => {
      const parsed = parseCounterItem(item);
      return `<div data-tpl-item="${tpl}">
      <p data-tpl-number="${tpl}">${esc(parsed.number)}</p>
      <p data-tpl-label="${tpl}">${esc(parsed.label)}</p>
    </div>`;
    })
    .join('\n      ');

  return `<style>
  [data-tpl="${tpl}"] {
    padding: ${tokens.sectionPadding};
    background: ${c.primary};
    color: #fff;
  }
  [data-tpl-inner="${tpl}"] {
    max-width: 1100px;
    margin: 0 auto;
    text-align: center;
  }
  [data-tpl-heading="${tpl}"] {
    font-size: ${tokens.typography.h2.size};
    font-weight: ${tokens.typography.h2.weight};
    line-height: ${tokens.typography.h2.lineHeight};
    margin-bottom: ${sp.xl}px;
    color: #fff;
    word-break: keep-all;
  }
  [data-tpl-grid="${tpl}"] {
    display: grid;
    grid-template-columns: repeat(${items.length}, 1fr);
    gap: ${sp.xl}px;
  }
  [data-tpl-item="${tpl}"] {
    padding: ${sp.lg}px;
    background: rgba(255,255,255,0.1);
    border-radius: ${r.lg}px;
  }
  [data-tpl-number="${tpl}"] {
    font-size: ${tokens.typography.display.size};
    font-weight: ${tokens.typography.display.weight};
    line-height: 1.1;
    margin-bottom: ${sp.xs}px;
  }
  [data-tpl-label="${tpl}"] {
    font-size: ${tokens.typography.body.size};
    opacity: 0.85;
  }
  @media (max-width: 768px) {
    [data-tpl-grid="${tpl}"] {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
<section data-tpl="${tpl}">
  <div data-tpl-inner="${tpl}">
    <h2 data-tpl-heading="${tpl}">${esc(copy.headline)}</h2>
    <div data-tpl-grid="${tpl}">
      ${counters}
    </div>
  </div>
</section>`;
}
