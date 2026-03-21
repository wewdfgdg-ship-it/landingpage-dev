/**
 * 공통 CTA 컴포넌트 — 모든 섹션이 이것만 사용
 *
 * 3단계: primary / secondary / ghost
 * mood에 따라 색상만 바뀌고, 구조/크기는 고정
 */

export function escapeHtml(v: string = ""): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export type CtaVariant = "primary" | "secondary" | "ghost";

export type CtaProps = {
  text: string;
  href?: string;
  variant?: CtaVariant;
};

export function renderGlobalCta(props: CtaProps): string {
  if (!props.text?.trim()) return "";
  const variant = props.variant || "primary";
  const href = props.href?.trim() || "#";
  return `<a class="s-cta s-cta--${variant}" href="${escapeHtml(href)}">${escapeHtml(props.text)}</a>`;
}

export function renderGlobalCtaGroup(primary?: CtaProps, secondary?: CtaProps, micro?: string): string {
  const parts: string[] = [];
  if (primary?.text?.trim()) parts.push(renderGlobalCta({ ...primary, variant: "primary" }));
  if (secondary?.text?.trim()) parts.push(renderGlobalCta({ ...secondary, variant: "secondary" }));
  if (micro?.trim()) parts.push(`<p class="s-cta-micro">${escapeHtml(micro)}</p>`);
  if (!parts.length) return "";
  return `<div class="s-cta-group">${parts.join("")}</div>`;
}

/** CTA CSS — tokens.ts에 합쳐서 쓰거나 별도 import */
export const globalCtaCSS = `
/* ═══ Global CTA System ═══ */
.s-cta-group {
  margin-top: var(--s-space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-space-1);
  width: 100%;
}

.s-cta {
  display: block;
  width: 100%;
  max-width: 380px;
  padding: 18px var(--s-space-3);
  border-radius: var(--s-radius-lg);
  font-family: var(--s-font);
  font-size: 16px;
  font-weight: var(--s-weight-bold);
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: transform var(--s-ease), box-shadow var(--s-ease), background var(--s-ease);
}

/* ── Primary: 강한 전환 ── */
.s-cta--primary {
  background: var(--s-brand);
  color: #ffffff;
  border: none;
  box-shadow: 0 12px 32px color-mix(in srgb, var(--s-brand) 30%, transparent);
}

.s-cta--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 44px color-mix(in srgb, var(--s-brand) 45%, transparent);
}

/* ── Secondary: 보조 행동 ── */
.s-cta--secondary {
  background: transparent;
  color: var(--s-brand);
  border: 1.5px solid color-mix(in srgb, var(--s-brand) 25%, var(--s-border));
}

.s-cta--secondary:hover {
  background: color-mix(in srgb, var(--s-brand) 6%, transparent);
  transform: translateY(-1px);
}

/* ── Ghost: 최소 ── */
.s-cta--ghost {
  background: transparent;
  color: var(--s-text-muted);
  border: 1px solid var(--s-border);
  padding: 14px var(--s-space-3);
  font-size: var(--s-text-sm);
}

.s-cta--ghost:hover {
  color: var(--s-text-sub);
  border-color: var(--s-text-muted);
}

/* ── Micro copy ── */
.s-cta-micro {
  font-size: var(--s-text-xs);
  color: var(--s-text-muted);
  text-align: center;
  margin-top: 4px;
}

/* ── Dark/Navy mood override ── */
.mood--dark .s-cta--secondary,
.mood--navy .s-cta--secondary {
  border-color: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.7);
}

.mood--dark .s-cta--secondary:hover,
.mood--navy .s-cta--secondary:hover {
  background: rgba(255,255,255,0.05);
}

.mood--dark .s-cta--ghost,
.mood--navy .s-cta--ghost {
  border-color: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.35);
}

.mood--dark .s-cta--ghost:hover,
.mood--navy .s-cta--ghost:hover {
  color: rgba(255,255,255,0.5);
  border-color: rgba(255,255,255,0.2);
}

.mood--dark .s-cta-micro,
.mood--navy .s-cta-micro {
  color: rgba(255,255,255,0.25);
}
`;
