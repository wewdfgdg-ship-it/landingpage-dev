import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { esc } from './utils';

// ============================================================
// Feature Template — 번호 단계별 설명
// ============================================================

export const config: TemplateConfig = {
  patternId: 'feat_numbered_steps',
  name: '번호 단계별 설명',
  category: 'feature',
  description: '번호가 매겨진 단계별 설명. 원형 배지 + 수직 타임라인 스타일. 진행 순서를 시각화.',
  imageSpec: {
    required: false,
    aspectRatio: '1:1',
    cutout: false,
    maxWidth: 0,
  },
};

const SCOPE = 'data-tpl-featstep';

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const t = tokens.typography;
  const sp = tokens.spacing;
  const r = tokens.radius;

  const items = copy.bulletPoints.slice(0, 8);

  const steps = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      return `<div ${SCOPE}-step>
        <div ${SCOPE}-badge-col>
          <div ${SCOPE}-badge>${i + 1}</div>
          ${!isLast ? `<div ${SCOPE}-connector></div>` : ''}
        </div>
        <div ${SCOPE}-step-content>
          <p ${SCOPE}-step-text>${esc(item)}</p>
        </div>
      </div>`;
    })
    .join('');

  const emptyState = items.length === 0
    ? `<p ${SCOPE}-empty>${esc(copy.body)}</p>`
    : '';

  const css = `<style>
[${SCOPE}] {
  padding: 100px 24px;
  background: ${c.background};
  color: ${c.textPrimary};
}
[${SCOPE}-inner] {
  max-width: 1200px;
  margin: 0 auto;
}
[${SCOPE}-title] {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-align: center;
  margin: 0 0 ${sp.sm}px 0;
  word-break: keep-all;
}
[${SCOPE}-subtitle] {
  font-size: clamp(1.1rem, 1.8vw, 1.4rem);
  color: ${c.textSecondary};
  text-align: center;
  line-height: 1.6;
  margin: 0 0 48px 0;
  word-break: keep-all;
}
[${SCOPE}-steps] {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
}
[${SCOPE}-step] {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  max-width: 300px;
  position: relative;
}
[${SCOPE}-step]::after {
  content: '';
  position: absolute;
  top: 32px;
  left: calc(50% + 40px);
  width: calc(100% - 80px);
  height: 3px;
  background: linear-gradient(90deg, ${c.primary}, ${c.border});
}
[${SCOPE}-step]:last-child::after {
  display: none;
}
[${SCOPE}-badge-col] {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}
[${SCOPE}-badge] {
  width: 64px;
  height: 64px;
  border-radius: ${r.full}px;
  background: linear-gradient(160deg, ${c.primaryDark} 0%, ${c.primary} 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
[${SCOPE}-connector] {
  display: none;
}
[${SCOPE}-step-content] {
  flex: 1;
  min-width: 0;
  padding: 0 16px;
}
[${SCOPE}-step-text] {
  font-size: clamp(1.15rem, 1.5vw, 1.35rem);
  font-weight: 600;
  line-height: 1.6;
  margin: 0;
  word-break: keep-all;
}
[${SCOPE}-empty] {
  font-size: ${t.body.size};
  color: ${c.textSecondary};
  text-align: center;
}
@media (max-width: 768px) {
  [${SCOPE}-title] {
    font-size: 1.5rem;
  }
  [${SCOPE}-badge] {
    width: 32px;
    height: 32px;
    font-size: ${t.small.size};
  }
}
</style>`;

  return `${css}
<section ${SCOPE}>
  <div ${SCOPE}-inner>
    <h2 ${SCOPE}-title>${esc(copy.headline)}</h2>
    <p ${SCOPE}-subtitle>${esc(copy.subheadline)}</p>
    <div ${SCOPE}-steps>
      ${steps}${emptyState}
    </div>
  </div>
</section>`;
}
