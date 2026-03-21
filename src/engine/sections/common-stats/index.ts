import { renderStatsSection } from "./render";
import type { StatItem, StatsLayoutId, StatsSectionInput, StatsSectionNormalized } from "./types";

function normalizeMood(mood?: string): string {
  if (!mood) return "mood--dark";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeInput(input: StatsSectionInput): StatsSectionNormalized {
  const stats = (input.stats || []).filter((s) => s.number?.trim() && s.label?.trim()).map((s, i) => ({
    id: s.id?.trim() || `stat-${i + 1}`,
    number: s.number.trim(),
    unit: s.unit?.trim() || undefined,
    label: s.label.trim(),
    description: s.description?.trim() || undefined,
  }));
  return {
    sectionId: input.sectionId?.trim() || "16-stats",
    eyebrow: input.eyebrow?.trim() || undefined,
    headline: input.headline?.trim() || "숫자로 증명합니다",
    subheadline: input.subheadline?.trim() || undefined,
    stats: stats.length ? stats : [
      { id: "stat-1", number: "72", unit: "시간", label: "지속력" },
      { id: "stat-2", number: "4.8", unit: "점", label: "평점" },
      { id: "stat-3", number: "12만", unit: "개", label: "판매" },
    ],
    source: input.source?.trim() || undefined,
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined,
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMood(input.mood),
    layoutId: input.layoutId,
  };
}

export function renderSection(input: StatsSectionInput): string {
  return renderStatsSection(normalizeInput(input));
}
export { renderStatsSection };
export type { StatsSectionInput, StatsSectionNormalized, StatsLayoutId };
