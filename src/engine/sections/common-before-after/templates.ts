import { escapeHtml, renderCta, renderHeader, renderImage, renderStat } from "./components";
import type { BeforeAfterLayoutId, BeforeAfterRenderContext } from "./types";
const LC: Record<BeforeAfterLayoutId, string> = { "BA-A": "ba--a", "BA-B": "ba--b", "BA-C": "ba--c" };
function shell(p: { sectionId: string; layoutId: BeforeAfterLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="ba ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--ba-brand:${p.brandColor};"><div class="ba__inner">${p.body}</div></section>`;
}

export function renderTemplateA({ input }: BeforeAfterRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}<div class="ba__compare">${renderImage(input.beforeImageUrl, input.beforeLabel)}<div class="ba__arrow">→</div>${renderImage(input.afterImageUrl, input.afterLabel)}</div>${input.body ? `<p class="ba__body">${escapeHtml(input.body)}</p>` : ""}${renderCta(input.cta)}` });
}

export function renderTemplateB({ input }: BeforeAfterRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}<div class="ba__slider">${renderImage(input.beforeImageUrl, input.beforeLabel)}${renderImage(input.afterImageUrl, input.afterLabel)}<div class="ba__slider-handle"></div></div>${input.body ? `<p class="ba__body">${escapeHtml(input.body)}</p>` : ""}${renderCta(input.cta)}` });
}

export function renderTemplateC({ input }: BeforeAfterRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}<div class="ba__stack">${renderImage(input.beforeImageUrl, input.beforeLabel)}${input.body ? `<p class="ba__body">${escapeHtml(input.body)}</p>` : ""}${renderImage(input.afterImageUrl, input.afterLabel)}${renderStat(input.stat)}</div>${input.caption ? `<p class="ba__caption">${escapeHtml(input.caption)}</p>` : ""}${renderCta(input.cta)}` });
}
