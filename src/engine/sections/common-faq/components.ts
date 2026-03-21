import type { FaqItem } from "./types";

export function escapeHtml(value: string = ""): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function renderSectionHeader(params: { eyebrow?: string; headline: string; subheadline?: string }): string {
  return `
    <header class="fq__header">
      ${params.eyebrow ? `<p class="fq__eyebrow">${escapeHtml(params.eyebrow)}</p>` : ""}
      <h2 class="fq__headline">${escapeHtml(params.headline)}</h2>
      ${params.subheadline ? `<p class="fq__sub">${escapeHtml(params.subheadline)}</p>` : ""}
    </header>`;
}

export function renderAccordionItem(item: FaqItem, index: number): string {
  const id = item.id || `faq-${index}`;
  return `
    <details class="fq__accordion" id="${escapeHtml(id)}">
      <summary class="fq__question">${escapeHtml(item.question)}</summary>
      <div class="fq__answer"><p>${escapeHtml(item.answer)}</p></div>
    </details>`;
}

export function renderInlineItem(item: FaqItem): string {
  return `
    <div class="fq__inline">
      <h3 class="fq__q-text">Q. ${escapeHtml(item.question)}</h3>
      <p class="fq__a-text">A. ${escapeHtml(item.answer)}</p>
    </div>`;
}

export function renderCardItem(item: FaqItem): string {
  return `
    <article class="fq__card">
      <h3 class="fq__q-text">Q. ${escapeHtml(item.question)}</h3>
      <p class="fq__a-text">${escapeHtml(item.answer)}</p>
    </article>`;
}

export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return `<div class="fq__cta"><a class="fq__cta-btn" href="${escapeHtml(cta.href || "#")}">${escapeHtml(cta.text)}</a></div>`;
}
