import { renderSection } from '../src/engine/10-code-engine/template-engine.js';
import { FONT_FAMILY_MAP } from '../src/engine/10-code-engine/rules.js';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types.js';
import type { DesignTokens } from '../src/engine/09-visual-style/types.js';
import * as fs from 'node:fs';

// ============================================================
// 16개 v2 템플릿 쇼케이스 — 더미 카피 + Unsplash 이미지
// ============================================================

const IMG = {
  bedroom: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  pillow: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=800&q=80',
  sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  room: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
};

const tokens: DesignTokens = {
  colors: {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#DBEAFE',
    secondary: '#7C3AED',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    error: '#EF4444',
  },
  typography: {
    display: { size: '4.5rem', weight: 700, lineHeight: '1.1' },
    h1: { size: '3rem', weight: 700, lineHeight: '1.2' },
    h2: { size: '2.25rem', weight: 700, lineHeight: '1.25' },
    h3: { size: '1.5rem', weight: 600, lineHeight: '1.3' },
    h4: { size: '1.25rem', weight: 600, lineHeight: '1.4' },
    body: { size: '1rem', weight: 500, lineHeight: '1.6' },
    small: { size: '0.875rem', weight: 500, lineHeight: '1.5' },
    button: { size: '1rem', weight: 600, lineHeight: '1.4' },
    caption: { size: '0.75rem', weight: 500, lineHeight: '1.5' },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 48, '2xl': 64 },
  radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  fontFamily: 'sans',
  sectionPadding: '100px 24px',
  defaultShadow: 'md',
};

function makeCopy(overrides: Partial<CopyBlock> = {}): CopyBlock {
  return {
    headline: '여기에 제목이 들어갑니다',
    subheadline: '여기에 서브카피가 들어갑니다',
    body: '본문 텍스트입니다. 제품의 핵심 가치를 전달합니다.',
    bulletPoints: [
      '첫 번째 핵심 포인트',
      '두 번째 핵심 포인트',
      '세 번째 핵심 포인트',
    ],
    ctaText: '지금 시작하기',
    microCopy: '14일 무료 체험, 언제든 해지 가능',
    imageDirection: '',
    ...overrides,
  };
}

interface ShowcaseItem {
  patternId: string;
  label: string;
  copy: CopyBlock;
}

const sections: ShowcaseItem[] = [
  // === HERO (4) ===
  {
    patternId: 'hero_fullscreen_center',
    label: 'Hero — Fullscreen Center',
    copy: makeCopy({
      headline: '당신의 하루를 바꾸는 한 줄',
      subheadline: '더 나은 내일을 위한 첫 걸음, 지금 시작하세요',
    }),
  },
  {
    patternId: 'hero_left_right',
    label: 'Hero — Left Right',
    copy: makeCopy({
      headline: '아침이 다시 기대되는 밤',
      subheadline: '7존 맞춤 지지로 허리 통증 없는 숙면',
      imageUrl: IMG.bedroom,
    }),
  },
  {
    patternId: 'hero_product_center',
    label: 'Hero — Product Center',
    copy: makeCopy({
      headline: '과학이 만든 완벽한 잠',
      subheadline: '100일 무료 체험으로 직접 경험하세요',
      imageUrl: IMG.pillow,
    }),
  },
  {
    patternId: 'hero_split',
    label: 'Hero — Split',
    copy: makeCopy({
      headline: '잠이 달라지면 인생이 달라집니다',
      subheadline: '매일 새벽 뒤척이던 당신을 위한 해답',
      imageUrl: IMG.bedroom,
    }),
  },

  // === FEATURE (4) ===
  {
    patternId: 'feat_3col_grid',
    label: 'Feature — 3Col Grid',
    copy: makeCopy({
      headline: '왜 우리 제품인가',
      subheadline: '다른 매트리스와 확실히 다른 3가지',
      bulletPoints: [
        '7존 체압분산 기술',
        '100일 무료 체험',
        '10년 품질 보증',
        '국내 직접 제조',
        '당일 배송',
        '무료 반품',
      ],
    }),
  },
  {
    patternId: 'feat_icon_list',
    label: 'Feature — Icon List',
    copy: makeCopy({
      headline: '이렇게 달라집니다',
      subheadline: '슬립웰 매트리스의 핵심 기능',
      bulletPoints: [
        '개인 체형에 맞는 7존 맞춤 지지',
        '통기성 좋은 프리미엄 소재',
        '움직임 전달 차단 기술',
        '항균 방진드기 처리',
      ],
    }),
  },
  {
    patternId: 'feat_numbered_steps',
    label: 'Feature — Numbered Steps',
    copy: makeCopy({
      headline: '간단한 3단계',
      subheadline: '주문부터 설치까지 쉽고 빠르게',
      bulletPoints: [
        '온라인 주문',
        '무료 배송 및 설치',
        '100일 체험 시작',
      ],
    }),
  },
  {
    patternId: 'feat_zigzag',
    label: 'Feature — Zigzag',
    copy: makeCopy({
      headline: '과학이 만든 완벽한 잠',
      subheadline: '머리부터 발끝까지 맞춤 지지',
      imageUrl: IMG.sofa,
      bulletPoints: [
        '7존 체압분산 → 척추 정렬',
        '100일 무료 체험 → 실제 변화 확인',
        '국내 제조 A/S → 10년 보증',
      ],
    }),
  },

  // === PROOF (2) ===
  {
    patternId: 'proof_testimonial_card',
    label: 'Proof — Testimonial Card',
    copy: makeCopy({
      headline: '실제 고객 후기',
      bulletPoints: [
        '허리 통증이 사라졌어요. 인생 매트리스입니다.',
        '남편이 코골이가 줄었다고 좋아합니다.',
        '호텔보다 우리 집 침대가 더 좋아졌어요.',
      ],
    }),
  },
  {
    patternId: 'proof_number_counter',
    label: 'Proof — Number Counter',
    copy: makeCopy({
      headline: '숫자로 증명합니다',
      bulletPoints: [
        '50,000+ 누적 판매',
        '98% 고객 만족도',
        '4.9 평균 별점',
        '365일 고객 지원',
      ],
    }),
  },

  // === PRICING (2) ===
  {
    patternId: 'price_3col_compare',
    label: 'Pricing — 3Col Compare',
    copy: makeCopy({
      headline: '나에게 맞는 플랜',
      subheadline: '모든 플랜 100일 무료 체험 포함',
      body: 'Basic 무료 / Pro 29,000원 / Premium 59,000원',
      bulletPoints: [
        '기본 지지력',
        '표준 사이즈',
        '1년 보증',
        '7존 맞춤 지지',
        '모든 사이즈',
        '5년 보증',
        '프리미엄 소재',
        '맞춤 제작',
        '10년 보증',
      ],
    }),
  },
  {
    patternId: 'price_single_card',
    label: 'Pricing — Single Card',
    copy: makeCopy({
      headline: '지금이 가장 좋은 가격',
      subheadline: '런칭 특별가, 곧 정상가로 돌아갑니다',
      body: '590,000원 → 390,000원',
      bulletPoints: [
        '7존 체압분산 매트리스',
        '프리미엄 커버 포함',
        '무료 배송 + 설치',
        '100일 무료 체험',
        '10년 품질 보증',
      ],
    }),
  },

  // === CTA (2) ===
  {
    patternId: 'cta_center',
    label: 'CTA — Center',
    copy: makeCopy({
      headline: '더 나은 내일을 위한 첫 걸음',
      subheadline: '지금 시작하면 100일 무료 체험',
      bulletPoints: ['무료 배송', '100일 체험', '언제든 반품'],
    }),
  },
  {
    patternId: 'cta_full_banner',
    label: 'CTA — Full Banner',
    copy: makeCopy({
      headline: '오늘 밤부터 달라지는 잠',
      subheadline: '지금 주문하면 내일 도착',
      bulletPoints: ['한정 수량 특별가 진행 중'],
    }),
  },

  // === FAQ (1) ===
  {
    patternId: 'faq_accordion',
    label: 'FAQ — Accordion',
    copy: makeCopy({
      headline: '자주 묻는 질문',
      bulletPoints: [
        '배송은 얼마나 걸리나요?',
        '주문 후 1~2일 내 무료 배송됩니다.',
        '100일 체험은 어떻게 진행되나요?',
        '제품 수령 후 100일간 사용하시고, 만족하지 않으시면 무료 반품 가능합니다.',
        '사이즈 교환이 가능한가요?',
        '네, 수령 후 7일 이내 무료 교환 가능합니다.',
      ],
    }),
  },

  // === MISC (1) ===
  {
    patternId: 'misc_before_after',
    label: 'Misc — Before/After',
    copy: makeCopy({
      headline: '이 매트리스 하나로 달라진 아침',
      subheadline: '같은 시간을 자도, 잠의 질이 다릅니다',
      bulletPoints: [
        '새벽 2시마다 뒤척임 → 만성 수면 부족',
        '아침마다 허리 통증 → 컨디션 저하',
        '7시간 숙면 → 알람 없이 개운하게 기상',
        '체형 맞춤 지지 → 허리 통증 없는 아침',
      ],
    }),
  },
];

// === 렌더링 ===

const globalCss = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{font-family:${FONT_FAMILY_MAP.sans};color:${tokens.colors.textPrimary};background:${tokens.colors.background};line-height:1.6;-webkit-font-smoothing:antialiased;}
img{max-width:100%;height:auto;display:block;}
a{color:inherit;text-decoration:none;}
.showcase-divider{padding:24px 48px;background:#0F172A;color:#fff;font-size:0.9rem;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;}
`;

const sectionsHtml = sections
  .map((item, idx) => {
    const html = renderSection(item.patternId, item.copy, tokens, idx + 1);
    return `<div class="showcase-divider">${idx + 1}. ${item.label}</div>\n${html}`;
  })
  .join('\n');

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>16 Templates Showcase</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${globalCss}</style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;

fs.writeFileSync('test-showcase.html', fullHtml);
fs.writeFileSync('db-test.txt', `SHOWCASE: ${sections.length} templates rendered\nHTML: ${fullHtml.length} bytes\n`);
process.exit(0);
