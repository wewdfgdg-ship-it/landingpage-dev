// ============================================================
// Header Banner — Layout Templates D, E, F
// D: 신뢰 스토리 | E: 비주얼 히어로 풀블리드 | F: 배지 강조 1위
// ============================================================

import { getFontLinks, getFontFamilies } from './fonts';
import { getMoodStyles } from './moods';
import {
  renderEyebrow,
  renderHeadline,
  renderDesc,
  renderProductZone,
  renderStats,
  renderTrustBadge,
  renderCTA,
  renderMicro,
  renderNoise,
  renderGhost,
  renderFadeInUpKeyframes,
  renderBigBadge,
} from './components';
import type { HeroMood, FontSetId } from './types';

// ── LayoutData interface ──

export interface LayoutData {
  readonly mood: HeroMood;
  readonly fontSet: FontSetId;
  readonly brandColor: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly desc: string;
  readonly ctaText: string;
  readonly microCopy: string;
  readonly stats: ReadonlyArray<{ number: string; unit: string; label?: string }>;
  readonly awards: readonly string[];
  readonly ghostChar: string;
  /** Layout-D: trust strip items (e.g. ["올리브영 1위", "글로우픽 선정", "FDA 인증"]) */
  readonly trustItems?: readonly string[];
  /** Layout-F: badge rank text (e.g. "1위") */
  readonly badgeRank?: string;
  /** Layout-F: badge platform text (e.g. "올리브영 스킨케어") */
  readonly badgePlatform?: string;
  readonly subjectSize?: 'small' | 'medium' | 'large';
  readonly imageUrl?: string;
}

// ── helpers ──

function htmlShell(
  title: string,
  fontLinks: string,
  fontFamilies: { headline: string; sub: string; micro: string },
  bodyContent: string,
): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  ${fontLinks}
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${fontFamilies.sub};
      -webkit-font-smoothing: antialiased;
    }
    h1 { font-family: ${fontFamilies.headline}; }
    .micro, .eyebrow, .stat-label, .trust-item-label { font-family: ${fontFamilies.micro}; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

// ============================================================
// LAYOUT-D: 신뢰 스토리
// trust-full → eyebrow → headline → product-zone
// → trust-strip → stats → desc → CTA → micro
// ============================================================

export function renderLayoutD(data: LayoutData): string {
  const ms = getMoodStyles(data.mood, data.brandColor);
  const fontLinks = getFontLinks(data.fontSet);
  const fonts = getFontFamilies(data.fontSet);
  const trustItems = data.trustItems ?? [];
  const mainAward = data.awards[0] ?? '';

  // trust-full bar (top, full-width)
  const trustFull = mainAward
    ? `<div class="trust-full" style="
        width: 100%;
        background: ${data.brandColor}0D;
        border-bottom: 1px solid ${data.brandColor}1A;
        text-align: center;
        padding: clamp(12px, 1.5vw, 20px) 16px;
        animation: fadeInUp 0.5s ease 0s both;
      ">
        <span style="
          font-size: clamp(13px, 1.2vw, 18px);
          font-weight: 700;
          color: ${ms.accentColor};
          letter-spacing: 1px;
        ">${mainAward}</span>
      </div>`
    : '';

  // trust-strip (3 items, flex space-around)
  const trustStripItems = trustItems
    .slice(0, 3)
    .map(
      (item, i) => `<div class="trust-strip-item" style="
        flex: 1;
        text-align: center;
        padding: clamp(16px, 2vw, 24px) clamp(8px, 1vw, 16px);
        ${i < trustItems.length - 1 ? `border-right: 1px solid ${data.brandColor}1A;` : ''}
        animation: fadeInUp 0.7s ease ${0.6 + i * 0.1}s both;
      ">
        <span class="trust-item-label" style="
          font-size: clamp(13px, 1.2vw, 18px);
          font-weight: 700;
          color: ${ms.textColor};
          display: block;
        ">${item}</span>
      </div>`,
    )
    .join('');

  const trustStrip = trustItems.length > 0
    ? `<div class="trust-strip" style="
        display: flex;
        justify-content: space-around;
        align-items: stretch;
        width: 100%;
        max-width: 640px;
        margin: clamp(16px, 2vw, 32px) auto;
        border: 1px solid ${data.brandColor}1A;
        border-radius: 16px;
        background: ${data.brandColor}06;
        overflow: hidden;
      ">${trustStripItems}</div>`
    : '';

  const body = `
${renderFadeInUpKeyframes()}
<section class="hero layout-d" style="
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: ${ms.background};
  color: ${ms.textColor};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
">
  ${renderNoise()}
  ${renderGhost(data.ghostChar)}

  ${trustFull}

  <div class="content-wrap" style="
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    padding: clamp(32px, 4vw, 64px) clamp(16px, 3vw, 32px);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(16px, 2vw, 24px);
  ">
    ${renderEyebrow(data.eyebrow, ms.subColor)}
    ${renderHeadline(data.headline, ms.textColor, ms.accentColor)}
    ${renderProductZone('hero-flow', 'D', data.subjectSize ?? 'medium', ms.productShadow, data.imageUrl)}
    ${trustStrip}
    ${renderStats(data.stats, ms.accentColor)}
    ${renderDesc(data.desc, ms.subColor)}
    ${renderCTA(data.ctaText, ms.ctaBackground, ms.ctaColor, ms.ctaRadius)}
    ${renderMicro(data.microCopy, ms.subColor)}
  </div>
</section>`;

  return htmlShell('Layout D - Trust Story', fontLinks, fonts, body);
}

// ============================================================
// LAYOUT-E: 비주얼 히어로 (풀블리드)
// product-zone as BACKGROUND → overlay gradient
// → content overlay (bottom) → eyebrow → headline → desc
// → stats → CTA → micro
// ============================================================

export function renderLayoutE(data: LayoutData): string {
  const ms = getMoodStyles(data.mood, data.brandColor);
  const fontLinks = getFontLinks(data.fontSet);
  const fonts = getFontFamilies(data.fontSet);

  // For E layout, force white text for readability on dark overlay
  const textColor = '#ffffff';
  const subColor = 'rgba(255,255,255,0.65)';

  const body = `
${renderFadeInUpKeyframes()}
<section class="hero layout-e" style="
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
">
  <!-- Background image (fullbleed) -->
  <img src="${data.imageUrl ?? 'product.png'}" alt="product" style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  " />

  <!-- Overlay gradient -->
  <div class="overlay-gradient" style="
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.88) 65%);
  "></div>

  ${renderNoise()}

  <!-- Content overlay (anchored to bottom) -->
  <div class="content-overlay" style="
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    padding: clamp(32px, 5vw, 80px) clamp(16px, 3vw, 32px) clamp(40px, 5vw, 72px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: clamp(12px, 1.5vw, 20px);
    max-width: 720px;
    margin: 0 auto;
  ">
    ${renderEyebrow(data.eyebrow, subColor)}

    <h1 class="headline" style="
      font-size: clamp(36px, 6vw, 52px);
      font-weight: 900;
      letter-spacing: -3px;
      line-height: 1.08;
      word-break: keep-all;
      color: ${textColor};
      margin: 0 0 clamp(8px, 1vw, 16px) 0;
      animation: fadeInUp 0.7s ease 0.2s both;
    ">${data.headline}</h1>

    ${renderDesc(data.desc, subColor)}
    ${renderStats(data.stats, ms.accentColor)}
    ${renderCTA(data.ctaText, ms.ctaBackground, ms.ctaColor, ms.ctaRadius)}
    ${renderMicro(data.microCopy, subColor)}
  </div>
</section>`;

  return htmlShell('Layout E - Visual Hero Fullbleed', fontLinks, fonts, body);
}

// ============================================================
// LAYOUT-F: 배지 강조 (1위)
// big-badge (280px card) → headline(48px) → product-zone
// → stats → CTA → micro
// ============================================================

export function renderLayoutF(data: LayoutData): string {
  const ms = getMoodStyles(data.mood, data.brandColor);
  const fontLinks = getFontLinks(data.fontSet);
  const fonts = getFontFamilies(data.fontSet);
  const rank = data.badgeRank ?? '1위';
  const platform = data.badgePlatform ?? '';

  const body = `
${renderFadeInUpKeyframes()}
<section class="hero layout-f" style="
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: ${ms.background};
  color: ${ms.textColor};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
">
  ${renderNoise()}
  ${renderGhost(data.ghostChar)}

  <div class="content-wrap" style="
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    padding: clamp(32px, 4vw, 64px) clamp(16px, 3vw, 32px);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(16px, 2vw, 24px);
  ">
    ${renderBigBadge(rank, platform, data.brandColor)}

    <h1 class="headline" style="
      font-size: clamp(32px, 5.5vw, 48px);
      font-weight: 900;
      letter-spacing: -3px;
      line-height: 1.08;
      word-break: keep-all;
      color: ${ms.textColor};
      margin: 0;
      animation: fadeInUp 0.7s ease 0.4s both;
    ">${(() => {
      const words = data.headline.trim().split(/\s+/);
      const lastWord = words.pop() ?? '';
      const leading = words.join(' ');
      const accentSpan = `<span class="accent" style="color:${ms.accentColor};text-shadow:0 0 30px ${ms.accentColor}40;">${lastWord}</span>`;
      return leading ? `${leading} ${accentSpan}` : accentSpan;
    })()}</h1>

    ${renderProductZone('hero-flow', 'F', data.subjectSize ?? 'medium', ms.productShadow, data.imageUrl)}
    ${renderStats(data.stats, ms.accentColor)}
    ${renderCTA(data.ctaText, ms.ctaBackground, ms.ctaColor, ms.ctaRadius)}
    ${renderMicro(data.microCopy, ms.subColor)}
  </div>
</section>`;

  return htmlShell('Layout F - Badge Emphasis', fontLinks, fonts, body);
}
