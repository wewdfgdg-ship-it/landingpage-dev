import { renderCta, renderImage, renderPlaceholder, renderTags, renderText } from "./components";
import type { LifestyleLayoutId, LifestyleRenderContext } from "./types";

const LC: Record<LifestyleLayoutId, string> = { "LS-A": "ls--a", "LS-B": "ls--b", "LS-C": "ls--c" };

function shell(p: { sectionId: string; layoutId: LifestyleLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="ls ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--ls-brand:${p.brandColor};"><div class="ls__inner">${p.body}</div></section>`;
}

/** LS-A: 풀블리드 + 하단 텍스트 */
export function renderTemplateA({ input }: LifestyleRenderContext): string {
  const img = input.images[0];
  return shell({ ...input, body: `${img ? renderImage(img, "ls__hero") : renderPlaceholder()}${renderText(input.headline, input.subheadline)}${renderTags(input.tags)}${renderCta(input.cta)}` });
}

/** LS-B: 2분할 이미지/텍스트 */
export function renderTemplateB({ input }: LifestyleRenderContext): string {
  const img = input.images[0];
  return shell({ ...input, body: `<div class="ls__split"><div class="ls__split-img">${img ? renderImage(img) : renderPlaceholder()}</div><div class="ls__split-text">${renderText(input.headline, input.subheadline)}${renderTags(input.tags)}${renderCta(input.cta)}</div></div>` });
}

/** LS-C: 멀티 이미지 콜라주 */
export function renderTemplateC({ input }: LifestyleRenderContext): string {
  return shell({ ...input, body: `${renderText(input.headline, input.subheadline)}<div class="ls__collage">${input.images.map((img) => renderImage(img, "ls__collage-item")).join("")}</div>${renderTags(input.tags)}${renderCta(input.cta)}` });
}
