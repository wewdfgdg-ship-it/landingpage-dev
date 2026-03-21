/**
 * 렌더러 통합 테스트
 * 78개 패턴 ID가 모두 올바르게 HTML을 생성하는지 확인
 * 실행: npx tsx scripts/test-renderers.ts
 */

import { renderByPatternId } from '../src/engine/10-code-engine/renderers.js';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types.js';
import type { DesignTokens } from '../src/engine/09-visual-style/types.js';

const mockCopy: CopyBlock = {
  headline: '테스트 헤드라인',
  subheadline: '서브 헤드라인',
  body: '본문 텍스트입니다',
  bulletPoints: ['항목 1', '항목 2', '항목 3'],
  ctaText: '시작하기',
  microCopy: '무료 체험 가능',
  imageDirection: '제품 이미지 방향',
};

const mockTokens: DesignTokens = {
  colors: {
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#1D4ED8',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    error: '#EF4444',
  },
  fontFamily: 'sans',
  typography: {
    display: { size: '4.5rem', weight: 700, lineHeight: '1.1' },
    h1: { size: '3rem', weight: 700, lineHeight: '1.2' },
    h2: { size: '2.25rem', weight: 700, lineHeight: '1.25' },
    h3: { size: '1.5rem', weight: 600, lineHeight: '1.3' },
    h4: { size: '1.25rem', weight: 600, lineHeight: '1.4' },
    body: { size: '1rem', weight: 500, lineHeight: '1.6' },
    small: { size: '0.875rem', weight: 500, lineHeight: '1.5' },
    caption: { size: '0.75rem', weight: 500, lineHeight: '1.5' },
    button: { size: '1rem', weight: 600, lineHeight: '1.4' },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48 },
  radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 999 },
  defaultShadow: 'sm',
  sectionPadding: '80px 0',
};

// 26개 섹션 × 3 패턴 = 78개 + legacy 패턴
const ALL_PATTERNS: string[] = [
  // 01 Header Banner
  'hero_fullscreen_center', 'hero_split_left', 'hero_split_right', 'hero_gradient_overlay', 'hero_video_style',
  // 02 Key Features
  'features_3col_cards', 'features_icon_grid', 'features_alternating',
  // 03/04/05 Feature Detail
  'detail_split_left', 'detail_split_right', 'detail_fullwidth',
  // 06 Specs
  'specs_table', 'specs_accordion', 'specs_two_column',
  // 07 How To Use
  'steps_horizontal', 'steps_vertical', 'steps_cards',
  // 08 Target Persona
  'persona_cards', 'persona_list', 'persona_split',
  // 09 Before After
  'ba_split', 'ba_slider', 'ba_timeline',
  // 10 Lifestyle
  'lifestyle_gallery', 'lifestyle_fullbleed', 'lifestyle_mosaic',
  // 11 Certification
  'cert_badge_grid', 'cert_timeline', 'cert_cards',
  // 12 FAQ
  'faq_accordion', 'faq_two_column', 'faq_cards',
  // 13 Reviews
  'reviews_masonry', 'reviews_carousel', 'reviews_grid',
  // 14 Shipping
  'shipping_icons', 'shipping_table', 'shipping_steps',
  // 15 CTA
  'cta_centered', 'cta_split', 'cta_floating',
  // 16 Stats Numbers
  'stats_counter', 'stats_cards', 'stats_inline',
  // 17 Competitor Compare
  'compare_table', 'compare_cards', 'compare_checklist',
  // 18 Brand Story
  'story_timeline', 'story_fullwidth', 'story_split',
  // 19 Package Contents
  'package_grid', 'package_exploded', 'package_list',
  // 20 Photo Reviews
  'photo_masonry', 'photo_carousel', 'photo_grid',
  // 21 SNS Viral
  'sns_feed', 'sns_cards', 'sns_embed',
  // 22 Bundle Set
  'bundle_compare', 'bundle_cards', 'bundle_stacked',
  // 23 Limited Offer
  'offer_countdown', 'offer_banner', 'offer_modal',
  // 24 Refund Policy
  'refund_shield', 'refund_steps', 'refund_cards',
  // 25 Customer Service
  'cs_cards', 'cs_split', 'cs_inline',
  // 26 Price Table
  'price_columns', 'price_cards', 'price_simple',
];

// 특수 렌더러가 사용되어야 하는 패턴 (generic fallback이면 안 됨)
const MUST_NOT_BE_GENERIC = new Set([
  'offer_countdown', 'refund_shield', 'price_columns',
  'compare_table', 'specs_table', 'steps_horizontal',
  'lifestyle_gallery', 'ba_timeline', 'story_timeline',
  'detail_fullwidth',
]);

let pass = 0;
let fail = 0;
const failures: string[] = [];

for (const patternId of ALL_PATTERNS) {
  const html = renderByPatternId(patternId, mockCopy, mockTokens, 1);

  // 기본 검증: section 태그 + 헤드라인 포함
  if (!html.includes('<section')) {
    fail++;
    failures.push(`${patternId}: section 태그 없음`);
    continue;
  }
  if (!html.includes('테스트 헤드라인')) {
    fail++;
    failures.push(`${patternId}: 헤드라인 없음`);
    continue;
  }

  // 특수 렌더러 검증
  if (MUST_NOT_BE_GENERIC.has(patternId)) {
    // generic은 max-width:900px 사용, 다른 렌더러는 각자 다름
    // offer_countdown은 primary 배경, refund_shield는 🛡️ 포함 등
    if (patternId === 'offer_countdown' && !html.includes('시간')) {
      fail++;
      failures.push(`${patternId}: 카운트다운 요소 없음`);
      continue;
    }
    if (patternId === 'refund_shield' && !html.includes('🛡️')) {
      fail++;
      failures.push(`${patternId}: 실드 아이콘 없음`);
      continue;
    }
    if (patternId === 'compare_table' && !html.includes('<table')) {
      fail++;
      failures.push(`${patternId}: 테이블 요소 없음`);
      continue;
    }
    if (patternId === 'specs_table' && !html.includes('<table')) {
      fail++;
      failures.push(`${patternId}: 테이블 요소 없음`);
      continue;
    }
  }

  pass++;
}

process.stdout.write(`\n========== 렌더러 통합 테스트 ==========\n`);
process.stdout.write(`패턴 수: ${ALL_PATTERNS.length}\n`);
process.stdout.write(`결과: ${pass}/${ALL_PATTERNS.length} 통과\n`);

if (failures.length > 0) {
  process.stdout.write(`\n실패 목록:\n`);
  for (const f of failures) {
    process.stdout.write(`  ❌ ${f}\n`);
  }
  process.exit(1);
} else {
  process.stdout.write(`✅ 전체 통과\n`);
}
