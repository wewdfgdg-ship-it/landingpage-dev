import { renderPromoSection } from "./render";
import type { PromoLayoutId, PromoSectionInput, PromoSectionNormalized } from "./types";
function normalizeMood(m?: string): string { if (!m) return "mood--dark"; if (m.startsWith("mood--")) return m; if (m.startsWith("mood-")) return m.replace("mood-","mood--"); return `mood--${m}`; }
function normalizeInput(input: PromoSectionInput): PromoSectionNormalized {
  return { sectionId: input.sectionId?.trim() || "23-promo", eyebrow: input.eyebrow?.trim() || undefined, headline: input.headline?.trim() || "한정 특가", subheadline: input.subheadline?.trim() || undefined,
    benefits: (input.benefits || []).filter((b) => b.text?.trim()).map((b) => ({ icon: b.icon?.trim(), text: b.text.trim() })),
    deadline: input.deadline?.trim() || undefined, stockPercent: input.stockPercent,
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : { text: "지금 구매하기", href: "#" },
    microCopy: input.microCopy?.trim() || undefined, brandColor: input.brandColor?.trim() || "#DC2626", moodClass: normalizeMood(input.mood), layoutId: input.layoutId };
}
export function renderSection(input: PromoSectionInput): string { return renderPromoSection(normalizeInput(input)); }
export { renderPromoSection }; export type { PromoSectionInput, PromoSectionNormalized, PromoLayoutId };
