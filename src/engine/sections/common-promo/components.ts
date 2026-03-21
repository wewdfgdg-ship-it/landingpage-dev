import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { PromoBenefit } from "./types";
export function escapeHtml(v: string = ""): string { return v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
export function renderHeader(p: { eyebrow?: string; headline: string; subheadline?: string }): string {
  return `<header class="pl__header">${p.eyebrow ? `<p class="pl__eyebrow">${escapeHtml(p.eyebrow)}</p>` : ""}<h2 class="pl__headline">${escapeHtml(p.headline)}</h2>${p.subheadline ? `<p class="pl__sub">${escapeHtml(p.subheadline)}</p>` : ""}</header>`;
}
export function renderUrgencyBar(deadline?: string): string {
  if (!deadline) return "";
  return `<div class="pl__urgency">⏰ ${escapeHtml(deadline)}</div>`;
}
export function renderCountdown(): string {
  return `<div class="pl__countdown"><div class="pl__time-box">00</div><span class="pl__time-sep">:</span><div class="pl__time-box">00</div><span class="pl__time-sep">:</span><div class="pl__time-box">00</div></div>`;
}
export function renderStockBar(percent?: number): string {
  if (percent === undefined) return "";
  const p = Math.min(100, Math.max(0, percent));
  return `<div class="pl__stock"><div class="pl__stock-bar"><div class="pl__stock-fill" style="width:${p}%"></div></div><span class="pl__stock-text">${p}% 소진</span></div>`;
}
export function renderBenefits(benefits: PromoBenefit[]): string {
  if (!benefits.length) return "";
  return `<div class="pl__benefits">${benefits.map((b) => `<div class="pl__benefit">${b.icon ? `<span class="pl__benefit-icon">${escapeHtml(b.icon)}</span>` : ""}<span class="pl__benefit-text">${escapeHtml(b.text)}</span></div>`).join("")}</div>`;
}
export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "primary" });
}
export function renderMicro(text?: string): string {
  if (!text) return "";
  return `<p class="pl__micro">${escapeHtml(text)}</p>`;
}
