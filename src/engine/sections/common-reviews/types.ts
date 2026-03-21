export type ReviewsLayoutId = "RV-A" | "RV-B" | "RV-C";

export type ReviewItem = {
  id?: string;
  quote: string;
  author: string;
  meta?: string;
  rating?: number;
  imageUrl?: string;
  tags?: string[];
};

export type ReviewsSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  reviews?: ReviewItem[];
  averageRating?: number;
  totalCount?: number;
  featuredReview?: ReviewItem;
  cta?: { text: string; href?: string };
  brandColor?: string;
  mood?: string;
  maxItems?: number;
  layoutId?: ReviewsLayoutId;
};

export type ReviewsSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  reviews: ReviewItem[];
  averageRating?: number;
  totalCount?: number;
  featuredReview?: ReviewItem;
  cta?: { text: string; href?: string };
  brandColor: string;
  moodClass: string;
  layoutId?: ReviewsLayoutId;
};

export type ReviewsRenderContext = {
  input: ReviewsSectionNormalized & { layoutId: ReviewsLayoutId };
};
