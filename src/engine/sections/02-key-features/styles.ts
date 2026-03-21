export const keyFeaturesStyles = `
/* ═══ T1 Feature Grid — Base ═══ */
.kf {
  position: relative;
  overflow: hidden;
  padding: var(--s-section-pad-y) var(--s-section-pad-x);
  background: var(--s-bg);
  color: var(--s-text);
  --kf-brand: #4A90D9;
}

.kf__inner {
  max-width: var(--s-section-max);
  margin: 0 auto;
}

/* ── Header ── */
.kf__header {
  text-align: center;
  margin-bottom: 28px;
}

.kf__eyebrow {
  margin: 0 0 8px;
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
  line-height: 1.2;
  letter-spacing: var(--s-tracking-wide);
  text-transform: uppercase;
  color: color-mix(in srgb, var(--kf-brand) 70%, #5f6980);
}

.kf__headline {
  margin: 0;
  font-size: var(--s-text-2xl);
  font-weight: var(--s-weight-black);
  line-height: var(--s-leading-tight);
  letter-spacing: var(--s-tracking-tight);
  word-break: keep-all;
}

.kf__sub {
  max-width: 420px;
  margin: 12px auto 0;
  font-size: var(--s-text-base);
  line-height: var(--s-leading-relaxed);
  color: var(--s-text-sub);
  word-break: keep-all;
}

/* ── Card (공통) ── */
.kf__card {
  position: relative;
  min-height: 100%;
  padding: 20px;
  border: 1px solid var(--s-border);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(10px);
  transition: var(--s-ease);
}

.kf__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 56px rgba(15, 23, 42, 0.1);
}

.kf__card--featured {
  padding: 24px;
  border: 2px solid color-mix(in srgb, var(--kf-brand) 30%, transparent);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
  transform: scale(1.02);
}

.kf__card--featured:hover {
  transform: scale(1.02) translateY(-4px);
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.16);
}

.kf__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  
  border-radius: var(--s-radius-full);
  background: color-mix(in srgb, var(--kf-brand) 12%, white);
  color: var(--kf-brand);
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
  line-height: 1;
}

.kf__icon {
  margin-bottom: 14px;
  font-size: var(--s-text-xl);
  line-height: 1;
}

.kf__card-media {
  margin-bottom: 14px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.04);
}

.kf__card-img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.kf__card-title {
  margin: 0;
  font-size: var(--s-text-xl);
  font-weight: var(--s-weight-black);
  line-height: var(--s-leading-snug);
  letter-spacing: -0.03em;
  word-break: keep-all;
}

.kf__card-desc {
  margin: 10px 0 0;
  font-size: var(--s-text-sm);
  line-height: 1.68;
  color: rgba(15, 23, 42, 0.72);
  word-break: keep-all;
}

/* ── KF-A: Grid ── */
.kf__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

/* ── KF-B: Split ── */
.kf__split {
  display: grid;
  gap: 14px;
}

.kf__split-main,
.kf__split-side {
  min-width: 0;
}

.kf__split-side .kf__grid {
  grid-template-columns: 1fr;
}

.kf--b .kf__card--featured .kf__card-title {
  font-size: var(--s-text-xl);
}

/* ── KF-C: List ── */
.kf__list {
  display: grid;
  gap: 0;
}

.kf__list-item {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 14px;
  align-items: start;
  padding: 18px 0;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  transition: var(--s-ease);
}

.kf__list-item:last-child {
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.kf__list-item:hover {
  background: rgba(15, 23, 42, 0.02);
}

.kf__list-num {
  font-size: var(--s-text-xl);
  font-weight: var(--s-weight-black);
  line-height: 1;
  color: var(--kf-brand);
}

.kf__list-body {
  min-width: 0;
}

.kf__list-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.kf__list-top .kf__badge {
  margin-bottom: 10px;
}

.kf--c .kf__header {
  margin-bottom: 22px;
}

/* ── CTA ── */
.kf__cta {
  margin-top: 24px;
}

.kf__cta-btn {
  display: block;
  width: 100%;
  
  border: 0;
  border-radius: 16px;
  background: var(--kf-brand);
  color: #ffffff;
  text-align: center;
  text-decoration: none;
  font-size: var(--s-text-base);
  font-weight: var(--s-weight-bold);
  line-height: 1.2;
  box-shadow: 0 12px 30px color-mix(in srgb, var(--kf-brand) 26%, transparent);
  transition: var(--s-ease);
}

.kf__cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px color-mix(in srgb, var(--kf-brand) 40%, transparent);
}

/* ═══ Responsive ═══ */
@media (max-width: 480px) {
  .kf {
    
  }
  .kf__headline {
    font-size: 30px;
  }
  .kf__grid {
    grid-template-columns: 1fr;
  }
  .kf__card,
  .kf__card--featured {
    padding: 18px;
  }
  .kf__list-item {
    grid-template-columns: 36px 1fr;
    gap: 12px;
  }
  .kf__list-num {
    font-size: var(--s-text-xl);
  }
}

@media (min-width: 768px) {
  .kf {
    
  }
  .kf__inner {
    max-width: 960px;
  }
  .kf__headline {
    font-size: var(--s-text-3xl);
  }
  .kf--b .kf__split {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    align-items: stretch;
  }
  .kf--b .kf__split-side .kf__grid {
    grid-template-columns: 1fr;
  }
  .kf--c .kf__list {
    gap: 4px;
  }
  .kf--c .kf__list-item {
    grid-template-columns: 56px 1fr;
    gap: 16px;
    padding: 22px 0;
  }
  .kf--c .kf__list-num {
    font-size: var(--s-text-2xl);
  }
  .kf__cta {
    margin-top: 28px;
  }
  .kf__cta-btn {
    max-width: 320px;
    margin: 0 auto;
  }
}
`;
