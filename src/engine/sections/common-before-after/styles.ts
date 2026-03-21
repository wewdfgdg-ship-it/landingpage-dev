export const beforeAfterStyles = `
.ba { position: relative; padding: var(--s-section-pad-y) var(--s-section-pad-x); background: var(--s-bg); color: var(--s-text); --ba-brand: #4A90D9; }
.ba__inner { max-width: var(--s-section-max); margin: 0 auto; }
.ba__header { text-align: center; margin-bottom: 24px; }
.ba__eyebrow { margin: 0 0 8px; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); letter-spacing: var(--s-tracking-wide); text-transform: uppercase; color: color-mix(in srgb, var(--ba-brand) 70%, #5f6980); }
.ba__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: var(--s-leading-tight); letter-spacing: var(--s-tracking-tight); }
.ba__compare { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; }
.ba__arrow { font-size: var(--s-text-xl); font-weight: var(--s-weight-black); color: var(--ba-brand); }
.ba__img-wrap { position: relative; border-radius: 16px; overflow: hidden; background: rgba(15,23,42,0.04); }
.ba__img { display: block; width: 100%; aspect-ratio: 1/1; object-fit: cover; }
.ba__label { position: absolute; top: 10px; left: 10px;  border-radius: var(--s-radius-sm); background: rgba(0,0,0,0.6); color: #fff; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); backdrop-filter: blur(4px); }
.ba__placeholder { width: 100%; aspect-ratio: 1/1; border: 2px dashed rgba(15,23,42,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: rgba(15,23,42,0.25); font-size: var(--s-text-sm); }
.ba__slider { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-radius: 16px; overflow: hidden; }
.ba__slider-handle { position: absolute; top: 0; left: 50%; width: 4px; height: 100%; background: var(--ba-brand); transform: translateX(-50%); z-index: 2; }
.ba__stack { display: grid; gap: 16px; }
.ba__body { font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: rgba(15,23,42,0.65); text-align: center; margin-top: 16px; }
.ba__stat { text-align: center; margin-top: 12px; }
.ba__stat-num { font-size: var(--s-text-3xl); font-weight: var(--s-weight-black); color: var(--ba-brand); letter-spacing: -2px; }
.ba__stat-unit { font-size: var(--s-text-lg); margin-left: 4px; }
.ba__stat-label { display: block; font-size: var(--s-text-sm); color: rgba(15,23,42,0.5); margin-top: 4px; }
.ba__caption { font-size: var(--s-text-xs); color: rgba(15,23,42,0.35); text-align: center; margin-top: 12px; }
.ba__cta { margin-top: 24px; text-align: center; }
.ba__cta-btn { display: inline-block;  border: 0; border-radius: var(--s-radius-md); background: var(--ba-brand); color: #fff; text-decoration: none; font-size: var(--s-text-base); font-weight: var(--s-weight-bold); box-shadow: 0 8px 24px color-mix(in srgb, var(--ba-brand) 25%, transparent); transition: var(--s-ease); }
.ba__cta-btn:hover { transform: translateY(-2px); }

@media (max-width: 480px) { .ba {  } .ba__headline { font-size: var(--s-text-2xl); } .ba__stat-num { font-size: 40px; } .ba--a .ba__compare { grid-template-columns: 1fr; } .ba--a .ba__arrow { transform: rotate(90deg); justify-self: center; } }
@media (min-width: 768px) { .ba {  } .ba__inner { max-width: 720px; } .ba__headline { font-size: var(--s-text-3xl); } }
`;
