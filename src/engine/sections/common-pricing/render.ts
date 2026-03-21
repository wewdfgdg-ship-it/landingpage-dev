import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type { PricingLayoutId, PricingRenderContext, PricingSectionNormalized } from "./types";

function pickLayout(input: PricingSectionNormalized): PricingLayoutId {
  if (input.plans.length >= 2) return "PR-B";
  if (input.giftItems.length >= 1) return "PR-C";
  return "PR-A";
}

export function renderPricingSection(input: PricingSectionNormalized): string {
  const layoutId = input.layoutId ?? pickLayout(input);
  const context: PricingRenderContext = { input: { ...input, layoutId } };
  switch (layoutId) {
    case "PR-B": return renderTemplateB(context);
    case "PR-C": return renderTemplateC(context);
    default: return renderTemplateA(context);
  }
}
