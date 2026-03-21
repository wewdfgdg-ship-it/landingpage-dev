export const statsStyles = `
.st { position: relative; padding: var(--s-section-pad-y) var(--s-section-pad-x); background: var(--s-bg); color: var(--s-text); --st-brand: #4A90D9; }
.st__inner { max-width: var(--s-section-max); margin: 0 auto; }
.st__header { text-align: center; margin-bottom: 32px; }
.st__eyebrow { margin: 0 0 8px; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); letter-spacing: var(--s-tracking-wide); text-transform: uppercase; color: color-mix(in srgb, var(--st-brand) 70%, #5f6980); }
.st__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: var(--s-leading-tight); letter-spacing: var(--s-tracking-tight); word-break: keep-all; }
.st__sub { max-width: 420px; margin: 12px auto 0; font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: var(--s-text-sub); }

.st__row { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; }
.st__item { text-align: center; }
.st__num { display: block; font-size: var(--s-text-3xl); font-weight: var(--s-weight-black); color: var(--st-brand); letter-spacing: -2px; line-height: 1; text-shadow: 0 0 20px color-mix(in srgb, var(--st-brand) 20%, transparent); }
.st__unit { display: block; font-size: var(--s-text-base); font-weight: var(--s-weight-light); color: color-mix(in srgb, var(--st-brand) 50%, currentColor); margin-top: 4px; }
.st__label { display: block; font-size: var(--s-text-xs); font-weight: var(--s-weight-light); color: rgba(255,255,255,0.3); margin-top: 6px; }

.st__big { text-align: center; margin-bottom: 28px; }
.st__big-num { display: block; font-size: 96px; font-weight: var(--s-weight-black); color: var(--st-brand); letter-spacing: -6px; line-height: 1; text-shadow: 0 0 40px color-mix(in srgb, var(--st-brand) 25%, transparent); }
.st__big-unit { display: block; font-size: var(--s-text-xl); font-weight: var(--s-weight-regular); color: color-mix(in srgb, var(--st-brand) 60%, currentColor); margin-top: 4px; }
.st__big-label { display: block; font-size: var(--s-text-lg); font-weight: var(--s-weight-bold); margin-top: 8px; }
.st__big-desc { margin: 8px auto 0; max-width: 360px; font-size: var(--s-text-sm); line-height: var(--s-leading-relaxed); color: rgba(255,255,255,0.5); }
.st__row--sub { margin-top: 8px; gap: 36px; }
.st__row--sub .st__num { font-size: var(--s-text-2xl); letter-spacing: -1px; }

.st__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; }
.st__card {  border: 1px solid rgba(255,255,255,0.08); border-radius: var(--s-radius-lg); background: rgba(255,255,255,0.06); text-align: center; transition: var(--s-ease); backdrop-filter: blur(10px); }
.st__card:hover { transform: translateY(-4px); }
.st__card-num { display: block; font-size: 36px; font-weight: var(--s-weight-black); color: var(--st-brand); letter-spacing: -2px; }
.st__card-unit { font-size: var(--s-text-base); font-weight: var(--s-weight-regular); color: color-mix(in srgb, var(--st-brand) 50%, currentColor); }
.st__card-label { margin: 8px 0 0; font-size: var(--s-text-sm); font-weight: var(--s-weight-bold); }
.st__card-desc { margin: 6px 0 0; font-size: var(--s-text-xs); color: rgba(255,255,255,0.45); line-height: 1.6; }

.st__source { margin-top: 16px; font-size: var(--s-text-xs); color: rgba(255,255,255,0.25); text-align: center; }
.st__cta { margin-top: 24px; }
.st__cta-btn { display: block; width: 100%;  border: 0; border-radius: 16px; background: var(--st-brand); color: #fff; text-align: center; text-decoration: none; font-size: var(--s-text-base); font-weight: var(--s-weight-bold); box-shadow: 0 12px 30px color-mix(in srgb, var(--st-brand) 26%, transparent); transition: var(--s-ease); }
.st__cta-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px color-mix(in srgb, var(--st-brand) 40%, transparent); }

@media (max-width: 480px) { .st {  } .st__headline { font-size: var(--s-text-2xl); } .st__num { font-size: 40px; } .st__big-num { font-size: 72px; } .st__row { gap: 32px; } .st__grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 768px) { .st {  } .st__inner { max-width: 960px; } .st__headline { font-size: var(--s-text-3xl); } .st__big-num { font-size: 120px; } .st__cta-btn { max-width: 320px; margin: 0 auto; } }
`;
