export const photoReviewStyles = `
.ph { position: relative; padding: var(--s-section-pad-y) var(--s-section-pad-x); background: var(--s-bg); color: var(--s-text); --ph-brand: #4A90D9; }
.ph__inner { max-width: var(--s-section-max); margin: 0 auto; }
.ph__header { text-align: center; margin-bottom: 24px; }
.ph__eyebrow { margin: 0 0 8px; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); letter-spacing: var(--s-tracking-wide); text-transform: uppercase; color: color-mix(in srgb, var(--ph-brand) 70%, #5f6980); }
.ph__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: var(--s-leading-tight); letter-spacing: var(--s-tracking-tight); }
.ph__sub { max-width: 420px; margin: 12px auto 0; font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: var(--s-text-sub); }
.ph__count { font-size: var(--s-text-sm); color: var(--ph-brand); font-weight: var(--s-weight-bold); margin-top: 8px; }
.ph__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.ph__card { border-radius: var(--s-radius-md); overflow: hidden; background: rgba(15,23,42,0.03); transition: var(--s-ease); }
.ph__card:hover { transform: translateY(-3px); }
.ph__card-img-wrap { }
.ph__card-img { display: block; width: 100%; aspect-ratio: 1/1; object-fit: cover; }
.ph__card-body {  }
.ph__stars { color: var(--ph-brand); font-size: var(--s-text-xs); letter-spacing: 1px; display: block; margin-bottom: 4px; }
.ph__quote { font-size: var(--s-text-xs); line-height: 1.5; color: rgba(15,23,42,0.65); margin: 0; }
.ph__author { font-size: var(--s-text-xs); color: var(--s-text-muted); margin-top: 4px; display: block; }
.ph__featured { margin-bottom: 16px; border-radius: var(--s-radius-lg); overflow: hidden; background: rgba(15,23,42,0.03); }
.ph__featured-img-wrap { }
.ph__featured-img { display: block; width: 100%; aspect-ratio: 4/3; object-fit: cover; }
.ph__featured-body {  }
.ph__featured-quote { font-size: var(--s-text-lg); font-weight: var(--s-weight-bold); line-height: 1.5; margin: 8px 0 0; }
.ph__sub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; }
.ph__sub-grid .ph__card-body { padding: 8px; }
.ph__cta { margin-top: 24px; text-align: center; }
.ph__cta-btn { display: inline-block;  border: 0; border-radius: var(--s-radius-md); background: var(--ph-brand); color: #fff; text-decoration: none; font-size: var(--s-text-base); font-weight: var(--s-weight-bold); transition: var(--s-ease); }
.ph__cta-btn:hover { transform: translateY(-2px); }

@media (max-width: 480px) { .ph {  } .ph__headline { font-size: var(--s-text-2xl); } .ph__grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px) { .ph {  } .ph__inner { max-width: 720px; } .ph__headline { font-size: var(--s-text-3xl); } .ph__grid { grid-template-columns: repeat(3, 1fr); gap: 12px; } }
`;
