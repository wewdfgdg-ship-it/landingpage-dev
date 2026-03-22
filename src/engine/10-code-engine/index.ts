import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';
import type { GeneratedPage, RenderedSection } from './types';
import { renderSection } from './template-engine';
import { generateTrackingScript } from '@/engine/12-learning-loop/tracking-script';
import {
  FONT_FAMILY_MAP,
  MOBILE_BREAKPOINT,
  MOBILE_STYLES,
  STICKY_CTA_STYLES,
  HTML_META,
  SECTION_DATA_ATTRS,
  PAGE_TITLE_SUFFIX,
} from './rules';
export type { GeneratedPage } from './types';

// ============================================================
// Code Engine — 규칙 엔진 (AI 호출 없음)
// 엔진 결과 → HTML 코드 변환
// ============================================================

// --- 글로벌 CSS 생성 ---

function buildGlobalCss(style: StyleConfig): string {
  const c = style.tokens.colors;
  const ff = FONT_FAMILY_MAP[style.tokens.fontFamily];

  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{font-family:${ff};color:${c.textPrimary};background:${c.background};line-height:1.6;-webkit-font-smoothing:antialiased;}
img{max-width:100%;height:auto;display:block;}
a{color:inherit;text-decoration:none;}
@media(max-width:${MOBILE_BREAKPOINT}px){
  section{padding:${MOBILE_STYLES.sectionPadding} !important;}
  h1{font-size:${MOBILE_STYLES.h1FontSize} !important;}
  h2{font-size:${MOBILE_STYLES.h2FontSize} !important;}
  [style*="flex-direction:row"],[style*="flex-direction: row"]{flex-direction:column !important;}
  [style*="min-height:100vh"]{min-height:auto !important;padding-top:${MOBILE_STYLES.minHeightPadding} !important;padding-bottom:${MOBILE_STYLES.minHeightPadding} !important;}
}`.trim();
}

// --- HTML 문서 조립 ---

function assembleHtml(
  meta: { title: string; description: string },
  globalCss: string,
  sectionsHtml: string,
  stickyCtaEnabled: boolean,
  primaryColor: string,
  trackingHtml: string,
): string {
  const stickyBar = stickyCtaEnabled
    ? `<div style="position:fixed;bottom:0;left:0;right:0;background:${primaryColor};color:#fff;padding:${STICKY_CTA_STYLES.padding};display:flex;align-items:center;justify-content:center;gap:16px;z-index:${STICKY_CTA_STYLES.zIndex};box-shadow:0 -2px 10px rgba(0,0,0,0.1);">
  <span style="font-weight:600;">${STICKY_CTA_STYLES.defaultText}</span>
  <a href="#cta" style="display:inline-block;padding:${STICKY_CTA_STYLES.buttonPadding};background:#fff;color:${primaryColor};border-radius:${STICKY_CTA_STYLES.buttonRadius};font-weight:600;text-decoration:none;">${STICKY_CTA_STYLES.buttonText}</a>
</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="${HTML_META.lang}">
<head>
<meta charset="${HTML_META.charset}">
<meta name="viewport" content="${HTML_META.viewport}">
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<link rel="preconnect" href="${HTML_META.fontPreconnect}">
<link href="${HTML_META.fontUrl}" rel="stylesheet">
<style>${globalCss}</style>
</head>
<body>
${sectionsHtml}
${stickyBar}
${trackingHtml}
</body>
</html>`;
}

// --- 메인 엔진 ---

export function runCodeEngine(
  productName: string,
  copyBlocks: CopyBlocks,
  layoutConfig: LayoutConfig,
  styleConfig: StyleConfig,
  stickyCtaEnabled: boolean,
  projectId?: string,
): GeneratedPage {
  const globalCss = buildGlobalCss(styleConfig);
  const tokens = styleConfig.tokens;
  const sections: RenderedSection[] = [];

  for (const sectionLayout of layoutConfig.sections) {
    const sectionCopy = copyBlocks.sections.find(
      (s) => s.sectionOrder === sectionLayout.order,
    );

    const copy = sectionCopy?.copy ?? {
      headline: sectionLayout.sectionType,
      subheadline: '',
      body: '',
      bulletPoints: [],
      ctaText: '',
      microCopy: '',
      imageDirection: '',
    };

    const html = renderSection(
      sectionLayout.selectedPattern,
      copy,
      tokens,
      sectionLayout.order,
    );

    sections.push({
      order: sectionLayout.order,
      role: sectionLayout.role,
      sectionType: sectionLayout.sectionType,
      patternId: sectionLayout.selectedPattern,
      html,
      css: '',
    });
  }

  const sectionsHtml = sections
    .sort((a, b) => a.order - b.order)
    .map((s) => `<div ${SECTION_DATA_ATTRS.idAttr}="${SECTION_DATA_ATTRS.idPrefix}${s.order}" ${SECTION_DATA_ATTRS.orderAttr}="${s.order}">${s.html}</div>`)
    .join('\n');

  const meta = {
    title: `${productName} — ${PAGE_TITLE_SUFFIX}`,
    description: copyBlocks.sections[0]?.copy.subheadline ?? productName,
  };

  const trackingHtml = projectId ? generateTrackingScript(projectId) : '';

  const fullHtml = assembleHtml(
    meta,
    globalCss,
    sectionsHtml,
    stickyCtaEnabled,
    tokens.colors.primary,
    trackingHtml,
  );

  return {
    meta: { ...meta },
    globalCss,
    sections,
    fullHtml,
    totalSections: sections.length,
    generatedAt: new Date().toISOString(),
  };
}
