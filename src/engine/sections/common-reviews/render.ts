import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type { ReviewsLayoutId, ReviewsRenderContext, ReviewsSectionNormalized } from "./types";

function pickLayout(input: ReviewsSectionNormalized): ReviewsLayoutId {
  const hasPhotos = input.reviews.filter((r) => Boolean(r.imageUrl)).length >= 3;
  const hasFeatured = Boolean(input.featuredReview);
  const totalHigh = (input.totalCount ?? 0) >= 1000;

  if (hasPhotos) return "RV-C";
  if (hasFeatured) return "RV-B";
  if (totalHigh) return "RV-C";
  return "RV-A";
}

function resolveLayout(input: ReviewsSectionNormalized): ReviewsLayoutId {
  return input.layoutId ?? pickLayout(input);
}

export function renderReviewsSection(input: ReviewsSectionNormalized): string {
  const layoutId = resolveLayout(input);
  const context: ReviewsRenderContext = { input: { ...input, layoutId } };

  switch (layoutId) {
    case "RV-B": return renderTemplateB(context);
    case "RV-C": return renderTemplateC(context);
    case "RV-A": default: return renderTemplateA(context);
  }
}
