import { renderFeatureDetailSection } from "./render";
import type { FeatureDetailLayoutId, FeatureDetailSectionInput, FeatureDetailSectionNormalized } from "./types";

function normalizeMood(mood?: string): string {
  if (!mood) return "mood--clean";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeInput(input: FeatureDetailSectionInput): FeatureDetailSectionNormalized {
  return {
    sectionId: input.sectionId?.trim() || "feature-detail",
    eyebrow: input.eyebrow?.trim() || undefined,
    headline: input.headline?.trim() || "핵심 기능",
    body: input.body?.trim() || undefined,
    bulletPoints: (input.bulletPoints || []).map((b) => b.trim()).filter(Boolean),
    imageUrl: input.imageUrl?.trim() || undefined,
    annotations: (input.annotations || []).filter((a) => a.text?.trim()).map((a) => ({ text: a.text.trim(), position: a.position })),
    stat: input.stat?.number?.trim() ? { number: input.stat.number.trim(), unit: input.stat.unit?.trim(), label: input.stat.label?.trim() } : undefined,
    caption: input.caption?.trim() || undefined,
    source: input.source?.trim() || undefined,
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined,
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMood(input.mood),
    layoutId: input.layoutId,
    imageRight: input.imageRight ?? true,
  };
}

export function renderSection(input: FeatureDetailSectionInput): string {
  return renderFeatureDetailSection(normalizeInput(input));
}
export { renderFeatureDetailSection };
export type { FeatureDetailSectionInput, FeatureDetailSectionNormalized, FeatureDetailLayoutId };
