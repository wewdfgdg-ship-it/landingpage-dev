import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type { CtaLayoutId, CtaRenderContext, CtaSectionNormalized } from "./types";

function pickLayout(input: CtaSectionNormalized): CtaLayoutId {
  if (input.backgroundImageUrl) return "CTA-C";
  if (input.benefits.length >= 2) return "CTA-B";
  return "CTA-A";
}

function resolveLayout(input: CtaSectionNormalized): CtaLayoutId {
  return input.layoutId ?? pickLayout(input);
}

export function renderCtaSection(input: CtaSectionNormalized): string {
  const layoutId = resolveLayout(input);
  const context: CtaRenderContext = { input: { ...input, layoutId } };

  switch (layoutId) {
    case "CTA-B": return renderTemplateB(context);
    case "CTA-C": return renderTemplateC(context);
    case "CTA-A": default: return renderTemplateA(context);
  }
}
