import { renderBenefits, renderCountdown, renderCta, renderHeader, renderMicro, renderStockBar, renderUrgencyBar } from "./components";
import type { PromoLayoutId, PromoRenderContext } from "./types";
const LC: Record<PromoLayoutId, string> = { "PL-A": "pl--a", "PL-B": "pl--b" };
function shell(p: { sectionId: string; layoutId: PromoLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="pl ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--pl-brand:${p.brandColor};"><div class="pl__inner">${p.body}</div></section>`;
}
/** PL-A: 긴급 배너 + 카운트다운 */
export function renderTemplateA({ input }: PromoRenderContext): string {
  return shell({ ...input, body: `${renderUrgencyBar(input.deadline)}${renderHeader(input)}${renderCountdown()}${renderStockBar(input.stockPercent)}${renderCta(input.cta)}${renderMicro(input.microCopy)}` });
}
/** PL-B: 혜택 패키지 강조 */
export function renderTemplateB({ input }: PromoRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}${renderBenefits(input.benefits)}${renderCta(input.cta)}${renderMicro(input.microCopy)}` });
}
