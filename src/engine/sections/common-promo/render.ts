import { renderTemplateA, renderTemplateB } from "./templates";
import type { PromoLayoutId, PromoRenderContext, PromoSectionNormalized } from "./types";
export function renderPromoSection(input: PromoSectionNormalized): string {
  const layoutId = input.layoutId ?? (input.deadline ? "PL-A" : "PL-B");
  const ctx: PromoRenderContext = { input: { ...input, layoutId } };
  return layoutId === "PL-B" ? renderTemplateB(ctx) : renderTemplateA(ctx);
}
