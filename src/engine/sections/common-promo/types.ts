export type PromoLayoutId = "PL-A" | "PL-B";
export type PromoBenefit = { icon?: string; text: string };
export type PromoSectionInput = { sectionId?: string; eyebrow?: string; headline?: string; subheadline?: string; benefits?: PromoBenefit[]; deadline?: string; stockPercent?: number; cta?: { text: string; href?: string }; microCopy?: string; brandColor?: string; mood?: string; layoutId?: PromoLayoutId };
export type PromoSectionNormalized = { sectionId: string; eyebrow?: string; headline: string; subheadline?: string; benefits: PromoBenefit[]; deadline?: string; stockPercent?: number; cta?: { text: string; href: string }; microCopy?: string; brandColor: string; moodClass: string; layoutId?: PromoLayoutId };
export type PromoRenderContext = { input: PromoSectionNormalized & { layoutId: PromoLayoutId } };
