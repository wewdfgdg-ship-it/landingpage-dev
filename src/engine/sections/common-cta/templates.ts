import {
  escapeHtml,
  renderBenefitList,
  renderSectionHeader,
} from "./components";
import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { CtaLayoutId, CtaRenderContext } from "./types";

const LAYOUT_CLASS: Record<CtaLayoutId, string> = {
  "CTA-A": "ct--a",
  "CTA-B": "ct--b",
  "CTA-C": "ct--c",
};

function renderShell(params: {
  sectionId: string;
  layoutId: CtaLayoutId;
  moodClass: string;
  brandColor: string;
  body: string;
}): string {
  const { sectionId, layoutId, moodClass, brandColor, body } = params;
  return `
<!-- LAYOUT: ${layoutId} -->
<section
  class="ct ${LAYOUT_CLASS[layoutId]} ${moodClass}"
  data-section="${sectionId}"
  data-layout="${layoutId}"
  style="--s-brand:${brandColor};"
>
  <div class="ct__inner">
    ${body}
  </div>
</section>
  `.trim();
}

function buildCtaGroup(input: CtaRenderContext["input"]): string {
  const primary = input.cta?.text ? { text: input.cta.text, href: input.cta.href, variant: "primary" as const } : undefined;
  const secondary = input.secondaryAction?.text ? { text: input.secondaryAction.text, href: input.secondaryAction.href, variant: "secondary" as const } : undefined;
  return renderGlobalCtaGroup(primary, secondary, input.microCopy);
}

/** CTA-A: Centered Conversion */
export function renderTemplateA({ input }: CtaRenderContext): string {
  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      ${input.body ? `<p class="ct__body">${escapeHtml(input.body)}</p>` : ""}
      ${buildCtaGroup(input)}
    `,
  });
}

/** CTA-B: Benefit Stack CTA */
export function renderTemplateB({ input }: CtaRenderContext): string {
  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      ${input.body ? `<p class="ct__body">${escapeHtml(input.body)}</p>` : ""}
      ${renderBenefitList(input.benefits)}
      ${buildCtaGroup(input)}
    `,
  });
}

/** CTA-C: Visual CTA Banner */
export function renderTemplateC({ input }: CtaRenderContext): string {
  const bgStyle = input.backgroundImageUrl
    ? `background-image: url('${escapeHtml(input.backgroundImageUrl)}');`
    : "";

  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${bgStyle ? `<div class="ct__bg" style="${bgStyle}"></div><div class="ct__overlay"></div>` : ""}
      <div class="ct__content">
        ${renderSectionHeader(input)}
        ${input.body ? `<p class="ct__body">${escapeHtml(input.body)}</p>` : ""}
        ${renderBenefitList(input.benefits)}
        ${buildCtaGroup(input)}
      </div>
    `,
  });
}
