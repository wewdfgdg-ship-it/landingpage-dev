// ============================================================
// Header Banner — Layout Template Renderers (A, B, C)
// renderLayout(data) → complete HTML document string
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
  renderPriceBlock,
  renderNoise,
  renderGhost,
  renderFadeInUpKeyframes,
} from './components';
import type { LayoutId, HeroMood, FontSetId } from './types';

// ── Data interface ──

export interface LayoutData {
  readonly layoutId: LayoutId;
  readonly mood: HeroMood;
  readonly fontSet: FontSetId;
  readonly brandColor: string;
  readonly productName: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly subheadline: string;
  readonly desc: string;
  readonly stats: ReadonlyArray<{ number: string; unit: string; label?: string }>;
  readonly awards: string[];
  readonly ctaText: string;
  readonly microCopy: string;
  readonly price?: string;
  readonly discount?: string;
  readonly event?: string;
  readonly subjectSize?: 'small' | 'medium' | 'large';
  readonly imageUrl?: string;
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

// ── Shared HTML document wrapper ──

function wrapDocument(
  data: LayoutData,
  bodyContent: string,
): string {
  const mood = getMoodStyles(data.mood, data.brandColor);
  const fonts = getFontFamilies(data.fontSet);
  const fontLinks = getFontLinks(data.fontSet);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.productName}</title>
  ${fontLinks}
  ${renderFadeInUpKeyframes()}
  <style>
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      word-break: keep-all;
    }
    .hero {
      position: relative;
      overflow: hidden;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${mood.background};
      color: ${mood.textColor};
    }
    .hero .headline {
      font-family: ${fonts.headline};
    }
    .hero .eyebrow,
    .hero .desc,
    .hero .micro,
    .hero .stat-label,
    .hero .trust-badge {
      font-family: ${fonts.sub};
    }
    .hero .stat-number,
    .hero .sale-price,
    .hero .discount-badge,
    .hero .big-badge,
    .hero .big-stat {
      font-family: ${fonts.headline};
    }
    .hero .cta-btn {
      font-family: ${fonts.sub};
    }
  </style>
</head>
<body>
  <section class="hero ${data.mood}">
    ${renderNoise()}
    ${renderGhost(data.productName.charAt(0).toUpperCase())}
    <div class="hero-inner" style="
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: clamp(40px, 6vw, 80px) clamp(16px, 4vw, 40px);
    ">
      ${bodyContent}
    </div>
  </section>
</body>
</html>`;
}

// ── LAYOUT-A: 센터 임팩트 ──

function renderLayoutA(data: LayoutData): string {
  const mood = getMoodStyles(data.mood, data.brandColor);

  const fw = mood.fontWeights;
  const content = `
      <div style="text-align: center;">
        ${renderEyebrow(data.eyebrow, mood.subColor, fw.eyebrow)}
        ${renderHeadline(data.headline, mood.textColor, mood.accentColor)}
        <div style="display: flex; justify-content: center;">
          ${renderDesc(data.desc, mood.subColor, fw.desc)}
        </div>
        ${renderProductZone('hero-flow', 'A', data.subjectSize ?? 'medium', mood.productShadow, data.imageUrl)}
        <div style="margin: clamp(24px, 3vw, 40px) 0;">
          ${renderStats(data.stats.slice(0, 3), mood.accentColor, fw.statLabel)}
        </div>
        ${renderTrustBadge(data.awards, data.brandColor)}
        <div style="max-width: 480px; margin: clamp(24px, 3vw, 40px) auto 0;">
          ${renderCTA(data.ctaText, mood.ctaBackground, mood.ctaColor, mood.ctaRadius, fw.cta)}
          ${renderMicro(data.microCopy, mood.subColor, fw.micro)}
        </div>
      </div>`;

  return wrapDocument(data, content);
}

// ── LAYOUT-B: 좌우 분할 ──

function renderLayoutB(data: LayoutData): string {
  const mood = getMoodStyles(data.mood, data.brandColor);
  const fw = mood.fontWeights;

  const content = `
      <div class="split" style="
        display: flex;
        gap: 24px;
        align-items: center;
        flex-wrap: wrap;
      ">
        <div class="left" style="
          flex: 1;
          min-width: 280px;
          text-align: left;
        ">
          ${renderEyebrow(data.eyebrow, mood.subColor, fw.eyebrow)}
          <h1 class="headline" style="
            font-size: clamp(36px, 5.6vw, 56px);
            font-weight: 900;
            letter-spacing: -3px;
            line-height: 1.12;
            word-break: keep-all;
            color: ${mood.textColor};
            margin: 0 0 clamp(16px, 2vw, 24px) 0;
            animation: fadeInUp 0.7s ease 0.2s both;
          ">${buildAccentHeadline(data.headline, mood.accentColor)}</h1>
          ${renderDesc(data.desc, mood.subColor, fw.desc)}
          <div style="
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            animation: fadeInUp 0.7s ease 0.6s both;
          ">
            <button class="cta-btn" style="
              padding: 18px 40px;
              font-size: clamp(15px, 1.5vw, 20px);
              font-weight: ${fw.cta};
              color: ${mood.ctaColor};
              background: ${mood.ctaBackground};
              border: none;
              border-radius: ${mood.ctaRadius};
              box-shadow: 0 0 24px ${mood.ctaBackground}40;
              cursor: pointer;
              transition: transform 0.25s ease, box-shadow 0.25s ease;
            " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">${data.ctaText}</button>
            <button style="
              padding: 18px 40px;
              font-size: clamp(15px, 1.5vw, 20px);
              font-weight: ${fw.cta};
              color: ${mood.textColor};
              background: transparent;
              border: 1px solid ${mood.textColor}33;
              border-radius: ${mood.ctaRadius};
              cursor: pointer;
              transition: border-color 0.25s ease;
            " onmouseover="this.style.borderColor='${mood.accentColor}'" onmouseout="this.style.borderColor='${mood.textColor}33'">자세히 보기</button>
          </div>
          ${renderMicro(data.microCopy, mood.subColor, fw.micro)}
        </div>
        <div class="right" style="
          flex: 0 0 45%;
          max-width: 300px;
          min-width: 240px;
        ">
          ${renderProductZone('flow', 'B', data.subjectSize ?? 'medium', mood.productShadow, data.imageUrl)}
        </div>
      </div>
      <div class="stats-strip" style="
        margin-top: clamp(32px, 4vw, 56px);
        padding: clamp(16px, 2vw, 24px) 0;
        border-top: 1px solid ${mood.textColor}12;
        border-bottom: 1px solid ${mood.textColor}12;
      ">
        ${renderStats(data.stats, mood.accentColor, fw.statLabel)}
      </div>`;

  return wrapDocument(data, content);
}

// ── LAYOUT-C: 가격 전면 ──

function renderLayoutC(data: LayoutData): string {
  const mood = getMoodStyles(data.mood, data.brandColor);
  const fw = mood.fontWeights;
  const originalPrice = data.price ?? '';
  const discount = data.discount ?? '';

  const content = `
      <div style="text-align: center;">
        ${discount ? `<div style="
          animation: fadeInUp 0.7s ease 0.1s both;
          margin-bottom: clamp(16px, 2vw, 24px);
        "><span class="discount-badge" style="
          display: inline-block;
          background: ${data.brandColor};
          color: #fff;
          font-size: clamp(14px, 1.4vw, 20px);
          font-weight: 900;
          padding: 8px 24px;
          border-radius: 999px;
        ">${discount}</span></div>` : ''}
        ${renderHeadline(data.headline, mood.textColor, mood.accentColor)}
        <div style="display: flex; justify-content: center;">
          ${renderDesc(data.desc, mood.subColor, fw.desc)}
        </div>
        ${renderProductZone('hero-flow', 'C', data.subjectSize ?? 'medium', mood.productShadow, data.imageUrl)}
        ${renderPriceBlock(
          originalPrice,
          data.subheadline,
          discount,
          data.brandColor,
        )}
        <div style="margin: clamp(16px, 2vw, 24px) 0;">
          ${renderTrustBadge(data.awards, data.brandColor)}
        </div>
        <div style="max-width: 480px; margin: clamp(16px, 2vw, 24px) auto 0;">
          <button class="cta-btn" style="
            width: 100%;
            padding: 22px 0;
            min-height: 64px;
            font-size: clamp(16px, 1.7vw, 24px);
            font-weight: ${fw.cta};
            color: ${mood.ctaColor};
            background: ${mood.ctaBackground};
            border: none;
            border-radius: ${mood.ctaRadius};
            box-shadow: 0 0 30px ${mood.ctaBackground}59;
            cursor: pointer;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            animation: fadeInUp 0.7s ease 1.0s both;
          " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">${data.ctaText}</button>
          ${renderMicro(data.microCopy, mood.subColor, fw.micro)}
        </div>
      </div>`;

  return wrapDocument(data, content);
}

// ── Helper: accent last word in headline ──

function buildAccentHeadline(text: string, accentColor: string): string {
  const words = text.trim().split(/\s+/);
  const lastWord = words.pop() ?? '';
  const leading = words.join(' ');

  const accentSpan = `<span class="accent" style="color:${accentColor};text-shadow:0 0 30px ${accentColor}40;">${lastWord}</span>`;

  return leading ? `${leading} ${accentSpan}` : accentSpan;
}

// ── Public API ──

export function renderLayout(data: LayoutData): string {
  switch (data.layoutId) {
    case 'A':
      return renderLayoutA(data);
    case 'B':
      return renderLayoutB(data);
    case 'C':
      return renderLayoutC(data);
    default:
      return renderLayoutA(data);
  }
}
