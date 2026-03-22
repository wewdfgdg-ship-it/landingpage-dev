import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

// ============================================================
// Feature Template — 번호 단계별 설명
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

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
  padding: ${tokens.sectionPadding};
  background: ${c.background};
  color: ${c.textPrimary};
}
[${SCOPE}-inner] {
  max-width: 700px;
  margin: 0 auto;
}
[${SCOPE}-title] {
  font-size: ${t.h2.size};
  font-weight: ${t.h2.weight};
  line-height: ${t.h2.lineHeight};
  text-align: center;
  margin: 0 0 ${sp.sm}px 0;
}
[${SCOPE}-subtitle] {
  font-size: ${t.body.size};
  color: ${c.textSecondary};
  text-align: center;
  line-height: ${t.body.lineHeight};
  margin: 0 0 ${sp.xl}px 0;
}
[${SCOPE}-steps] {
  display: flex;
  flex-direction: column;
}
[${SCOPE}-step] {
  display: flex;
  gap: ${sp.md}px;
}
[${SCOPE}-badge-col] {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
[${SCOPE}-badge] {
  width: 40px;
  height: 40px;
  border-radius: ${r.full}px;
  background: ${c.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: ${t.body.size};
  flex-shrink: 0;
}
[${SCOPE}-connector] {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, ${c.primary}, ${c.border});
  min-height: ${sp.md}px;
}
[${SCOPE}-step-content] {
  padding-bottom: ${sp.lg}px;
  padding-top: 8px;
  flex: 1;
  min-width: 0;
}
[${SCOPE}-step-text] {
  font-size: ${t.body.size};
  font-weight: ${t.body.weight};
  line-height: ${t.body.lineHeight};
  margin: 0;
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
