export type FaqLayoutId = "FAQ-A" | "FAQ-B" | "FAQ-C";

export type FaqItem = {
  id?: string;
  question: string;
  answer: string;
};

export type FaqSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  items?: FaqItem[];
  cta?: { text: string; href?: string };
  brandColor?: string;
  mood?: string;
  maxItems?: number;
  layoutId?: FaqLayoutId;
};

export type FaqSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  items: FaqItem[];
  cta?: { text: string; href?: string };
  brandColor: string;
  moodClass: string;
  layoutId?: FaqLayoutId;
};

export type FaqRenderContext = {
  input: FaqSectionNormalized & { layoutId: FaqLayoutId };
};
