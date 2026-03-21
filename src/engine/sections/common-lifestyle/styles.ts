export const lifestyleStyles = `
.ls { position: relative; padding: 0; background: var(--s-bg); color: var(--s-text); --ls-brand: #4A90D9; }
.ls__inner { max-width: var(--s-section-max); margin: 0 auto; }

.ls__img-wrap { position: relative; overflow: hidden; }
.ls__img { display: block; width: 100%; height: auto; object-fit: cover; }
.ls__img-caption { position: absolute; bottom: 12px; left: 12px;  border-radius: var(--s-radius-sm); background: rgba(0,0,0,0.55); color: #fff; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); backdrop-filter: blur(4px); }
.ls__hero { border-radius: 0; }
.ls__hero .ls__img { min-height: 320px; }
.ls__placeholder { width: 100%; min-height: 280px; background: rgba(15,23,42,0.05); display: flex; align-items: center; justify-content: center; color: rgba(15,23,42,0.25); font-size: var(--s-text-sm); }

.ls__text { padding: 28px 20px 0; text-align: center; }
.ls__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: 1.2; letter-spacing: -0.03em; word-break: keep-all; }
.ls__sub { margin: 10px auto 0; max-width: 380px; font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: rgba(15,23,42,0.6); }

.ls__tags { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 16px 20px 0; }
.ls__tag {  border-radius: var(--s-radius-full); background: color-mix(in srgb, var(--ls-brand) 10%, white); color: var(--ls-brand); font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); }

.ls__cta {  }
.ls__cta-btn { display: inline-block;  border: 1.5px solid color-mix(in srgb, var(--ls-brand) 25%, transparent); border-radius: var(--s-radius-md); background: transparent; color: var(--ls-brand); text-decoration: none; font-size: var(--s-text-base); font-weight: var(--s-weight-bold); transition: var(--s-ease); }
.ls__cta-btn:hover { background: color-mix(in srgb, var(--ls-brand) 6%, transparent); }

/* LS-B Split */
.ls__split { display: grid; gap: 0; }
.ls__split-img { min-width: 0; }
.ls__split-img .ls__img-wrap { border-radius: 0; height: 100%; }
.ls__split-img .ls__img { height: 100%; min-height: 280px; }
.ls__split-text { display: flex; flex-direction: column; justify-content: center;  }
.ls__split-text .ls__text { padding: 0; text-align: left; }
.ls__split-text .ls__tags { justify-content: flex-start; padding: 16px 0 0; }
.ls__split-text .ls__cta { padding: 20px 0 0; }

/* LS-C Collage */
.ls__collage { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 16px 0 0; }
.ls__collage-item { border-radius: 0; }
.ls__collage-item .ls__img { aspect-ratio: 1/1; }

@media (max-width: 480px) { .ls__headline { font-size: var(--s-text-xl); } .ls__collage { grid-template-columns: 1fr 1fr; } }
@media (min-width: 768px) { .ls__inner { max-width: 960px; } .ls__headline { font-size: 36px; } .ls--b .ls__split { grid-template-columns: 1fr 1fr; } .ls__collage { grid-template-columns: repeat(3, 1fr); } .ls__hero .ls__img { min-height: 480px; } }
`;
