// ============================================================
// Template Utilities — 공유 헬퍼 함수
// ============================================================

import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { ColorPalette, DesignTokens } from '@/engine/09-visual-style/types';

/** HTML 특수문자 이스케이프 (XSS 방지) */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** CTA 버튼 + 마이크로카피 */
export function ctaButton(
  text: string,
  colors: ColorPalette,
  micro?: string,
  className?: string,
): string {
  const cls = className ? ` class="${className}"` : '';
  const btn = `<a href="#cta"${cls} style="display:inline-block;padding:16px 40px;background:${colors.primary};color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:1.1rem;min-height:48px;line-height:1;transition:opacity .2s;">${esc(text)}</a>`;
  const mic = micro
    ? `<p style="margin-top:8px;font-size:0.85rem;color:${colors.textMuted};">${esc(micro)}</p>`
    : '';
  return btn + mic;
}

/** 이미지 블록: CDN URL 있으면 img, 없으면 placeholder */
export function imageBlock(
  copy: CopyBlock,
  c: ColorPalette,
  opts?: { maxWidth?: string; aspectRatio?: string; borderRadius?: string; cutout?: boolean },
): string {
  const mw = opts?.maxWidth ? `max-width:${opts.maxWidth};` : '';
  const ar = opts?.aspectRatio ?? '4/3';
  const br = opts?.borderRadius ?? '12px';

  if (copy.imageUrl) {
    const fit = opts?.cutout ? 'contain' : 'cover';
    const bg = opts?.cutout ? 'background:transparent;' : '';
    return `<img src="${copy.imageUrl}" alt="${esc(copy.headline)}" style="width:100%;${mw}aspect-ratio:${ar};object-fit:${fit};${bg}border-radius:${br};" loading="lazy">`;
  }
  return `<div style="width:100%;${mw}aspect-ratio:${ar};background:${c.surface};border-radius:${br};display:flex;align-items:center;justify-content:center;color:${c.textMuted};font-size:0.9rem;">${esc(copy.imageDirection)}</div>`;
}

/** 체크마크 불릿 리스트 */
export function bullets(items: readonly string[]): string {
  if (!items.length) return '';
  return `<ul style="list-style:none;padding:0;margin:16px 0;">${items
    .map(
      (item) =>
        `<li style="padding:6px 0;padding-left:20px;position:relative;"><span style="position:absolute;left:0;">✓</span>${esc(item)}</li>`,
    )
    .join('')}</ul>`;
}

/** 섀도우 레벨 → CSS box-shadow */
export function shadowCss(level: DesignTokens['defaultShadow']): string {
  switch (level) {
    case 'none': return 'none';
    case 'sm': return '0 1px 2px rgba(0,0,0,0.05)';
    case 'md': return '0 4px 6px rgba(0,0,0,0.07)';
    case 'lg': return '0 10px 15px rgba(0,0,0,0.1)';
    case 'xl': return '0 20px 25px rgba(0,0,0,0.15)';
    case 'inner': return 'inset 0 2px 4px rgba(0,0,0,0.06)';
    default: return 'none';
  }
}
