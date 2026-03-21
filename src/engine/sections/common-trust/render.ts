import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type { TrustLayoutId, TrustRenderContext, TrustSectionNormalized } from "./types";
function pickLayout(input: TrustSectionNormalized): TrustLayoutId {
  if (input.mediaLogos.length >= 2) return "TR-C";
  if (input.featuredAward || input.awards.some((a) => a.name.includes("1위"))) return "TR-B";
  return "TR-A";
}
export function renderTrustSection(input: TrustSectionNormalized): string {
  const layoutId = input.layoutId ?? pickLayout(input);
  const ctx: TrustRenderContext = { input: { ...input, layoutId } };
  switch (layoutId) { case "TR-B": return renderTemplateB(ctx); case "TR-C": return renderTemplateC(ctx); default: return renderTemplateA(ctx); }
}
