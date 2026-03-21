import { renderAnnotations, renderBody, renderCaption, renderCta, renderHeader, renderImage, renderStat } from "./components";
import type { FeatureDetailLayoutId, FeatureDetailRenderContext } from "./types";

const LC: Record<FeatureDetailLayoutId, string> = { "FD-A": "fd--a", "FD-B": "fd--b", "FD-C": "fd--c" };

function shell(p: { sectionId: string; layoutId: FeatureDetailLayoutId; moodClass: string; brandColor: string; body: string; extra?: string }): string {
  return `<!-- LAYOUT: ${p.layoutId} -->\n<section class="fd ${LC[p.layoutId]} ${p.moodClass}${p.extra || ""}" data-section="${p.sectionId}" data-layout="${p.layoutId}" style="--fd-brand:${p.brandColor};"><div class="fd__inner">${p.body}</div></section>`;
}

/** FD-A: 텍스트 + 이미지 (좌우 교차) */
export function renderTemplateA({ input }: FeatureDetailRenderContext): string {
  const dir = input.imageRight ? " fd--img-right" : " fd--img-left";
  return shell({ ...input, extra: dir, body: `
    <div class="fd__split">
      <div class="fd__split-text">${renderHeader(input)}${renderBody(input.body, input.bulletPoints)}${renderCta(input.cta)}</div>
      <div class="fd__split-media">${renderImage(input.imageUrl, input.headline)}${renderAnnotations(input.annotations)}</div>
    </div>${renderCaption(input.caption, input.source)}` });
}

/** FD-B: 풀블리드 이미지 + 오버레이 */
export function renderTemplateB({ input }: FeatureDetailRenderContext): string {
  return shell({ ...input, body: `
    <div class="fd__visual">${renderImage(input.imageUrl, input.headline)}${renderAnnotations(input.annotations)}${renderStat(input.stat)}</div>
    <div class="fd__overlay-text">${renderHeader(input)}${renderBody(input.body, input.bulletPoints)}${renderCta(input.cta)}</div>
    ${renderCaption(input.caption, input.source)}` });
}

/** FD-C: 수치 강조 + 그래픽 */
export function renderTemplateC({ input }: FeatureDetailRenderContext): string {
  return shell({ ...input, body: `
    ${renderHeader(input)}${renderBody(input.body, input.bulletPoints)}
    <div class="fd__graphic">${renderImage(input.imageUrl, input.headline)}${renderStat(input.stat)}</div>
    ${renderCaption(input.caption, input.source)}${renderCta(input.cta)}` });
}
