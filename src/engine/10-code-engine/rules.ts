// ============================================================
// Code Engine — 규칙/상수
// 폰트 패밀리 CSS 문자열, 반응형 미디어 쿼리 설정
// ============================================================

import type { FontFamily } from '@/engine/09-visual-style/types';

/** 폰트 패밀리 → CSS font-family 문자열 매핑 */
export const FONT_FAMILY_CSS: Record<FontFamily, string> = {
  serif: "'Noto Serif KR', Georgia, serif",
  mono: "'JetBrains Mono', 'Noto Sans KR', monospace",
  sans: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif",
};

/** 모바일 분기점 (px) */
export const MOBILE_BREAKPOINT = 768;

/** 섹션 트래킹용 data 속성 접두사 */
export const SECTION_DATA_PREFIX = 's';

/** Sticky CTA 기본 문구 */
export const STICKY_CTA_DEFAULT_TEXT = '지금 시작하세요';

/** Sticky CTA 버튼 기본 문구 */
export const STICKY_CTA_BUTTON_TEXT = '시작하기';

/** Sticky CTA 앵커 링크 */
export const STICKY_CTA_HREF = '#cta';

/** Google Fonts URL (Pretendard 대체) */
export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap';
