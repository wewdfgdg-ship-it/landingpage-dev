export const reviewsStyles = `
.rv { position: relative; overflow: hidden; padding: var(--s-space-8) var(--s-section-pad-x) var(--s-section-pad-y); background: var(--s-bg); color: var(--s-text); --rv-brand: #4A90D9; }
.rv__inner { max-width: var(--s-section-max); margin: 0 auto; }

.rv__header { text-align: center; margin-bottom: 24px; }
.rv__eyebrow { margin: 0 0 8px; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); letter-spacing: var(--s-tracking-wide); text-transform: uppercase; color: color-mix(in srgb, var(--rv-brand) 70%, #5f6980); }
.rv__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: var(--s-leading-tight); letter-spacing: var(--s-tracking-tight); word-break: keep-all; }
.rv__sub { max-width: 420px; margin: 12px auto 0; font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: var(--s-text-sub); }

.rv__summary { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
.rv__summary-num { font-size: 40px; font-weight: var(--s-weight-black); color: var(--rv-brand); letter-spacing: -2px; }
.rv__stars { color: var(--rv-brand); font-size: var(--s-text-lg); letter-spacing: 2px; }
.rv__summary-count { font-size: var(--s-text-sm); color: rgba(15,23,42,0.5); }

.rv__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }

.rv__card { padding: 20px; border: 1px solid var(--s-border); border-radius: var(--s-radius-lg); background: rgba(255,255,255,0.92); box-shadow: 0 12px 36px rgba(15,23,42,0.05); backdrop-filter: blur(10px); transition: var(--s-ease); }
.rv__card:hover { transform: translateY(-4px); box-shadow: 0 18px 48px rgba(15,23,42,0.09); }
.rv__card--featured { padding: 28px; border: 2px solid color-mix(in srgb, var(--rv-brand) 25%, transparent); box-shadow: 0 24px 64px rgba(15,23,42,0.1); }
.rv__card .rv__stars { margin-bottom: 12px; }

.rv__quote { margin: 0; font-size: var(--s-text-base); font-weight: var(--s-weight-regular); line-height: var(--s-leading-relaxed); color: rgba(15,23,42,0.8); font-style: italic; }
.rv__card--featured .rv__quote { font-size: var(--s-text-xl); font-weight: var(--s-weight-bold); font-style: normal; line-height: 1.5; color: inherit; }

.rv__author { display: flex; align-items: center; gap: 10px; margin-top: 16px; }
.rv__avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
.rv__author-info { display: flex; flex-direction: column; }
.rv__author-name { font-size: var(--s-text-sm); font-weight: var(--s-weight-bold); }
.rv__author-meta { font-size: var(--s-text-xs); color: rgba(15,23,42,0.45); }

.rv__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.rv__tag {  border-radius: var(--s-radius-full); background: color-mix(in srgb, var(--rv-brand) 10%, white); color: var(--rv-brand); font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); }

.rv__mini-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-top: 16px; }
.rv__mini-list .rv__card { padding: 16px; }
.rv__mini-list .rv__quote { font-size: var(--s-text-sm); }

.rv__photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.rv__photo-item { border-radius: var(--s-radius-md); overflow: hidden; background: rgba(15,23,42,0.04); }
.rv__photo-img { display: block; width: 100%; aspect-ratio: 1/1; object-fit: cover; }
.rv__photo-caption {  }
.rv__photo-author { font-size: var(--s-text-sm); font-weight: var(--s-weight-bold); display: block; }
.rv__photo-quote { font-size: var(--s-text-xs); color: rgba(15,23,42,0.6); display: block; margin-top: 4px; }

.rv__cta { margin-top: 24px; }
.rv__cta-btn { display: block; width: 100%;  border: 0; border-radius: 16px; background: var(--rv-brand); color: #fff; text-align: center; text-decoration: none; font-size: var(--s-text-base); font-weight: var(--s-weight-bold); box-shadow: 0 12px 30px color-mix(in srgb, var(--rv-brand) 26%, transparent); transition: var(--s-ease); }
.rv__cta-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px color-mix(in srgb, var(--rv-brand) 40%, transparent); }

@media (max-width: 480px) { .rv {  } .rv__headline { font-size: var(--s-text-2xl); } .rv__grid { grid-template-columns: 1fr; } .rv__photo-grid { grid-template-columns: repeat(2, 1fr); } .rv__summary-num { font-size: 32px; } }
@media (min-width: 768px) { .rv {  } .rv__inner { max-width: 960px; } .rv__headline { font-size: var(--s-text-3xl); } .rv__cta-btn { max-width: 320px; margin: 0 auto; } }
`;
