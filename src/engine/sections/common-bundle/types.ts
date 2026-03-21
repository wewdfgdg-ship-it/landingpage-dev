export type BundleLayoutId = "BN-A" | "BN-B";

export type BundleItem = {
  id?: string;
  name: string;
  quantity?: number;
  imageUrl?: string;
  value?: string;
  badge?: string;
};

export type BundleSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  items?: BundleItem[];
  totalValue?: string;
  salePrice?: string;
  cta?: { text: string; href?: string };
  microCopy?: string;
  brandColor?: string;
  mood?: string;
  layoutId?: BundleLayoutId;
};

export type BundleSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  items: BundleItem[];
  totalValue?: string;
  salePrice?: string;
  cta?: { text: string; href: string };
  microCopy?: string;
  brandColor: string;
  moodClass: string;
  layoutId?: BundleLayoutId;
};

export type BundleRenderContext = {
  input: BundleSectionNormalized & { layoutId: BundleLayoutId };
};
