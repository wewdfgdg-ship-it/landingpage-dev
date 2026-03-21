import { escapeHtml, renderCta, renderHeader, renderTableRow } from "./components";
import type { ComparisonLayoutId, ComparisonRenderContext } from "./types";
const LC: Record<ComparisonLayoutId, string> = { "CM-A": "cm--a", "CM-B": "cm--b" };
function shell(p: { sectionId: string; layoutId: ComparisonLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="cm ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--cm-brand:${p.brandColor};"><div class="cm__inner">${p.body}</div></section>`;
}
export function renderTemplateA({ input }: ComparisonRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}<table class="cm__table"><thead><tr><th></th><th class="cm__th--ours">${escapeHtml(input.ourName)}</th><th class="cm__th--theirs">${escapeHtml(input.theirName)}</th></tr></thead><tbody>${input.rows.map(renderTableRow).join("")}</tbody></table>${renderCta(input.cta)}` });
}
export function renderTemplateB({ input }: ComparisonRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}<div class="cm__cards"><article class="cm__card cm__card--ours"><h3 class="cm__card-name">★ ${escapeHtml(input.ourName)}</h3><ul class="cm__card-list">${input.rows.map((r) => `<li class="cm__card-item cm__card-item--yes">${escapeHtml(r.label)}: ${escapeHtml(r.ours)}</li>`).join("")}</ul></article><article class="cm__card cm__card--theirs"><h3 class="cm__card-name">${escapeHtml(input.theirName)}</h3><ul class="cm__card-list">${input.rows.map((r) => `<li class="cm__card-item">${escapeHtml(r.label)}: ${escapeHtml(r.theirs || "-")}</li>`).join("")}</ul></article></div>${renderCta(input.cta)}` });
}
