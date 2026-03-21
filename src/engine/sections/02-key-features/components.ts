import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type {
  KeyFeatureItem,
  KeyFeaturesCTA,
  RenderFeatureCardOptions,
} from "./types";

export function escapeHtml(value: string = ""): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderSectionHeader(params: {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
}): string {
  const { eyebrow, headline, subheadline } = params;

  return `
    <header class="kf__header">
      ${eyebrow ? `<p class="kf__eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
      <h2 class="kf__headline">${escapeHtml(headline)}</h2>
      ${subheadline ? `<p class="kf__sub">${escapeHtml(subheadline)}</p>` : ""}
    </header>
  `;
}

export function renderFeatureImage(item: KeyFeatureItem): string {
  if (!item.imageUrl) return "";

  return `
    <div class="kf__card-media">
      <img
        class="kf__card-img"
        src="${escapeHtml(item.imageUrl)}"
        alt="${escapeHtml(item.title)}"
        loading="lazy"
      />
    </div>
  `;
}

export function renderFeatureCard(
  item: KeyFeatureItem,
  options: RenderFeatureCardOptions = {}
): string {
  const { featured = false } = options;

  return `
    <article class="kf__card${featured ? " kf__card--featured" : ""}">
      ${item.badge ? `<span class="kf__badge">${escapeHtml(item.badge)}</span>` : ""}
      ${item.icon ? `<div class="kf__icon" aria-hidden="true">${escapeHtml(item.icon)}</div>` : ""}
      ${renderFeatureImage(item)}
      <h3 class="kf__card-title">${escapeHtml(item.title)}</h3>
      ${
        item.description
          ? `<p class="kf__card-desc">${escapeHtml(item.description)}</p>`
          : ""
      }
    </article>
  `;
}

export function renderFeatureGrid(
  items: KeyFeatureItem[],
  options?: RenderFeatureCardOptions
): string {
  return `
    <div class="kf__grid">
      ${items.map((item) => renderFeatureCard(item, options)).join("")}
    </div>
  `;
}

export function renderFeatureRows(items: KeyFeatureItem[]): string {
  return `
    <div class="kf__list">
      ${items
        .map(
          (item, index) => `
            <article class="kf__list-item">
              <div class="kf__list-num">${String(index + 1).padStart(2, "0")}</div>
              <div class="kf__list-body">
                <div class="kf__list-top">
                  ${item.badge ? `<span class="kf__badge">${escapeHtml(item.badge)}</span>` : ""}
                  <h3 class="kf__card-title">${escapeHtml(item.title)}</h3>
                </div>
                ${
                  item.description
                    ? `<p class="kf__card-desc">${escapeHtml(item.description)}</p>`
                    : ""
                }
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "ghost" });
}
