import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { esc } from './utils';

// ============================================================
// Template: price-3col-compare
// 3열 가격 비교 카드 (가운데 추천 강조)
// ============================================================

export const config: TemplateConfig = {
  patternId: 'price_3col_compare',
  name: '3열 가격 비교',
  category: 'pricing',
  description: '3열 가격 카드 비교 — 가운데 추천 강조, 각 카드에 플랜명/가격/기능/CTA',
  imageSpec: {
    required: false,
    aspectRatio: '1:1',
    cutout: false,
    maxWidth: 0,
  },
};

interface PlanCard {
  name: string;
  price: string;
  features: string[];
}

function parsePlans(bulletPoints: string[], body: string): PlanCard[] {
  // body에서 가격 정보 파싱 시도:
  // "Basic 무료 / Pro 29,000원 / Enterprise 99,000원" 형태
  const plans: PlanCard[] = [];
  const bodyParts = body.split('/').map((p) => p.trim());

  if (bodyParts.length >= 3) {
    for (const part of bodyParts.slice(0, 3)) {
      const match = part.match(/^(\S+)\s+(.+)$/);
      if (match) {
        plans.push({ name: match[1], price: match[2], features: [] });
      } else {
        plans.push({ name: part, price: '', features: [] });
      }
    }
  } else {
    plans.push(
      { name: 'Basic', price: '무료', features: [] },
      { name: 'Pro', price: '유료', features: [] },
      { name: 'Enterprise', price: '문의', features: [] },
    );
  }

  // bulletPoints를 3개 플랜에 균등 분배
  const features = bulletPoints.slice(0, 9);
  const perPlan = Math.ceil(features.length / 3);
  for (let i = 0; i < 3; i++) {
    plans[i].features = features.slice(i * perPlan, (i + 1) * perPlan);
  }

  return plans;
}

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const sp = tokens.spacing;
  const r = tokens.radius;
  const tpl = 'price-3col';
  const plans = parsePlans(copy.bulletPoints, copy.body);

  const cards = plans
    .map((plan, i) => {
      const isRecommended = i === 1;
      const featList = plan.features
        .map((f) => `<li data-tpl-feat="${tpl}"><span data-tpl-check="${tpl}">\u2713</span>${esc(f)}</li>`)
        .join('\n          ');

      return `<div data-tpl-card="${tpl}"${isRecommended ? ` data-tpl-featured="${tpl}"` : ''}>
      ${isRecommended ? `<div data-tpl-badge="${tpl}">\uCD94\uCC9C</div>` : ''}
      <h3 data-tpl-plan="${tpl}">${esc(plan.name)}</h3>
      <p data-tpl-price="${tpl}">${esc(plan.price)}</p>
      <ul data-tpl-features="${tpl}">
          ${featList}
      </ul>
      <a href="#cta" data-tpl-cta="${tpl}"${isRecommended ? ` data-tpl-cta-primary="${tpl}"` : ''}>${esc(copy.ctaText || '\uC2DC\uC791\uD558\uAE30')}</a>
    </div>`;
    })
    .join('\n      ');

  return `<style>
  [data-tpl="${tpl}"] {
    padding: 100px 24px;
    background: ${c.background};
    color: ${c.textPrimary};
  }
  [data-tpl-inner="${tpl}"] {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
  [data-tpl-heading="${tpl}"] {
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 900;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: ${sp.sm}px;
    word-break: keep-all;
  }
  [data-tpl-sub="${tpl}"] {
    font-size: clamp(1.1rem, 1.8vw, 1.4rem);
    color: ${c.textSecondary};
    line-height: 1.6;
    margin-bottom: 48px;
    word-break: keep-all;
  }
  [data-tpl-grid="${tpl}"] {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${sp.lg}px;
    align-items: start;
  }
  [data-tpl-card="${tpl}"] {
    position: relative;
    padding: 44px 36px;
    background: ${c.surface};
    border-radius: 16px;
    border: 1px solid ${c.border};
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  [data-tpl-featured="${tpl}"] {
    border: 2px solid ${c.primary};
    transform: scale(1.04);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    z-index: 1;
  }
  [data-tpl-badge="${tpl}"] {
    position: absolute;
    top: -${sp.md}px;
    left: 50%;
    transform: translateX(-50%);
    background: ${c.primary};
    color: #fff;
    padding: ${sp.xs}px ${sp.md}px;
    border-radius: ${r.full}px;
    font-size: ${tokens.typography.small.size};
    font-weight: 700;
  }
  [data-tpl-plan="${tpl}"] {
    font-size: 1.3rem;
    font-weight: ${tokens.typography.h3.weight};
    margin-bottom: ${sp.sm}px;
  }
  [data-tpl-price="${tpl}"] {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 900;
    color: ${c.primary};
    margin-bottom: ${sp.lg}px;
  }
  [data-tpl-features="${tpl}"] {
    list-style: none;
    padding: 0;
    margin: 0 0 ${sp.lg}px;
    text-align: left;
    flex: 1;
  }
  [data-tpl-feat="${tpl}"] {
    padding: 10px 0;
    font-size: clamp(1rem, 1.3vw, 1.15rem);
    line-height: 1.7;
    color: ${c.textSecondary};
    display: flex;
    align-items: center;
    gap: ${sp.sm}px;
  }
  [data-tpl-check="${tpl}"] {
    color: ${c.primary};
    font-weight: 700;
    flex-shrink: 0;
  }
  [data-tpl-cta="${tpl}"] {
    display: inline-block;
    width: 100%;
    padding: 16px;
    background: ${c.surface};
    color: ${c.primary};
    border: 2px solid ${c.primary};
    border-radius: 12px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.05rem;
    box-sizing: border-box;
    transition: background 0.2s, color 0.2s;
  }
  [data-tpl-cta-primary="${tpl}"] {
    background: ${c.primary};
    color: #fff;
    border-color: ${c.primary};
  }
  @media (max-width: 768px) {
    [data-tpl-grid="${tpl}"] {
      grid-template-columns: 1fr;
      max-width: 400px;
      margin: 0 auto;
    }
    [data-tpl-featured="${tpl}"] {
      transform: none;
    }
  }
</style>
<section data-tpl="${tpl}">
  <div data-tpl-inner="${tpl}">
    <h2 data-tpl-heading="${tpl}">${esc(copy.headline)}</h2>
    <p data-tpl-sub="${tpl}">${esc(copy.subheadline)}</p>
    <div data-tpl-grid="${tpl}">
      ${cards}
    </div>
  </div>
</section>`;
}
