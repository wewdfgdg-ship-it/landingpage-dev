import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type {
  SpecInfoLayoutId,
  SpecInfoRenderContext,
  SpecInfoSectionNormalized,
} from "./types";

function pickLayout(input: SpecInfoSectionNormalized): SpecInfoLayoutId {
  const hasSteps = input.numbered || input.items.some((item) => Boolean(item.imageUrl));
  const hasOverlay = Boolean(input.heroImageUrl) || input.annotations.length > 0 || Boolean(input.metric);
  const itemCount = input.items.length;

  if (hasOverlay) return "SI-A";
  if (hasSteps) return "SI-B";
  if (itemCount <= 4) return "SI-C";
  return "SI-A";
}

function resolveLayout(input: SpecInfoSectionNormalized): SpecInfoLayoutId {
  return input.layoutId ?? pickLayout(input);
}

export function renderSpecInfoSection(input: SpecInfoSectionNormalized): string {
  const layoutId = resolveLayout(input);

  const context: SpecInfoRenderContext = {
    input: { ...input, layoutId },
  };

  switch (layoutId) {
    case "SI-B":
      return renderTemplateB(context);
    case "SI-C":
      return renderTemplateC(context);
    case "SI-A":
    default:
      return renderTemplateA(context);
  }
}
