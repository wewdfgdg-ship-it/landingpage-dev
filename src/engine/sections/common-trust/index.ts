import { renderTrustSection } from "./render";
import type { TrustLayoutId, TrustSectionInput, TrustSectionNormalized } from "./types";
function normalizeMood(m?: string): string { if (!m) return "mood--dark"; if (m.startsWith("mood--")) return m; if (m.startsWith("mood-")) return m.replace("mood-","mood--"); return `mood--${m}`; }
function normalizeInput(input: TrustSectionInput): TrustSectionNormalized {
  return { sectionId: input.sectionId?.trim() || "11-trust", eyebrow: input.eyebrow?.trim() || undefined, headline: input.headline?.trim() || "인증 및 수상", subheadline: input.subheadline?.trim() || undefined,
    awards: (input.awards || []).filter((a) => a.name?.trim()).map((a, i) => ({ id: a.id || `award-${i+1}`, name: a.name.trim(), icon: a.icon?.trim(), description: a.description?.trim(), imageUrl: a.imageUrl?.trim() })),
    mediaLogos: (input.mediaLogos || []).filter((l) => l.name?.trim()).map((l) => ({ name: l.name.trim(), imageUrl: l.imageUrl?.trim(), quote: l.quote?.trim() })),
    featuredAward: input.featuredAward?.name?.trim() ? { name: input.featuredAward.name.trim(), icon: input.featuredAward.icon?.trim(), description: input.featuredAward.description?.trim() } : undefined,
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined, brandColor: input.brandColor?.trim() || "#C9A96E", moodClass: normalizeMood(input.mood), layoutId: input.layoutId };
}
export function renderSection(input: TrustSectionInput): string { return renderTrustSection(normalizeInput(input)); }
export { renderTrustSection }; export type { TrustSectionInput, TrustSectionNormalized, TrustLayoutId };
