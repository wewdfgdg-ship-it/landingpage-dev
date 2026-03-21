// ============================================================
// 1. 다크 프리미엄 — BROWN 레퍼런스
// 검정 배경, 중앙 텍스트, 제품이 화면 하단을 채움
// ============================================================

export const html = `
<section class="dp">
  <div class="dp__text">
    <p class="dp__kicker">{{subheadline}}</p>
    <h1 class="dp__title">{{headline}}</h1>
    {{#if bullets}}
    <ul class="dp__points">
      {{#each bullets}}<li class="dp__point">{{this}}</li>{{/each bullets}}
    </ul>
    {{/if bullets}}
    <p class="dp__body">{{body}}</p>
    {{#if ctaText}}<a href="#cta" class="dp__cta">{{ctaText}}</a>{{/if ctaText}}
    {{#if microCopy}}<p class="dp__micro">{{microCopy}}</p>{{/if microCopy}}
  </div>
  {{#if imageUrl}}
  <div class="dp__hero-img">
    <img src="{{imageUrl}}" alt="{{headlineText}}" class="dp__img" loading="lazy">
  </div>
  {{/if imageUrl}}
</section>
`;

export const css = `
.dp{background:#0c0c0c;color:#fff;min-height:100vh;display:flex;flex-direction:column;overflow:hidden;}
.dp__text{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;text-align:center;padding:90px 24px 32px;gap:14px;}
.dp__kicker{font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;opacity:0.4;font-weight:500;}
.dp__title{font-size:clamp(2.4rem,6.5vw,4.8rem);font-weight:900;line-height:1.05;letter-spacing:-0.03em;word-break:keep-all;}
.dp__title .headline-sm{display:block;font-size:0.4em;font-weight:400;letter-spacing:0.08em;opacity:0.45;margin-bottom:10px;}
.dp__title .headline-lg{font-size:1.15em;}
.dp__points{list-style:none;display:flex;gap:20px;flex-wrap:wrap;justify-content:center;padding:0;}
.dp__point{font-size:0.82rem;opacity:0.5;position:relative;padding-left:14px;}
.dp__point::before{content:'·';position:absolute;left:0;font-weight:900;}
.dp__body{font-size:0.9rem;opacity:0.4;max-width:440px;line-height:1.7;}
.dp__cta{display:inline-block;padding:14px 40px;border:1px solid rgba(255,255,255,0.25);color:#fff;border-radius:0;font-size:0.85rem;font-weight:600;letter-spacing:0.06em;text-decoration:none;text-transform:uppercase;transition:background .2s;}
.dp__cta:hover{background:rgba(255,255,255,0.08);}
.dp__micro{font-size:0.72rem;opacity:0.3;}
.dp__hero-img{flex:1;display:flex;align-items:flex-end;justify-content:center;padding:0 5vw;}
.dp__img{width:100%;max-width:650px;object-fit:contain;max-height:48vh;filter:drop-shadow(0 -8px 30px rgba(0,0,0,0.6));}
@media(max-width:768px){.dp__text{padding:70px 20px 24px;}.dp__title{font-size:2rem;}.dp__img{max-height:35vh;}}
`;
