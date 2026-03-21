import { renderBenefitList, renderCta, renderDiscountBadge, renderGiftCalc, renderMicro, renderPlanCard, renderPriceBlock, renderSectionHeader } from "./components";
import type { PricingLayoutId, PricingRenderContext } from "./types";

const LC: Record<PricingLayoutId, string> = { "PR-A": "pc--a", "PR-B": "pc--b", "PR-C": "pc--c" };

function shell(p: { sectionId: string; layoutId: PricingLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="pc ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--pc-brand:${p.brandColor};"><div class="pc__inner">${p.body}</div></section>`;
}

/** PR-A: 가격 전면형 */
export function renderTemplateA({ input }: PricingRenderContext): string {
  return shell({ ...input, body: `${renderDiscountBadge(input.discount)}${renderSectionHeader(input)}${renderPriceBlock(input.originalPrice, input.salePrice)}${renderBenefitList(input.benefits)}${renderCta(input.cta)}${renderMicro(input.microCopy)}` });
}

/** PR-B: 플랜 비교형 */
export function renderTemplateB({ input }: PricingRenderContext): string {
  return shell({ ...input, body: `${renderSectionHeader(input)}<div class="pc__plans">${input.plans.map(renderPlanCard).join("")}</div>${renderMicro(input.microCopy)}` });
}

/** PR-C: 혜택 계산형 */
export function renderTemplateC({ input }: PricingRenderContext): string {
  return shell({ ...input, body: `${renderDiscountBadge(input.discount)}${renderSectionHeader(input)}${renderGiftCalc(input.giftItems, input.originalPrice, input.salePrice)}${renderBenefitList(input.benefits)}${renderCta(input.cta)}${renderMicro(input.microCopy)}` });
}
