import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { SpecInfoItem, SpecInfoCTA } from "./types";

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
    <header class="si__header">
      ${eyebrow ? `<p class="si__eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
      <h2 class="si__headline">${escapeHtml(headline)}</h2>
      ${subheadline ? `<p class="si__sub">${escapeHtml(subheadline)}</p>` : ""}
    </header>
  `;
}

export function renderSpecRow(item: SpecInfoItem): string {
  return `
    <div class="si__row">
      <div class="si__row-label">
        ${item.icon ? `<span class="si__row-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>` : ""}
        ${escapeHtml(item.label)}
      </div>
      <div class="si__row-value">
        ${item.badge ? `<span class="si__badge">${escapeHtml(item.badge)}</span>` : ""}
        ${item.value ? escapeHtml(item.value) : ""}
        ${item.description ? `<span class="si__row-desc">${escapeHtml(item.description)}</span>` : ""}
        ${item.note ? `<span class="si__row-note">${escapeHtml(item.note)}</span>` : ""}
      </div>
    </div>
  `;
}

export function renderStepItem(item: SpecInfoItem, index: number, numbered: boolean): string {
  return `
    <article class="si__step">
      <div class="si__step-num">
        ${numbered ? String(index + 1).padStart(2, "0") : ""}
        ${!numbered && item.icon ? `<span class="si__step-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>` : ""}
      </div>
      <div class="si__step-body">
        ${item.badge ? `<span class="si__badge">${escapeHtml(item.badge)}</span>` : ""}
        <h3 class="si__step-title">${escapeHtml(item.label)}</h3>
        ${item.description ? `<p class="si__step-desc">${escapeHtml(item.description)}</p>` : ""}
        ${item.imageUrl ? `<div class="si__step-media"><img class="si__step-img" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.label)}" loading="lazy" /></div>` : ""}
        ${item.note ? `<p class="si__step-note">${escapeHtml(item.note)}</p>` : ""}
      </div>
    </article>
  `;
}

export function renderInfoCard(item: SpecInfoItem): string {
  return `
    <article class="si__card">
      ${item.icon ? `<div class="si__card-icon" aria-hidden="true">${escapeHtml(item.icon)}</div>` : ""}
      ${item.badge ? `<span class="si__badge">${escapeHtml(item.badge)}</span>` : ""}
      <h3 class="si__card-title">${escapeHtml(item.label)}</h3>
      ${item.value ? `<div class="si__card-value">${escapeHtml(item.value)}</div>` : ""}
      ${item.description ? `<p class="si__card-desc">${escapeHtml(item.description)}</p>` : ""}
    </article>
  `;
}

export function renderAnnotations(annotations: string[]): string {
  if (!annotations.length) return "";
  return `
    <div class="si__annotations">
      ${annotations.map((a, i) => `<span class="si__annotation" style="--si-ann-i:${i}">${escapeHtml(a)}</span>`).join("")}
    </div>
  `;
}

export function renderMetric(metric?: string, metricLabel?: string): string {
  if (!metric) return "";
  return `
    <div class="si__metric">
      <span class="si__metric-num">${escapeHtml(metric)}</span>
      ${metricLabel ? `<span class="si__metric-label">${escapeHtml(metricLabel)}</span>` : ""}
    </div>
  `;
}

export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "ghost" });
}

export function renderFootnote(footnote?: string): string {
  if (!footnote) return "";
  return `<p class="si__footnote">${escapeHtml(footnote)}</p>`;
}
