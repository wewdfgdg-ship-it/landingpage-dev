export type KeyFeaturesLayoutId = "KF-A" | "KF-B" | "KF-C";

export type KeyFeaturesCTA = {
  text: string;
  href?: string;
};

export type KeyFeatureItem = {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  badge?: string;
};

export type KeyFeaturesSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  features?: KeyFeatureItem[];
  cta?: KeyFeaturesCTA;
  brandColor?: string;
  mood?: string;
  maxItems?: number;
  layoutId?: KeyFeaturesLayoutId;
};

export type KeyFeaturesSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  features: KeyFeatureItem[];
  cta?: KeyFeaturesCTA;
  brandColor: string;
  moodClass: string;
  layoutId?: KeyFeaturesLayoutId;
};

export type KeyFeaturesRenderContext = {
  input: KeyFeaturesSectionNormalized & {
    layoutId: KeyFeaturesLayoutId;
  };
};

export type RenderFeatureCardOptions = {
  featured?: boolean;
};
