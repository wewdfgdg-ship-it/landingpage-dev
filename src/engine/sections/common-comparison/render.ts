import { renderTemplateA, renderTemplateB } from "./templates";
import type { ComparisonLayoutId, ComparisonRenderContext, ComparisonSectionNormalized } from "./types";
export function renderComparisonSection(input: ComparisonSectionNormalized): string {
  const layoutId = input.layoutId ?? "CM-A";
  const ctx: ComparisonRenderContext = { input: { ...input, layoutId } };
  return layoutId === "CM-B" ? renderTemplateB(ctx) : renderTemplateA(ctx);
}
