import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens, ColorPalette } from '@/engine/09-visual-style/types';

// ============================================================
// Section Renderers — 패턴별 HTML 생성
// 26개 섹션 에이전트의 78개 패턴 ID 지원
// ============================================================

// --- 유틸리티 ---

function bullets(items: string[]): string {
  if (!items.length) return '';
  return `<ul style="list-style:none;padding:0;margin:16px 0;">${items
    .map(
      (item) =>
        `<li style="padding:6px 0;padding-left:20px;position:relative;"><span style="position:absolute;left:0;">✓</span>${esc(item)}</li>`,
    )
    .join('')}</ul>`;
}

function ctaButton(text: string, colors: ColorPalette, micro?: string): string {
  const btn = `<a href="#cta" style="display:inline-block;padding:16px 40px;background:${colors.primary};color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:1.1rem;transition:opacity .2s;">${esc(text)}</a>`;
  const mic = micro
    ? `<p style="margin-top:8px;font-size:0.85rem;color:${colors.textMuted};">${esc(micro)}</p>`
    : '';
  return btn + mic;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 이미지 영역: CDN URL이 있으면 img 태그, 없으면 placeholder */
function imageBlock(copy: CopyBlock, c: ColorPalette, maxWidth?: string): string {
  const mw = maxWidth ? `max-width:${maxWidth};` : '';
  if (copy.imageUrl) {
    return `<img src="${copy.imageUrl}" alt="${esc(copy.headline)}" style="width:100%;${mw}aspect-ratio:4/3;object-fit:cover;border-radius:12px;" loading="lazy">`;
  }
  return `<div style="width:100%;${mw}aspect-ratio:4/3;background:${c.surface};border-radius:12px;display:flex;align-items:center;justify-content:center;color:${c.textMuted};font-size:0.9rem;">${esc(copy.imageDirection)}</div>`;
}

// ============================================================
// Hero 패턴
// ============================================================

export function renderHeroFullscreenCenter(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const bgImage = copy.imageUrl
    ? `background-image:linear-gradient(180deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.55) 100%),url('${copy.imageUrl}');background-size:cover;background-position:center;color:#fff;`
    : `background:linear-gradient(135deg,${c.primary} 0%,${c.primaryDark} 100%);color:#fff;`;

  const badges = copy.bulletPoints.slice(0, 4).map(
    (item) => `<span style="display:inline-block;padding:8px 20px;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.3);border-radius:999px;font-size:0.9rem;font-weight:600;">${esc(item)}</span>`
  ).join('');

  const badgeRow = badges ? `<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:36px;">${badges}</div>` : '';

  return `<section style="position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 24px;${bgImage}">
  <div style="max-width:860px;position:relative;z-index:1;">
    <p style="font-size:1.1rem;opacity:0.85;margin-bottom:16px;font-weight:500;letter-spacing:0.02em;">${esc(copy.subheadline)}</p>
    <h1 style="font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;line-height:1.1;margin-bottom:24px;letter-spacing:-0.02em;text-shadow:0 2px 20px rgba(0,0,0,0.3);">${esc(copy.headline)}</h1>
    ${badgeRow}
    <p style="font-size:1.05rem;opacity:0.9;max-width:600px;margin:0 auto 40px;line-height:1.7;">${esc(copy.body)}</p>
    <a href="#cta" style="display:inline-block;padding:18px 48px;background:#fff;color:${c.primary};text-decoration:none;border-radius:999px;font-weight:700;font-size:1.15rem;box-shadow:0 4px 20px rgba(0,0,0,0.2);transition:transform .2s,box-shadow .2s;">${esc(copy.ctaText)}</a>
    ${copy.microCopy ? `<p style="margin-top:12px;font-size:0.85rem;opacity:0.75;">${esc(copy.microCopy)}</p>` : ''}
  </div>
</section>`;
}

export function renderHeroLeftRight(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const imgSrc = copy.imageUrl || '';
  const imgEl = imgSrc
    ? `<img src="${imgSrc}" alt="${esc(copy.headline)}" style="width:100%;max-width:560px;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.12);object-fit:cover;aspect-ratio:4/3;" loading="lazy">`
    : `<div style="width:100%;max-width:560px;aspect-ratio:4/3;background:linear-gradient(135deg,${c.primaryLight} 0%,${c.primary} 100%);border-radius:16px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:3rem;font-weight:800;">${esc(copy.headline.slice(0, 6))}</div>`;

  const badges = copy.bulletPoints.slice(0, 3).map(
    (item) => `<span style="display:inline-block;padding:6px 16px;background:${c.primaryLight};color:${c.primaryDark};border-radius:999px;font-size:0.85rem;font-weight:600;">${esc(item)}</span>`
  ).join('');

  const badgeRow = badges ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">${badges}</div>` : '';

  return `<section style="display:flex;flex-wrap:wrap;min-height:90vh;align-items:center;padding:80px 24px;gap:40px;background:${c.background};color:${c.textPrimary};">
  <div style="flex:1;min-width:320px;padding:20px 40px;">
    <p style="font-size:0.95rem;color:${c.primary};font-weight:600;margin-bottom:12px;letter-spacing:0.05em;text-transform:uppercase;">${esc(copy.subheadline)}</p>
    <h1 style="font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.15;margin-bottom:20px;letter-spacing:-0.02em;color:${c.textPrimary};">${esc(copy.headline)}</h1>
    ${badgeRow}
    <p style="color:${c.textSecondary};margin-bottom:32px;line-height:1.7;font-size:1.05rem;">${esc(copy.body)}</p>
    <a href="#cta" style="display:inline-block;padding:16px 40px;background:${c.primary};color:#fff;text-decoration:none;border-radius:999px;font-weight:700;font-size:1.1rem;box-shadow:0 4px 16px ${c.primary}40;transition:transform .2s;">${esc(copy.ctaText)}</a>
    ${copy.microCopy ? `<p style="margin-top:10px;font-size:0.85rem;color:${c.textMuted};">${esc(copy.microCopy)}</p>` : ''}
  </div>
  <div style="flex:1;min-width:320px;display:flex;align-items:center;justify-content:center;padding:20px;">
    ${imgEl}
  </div>
</section>`;
}

// ============================================================
// Feature / Detail 패턴
// ============================================================

export function renderFeat3ColGrid(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const items = copy.bulletPoints.slice(0, 3);
  const cols = items
    .map(
      (item) =>
        `<div style="flex:1;min-width:200px;padding:24px;background:${c.surface};border-radius:12px;text-align:center;">
      <p style="font-weight:600;margin-bottom:8px;">${esc(item)}</p>
    </div>`,
    )
    .join('');
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:1100px;margin:0 auto;text-align:center;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
    <p style="color:${c.textSecondary};margin-bottom:48px;max-width:600px;margin-left:auto;margin-right:auto;">${esc(copy.subheadline)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center;">${cols}</div>
  </div>
</section>`;
}

export function renderFeatZigzag(copy: CopyBlock, tokens: DesignTokens, order: number): string {
  const c = tokens.colors;
  const reversed = order % 2 === 0;
  const direction = reversed ? 'row-reverse' : 'row';
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;flex-direction:${direction};align-items:center;gap:48px;">
    <div style="flex:1;min-width:280px;">
      <h2 style="font-size:2rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
      <p style="color:${c.textSecondary};margin-bottom:16px;">${esc(copy.body)}</p>
      ${bullets(copy.bulletPoints)}
    </div>
    <div style="flex:1;min-width:280px;">
      ${imageBlock(copy, c)}
    </div>
  </div>
</section>`;
}

export function renderFeatIconList(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="padding:80px 24px;background:${c.surface};color:${c.textPrimary};">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:12px;text-align:center;">${esc(copy.headline)}</h2>
    <p style="color:${c.textSecondary};text-align:center;margin-bottom:40px;">${esc(copy.subheadline)}</p>
    ${bullets(copy.bulletPoints)}
  </div>
</section>`;
}

export function renderFeatNumberedSteps(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const steps = copy.bulletPoints
    .map(
      (item, i) =>
        `<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:24px;">
      <div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:${c.primary};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">${i + 1}</div>
      <p style="padding-top:6px;">${esc(item)}</p>
    </div>`,
    )
    .join('');
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:40px;text-align:center;">${esc(copy.headline)}</h2>
    ${steps}
  </div>
</section>`;
}

/** 풀와이드 디테일 — 이미지 위에 텍스트 아래 */
export function renderDetailFullwidth(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:1100px;margin:0 auto;">
    ${imageBlock(copy, c)}
    <div style="max-width:700px;margin:40px auto 0;text-align:center;">
      <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
      <p style="color:${c.textSecondary};margin-bottom:16px;">${esc(copy.subheadline)}</p>
      <p style="color:${c.textSecondary};">${esc(copy.body)}</p>
      ${bullets(copy.bulletPoints)}
    </div>
  </div>
</section>`;
}

// ============================================================
// Specs / Table 패턴
// ============================================================

/** 스펙 테이블 — bulletPoints를 "키: 값" 형식으로 파싱 */
export function renderSpecsTable(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const rows = copy.bulletPoints
    .map((item) => {
      const [label, ...rest] = item.split(':');
      const value = rest.join(':').trim() || item;
      return `<tr>
        <td style="padding:12px 16px;border-bottom:1px solid ${c.border};font-weight:600;width:35%;color:${c.textSecondary};">${esc(label?.trim() ?? '')}</td>
        <td style="padding:12px 16px;border-bottom:1px solid ${c.border};">${esc(value)}</td>
      </tr>`;
    })
    .join('');
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:800px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:40px;text-align:center;">${esc(copy.headline)}</h2>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
  </div>
</section>`;
}

// ============================================================
// Steps 패턴 (How-to-use)
// ============================================================

/** 수평 스텝 — 번호가 가로로 나열 */
export function renderStepsHorizontal(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const steps = copy.bulletPoints
    .map(
      (item, i) =>
        `<div style="flex:1;min-width:160px;text-align:center;">
      <div style="width:48px;height:48px;border-radius:50%;background:${c.primary};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.25rem;margin:0 auto 12px;">${i + 1}</div>
      <p style="font-size:0.95rem;">${esc(item)}</p>
    </div>`,
    )
    .join('');
  return `<section style="padding:80px 24px;background:${c.surface};color:${c.textPrimary};">
  <div style="max-width:1000px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:48px;text-align:center;">${esc(copy.headline)}</h2>
    <div style="display:flex;flex-wrap:wrap;gap:32px;justify-content:center;">${steps}</div>
  </div>
</section>`;
}

// ============================================================
// Social Proof 패턴
// ============================================================

export function renderProofTestimonialCard(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="padding:80px 24px;background:${c.surface};color:${c.textPrimary};">
  <div style="max-width:900px;margin:0 auto;text-align:center;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:40px;">${esc(copy.headline)}</h2>
    <div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center;">
      ${copy.bulletPoints
        .map(
          (item) =>
            `<div style="flex:1;min-width:240px;max-width:320px;padding:32px;background:${c.background};border-radius:12px;border:1px solid ${c.border};text-align:left;">
          <p style="font-style:italic;color:${c.textSecondary};margin-bottom:12px;">"${esc(item)}"</p>
          <p style="font-weight:600;font-size:0.9rem;">— 고객 리뷰</p>
        </div>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

export function renderProofNumberCounter(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const counters = copy.bulletPoints.slice(0, 4);
  return `<section style="padding:80px 24px;background:${c.primary};color:#fff;">
  <div style="max-width:1000px;margin:0 auto;text-align:center;">
    <h2 style="font-size:2rem;font-weight:700;margin-bottom:40px;">${esc(copy.headline)}</h2>
    <div style="display:flex;flex-wrap:wrap;gap:32px;justify-content:center;">
      ${counters
        .map(
          (item) =>
            `<div style="flex:1;min-width:150px;">
          <p style="font-size:2.5rem;font-weight:700;">${esc(item)}</p>
        </div>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

// ============================================================
// Gallery 패턴 (Lifestyle, Photo Reviews, SNS)
// ============================================================

/** 갤러리 그리드 — 이미지 중심 3열 그리드 */
export function renderGalleryGrid(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:12px;text-align:center;">${esc(copy.headline)}</h2>
    <p style="color:${c.textSecondary};margin-bottom:40px;text-align:center;">${esc(copy.subheadline)}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
      <div style="grid-column:1/-1;">${imageBlock(copy, c)}</div>
      ${copy.bulletPoints.slice(0, 3).map(
        (item) =>
          `<div style="padding:20px;background:${c.surface};border-radius:12px;">
        <p style="font-size:0.95rem;">${esc(item)}</p>
      </div>`,
      ).join('')}
    </div>
  </div>
</section>`;
}

/** 풀블리드 이미지 — 배경 이미지 + 하단 텍스트 */
export function renderFullbleedImage(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="padding:0;background:${c.background};color:${c.textPrimary};">
  <div style="width:100%;">${imageBlock(copy, c)}</div>
  <div style="max-width:800px;margin:0 auto;padding:48px 24px;text-align:center;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
    <p style="color:${c.textSecondary};">${esc(copy.body)}</p>
  </div>
</section>`;
}

// ============================================================
// Comparison 패턴
// ============================================================

/** 비교 테이블 — 2~3열 비교 */
export function renderCompareTable(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const rows = copy.bulletPoints
    .map(
      (item) =>
        `<tr>
      <td style="padding:12px 16px;border-bottom:1px solid ${c.border};">${esc(item)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid ${c.border};text-align:center;color:${c.textMuted};">—</td>
      <td style="padding:12px 16px;border-bottom:1px solid ${c.border};text-align:center;color:${c.primary};font-weight:600;">✓</td>
    </tr>`,
    )
    .join('');
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:900px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:40px;text-align:center;">${esc(copy.headline)}</h2>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:12px 16px;text-align:left;border-bottom:2px solid ${c.border};">항목</th>
            <th style="padding:12px 16px;text-align:center;border-bottom:2px solid ${c.border};color:${c.textMuted};">기존</th>
            <th style="padding:12px 16px;text-align:center;border-bottom:2px solid ${c.border};color:${c.primary};">우리 제품</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>
</section>`;
}

// ============================================================
// Before / After 패턴
// ============================================================

export function renderMiscBeforeAfter(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:1000px;margin:0 auto;text-align:center;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:40px;">${esc(copy.headline)}</h2>
    <div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center;">
      <div style="flex:1;min-width:280px;padding:32px;background:${c.surface};border-radius:12px;">
        <h3 style="margin-bottom:12px;color:${c.textMuted};">Before</h3>
        <p>${esc(copy.bulletPoints[0] ?? '')}</p>
      </div>
      <div style="flex:1;min-width:280px;padding:32px;background:${c.primary};color:#fff;border-radius:12px;">
        <h3 style="margin-bottom:12px;">After</h3>
        <p>${esc(copy.bulletPoints[1] ?? '')}</p>
      </div>
    </div>
  </div>
</section>`;
}

// ============================================================
// CTA 패턴
// ============================================================

export function renderCtaCenter(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section id="cta" style="padding:80px 24px;background:${c.surface};color:${c.textPrimary};text-align:center;">
  <div style="max-width:600px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
    <p style="color:${c.textSecondary};margin-bottom:32px;">${esc(copy.subheadline)}</p>
    ${ctaButton(copy.ctaText, c, copy.microCopy)}
  </div>
</section>`;
}

export function renderCtaFullBanner(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section id="cta" style="padding:60px 24px;background:${c.primary};color:#fff;text-align:center;">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-size:2rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
    <p style="opacity:0.9;margin-bottom:24px;">${esc(copy.subheadline)}</p>
    <a href="#cta" style="display:inline-block;padding:16px 40px;background:#fff;color:${c.primary};text-decoration:none;border-radius:8px;font-weight:600;">${esc(copy.ctaText)}</a>
  </div>
</section>`;
}

// ============================================================
// FAQ 패턴
// ============================================================

export function renderFaqAccordion(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const items = copy.bulletPoints
    .map(
      (item) =>
        `<details style="border-bottom:1px solid ${c.border};padding:16px 0;">
      <summary style="cursor:pointer;font-weight:600;padding:8px 0;">${esc(item)}</summary>
      <p style="padding:12px 0;color:${c.textSecondary};">${esc(copy.body)}</p>
    </details>`,
    )
    .join('');
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:40px;text-align:center;">${esc(copy.headline)}</h2>
    ${items}
  </div>
</section>`;
}

// ============================================================
// Offer / Countdown 패턴
// ============================================================

/** 한정 특가 카운트다운 */
export function renderOfferCountdown(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="padding:80px 24px;background:${c.primary};color:#fff;text-align:center;">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
    <p style="font-size:1.15rem;opacity:0.9;margin-bottom:24px;">${esc(copy.subheadline)}</p>
    <div style="display:flex;gap:16px;justify-content:center;margin-bottom:32px;">
      <div style="padding:16px 24px;background:rgba(255,255,255,0.15);border-radius:8px;min-width:70px;">
        <p style="font-size:2rem;font-weight:700;">00</p><p style="font-size:0.8rem;opacity:0.8;">시간</p>
      </div>
      <div style="padding:16px 24px;background:rgba(255,255,255,0.15);border-radius:8px;min-width:70px;">
        <p style="font-size:2rem;font-weight:700;">00</p><p style="font-size:0.8rem;opacity:0.8;">분</p>
      </div>
      <div style="padding:16px 24px;background:rgba(255,255,255,0.15);border-radius:8px;min-width:70px;">
        <p style="font-size:2rem;font-weight:700;">00</p><p style="font-size:0.8rem;opacity:0.8;">초</p>
      </div>
    </div>
    <a href="#cta" style="display:inline-block;padding:16px 48px;background:#fff;color:${c.primary};border-radius:8px;font-weight:700;font-size:1.1rem;text-decoration:none;">${esc(copy.ctaText)}</a>
    ${copy.microCopy ? `<p style="margin-top:12px;font-size:0.85rem;opacity:0.8;">${esc(copy.microCopy)}</p>` : ''}
  </div>
</section>`;
}

// ============================================================
// Trust / Shield 패턴
// ============================================================

/** 환불/보증 실드 — 신뢰 강조 */
export function renderShieldSection(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="padding:80px 24px;background:${c.surface};color:${c.textPrimary};">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <div style="width:80px;height:80px;border-radius:50%;background:${c.primary};color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:2rem;">🛡️</div>
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
    <p style="color:${c.textSecondary};margin-bottom:24px;font-size:1.1rem;">${esc(copy.subheadline)}</p>
    <p style="color:${c.textSecondary};margin-bottom:24px;">${esc(copy.body)}</p>
    ${bullets(copy.bulletPoints)}
  </div>
</section>`;
}

// ============================================================
// Price 패턴
// ============================================================

/** 가격표 컬럼 — 2~3개 요금제 비교 */
export function renderPriceColumns(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const plans = copy.bulletPoints.slice(0, 3);
  const cols = plans
    .map(
      (item, i) => {
        const isPopular = i === 1;
        const bg = isPopular ? c.primary : c.surface;
        const fg = isPopular ? '#fff' : c.textPrimary;
        return `<div style="flex:1;min-width:220px;max-width:340px;padding:32px 24px;background:${bg};color:${fg};border-radius:16px;text-align:center;${isPopular ? `transform:scale(1.05);box-shadow:0 8px 30px rgba(0,0,0,0.12);` : `border:1px solid ${c.border};`}">
        <p style="font-weight:700;font-size:1.15rem;margin-bottom:16px;">${esc(item)}</p>
        ${isPopular ? `<a href="#cta" style="display:inline-block;padding:12px 32px;background:#fff;color:${c.primary};border-radius:8px;font-weight:600;text-decoration:none;">선택하기</a>` : `<a href="#cta" style="display:inline-block;padding:12px 32px;background:${c.primary};color:#fff;border-radius:8px;font-weight:600;text-decoration:none;">선택하기</a>`}
      </div>`;
      },
    )
    .join('');
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:1100px;margin:0 auto;text-align:center;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
    <p style="color:${c.textSecondary};margin-bottom:48px;">${esc(copy.subheadline)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:24px;justify-content:center;align-items:center;">${cols}</div>
  </div>
</section>`;
}

// ============================================================
// Timeline 패턴 (Brand Story, Process)
// ============================================================

export function renderTimeline(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const items = copy.bulletPoints
    .map(
      (item, i) =>
        `<div style="display:flex;gap:20px;margin-bottom:32px;">
      <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;">
        <div style="width:12px;height:12px;border-radius:50%;background:${c.primary};"></div>
        ${i < copy.bulletPoints.length - 1 ? `<div style="width:2px;flex:1;background:${c.border};margin-top:4px;"></div>` : ''}
      </div>
      <div style="padding-bottom:8px;">
        <p>${esc(item)}</p>
      </div>
    </div>`,
    )
    .join('');
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:700px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:40px;text-align:center;">${esc(copy.headline)}</h2>
    ${items}
  </div>
</section>`;
}

// ============================================================
// Bold Typography Hero — 큰 텍스트 중심 + 이미지 오버랩
// ============================================================

export function renderHeroBoldTypo(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const headlineHtml = esc(copy.headline).replace(/\n/g, '<br>');

  const imgEl = copy.imageUrl
    ? `<img src="${copy.imageUrl}" alt="" style="width:280px;height:360px;object-fit:cover;border-radius:16px;filter:drop-shadow(0 12px 32px rgba(0,0,0,0.12));" loading="lazy">`
    : '';

  const infoItems = copy.bulletPoints.map(
    (item) => {
      const colonIdx = item.indexOf(':');
      if (colonIdx > 0) {
        const key = item.slice(0, colonIdx).trim();
        const val = item.slice(colonIdx + 1).trim();
        return `<div style="display:flex;gap:16px;margin-bottom:10px;font-size:0.95rem;"><span style="flex-shrink:0;font-weight:700;color:${c.textPrimary};min-width:80px;">${esc(key)}</span><span style="color:${c.textSecondary};">${esc(val)}</span></div>`;
      }
      return `<p style="color:${c.textSecondary};margin-bottom:6px;font-size:0.95rem;">${esc(item)}</p>`;
    }
  ).join('');

  return `<section style="position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;background:${c.background};color:${c.textPrimary};overflow:hidden;">
  <div style="position:relative;width:100%;max-width:900px;margin-bottom:56px;">
    <h1 style="font-size:clamp(4rem,14vw,9rem);font-weight:900;line-height:0.92;letter-spacing:-0.04em;color:${c.textPrimary};margin:0;">${headlineHtml}</h1>
    ${imgEl ? `<div style="position:absolute;top:-20px;right:0;z-index:2;">${imgEl}</div>` : ''}
  </div>
  <div style="max-width:900px;width:100%;text-align:left;">
    <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:4px;">${esc(copy.subheadline)}</h2>
    <p style="font-size:0.95rem;color:${c.textMuted};margin-bottom:20px;">${esc(copy.body)}</p>
    ${infoItems}
  </div>
  ${copy.ctaText ? `<div style="margin-top:40px;text-align:center;"><a href="#cta" style="display:inline-block;padding:16px 48px;background:${c.textPrimary};color:${c.background};border-radius:999px;font-weight:700;font-size:1.1rem;text-decoration:none;">${esc(copy.ctaText)}</a></div>` : ''}
</section>`;
}

// ============================================================
// Product Feature Minimal — 클린 화이트 + 제품 이미지 + 어노테이션
// ============================================================

export function renderProductFeatureMinimal(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const imgEl = copy.imageUrl
    ? `<div style="position:relative;display:inline-block;">
        <img src="${copy.imageUrl}" alt="${esc(copy.headline)}" style="max-width:480px;width:100%;object-fit:contain;filter:drop-shadow(0 12px 32px rgba(0,0,0,0.08));" loading="lazy">
        ${copy.bulletPoints[0] ? `<span style="position:absolute;top:20%;right:-10px;display:inline-block;padding:8px 20px;background:${c.primary};color:#fff;border-radius:999px;font-size:0.85rem;font-weight:600;box-shadow:0 4px 12px ${c.primary}40;">${esc(copy.bulletPoints[0])}</span>` : ''}
      </div>`
    : `<div style="width:100%;max-width:480px;aspect-ratio:1/1;background:${c.surface};border-radius:16px;display:flex;align-items:center;justify-content:center;color:${c.textMuted};font-size:4rem;font-weight:800;">${esc(copy.headline.slice(0, 4))}</div>`;

  return `<section style="padding:100px 24px 80px;background:${c.background};color:${c.textPrimary};text-align:center;">
  <div style="max-width:720px;margin:0 auto;">
    <p style="font-size:0.95rem;color:${c.textMuted};margin-bottom:8px;letter-spacing:0.03em;">${esc(copy.microCopy || '')}</p>
    <h2 style="font-size:1.8rem;font-weight:800;margin-bottom:32px;letter-spacing:0.05em;color:${c.textPrimary};">${esc(copy.subheadline)}</h2>
    <div style="width:1px;height:48px;background:${c.border};margin:0 auto 32px;"></div>
    <p style="font-size:0.9rem;color:${c.textMuted};margin-bottom:8px;">${esc(copy.body)}</p>
    <h3 style="font-size:clamp(1.5rem,4vw,2.5rem);font-weight:800;line-height:1.3;margin-bottom:16px;color:${c.textPrimary};">${esc(copy.headline)}</h3>
    <p style="font-size:0.95rem;color:${c.textSecondary};max-width:480px;margin:0 auto 48px;line-height:1.7;">${esc(copy.bulletPoints.slice(1).join(' '))}</p>
    <div style="display:flex;justify-content:center;">
      ${imgEl}
    </div>
  </div>
</section>`;
}

// ============================================================
// Premium Product Hero — 모델/셀럽 + 제품 + 브랜드 배지
// ============================================================

export function renderHeroPremiumProduct(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  const bgColor = '#2C2420';
  const imgEl = copy.imageUrl
    ? `<img src="${copy.imageUrl}" alt="${esc(copy.headline)}" style="width:100%;max-width:600px;object-fit:contain;filter:drop-shadow(0 16px 48px rgba(0,0,0,0.3));" loading="lazy">`
    : '';

  const badge = copy.bulletPoints[0]
    ? `<span style="display:inline-block;padding:6px 16px;border:1px solid rgba(255,255,255,0.4);border-radius:4px;font-size:0.8rem;font-weight:600;color:rgba(255,255,255,0.9);letter-spacing:0.05em;">${esc(copy.bulletPoints[0])}</span>`
    : '';

  return `<section style="position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px 0;background:${bgColor};color:#fff;overflow:hidden;">
  <div style="width:100%;max-width:1100px;display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;">
    ${badge}
    <span style="font-size:1.1rem;font-weight:700;letter-spacing:0.08em;opacity:0.9;">${esc(copy.microCopy || '')}</span>
  </div>
  <div style="text-align:center;max-width:700px;margin-bottom:40px;">
    <p style="font-size:1.05rem;opacity:0.7;margin-bottom:16px;">${esc(copy.subheadline)}</p>
    <h1 style="font-size:clamp(3rem,8vw,6rem);font-weight:800;line-height:1.05;letter-spacing:-0.03em;margin-bottom:16px;">${esc(copy.headline)}</h1>
    <p style="font-size:1rem;opacity:0.6;margin-bottom:8px;letter-spacing:0.02em;">${esc(copy.body)}</p>
    <div style="width:40px;height:2px;background:rgba(255,255,255,0.3);margin:24px auto;"></div>
    <p style="font-size:0.95rem;opacity:0.7;line-height:1.7;">${esc(copy.bulletPoints.slice(1).join(' · '))}</p>
  </div>
  <div style="width:100%;max-width:600px;display:flex;justify-content:center;margin-top:auto;">
    ${imgEl}
  </div>
</section>`;
}

// ============================================================
// 범용 폴백 렌더러
// ============================================================

export function renderGenericSection(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="padding:80px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:900px;margin:0 auto;">
    <h2 style="font-size:2.25rem;font-weight:700;margin-bottom:12px;">${esc(copy.headline)}</h2>
    <p style="font-size:1.1rem;color:${c.textSecondary};margin-bottom:16px;">${esc(copy.subheadline)}</p>
    <p style="color:${c.textSecondary};margin-bottom:24px;">${esc(copy.body)}</p>
    ${bullets(copy.bulletPoints)}
    ${copy.ctaText ? ctaButton(copy.ctaText, c, copy.microCopy) : ''}
  </div>
</section>`;
}

// ============================================================
// 패턴 ID → 렌더러 매핑 (78개 패턴 → 20개 렌더러)
// ============================================================

export function renderByPatternId(
  patternId: string,
  copy: CopyBlock,
  tokens: DesignTokens,
  order: number,
): string {
  switch (patternId) {
    // ── 01 Header Banner (Hero) ──
    case 'hero_fullscreen_center':
    case 'hero_gradient_overlay':
    case 'hero_video_style':
    case 'hero_gradient':
    case 'hero_minimal_typo':
    case 'hero_video_bg':
    case 'hero_product_center':
      return renderHeroFullscreenCenter(copy, tokens);
    case 'hero_split_left':
    case 'hero_split_right':
    case 'hero_left_right':
    case 'hero_split':
    case 'hero_card':
      return renderHeroLeftRight(copy, tokens);

    // ── 02 Key Features ──
    case 'features_3col_cards':
    case 'feat_3col_grid':
    case 'feat_card_grid':
      return renderFeat3ColGrid(copy, tokens);
    case 'features_icon_grid':
    case 'feat_icon_list':
    case 'feat_accordion':
    case 'feat_tab':
      return renderFeatIconList(copy, tokens);
    case 'features_alternating':
    case 'feat_zigzag':
    case 'feat_large_img_bullets':
      return renderFeatZigzag(copy, tokens, order);

    // ── 03/04/05 Feature Detail ──
    case 'detail_split_left':
    case 'detail_split_right':
      return renderFeatZigzag(copy, tokens, order);
    case 'detail_fullwidth':
      return renderDetailFullwidth(copy, tokens);

    // ── 06 Specs ──
    case 'specs_table':
    case 'specs_two_column':
      return renderSpecsTable(copy, tokens);
    case 'specs_accordion':
      return renderFaqAccordion(copy, tokens);

    // ── 07 How To Use ──
    case 'steps_horizontal':
      return renderStepsHorizontal(copy, tokens);
    case 'steps_vertical':
    case 'feat_numbered_steps':
    case 'feat_infographic':
      return renderFeatNumberedSteps(copy, tokens);
    case 'steps_cards':
      return renderFeat3ColGrid(copy, tokens);

    // ── 08 Target Persona ──
    case 'persona_cards':
      return renderFeat3ColGrid(copy, tokens);
    case 'persona_list':
      return renderFeatIconList(copy, tokens);
    case 'persona_split':
      return renderHeroLeftRight(copy, tokens);

    // ── 09 Before After ──
    case 'ba_split':
    case 'ba_slider':
    case 'misc_before_after':
      return renderMiscBeforeAfter(copy, tokens);
    case 'ba_timeline':
      return renderTimeline(copy, tokens);

    // ── 10 Lifestyle ──
    case 'lifestyle_gallery':
    case 'lifestyle_mosaic':
      return renderGalleryGrid(copy, tokens);
    case 'lifestyle_fullbleed':
      return renderFullbleedImage(copy, tokens);

    // ── 11 Certification ──
    case 'cert_badge_grid':
    case 'cert_cards':
      return renderFeat3ColGrid(copy, tokens);
    case 'cert_timeline':
      return renderTimeline(copy, tokens);

    // ── 12 FAQ ──
    case 'faq_accordion':
    case 'faq_two_column':
    case 'faq_2col':
    case 'faq_search':
      return renderFaqAccordion(copy, tokens);
    case 'faq_cards':
      return renderFeat3ColGrid(copy, tokens);

    // ── 13 Reviews ──
    case 'reviews_masonry':
    case 'reviews_carousel':
    case 'reviews_grid':
    case 'proof_review_carousel':
    case 'proof_testimonial_card':
    case 'proof_rating_text':
    case 'proof_sns_grid':
      return renderProofTestimonialCard(copy, tokens);

    // ── 14 Shipping ──
    case 'shipping_icons':
      return renderFeat3ColGrid(copy, tokens);
    case 'shipping_table':
      return renderSpecsTable(copy, tokens);
    case 'shipping_steps':
      return renderFeatNumberedSteps(copy, tokens);

    // ── 15 CTA ──
    case 'cta_centered':
    case 'cta_center':
    case 'cta_left_right':
    case 'cta_sticky_bar':
    case 'cta_popup':
      return renderCtaCenter(copy, tokens);
    case 'cta_split':
      return renderCtaCenter(copy, tokens);
    case 'cta_floating':
    case 'cta_full_banner':
      return renderCtaFullBanner(copy, tokens);

    // ── 16 Stats Numbers ──
    case 'stats_counter':
    case 'stats_inline':
    case 'proof_logo_bar':
    case 'proof_number_counter':
      return renderProofNumberCounter(copy, tokens);
    case 'stats_cards':
      return renderFeat3ColGrid(copy, tokens);

    // ── 17 Competitor Compare ──
    case 'compare_table':
    case 'compare_checklist':
    case 'feat_comparison':
      return renderCompareTable(copy, tokens);
    case 'compare_cards':
      return renderFeat3ColGrid(copy, tokens);

    // ── 18 Brand Story ──
    case 'story_timeline':
    case 'misc_timeline':
    case 'misc_process_flow':
      return renderTimeline(copy, tokens);
    case 'story_fullwidth':
      return renderFullbleedImage(copy, tokens);
    case 'story_split':
      return renderFeatZigzag(copy, tokens, order);

    // ── 19 Package Contents ──
    case 'package_grid':
      return renderFeat3ColGrid(copy, tokens);
    case 'package_exploded':
      return renderFullbleedImage(copy, tokens);
    case 'package_list':
      return renderFeatIconList(copy, tokens);

    // ── 20 Photo Reviews ──
    case 'photo_masonry':
    case 'photo_grid':
      return renderGalleryGrid(copy, tokens);
    case 'photo_carousel':
      return renderProofTestimonialCard(copy, tokens);

    // ── 21 SNS Viral ──
    case 'sns_feed':
    case 'sns_cards':
      return renderGalleryGrid(copy, tokens);
    case 'sns_embed':
      return renderGenericSection(copy, tokens);

    // ── 22 Bundle Set ──
    case 'bundle_compare':
      return renderCompareTable(copy, tokens);
    case 'bundle_cards':
      return renderFeat3ColGrid(copy, tokens);
    case 'bundle_stacked':
      return renderFeatIconList(copy, tokens);

    // ── 23 Limited Offer ──
    case 'offer_countdown':
      return renderOfferCountdown(copy, tokens);
    case 'offer_banner':
      return renderCtaFullBanner(copy, tokens);
    case 'offer_modal':
      return renderCtaCenter(copy, tokens);

    // ── 24 Refund Policy ──
    case 'refund_shield':
      return renderShieldSection(copy, tokens);
    case 'refund_steps':
      return renderFeatNumberedSteps(copy, tokens);
    case 'refund_cards':
      return renderFeat3ColGrid(copy, tokens);

    // ── 25 Customer Service ──
    case 'cs_cards':
      return renderFeat3ColGrid(copy, tokens);
    case 'cs_split':
      return renderFeatZigzag(copy, tokens, order);
    case 'cs_inline':
      return renderFeatIconList(copy, tokens);

    // ── 26 Price Table ──
    case 'price_columns':
    case 'price_3col_compare':
    case 'price_toggle':
    case 'price_feature_matrix':
      return renderPriceColumns(copy, tokens);
    case 'price_cards':
      return renderFeat3ColGrid(copy, tokens);
    case 'price_simple':
    case 'price_single_card':
      return renderGenericSection(copy, tokens);

    // ── Legacy / Misc ──
    case 'misc_team':
    case 'misc_newsletter':
    case 'misc_footer':
      return renderGenericSection(copy, tokens);

    default:
      return renderGenericSection(copy, tokens);
  }
}
