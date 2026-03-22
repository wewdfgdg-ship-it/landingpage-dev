import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { esc } from './utils';

// ============================================================
// Misc Before/After Template — 전/후 비교 레이아웃
// ============================================================

export const config: TemplateConfig = {
  patternId: 'misc_before_after',
  name: '전/후 비교',
  category: 'misc',
  description: 'bulletPoints 전반부를 Before, 후반부를 After로 나누어 비교하는 레이아웃',
  imageSpec: {
    required: false,
    aspectRatio: '1:1',
    cutout: false,
    maxWidth: 0,
  },
};

function splitHalf(items: readonly string[]): { before: string[]; after: string[] } {
  const mid = Math.ceil(items.length / 2);
  return {
    before: items.slice(0, mid) as string[],
    after: items.slice(mid) as string[],
  };
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;
  const sp = tokens.spacing;
  const r = tokens.radius;

  const { before, after } = splitHalf(copy.bulletPoints);

  const beforeItems = before
    .map((item) => `<li class="ba__item ba__item--before">${esc(item)}</li>`)
    .join('\n        ');

  const afterItems = after
    .map((item) => `<li class="ba__item ba__item--after">${esc(item)}</li>`)
    .join('\n        ');

  return `<style>
[data-tpl="misc-before-after"] {
  padding: 100px 24px;
  background: ${c.background};
  color: ${c.textPrimary};
}
[data-tpl="misc-before-after"] .ba__inner {
  max-width: 1200px;
  margin: 0 auto;
}
[data-tpl="misc-before-after"] .ba__headline {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-align: center;
  margin: 0 0 16px;
  word-break: keep-all;
}
[data-tpl="misc-before-after"] .ba__sub {
  font-size: clamp(1.1rem, 1.8vw, 1.4rem);
  color: ${c.textSecondary};
  text-align: center;
  line-height: 1.6;
  margin: 0 0 56px;
  word-break: keep-all;
}
[data-tpl="misc-before-after"] .ba__grid {
  display: flex;
  gap: 0;
  align-items: stretch;
}
[data-tpl="misc-before-after"] .ba__col {
  flex: 1;
  padding: 56px 44px;
  min-width: 0;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
[data-tpl="misc-before-after"] .ba__col--before {
  background: ${c.surface};
  border-radius: ${r.lg}px 0 0 ${r.lg}px;
}
[data-tpl="misc-before-after"] .ba__col--after {
  background: linear-gradient(160deg, ${c.primaryDark} 0%, ${c.primary} 100%);
  color: #fff;
  border-radius: 0 ${r.lg}px ${r.lg}px 0;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.1);
}
[data-tpl="misc-before-after"] .ba__label {
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 24px;
  opacity: 0.6;
}
[data-tpl="misc-before-after"] .ba__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
[data-tpl="misc-before-after"] .ba__item {
  padding: 16px 0;
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  line-height: 1.7;
}
[data-tpl="misc-before-after"] .ba__item--before::before {
  content: "✕ ";
  color: ${c.error};
  font-weight: 700;
}
[data-tpl="misc-before-after"] .ba__col--after .ba__item--after::before {
  content: "✓ ";
  font-weight: 700;
}
[data-tpl="misc-before-after"] .ba__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  flex-shrink: 0;
  background: linear-gradient(180deg, ${c.surface} 0%, ${c.primary} 100%);
}
[data-tpl="misc-before-after"] .ba__arrow {
  font-size: 2.5rem;
  color: #fff;
  font-weight: 700;
}
@media (max-width: 768px) {
  [data-tpl="misc-before-after"] {
    padding: ${sp.lg}px ${sp.sm}px;
  }
  [data-tpl="misc-before-after"] .ba__headline {
    font-size: ${t.h3.size};
  }
  [data-tpl="misc-before-after"] .ba__grid {
    flex-direction: column;
  }
  [data-tpl="misc-before-after"] .ba__col--before {
    border-radius: ${r.lg}px ${r.lg}px 0 0;
  }
  [data-tpl="misc-before-after"] .ba__col--after {
    border-radius: 0 0 ${r.lg}px ${r.lg}px;
  }
  [data-tpl="misc-before-after"] .ba__divider {
    width: 100%;
    height: 48px;
  }
  [data-tpl="misc-before-after"] .ba__arrow {
    transform: rotate(90deg);
  }
}
</style>
<section data-tpl="misc-before-after">
  <div class="ba__inner">
    <h2 class="ba__headline">${esc(copy.headline)}</h2>
    <p class="ba__sub">${esc(copy.subheadline)}</p>
    <div class="ba__grid">
      <div class="ba__col ba__col--before">
        <p class="ba__label">Before</p>
        <ul class="ba__list">
          ${beforeItems}
        </ul>
      </div>
      <div class="ba__divider">
        <span class="ba__arrow">→</span>
      </div>
      <div class="ba__col ba__col--after">
        <p class="ba__label">After</p>
        <ul class="ba__list">
          ${afterItems}
        </ul>
      </div>
    </div>
  </div>
</section>`;
}
