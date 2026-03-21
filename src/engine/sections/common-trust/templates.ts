import { renderAwardBadge, renderCta, renderFeaturedAward, renderHeader, renderMediaLogo } from "./components";
import type { TrustLayoutId, TrustRenderContext } from "./types";
const LC: Record<TrustLayoutId, string> = { "TR-A": "tr--a", "TR-B": "tr--b", "TR-C": "tr--c" };
function shell(p: { sectionId: string; layoutId: TrustLayoutId; moodClass: string; brandColor: string; body: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="tr ${LC[p.layoutId]} ${p.moodClass}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--tr-brand:${p.brandColor};"><div class="tr__inner">${p.body}</div></section>`;
}
export function renderTemplateA({ input }: TrustRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}<div class="tr__grid">${input.awards.map(renderAwardBadge).join("")}</div>${renderCta(input.cta)}` });
}
export function renderTemplateB({ input }: TrustRenderContext): string {
  const featured = input.featuredAward || input.awards[0];
  const strip = input.featuredAward ? input.awards : input.awards.slice(1);
  return shell({ ...input, body: `${renderHeader(input)}${featured ? renderFeaturedAward(featured) : ""}<div class="tr__strip">${strip.map(renderAwardBadge).join("")}</div>${renderCta(input.cta)}` });
}
export function renderTemplateC({ input }: TrustRenderContext): string {
  return shell({ ...input, body: `${renderHeader(input)}<div class="tr__logos">${input.mediaLogos.map(renderMediaLogo).join("")}</div>${renderCta(input.cta)}` });
}
