import { renderCta, renderFeaturedPhoto, renderHeader, renderPhotoCard } from "./components";
import type { PhotoReviewLayoutId, PhotoReviewRenderContext } from "./types";
const LC: Record<PhotoReviewLayoutId, string> = { "PR-A": "ph--a", "PR-B": "ph--b" };
function shell(p: { sectionId: string; layoutId: PhotoReviewLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="ph ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--ph-brand:${p.brandColor};"><div class="ph__inner">${p.body}</div></section>`;
}
export function renderTemplateA({ input }: PhotoReviewRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}<div class="ph__grid">${input.reviews.map(renderPhotoCard).join("")}</div>${renderCta(input.cta)}` });
}
export function renderTemplateB({ input }: PhotoReviewRenderContext): string {
  const [featured, ...rest] = input.reviews;
  return shell({ ...input, body: `${renderHeader(input)}${featured ? renderFeaturedPhoto(featured) : ""}<div class="ph__sub-grid">${rest.map(renderPhotoCard).join("")}</div>${renderCta(input.cta)}` });
}
