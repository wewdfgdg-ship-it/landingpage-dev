export const faqStyles = `
/* ═══ T7 FAQ — 토큰 기반 ═══ */
.fq {
  position: relative;
  padding: var(--s-section-pad-y) var(--s-section-pad-x) var(--s-space-8);
  background: var(--s-bg);
  color: var(--s-text);
}

.fq__inner {
  max-width: 720px;
  margin: 0 auto;
}

.fq__header {
  text-align: center;
  margin-bottom: var(--s-space-4);
}

.fq__eyebrow {
  margin: 0 0 var(--s-space-1);
  font-size: var(--s-text-xs);
  font-weight: var(--s-weight-bold);
  letter-spacing: var(--s-tracking-wide);
  text-transform: uppercase;
  color: var(--s-brand);
}

.fq__headline {
  margin: 0;
  font-size: var(--s-text-2xl);
  font-weight: var(--s-weight-black);
  line-height: var(--s-leading-tight);
  letter-spacing: var(--s-tracking-tight);
  word-break: keep-all;
  color: var(--s-text);
}

.fq__sub {
  max-width: 420px;
  margin: var(--s-space-2) auto 0;
  font-size: var(--s-text-base);
  line-height: var(--s-leading-relaxed);
  color: var(--s-text-sub);
}

.fq__list { display: grid; gap: 0; }

/* Accordion */
.fq__accordion { border-bottom: 1px solid var(--s-border); }
.fq__accordion:first-child { border-top: 1px solid var(--s-border); }

.fq__question {
  padding: var(--s-space-3) 0;
  font-size: var(--s-text-lg);
  font-weight: var(--s-weight-bold);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--s-text);
}

.fq__question::after {
  content: '+';
  font-size: var(--s-text-xl);
  color: var(--s-brand);
  transition: transform var(--s-ease);
  flex-shrink: 0;
  margin-left: var(--s-space-2);
}

.fq__accordion[open] .fq__question::after { content: '−'; }

.fq__answer { padding: 0 0 var(--s-space-3); }

.fq__answer p {
  font-size: var(--s-text-sm);
  line-height: var(--s-leading-relaxed);
  color: var(--s-text-sub);
}

/* Inline */
.fq__inline {
  padding: var(--s-space-3) 0;
  border-bottom: 1px solid var(--s-border);
}
.fq__inline:first-child { border-top: 1px solid var(--s-border); }

.fq__q-text {
  margin: 0;
  font-size: var(--s-text-lg);
  font-weight: var(--s-weight-bold);
  color: var(--s-text);
}

.fq__a-text {
  margin: var(--s-space-1) 0 0;
  font-size: var(--s-text-sm);
  line-height: var(--s-leading-relaxed);
  color: var(--s-text-sub);
}

/* Cards */
.fq__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--s-space-2);
}

.fq__card {
  padding: var(--s-space-3);
  border: 1px solid var(--s-card-border);
  border-radius: var(--s-radius-lg);
  background: var(--s-card-bg);
  box-shadow: var(--s-card-shadow);
  transition: transform var(--s-ease);
}

.fq__card:hover { transform: translateY(-4px); }
.fq__card .fq__q-text { font-size: var(--s-text-base); }
.fq__card .fq__a-text { font-size: var(--s-text-sm); }

/* CTA */
.fq__cta { margin-top: var(--s-space-3); }

.fq__cta-btn {
  display: block;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: var(--s-space-3) var(--s-section-pad-x);
  border: 0;
  border-radius: var(--s-radius-lg);
  background: var(--s-brand);
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-size: var(--s-text-base);
  font-weight: var(--s-weight-bold);
  box-shadow: 0 12px 30px color-mix(in srgb, var(--s-brand) 26%, transparent);
  transition: transform var(--s-ease), box-shadow var(--s-ease);
}

.fq__cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px color-mix(in srgb, var(--s-brand) 40%, transparent);
}

@media (max-width: 480px) {
  .fq__grid { grid-template-columns: 1fr; }
}
`;
