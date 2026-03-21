import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type { FeatureDetailLayoutId, FeatureDetailRenderContext, FeatureDetailSectionNormalized } from "./types";

function pickLayout(input: FeatureDetailSectionNormalized): FeatureDetailLayoutId {
  if (input.annotations.length >= 2 && input.imageUrl) return "FD-B";
  if (input.stat) return "FD-C";
  return "FD-A";
}

export function renderFeatureDetailSection(input: FeatureDetailSectionNormalized): string {
  const layoutId = input.layoutId ?? pickLayout(input);
  const context: FeatureDetailRenderContext = { input: { ...input, layoutId } };
  switch (layoutId) {
    case "FD-B": return renderTemplateB(context);
    case "FD-C": return renderTemplateC(context);
    default: return renderTemplateA(context);
  }
}
