export type SpecInfoLayoutId = "SI-A" | "SI-B" | "SI-C";

export type SpecInfoCTA = {
  text: string;
  href?: string;
};

export type SpecInfoItem = {
  id?: string;
  label: string;
  value?: string;
  description?: string;
  icon?: string;
  note?: string;
  badge?: string;
  imageUrl?: string;
};

export type SpecInfoSectionInput = {
  sectionId?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  items?: SpecInfoItem[];
  cta?: SpecInfoCTA;
  brandColor?: string;
  mood?: string;
  maxItems?: number;
  layoutId?: SpecInfoLayoutId;
  /** SI-A: 오버레이 스펙용 메인 이미지 */
  heroImageUrl?: string;
  /** SI-A: 이미지 위 어노테이션 */
  annotations?: string[];
  /** SI-A/SI-C: 수치 강조 */
  metric?: string;
  metricLabel?: string;
  /** SI-B: 스텝 번호 표시 여부 */
  numbered?: boolean;
  footnote?: string;
};

export type SpecInfoSectionNormalized = {
  sectionId: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  items: SpecInfoItem[];
  cta?: SpecInfoCTA;
  brandColor: string;
  moodClass: string;
  layoutId?: SpecInfoLayoutId;
  heroImageUrl?: string;
  annotations: string[];
  metric?: string;
  metricLabel?: string;
  numbered: boolean;
  footnote?: string;
};

export type SpecInfoRenderContext = {
  input: SpecInfoSectionNormalized & {
    layoutId: SpecInfoLayoutId;
  };
};
