import { renderBigStat, renderCta, renderSectionHeader, renderSource, renderStatCard, renderStatInline } from "./components";
import type { StatsLayoutId, StatsRenderContext } from "./types";

const LC: Record<StatsLayoutId, string> = { "ST-A": "st--a", "ST-B": "st--b", "ST-C": "st--c" };

function shell(p: { sectionId: string; layoutId: StatsLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="st ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--st-brand:${p.brandColor};"><div class="st__inner">${p.body}</div></section>`;
}

/** ST-A: 수평 나열 */
export function renderTemplateA({ input }: StatsRenderContext): string {
  return shell({ ...input, body: `${renderSectionHeader(input)}<div class="st__row">${input.stats.map(renderStatInline).join("")}</div>${renderSource(input.source)}${renderCta(input.cta)}` });
}

/** ST-B: 대형 단독 숫자 + 보조 */
export function renderTemplateB({ input }: StatsRenderContext): string {
  const [main, ...rest] = input.stats;
  return shell({ ...input, body: `${renderSectionHeader(input)}${main ? renderBigStat(main) : ""}${rest.length ? `<div class="st__row st__row--sub">${rest.map(renderStatInline).join("")}</div>` : ""}${renderSource(input.source)}${renderCta(input.cta)}` });
}

/** ST-C: 카드 그리드 */
export function renderTemplateC({ input }: StatsRenderContext): string {
  return shell({ ...input, body: `${renderSectionHeader(input)}<div class="st__grid">${input.stats.map(renderStatCard).join("")}</div>${renderSource(input.source)}${renderCta(input.cta)}` });
}
