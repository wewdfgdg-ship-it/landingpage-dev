import { renderGlobalCtaGroup } from "../common-tokens/cta";
export function escapeHtml(v: string = ""): string { return v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }

export function renderHeader(p: { eyebrow?: string; headline: string }): string {
  return `<header class="ba__header">${p.eyebrow ? `<p class="ba__eyebrow">${escapeHtml(p.eyebrow)}</p>` : ""}<h2 class="ba__headline">${escapeHtml(p.headline)}</h2></header>`;
}

export function renderImage(url?: string, label?: string): string {
  if (!url) return `<div class="ba__placeholder"><span>${escapeHtml(label || "이미지")}</span></div>`;
  return `<div class="ba__img-wrap"><img class="ba__img" src="${escapeHtml(url)}" alt="${escapeHtml(label || "")}" loading="lazy" /><span class="ba__label">${escapeHtml(label || "")}</span></div>`;
}

export function renderStat(stat?: { number: string; unit?: string; label?: string }): string {
  if (!stat) return "";
  return `<div class="ba__stat"><span class="ba__stat-num">${escapeHtml(stat.number)}</span>${stat.unit ? `<span class="ba__stat-unit">${escapeHtml(stat.unit)}</span>` : ""}${stat.label ? `<span class="ba__stat-label">${escapeHtml(stat.label)}</span>` : ""}</div>`;
}

export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "ghost" });
}
