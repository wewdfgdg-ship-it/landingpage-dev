import { renderSpecInfoSection } from "./render";
import type {
  SpecInfoItem,
  SpecInfoCTA,
  SpecInfoLayoutId,
  SpecInfoSectionInput,
  SpecInfoSectionNormalized,
} from "./types";

function normalizeMoodClass(mood?: string): string {
  if (!mood) return "mood--clean";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeItem(item: SpecInfoItem, index: number): SpecInfoItem | null {
  const label = item.label?.trim();
  if (!label) return null;

  return {
    id: item.id?.trim() || `item-${index + 1}`,
    label,
    value: item.value?.trim() || undefined,
    description: item.description?.trim() || undefined,
    icon: item.icon?.trim() || undefined,
    note: item.note?.trim() || undefined,
    badge: item.badge?.trim() || undefined,
    imageUrl: item.imageUrl?.trim() || undefined,
  };
}

function normalizeItems(items: SpecInfoItem[] | undefined, maxItems: number): SpecInfoItem[] {
  if (!items?.length) {
    return [
      { id: "item-1", label: "항목 1", value: "값 1" },
      { id: "item-2", label: "항목 2", value: "값 2" },
      { id: "item-3", label: "항목 3", value: "값 3" },
    ];
  }

  return items
    .slice(0, Math.max(1, maxItems))
    .map(normalizeItem)
    .filter((item): item is SpecInfoItem => Boolean(item));
}

function normalizeCta(cta?: SpecInfoCTA): SpecInfoCTA | undefined {
  if (!cta?.text?.trim()) return undefined;
  return { text: cta.text.trim(), href: cta.href?.trim() || "#" };
}

function normalizeInput(input: SpecInfoSectionInput): SpecInfoSectionNormalized {
  const maxItems = input.maxItems ?? 8;

  return {
    sectionId: input.sectionId?.trim() || "spec-info",
    eyebrow: input.eyebrow?.trim() || undefined,
    headline: input.headline?.trim() || "상세 정보",
    subheadline: input.subheadline?.trim() || undefined,
    items: normalizeItems(input.items, maxItems),
    cta: normalizeCta(input.cta),
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMoodClass(input.mood),
    layoutId: input.layoutId,
    heroImageUrl: input.heroImageUrl?.trim() || undefined,
    annotations: (input.annotations || []).map((a) => a.trim()).filter(Boolean),
    metric: input.metric?.trim() || undefined,
    metricLabel: input.metricLabel?.trim() || undefined,
    numbered: input.numbered ?? false,
    footnote: input.footnote?.trim() || undefined,
  };
}

export function renderSection(input: SpecInfoSectionInput): string {
  const normalized = normalizeInput(input);
  return renderSpecInfoSection(normalized);
}

export { renderSpecInfoSection };
export type { SpecInfoSectionInput, SpecInfoSectionNormalized, SpecInfoLayoutId };
