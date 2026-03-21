export type FeatureDetailLayoutId = "FD-A" | "FD-B" | "FD-C";

export type Annotation = { text: string; position?: string };

export type FeatureDetailSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  body?: string;
  bulletPoints?: string[];
  imageUrl?: string;
  annotations?: Annotation[];
  stat?: { number: string; unit?: string; label?: string };
  caption?: string;
  source?: string;
  cta?: { text: string; href?: string };
  brandColor?: string;
  mood?: string;
  layoutId?: FeatureDetailLayoutId;
  /** FD-A 방향: true=이미지 우측(기본), false=이미지 좌측 */
  imageRight?: boolean;
};

export type FeatureDetailSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  body?: string;
  bulletPoints: string[];
  imageUrl?: string;
  annotations: Annotation[];
  stat?: { number: string; unit?: string; label?: string };
  caption?: string;
  source?: string;
  cta?: { text: string; href: string };
  brandColor: string;
  moodClass: string;
  layoutId?: FeatureDetailLayoutId;
  imageRight: boolean;
};

export type FeatureDetailRenderContext = {
  input: FeatureDetailSectionNormalized & { layoutId: FeatureDetailLayoutId };
};
