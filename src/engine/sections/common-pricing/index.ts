import { renderPricingSection } from "./render";
import type { PricingLayoutId, PricingSectionInput, PricingSectionNormalized } from "./types";

function normalizeMood(mood?: string): string {
  if (!mood) return "mood--clean";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeInput(input: PricingSectionInput): PricingSectionNormalized {
  return {
    sectionId: input.sectionId?.trim() || "26-pricing",
    eyebrow: input.eyebrow?.trim() || undefined,
    headline: input.headline?.trim() || "가격 안내",
    subheadline: input.subheadline?.trim() || undefined,
    discount: input.discount?.trim() || undefined,
    originalPrice: input.originalPrice?.trim() || undefined,
    salePrice: input.salePrice?.trim() || undefined,
    benefits: (input.benefits || []).filter((b) => b.text?.trim()).map((b) => ({ icon: b.icon?.trim(), text: b.text.trim() })),
    plans: (input.plans || []).filter((p) => p.name?.trim() && p.price?.trim()).map((p) => ({
      ...p, name: p.name.trim(), price: p.price.trim(),
      benefits: (p.benefits || []).filter((b) => b.text?.trim()).map((b) => ({ icon: b.icon?.trim(), text: b.text.trim() })),
    })),
    giftItems: (input.giftItems || []).filter((g) => g.name?.trim()).map((g) => ({ name: g.name.trim(), value: g.value?.trim() })),
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined,
    microCopy: input.microCopy?.trim() || undefined,
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMood(input.mood),
    layoutId: input.layoutId,
  };
}

export function renderSection(input: PricingSectionInput): string {
  return renderPricingSection(normalizeInput(input));
}
export { renderPricingSection };
export type { PricingSectionInput, PricingSectionNormalized, PricingLayoutId };
