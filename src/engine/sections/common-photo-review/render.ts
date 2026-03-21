import { renderTemplateA, renderTemplateB } from "./templates";
import type { PhotoReviewLayoutId, PhotoReviewRenderContext, PhotoReviewSectionNormalized } from "./types";
export function renderPhotoReviewSection(input: PhotoReviewSectionNormalized): string {
  const layoutId = input.layoutId ?? (input.reviews.length >= 4 ? "PR-A" : "PR-B");
  const ctx: PhotoReviewRenderContext = { input: { ...input, layoutId } };
  return layoutId === "PR-B" ? renderTemplateB(ctx) : renderTemplateA(ctx);
}
