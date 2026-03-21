export type PricingLayoutId = "PR-A" | "PR-B" | "PR-C";

export type PricingBenefit = { icon?: string; text: string };

export type PricingPlan = {
  id?: string;
  name: string;
  price: string;
  originalPrice?: string;
  period?: string;
  benefits: PricingBenefit[];
  badge?: string;
  recommended?: boolean;
  ctaText?: string;
};

export type GiftItem = { name: string; value?: string };

export type PricingSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  discount?: string;
  originalPrice?: string;
  salePrice?: string;
  benefits?: PricingBenefit[];
  plans?: PricingPlan[];
  giftItems?: GiftItem[];
  cta?: { text: string; href?: string };
  microCopy?: string;
  brandColor?: string;
  mood?: string;
  layoutId?: PricingLayoutId;
};

export type PricingSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  discount?: string;
  originalPrice?: string;
  salePrice?: string;
  benefits: PricingBenefit[];
  plans: PricingPlan[];
  giftItems: GiftItem[];
  cta?: { text: string; href: string };
  microCopy?: string;
  brandColor: string;
  moodClass: string;
  layoutId?: PricingLayoutId;
};

export type PricingRenderContext = {
  input: PricingSectionNormalized & { layoutId: PricingLayoutId };
};
