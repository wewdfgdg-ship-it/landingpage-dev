import { renderLifestyleSection } from "./render";
import type { LifestyleLayoutId, LifestyleSectionInput, LifestyleSectionNormalized } from "./types";

function normalizeMood(mood?: string): string {
  if (!mood) return "mood--soft";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeInput(input: LifestyleSectionInput): LifestyleSectionNormalized {
  return {
    sectionId: input.sectionId?.trim() || "lifestyle",
    headline: input.headline?.trim() || "일상 속 제품",
    subheadline: input.subheadline?.trim() || undefined,
    images: (input.images || []).filter((i) => i.url?.trim()).map((i) => ({ url: i.url.trim(), alt: i.alt?.trim(), caption: i.caption?.trim() })),
    tags: (input.tags || []).map((t) => t.trim()).filter(Boolean),
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined,
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMood(input.mood),
    layoutId: input.layoutId,
  };
}

export function renderSection(input: LifestyleSectionInput): string {
  return renderLifestyleSection(normalizeInput(input));
}
export { renderLifestyleSection };
export type { LifestyleSectionInput, LifestyleSectionNormalized, LifestyleLayoutId };
