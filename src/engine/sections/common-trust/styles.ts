export const trustStyles = `
.tr { position: relative; padding: var(--s-section-pad-y) var(--s-section-pad-x); background: var(--s-bg); color: var(--s-text); --tr-brand: #C9A96E; }
.tr__inner { max-width: var(--s-section-max); margin: 0 auto; text-align: center; }
.tr__header { margin-bottom: 28px; }
.tr__eyebrow { margin: 0 0 8px; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); letter-spacing: var(--s-tracking-wide); text-transform: uppercase; color: color-mix(in srgb, var(--tr-brand) 70%, #5f6980); }
.tr__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: var(--s-leading-tight); letter-spacing: var(--s-tracking-tight); }
.tr__sub { max-width: 420px; margin: 12px auto 0; font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: var(--s-text-sub); }
.tr__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px; }
.tr__badge {  border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; background: rgba(255,255,255,0.06); text-align: center; transition: var(--s-ease); backdrop-filter: blur(8px); }
.tr__badge:hover { transform: translateY(-3px); }
.tr__badge-icon { display: block; font-size: var(--s-text-2xl); margin-bottom: 8px; }
.tr__badge-img { display: block; width: 48px; height: 48px; margin: 0 auto 8px; border-radius: var(--s-radius-sm); object-fit: contain; }
.tr__badge-name { display: block; font-size: var(--s-text-sm); font-weight: var(--s-weight-bold); }
.tr__badge-desc { display: block; font-size: var(--s-text-xs); color: rgba(255,255,255,0.45); margin-top: 4px; }
.tr__featured {  border: 2px solid color-mix(in srgb, var(--tr-brand) 30%, transparent); border-radius: 24px; background: color-mix(in srgb, var(--tr-brand) 5%, transparent); margin-bottom: 20px; }
.tr__featured-icon { font-size: 40px; display: block; margin-bottom: 12px; }
.tr__featured-name { font-size: var(--s-text-xl); font-weight: var(--s-weight-black); margin: 0; }
.tr__featured-desc { font-size: var(--s-text-sm); color: rgba(255,255,255,0.6); margin-top: 8px; }
.tr__strip { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; }
.tr__strip .tr__badge { min-width: 100px; }
.tr__logos { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; align-items: center; }
.tr__media { text-align: center; }
.tr__media-logo { height: 32px; width: auto; object-fit: contain; filter: brightness(0) invert(0.7); transition: var(--s-ease); }
.tr__media-logo:hover { filter: brightness(0) invert(1); }
.tr__media-name { font-size: var(--s-text-base); font-weight: var(--s-weight-bold); color: rgba(255,255,255,0.5); }
.tr__media-quote { display: block; font-size: var(--s-text-xs); color: var(--s-text-muted); margin-top: 6px; font-style: italic; }
.tr__cta { margin-top: 24px; }
.tr__cta-btn { display: inline-block;  border: 1.5px solid color-mix(in srgb, var(--tr-brand) 30%, transparent); border-radius: var(--s-radius-md); background: transparent; color: var(--tr-brand); text-decoration: none; font-size: var(--s-text-base); font-weight: var(--s-weight-bold); transition: var(--s-ease); }
.tr__cta-btn:hover { background: color-mix(in srgb, var(--tr-brand) 8%, transparent); }

@media (max-width: 480px) { .tr {  } .tr__headline { font-size: var(--s-text-2xl); } .tr__grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px) { .tr {  } .tr__inner { max-width: 720px; } .tr__headline { font-size: var(--s-text-3xl); } }
`;
