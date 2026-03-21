import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type { LifestyleLayoutId, LifestyleRenderContext, LifestyleSectionNormalized } from "./types";

function pickLayout(input: LifestyleSectionNormalized): LifestyleLayoutId {
  if (input.images.length >= 3) return "LS-C";
  if (input.subheadline && input.subheadline.length > 30) return "LS-B";
  return "LS-A";
}

export function renderLifestyleSection(input: LifestyleSectionNormalized): string {
  const layoutId = input.layoutId ?? pickLayout(input);
  const context: LifestyleRenderContext = { input: { ...input, layoutId } };
  switch (layoutId) {
    case "LS-B": return renderTemplateB(context);
    case "LS-C": return renderTemplateC(context);
    default: return renderTemplateA(context);
  }
}
