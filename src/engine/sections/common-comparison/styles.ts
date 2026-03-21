export const comparisonStyles = `
.cm { position: relative; padding: var(--s-section-pad-y) var(--s-section-pad-x); background: var(--s-bg); color: var(--s-text); --cm-brand: #4A90D9; }
.cm__inner { max-width: var(--s-section-max); margin: 0 auto; }
.cm__header { text-align: center; margin-bottom: 28px; }
.cm__eyebrow { margin: 0 0 8px; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); letter-spacing: var(--s-tracking-wide); text-transform: uppercase; color: color-mix(in srgb, var(--cm-brand) 70%, #5f6980); }
.cm__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: var(--s-leading-tight); letter-spacing: var(--s-tracking-tight); }
.cm__sub { max-width: 420px; margin: 12px auto 0; font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: var(--s-text-sub); }
.cm__table { width: 100%; border-collapse: collapse; }
.cm__table th {  font-size: var(--s-text-sm); font-weight: var(--s-weight-bold); border-bottom: 2px solid rgba(15,23,42,0.1); }
.cm__th--ours { color: var(--cm-brand); }
.cm__th--theirs { color: var(--s-text-muted); }
.cm__row { border-bottom: 1px solid var(--s-border); }
.cm__cell {  font-size: var(--s-text-sm); vertical-align: middle; }
.cm__cell--label { font-weight: var(--s-weight-bold); color: rgba(15,23,42,0.7); }
.cm__cell--ours { font-weight: var(--s-weight-bold); color: var(--cm-brand); text-align: center; }
.cm__cell--theirs { color: var(--s-text-muted); text-align: center; }
.cm__cards { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 14px; }
.cm__card {  border-radius: var(--s-radius-lg); }
.cm__card--ours { background: color-mix(in srgb, var(--cm-brand) 6%, white); border: 2px solid color-mix(in srgb, var(--cm-brand) 20%, transparent); }
.cm__card--theirs { background: rgba(15,23,42,0.03); border: 1px solid var(--s-border); }
.cm__card-name { font-size: var(--s-text-base); font-weight: var(--s-weight-black); margin: 0 0 14px; }
.cm__card--ours .cm__card-name { color: var(--cm-brand); }
.cm__card-list { list-style: none; padding: 0; margin: 0; }
.cm__card-item { padding: 8px 0; font-size: var(--s-text-sm); border-bottom: 1px solid rgba(15,23,42,0.04); }
.cm__card-item--yes { font-weight: var(--s-weight-bold); }
.cm__cta { margin-top: 24px; text-align: center; }
.cm__cta-btn { display: inline-block;  border: 0; border-radius: var(--s-radius-md); background: var(--cm-brand); color: #fff; text-decoration: none; font-size: var(--s-text-base); font-weight: var(--s-weight-bold); transition: var(--s-ease); }
.cm__cta-btn:hover { transform: translateY(-2px); }

@media (max-width: 480px) { .cm {  } .cm__headline { font-size: var(--s-text-2xl); } .cm__cards { grid-template-columns: 1fr; } }
@media (min-width: 768px) { .cm {  } .cm__inner { max-width: 720px; } .cm__headline { font-size: var(--s-text-3xl); } }
`;
