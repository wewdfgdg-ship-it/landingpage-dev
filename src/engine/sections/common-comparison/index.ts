import { renderComparisonSection } from "./render";
import type { ComparisonLayoutId, ComparisonSectionInput, ComparisonSectionNormalized } from "./types";
function normalizeMood(m?: string): string { if (!m) return "mood--clean"; if (m.startsWith("mood--")) return m; if (m.startsWith("mood-")) return m.replace("mood-","mood--"); return `mood--${m}`; }
function normalizeInput(input: ComparisonSectionInput): ComparisonSectionNormalized {
  return { sectionId: input.sectionId?.trim() || "17-comparison", eyebrow: input.eyebrow?.trim() || undefined, headline: input.headline?.trim() || "비교 분석", subheadline: input.subheadline?.trim() || undefined,
    ourName: input.ourName?.trim() || "우리 제품", theirName: input.theirName?.trim() || "일반 제품",
    rows: (input.rows || []).filter((r) => r.label?.trim()).map((r) => ({ label: r.label.trim(), ours: r.ours?.trim() || "✅", theirs: r.theirs?.trim() })),
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined, brandColor: input.brandColor?.trim() || "#4A90D9", moodClass: normalizeMood(input.mood), layoutId: input.layoutId };
}
export function renderSection(input: ComparisonSectionInput): string { return renderComparisonSection(normalizeInput(input)); }
export { renderComparisonSection }; export type { ComparisonSectionInput, ComparisonSectionNormalized, ComparisonLayoutId };
