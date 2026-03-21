import type { FontFamily } from '@/engine/09-visual-style/types';

// ============================================================
// Code Engine — 비즈니스 규칙
// ============================================================

// --- 폰트 패밀리 매핑 ---

export const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  serif: "'Noto Serif KR', Georgia, serif",
  mono: "'JetBrains Mono', 'Noto Sans KR', monospace",
  sans: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif",
} as const;

// --- 모바일 반응형 ---

export const MOBILE_BREAKPOINT = 768 as const;

export const MOBILE_STYLES = {
  sectionPadding: '48px 16px',
  h1FontSize: '2rem',
  h2FontSize: '1.5rem',
  minHeightPadding: '80px',
} as const;

// --- Sticky CTA 바 스타일 ---

export const STICKY_CTA_STYLES = {
  padding: '12px 24px',
  buttonPadding: '10px 24px',
  buttonRadius: '6px',
  zIndex: 1000,
  defaultText: '지금 시작하세요',
  buttonText: '시작하기',
} as const;

// --- HTML 문서 메타 ---

export const HTML_META = {
  lang: 'ko',
  charset: 'UTF-8',
  viewport: 'width=device-width,initial-scale=1',
  fontUrl: 'https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap',
  fontPreconnect: 'https://fonts.googleapis.com',
} as const;

// --- 섹션 데이터 속성 ---

export const SECTION_DATA_ATTRS = {
  idPrefix: 's',
  idAttr: 'data-section-id',
  orderAttr: 'data-section-order',
} as const;

// --- 페이지 타이틀 ---

export const PAGE_TITLE_SUFFIX = '랜딩 페이지' as const;
