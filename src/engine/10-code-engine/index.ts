import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';
import type { GeneratedPage, RenderedSection } from './types';
import { renderByPatternId } from './renderers';
import { generateTrackingScript } from '@/engine/12-learning-loop/tracking-script';
export type { GeneratedPage } from './types';
import {
  FONT_FAMILY_CSS,
  MOBILE_BREAKPOINT,
  SECTION_DATA_PREFIX,
  STICKY_CTA_DEFAULT_TEXT,
  STICKY_CTA_BUTTON_TEXT,
  STICKY_CTA_HREF,
  GOOGLE_FONTS_URL,
} from './rules';

// ============================================================
// Code Engine — 규칙 엔진 (AI 호출 없음)
// 엔진 결과 → HTML 코드 변환
// ============================================================

// --- 글로벌 CSS 생성 ---

function buildGlobalCss(style: StyleConfig): string {
  const c = style.tokens.colors;
  const ff = FONT_FAMILY_CSS[style.tokens.fontFamily];

  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{font-family:${ff};color:${c.textPrimary};background:${c.background};line-height:1.6;-webkit-font-smoothing:antialiased;}
img{max-width:100%;height:auto;display:block;}
a{color:inherit;text-decoration:none;}
@media(max-width:${MOBILE_BREAKPOINT}px){
  section{padding:48px 16px !important;}
  h1{font-size:2rem !important;}
  h2{font-size:1.5rem !important;}
  [style*="flex-direction:row"],[style*="flex-direction: row"]{flex-direction:column !important;}
  [style*="min-height:100vh"]{min-height:auto !important;padding-top:80px !important;padding-bottom:80px !important;}
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
    ? `<div style="position:fixed;bottom:0;left:0;right:0;background:${primaryColor};color:#fff;padding:12px 24px;display:flex;align-items:center;justify-content:center;gap:16px;z-index:1000;box-shadow:0 -2px 10px rgba(0,0,0,0.1);">
  <span style="font-weight:600;">${STICKY_CTA_DEFAULT_TEXT}</span>
  <a href="${STICKY_CTA_HREF}" style="display:inline-block;padding:10px 24px;background:#fff;color:${primaryColor};border-radius:6px;font-weight:600;text-decoration:none;">${STICKY_CTA_BUTTON_TEXT}</a>
</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
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
    // 매칭되는 카피 찾기
    const sectionCopy = copyBlocks.sections.find(
      (s) => s.sectionOrder === sectionLayout.order,
    );

    // 카피가 없으면 기본 카피 생성
    const copy = sectionCopy?.copy ?? {
      headline: sectionLayout.sectionType,
      subheadline: '',
      body: '',
      bulletPoints: [],
      ctaText: '',
      microCopy: '',
      imageDirection: '',
    };

    const html = renderByPatternId(
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
      css: '', // 인라인 스타일 사용으로 개별 CSS 불필요
    });
  }

  // 전체 HTML 조립 (트래킹용 data-section-id 래퍼 추가)
  const sectionsHtml = sections
    .sort((a, b) => a.order - b.order)
    .map((s) => `<div data-section-id="${SECTION_DATA_PREFIX}${s.order}" data-section-order="${s.order}">${s.html}</div>`)
    .join('\n');

  const meta = {
    title: `${productName} — 랜딩 페이지`,
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
