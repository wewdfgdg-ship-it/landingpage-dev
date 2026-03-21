/**
 * 렌더러 테스트 — HTML 파일 출력
 * 실행: npx tsx scripts/test-hero-renderer.ts
 * 결과: scripts/test-hero-output.html → 브라우저에서 열기
 */
import { writeFileSync } from 'fs';
import {
  renderHeroFullscreenCenter,
  renderHeroLeftRight,
  renderHeroBoldTypo,
  renderProductFeatureMinimal,
  renderHeroPremiumProduct,
} from '@/engine/10-code-engine/renderers';
import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

// ============================================================
// 공통 디자인 토큰
// ============================================================

const tokens: DesignTokens = {
  colors: {
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    primaryDark: '#1E40AF',
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
    display: { size: '4.5rem', weight: 800, lineHeight: '1.1' },
    h1: { size: '3rem', weight: 700, lineHeight: '1.2' },
    h2: { size: '2.25rem', weight: 700, lineHeight: '1.25' },
    h3: { size: '1.5rem', weight: 600, lineHeight: '1.3' },
    h4: { size: '1.25rem', weight: 600, lineHeight: '1.4' },
    body: { size: '1rem', weight: 400, lineHeight: '1.6' },
    small: { size: '0.875rem', weight: 400, lineHeight: '1.5' },
    caption: { size: '0.75rem', weight: 400, lineHeight: '1.4' },
    button: { size: '1rem', weight: 600, lineHeight: '1.4' },
  },
  fontFamily: 'sans',
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40, '2xl': 64 },
  radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 999 },
  defaultShadow: 'md',
  sectionPadding: '80px 24px',
};

// ============================================================
// 1. 슬립웰 매트리스 — Fullscreen Center
// ============================================================

const heroCopy: CopyBlock = {
  headline: '아침이 다시 기대되는 밤',
  subheadline: '매일 새벽 2-3시에 뒤척이며 허리 아픈 당신을 위한 해답',
  body: '또 다시 뻐근한 허리로 잠에서 깬 아침. 커피 없이는 버틸 수 없는 하루의 시작. 이제 그 악순환을 끊을 시간입니다. 7존 맞춤 지지가 당신의 체형을 기억하고, 100일 동안 완전히 새로운 잠을 경험하세요.',
  bulletPoints: ['7존 체압분산 기술', '100일 무료 체험', '100% 국내 제조', '무료 배송 & 설치'],
  ctaText: '100일 무료로 수면 혁명 시작하기',
  microCopy: '첫 달 무료, 만족하지 않으면 100% 환불',
  imageDirection: '',
  imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
};

// ============================================================
// 2. 슬립웰 매트리스 — Left-Right Split
// ============================================================

// (heroCopy 재사용)

// ============================================================
// 3. Fullscreen — 이미지 없음 fallback
// ============================================================

const noImageCopy: CopyBlock = { ...heroCopy, imageUrl: undefined };

// ============================================================
// 4. Left-Right — 이미지 없음 fallback
// ============================================================

// (noImageCopy 재사용)

// ============================================================
// 5. 볼드 타이포 히어로 (우아한형제들 스타일)
// ============================================================

const boldTypoCopy: CopyBlock = {
  headline: '다 때가\n있다',
  subheadline: '우아한형제들 신입사원 모집',
  body: '모집기간 | 2024.10.01(월) - 10.22(월) 16시',
  bulletPoints: [
    '전형단계: 서류전형 > 1차면접 > 2차면접 > 입사',
    '모집직무: 전략 / 마케팅 / 디자인 / 영업 / 법무 / HR',
    '지원자격: 학사학위 이상 소지, 입사 가능한 분',
    '지원방법: woowahan.com에서 온라인 입사지원서 제출',
  ],
  ctaText: '지금 지원하기',
  microCopy: '',
  imageDirection: '',
  imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80',
};

// ============================================================
// 6. 제품 상세 미니멀 (MADI 파라핀베이스 스타일)
// ============================================================

const productMinimalCopy: CopyBlock = {
  headline: '스테인리스에\n전면 테프론 코팅을',
  subheadline: 'ONLY MADI',
  body: '내열 소재는 기본, 안전을 한 번 더 레벨 업',
  bulletPoints: [
    '스테인리스 + 테프론 코팅',
    '열전도성이 뛰어난 스테인리스에 테프론 코팅을 적용해 접촉 시에도 안전합니다.',
  ],
  ctaText: '',
  microCopy: '하늘 아래, 같은 파라핀베이스는 없다.',
  imageDirection: '',
  imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
};

// ============================================================
// 7. 프리미엄 제품 히어로 (쿠첸 brain 스타일)
// ============================================================

const premiumProductCopy: CopyBlock = {
  headline: 'brain',
  subheadline: '연아가 선택한 똑똑한 밥솥',
  body: 'For best taste of all grains',
  bulletPoints: [
    '2024 NEW',
    '최적의 취사 알고리즘으로',
    '최적의 밥맛에 도전하다',
  ],
  ctaText: '',
  microCopy: 'CUCHEN*',
  imageDirection: '',
  imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
};

// ============================================================
// HTML 렌더링
// ============================================================

const sections = [
  { label: '1. Fullscreen Center — 이미지 오버레이', html: renderHeroFullscreenCenter(heroCopy, tokens) },
  { label: '2. Left-Right Split — 이미지 + 배지', html: renderHeroLeftRight(heroCopy, tokens) },
  { label: '3. Fullscreen Center — 이미지 없음 (그라데이션 fallback)', html: renderHeroFullscreenCenter(noImageCopy, tokens) },
  { label: '4. Left-Right Split — 이미지 없음 (fallback)', html: renderHeroLeftRight(noImageCopy, tokens) },
  { label: '5. 볼드 타이포 히어로 (우아한형제들 스타일)', html: renderHeroBoldTypo(boldTypoCopy, tokens) },
  { label: '6. 제품 상세 미니멀 (MADI 스타일)', html: renderProductFeatureMinimal(productMinimalCopy, tokens) },
  { label: '7. 프리미엄 제품 히어로 (쿠첸 brain 스타일)', html: renderHeroPremiumProduct(premiumProductCopy, tokens) },
];

const body = sections
  .map((s) => `<div class="label">${s.label}</div>\n${s.html}`)
  .join('\n\n');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>렌더러 테스트 — 7가지 패턴</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Noto Sans KR',-apple-system,sans-serif;color:#0F172A;background:#f1f5f9;-webkit-font-smoothing:antialiased;}
img{max-width:100%;height:auto;display:block;}
a{color:inherit;text-decoration:none;}
a:hover{opacity:0.85;}
.label{text-align:center;padding:32px;background:#1e293b;color:#fff;font-size:1.5rem;font-weight:700;letter-spacing:0.05em;}
@media(max-width:768px){
  section{padding:48px 16px !important;}
  h1{font-size:2rem !important;}
  [style*="flex-wrap:wrap"]{flex-direction:column !important;}
  [style*="min-height:100vh"]{min-height:auto !important;padding-top:80px !important;padding-bottom:80px !important;}
}
</style>
</head>
<body>
${body}
</body>
</html>`;

writeFileSync('scripts/test-hero-output.html', html, 'utf-8');
console.log('✅ scripts/test-hero-output.html 생성 완료 (7가지 패턴)');
console.log('   브라우저에서 열어서 확인하세요');
