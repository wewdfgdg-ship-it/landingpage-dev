export type PhotoReviewLayoutId = "PR-A" | "PR-B";
export type PhotoReviewItem = { id?: string; imageUrl: string; quote?: string; author?: string; rating?: number };
export type PhotoReviewSectionInput = { sectionId?: string; eyebrow?: string; headline?: string; subheadline?: string; reviews?: PhotoReviewItem[]; totalCount?: number; cta?: { text: string; href?: string }; brandColor?: string; mood?: string; layoutId?: PhotoReviewLayoutId };
export type PhotoReviewSectionNormalized = { sectionId: string; eyebrow?: string; headline: string; subheadline?: string; reviews: PhotoReviewItem[]; totalCount?: number; cta?: { text: string; href: string }; brandColor: string; moodClass: string; layoutId?: PhotoReviewLayoutId };
export type PhotoReviewRenderContext = { input: PhotoReviewSectionNormalized & { layoutId: PhotoReviewLayoutId } };
