export type ComparisonLayoutId = "CM-A" | "CM-B";
export type CompareRow = { label: string; ours: string; theirs?: string };
export type ComparisonSectionInput = { sectionId?: string; eyebrow?: string; headline?: string; subheadline?: string; ourName?: string; theirName?: string; rows?: CompareRow[]; cta?: { text: string; href?: string }; brandColor?: string; mood?: string; layoutId?: ComparisonLayoutId };
export type ComparisonSectionNormalized = { sectionId: string; eyebrow?: string; headline: string; subheadline?: string; ourName: string; theirName: string; rows: CompareRow[]; cta?: { text: string; href: string }; brandColor: string; moodClass: string; layoutId?: ComparisonLayoutId };
export type ComparisonRenderContext = { input: ComparisonSectionNormalized & { layoutId: ComparisonLayoutId } };
