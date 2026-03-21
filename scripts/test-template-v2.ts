import { writeFileSync } from 'fs';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import type { DesignTokens } from '../src/engine/09-visual-style/types';
import { renderWithTemplate, getRegisteredPatterns } from '../src/engine/10-code-engine/template-registry';
import { tokensToCssVars } from '../src/engine/10-code-engine/template-engine';

const testCopy: CopyBlock = {
  headline: '피부 본연의 빛을\n되찾다',
  subheadline: '더마 사이언스 연구소',
  body: '10년 연구 끝에 완성된 레티놀 앰플. 28일 사용 후 주름 개선 효과가 임상으로 입증되었습니다.',
  bulletPoints: ['누적 판매 5만개', '피부과 전문의 추천', '28일 임상 완료'],
  ctaText: '지금 구매하기',
  microCopy: '첫 구매 30% 할인 · 무료배송',
  imageDirection: '깔끔한 화이트 배경 위 앰플 제품',
  imageUrl: 'https://placehold.co/600x800/1a1a2e/ffffff?text=PRODUCT',
};

const testTokens: DesignTokens = {
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
    display: { size: '4.5rem', weight: '800', lineHeight: '1.1' },
    h1: { size: '3rem', weight: '700', lineHeight: '1.2' },
    h2: { size: '2.25rem', weight: '700', lineHeight: '1.3' },
    h3: { size: '1.5rem', weight: '600', lineHeight: '1.4' },
    h4: { size: '1.25rem', weight: '600', lineHeight: '1.4' },
    body: { size: '1rem', weight: '400', lineHeight: '1.6' },
    small: { size: '0.875rem', weight: '400', lineHeight: '1.5' },
    caption: { size: '0.75rem', weight: '400', lineHeight: '1.4' },
    button: { size: '1rem', weight: '600', lineHeight: '1' },
  },
  fontFamily: 'sans',
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 40, '2xl': 64 },
  radius: { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  defaultShadow: 'md',
  sectionPadding: '80px 24px',
};

const patterns = ['hero_fullscreen_center', 'hero_split_left', 'hero_minimal_typo', 'hero_video_bg'];
const cssVars = tokensToCssVars(testTokens);

let html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>렌더러 v2 템플릿 미리보기</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Pretendard','Noto Sans KR',sans-serif;}
img{max-width:100%;height:auto;display:block;}
a{color:inherit;text-decoration:none;}
.label{text-align:center;padding:12px;background:#0f172a;color:#fff;font-weight:700;font-size:0.9rem;letter-spacing:0.05em;}
${cssVars}
</style>
</head>
<body>
`;

for (const patternId of patterns) {
  const v2Result = renderWithTemplate(patternId, testCopy, testTokens);
  if (!v2Result) continue;

  html += `
<div class="label">${patternId}</div>
<style>${v2Result.css}</style>
${v2Result.html}
`;
}

html += '</body></html>';

writeFileSync('scripts/test-template-v2.html', html);
process.stdout.write(`✅ scripts/test-template-v2.html 생성 완료 (${patterns.length}개 패턴)\n`);
