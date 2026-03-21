import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { BundleItem } from "./types";

export function escapeHtml(value: string = ""): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function renderHeader(params: { eyebrow?: string; headline: string; subheadline?: string }): string {
  return `<header class="bn__header">${params.eyebrow ? `<p class="bn__eyebrow">${escapeHtml(params.eyebrow)}</p>` : ""}<h2 class="bn__headline">${escapeHtml(params.headline)}</h2>${params.subheadline ? `<p class="bn__sub">${escapeHtml(params.subheadline)}</p>` : ""}</header>`;
}

export function renderItemCard(item: BundleItem): string {
  return `<article class="bn__item">${item.imageUrl ? `<div class="bn__item-img-wrap"><img class="bn__item-img" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" loading="lazy" /></div>` : `<div class="bn__item-placeholder"></div>`}${item.badge ? `<span class="bn__badge">${escapeHtml(item.badge)}</span>` : ""}<h3 class="bn__item-name">${escapeHtml(item.name)}</h3>${item.quantity ? `<span class="bn__item-qty">x${item.quantity}</span>` : ""}${item.value ? `<span class="bn__item-value">${escapeHtml(item.value)}</span>` : ""}</article>`;
}

export function renderMainItem(item: BundleItem): string {
  return `<article class="bn__main">${item.imageUrl ? `<div class="bn__main-img-wrap"><img class="bn__main-img" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" loading="lazy" /></div>` : `<div class="bn__main-placeholder"></div>`}${item.badge ? `<span class="bn__badge">${escapeHtml(item.badge)}</span>` : ""}<h3 class="bn__main-name">${escapeHtml(item.name)}</h3></article>`;
}

export function renderPriceBlock(total?: string, sale?: string): string {
  if (!sale && !total) return "";
  return `<div class="bn__price">${total ? `<span class="bn__price-total">${escapeHtml(total)}</span>` : ""}${sale ? `<span class="bn__price-sale">${escapeHtml(sale)}</span>` : ""}</div>`;
}

export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "primary" });
}

export function renderMicro(text?: string): string {
  if (!text) return "";
  return `<p class="bn__micro">${escapeHtml(text)}</p>`;
}
