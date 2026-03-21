import type { CtaBenefit } from "./types";

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
  badge?: string;
}): string {
  const { eyebrow, headline, subheadline, badge } = params;
  return `
    <header class="ct__header">
      ${badge ? `<span class="ct__badge">${escapeHtml(badge)}</span>` : ""}
      ${eyebrow ? `<p class="ct__eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
      <h2 class="ct__headline">${escapeHtml(headline)}</h2>
      ${subheadline ? `<p class="ct__sub">${escapeHtml(subheadline)}</p>` : ""}
    </header>
  `;
}

export function renderBenefitList(benefits: CtaBenefit[]): string {
  if (!benefits.length) return "";
  return `
    <ul class="ct__benefits">
      ${benefits.map((b) => `
        <li class="ct__benefit">
          ${b.icon ? `<span class="ct__benefit-icon" aria-hidden="true">${escapeHtml(b.icon)}</span>` : `<span class="ct__benefit-check">✓</span>`}
          <span class="ct__benefit-text">${escapeHtml(b.text)}</span>
        </li>
      `).join("")}
    </ul>
  `;
}

export function renderCtaButton(cta: { text: string; href: string }): string {
  return `
    <div class="ct__action">
      <a class="ct__btn" href="${escapeHtml(cta.href)}">${escapeHtml(cta.text)}</a>
    </div>
  `;
}

export function renderSecondaryAction(action?: { text: string; href: string }): string {
  if (!action) return "";
  return `<a class="ct__btn-secondary" href="${escapeHtml(action.href)}">${escapeHtml(action.text)}</a>`;
}

export function renderMicroCopy(text?: string): string {
  if (!text) return "";
  return `<p class="ct__micro">${escapeHtml(text)}</p>`;
}
