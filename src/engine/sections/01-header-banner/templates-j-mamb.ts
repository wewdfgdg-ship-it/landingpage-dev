// ============================================================
// Header Banner — Layout Templates J, MA, MB
// LAYOUT-J: 긴급 카운트다운
// LAYOUT-MA: 모델 풀블리드 + 하단 오버레이
// LAYOUT-MB: 헤드라인 dominant + 모델 하단
// ============================================================

import type { HeroMood, FontSetId } from './types';
import { getMoodStyles } from './moods';
import { getFontLinks, getFontFamilies } from './fonts';
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
  renderUrgencyBar,
  renderNoise,
  renderGhost,
  renderFadeInUpKeyframes,
} from './components';

// ── LayoutData 공통 인터페이스 ──

export interface LayoutData {
  readonly mood: HeroMood;
  readonly fontSet: FontSetId;
  readonly brandColor: string;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly subheadline?: string;
  readonly desc?: string;
  readonly ctaText: string;
  readonly microCopy?: string;
  readonly stats?: ReadonlyArray<{ number: string; unit: string; label?: string }>;
  readonly awards?: string[];
  readonly originalPrice?: string;
  readonly salePrice?: string;
  readonly discount?: string;
  readonly urgencyText?: string;
  readonly stockPercent?: number;
  readonly productImageSrc?: string;
  readonly modelImageSrc?: string;
  readonly ghostChar?: string;
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

// ── LAYOUT-J: 긴급 카운트다운 ──

export function renderLayoutJ(data: LayoutData): string {
  const mood = getMoodStyles(data.mood, data.brandColor);
  const fonts = getFontFamilies(data.fontSet);
  const fontLinks = getFontLinks(data.fontSet);

  const urgencyText = data.urgencyText ?? '🔥 오늘 자정 마감';
  const originalPrice = data.originalPrice ?? '89,000원';
  const salePrice = data.salePrice ?? '39,900원';
  const discountText = data.discount ?? '55% OFF';
  const stockPct = data.stockPercent ?? 23;
  const productSrc = data.productImageSrc ?? 'product.png';

  const urgencyBar = renderUrgencyBar(urgencyText, data.brandColor);

  const headline = `<h1 class="headline" style="
    font-family: ${fonts.headline};
    font-size: clamp(32px, 5.5vw, 64px);
    font-weight: 900;
    letter-spacing: -3px;
    line-height: 1.1;
    word-break: keep-all;
    color: ${mood.textColor};
    margin: 0 0 clamp(8px, 1vw, 16px) 0;
    text-align: center;
    animation: fadeInUp 0.7s ease 0.2s both;
  ">${data.headline}</h1>`;

  const desc = data.desc
    ? `<p class="desc" style="
        font-family: ${fonts.sub};
        font-size: clamp(13px, 1.4vw, 18px);
        font-weight: 300;
        line-height: 1.6;
        color: ${mood.subColor};
        text-align: center;
        margin: 0 0 clamp(16px, 2vw, 24px) 0;
        animation: fadeInUp 0.7s ease 0.3s both;
      ">${data.desc}</p>`
    : '';

  const productSize = getProductWidth(data.subjectSize);
  const productZone = `<div class="product-zone" style="
    position: relative;
    width: ${productSize.width};
    max-width: ${productSize.maxWidth};
    margin: 0 auto clamp(16px, 2vw, 24px);
    animation: fadeInUp 0.8s ease 0.4s both;
  "><img src="${productSrc}" alt="product" style="
    width: 100%;
    height: auto;
    display: block;
    filter: ${mood.productShadow};
  " /></div>`;

  const priceBlock = `<div class="price-block" style="
    text-align: center;
    margin: 0 0 clamp(16px, 2vw, 24px) 0;
    animation: fadeInUp 0.7s ease 0.5s both;
  ">
    <span class="discount-badge" style="
      display: inline-block;
      background: ${data.brandColor};
      color: #fff;
      font-family: ${fonts.sub};
      font-size: clamp(13px, 1.2vw, 18px);
      font-weight: 900;
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 8px;
    ">${discountText}</span>
    <span class="original-price" style="
      display: block;
      font-family: ${fonts.micro};
      font-size: clamp(14px, 1.4vw, 20px);
      font-weight: 300;
      text-decoration: line-through;
      color: ${mood.subColor};
      opacity: 0.5;
      margin-bottom: 4px;
    ">${originalPrice}</span>
    <span class="sale-price" style="
      display: block;
      font-family: ${fonts.headline};
      font-size: 64px;
      font-weight: 900;
      color: ${data.brandColor};
      line-height: 1.1;
    ">${salePrice}</span>
  </div>`;

  const countdownTimer = `<div class="countdown-timer" style="
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 0 0 clamp(16px, 2vw, 24px) 0;
    animation: fadeInUp 0.7s ease 0.6s both;
  ">
    <div class="countdown-box" style="
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 12px 16px;
      min-width: 72px;
      text-align: center;
    ">
      <span id="cd-hours" style="
        display: block;
        font-family: ${fonts.headline};
        font-size: 32px;
        font-weight: 900;
        color: ${mood.textColor};
        line-height: 1.2;
      ">00</span>
      <span style="
        font-family: ${fonts.micro};
        font-size: 11px;
        font-weight: 300;
        color: ${mood.subColor};
        letter-spacing: 1px;
      ">HOURS</span>
    </div>
    <div class="countdown-box" style="
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 12px 16px;
      min-width: 72px;
      text-align: center;
    ">
      <span id="cd-minutes" style="
        display: block;
        font-family: ${fonts.headline};
        font-size: 32px;
        font-weight: 900;
        color: ${mood.textColor};
        line-height: 1.2;
      ">00</span>
      <span style="
        font-family: ${fonts.micro};
        font-size: 11px;
        font-weight: 300;
        color: ${mood.subColor};
        letter-spacing: 1px;
      ">MIN</span>
    </div>
    <div class="countdown-box" style="
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 12px 16px;
      min-width: 72px;
      text-align: center;
    ">
      <span id="cd-seconds" style="
        display: block;
        font-family: ${fonts.headline};
        font-size: 32px;
        font-weight: 900;
        color: ${data.brandColor};
        line-height: 1.2;
      ">00</span>
      <span style="
        font-family: ${fonts.micro};
        font-size: 11px;
        font-weight: 300;
        color: ${mood.subColor};
        letter-spacing: 1px;
      ">SEC</span>
    </div>
  </div>`;

  const stockBar = `<div class="stock-bar-wrap" style="
    width: 100%;
    max-width: 400px;
    margin: 0 auto clamp(16px, 2vw, 24px);
    animation: fadeInUp 0.7s ease 0.7s both;
  ">
    <div style="
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    ">
      <span style="
        font-family: ${fonts.micro};
        font-size: 12px;
        font-weight: 700;
        color: ${data.brandColor};
      ">남은 수량 ${stockPct}%</span>
      <span style="
        font-family: ${fonts.micro};
        font-size: 12px;
        font-weight: 300;
        color: ${mood.subColor};
      ">곧 품절</span>
    </div>
    <div class="stock-bar" style="
      width: 100%;
      height: 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 3px;
      overflow: hidden;
    ">
      <div class="stock-fill" style="
        width: ${stockPct}%;
        height: 100%;
        background: ${data.brandColor};
        border-radius: 3px;
        transition: width 1s ease;
      "></div>
    </div>
  </div>`;

  const ctaBtn = `<div style="
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    animation: fadeInUp 0.7s ease 0.8s both;
  "><button class="cta-btn" style="
    width: 100%;
    height: 64px;
    font-family: ${fonts.sub};
    font-size: clamp(16px, 1.7vw, 24px);
    font-weight: 700;
    color: ${mood.ctaColor};
    background: ${mood.ctaBackground};
    border: none;
    border-radius: ${mood.ctaRadius};
    box-shadow: 0 0 30px ${data.brandColor}59;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">${data.ctaText}</button></div>`;

  const micro = data.microCopy
    ? `<p class="micro" style="
        font-family: ${fonts.micro};
        font-size: clamp(11px, 0.9vw, 13px);
        font-weight: 300;
        color: ${mood.subColor};
        margin: 8px 0 0 0;
        text-align: center;
      ">${data.microCopy}</p>`
    : '';

  const countdownScript = `<script>
(function() {
  function updateCountdown() {
    var now = new Date();
    var midnight = new Date();
    midnight.setHours(23, 59, 59, 0);
    var diff = midnight.getTime() - now.getTime();
    if (diff < 0) diff = 0;
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var hEl = document.getElementById('cd-hours');
    var mEl = document.getElementById('cd-minutes');
    var sEl = document.getElementById('cd-seconds');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
</script>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
${fontLinks}
${renderFadeInUpKeyframes()}
</head>
<body style="margin:0;padding:0;">
<section class="hero-j" style="
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: ${mood.background};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
">
  ${renderNoise()}
  ${data.ghostChar ? renderGhost(data.ghostChar) : ''}
  ${urgencyBar}
  <div class="hero-content" style="
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 560px;
    padding: clamp(32px, 4vw, 56px) 24px clamp(40px, 5vw, 64px);
    display: flex;
    flex-direction: column;
    align-items: center;
  ">
    ${headline}
    ${desc}
    ${productZone}
    ${priceBlock}
    ${countdownTimer}
    ${stockBar}
    ${ctaBtn}
    ${micro}
  </div>
</section>
${countdownScript}
</body>
</html>`;
}

// ── LAYOUT-MA: 모델 풀블리드 + 하단 오버레이 ──

export function renderLayoutMA(data: LayoutData): string {
  const mood = getMoodStyles(data.mood, data.brandColor);
  const fonts = getFontFamilies(data.fontSet);
  const fontLinks = getFontLinks(data.fontSet);

  const modelSrc = data.modelImageSrc;
  const hasModelImage = modelSrc && modelSrc.length > 0;

  const modelBg = hasModelImage
    ? `<img src="${modelSrc}" alt="model" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        z-index: 0;
      " />`
    : `<div class="model-placeholder" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 24px;
        z-index: 0;
      ">모델 이미지</div>`;

  const gradientOverlay = `<div class="gradient-overlay" style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.88) 65%);
    z-index: 1;
    pointer-events: none;
  "></div>`;

  const eyebrow = data.eyebrow
    ? `<p class="eyebrow" style="
        font-family: ${fonts.micro};
        font-size: clamp(11px, 1.1vw, 16px);
        font-weight: 300;
        letter-spacing: 5px;
        text-transform: uppercase;
        color: ${data.brandColor};
        margin: 0 0 clamp(12px, 1.5vw, 20px) 0;
        animation: fadeInUp 0.7s ease 0.1s both;
      ">${data.eyebrow}</p>`
    : '';

  const headline = `<h1 class="headline" style="
    font-family: ${fonts.headline};
    font-size: 52px;
    font-weight: 900;
    letter-spacing: -3px;
    line-height: 1.1;
    word-break: keep-all;
    color: #fff;
    margin: 0 0 clamp(12px, 1.5vw, 20px) 0;
    animation: fadeInUp 0.7s ease 0.2s both;
  ">${data.headline}</h1>`;

  const subheadline = data.subheadline
    ? `<p class="subheadline" style="
        font-family: ${fonts.sub};
        font-size: clamp(14px, 1.6vw, 22px);
        font-weight: 300;
        line-height: 1.6;
        color: rgba(255,255,255,0.65);
        margin: 0 0 clamp(16px, 2vw, 24px) 0;
        animation: fadeInUp 0.7s ease 0.3s both;
      ">${data.subheadline}</p>`
    : '';

  const statsHtml = data.stats && data.stats.length > 0
    ? `<div class="stats-row" style="
        display: flex;
        gap: clamp(24px, 3.5vw, 48px);
        margin: 0 0 clamp(16px, 2vw, 24px) 0;
        animation: fadeInUp 0.7s ease 0.5s both;
      ">${data.stats.map(s => `<div style="text-align:center;">
        <span style="
          display:block;
          font-family: ${fonts.headline};
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
        ">${s.number}<span style="
          font-size: clamp(12px, 1.2vw, 16px);
          font-weight: 300;
          margin-left: 4px;
        ">${s.unit}</span></span>${s.label ? `<span style="
          display:block;
          font-family: ${fonts.micro};
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.7);
          margin-top: 4px;
        ">${s.label}</span>` : ''}
      </div>`).join('')}</div>`
    : '';

  const trustHtml = data.awards && data.awards.length > 0
    ? `<div class="trust-row" style="
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin: 0 0 clamp(16px, 2vw, 24px) 0;
        animation: fadeInUp 0.7s ease 0.6s both;
      ">${data.awards.map(a => `<span style="
        font-family: ${fonts.micro};
        font-size: 12px;
        font-weight: 300;
        color: rgba(255,255,255,0.5);
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 6px 14px;
      ">${a}</span>`).join('')}</div>`
    : '';

  const ctaBtn = `<button class="cta-btn" style="
    width: 100%;
    padding: 22px 0;
    font-family: ${fonts.sub};
    font-size: clamp(16px, 1.7vw, 24px);
    font-weight: 700;
    color: ${mood.ctaColor};
    background: ${mood.ctaBackground};
    border: none;
    border-radius: ${mood.ctaRadius};
    box-shadow: 0 0 30px ${data.brandColor}59;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    animation: fadeInUp 0.7s ease 0.8s both;
  " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">${data.ctaText}</button>`;

  const micro = data.microCopy
    ? `<p class="micro" style="
        font-family: ${fonts.micro};
        font-size: clamp(11px, 0.9vw, 13px);
        font-weight: 300;
        color: rgba(255,255,255,0.5);
        margin: 8px 0 0 0;
        text-align: center;
      ">${data.microCopy}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
${fontLinks}
${renderFadeInUpKeyframes()}
</head>
<body style="margin:0;padding:0;">
<section class="hero-ma" style="
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
">
  ${modelBg}
  ${gradientOverlay}
  <div class="overlay-content" style="
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 24px 40px;
    z-index: 5;
    box-sizing: border-box;
  ">
    ${eyebrow}
    ${headline}
    ${subheadline}
    ${statsHtml}
    ${trustHtml}
    ${ctaBtn}
    ${micro}
  </div>
</section>
</body>
</html>`;
}

// ── LAYOUT-MB: 헤드라인 dominant + 모델 하단 ──

export function renderLayoutMB(data: LayoutData): string {
  const mood = getMoodStyles(data.mood, data.brandColor);
  const fonts = getFontFamilies(data.fontSet);
  const fontLinks = getFontLinks(data.fontSet);

  const modelSrc = data.modelImageSrc;
  const hasModelImage = modelSrc && modelSrc.length > 0;

  const eyebrow = data.eyebrow
    ? `<p class="eyebrow" style="
        font-family: ${fonts.micro};
        font-size: clamp(11px, 1.1vw, 16px);
        font-weight: 300;
        letter-spacing: 5px;
        text-transform: uppercase;
        color: ${mood.accentColor};
        margin: 0 0 clamp(12px, 1.5vw, 20px) 0;
        text-align: center;
        animation: fadeInUp 0.7s ease 0.1s both;
      ">${data.eyebrow}</p>`
    : '';

  const headline = `<h1 class="headline" style="
    font-family: ${fonts.headline};
    font-size: clamp(48px, 8vw, 120px);
    font-weight: 900;
    letter-spacing: -4px;
    line-height: 1.05;
    word-break: keep-all;
    color: ${mood.textColor};
    width: 90%;
    max-width: 960px;
    text-align: center;
    margin: 0 auto clamp(16px, 2vw, 32px);
    animation: fadeInUp 0.7s ease 0.2s both;
  ">${data.headline}</h1>`;

  const modelZone = hasModelImage
    ? `<div class="model-zone" style="
        position: relative;
        width: 100%;
        height: 45vh;
        min-height: 320px;
        max-height: 560px;
        overflow: hidden;
        animation: fadeInUp 0.8s ease 0.4s both;
      "><img src="${modelSrc}" alt="model" style="
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center bottom;
        display: block;
      " /></div>`
    : `<div class="model-zone" style="
        position: relative;
        width: 100%;
        height: 45vh;
        min-height: 320px;
        max-height: 560px;
        overflow: hidden;
        animation: fadeInUp 0.8s ease 0.4s both;
      "><div class="model-placeholder" style="
        width: 100%;
        height: 100%;
        background: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 24px;
      ">모델 이미지</div></div>`;

  const subheadline = data.subheadline
    ? `<p class="subheadline" style="
        font-family: ${fonts.sub};
        font-size: clamp(14px, 1.6vw, 22px);
        font-weight: 300;
        line-height: 1.6;
        color: ${mood.subColor};
        text-align: center;
        margin: clamp(16px, 2vw, 24px) 0 clamp(16px, 2vw, 24px) 0;
        animation: fadeInUp 0.7s ease 0.5s both;
      ">${data.subheadline}</p>`
    : '';

  const ctaBtn = `<div style="
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 0 24px;
    box-sizing: border-box;
    animation: fadeInUp 0.7s ease 0.7s both;
  "><button class="cta-btn" style="
    width: 100%;
    padding: 22px 0;
    font-family: ${fonts.sub};
    font-size: clamp(16px, 1.7vw, 24px);
    font-weight: 700;
    color: ${mood.ctaColor};
    background: ${mood.ctaBackground};
    border: none;
    border-radius: ${mood.ctaRadius};
    box-shadow: 0 0 30px ${data.brandColor}59;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">${data.ctaText}</button></div>`;

  const micro = data.microCopy
    ? `<p class="micro" style="
        font-family: ${fonts.micro};
        font-size: clamp(11px, 0.9vw, 13px);
        font-weight: 300;
        color: ${mood.subColor};
        margin: 8px 0 0 0;
        text-align: center;
      ">${data.microCopy}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
${fontLinks}
${renderFadeInUpKeyframes()}
</head>
<body style="margin:0;padding:0;">
<section class="hero-mb" style="
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: ${mood.background};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
">
  ${renderNoise()}
  <div class="hero-top" style="
    position: relative;
    z-index: 2;
    width: 100%;
    padding: clamp(40px, 5vw, 72px) 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  ">
    ${eyebrow}
    ${headline}
  </div>
  ${modelZone}
  <div class="hero-bottom" style="
    position: relative;
    z-index: 2;
    width: 100%;
    padding: 0 24px clamp(40px, 5vw, 64px);
    display: flex;
    flex-direction: column;
    align-items: center;
  ">
    ${subheadline}
    ${ctaBtn}
    ${micro}
  </div>
</section>
</body>
</html>`;
}
