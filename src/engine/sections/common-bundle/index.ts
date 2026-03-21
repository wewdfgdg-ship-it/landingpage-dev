import { renderBundleSection } from "./render";
import type { BundleLayoutId, BundleSectionInput, BundleSectionNormalized } from "./types";

function normalizeMood(mood?: string): string {
  if (!mood) return "mood--clean";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeInput(input: BundleSectionInput): BundleSectionNormalized {
  const items = (input.items || []).filter((i) => i.name?.trim()).map((i, idx) => ({
    id: i.id?.trim() || `bundle-${idx + 1}`, name: i.name.trim(), quantity: i.quantity,
    imageUrl: i.imageUrl?.trim(), value: i.value?.trim(), badge: i.badge?.trim(),
  }));
  return {
    sectionId: input.sectionId?.trim() || "bundle",
    eyebrow: input.eyebrow?.trim() || undefined,
    headline: input.headline?.trim() || "세트 구성",
    subheadline: input.subheadline?.trim() || undefined,
    items: items.length ? items : [{ id: "b-1", name: "본품" }, { id: "b-2", name: "증정품" }],
    totalValue: input.totalValue?.trim() || undefined,
    salePrice: input.salePrice?.trim() || undefined,
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined,
    microCopy: input.microCopy?.trim() || undefined,
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMood(input.mood),
    layoutId: input.layoutId,
  };
}

export function renderSection(input: BundleSectionInput): string {
  return renderBundleSection(normalizeInput(input));
}
export { renderBundleSection };
export type { BundleSectionInput, BundleSectionNormalized, BundleLayoutId };
