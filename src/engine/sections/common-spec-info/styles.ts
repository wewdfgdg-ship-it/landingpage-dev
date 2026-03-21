export const specInfoStyles = `
/* ═══ T3 Spec/Info — Base ═══ */
.si {
  position: relative;
  overflow: hidden;
  padding: var(--s-section-pad-y) var(--s-section-pad-x);
  background: var(--s-bg);
  color: var(--s-text);
  --si-brand: #4A90D9;
}

.si__inner {
  max-width: var(--s-section-max);
  margin: 0 auto;
}

/* ── Header ── */
.si__header {
  text-align: center;
  margin-bottom: 28px;
}

.si__eyebrow {
  margin: 0 0 8px;
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
  line-height: 1.2;
  letter-spacing: var(--s-tracking-wide);
  text-transform: uppercase;
  color: color-mix(in srgb, var(--si-brand) 70%, #5f6980);
}

.si__headline {
  margin: 0;
  font-size: var(--s-text-2xl);
  font-weight: var(--s-weight-black);
  line-height: var(--s-leading-tight);
  letter-spacing: var(--s-tracking-tight);
  word-break: keep-all;
}

.si__sub {
  max-width: 420px;
  margin: 12px auto 0;
  font-size: var(--s-text-base);
  line-height: var(--s-leading-relaxed);
  color: var(--s-text-sub);
  word-break: keep-all;
}

/* ── Badge ── */
.si__badge {
  display: inline-flex;
  align-items: center;
  
  border-radius: var(--s-radius-full);
  background: color-mix(in srgb, var(--si-brand) 12%, white);
  color: var(--si-brand);
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
  line-height: 1;
}

/* ═══ SI-A: Spec Rows ═══ */
.si__hero-wrap {
  position: relative;
  margin-bottom: 24px;
  border-radius: var(--s-radius-lg);
  overflow: hidden;
}

.si__hero-img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.si__annotations {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
}

.si__annotation {
  position: absolute;
  
  border-radius: 10px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
  color: var(--si-brand);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  top: calc(20% + var(--si-ann-i) * 22%);
  left: calc(8% + var(--si-ann-i) * 15%);
}

.si__metric {
  text-align: center;
  margin-bottom: 20px;
}

.si__metric-num {
  font-size: var(--s-text-4xl);
  font-weight: var(--s-weight-black);
  letter-spacing: -3px;
  color: var(--si-brand);
  line-height: 1;
}

.si__metric-label {
  display: block;
  font-size: var(--s-text-sm);
  font-weight: var(--s-weight-regular);
  color: rgba(15, 23, 42, 0.5);
  margin-top: 6px;
}

.si__rows {
  display: grid;
  gap: 0;
}

.si__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--s-border);
  transition: var(--s-ease);
}

.si__row:hover {
  background: rgba(15, 23, 42, 0.02);
}

.si__row-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--s-text-sm);
  font-weight: var(--s-weight-bold);
  color: rgba(15, 23, 42, 0.55);
  white-space: nowrap;
}

.si__row-icon {
  font-size: var(--s-text-base);
}

.si__row-value {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: var(--s-text-base);
  font-weight: var(--s-weight-bold);
  text-align: right;
}

.si__row-desc {
  display: block;
  width: 100%;
  font-size: var(--s-text-sm);
  font-weight: var(--s-weight-regular);
  color: rgba(15, 23, 42, 0.45);
  margin-top: 2px;
}

.si__row-note {
  display: block;
  width: 100%;
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-regular);
  color: rgba(15, 23, 42, 0.35);
}

/* ═══ SI-B: Steps ═══ */
.si__steps {
  display: grid;
  gap: 0;
}

.si__step {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 16px;
  align-items: start;
  padding: 24px 0;
  border-bottom: 1px solid var(--s-border);
}

.si__step:first-child {
  border-top: 1px solid var(--s-border);
}

.si__step-num {
  font-size: var(--s-text-2xl);
  font-weight: var(--s-weight-black);
  line-height: 1;
  color: var(--si-brand);
}

.si__step-icon {
  font-size: var(--s-text-xl);
}

.si__step-body {
  min-width: 0;
}

.si__step-title {
  margin: 0;
  font-size: var(--s-text-lg);
  font-weight: var(--s-weight-black);
  line-height: var(--s-leading-snug);
  letter-spacing: -0.02em;
}

.si__step-desc {
  margin: 8px 0 0;
  font-size: var(--s-text-sm);
  line-height: 1.68;
  color: rgba(15, 23, 42, 0.65);
}

.si__step-media {
  margin-top: 12px;
  border-radius: var(--s-radius-md);
  overflow: hidden;
  background: rgba(15, 23, 42, 0.04);
}

.si__step-img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.si__step-note {
  margin-top: 6px;
  font-size: var(--s-text-xs);
  color: var(--s-text-muted);
}

/* ═══ SI-C: Info Cards ═══ */
.si__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
}

.si__card {
  padding: 20px;
  border: 1px solid var(--s-border);
  border-radius: var(--s-radius-lg);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(10px);
  text-align: center;
  transition: var(--s-ease);
}

.si__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.09);
}

.si__card-icon {
  font-size: var(--s-text-2xl);
  margin-bottom: 12px;
}

.si__card-title {
  margin: 0;
  font-size: var(--s-text-base);
  font-weight: var(--s-weight-black);
  line-height: var(--s-leading-snug);
}

.si__card-value {
  margin-top: 6px;
  font-size: var(--s-text-xl);
  font-weight: var(--s-weight-black);
  color: var(--si-brand);
  letter-spacing: -1px;
}

.si__card-desc {
  margin: 8px 0 0;
  font-size: var(--s-text-sm);
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.6);
}

/* ── CTA ── */
.si__cta {
  margin-top: 24px;
}

.si__cta-btn {
  display: block;
  width: 100%;
  
  border: 0;
  border-radius: 16px;
  background: var(--si-brand);
  color: #ffffff;
  text-align: center;
  text-decoration: none;
  font-size: var(--s-text-base);
  font-weight: var(--s-weight-bold);
  line-height: 1.2;
  box-shadow: 0 12px 30px color-mix(in srgb, var(--si-brand) 26%, transparent);
  transition: var(--s-ease);
}

.si__cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px color-mix(in srgb, var(--si-brand) 40%, transparent);
}

.si__footnote {
  margin-top: 16px;
  font-size: var(--s-text-xs);
  color: rgba(15, 23, 42, 0.35);
  text-align: center;
}

/* ═══ Responsive ═══ */
@media (max-width: 480px) {
  .si {  }
  .si__headline { font-size: var(--s-text-2xl); }
  .si__metric-num { font-size: 44px; }
  .si__grid { grid-template-columns: 1fr 1fr; }
  .si__step { grid-template-columns: 40px 1fr; gap: 12px; }
  .si__step-num { font-size: 22px; }
}

@media (min-width: 768px) {
  .si {  }
  .si__inner { max-width: 960px; }
  .si__headline { font-size: var(--s-text-3xl); }
  .si__metric-num { font-size: 64px; }
  .si--b .si__step { grid-template-columns: 56px 1fr; gap: 20px; padding: 28px 0; }
  .si--b .si__step-num { font-size: 32px; }
  .si__cta { margin-top: 28px; }
  .si__cta-btn { max-width: 320px; margin: 0 auto; }
}
`;
