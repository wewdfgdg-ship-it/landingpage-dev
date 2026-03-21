export const bundleStyles = `
.bn { position: relative; padding: var(--s-section-pad-y) var(--s-section-pad-x); background: var(--s-bg); color: var(--s-text); --bn-brand: #4A90D9; }
.bn__inner { max-width: var(--s-section-max); margin: 0 auto; text-align: center; }
.bn__header { margin-bottom: 24px; }
.bn__eyebrow { margin: 0 0 8px; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); letter-spacing: var(--s-tracking-wide); text-transform: uppercase; color: color-mix(in srgb, var(--bn-brand) 70%, #5f6980); }
.bn__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: var(--s-leading-tight); letter-spacing: var(--s-tracking-tight); }
.bn__sub { max-width: 420px; margin: 12px auto 0; font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: var(--s-text-sub); }

.bn__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }
.bn__item {  border: 1px solid var(--s-border); border-radius: 18px; background: rgba(255,255,255,0.92); text-align: center; transition: var(--s-ease); }
.bn__item:hover { transform: translateY(-3px); }
.bn__item-img-wrap { border-radius: 12px; overflow: hidden; margin-bottom: 10px; background: rgba(15,23,42,0.03); }
.bn__item-img { display: block; width: 100%; aspect-ratio: 1/1; object-fit: cover; }
.bn__item-placeholder { width: 100%; aspect-ratio: 1/1; border: 2px dashed rgba(15,23,42,0.08); border-radius: 12px; }
.bn__item-name { font-size: var(--s-text-sm); font-weight: var(--s-weight-bold); margin: 0; }
.bn__item-qty { font-size: var(--s-text-xs); color: var(--bn-brand); font-weight: var(--s-weight-bold); }
.bn__item-value { display: block; font-size: var(--s-text-xs); color: rgba(15,23,42,0.5); margin-top: 2px; }
.bn__badge { display: inline-block;  border-radius: var(--s-radius-full); background: color-mix(in srgb, var(--bn-brand) 12%, white); color: var(--bn-brand); font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); margin-bottom: 6px; }

.bn__main { margin-bottom: 16px; }
.bn__main-img-wrap { border-radius: var(--s-radius-lg); overflow: hidden; background: rgba(15,23,42,0.03); max-width: 280px; margin: 0 auto 12px; }
.bn__main-img { display: block; width: 100%; height: auto; }
.bn__main-placeholder { width: 280px; aspect-ratio: 1/1; border: 2px dashed rgba(15,23,42,0.08); border-radius: var(--s-radius-lg); margin: 0 auto 12px; }
.bn__main-name { font-size: var(--s-text-xl); font-weight: var(--s-weight-black); }
.bn__sub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-bottom: 16px; }
.bn__sub-grid .bn__item {  }

.bn__price { margin-bottom: 16px; }
.bn__price-total { font-size: var(--s-text-base); color: var(--s-text-muted); text-decoration: line-through; margin-right: 8px; }
.bn__price-sale { font-size: 32px; font-weight: var(--s-weight-black); color: var(--bn-brand); letter-spacing: -1px; }

.bn__cta { margin-top: 16px; }
.bn__cta-btn { display: block; width: 100%; padding: 18px; border: 0; border-radius: 16px; background: var(--bn-brand); color: #fff; text-align: center; text-decoration: none; font-size: var(--s-text-base); font-weight: var(--s-weight-bold); box-shadow: 0 12px 30px color-mix(in srgb, var(--bn-brand) 26%, transparent); transition: var(--s-ease); }
.bn__cta-btn:hover { transform: translateY(-2px); }
.bn__micro { margin-top: 10px; font-size: var(--s-text-xs); color: rgba(15,23,42,0.35); }

@media (max-width: 480px) { .bn {  } .bn__headline { font-size: var(--s-text-2xl); } }
@media (min-width: 768px) { .bn {  } .bn__inner { max-width: 720px; } .bn__headline { font-size: var(--s-text-3xl); } .bn__cta-btn { max-width: 380px; margin: 0 auto; } }
`;
