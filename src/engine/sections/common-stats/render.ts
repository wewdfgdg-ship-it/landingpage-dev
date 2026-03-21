import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type { StatsLayoutId, StatsRenderContext, StatsSectionNormalized } from "./types";

function pickLayout(input: StatsSectionNormalized): StatsLayoutId {
  if (input.stats.length === 1) return "ST-B";
  if (input.stats.length >= 4) return "ST-C";
  return "ST-A";
}

export function renderStatsSection(input: StatsSectionNormalized): string {
  const layoutId = input.layoutId ?? pickLayout(input);
  const context: StatsRenderContext = { input: { ...input, layoutId } };
  switch (layoutId) {
    case "ST-B": return renderTemplateB(context);
    case "ST-C": return renderTemplateC(context);
    default: return renderTemplateA(context);
  }
}
