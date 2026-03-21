import { renderTemplateA, renderTemplateB, renderTemplateC } from "./templates";
import type {
  KeyFeaturesLayoutId,
  KeyFeaturesRenderContext,
  KeyFeaturesSectionNormalized,
} from "./types";

function pickLayout(input: KeyFeaturesSectionNormalized): KeyFeaturesLayoutId {
  const featureCount = input.features.length;
  const imageCount = input.features.filter((item) => Boolean(item.imageUrl)).length;
  const hasLongCopy =
    (input.subheadline?.length ?? 0) > 44 ||
    input.features.some((item) => (item.description?.length ?? 0) > 48);

  if (imageCount >= 2) return "KF-B";
  if (featureCount >= 5 || hasLongCopy) return "KF-C";
  return "KF-A";
}

function resolveLayout(input: KeyFeaturesSectionNormalized): KeyFeaturesLayoutId {
  return input.layoutId ?? pickLayout(input);
}

export function renderKeyFeaturesSection(
  input: KeyFeaturesSectionNormalized
): string {
  const layoutId = resolveLayout(input);

  const context: KeyFeaturesRenderContext = {
    input: {
      ...input,
      layoutId,
    },
  };

  switch (layoutId) {
    case "KF-B":
      return renderTemplateB(context);
    case "KF-C":
      return renderTemplateC(context);
    case "KF-A":
    default:
      return renderTemplateA(context);
  }
}
