import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { AwardItem, MediaLogo } from "./types";
export function escapeHtml(v: string = ""): string { return v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }

export function renderHeader(p: { eyebrow?: string; headline: string; subheadline?: string }): string {
  return `<header class="tr__header">${p.eyebrow ? `<p class="tr__eyebrow">${escapeHtml(p.eyebrow)}</p>` : ""}<h2 class="tr__headline">${escapeHtml(p.headline)}</h2>${p.subheadline ? `<p class="tr__sub">${escapeHtml(p.subheadline)}</p>` : ""}</header>`;
}
export function renderAwardBadge(item: AwardItem): string {
  return `<article class="tr__badge">${item.icon ? `<span class="tr__badge-icon">${escapeHtml(item.icon)}</span>` : ""}${item.imageUrl ? `<img class="tr__badge-img" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" loading="lazy" />` : ""}<span class="tr__badge-name">${escapeHtml(item.name)}</span>${item.description ? `<span class="tr__badge-desc">${escapeHtml(item.description)}</span>` : ""}</article>`;
}
export function renderFeaturedAward(item: AwardItem): string {
  return `<div class="tr__featured">${item.icon ? `<span class="tr__featured-icon">${escapeHtml(item.icon)}</span>` : ""}<h3 class="tr__featured-name">${escapeHtml(item.name)}</h3>${item.description ? `<p class="tr__featured-desc">${escapeHtml(item.description)}</p>` : ""}</div>`;
}
export function renderMediaLogo(logo: MediaLogo): string {
  return `<div class="tr__media">${logo.imageUrl ? `<img class="tr__media-logo" src="${escapeHtml(logo.imageUrl)}" alt="${escapeHtml(logo.name)}" loading="lazy" />` : `<span class="tr__media-name">${escapeHtml(logo.name)}</span>`}${logo.quote ? `<span class="tr__media-quote">"${escapeHtml(logo.quote)}"</span>` : ""}</div>`;
}
export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "ghost" });
}
