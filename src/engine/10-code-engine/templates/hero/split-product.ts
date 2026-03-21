// ============================================================
// 2. 좌우 분할 — 무화당/에어팟 레퍼런스
// 왼쪽 텍스트 + 오른쪽 큰 제품 이미지
// ============================================================

export const html = `
<section class="sp">
  <div class="sp__copy">
    <p class="sp__kicker">{{subheadline}}</p>
    <h1 class="sp__title">{{headline}}</h1>
    {{#if bullets}}
    <div class="sp__badges">
      {{#each bullets}}<span class="sp__badge">{{this}}</span>{{/each bullets}}
    </div>
    {{/if bullets}}
    <p class="sp__body">{{body}}</p>
    {{#if ctaText}}<a href="#cta" class="sp__cta">{{ctaText}}</a>{{/if ctaText}}
    {{#if microCopy}}<p class="sp__micro">{{microCopy}}</p>{{/if microCopy}}
  </div>
  <div class="sp__visual">
    {{#if imageUrl}}
    <img src="{{imageUrl}}" alt="{{headlineText}}" class="sp__img" loading="lazy">
    {{/if imageUrl}}
  </div>
</section>
`;

export const css = `
.sp{display:grid;grid-template-columns:1fr 1fr;min-height:92vh;align-items:center;background:#fff;color:#111;}
.sp__copy{padding:80px 40px 80px 8vw;}
.sp__kicker{font-size:0.88rem;color:var(--color-primary,#2563EB);font-weight:700;margin-bottom:14px;letter-spacing:0.06em;text-transform:uppercase;}
.sp__title{font-size:clamp(2rem,5vw,3.4rem);font-weight:900;line-height:1.12;letter-spacing:-0.025em;margin-bottom:20px;word-break:keep-all;color:#111;}
.sp__title .headline-sm{display:block;font-size:0.5em;font-weight:500;color:#666;letter-spacing:0.02em;margin-bottom:6px;}
.sp__title .headline-lg{font-size:1.12em;}
.sp__badges{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;}
.sp__badge{padding:6px 16px;background:var(--color-primary-light,#DBEAFE);color:var(--color-primary-dark,#1E40AF);border-radius:999px;font-size:0.82rem;font-weight:600;}
.sp__body{color:#555;line-height:1.75;font-size:1rem;margin-bottom:28px;max-width:440px;}
.sp__cta{display:inline-block;padding:16px 40px;background:var(--color-primary,#2563EB);color:#fff;border-radius:999px;font-weight:700;font-size:1.05rem;text-decoration:none;box-shadow:0 4px 16px rgba(37,99,235,0.25);transition:transform .2s,box-shadow .2s;}
.sp__cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,99,235,0.35);}
.sp__micro{margin-top:10px;font-size:0.82rem;color:#999;}
.sp__visual{display:flex;align-items:center;justify-content:center;padding:20px;}
.sp__img{width:100%;max-width:600px;border-radius:16px;object-fit:cover;aspect-ratio:4/3;box-shadow:0 16px 48px rgba(0,0,0,0.1);}
@media(max-width:768px){.sp{grid-template-columns:1fr;padding:48px 16px;}.sp__copy{padding:0 8px;}.sp__title{font-size:1.8rem;}}
`;
