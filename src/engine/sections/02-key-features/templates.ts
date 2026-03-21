import {
  renderCta,
  renderFeatureCard,
  renderFeatureGrid,
  renderFeatureRows,
  renderSectionHeader,
} from "./components";
import type { KeyFeaturesLayoutId, KeyFeaturesRenderContext } from "./types";

const LAYOUT_CLASS: Record<KeyFeaturesLayoutId, string> = {
  "KF-A": "kf--a",
  "KF-B": "kf--b",
  "KF-C": "kf--c",
};

function renderShell(params: {
  sectionId: string;
  layoutId: KeyFeaturesLayoutId;
  moodClass: string;
  brandColor: string;
  body: string;
}): string {
  const { sectionId, layoutId, moodClass, brandColor, body } = params;

  return `
<!-- LAYOUT: ${layoutId} -->
<section
  class="kf ${LAYOUT_CLASS[layoutId]} ${moodClass}"
  data-section="${sectionId}"
  data-layout="${layoutId}"
  style="--kf-brand:${brandColor};"
>
  <div class="kf__inner">
    ${body}
  </div>
</section>
  `.trim();
}

export function renderTemplateA({ input }: KeyFeaturesRenderContext): string {
  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      ${renderFeatureGrid(input.features)}
      ${renderCta(input.cta)}
    `,
  });
}

export function renderTemplateB({ input }: KeyFeaturesRenderContext): string {
  const [featured, ...rest] = input.features;

  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      <div class="kf__split">
        <div class="kf__split-main">
          ${featured ? renderFeatureCard(featured, { featured: true }) : ""}
        </div>
        <div class="kf__split-side">
          ${renderFeatureGrid(rest)}
        </div>
      </div>
      ${renderCta(input.cta)}
    `,
  });
}

export function renderTemplateC({ input }: KeyFeaturesRenderContext): string {
  return renderShell({
    sectionId: input.sectionId,
    layoutId: input.layoutId,
    moodClass: input.moodClass,
    brandColor: input.brandColor,
    body: `
      ${renderSectionHeader(input)}
      ${renderFeatureRows(input.features)}
      ${renderCta(input.cta)}
    `,
  });
}
