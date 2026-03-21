export type LifestyleLayoutId = "LS-A" | "LS-B" | "LS-C";

export type LifestyleImage = { url: string; alt?: string; caption?: string };

export type LifestyleSectionInput = {
  sectionId?: string;
  headline?: string;
  subheadline?: string;
  images?: LifestyleImage[];
  tags?: string[];
  cta?: { text: string; href?: string };
  brandColor?: string;
  mood?: string;
  layoutId?: LifestyleLayoutId;
};

export type LifestyleSectionNormalized = {
  sectionId: string;
  headline: string;
  subheadline?: string;
  images: LifestyleImage[];
  tags: string[];
  cta?: { text: string; href: string };
  brandColor: string;
  moodClass: string;
  layoutId?: LifestyleLayoutId;
};

export type LifestyleRenderContext = {
  input: LifestyleSectionNormalized & { layoutId: LifestyleLayoutId };
};
