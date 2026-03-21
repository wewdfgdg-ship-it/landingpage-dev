import { renderReviewsSection } from "./render";
import type { ReviewItem, ReviewsLayoutId, ReviewsSectionInput, ReviewsSectionNormalized } from "./types";

function normalizeMoodClass(mood?: string): string {
  if (!mood) return "mood--clean";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeReview(item: ReviewItem, index: number): ReviewItem | null {
  const quote = item.quote?.trim();
  const author = item.author?.trim();
  if (!quote || !author) return null;
  return {
    id: item.id?.trim() || `review-${index + 1}`,
    quote, author,
    meta: item.meta?.trim() || undefined,
    rating: item.rating,
    imageUrl: item.imageUrl?.trim() || undefined,
    tags: item.tags?.map((t) => t.trim()).filter(Boolean),
  };
}

function normalizeInput(input: ReviewsSectionInput): ReviewsSectionNormalized {
  const maxItems = input.maxItems ?? 6;
  const reviews = (input.reviews || [])
    .slice(0, maxItems)
    .map(normalizeReview)
    .filter((r): r is ReviewItem => Boolean(r));

  return {
    sectionId: input.sectionId?.trim() || "13-reviews",
    eyebrow: input.eyebrow?.trim() || undefined,
    headline: input.headline?.trim() || "고객 리뷰",
    subheadline: input.subheadline?.trim() || undefined,
    reviews: reviews.length ? reviews : [
      { id: "review-1", quote: "정말 만족스러운 제품입니다.", author: "고객 A", rating: 5 },
      { id: "review-2", quote: "재구매 의사 있습니다.", author: "고객 B", rating: 5 },
      { id: "review-3", quote: "주변에 추천합니다.", author: "고객 C", rating: 4 },
    ],
    averageRating: input.averageRating,
    totalCount: input.totalCount,
    featuredReview: input.featuredReview,
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined,
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMoodClass(input.mood),
    layoutId: input.layoutId,
  };
}

export function renderSection(input: ReviewsSectionInput): string {
  const normalized = normalizeInput(input);
  return renderReviewsSection(normalized);
}

export { renderReviewsSection };
export type { ReviewsSectionInput, ReviewsSectionNormalized, ReviewsLayoutId };
