import { renderAccordionItem, renderCardItem, renderCta, renderInlineItem, renderSectionHeader } from "./components";
import type { FaqLayoutId, FaqRenderContext } from "./types";

const LC: Record<FaqLayoutId, string> = { "FAQ-A": "fq--a", "FAQ-B": "fq--b", "FAQ-C": "fq--c" };

function shell(p: { sectionId: string; layoutId: FaqLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="fq ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--fq-brand:${p.brandColor};"><div class="fq__inner">${p.body}</div></section>`;
}

export function renderTemplateA({ input }: FaqRenderContext): string {
  return shell({ ...input, body: `${renderSectionHeader(input)}<div class="fq__list">${input.items.map((item, i) => renderAccordionItem(item, i)).join("")}</div>${renderCta(input.cta)}` });
}

export function renderTemplateB({ input }: FaqRenderContext): string {
  return shell({ ...input, body: `${renderSectionHeader(input)}<div class="fq__list">${input.items.map((item) => renderInlineItem(item)).join("")}</div>${renderCta(input.cta)}` });
}

export function renderTemplateC({ input }: FaqRenderContext): string {
  return shell({ ...input, body: `${renderSectionHeader(input)}<div class="fq__grid">${input.items.map((item) => renderCardItem(item)).join("")}</div>${renderCta(input.cta)}` });
}
