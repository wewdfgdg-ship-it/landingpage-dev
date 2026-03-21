export type TrustLayoutId = "TR-A" | "TR-B" | "TR-C";
export type AwardItem = { id?: string; name: string; icon?: string; description?: string; imageUrl?: string };
export type MediaLogo = { name: string; imageUrl?: string; quote?: string };
export type TrustSectionInput = { sectionId?: string; eyebrow?: string; headline?: string; subheadline?: string; awards?: AwardItem[]; mediaLogos?: MediaLogo[]; featuredAward?: AwardItem; cta?: { text: string; href?: string }; brandColor?: string; mood?: string; layoutId?: TrustLayoutId };
export type TrustSectionNormalized = { sectionId: string; eyebrow?: string; headline: string; subheadline?: string; awards: AwardItem[]; mediaLogos: MediaLogo[]; featuredAward?: AwardItem; cta?: { text: string; href: string }; brandColor: string; moodClass: string; layoutId?: TrustLayoutId };
export type TrustRenderContext = { input: TrustSectionNormalized & { layoutId: TrustLayoutId } };
