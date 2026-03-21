// ============================================================
// Header Banner — Shared HTML Component Functions
// Pure functions returning HTML strings. No side effects.
// [TYPOGRAPHY-SCALE] 비례 스케일 clamp() 적용
// ============================================================

/**
 * Eyebrow text (small label above headline) — 1/4 비율
 */
export function renderEyebrow(text: string, color: string, weight: number = 300): string {
  return `<p class="eyebrow" style="
    font-size: clamp(12px, 3.5vw, 20px);
    font-weight: ${weight};
    letter-spacing: 5px;
    text-transform: uppercase;
    line-height: 1.4;
    color: ${color};
    margin: 0 0 clamp(16px, 2vw, 24px) 0;
    animation: fadeInUp 0.7s ease 0.1s both;
  ">${text}</p>`;
}

/**
 * Main headline with last-word accent — 기준 1.0
 */
export function renderHeadline(
  text: string,
  textColor: string,
  accentColor: string,
): string {
  const words = text.trim().split(/\s+/);
  const lastWord = words.pop() ?? '';
  const leading = words.join(' ');

  const headlineInner = leading
    ? `${leading} <span class="accent" style="color:${accentColor};text-shadow:0 0 30px ${accentColor}40;">${lastWord}</span>`
    : `<span class="accent" style="color:${accentColor};text-shadow:0 0 30px ${accentColor}40;">${lastWord}</span>`;

  return `<h1 class="headline" style="
    font-size: clamp(36px, 10.5vw, 72px);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.05;
    word-break: keep-all;
    color: ${textColor};
    margin: 0 0 clamp(16px, 2vw, 32px) 0;
    animation: fadeInUp 0.7s ease 0.2s both;
  ">${headlineInner}</h1>`;
}

/**
 * Description paragraph — 1/3 비율
 */
export function renderDesc(text: string, color: string, weight: number = 300): string {
  return `<p class="desc" style="
    font-size: clamp(15px, 4.5vw, 26px);
    font-weight: ${weight};
    line-height: 1.55;
    max-width: 640px;
    color: ${color};
    margin: 0 0 clamp(24px, 3vw, 40px) 0;
    animation: fadeInUp 0.7s ease 0.4s both;
  ">${text}</p>`;
}

/**
 * Subject size → CSS width/maxWidth
 */
function sizeToWidth(size: 'small' | 'medium' | 'large'): { width: string; maxWidth: string } {
  switch (size) {
    case 'small':  return { width: '35%', maxWidth: '220px' };
    case 'large':  return { width: '70%', maxWidth: '420px' };
    case 'medium':
    default:       return { width: '50%', maxWidth: '320px' };
  }
}

/**
 * Product image zone — 6개 mode별 실제 분기
 */
export function renderProductZone(
  mode: string,
  layoutId: string,
  size: 'small' | 'medium' | 'large' = 'medium',
  shadow: string = 'drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 60px rgba(200,100,40,0.2))',
  imageUrl: string = 'product.png',
): string {
  const { width, maxWidth } = sizeToWidth(size);
  const isLayoutG = layoutId === 'G';
  const rotation = isLayoutG ? '' : 'transform: rotate(-2deg);';

  switch (mode) {
    case 'hero-flow':
      return `<div class="product-zone" style="
      position: relative;
      width: ${width};
      max-width: ${maxWidth};
      margin: 0 auto;
      ${rotation}
      animation: fadeInUp 0.8s ease 0.5s both;
    "><img src="${imageUrl}" alt="product" style="
      width: 100%;
      height: auto;
      display: block;
      filter: ${shadow};
    " /></div>`;

    case 'hero-absolute':
      return `<div class="product-zone" style="
      position: absolute;
      right: 5%;
      top: 50%;
      transform: translateY(-50%);
      width: ${width};
      max-width: ${maxWidth};
      z-index: 3;
      animation: fadeInUp 0.8s ease 0.5s both;
    "><img src="${imageUrl}" alt="product" style="
      width: 100%;
      height: auto;
      display: block;
      filter: ${shadow};
    " /></div>`;

    case 'background':
      return `<div class="product-zone" style="
      position: absolute;
      inset: 0;
      z-index: 0;
      animation: fadeInUp 0.8s ease 0.3s both;
    "><img src="${imageUrl}" alt="product" style="
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.6;
    " /></div>`;

    case 'flow':
      return `<div class="product-zone" style="
      position: relative;
      width: 100%;
      animation: fadeInUp 0.8s ease 0.5s both;
    "><img src="${imageUrl}" alt="product" style="
      width: 100%;
      height: auto;
      display: block;
      filter: ${shadow};
    " /></div>`;

    case 'overlap':
      return `<div class="product-zone" style="
      position: relative;
      width: ${width};
      max-width: ${maxWidth};
      margin: -80px auto 0;
      z-index: 5;
      animation: fadeInUp 0.8s ease 0.5s both;
    "><img src="${imageUrl}" alt="product" style="
      width: 100%;
      height: auto;
      display: block;
      filter: ${shadow};
    " /></div>`;

    case 'contain':
      return `<div class="product-zone" style="
      position: relative;
      width: 80%;
      max-width: 480px;
      margin: clamp(24px, 3vw, 40px) auto 0;
      animation: fadeInUp 0.8s ease 0.5s both;
    "><img src="${imageUrl}" alt="product" style="
      width: 100%;
      height: auto;
      max-height: 50vh;
      object-fit: contain;
      display: block;
      filter: ${shadow};
    " /></div>`;

    default:
      return `<div class="product-zone" style="
      position: relative;
      width: ${width};
      max-width: ${maxWidth};
      margin: 0 auto;
      animation: fadeInUp 0.8s ease 0.5s both;
    "><img src="${imageUrl}" alt="product" style="
      width: 100%;
      height: auto;
      display: block;
      filter: ${shadow};
    " /></div>`;
  }
}

/**
 * Stats row — number 1/2, unit 1/6, label 1/6 비율
 */
export function renderStats(
  stats: ReadonlyArray<{ number: string; unit: string; label?: string }>,
  color: string,
  labelWeight: number = 300,
): string {
  const items = stats
    .map(
      (s) => `<div class="stat-item" style="text-align:center;">
      <span class="stat-number" style="
        display: block;
        font-size: clamp(20px, 5.5vw, 48px);
        font-weight: 900;
        color: ${color};
        line-height: 1.1;
      ">${s.number}<span class="stat-unit" style="
        font-size: clamp(11px, 3.0vw, 20px);
        font-weight: 300;
        margin-left: 4px;
      ">${s.unit}</span></span>${
        s.label
          ? `<span class="stat-label" style="
          display: block;
          font-size: clamp(14px, 4.0vw, 22px);
          font-weight: ${labelWeight};
          line-height: 1.4;
          margin-top: 4px;
        ">${s.label}</span>`
          : ''
      }
    </div>`,
    )
    .join('');

  return `<div class="stats-row" style="
    display: flex;
    justify-content: center;
    gap: clamp(24px, 3.5vw, 48px);
    animation: fadeInUp 0.7s ease 0.7s both;
  ">${items}</div>`;
}

/**
 * Trust badge card — trust 1/4 비율
 */
export function renderTrustBadge(
  awards: string[],
  brandColor: string,
): string {
  if (awards.length === 0) return '';

  const [rank, ...platforms] = awards;
  const platformHtml = platforms
    .map(
      (p) =>
        `<span style="font-size:clamp(10px,2.5vw,18px);font-weight:300;line-height:1.4;">${p}</span>`,
    )
    .join('<br/>');

  return `<div class="trust-badge" style="
    border: 1px solid ${brandColor}1A;
    border-radius: 16px;
    background: ${brandColor}06;
    padding: clamp(16px, 2vw, 24px) clamp(24px, 3vw, 40px);
    text-align: center;
    animation: fadeInUp 0.7s ease 0.9s both;
  ">
    <span style="
      display: block;
      font-size: clamp(20px, 5.5vw, 48px);
      font-weight: 900;
      color: ${brandColor};
      margin-bottom: 8px;
    ">${rank}</span>
    ${platformHtml}
  </div>`;
}

/**
 * Call-to-action button — cta 비율 (headline 근접)
 */
export function renderCTA(
  text: string,
  ctaBg: string,
  ctaColor: string,
  ctaRadius: string,
  weight: number = 700,
): string {
  return `<button class="cta-btn" style="
    width: 100%;
    padding: 22px 0;
    font-size: clamp(16px, 4.5vw, 24px);
    font-weight: ${weight};
    color: ${ctaColor};
    background: ${ctaBg};
    border: none;
    border-radius: ${ctaRadius};
    box-shadow: 0 0 30px ${ctaBg}59;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    animation: fadeInUp 0.7s ease 1.0s both;
  " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">${text}</button>`;
}

/**
 * Micro copy — 1/6 비율
 */
export function renderMicro(text: string, color: string, weight: number = 300): string {
  return `<p class="micro" style="
    font-size: clamp(13px, 3.5vw, 18px);
    font-weight: ${weight};
    line-height: 1.4;
    color: ${color};
    margin: 8px 0 0 0;
    text-align: center;
  ">${text}</p>`;
}

/**
 * Price block — badge 1/3, sale-price headline급
 */
export function renderPriceBlock(
  originalPrice: string,
  salePrice: string,
  discount: string,
  brandColor: string,
): string {
  return `<div class="price-block" style="
    text-align: center;
    animation: fadeInUp 0.7s ease 0.5s both;
  ">
    <span class="discount-badge" style="
      display: inline-block;
      background: ${brandColor};
      color: #fff;
      font-size: clamp(12px, 3.0vw, 20px);
      font-weight: 900;
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 8px;
    ">${discount}</span>
    <span class="original-price" style="
      display: block;
      font-size: clamp(12px, 3.0vw, 20px);
      font-weight: 300;
      text-decoration: line-through;
      opacity: 0.5;
      margin-bottom: 4px;
    ">${originalPrice}</span>
    <span class="sale-price" style="
      display: block;
      font-size: clamp(36px, 10.5vw, 72px);
      font-weight: 900;
      color: ${brandColor};
      line-height: 1.05;
    ">${salePrice}</span>
  </div>`;
}

/**
 * Big badge for LAYOUT-F — rank stat급, platform 1/4
 */
export function renderBigBadge(
  rank: string,
  platform: string,
  brandColor: string,
): string {
  return `<div class="big-badge" style="
    width: 280px;
    margin: 0 auto;
    text-align: center;
    border-radius: 24px;
    border: 1px solid ${brandColor}1A;
    background: ${brandColor}06;
    padding: clamp(24px, 3vw, 40px) clamp(16px, 2vw, 24px);
    animation: fadeInUp 0.7s ease 0.3s both;
  ">
    <span style="
      display: block;
      font-size: clamp(64px, 18vw, 120px);
      font-weight: 900;
      line-height: 1;
      color: ${brandColor};
    ">${rank}</span>
    <span style="
      display: block;
      font-size: clamp(10px, 2.5vw, 18px);
      font-weight: 300;
      line-height: 1.4;
      margin-top: 8px;
    ">${platform}</span>
  </div>`;
}

/**
 * Big stat for LAYOUT-I — number dominant, label 1/6
 */
export function renderBigStat(
  number: string,
  unit: string,
  label: string,
): string {
  return `<div class="big-stat" style="
    text-align: center;
    animation: fadeInUp 0.7s ease 0.3s both;
  ">
    <span style="
      display: block;
      font-size: clamp(80px, 14vw, 200px);
      font-weight: 900;
      line-height: 1;
    ">${number}<span style="
      font-size: clamp(24px, 4vw, 48px);
      font-weight: 300;
      margin-left: 4px;
    ">${unit}</span></span>
    <span style="
      display: block;
      font-size: clamp(12px, 3.5vw, 20px);
      font-weight: 300;
      line-height: 1.4;
      margin-top: 8px;
    ">${label}</span>
  </div>`;
}

/**
 * Urgency bar for LAYOUT-J — event-pill 비율
 */
export function renderUrgencyBar(
  text: string,
  brandColor: string,
): string {
  return `<div class="urgency-bar" style="
    width: 100%;
    background: ${brandColor};
    color: #fff;
    text-align: center;
    padding: 12px 16px;
    font-size: clamp(14px, 3.8vw, 24px);
    font-weight: 700;
    letter-spacing: 1px;
    animation: fadeInUp 0.5s ease 0s both;
  ">${text}</div>`;
}

/**
 * SVG noise overlay
 */
export function renderNoise(): string {
  return `<div class="noise-overlay" style="
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0.035;
    mix-blend-mode: overlay;
  "><svg width="100%" height="100%"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noise)"/></svg></div>`;
}

/**
 * Ghost background character
 */
export function renderGhost(char: string): string {
  return `<div class="bg-ghost" style="
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(200px, 35vw, 500px);
    font-weight: 900;
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
    line-height: 1;
    user-select: none;
  ">${char}</div>`;
}

/**
 * @keyframes fadeInUp CSS
 */
export function renderFadeInUpKeyframes(): string {
  return `<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>`;
}
