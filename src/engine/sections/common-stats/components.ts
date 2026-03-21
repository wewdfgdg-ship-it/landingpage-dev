import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { StatItem } from "./types";

export function escapeHtml(value: string = ""): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function renderSectionHeader(params: { eyebrow?: string; headline: string; subheadline?: string }): string {
  return `
    <header class="st__header">
      ${params.eyebrow ? `<p class="st__eyebrow">${escapeHtml(params.eyebrow)}</p>` : ""}
      <h2 class="st__headline">${escapeHtml(params.headline)}</h2>
      ${params.subheadline ? `<p class="st__sub">${escapeHtml(params.subheadline)}</p>` : ""}
    </header>`;
}

export function renderStatInline(item: StatItem): string {
  return `
    <div class="st__item">
      <span class="st__num">${escapeHtml(item.number)}</span>
      ${item.unit ? `<span class="st__unit">${escapeHtml(item.unit)}</span>` : ""}
      <span class="st__label">${escapeHtml(item.label)}</span>
    </div>`;
}

export function renderBigStat(item: StatItem): string {
  return `
    <div class="st__big">
      <span class="st__big-num">${escapeHtml(item.number)}</span>
      ${item.unit ? `<span class="st__big-unit">${escapeHtml(item.unit)}</span>` : ""}
      <span class="st__big-label">${escapeHtml(item.label)}</span>
      ${item.description ? `<p class="st__big-desc">${escapeHtml(item.description)}</p>` : ""}
    </div>`;
}

export function renderStatCard(item: StatItem): string {
  return `
    <article class="st__card">
      <span class="st__card-num">${escapeHtml(item.number)}</span>
      ${item.unit ? `<span class="st__card-unit">${escapeHtml(item.unit)}</span>` : ""}
      <h3 class="st__card-label">${escapeHtml(item.label)}</h3>
      ${item.description ? `<p class="st__card-desc">${escapeHtml(item.description)}</p>` : ""}
    </article>`;
}

export function renderSource(source?: string): string {
  if (!source) return "";
  return `<p class="st__source">${escapeHtml(source)}</p>`;
}

export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "ghost" });
}
