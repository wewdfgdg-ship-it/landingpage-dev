import {
  renderCta,
  renderRatingSummary,
  renderReviewCard,
  renderSectionHeader,
} from "./components";
import type { ReviewsLayoutId, ReviewsRenderContext } from "./types";

const LAYOUT_CLASS: Record<ReviewsLayoutId, string> = {
  "RV-A": "rv--a",
  "RV-B": "rv--b",
  "RV-C": "rv--c",
};

function renderShell(params: {
  sectionId: string;
  layoutId: ReviewsLayoutId;
  moodClass: string;
  brandColor: string;
  body: string;
}): string {
  const { sectionId, layoutId, moodClass, brandColor, body } = params;
  return `
<!-- LAYOUT: ${layoutId} -->
<section
  class="rv ${LAYOUT_CLASS[layoutId]} ${moodClass}"
  data-section="${sectionId}"
  data-layout="${layoutId}"
  style="--rv-brand:${brandColor};"
>
  <div class="rv__inner">
    ${body}
  </div>
</section>
  `.trim();
}

/** RV-A: Review Cards Grid */
export function renderTemplateA({ input }: ReviewsRenderContext): string {
  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      ${renderRatingSummary(input.averageRating, input.totalCount)}
      <div class="rv__grid">
        ${input.reviews.map((r) => renderReviewCard(r)).join("")}
      </div>
      ${renderCta(input.cta)}
    `,
  });
}

/** RV-B: Featured Testimonial */
export function renderTemplateB({ input }: ReviewsRenderContext): string {
  const featured = input.featuredReview || input.reviews[0];
  const rest = input.featuredReview ? input.reviews : input.reviews.slice(1);

  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      ${featured ? renderReviewCard(featured, { featured: true }) : ""}
      ${rest.length ? `<div class="rv__mini-list">${rest.map((r) => renderReviewCard(r)).join("")}</div>` : ""}
      ${renderCta(input.cta)}
    `,
  });
}

/** RV-C: Photo Review Strip */
export function renderTemplateC({ input }: ReviewsRenderContext): string {
  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      ${renderRatingSummary(input.averageRating, input.totalCount)}
      <div class="rv__photo-grid">
        ${input.reviews.map((r) => `
          <div class="rv__photo-item">
            ${r.imageUrl ? `<img class="rv__photo-img" src="${r.imageUrl}" alt="${r.author}" loading="lazy" />` : ""}
            <div class="rv__photo-caption">
              <span class="rv__photo-author">${r.author}</span>
              ${r.quote ? `<span class="rv__photo-quote">"${r.quote}"</span>` : ""}
            </div>
          </div>
        `).join("")}
      </div>
      ${renderCta(input.cta)}
    `,
  });
}
