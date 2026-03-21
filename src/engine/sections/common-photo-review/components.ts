import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { PhotoReviewItem } from "./types";
export function escapeHtml(v: string = ""): string { return v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
export function renderHeader(p: { eyebrow?: string; headline: string; subheadline?: string; totalCount?: number }): string {
  return `<header class="ph__header">${p.eyebrow ? `<p class="ph__eyebrow">${escapeHtml(p.eyebrow)}</p>` : ""}<h2 class="ph__headline">${escapeHtml(p.headline)}</h2>${p.subheadline ? `<p class="ph__sub">${escapeHtml(p.subheadline)}</p>` : ""}${p.totalCount ? `<p class="ph__count">${p.totalCount.toLocaleString()}건의 포토리뷰</p>` : ""}</header>`;
}
export function renderPhotoCard(item: PhotoReviewItem): string {
  return `<article class="ph__card"><div class="ph__card-img-wrap"><img class="ph__card-img" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.author || "")}" loading="lazy" /></div><div class="ph__card-body">${item.rating ? `<span class="ph__stars">${"★".repeat(Math.min(5, item.rating))}${"☆".repeat(5 - Math.min(5, item.rating))}</span>` : ""}${item.quote ? `<p class="ph__quote">"${escapeHtml(item.quote)}"</p>` : ""}${item.author ? `<span class="ph__author">${escapeHtml(item.author)}</span>` : ""}</div></article>`;
}
export function renderFeaturedPhoto(item: PhotoReviewItem): string {
  return `<article class="ph__featured"><div class="ph__featured-img-wrap"><img class="ph__featured-img" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.author || "")}" loading="lazy" /></div><div class="ph__featured-body">${item.rating ? `<span class="ph__stars">${"★".repeat(Math.min(5, item.rating))}</span>` : ""}${item.quote ? `<p class="ph__featured-quote">"${escapeHtml(item.quote)}"</p>` : ""}${item.author ? `<span class="ph__author">${escapeHtml(item.author)}</span>` : ""}</div></article>`;
}
export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "ghost" });
}
