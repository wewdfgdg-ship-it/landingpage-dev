export type CtaLayoutId = "CTA-A" | "CTA-B" | "CTA-C";

export type CtaBenefit = {
  icon?: string;
  text: string;
};

export type CtaSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  body?: string;
  benefits?: CtaBenefit[];
  cta: { text: string; href?: string };
  secondaryAction?: { text: string; href?: string };
  microCopy?: string;
  badge?: string;
  brandColor?: string;
  mood?: string;
  backgroundImageUrl?: string;
  layoutId?: CtaLayoutId;
};

export type CtaSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  body?: string;
  benefits: CtaBenefit[];
  cta: { text: string; href: string };
  secondaryAction?: { text: string; href: string };
  microCopy?: string;
  badge?: string;
  brandColor: string;
  moodClass: string;
  backgroundImageUrl?: string;
  layoutId?: CtaLayoutId;
};

export type CtaRenderContext = {
  input: CtaSectionNormalized & { layoutId: CtaLayoutId };
};
