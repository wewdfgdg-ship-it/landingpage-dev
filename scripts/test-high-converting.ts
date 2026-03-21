import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as highConverting from '../src/engine/10-code-engine/templates/hero/high-converting';
import * as featHighConverting from '../src/engine/10-code-engine/templates/features/high-converting';

// 카피 데이터 (섹션 1: 헤더 배너)
const testCopyHero: CopyBlock = {
  headline: '광고비만 축내는 랜딩페이지,\nAI가 10초 만에 살려냅니다.',
  subheadline: '문구 고민, 디자인, 코딩까지 전부 AI 12-엔진에 맡기세요.',
  body: '제품 URL 하나만 넣으면 전환율 3배 높은 페이지가 즉시 완성됩니다.',
  bulletPoints: [],
  ctaText: '무료로 전환율 3배 높이기',
  microCopy: '신용카드 등록 불필요 · 14일 무료 체험',
  imageDirection: '',
};

// 카피 데이터 (섹션 2: 주요 장점)
const testCopyFeatures: CopyBlock = {
  headline: '이제, 마우스 클릭 한 번으로 모든 게 끝납니다.',
  subheadline: '핵심 차별점 3가지',
  body: '더 이상 기획자, 디자이너, 개발자 단가를 비교하며 시간 낭비하지 마세요. 압도적인 결과물을 즉시 보여드립니다.',
  bulletPoints: [
    '업계 1위 카피라이팅 엔진',
    '글로벌 트렌드 반응형 UI',
    'A/B 테스트 자동 최적화'
  ],
  ctaText: '14일 무료로 핵심 기능 체험하기',
  microCopy: '',
  imageDirection: '',
};

// CSS 변수 처리를 위해 기본 토큰 값 설정 
const globalCss = `:root {
  --color-primary: #3b82f6;
  --color-primary-light: #60a5fa;
  --color-bg: #050505;
  --color-text: #ffffff;
  --color-text-secondary: #9ca3af;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: "Pretendard", -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: var(--color-bg);
  color: var(--color-text);
  overflow-x: hidden;
}
img { max-width: 100%; display: block; }

/* 템플릿 CSS 결합 */
` + highConverting.css + '\n' + featHighConverting.css;

const heroHtml = injectContent(highConverting.html, testCopyHero);
const featHtml = injectContent(featHighConverting.html, testCopyFeatures);

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>High-Converting 1~2섹션 통합 테스트</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
${globalCss}
</style>
</head>
<body>
${heroHtml}
${featHtml}
</body>
</html>`;

writeFileSync('scripts/test-high-converting.html', fullHtml);
console.log('✅ 1~2섹션 통합 테스트 파일 생성 완료: scripts/test-high-converting.html');
