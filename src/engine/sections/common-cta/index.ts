import { renderCtaSection } from "./render";
import type { CtaBenefit, CtaLayoutId, CtaSectionInput, CtaSectionNormalized } from "./types";

function normalizeMoodClass(mood?: string): string {
  if (!mood) return "mood--dark";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeInput(input: CtaSectionInput): CtaSectionNormalized {
  return {
    sectionId: input.sectionId?.trim() || "15-cta",
    eyebrow: input.eyebrow?.trim() || undefined,
    headline: input.headline?.trim() || "지금 시작하세요",
    subheadline: input.subheadline?.trim() || undefined,
    body: input.body?.trim() || undefined,
    benefits: (input.benefits || []).filter((b) => b.text?.trim()).map((b) => ({
      icon: b.icon?.trim() || undefined,
      text: b.text.trim(),
    })),
    cta: {
      text: input.cta?.text?.trim() || "시작하기",
      href: input.cta?.href?.trim() || "#",
    },
    secondaryAction: input.secondaryAction?.text?.trim()
      ? { text: input.secondaryAction.text.trim(), href: input.secondaryAction.href?.trim() || "#" }
      : undefined,
    microCopy: input.microCopy?.trim() || undefined,
    badge: input.badge?.trim() || undefined,
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMoodClass(input.mood),
    backgroundImageUrl: input.backgroundImageUrl?.trim() || undefined,
    layoutId: input.layoutId,
  };
}

export function renderSection(input: CtaSectionInput): string {
  const normalized = normalizeInput(input);
  return renderCtaSection(normalized);
}

export { renderCtaSection };
export type { CtaSectionInput, CtaSectionNormalized, CtaLayoutId };
