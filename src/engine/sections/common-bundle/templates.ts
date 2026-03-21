import { renderCta, renderHeader, renderItemCard, renderMainItem, renderMicro, renderPriceBlock } from "./components";
import type { BundleLayoutId, BundleRenderContext } from "./types";

const LC: Record<BundleLayoutId, string> = { "BN-A": "bn--a", "BN-B": "bn--b" };

function shell(p: { sectionId: string; layoutId: BundleLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="bn ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--bn-brand:${p.brandColor};"><div class="bn__inner">${p.body}</div></section>`;
}

/** BN-A: 그리드 나열 */
export function renderTemplateA({ input }: BundleRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}<div class="bn__grid">${input.items.map(renderItemCard).join("")}</div>${renderPriceBlock(input.totalValue, input.salePrice)}${renderCta(input.cta)}${renderMicro(input.microCopy)}` });
}

/** BN-B: 메인 + 서브 분리 */
export function renderTemplateB({ input }: BundleRenderContext): string {
  const [main, ...rest] = input.items;
  return shell({ ...input, body: `${renderHeader(input)}${main ? renderMainItem(main) : ""}<div class="bn__sub-grid">${rest.map(renderItemCard).join("")}</div>${renderPriceBlock(input.totalValue, input.salePrice)}${renderCta(input.cta)}${renderMicro(input.microCopy)}` });
}
