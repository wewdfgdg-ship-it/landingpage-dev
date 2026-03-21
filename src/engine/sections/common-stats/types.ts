export type StatsLayoutId = "ST-A" | "ST-B" | "ST-C";

export type StatItem = {
  id?: string;
  number: string;
  unit?: string;
  label: string;
  description?: string;
};

export type StatsSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  stats?: StatItem[];
  source?: string;
  cta?: { text: string; href?: string };
  brandColor?: string;
  mood?: string;
  layoutId?: StatsLayoutId;
};

export type StatsSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  stats: StatItem[];
  source?: string;
  cta?: { text: string; href?: string };
  brandColor: string;
  moodClass: string;
  layoutId?: StatsLayoutId;
};

export type StatsRenderContext = {
  input: StatsSectionNormalized & { layoutId: StatsLayoutId };
};
