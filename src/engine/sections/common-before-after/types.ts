export type BeforeAfterLayoutId = "BA-A" | "BA-B" | "BA-C";

export type BeforeAfterSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  body?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  beforeLabel?: string;
  afterLabel?: string;
  stat?: { number: string; unit?: string; label?: string };
  caption?: string;
  cta?: { text: string; href?: string };
  brandColor?: string;
  mood?: string;
  layoutId?: BeforeAfterLayoutId;
};

export type BeforeAfterSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  body?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  beforeLabel: string;
  afterLabel: string;
  stat?: { number: string; unit?: string; label?: string };
  caption?: string;
  cta?: { text: string; href: string };
  brandColor: string;
  moodClass: string;
  layoutId?: BeforeAfterLayoutId;
};

export type BeforeAfterRenderContext = { input: BeforeAfterSectionNormalized & { layoutId: BeforeAfterLayoutId } };
