import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { CompareRow } from "./types";
export function escapeHtml(v: string = ""): string { return v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
export function renderHeader(p: { eyebrow?: string; headline: string; subheadline?: string }): string {
  return `<header class="cm__header">${p.eyebrow ? `<p class="cm__eyebrow">${escapeHtml(p.eyebrow)}</p>` : ""}<h2 class="cm__headline">${escapeHtml(p.headline)}</h2>${p.subheadline ? `<p class="cm__sub">${escapeHtml(p.subheadline)}</p>` : ""}</header>`;
}
export function renderTableRow(row: CompareRow): string {
  return `<tr class="cm__row"><td class="cm__cell cm__cell--label">${escapeHtml(row.label)}</td><td class="cm__cell cm__cell--ours">${escapeHtml(row.ours)}</td>${row.theirs !== undefined ? `<td class="cm__cell cm__cell--theirs">${escapeHtml(row.theirs)}</td>` : ""}</tr>`;
}
export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "ghost" });
}
