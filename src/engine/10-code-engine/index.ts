import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';
import type { GeneratedPage, RenderedSection } from './types';
import { renderByPatternId } from './renderers';
import { renderWithTemplate } from './template-registry';
import { generateTrackingScript } from '@/engine/12-learning-loop/tracking-script';
import { renderHeroBanner } from '@/engine/sections/01-header-banner/render';
import type { LayoutData } from '@/engine/sections/01-header-banner/render';
export type { GeneratedPage } from './types';

// ============================================================
// Code Engine — 규칙 엔진 (AI 호출 없음)
// 엔진 결과 → HTML 코드 변환
// ============================================================

// --- 글로벌 CSS 생성 ---

function buildGlobalCss(style: StyleConfig): string {
  const c = style.tokens.colors;
  const ff =
    style.tokens.fontFamily === 'serif'
      ? "'Noto Serif KR', Georgia, serif"
      : style.tokens.fontFamily === 'mono'
        ? "'JetBrains Mono', 'Noto Sans KR', monospace"
        : "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif";

  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{font-family:${ff};color:${c.textPrimary};background:${c.background};line-height:1.6;-webkit-font-smoothing:antialiased;}
img{max-width:100%;height:auto;display:block;}
a{color:inherit;text-decoration:none;}
@media(max-width:768px){
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
  templateCss: string,
  sectionsHtml: string,
  stickyCtaEnabled: boolean,
  primaryColor: string,
  trackingHtml: string,
): string {
  const stickyBar = stickyCtaEnabled
    ? `<div style="position:fixed;bottom:0;left:0;right:0;background:${primaryColor};color:#fff;padding:12px 24px;display:flex;align-items:center;justify-content:center;gap:16px;z-index:1000;box-shadow:0 -2px 10px rgba(0,0,0,0.1);">
  <span style="font-weight:600;">지금 시작하세요</span>
  <a href="#cta" style="display:inline-block;padding:10px 24px;background:#fff;color:${primaryColor};border-radius:6px;font-weight:600;text-decoration:none;">시작하기</a>
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
<script src="https://cdn.tailwindcss.com"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${globalCss}
${templateCss}</style>
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

    // ── v4 Header-Banner: v4Meta가 있으면 전용 렌더러 사용 ──
    if (sectionLayout.v4Meta) {
      const v4 = sectionLayout.v4Meta;
      const layoutData: LayoutData = {
        layoutId: v4.layoutId as LayoutData['layoutId'],
        mood: v4.mood as LayoutData['mood'],
        fontSet: v4.fontSet as LayoutData['fontSet'],
        brandColor: v4.brandColor,
        productName,
        eyebrow: '',
        headline: copy.headline,
        subheadline: copy.subheadline,
        desc: copy.body,
        stats: [],
        awards: copy.bulletPoints,
        ctaText: copy.ctaText,
        microCopy: copy.microCopy,
        price: undefined,
        discount: undefined,
      };

      const v4Html = renderHeroBanner(layoutData);
      // v4 렌더러는 완전한 HTML 문서를 반환하므로 body 내용만 추출
      const bodyMatch = v4Html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const bodyHtml = bodyMatch?.[1] ?? v4Html;
      // head에서 style 태그 추출 (폰트 + 무드 CSS)
      const styleMatches = v4Html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) ?? [];
      const linkMatches = v4Html.match(/<link[^>]*>/gi) ?? [];
      const v4Css = styleMatches.map((s) => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
      const v4Links = linkMatches.join('\n');

      sections.push({
        order: sectionLayout.order,
        role: sectionLayout.role,
        sectionType: sectionLayout.sectionType,
        patternId: `v4_${v4.layoutId}`,
        html: `<!-- v4-font-links -->\n${v4Links}\n${bodyHtml}`,
        css: v4Css,
      });
      continue;
    }

    // v2 템플릿 우선, 없으면 v1 폴백
    const v2Result = renderWithTemplate(sectionLayout.selectedPattern, copy, tokens);
    const html = v2Result?.html ?? renderByPatternId(
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
      css: v2Result?.css ?? '',
    });
  }

  // v2 템플릿 CSS 수집
  const sectionCssSet = new Set<string>();
  for (const s of sections) {
    if (s.css) sectionCssSet.add(s.css);
  }
  const sectionCss = [...sectionCssSet].join('\n');

  // 전체 HTML 조립 (트래킹용 data-section-id 래퍼 추가)
  const sectionsHtml = sections
    .sort((a, b) => a.order - b.order)
    .map((s) => `<div data-section-id="s${s.order}" data-section-order="${s.order}">${s.html}</div>`)
    .join('\n');

  const meta = {
    title: `${productName} — 랜딩 페이지`,
    description: copyBlocks.sections[0]?.copy.subheadline ?? productName,
  };

  const trackingHtml = projectId ? generateTrackingScript(projectId) : '';

  const fullHtml = assembleHtml(
    meta,
    globalCss,
    sectionCss,
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
