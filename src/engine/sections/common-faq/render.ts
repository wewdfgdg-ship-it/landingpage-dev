import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type { FaqLayoutId, FaqRenderContext, FaqSectionNormalized } from "./types";

function pickLayout(input: FaqSectionNormalized): FaqLayoutId {
  const count = input.items.length;
  const shortAnswers = input.items.every((i) => i.answer.length < 40);
  if (count <= 4 && shortAnswers) return "FAQ-C";
  if (count <= 4) return "FAQ-B";
  return "FAQ-A";
}

export function renderFaqSection(input: FaqSectionNormalized): string {
  const layoutId = input.layoutId ?? pickLayout(input);
  const context: FaqRenderContext = { input: { ...input, layoutId } };
  switch (layoutId) {
    case "FAQ-B": return renderTemplateB(context);
    case "FAQ-C": return renderTemplateC(context);
    default: return renderTemplateA(context);
  }
}
