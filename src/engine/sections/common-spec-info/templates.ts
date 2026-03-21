import {
  escapeHtml,
  renderAnnotations,
  renderCta,
  renderFootnote,
  renderInfoCard,
  renderMetric,
  renderSectionHeader,
  renderSpecRow,
  renderStepItem,
} from "./components";
import type { SpecInfoLayoutId, SpecInfoRenderContext } from "./types";

const LAYOUT_CLASS: Record<SpecInfoLayoutId, string> = {
  "SI-A": "si--a",
  "SI-B": "si--b",
  "SI-C": "si--c",
};

function renderShell(params: {
  sectionId: string;
  layoutId: SpecInfoLayoutId;
  moodClass: string;
  brandColor: string;
  body: string;
}): string {
  const { sectionId, layoutId, moodClass, brandColor, body } = params;
  return `
<!-- LAYOUT: ${layoutId} -->
<section
  class="si ${LAYOUT_CLASS[layoutId]} ${moodClass}"
  data-section="${sectionId}"
  data-layout="${layoutId}"
  style="--si-brand:${brandColor};"
>
  <div class="si__inner">
    ${body}
  </div>
</section>
  `.trim();
}

/** SI-A: Diagram / Overlay Spec — 비주얼 위 수치/구조 오버레이 */
export function renderTemplateA({ input }: SpecInfoRenderContext): string {
  const heroHtml = input.heroImageUrl
    ? `<div class="si__hero-wrap">
        <img class="si__hero-img" src="${escapeHtml(input.heroImageUrl)}" alt="${escapeHtml(input.headline)}" loading="lazy" />
        ${renderAnnotations(input.annotations)}
        ${renderMetric(input.metric, input.metricLabel)}
      </div>`
    : "";

  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      ${heroHtml}
      <div class="si__rows">
        ${input.items.map((item) => renderSpecRow(item)).join("")}
      </div>
      ${renderFootnote(input.footnote)}
      ${renderCta(input.cta)}
    `,
  });
}

/** SI-B: Editorial Explain — 단계형 스텝 */
export function renderTemplateB({ input }: SpecInfoRenderContext): string {
  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      <div class="si__steps">
        ${input.items.map((item, i) => renderStepItem(item, i, input.numbered)).join("")}
      </div>
      ${renderFootnote(input.footnote)}
      ${renderCta(input.cta)}
    `,
  });
}

/** SI-C: Info Panel / Structured Grid — 카드 정리형 */
export function renderTemplateC({ input }: SpecInfoRenderContext): string {
  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      ${renderMetric(input.metric, input.metricLabel)}
      <div class="si__grid">
        ${input.items.map((item) => renderInfoCard(item)).join("")}
      </div>
      ${renderFootnote(input.footnote)}
      ${renderCta(input.cta)}
    `,
  });
}
