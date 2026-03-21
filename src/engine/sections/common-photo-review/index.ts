import { renderPhotoReviewSection } from "./render";
import type { PhotoReviewLayoutId, PhotoReviewSectionInput, PhotoReviewSectionNormalized } from "./types";
function normalizeMood(m?: string): string { if (!m) return "mood--clean"; if (m.startsWith("mood--")) return m; if (m.startsWith("mood-")) return m.replace("mood-","mood--"); return `mood--${m}`; }
function normalizeInput(input: PhotoReviewSectionInput): PhotoReviewSectionNormalized {
  return { sectionId: input.sectionId?.trim() || "20-photo-reviews", eyebrow: input.eyebrow?.trim() || undefined, headline: input.headline?.trim() || "포토 리뷰", subheadline: input.subheadline?.trim() || undefined,
    reviews: (input.reviews || []).filter((r) => r.imageUrl?.trim()).map((r, i) => ({ id: r.id || `pr-${i+1}`, imageUrl: r.imageUrl.trim(), quote: r.quote?.trim(), author: r.author?.trim(), rating: r.rating })),
    totalCount: input.totalCount, cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined, brandColor: input.brandColor?.trim() || "#4A90D9", moodClass: normalizeMood(input.mood), layoutId: input.layoutId };
}
export function renderSection(input: PhotoReviewSectionInput): string { return renderPhotoReviewSection(normalizeInput(input)); }
export { renderPhotoReviewSection }; export type { PhotoReviewSectionInput, PhotoReviewSectionNormalized, PhotoReviewLayoutId };
