// ============================================================
// Header Banner — Layout Templates G, H, I
// G: 미니멀 럭셔리 | H: 플로팅 오브제 | I: 숫자 임팩트
// Pure functions returning complete HTML documents.
// ============================================================

import type { HeroMood, FontSetId } from './types';
import { getMoodStyles } from './moods';
import { getFontLinks, getFontFamilies } from './fonts';
import {
  renderEyebrow,
  renderHeadline,
  renderDesc,
  renderCTA,
  renderMicro,
  renderStats,
  renderTrustBadge,
  renderBigStat,
  renderNoise,
  renderFadeInUpKeyframes,
} from './components';

// ── LayoutData interface ──

export interface LayoutData {
  readonly mood: HeroMood;
  readonly fontSet: FontSetId;
  readonly brandColor: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly desc: string;
  readonly stats: ReadonlyArray<{ number: string; unit: string; label?: string }>;
  readonly awards: string[];
  readonly ctaText: string;
  readonly microCopy: string;
  readonly productImageSrc: string;
  readonly subjectSize?: 'small' | 'medium' | 'large';
}

// ── Product zone size helper ──

function getProductWidth(size?: 'small' | 'medium' | 'large'): { width: string; maxWidth: string } {
  switch (size) {
    case 'small':  return { width: '35%', maxWidth: '220px' };
    case 'large':  return { width: '70%', maxWidth: '420px' };
    case 'medium':
    default:       return { width: '50%', maxWidth: '320px' };
  }
}

// ── helpers ──

function htmlShell(
  title: string,
  fontLinks: string,
  bodyContent: string,
): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
${fontLinks}
${renderFadeInUpKeyframes()}
</head>
<body style="margin:0;padding:0;overflow-x:hidden;">
${bodyContent}
</body>
</html>`;
}

// ================================================================
// LAYOUT-G: 미니멀 럭셔리
// Massive whitespace. eyebrow -> headline(72px) -> product(40%)
// -> ghost CTA (border-only) -> micro
// NO stats. NO trust. NO noise. NO ghost.
// product mode=hero-flow, rotate FORBIDDEN.
// ================================================================

export function renderLayoutG(data: LayoutData): string {
  const mood = getMoodStyles(data.mood, data.brandColor);
  const fonts = getFontFamilies(data.fontSet);
  const fontLinks = getFontLinks(data.fontSet);

  const bodyContent = `<section style="
    position: relative;
    min-height: 100vh;
    background: ${mood.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 120px clamp(24px, 5vw, 80px) clamp(64px, 8vw, 120px);
    text-align: center;
    font-family: ${fonts.micro};
    overflow: hidden;
  ">

    <!-- eyebrow -->
    ${renderEyebrow(data.eyebrow, mood.subColor)}

    <!-- headline -->
    <h1 style="
      font-family: ${fonts.headline};
      font-size: clamp(48px, 5.5vw, 72px);
      font-weight: 900;
      letter-spacing: -4px;
      line-height: 1.08;
      color: ${mood.textColor};
      margin: 0 0 clamp(48px, 6vw, 80px) 0;
      word-break: keep-all;
      animation: fadeInUp 0.7s ease 0.2s both;
    ">${data.headline}</h1>

    <!-- product zone (size-aware, NO rotate) — minimal luxury -->
    <div class="product-zone" style="
      width: ${getProductWidth(data.subjectSize).width};
      max-width: ${getProductWidth(data.subjectSize).maxWidth};
      margin: 0 auto clamp(48px, 6vw, 80px);
      animation: fadeInUp 0.8s ease 0.4s both;
    "><img src="${data.productImageSrc ?? 'product.png'}" alt="product" style="
      width: 100%;
      height: auto;
      display: block;
      filter: ${mood.productShadow};
    " /></div>

    <!-- ghost CTA (border-only, transparent bg) -->
    <button style="
      width: 100%;
      max-width: 400px;
      padding: 22px 0;
      font-family: ${fonts.sub};
      font-size: clamp(16px, 1.7vw, 24px);
      font-weight: 700;
      color: ${mood.accentColor};
      background: transparent;
      border: 1px solid ${data.brandColor}1F;
      border-radius: 10px;
      cursor: pointer;
      transition: transform 0.25s ease, background 0.25s ease;
      animation: fadeInUp 0.7s ease 0.6s both;
    " onmouseover="this.style.transform='translateY(-3px)';this.style.background='${data.brandColor}0A'"
      onmouseout="this.style.transform='translateY(0)';this.style.background='transparent'"
    >${data.ctaText}</button>

    <!-- micro -->
    ${renderMicro(data.microCopy, mood.subColor)}

  </section>`;

  return htmlShell('Layout G - Minimal Luxury', fontLinks, bodyContent);
}

// ================================================================
// LAYOUT-H: 플로팅 오브제
// headline -> desc -> product-container(relative)
//   -> product(center, 50%, absolute, z:3)
//   -> floating-card-left(absolute, brandColor/8% bg, blur)
//   -> floating-card-right(absolute)
//   -> floating-badge-bottom(absolute, trust)
// -> remaining stats -> CTA -> micro
// mode=hero-absolute
// ================================================================

export function renderLayoutH(data: LayoutData): string {
  const mood = getMoodStyles(data.mood, data.brandColor);
  const fonts = getFontFamilies(data.fontSet);
  const fontLinks = getFontLinks(data.fontSet);

  const stat0 = data.stats[0] ?? { number: '99', unit: '%', label: '' };
  const stat1 = data.stats[1] ?? { number: '50', unit: 'K+', label: '' };
  const remainingStats = data.stats.slice(2);
  const trustText = data.awards[0] ?? '';

  const bodyContent = `<section style="
    position: relative;
    min-height: 100vh;
    background: ${mood.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: clamp(64px, 8vw, 120px) clamp(24px, 5vw, 80px);
    text-align: center;
    font-family: ${fonts.micro};
    overflow: hidden;
  ">

    ${mood.noiseOpacity !== '0' ? renderNoise() : ''}

    <!-- headline -->
    <h1 style="
      font-family: ${fonts.headline};
      font-size: clamp(42px, 7.2vw, 100px);
      font-weight: 900;
      letter-spacing: -4px;
      line-height: 1.08;
      color: ${mood.textColor};
      margin: 0 0 clamp(16px, 2vw, 32px) 0;
      word-break: keep-all;
      animation: fadeInUp 0.7s ease 0.2s both;
    ">${data.headline}</h1>

    <!-- desc -->
    ${renderDesc(data.desc, mood.subColor)}

    <!-- product container (relative, floating objects) -->
    <div class="product-container" style="
      position: relative;
      width: 100%;
      max-width: 600px;
      min-height: clamp(300px, 40vw, 500px);
      margin: 0 auto clamp(32px, 4vw, 56px);
      animation: fadeInUp 0.8s ease 0.5s both;
    ">

      <!-- product zone (center, absolute, z:3) -->
      <div class="product-zone" style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${getProductWidth(data.subjectSize).width};
        max-width: ${getProductWidth(data.subjectSize).maxWidth};
        z-index: 3;
      "><img src="${data.productImageSrc ?? 'product.png'}" alt="product" style="
        width: 100%;
        height: auto;
        display: block;
        filter: ${mood.productShadow};
      " /></div>

      <!-- floating card LEFT -->
      <div class="floating-card-left" style="
        position: absolute;
        left: -20px;
        top: 25%;
        z-index: 2;
        background: ${data.brandColor}14;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid ${data.brandColor}1A;
        border-radius: 16px;
        padding: clamp(16px, 2vw, 24px);
        text-align: center;
        animation: fadeInUp 0.7s ease 0.7s both;
      ">
        <span style="
          display: block;
          font-size: 32px;
          font-weight: 900;
          color: ${mood.accentColor};
          line-height: 1.1;
        ">${stat0.number}<span style="font-size:14px;font-weight:300;margin-left:2px;">${stat0.unit}</span></span>
        ${stat0.label ? `<span style="display:block;font-size:clamp(11px,1vw,13px);font-weight:300;color:${mood.subColor};margin-top:4px;">${stat0.label}</span>` : ''}
      </div>

      <!-- floating card RIGHT -->
      <div class="floating-card-right" style="
        position: absolute;
        right: -20px;
        top: 15%;
        z-index: 2;
        background: ${data.brandColor}14;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid ${data.brandColor}1A;
        border-radius: 16px;
        padding: clamp(16px, 2vw, 24px);
        text-align: center;
        animation: fadeInUp 0.7s ease 0.8s both;
      ">
        <span style="
          display: block;
          font-size: 32px;
          font-weight: 900;
          color: ${mood.accentColor};
          line-height: 1.1;
        ">${stat1.number}<span style="font-size:14px;font-weight:300;margin-left:2px;">${stat1.unit}</span></span>
        ${stat1.label ? `<span style="display:block;font-size:clamp(11px,1vw,13px);font-weight:300;color:${mood.subColor};margin-top:4px;">${stat1.label}</span>` : ''}
      </div>

      <!-- floating badge BOTTOM (trust) -->
      ${trustText ? `<div class="floating-badge-bottom" style="
        position: absolute;
        bottom: -16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 4;
        background: ${data.brandColor}14;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid ${data.brandColor}1A;
        border-radius: 999px;
        padding: 8px 24px;
        font-size: clamp(11px, 1vw, 14px);
        font-weight: 700;
        color: ${mood.accentColor};
        white-space: nowrap;
        animation: fadeInUp 0.7s ease 0.9s both;
      ">${trustText}</div>` : ''}

    </div>

    <!-- remaining stats -->
    ${remainingStats.length > 0 ? `<div style="margin-bottom: clamp(24px, 3vw, 40px);">${renderStats(remainingStats, mood.accentColor)}</div>` : ''}

    <!-- CTA -->
    <div style="width:100%;max-width:400px;">
      ${renderCTA(data.ctaText, mood.ctaBackground, mood.ctaColor, mood.ctaRadius)}
    </div>

    <!-- micro -->
    ${renderMicro(data.microCopy, mood.subColor)}

  </section>`;

  return htmlShell('Layout H - Floating Objet', fontLinks, bodyContent);
}

// ================================================================
// LAYOUT-I: 숫자 임팩트
// eyebrow -> big-stat(clamp(80px,14vw,200px), weight 900, -8px tracking)
// -> headline(48px, secondary) -> desc -> product(40%, small)
// -> sub-stats(24px, small) -> CTA -> micro
// The hero number dominates. headline is secondary.
// ================================================================

export function renderLayoutI(data: LayoutData): string {
  const mood = getMoodStyles(data.mood, data.brandColor);
  const fonts = getFontFamilies(data.fontSet);
  const fontLinks = getFontLinks(data.fontSet);

  const heroStat = data.stats[0] ?? { number: '100', unit: '%', label: '' };
  const subStats = data.stats.slice(1);

  const bodyContent = `<section style="
    position: relative;
    min-height: 100vh;
    background: ${mood.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: clamp(64px, 8vw, 120px) clamp(24px, 5vw, 80px);
    text-align: center;
    font-family: ${fonts.micro};
    overflow: hidden;
  ">

    ${mood.noiseOpacity !== '0' ? renderNoise() : ''}

    <!-- eyebrow -->
    ${renderEyebrow(data.eyebrow, mood.subColor)}

    <!-- big stat (hero number) -->
    <div class="big-stat" style="
      text-align: center;
      margin: 0 0 clamp(24px, 3vw, 40px) 0;
      animation: fadeInUp 0.7s ease 0.3s both;
    ">
      <span style="
        display: block;
        font-family: ${fonts.headline};
        font-size: clamp(80px, 14vw, 200px);
        font-weight: 900;
        letter-spacing: -8px;
        line-height: 1;
        color: ${mood.accentColor};
      ">${heroStat.number}<span style="
        font-size: clamp(24px, 4vw, 48px);
        font-weight: 300;
        letter-spacing: -2px;
        margin-left: 4px;
      ">${heroStat.unit}</span></span>
      ${heroStat.label ? `<span style="
        display: block;
        font-size: clamp(14px, 1.6vw, 22px);
        font-weight: 300;
        color: ${mood.subColor};
        margin-top: 8px;
      ">${heroStat.label}</span>` : ''}
    </div>

    <!-- headline (48px, secondary role) -->
    <h1 style="
      font-family: ${fonts.headline};
      font-size: clamp(32px, 4vw, 48px);
      font-weight: 900;
      letter-spacing: -3px;
      line-height: 1.15;
      color: ${mood.textColor};
      margin: 0 0 clamp(16px, 2vw, 24px) 0;
      word-break: keep-all;
      animation: fadeInUp 0.7s ease 0.4s both;
    ">${data.headline}</h1>

    <!-- desc -->
    ${renderDesc(data.desc, mood.subColor)}

    <!-- product zone (dynamic size) -->
    <div class="product-zone" style="
      width: ${getProductWidth(data.subjectSize).width};
      max-width: ${getProductWidth(data.subjectSize).maxWidth};
      margin: 0 auto clamp(32px, 4vw, 48px);
      animation: fadeInUp 0.8s ease 0.6s both;
    "><img src="${data.productImageSrc ?? 'product.png'}" alt="product" style="
      width: 100%;
      height: auto;
      display: block;
      filter: ${mood.productShadow};
    " /></div>

    <!-- sub stats (small, 24px numbers) -->
    ${subStats.length > 0 ? `<div style="margin-bottom: clamp(24px, 3vw, 40px);">
      <div class="sub-stats-row" style="
        display: flex;
        justify-content: center;
        gap: clamp(24px, 3.5vw, 48px);
        animation: fadeInUp 0.7s ease 0.7s both;
      ">${subStats.map(s => `<div style="text-align:center;">
        <span style="
          display: block;
          font-size: 24px;
          font-weight: 900;
          color: ${mood.accentColor};
          line-height: 1.1;
        ">${s.number}<span style="font-size:12px;font-weight:300;margin-left:2px;">${s.unit}</span></span>
        ${s.label ? `<span style="display:block;font-size:clamp(11px,0.9vw,13px);font-weight:300;color:${mood.subColor};opacity:0.6;margin-top:4px;">${s.label}</span>` : ''}
      </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- CTA -->
    <div style="width:100%;max-width:400px;">
      ${renderCTA(data.ctaText, mood.ctaBackground, mood.ctaColor, mood.ctaRadius)}
    </div>

    <!-- micro -->
    ${renderMicro(data.microCopy, mood.subColor)}

  </section>`;

  return htmlShell('Layout I - Number Impact', fontLinks, bodyContent);
}
