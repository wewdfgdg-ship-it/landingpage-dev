import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens, ColorPalette } from '@/engine/09-visual-style/types';

// ============================================================
// Section Renderers — 패턴별 HTML 생성
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

// --- Hero 패턴 ---

export function renderHeroFullscreenCenter(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:60px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="max-width:800px;">
    <h1 style="font-size:3.5rem;font-weight:700;line-height:1.15;margin-bottom:16px;">${esc(copy.headline)}</h1>
    <p style="font-size:1.25rem;color:${c.textSecondary};margin-bottom:32px;">${esc(copy.subheadline)}</p>
    ${ctaButton(copy.ctaText, c, copy.microCopy)}
  </div>
</section>`;
}

export function renderHeroLeftRight(copy: CopyBlock, tokens: DesignTokens): string {
  const c = tokens.colors;
  return `<section style="display:flex;flex-wrap:wrap;min-height:90vh;align-items:center;padding:60px 24px;background:${c.background};color:${c.textPrimary};">
  <div style="flex:1;min-width:300px;padding:40px;">
    <h1 style="font-size:3rem;font-weight:700;line-height:1.2;margin-bottom:16px;">${esc(copy.headline)}</h1>
    <p style="font-size:1.15rem;color:${c.textSecondary};margin-bottom:24px;">${esc(copy.subheadline)}</p>
    <p style="color:${c.textSecondary};margin-bottom:24px;">${esc(copy.body)}</p>
    ${ctaButton(copy.ctaText, c, copy.microCopy)}
  </div>
  <div style="flex:1;min-width:300px;display:flex;align-items:center;justify-content:center;padding:40px;">
    ${imageBlock(copy, c, '500px')}
  </div>
</section>`;
}

// --- Feature 패턴 ---

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

// --- Social Proof 패턴 ---

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

// --- CTA 패턴 ---

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

// --- FAQ 패턴 ---

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

// --- Misc 패턴 ---

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

export function renderMiscProcessFlow(copy: CopyBlock, tokens: DesignTokens): string {
  return renderFeatNumberedSteps(copy, tokens);
}

// --- 범용 폴백 렌더러 ---

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

// --- 패턴 ID → 렌더러 매핑 ---

export function renderByPatternId(
  patternId: string,
  copy: CopyBlock,
  tokens: DesignTokens,
  order: number,
): string {
  switch (patternId) {
    // Hero
    case 'hero_fullscreen_center':
    case 'hero_gradient':
    case 'hero_minimal_typo':
      return renderHeroFullscreenCenter(copy, tokens);
    case 'hero_left_right':
    case 'hero_split':
    case 'hero_card':
      return renderHeroLeftRight(copy, tokens);
    case 'hero_video_bg':
    case 'hero_product_center':
      return renderHeroFullscreenCenter(copy, tokens);

    // Feature
    case 'feat_3col_grid':
    case 'feat_card_grid':
      return renderFeat3ColGrid(copy, tokens);
    case 'feat_zigzag':
    case 'feat_large_img_bullets':
      return renderFeatZigzag(copy, tokens, order);
    case 'feat_icon_list':
    case 'feat_accordion':
    case 'feat_tab':
      return renderFeatIconList(copy, tokens);
    case 'feat_numbered_steps':
    case 'feat_infographic':
      return renderFeatNumberedSteps(copy, tokens);
    case 'feat_comparison':
      return renderFeat3ColGrid(copy, tokens);

    // Social Proof
    case 'proof_review_carousel':
    case 'proof_testimonial_card':
    case 'proof_rating_text':
    case 'proof_sns_grid':
      return renderProofTestimonialCard(copy, tokens);
    case 'proof_logo_bar':
    case 'proof_number_counter':
      return renderProofNumberCounter(copy, tokens);

    // Pricing
    case 'price_3col_compare':
    case 'price_single_card':
    case 'price_toggle':
    case 'price_feature_matrix':
      return renderGenericSection(copy, tokens);

    // CTA
    case 'cta_center':
    case 'cta_left_right':
    case 'cta_sticky_bar':
    case 'cta_popup':
      return renderCtaCenter(copy, tokens);
    case 'cta_full_banner':
      return renderCtaFullBanner(copy, tokens);

    // FAQ
    case 'faq_accordion':
    case 'faq_2col':
    case 'faq_search':
      return renderFaqAccordion(copy, tokens);

    // Misc
    case 'misc_before_after':
      return renderMiscBeforeAfter(copy, tokens);
    case 'misc_timeline':
    case 'misc_process_flow':
      return renderMiscProcessFlow(copy, tokens);
    case 'misc_team':
    case 'misc_newsletter':
    case 'misc_footer':
      return renderGenericSection(copy, tokens);

    default:
      return renderGenericSection(copy, tokens);
  }
}
