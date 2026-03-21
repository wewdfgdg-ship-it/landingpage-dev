// ============================================================
// Header Banner — 레이아웃 라우터
// 15개 레이아웃을 단일 진입점으로 통합
// ============================================================

import { renderLayout } from './templates';
import { renderLayoutD, renderLayoutE, renderLayoutF } from './templates-def';
import { renderLayoutG, renderLayoutH, renderLayoutI } from './templates-ghi';
import { renderLayoutJ, renderLayoutMA, renderLayoutMB } from './templates-j-mamb';
import { renderLayoutMC, renderLayoutMD, renderLayoutME } from './templates-mc-mdme';
import type { LayoutId } from './types';

// Re-export LayoutData from templates (canonical source)
export type { LayoutData } from './templates';
import type { LayoutData } from './templates';

/**
 * 레이아웃 ID로 완성된 HTML 문서를 반환
 * 모든 레이아웃은 동일한 LayoutData 인터페이스를 받음
 */
export function renderHeroBanner(data: LayoutData): string {
  switch (data.layoutId) {
    // templates.ts (A, B, C + default)
    case 'A':
    case 'B':
    case 'C':
      return renderLayout(data);

    // templates-def.ts
    case 'D':
      return renderLayoutD(data);
    case 'E':
      return renderLayoutE(data);
    case 'F':
      return renderLayoutF(data);

    // templates-ghi.ts (productImageSrc 매핑)
    case 'G':
      return renderLayoutG({ ...data, productImageSrc: data.imageUrl ?? 'product.png' } as never);
    case 'H':
      return renderLayoutH({ ...data, productImageSrc: data.imageUrl ?? 'product.png' } as never);
    case 'I':
      return renderLayoutI({ ...data, productImageSrc: data.imageUrl ?? 'product.png' } as never);

    // templates-j-mamb.ts (productImageSrc 매핑)
    case 'J':
      return renderLayoutJ({ ...data, productImageSrc: data.imageUrl ?? 'product.png' } as never);
    case 'MA':
      return renderLayoutMA({ ...data, productImageSrc: data.imageUrl ?? 'product.png' } as never);
    case 'MB':
      return renderLayoutMB({ ...data, productImageSrc: data.imageUrl ?? 'product.png' } as never);

    // templates-mc-mdme.ts
    case 'MC':
      return renderLayoutMC(data);
    case 'MD':
      return renderLayoutMD(data);
    case 'ME':
      return renderLayoutME(data);

    // fallback → Layout A
    default:
      return renderLayout({ ...data, layoutId: 'A' });
  }
}
