export const ctaStyles = `
/* ═══ T9 CTA — 토큰 기반 ═══ */
.ct {
  position: relative;
  overflow: hidden;
  padding: var(--s-space-6) var(--s-section-pad-x) var(--s-space-5);
  background: var(--s-bg);
  color: var(--s-text);
}

.ct__inner {
  max-width: var(--s-section-max);
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.ct__header {
  text-align: center;
  margin-bottom: var(--s-space-3);
}

.ct__badge {
  display: inline-block;
  margin-bottom: var(--s-space-2);
  padding: 6px var(--s-space-2);
  border-radius: var(--s-radius-full);
  background: color-mix(in srgb, var(--s-brand) 15%, var(--s-bg-surface));
  color: var(--s-brand);
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
}

.ct__eyebrow {
  margin: 0 0 var(--s-space-1);
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
  letter-spacing: var(--s-tracking-wide);
  text-transform: uppercase;
  color: var(--s-brand);
}

.ct__headline {
  margin: 0;
  font-size: var(--s-text-2xl);
  font-weight: var(--s-weight-black);
  line-height: var(--s-leading-tight);
  letter-spacing: var(--s-tracking-tight);
  word-break: keep-all;
  color: var(--s-text);
}

.ct__sub {
  max-width: 420px;
  margin: var(--s-space-2) auto 0;
  font-size: var(--s-text-base);
  line-height: var(--s-leading-relaxed);
  color: var(--s-text-sub);
}

.ct__body {
  text-align: center;
  max-width: 420px;
  margin: 0 auto var(--s-space-3);
  font-size: var(--s-text-base);
  line-height: var(--s-leading-relaxed);
  color: var(--s-text-sub);
}

/* Benefits */
.ct__benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--s-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--s-space-2);
}

.ct__benefit {
  display: flex;
  align-items: center;
  gap: var(--s-space-1);
  font-size: var(--s-text-base);
  color: var(--s-text-sub);
}

.ct__benefit-icon { font-size: var(--s-text-lg); flex-shrink: 0; }

.ct__benefit-check {
  color: var(--s-brand);
  font-weight: var(--s-weight-bold);
  font-size: var(--s-text-lg);
  flex-shrink: 0;
}

/* CTA Button */
.ct__action { margin-bottom: var(--s-space-2); }

.ct__btn {
  display: block;
  width: 100%;
  padding: var(--s-space-3) var(--s-space-3);
  border: 0;
  border-radius: var(--s-radius-lg);
  font-family: var(--s-font);
  font-size: 17px;
  font-weight: var(--s-weight-bold);
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  background: var(--s-brand);
  color: #fff;
  box-shadow: 0 12px 36px color-mix(in srgb, var(--s-brand) 30%, transparent);
  transition: transform var(--s-ease), box-shadow var(--s-ease);
}

.ct__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 48px color-mix(in srgb, var(--s-brand) 45%, transparent);
}

.ct__btn-secondary {
  display: block;
  width: 100%;
  padding: var(--s-space-2) var(--s-space-3);
  border: 1.5px solid var(--s-border);
  border-radius: var(--s-radius-lg);
  background: transparent;
  color: var(--s-text-sub);
  text-align: center;
  text-decoration: none;
  font-size: var(--s-text-base);
  font-weight: var(--s-weight-bold);
  margin-top: var(--s-space-1);
  transition: background var(--s-ease);
}

.ct__btn-secondary:hover {
  background: color-mix(in srgb, var(--s-brand) 6%, transparent);
}

.ct__micro {
  margin-top: var(--s-space-2);
  font-size: var(--s-text-xs);
  color: var(--s-text-muted);
  text-align: center;
}

/* CTA-C: Visual Banner */
.ct--c { min-height: 320px; display: flex; align-items: center; justify-content: center; }
.ct--c .ct__bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; z-index: 0; }
.ct--c .ct__overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 1; }
.ct--c .ct__content { position: relative; z-index: 2; }

@media (min-width: 768px) {
  .ct { padding: var(--s-space-8) var(--s-section-pad-x); }
  .ct__inner { max-width: 640px; }
  .ct__btn { max-width: 380px; margin: 0 auto; }
  .ct__btn-secondary { max-width: 380px; margin: var(--s-space-1) auto 0; }
}
`;
