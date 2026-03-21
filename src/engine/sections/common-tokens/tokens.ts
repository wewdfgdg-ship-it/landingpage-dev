/**
 * 공통 디자인 토큰 v2.0
 * 모든 섹션 패밀리가 이 변수를 참조
 */

export const sectionTokenCSS = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

:root {
  /* ── Font ── */
  --s-font: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  --s-text-xs:   12px;
  --s-text-sm:   14px;
  --s-text-base: 16px;
  --s-text-lg:   20px;
  --s-text-xl:   26px;
  --s-text-2xl:  40px;
  --s-text-3xl:  48px;
  --s-text-4xl:  64px;
  --s-weight-light:   300;
  --s-weight-regular: 400;
  --s-weight-bold:    700;
  --s-weight-black:   900;
  --s-leading-tight:   1.14;
  --s-leading-snug:    1.3;
  --s-leading-normal:  1.5;
  --s-leading-relaxed: 1.7;
  --s-tracking-tight:  -0.04em;
  --s-tracking-normal: 0;
  --s-tracking-wide:   0.14em;

  /* ── Space (8px grid) ── */
  --s-space-1:  8px;
  --s-space-2:  16px;
  --s-space-3:  24px;
  --s-space-4:  32px;
  --s-space-5:  40px;
  --s-space-6:  48px;
  --s-space-8:  64px;
  --s-space-10: 80px;

  /* ── Section ── */
  --s-section-max:   520px;
  --s-section-pad-x: 24px;
  --s-section-pad-y: 80px;
  --s-section-min-h: 600px;
  --s-section-gap:   40px;

  /* ── Card ── */
  --s-card-pad:  32px;

  /* ── Radius ── */
  --s-radius-sm:   8px;
  --s-radius-md:   14px;
  --s-radius-lg:   20px;
  --s-radius-xl:   24px;
  --s-radius-full: 999px;

  /* ── Shadow ── */
  --s-shadow-sm: 0 4px 12px rgba(15,23,42,0.04);
  --s-shadow-md: 0 12px 36px rgba(15,23,42,0.06);
  --s-shadow-lg: 0 24px 56px rgba(15,23,42,0.1);

  /* ── Transition ── */
  --s-ease: 0.2s ease;

  /* ── Color (기본 = clean) ── */
  --s-brand:      #4A90D9;
  --s-bg:         #ffffff;
  --s-bg-surface: #f8f9fa;
  --s-text:       #111827;
  --s-text-sub:   rgba(15,23,42,0.68);
  --s-text-muted: rgba(15,23,42,0.4);
  --s-border:     rgba(15,23,42,0.06);
  --s-card-bg:    rgba(255,255,255,0.92);
  --s-card-border: rgba(15,23,42,0.06);
  --s-card-shadow: 0 12px 36px rgba(15,23,42,0.06);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--s-font); -webkit-font-smoothing: antialiased; color: var(--s-text); background: var(--s-bg); }

/* ═══ 섹션 공통 밀도 강제 ═══ */
.kf, .si, .rv, .ct, .fq, .st, .pc, .fd, .bn, .ls, .ba, .cm, .ph, .pl {
  min-height: var(--s-section-min-h);
  padding: var(--s-section-pad-y) var(--s-section-pad-x);
}

/* 콘텐츠 적은 섹션 — min-height 없이 padding만 */
.tr {
  min-height: auto;
  padding: var(--s-section-pad-y) var(--s-section-pad-x);
}

/* dark 섹션 연속 시 구분 */
.pl + .ct,
.ct + .pl {
  border-top: 1px solid rgba(255,255,255,0.08);
}

/* 카드 padding 강제 */
[class$="__card"] {
  padding: var(--s-card-pad);
}

/* 그리드 gap — 각 패밀리 styles.ts 값 존중, 토큰에서 강제 안 함 */

/* 헤더 여백 강화 */
[class$="__header"] {
  margin-bottom: var(--s-space-5);
}

/* headline 아래 여백 */
[class$="__headline"] {
  margin-bottom: var(--s-space-3);
}

/* sub 아래 여백 */
[class$="__sub"] {
  margin-bottom: var(--s-space-3);
}

/* ═══ MOOD: clean ═══ */
.mood--clean {
  --s-bg: #ffffff;
  --s-bg-surface: #f8f9fa;
  --s-text: #111827;
  --s-text-sub: rgba(15,23,42,0.68);
  --s-text-muted: rgba(15,23,42,0.4);
  --s-border: rgba(15,23,42,0.06);
  --s-card-bg: rgba(255,255,255,0.92);
  --s-card-border: rgba(15,23,42,0.06);
  --s-card-shadow: 0 12px 36px rgba(15,23,42,0.06);
  background: var(--s-bg);
  color: var(--s-text);
}

/* ═══ MOOD: soft ═══ */
.mood--soft {
  --s-bg: #fafafa;
  --s-bg-surface: #f0f0f0;
  --s-text: #111827;
  --s-text-sub: rgba(15,23,42,0.68);
  --s-text-muted: rgba(15,23,42,0.4);
  --s-border: rgba(15,23,42,0.06);
  --s-card-bg: rgba(255,255,255,0.95);
  --s-card-border: rgba(15,23,42,0.05);
  --s-card-shadow: 0 8px 24px rgba(15,23,42,0.05);
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  color: var(--s-text);
}

/* ═══ MOOD: dark (차분한 다크 — 카드 대비 강화) ═══ */
.mood--dark {
  --s-bg: #0f0b07;
  --s-bg-surface: #1a1510;
  --s-text: #ffffff;
  --s-text-sub: rgba(255,255,255,0.72);
  --s-text-muted: rgba(255,255,255,0.42);
  --s-border: rgba(255,255,255,0.10);
  --s-card-bg: rgba(255,255,255,0.08);
  --s-card-border: rgba(255,255,255,0.10);
  --s-card-shadow: 0 8px 32px rgba(0,0,0,0.25);
  background: linear-gradient(180deg, #17120d 0%, #0f0b07 100%);
  color: var(--s-text);
}

/* dark 카드 hover 강화 */
.mood--dark [class$="__card"]:hover {
  --s-card-bg: rgba(255,255,255,0.11);
  --s-card-shadow: 0 16px 48px rgba(0,0,0,0.35);
}

/* dark 구분선 가시성 */
.mood--dark [class$="__accordion"],
.mood--dark [class$="__inline"],
.mood--dark [class$="__row"],
.mood--dark [class$="__list-item"],
.mood--dark [class$="__step"] {
  border-color: rgba(255,255,255,0.12);
}

/* ═══ MOOD: navy (카드 대비 강화) ═══ */
.mood--navy {
  --s-bg: #0c1024;
  --s-bg-surface: #141830;
  --s-text: #ffffff;
  --s-text-sub: rgba(255,255,255,0.72);
  --s-text-muted: rgba(255,255,255,0.42);
  --s-border: rgba(255,255,255,0.10);
  --s-card-bg: rgba(255,255,255,0.08);
  --s-card-border: rgba(255,255,255,0.10);
  --s-card-shadow: 0 8px 32px rgba(0,0,0,0.3);
  background: #0c1024;
  color: var(--s-text);
}

/* navy 카드 hover 강화 */
.mood--navy [class$="__card"]:hover {
  --s-card-bg: rgba(255,255,255,0.11);
  --s-card-shadow: 0 16px 48px rgba(0,0,0,0.4);
}

/* navy 구분선 가시성 */
.mood--navy [class$="__accordion"],
.mood--navy [class$="__inline"],
.mood--navy [class$="__row"],
.mood--navy [class$="__list-item"],
.mood--navy [class$="__step"] {
  border-color: rgba(255,255,255,0.12);
}

/* ═══ MODIFIER: promo (dark 위에 얹는 강조) ═══ */
.mood--dark.is-promo,
.mood--navy.is-promo {
  background:
    radial-gradient(circle at 50% 60%, color-mix(in srgb, var(--s-brand) 18%, transparent), transparent 50%),
    linear-gradient(180deg, #17120d 0%, #0f0b07 100%);
}

/* ═══ Responsive ═══ */
@media (max-width: 480px) {
  :root {
    --s-text-2xl: 32px;
    --s-text-3xl: 38px;
    --s-text-4xl: 48px;
    --s-section-pad-y: 60px;
    --s-section-min-h: 480px;
    --s-section-gap: 32px;
    --s-card-pad: 24px;
  }
}
@media (min-width: 768px) {
  :root {
    --s-text-2xl: 48px;
    --s-section-max: 960px;
    --s-section-pad-x: 32px;
    --s-section-pad-y: 100px;
    --s-section-min-h: 680px;
    --s-section-gap: 48px;
    --s-card-pad: 36px;
  }
}
`;
