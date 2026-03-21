import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type { BeforeAfterLayoutId, BeforeAfterRenderContext, BeforeAfterSectionNormalized } from "./types";
function pickLayout(input: BeforeAfterSectionNormalized): BeforeAfterLayoutId {
  if (input.stat) return "BA-C";
  return "BA-A";
}
export function renderBeforeAfterSection(input: BeforeAfterSectionNormalized): string {
  const layoutId = input.layoutId ?? pickLayout(input);
  const ctx: BeforeAfterRenderContext = { input: { ...input, layoutId } };
  switch (layoutId) { case "BA-B": return renderTemplateB(ctx); case "BA-C": return renderTemplateC(ctx); default: return renderTemplateA(ctx); }
}
