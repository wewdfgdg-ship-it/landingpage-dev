import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { ReviewItem } from "./types";

export function escapeHtml(value: string = ""): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderStars(rating?: number): string {
  if (!rating) return "";
  const full = Math.round(Math.min(5, Math.max(0, rating)));
  return `<div class="rv__stars" aria-label="별점 ${rating}점">${"★".repeat(full)}${"☆".repeat(5 - full)}</div>`;
}

export function renderRatingSummary(avg?: number, total?: number): string {
  if (!avg) return "";
  return `
    <div class="rv__summary">
      <span class="rv__summary-num">${avg}</span>
      ${renderStars(avg)}
      ${total ? `<span class="rv__summary-count">${total.toLocaleString()}건의 리뷰</span>` : ""}
    </div>
  `;
}

export function renderSectionHeader(params: {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
}): string {
  const { eyebrow, headline, subheadline } = params;
  return `
    <header class="rv__header">
      ${eyebrow ? `<p class="rv__eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
      <h2 class="rv__headline">${escapeHtml(headline)}</h2>
      ${subheadline ? `<p class="rv__sub">${escapeHtml(subheadline)}</p>` : ""}
    </header>
  `;
}

export function renderReviewCard(item: ReviewItem, options?: { featured?: boolean }): string {
  const cls = options?.featured ? "rv__card rv__card--featured" : "rv__card";
  return `
    <article class="${cls}">
      ${renderStars(item.rating)}
      <blockquote class="rv__quote">"${escapeHtml(item.quote)}"</blockquote>
      <div class="rv__author">
        ${item.imageUrl ? `<img class="rv__avatar" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.author)}" loading="lazy" />` : ""}
        <div class="rv__author-info">
          <span class="rv__author-name">${escapeHtml(item.author)}</span>
          ${item.meta ? `<span class="rv__author-meta">${escapeHtml(item.meta)}</span>` : ""}
        </div>
      </div>
      ${item.tags?.length ? `<div class="rv__tags">${item.tags.map((t) => `<span class="rv__tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
    </article>
  `;
}

export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "ghost" });
}
