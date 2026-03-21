export const pricingStyles = `
.pc { position: relative; padding: var(--s-section-pad-y) var(--s-section-pad-x); background: var(--s-bg); color: var(--s-text); --pc-brand: #4A90D9; }
.pc__inner { max-width: var(--s-section-max); margin: 0 auto; text-align: center; }
.pc__header { margin-bottom: 24px; }
.pc__eyebrow { margin: 0 0 8px; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); letter-spacing: var(--s-tracking-wide); text-transform: uppercase; color: color-mix(in srgb, var(--pc-brand) 70%, #5f6980); }
.pc__headline { margin: 0; font-size: var(--s-text-2xl); font-weight: var(--s-weight-black); line-height: var(--s-leading-tight); letter-spacing: var(--s-tracking-tight); word-break: keep-all; }
.pc__sub { max-width: 420px; margin: 12px auto 0; font-size: var(--s-text-base); line-height: var(--s-leading-relaxed); color: var(--s-text-sub); }

.pc__discount { display: inline-block; margin-bottom: 16px;  border-radius: var(--s-radius-full); background: color-mix(in srgb, var(--pc-brand) 15%, transparent); color: var(--pc-brand); font-size: var(--s-text-base); font-weight: var(--s-weight-black); }

.pc__price { margin-bottom: 20px; }
.pc__price-original { font-size: var(--s-text-lg); color: var(--s-text-muted); text-decoration: line-through; margin-right: 8px; }
.pc__price-sale { font-size: var(--s-text-3xl); font-weight: var(--s-weight-black); letter-spacing: -2px; color: var(--pc-brand); }

.pc__benefits { list-style: none; padding: 0; margin: 0 0 24px; display: inline-flex; flex-direction: column; gap: 10px; text-align: left; }
.pc__benefit { display: flex; align-items: center; gap: 8px; font-size: var(--s-text-base); }
.pc__benefit-icon { font-size: var(--s-text-base); }
.pc__benefit-check { color: var(--pc-brand); font-weight: var(--s-weight-bold); }

/* PR-B Plans */
.pc--b .pc__inner { max-width: 720px; }
.pc__plans { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.pc__plan {  border: 1px solid rgba(15,23,42,0.08); border-radius: 24px; background: rgba(255,255,255,0.92); text-align: center; transition: var(--s-ease); }
.pc__plan:hover { transform: translateY(-4px); }
.pc__plan--rec { border: 2px solid var(--pc-brand); box-shadow: 0 16px 48px color-mix(in srgb, var(--pc-brand) 15%, transparent); position: relative; }
.pc__plan-badge { display: inline-block; margin-bottom: 12px;  border-radius: var(--s-radius-full); background: var(--pc-brand); color: #fff; font-size: var(--s-text-xs); font-weight: var(--s-weight-bold); }
.pc__plan-name { margin: 0; font-size: var(--s-text-lg); font-weight: var(--s-weight-black); }
.pc__plan-price { margin: 12px 0 16px; }
.pc__plan-price .pc__price-sale { font-size: 32px; }
.pc__plan-period { font-size: var(--s-text-sm); color: rgba(15,23,42,0.5); margin-left: 4px; }
.pc__plan .pc__benefits { margin-bottom: 20px; }
.pc__plan-btn { display: block; width: 100%; padding: 14px; border: 1.5px solid rgba(15,23,42,0.1); border-radius: var(--s-radius-md); background: transparent; color: inherit; text-align: center; text-decoration: none; font-size: var(--s-text-base); font-weight: var(--s-weight-bold); transition: var(--s-ease); }
.pc__plan-btn:hover { background: rgba(15,23,42,0.04); }
.pc__plan-btn--rec { background: var(--pc-brand); color: #fff; border-color: var(--pc-brand); box-shadow: 0 8px 24px color-mix(in srgb, var(--pc-brand) 25%, transparent); }
.pc__plan-btn--rec:hover { opacity: 0.9; }

/* PR-C Calc */
.pc__calc { max-width: 360px; margin: 0 auto 24px; text-align: left; }
.pc__calc-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--s-border); font-size: var(--s-text-base); }
.pc__calc-gift { color: var(--pc-brand); }
.pc__calc-total { font-size: var(--s-text-xl); font-weight: var(--s-weight-black); border-bottom: none; border-top: 2px solid var(--pc-brand); padding-top: 14px; margin-top: 4px; }

.pc__cta { margin-top: 24px; }
.pc__cta-btn { display: block; width: 100%; padding: 20px; border: 0; border-radius: 16px; background: var(--pc-brand); color: #fff; text-align: center; text-decoration: none; font-size: 17px; font-weight: var(--s-weight-bold); box-shadow: 0 12px 36px color-mix(in srgb, var(--pc-brand) 30%, transparent); transition: var(--s-ease); }
.pc__cta-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 48px color-mix(in srgb, var(--pc-brand) 45%, transparent); }
.pc__micro { margin-top: 12px; font-size: var(--s-text-xs); color: rgba(15,23,42,0.35); }

@media (max-width: 480px) { .pc {  } .pc__headline { font-size: var(--s-text-2xl); } .pc__price-sale { font-size: 40px; } .pc__plans { grid-template-columns: 1fr; } }
@media (min-width: 768px) { .pc {  } .pc__inner { max-width: 720px; } .pc--b .pc__inner { max-width: 960px; } .pc__headline { font-size: var(--s-text-3xl); } .pc__cta-btn { max-width: 380px; margin: 0 auto; } }
`;
