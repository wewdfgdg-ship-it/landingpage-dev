// ============================================================
// Code Engine — 타입 정의
// 엔진 결과를 HTML 코드로 변환
// ============================================================

export interface RenderedSection {
  order: number;
  role: string;
  sectionType: string;
  patternId: string;
  html: string;
  css: string;
}

export interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
}

export interface GeneratedPage {
  meta: PageMeta;
  globalCss: string;
  sections: RenderedSection[];
  fullHtml: string; // 최종 조립된 전체 HTML
  totalSections: number;
  generatedAt: string;
}
