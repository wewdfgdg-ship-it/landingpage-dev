// ============================================================
// 3. 수치 강조 중앙 — EGF 펀딩/리뷰 1위 레퍼런스
// 밝은 배경, 중앙 정렬, 큰 숫자/수상실적 강조
// ============================================================

export const html = `
<section class="sc">
  {{#if bullets}}
  <div class="sc__trust">
    {{#each bullets}}<span class="sc__trust-item">{{this}}</span>{{/each bullets}}
  </div>
  {{/if bullets}}
  <p class="sc__kicker">{{subheadline}}</p>
  <h1 class="sc__title">{{headline}}</h1>
  <p class="sc__body">{{body}}</p>
  {{#if ctaText}}<a href="#cta" class="sc__cta">{{ctaText}}</a>{{/if ctaText}}
  {{#if microCopy}}<p class="sc__micro">{{microCopy}}</p>{{/if microCopy}}
  {{#if imageUrl}}
  <img src="{{imageUrl}}" alt="{{headlineText}}" class="sc__img" loading="lazy">
  {{/if imageUrl}}
</section>
`;

export const css = `
.sc{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#fafafa;color:#111;padding:80px 24px;gap:16px;}
.sc__trust{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;}
.sc__trust-item{padding:8px 20px;background:#fff;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.82rem;font-weight:700;color:#333;box-shadow:0 1px 3px rgba(0,0,0,0.04);}
.sc__kicker{font-size:0.85rem;color:#888;font-weight:500;letter-spacing:0.08em;margin-top:8px;}
.sc__title{font-size:clamp(2.8rem,8vw,5.5rem);font-weight:900;line-height:1.0;letter-spacing:-0.04em;word-break:keep-all;color:#111;}
.sc__title .headline-sm{display:block;font-size:0.35em;font-weight:500;color:#888;letter-spacing:0.04em;margin-bottom:12px;}
.sc__title .headline-lg{font-size:1.2em;color:var(--color-primary,#2563EB);}
.sc__body{font-size:0.95rem;color:#777;line-height:1.7;max-width:500px;}
.sc__cta{display:inline-block;padding:16px 48px;background:var(--color-primary,#2563EB);color:#fff;border-radius:999px;font-weight:700;font-size:1.05rem;text-decoration:none;margin-top:8px;transition:opacity .2s;}
.sc__cta:hover{opacity:0.85;}
.sc__micro{font-size:0.78rem;color:#aaa;}
.sc__img{margin-top:24px;width:100%;max-width:400px;object-fit:contain;max-height:40vh;filter:drop-shadow(0 8px 24px rgba(0,0,0,0.08));}
@media(max-width:768px){.sc{padding:60px 20px;}.sc__title{font-size:2.4rem;}}
`;
