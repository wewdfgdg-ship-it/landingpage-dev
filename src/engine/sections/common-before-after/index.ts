import { renderBeforeAfterSection } from "./render";
import type { BeforeAfterLayoutId, BeforeAfterSectionInput, BeforeAfterSectionNormalized } from "./types";
function normalizeMood(m?: string): string { if (!m) return "mood--clean"; if (m.startsWith("mood--")) return m; if (m.startsWith("mood-")) return m.replace("mood-","mood--"); return `mood--${m}`; }
function normalizeInput(input: BeforeAfterSectionInput): BeforeAfterSectionNormalized {
  return { sectionId: input.sectionId?.trim() || "09-before-after", eyebrow: input.eyebrow?.trim() || undefined, headline: input.headline?.trim() || "변화를 확인하세요", body: input.body?.trim() || undefined,
    beforeImageUrl: input.beforeImageUrl?.trim() || undefined, afterImageUrl: input.afterImageUrl?.trim() || undefined, beforeLabel: input.beforeLabel?.trim() || "BEFORE", afterLabel: input.afterLabel?.trim() || "AFTER",
    stat: input.stat?.number?.trim() ? { number: input.stat.number.trim(), unit: input.stat.unit?.trim(), label: input.stat.label?.trim() } : undefined, caption: input.caption?.trim() || undefined,
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined, brandColor: input.brandColor?.trim() || "#4A90D9", moodClass: normalizeMood(input.mood), layoutId: input.layoutId };
}
export function renderSection(input: BeforeAfterSectionInput): string { return renderBeforeAfterSection(normalizeInput(input)); }
export { renderBeforeAfterSection }; export type { BeforeAfterSectionInput, BeforeAfterSectionNormalized, BeforeAfterLayoutId };
