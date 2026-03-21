import type { Annotation } from "./types";

export function escapeHtml(value: string = ""): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function renderHeader(params: { eyebrow?: string; headline: string }): string {
  return `
    <header class="fd__header">
      ${params.eyebrow ? `<p class="fd__eyebrow">${escapeHtml(params.eyebrow)}</p>` : ""}
      <h2 class="fd__headline">${escapeHtml(params.headline)}</h2>
    </header>`;
}

export function renderBody(body?: string, bullets?: string[]): string {
  const parts: string[] = [];
  if (body) parts.push(`<p class="fd__body">${escapeHtml(body)}</p>`);
  if (bullets?.length) parts.push(`<ul class="fd__bullets">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`);
  if (!parts.length) return "";
  return `<div class="fd__text">${parts.join("")}</div>`;
}

export function renderImage(url?: string, alt?: string): string {
  if (!url) return `<div class="fd__img-placeholder"><span>이미지</span></div>`;
  return `<div class="fd__img-wrap"><img class="fd__img" src="${escapeHtml(url)}" alt="${escapeHtml(alt || "")}" loading="lazy" /></div>`;
}

export function renderAnnotations(annotations: Annotation[]): string {
  if (!annotations.length) return "";
  return `<div class="fd__annotations">${annotations.map((a, i) => `<span class="fd__ann" style="--fd-ann-i:${i}">${escapeHtml(a.text)}</span>`).join("")}</div>`;
}

export function renderStat(stat?: { number: string; unit?: string; label?: string }): string {
  if (!stat) return "";
  return `
    <div class="fd__stat">
      <span class="fd__stat-num">${escapeHtml(stat.number)}</span>
      ${stat.unit ? `<span class="fd__stat-unit">${escapeHtml(stat.unit)}</span>` : ""}
      ${stat.label ? `<span class="fd__stat-label">${escapeHtml(stat.label)}</span>` : ""}
    </div>`;
}

export function renderCaption(caption?: string, source?: string): string {
  const parts: string[] = [];
  if (caption) parts.push(`<p class="fd__caption">${escapeHtml(caption)}</p>`);
  if (source) parts.push(`<p class="fd__source">${escapeHtml(source)}</p>`);
  if (!parts.length) return "";
  return `<div class="fd__footer">${parts.join("")}</div>`;
}

export function renderCta(cta?: { text: string; href: string }): string {
  if (!cta?.text) return "";
  return `<div class="fd__cta"><a class="fd__cta-btn" href="${escapeHtml(cta.href)}">${escapeHtml(cta.text)}</a></div>`;
}
