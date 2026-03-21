export const featureDetailStyles = `
/* ═══ T2 Feature Detail — 토큰 기반 ═══ */
.fd {
  position: relative;
  padding: var(--s-section-pad-y) var(--s-section-pad-x);
  background: var(--s-bg);
  color: var(--s-text);
}

.fd__inner {
  max-width: var(--s-section-max);
  margin: 0 auto;
}

.fd__header { margin-bottom: var(--s-space-2); }

.fd__eyebrow {
  margin: 0 0 var(--s-space-1);
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
  letter-spacing: var(--s-tracking-wide);
  text-transform: uppercase;
  color: var(--s-brand);
}

.fd__headline {
  margin: 0;
  font-size: var(--s-text-2xl);
  font-weight: var(--s-weight-black);
  line-height: var(--s-leading-tight);
  letter-spacing: var(--s-tracking-tight);
  word-break: keep-all;
  color: var(--s-text);
}

.fd__body {
  font-size: var(--s-text-base);
  line-height: var(--s-leading-relaxed);
  color: var(--s-text-sub);
  margin-bottom: var(--s-space-2);
}

.fd__bullets {
  padding-left: var(--s-space-2);
  margin: 0 0 var(--s-space-2);
  font-size: var(--s-text-sm);
  line-height: var(--s-leading-relaxed);
  color: var(--s-text-muted);
}

.fd__bullets li { margin-bottom: 4px; }

/* Split */
.fd__split { display: grid; gap: var(--s-space-3); }
.fd__split-text { min-width: 0; }
.fd__split-media { position: relative; min-width: 0; }
.fd--img-right .fd__split { direction: ltr; }
.fd--img-left .fd__split { direction: rtl; }
.fd--img-left .fd__split > * { direction: ltr; }

.fd__img-wrap {
  border-radius: var(--s-radius-lg);
  overflow: hidden;
  background: var(--s-bg-surface);
}

.fd__img { display: block; width: 100%; height: auto; object-fit: cover; }

.fd__img-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  border: 2px dashed var(--s-border);
  border-radius: var(--s-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--s-text-muted);
  font-size: var(--s-text-sm);
}

.fd__annotations {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
}

.fd__ann {
  position: absolute;
  
  border-radius: var(--s-radius-sm);
  background: var(--s-card-bg);
  backdrop-filter: blur(8px);
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
  color: var(--s-brand);
  box-shadow: var(--s-shadow-sm);
  top: calc(15% + var(--fd-ann-i) * 25%);
  left: calc(5% + var(--fd-ann-i) * 18%);
}

.fd__stat { text-align: center; margin: var(--s-space-2) 0; }

.fd__stat-num {
  font-size: var(--s-text-4xl);
  font-weight: var(--s-weight-black);
  color: var(--s-brand);
  letter-spacing: -3px;
  line-height: 1;
}

.fd__stat-unit {
  font-size: var(--s-text-lg);
  font-weight: var(--s-weight-regular);
  color: color-mix(in srgb, var(--s-brand) 60%, var(--s-text));
  margin-left: 4px;
}

.fd__stat-label {
  display: block;
  font-size: var(--s-text-sm);
  color: var(--s-text-muted);
  margin-top: 4px;
}

.fd__visual {
  position: relative;
  margin-bottom: var(--s-space-3);
  border-radius: var(--s-radius-lg);
  overflow: hidden;
}

.fd__overlay-text { padding: 0 4px; }
.fd__graphic { position: relative; margin: var(--s-space-3) 0; border-radius: var(--s-radius-lg); overflow: hidden; }

.fd__footer { margin-top: var(--s-space-2); }
.fd__caption { font-size: var(--s-text-sm); color: var(--s-text-muted); }
.fd__source { font-size: var(--s-text-xs); color: var(--s-text-muted); margin-top: 4px; }

.fd__cta { margin-top: var(--s-space-3); }

.fd__cta-btn {
  display: inline-block;
  padding: var(--s-space-2) var(--s-space-4);
  border: 0;
  border-radius: var(--s-radius-md);
  background: var(--s-brand);
  color: #fff;
  text-decoration: none;
  font-size: var(--s-text-base);
  font-weight: var(--s-weight-bold);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--s-brand) 25%, transparent);
  transition: transform var(--s-ease);
}

.fd__cta-btn:hover { transform: translateY(-2px); }

@media (min-width: 768px) {
  .fd--a .fd__split {
    grid-template-columns: 1fr 1fr;
    gap: var(--s-space-5);
    align-items: center;
  }
}
`;
