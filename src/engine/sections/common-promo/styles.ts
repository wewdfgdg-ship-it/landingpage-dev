export const promoStyles = `
.pl { position: relative; padding: 0; background: var(--s-bg-surface); color: var(--s-text); --pl-brand: #DC2626; }
.pl__inner { max-width: var(--s-section-max); margin: 0 auto; text-align: center; padding: 0 20px 40px; }
.pl__urgency { width: 100%;  background: var(--pl-brand); color: #fff; font-size: var(--s-text-sm); font-weight: var(--s-weight-bold); text-align: center; letter-spacing: 0.5px; }
.pl__header { padding-top: 32px; margin-bottom: 20px; }
.pl__eyebrow { margin: 0 0 8px; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); letter-spacing: var(--s-tracking-wide); text-transform: uppercase; color: color-mix(in srgb, var(--pl-brand) 70%, #5f6980); }
.pl__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: var(--s-leading-tight); letter-spacing: var(--s-tracking-tight); }
.pl__sub { max-width: 420px; margin: 12px auto 0; font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: var(--s-text-sub); }
.pl__countdown { display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; }
.pl__time-box { background: rgba(255,255,255,0.1); color: #fff; font-size: 32px; font-weight: var(--s-weight-black);  border-radius: 10px; min-width: 60px; backdrop-filter: blur(4px); }
.pl__time-sep { font-size: var(--s-text-xl); font-weight: var(--s-weight-bold); color: rgba(255,255,255,0.3); align-self: center; }
.pl__stock { margin-bottom: 20px; }
.pl__stock-bar { width: 80%; margin: 0 auto; height: 6px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden; }
.pl__stock-fill { height: 100%; background: var(--pl-brand); border-radius: 6px; transition: width 0.5s ease; }
.pl__stock-text { display: block; font-size: var(--s-text-xs); color: var(--s-text-muted); margin-top: 6px; }
.pl__benefits { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
.pl__benefit { display: flex; align-items: center; gap: 8px;  border-radius: var(--s-radius-full); background: color-mix(in srgb, var(--pl-brand) 12%, transparent); font-size: var(--s-text-sm); font-weight: var(--s-weight-bold); }
.pl__benefit-icon { font-size: var(--s-text-base); }
.pl__cta { margin-bottom: 10px; }
.pl__cta-btn { display: block; width: 100%; padding: 20px; border: 0; border-radius: 16px; background: var(--pl-brand); color: #fff; text-align: center; text-decoration: none; font-size: 17px; font-weight: var(--s-weight-bold); box-shadow: 0 12px 36px color-mix(in srgb, var(--pl-brand) 35%, transparent); transition: var(--s-ease); }
.pl__cta-btn:hover { transform: translateY(-2px); }
.pl__micro { font-size: var(--s-text-xs); color: rgba(255,255,255,0.25); }

@media (max-width: 480px) { .pl__headline { font-size: var(--s-text-2xl); } .pl__time-box { font-size: var(--s-text-xl); min-width: 48px;  } }
@media (min-width: 768px) { .pl__inner { max-width: 640px; } .pl__headline { font-size: var(--s-text-3xl); } .pl__cta-btn { max-width: 380px; margin: 0 auto; } }
`;
