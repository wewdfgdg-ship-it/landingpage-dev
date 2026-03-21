// ============================================================
// 4. 컬러 볼드 — 우동/닥터멜라신 레퍼런스
// 컬러 배경, 크고 굵은 텍스트, 제품이 텍스트와 겹침
// ============================================================

export const html = `
<section class="cb">
  <div class="cb__content">
    <p class="cb__kicker">{{subheadline}}</p>
    <h1 class="cb__title">{{headline}}</h1>
    {{#if bullets}}
    <div class="cb__tags">
      {{#each bullets}}<span class="cb__tag">{{this}}</span>{{/each bullets}}
    </div>
    {{/if bullets}}
    <p class="cb__body">{{body}}</p>
    {{#if ctaText}}<a href="#cta" class="cb__cta">{{ctaText}}</a>{{/if ctaText}}
    {{#if microCopy}}<p class="cb__micro">{{microCopy}}</p>{{/if microCopy}}
  </div>
  {{#if imageUrl}}
  <div class="cb__product">
    <img src="{{imageUrl}}" alt="{{headlineText}}" class="cb__img" loading="lazy">
  </div>
  {{/if imageUrl}}
</section>
`;

export const css = `
.cb{display:grid;grid-template-columns:1fr 1fr;min-height:100vh;background:var(--color-primary,#2563EB);color:#fff;overflow:hidden;position:relative;}
.cb__content{display:flex;flex-direction:column;justify-content:center;padding:80px 48px 80px 8vw;gap:16px;z-index:2;}
.cb__kicker{font-size:0.8rem;font-weight:600;opacity:0.65;letter-spacing:0.1em;text-transform:uppercase;}
.cb__title{font-size:clamp(2.4rem,5.5vw,4rem);font-weight:900;line-height:1.08;letter-spacing:-0.02em;word-break:keep-all;}
.cb__title .headline-sm{display:block;font-size:0.45em;font-weight:500;opacity:0.7;letter-spacing:0.03em;margin-bottom:8px;}
.cb__title .headline-lg{font-size:1.15em;}
.cb__tags{display:flex;flex-wrap:wrap;gap:8px;}
.cb__tag{padding:6px 14px;background:rgba(255,255,255,0.15);border-radius:6px;font-size:0.78rem;font-weight:600;backdrop-filter:blur(4px);}
.cb__body{font-size:0.92rem;opacity:0.75;line-height:1.7;max-width:380px;}
.cb__cta{display:inline-block;width:fit-content;padding:16px 40px;background:#fff;color:var(--color-primary,#2563EB);border-radius:999px;font-weight:700;font-size:1.05rem;text-decoration:none;transition:opacity .2s;}
.cb__cta:hover{opacity:0.9;}
.cb__micro{font-size:0.75rem;opacity:0.5;}
.cb__product{display:flex;align-items:center;justify-content:center;padding:40px;z-index:1;}
.cb__img{width:100%;max-width:480px;object-fit:contain;max-height:75vh;filter:drop-shadow(0 16px 48px rgba(0,0,0,0.25));}
@media(max-width:768px){
  .cb{grid-template-columns:1fr;min-height:auto;}
  .cb__content{padding:80px 24px 40px;text-align:center;align-items:center;}
  .cb__tags{justify-content:center;}
  .cb__product{padding:0 24px 60px;}
  .cb__title{font-size:2rem;}
  .cb__img{max-height:50vh;}
}
`;
