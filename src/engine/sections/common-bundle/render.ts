import { renderTemplateA, renderTemplateB } from "./templates";
import type { BundleLayoutId, BundleRenderContext, BundleSectionNormalized } from "./types";

function pickLayout(input: BundleSectionNormalized): BundleLayoutId {
  return input.items.length >= 5 ? "BN-B" : "BN-A";
}

export function renderBundleSection(input: BundleSectionNormalized): string {
  const layoutId = input.layoutId ?? pickLayout(input);
  const context: BundleRenderContext = { input: { ...input, layoutId } };
  return layoutId === "BN-B" ? renderTemplateB(context) : renderTemplateA(context);
}
