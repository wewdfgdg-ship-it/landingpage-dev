import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

import type { TemplateConfig } from './types';
import { esc } from './utils';

// ============================================================
// Feature Template — 지그재그 교차 배치
// ============================================================

export const config: TemplateConfig = {
  patternId: 'feat_zigzag',
  name: '지그재그 교차 배치',
  category: 'feature',
  description: '텍스트와 이미지를 교차 배치 (홀수: 텍스트-이미지, 짝수: 이미지-텍스트). bulletPoints를 블록별로 분배.',
  imageSpec: {
    required: true,
    aspectRatio: '4:3',
    cutout: false,
    maxWidth: 500,
  },
};

const SCOPE = 'data-tpl-featzz';

function chunkArray(arr: string[], chunks: number): string[][] {
  if (arr.length === 0) return [];
  const size = Math.max(1, Math.ceil(arr.length / chunks));
  const result: string[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function render(copy: CopyBlock, tokens: DesignTokens, order?: number): string {
  const c = tokens.colors;
  const t = tokens.typography;
  const sp = tokens.spacing;
  const r = tokens.radius;

  const blockCount = copy.bulletPoints.length <= 2 ? 1 : Math.min(3, Math.ceil(copy.bulletPoints.length / 2));
  const chunks = chunkArray(copy.bulletPoints, blockCount);
  const isReversed = (order ?? 1) % 2 === 0;

  const imageHtml = (imgCopy: CopyBlock): string => {
    if (imgCopy.imageUrl) {
      return `<img ${SCOPE}-img src="${imgCopy.imageUrl}" alt="${esc(imgCopy.headline)}" loading="lazy">`;
    }
    return `<div ${SCOPE}-placeholder></div>`;
  };

  const blocks = chunks.map((chunk, blockIdx) => {
    const reversed = (blockIdx % 2 === 0) !== isReversed;
    const dirAttr = reversed ? `${SCOPE}-row-reverse` : '';

    const bulletHtml = chunk
      .map((item) => `<li ${SCOPE}-bullet><span ${SCOPE}-check>✓</span>${esc(item)}</li>`)
      .join('');

    const showBody = blockIdx === 0 && chunk.length === 0;
    return `<div ${SCOPE}-row ${dirAttr}>
      <div ${SCOPE}-text>
        ${blockIdx === 0 ? `<h2 ${SCOPE}-title>${esc(copy.headline)}</h2>` : ''}
        ${showBody ? `<p ${SCOPE}-body>${esc(copy.body)}</p>` : ''}
        <ul ${SCOPE}-list>${bulletHtml}</ul>
      </div>
      <div ${SCOPE}-media>
        ${imageHtml(copy)}
      </div>
    </div>`;
  }).join('');

  const emptyBlock = chunks.length === 0
    ? `<div ${SCOPE}-row>
        <div ${SCOPE}-text>
          <h2 ${SCOPE}-title>${esc(copy.headline)}</h2>
          <p ${SCOPE}-body>${esc(copy.body)}</p>
        </div>
        <div ${SCOPE}-media>${imageHtml(copy)}</div>
      </div>`
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
[${SCOPE}-row] {
  display: flex;
  align-items: center;
  gap: 64px;
  margin-bottom: 64px;
}
[${SCOPE}-row]:last-child {
  margin-bottom: 0;
}
[${SCOPE}-row-reverse] {
  flex-direction: row-reverse;
}
[${SCOPE}-text] {
  flex: 1.3;
  min-width: 0;
}
[${SCOPE}-media] {
  flex: 1;
  min-width: 0;
  max-width: 400px;
}
[${SCOPE}-title] {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0 0 ${sp.sm}px 0;
  word-break: keep-all;
}
[${SCOPE}-body] {
  font-size: clamp(1.05rem, 1.4vw, 1.2rem);
  color: ${c.textSecondary};
  line-height: 1.75;
  margin: 0 0 24px 0;
  word-break: keep-all;
}
[${SCOPE}-list] {
  list-style: none;
  padding: 0;
  margin: 0;
}
[${SCOPE}-bullet] {
  position: relative;
  padding: 14px 0 14px 28px;
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  line-height: 1.75;
}
[${SCOPE}-check] {
  position: absolute;
  left: 0;
  color: ${c.primary};
  font-weight: 700;
  font-size: 1.1rem;
}
[${SCOPE}-img] {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: ${r.lg}px;
  display: block;
}
[${SCOPE}-placeholder] {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, ${c.surface} 0%, ${c.border} 100%);
  border-radius: ${r.lg}px;
}
@media (max-width: 768px) {
  [${SCOPE}-row],
  [${SCOPE}-row-reverse] {
    flex-direction: column;
    gap: ${sp.lg}px;
  }
  [${SCOPE}-title] {
    font-size: 1.5rem;
  }
  [${SCOPE}-img],
  [${SCOPE}-placeholder] {
    max-width: 100%;
  }
}
</style>`;

  return `${css}
<section ${SCOPE}>
  <div ${SCOPE}-inner>
    ${blocks}${emptyBlock}
  </div>
</section>`;
}
