// ============================================================
// Header Banner — Layout Templates MC, MD, ME (Model Layouts)
// MC: vivid overlap Z교차 | MD: 모델 상단 + 대각선 분할 | ME: 모델 풀블리드 + 플로팅 배지
// ============================================================

import { getFontLinks, getFontFamilies } from './fonts';
import { getMoodStyles } from './moods';
import {
  renderEyebrow,
  renderHeadline,
  renderDesc,
  renderStats,
  renderCTA,
  renderMicro,
  renderFadeInUpKeyframes,
} from './components';
import type { HeroMood, FontSetId } from './types';

// ── LayoutData interface (same shape as sibling template files) ──

export interface LayoutData {
  readonly mood: HeroMood;
  readonly fontSet: FontSetId;
  readonly brandColor: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly subheadline: string;
  readonly desc: string;
  readonly ctaText: string;
  readonly microCopy: string;
  readonly stats: ReadonlyArray<{ number: string; unit: string; label?: string }>;
  readonly awards: readonly string[];
  readonly ghostChar: string;
  /** MC: headline text rendered behind model (max 10 chars) */
  readonly headlineBack?: string;
  /** MC: headline text rendered in front of model (max 10 chars) */
  readonly headlineFront?: string;
  /** ME: event pill text (e.g. "특별 이벤트") */
  readonly event?: string;
  /** ME: floating badge texts (e.g. ["단독증정", "64% OFF"]) */
  readonly floatingBadges?: readonly string[];
  /** ME: time pill text (e.g. "23:59:59 남음") */
  readonly timePill?: string;
  /** ME: brand names for logo row [left, right] */
  readonly brandNames?: readonly [string, string];
  readonly subjectSize?: 'small' | 'medium' | 'large';
}

// ── Shared HTML document wrapper ──

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
    h1, .headline-back, .headline-front { font-family: ${fontFamilies.headline}; }
    .micro, .eyebrow, .stat-label { font-family: ${fontFamilies.micro}; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

// ============================================================
// LAYOUT-MC: vivid overlap — Z교차
// bg(brandColor 단색)
// → overlap-zone(display:grid, grid-template:1fr, place-items:center)
//   → headline-back (z:1, align-self:start)
//   → model-zone (z:2)
//   → headline-front (z:3, align-self:end)
// → desc → stats → CTA → micro
// mode=overlap. Grid same-cell stacking.
// ============================================================

export function renderLayoutMC(data: LayoutData): string {
  const ms = getMoodStyles(data.mood, data.brandColor);
  const fontLinks = getFontLinks(data.fontSet);
  const fonts = getFontFamilies(data.fontSet);
  const headlineBack = (data.headlineBack ?? data.headline.slice(0, 10)).slice(0, 10);
  const headlineFront = (data.headlineFront ?? data.headline.slice(0, 10)).slice(0, 10);

  const body = `
${renderFadeInUpKeyframes()}
<section class="hero layout-mc" style="
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: ${data.brandColor};
  color: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
">
  <div class="content-wrap" style="
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    padding: clamp(32px, 4vw, 64px) clamp(16px, 3vw, 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(16px, 2vw, 24px);
  ">
    <!-- overlap-zone: grid same-cell stacking -->
    <div class="overlap-zone" style="
      display: grid;
      grid-template: 1fr / 1fr;
      place-items: center;
      min-height: 320px;
      width: 100%;
      animation: fadeInUp 0.8s ease 0.2s both;
    ">
      <!-- headline-back: z:1, align-self:start -->
      <div class="headline-back" style="
        grid-row: 1 / -1;
        grid-column: 1 / -1;
        z-index: 1;
        align-self: start;
        font-size: clamp(32px, 16vw, 80px);
        font-weight: 900;
        letter-spacing: -3px;
        line-height: 1;
        color: rgba(255,255,255,0.25);
        text-align: center;
        word-break: keep-all;
        pointer-events: none;
        user-select: none;
      ">${headlineBack}</div>

      <!-- model-zone: z:2, centered -->
      <div class="model-zone" style="
        grid-row: 1 / -1;
        grid-column: 1 / -1;
        z-index: 2;
        width: 80%;
        max-width: 400px;
      ">
        <img src="model.png" alt="model" style="
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4));
        " />
      </div>

      <!-- headline-front: z:3, align-self:end -->
      <div class="headline-front" style="
        grid-row: 1 / -1;
        grid-column: 1 / -1;
        z-index: 3;
        align-self: end;
        font-size: clamp(32px, 16vw, 80px);
        font-weight: 900;
        letter-spacing: -3px;
        line-height: 1;
        color: #ffffff;
        text-shadow: 0 4px 24px rgba(0,0,0,0.5);
        text-align: center;
        word-break: keep-all;
      ">${headlineFront}</div>
    </div>

    <!-- desc -->
    <div style="text-align: center;">
      ${renderDesc(data.desc, 'rgba(255,255,255,0.7)')}
    </div>

    <!-- stats -->
    <div style="margin: clamp(8px, 1vw, 16px) 0;">
      ${renderStats(data.stats.slice(0, 3), '#ffffff')}
    </div>

    <!-- CTA -->
    <div style="max-width: 480px; width: 100%;">
      ${renderCTA(data.ctaText, '#ffffff', data.brandColor, '10px')}
      ${renderMicro(data.microCopy, 'rgba(255,255,255,0.6)')}
    </div>
  </div>
</section>`;

  return htmlShell('Layout MC - Vivid Overlap', fontLinks, fonts, body);
}

// ============================================================
// LAYOUT-MD: 모델 상단 + 대각선 분할
// model-zone(height:55%, object-fit:cover, object-position:top)
// → diagonal-divider(clip-path on text-zone)
// → text-zone(background, padding)
//   → eyebrow → headline(48~56px) → subheadline → CTA → micro
// mode=background. Model fills top 55%, diagonal cut, text below.
// ============================================================

export function renderLayoutMD(data: LayoutData): string {
  const ms = getMoodStyles(data.mood, data.brandColor);
  const fontLinks = getFontLinks(data.fontSet);
  const fonts = getFontFamilies(data.fontSet);

  const textBg = ms.background === 'transparent' ? '#ffffff' : ms.background;
  const textColor = ms.textColor === '#ffffff' && textBg === '#ffffff'
    ? '#1a1a1a'
    : ms.textColor;
  const subColor = ms.subColor === 'rgba(255,255,255,0.65)' && textBg === '#ffffff'
    ? '#555555'
    : ms.subColor;

  const body = `
${renderFadeInUpKeyframes()}
<section class="hero layout-md" style="
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${textBg};
">
  <!-- model-zone: top 55% -->
  <div class="model-zone" style="
    position: relative;
    width: 100%;
    height: 55vh;
    min-height: 320px;
    overflow: hidden;
    z-index: 0;
    flex-shrink: 0;
  ">
    <img src="model.png" alt="model" style="
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      display: block;
    " />
  </div>

  <!-- text-zone: diagonal clip-path overlay -->
  <div class="text-zone" style="
    position: relative;
    z-index: 1;
    background: ${textBg};
    clip-path: polygon(0 0, 100% 8%, 100% 100%, 0 100%);
    margin-top: -48px;
    padding: clamp(48px, 6vw, 80px) clamp(16px, 4vw, 32px) clamp(40px, 5vw, 64px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: clamp(12px, 1.5vw, 20px);
    max-width: 720px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  ">
    ${renderEyebrow(data.eyebrow, subColor)}

    <h1 class="headline" style="
      font-size: clamp(36px, 6vw, 56px);
      font-weight: 900;
      letter-spacing: -3px;
      line-height: 1.08;
      word-break: keep-all;
      color: ${textColor};
      margin: 0;
      animation: fadeInUp 0.7s ease 0.2s both;
    ">${data.headline}</h1>

    <p class="subheadline" style="
      font-size: clamp(14px, 1.6vw, 22px);
      font-weight: 300;
      line-height: 1.75;
      color: ${subColor};
      margin: 0;
      animation: fadeInUp 0.7s ease 0.4s both;
    ">${data.subheadline}</p>

    <div style="max-width: 480px; width: 100%; margin-top: clamp(8px, 1vw, 16px);">
      ${renderCTA(data.ctaText, ms.ctaBackground, ms.ctaColor, ms.ctaRadius)}
      ${renderMicro(data.microCopy, subColor)}
    </div>
  </div>
</section>`;

  return htmlShell('Layout MD - Diagonal Split', fontLinks, fonts, body);
}

// ============================================================
// LAYOUT-ME: 모델 풀블리드 + 플로팅 배지
// model-bg(absolute, 100%, cover, z:0)
// → logo-row(absolute, top:20px, flex space-between, z:5)
// → floating-badge-1(absolute, right:16px, top:30%, z:5)
// → floating-badge-2(absolute, right:16px, top:50%, z:5)
// → bottom-overlay(gradient, z:5)
//   → event-pill → headline → subheadline → time-pill → CTA → micro
// mode=background. Floating badges on model image.
// ============================================================

export function renderLayoutME(data: LayoutData): string {
  const ms = getMoodStyles(data.mood, data.brandColor);
  const fontLinks = getFontLinks(data.fontSet);
  const fonts = getFontFamilies(data.fontSet);
  const badges = data.floatingBadges ?? ['단독증정', '64% OFF'];
  const brandNames = data.brandNames ?? ['BRAND', 'BRAND'];
  const eventText = data.event ?? '';
  const timePill = data.timePill ?? '';

  const body = `
${renderFadeInUpKeyframes()}
<section class="hero layout-me" style="
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
">
  <!-- model-bg: fullbleed background -->
  <img src="model.png" alt="model" style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  " />

  <!-- logo-row: absolute top -->
  <div class="logo-row" style="
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 clamp(16px, 3vw, 32px);
    z-index: 5;
  ">
    <span style="
      font-size: clamp(13px, 1.2vw, 18px);
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 2px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.5);
    ">${brandNames[0]}</span>
    <span style="
      font-size: clamp(13px, 1.2vw, 18px);
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 2px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.5);
    ">${brandNames[1]}</span>
  </div>

  <!-- floating-badge-1: right side, top:30% -->
  ${badges[0] ? `<div class="floating-badge" style="
    position: absolute;
    right: 16px;
    top: 30%;
    z-index: 5;
    animation: fadeInUp 0.7s ease 0.3s both;
  ">
    <div style="
      background: ${data.brandColor};
      color: #ffffff;
      font-size: clamp(12px, 1.1vw, 16px);
      font-weight: 900;
      padding: 10px 20px;
      border-radius: 999px;
      white-space: nowrap;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    ">${badges[0]}</div>
  </div>` : ''}

  <!-- floating-badge-2: right side, top:50% -->
  ${badges[1] ? `<div class="floating-badge" style="
    position: absolute;
    right: 16px;
    top: 50%;
    z-index: 5;
    animation: fadeInUp 0.7s ease 0.5s both;
  ">
    <div style="
      background: ${data.brandColor};
      color: #ffffff;
      font-size: clamp(12px, 1.1vw, 16px);
      font-weight: 900;
      padding: 10px 20px;
      border-radius: 999px;
      white-space: nowrap;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    ">${badges[1]}</div>
  </div>` : ''}

  <!-- bottom-overlay: gradient + content -->
  <div class="bottom-overlay" style="
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 40%);
    padding: clamp(80px, 10vw, 160px) clamp(16px, 3vw, 32px) clamp(32px, 4vw, 56px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: clamp(8px, 1vw, 16px);
    max-width: 720px;
    margin: 0 auto;
  ">
    ${eventText ? `<div class="event-pill" style="
      background: ${data.brandColor};
      color: #ffffff;
      font-size: clamp(12px, 1.1vw, 16px);
      font-weight: 900;
      padding: 8px 20px;
      border-radius: 8px;
      animation: fadeInUp 0.7s ease 0.3s both;
    ">${eventText}</div>` : ''}

    <h1 class="headline" style="
      font-size: clamp(36px, 6vw, 56px);
      font-weight: 900;
      letter-spacing: -3px;
      line-height: 1.08;
      word-break: keep-all;
      color: #ffffff;
      margin: 0;
      animation: fadeInUp 0.7s ease 0.4s both;
    ">${data.headline}</h1>

    <p class="subheadline" style="
      font-size: clamp(14px, 1.6vw, 22px);
      font-weight: 300;
      line-height: 1.75;
      color: rgba(255,255,255,0.7);
      margin: 0;
      animation: fadeInUp 0.7s ease 0.5s both;
    ">${data.subheadline}</p>

    ${timePill ? `<div class="time-pill" style="
      display: inline-block;
      border: 2px solid ${data.brandColor};
      color: #ffffff;
      font-size: clamp(13px, 1.2vw, 18px);
      font-weight: 700;
      padding: 8px 24px;
      border-radius: 999px;
      animation: fadeInUp 0.7s ease 0.6s both;
    ">${timePill}</div>` : ''}

    <div style="max-width: 480px; width: 100%; margin-top: clamp(8px, 1vw, 16px);">
      ${renderCTA(data.ctaText, ms.ctaBackground, ms.ctaColor, ms.ctaRadius)}
      ${renderMicro(data.microCopy, 'rgba(255,255,255,0.6)')}
    </div>
  </div>
</section>`;

  return htmlShell('Layout ME - Fullbleed + Floating Badges', fontLinks, fonts, body);
}
