import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as verticalShowcase from '../src/engine/10-code-engine/templates/hero/vertical-showcase';

const testCopyHero: CopyBlock = {
  headline: '안면부 전반의 꺼짐까지 케어',
  subheadline: '시멘리트 골조 케어 원리에\n핑크 스피큘을 더해',
  body: '피부 칼슘 REBORNIC 특허 원료 |\n저자극 테스트 완료',
  bulletPoints: [
    '주름개선\n기능성 인증',
    '미백\n기능성 인증',
    '리프팅 개선\n임상 완료'
  ],
  ctaText: '핑크 스피큘 구매하기',
  microCopy: '핑크 스피큘 고함량 함유',
  imageDirection: '',
  // 핑크색 어울리는 뷰티 제품 레퍼런스 이미지
  imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
};

const testCopyHero2: CopyBlock = {
  headline: '모두가 vie:serva를\n선택하는 이유입니다',
  subheadline: '매일 아침 달라진 피부가\n차이를 만들고, 확신을 더하니까',
  body: '꾸준한 판매량 1위',
  bulletPoints: [
    '네이버쇼핑\n1위',
    '8,000개 후기\n리뷰수 1위',
    '사용자 평점\n4.7/5'
  ],
  ctaText: '최저가 확인하기',
  microCopy: '압도적인 판매량을 당당히 증명합니다.',
  imageDirection: '',
};

const globalCss1 = `:root {
  --color-primary: #e63946;
  --color-bg: #fff0f3;
  --color-text: #1d3557;
  --color-border: #ffb3c1;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0;}
` + verticalShowcase.css;

const globalCss2 = `:root {
  --color-primary: #d4af37;
  --color-bg: #1f1b18;
  --color-text: #ffffff;
  --color-border: #52473d;
}`;

const heroHtml1 = injectContent(verticalShowcase.html, testCopyHero);
// template engine replaces \n with <br> inside injectContent for headline? Wait, injectContent explicitly handles `\n` in headline by wrapping in .headline-sm / .headline-lg. 
// We want to force real newlines if there is any other \n.
const heroHtml2 = injectContent(verticalShowcase.html, testCopyHero2);

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(상세페이지 요소) 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
${globalCss1}
${globalCss2}
/* Wrapper to simulate mobile screen (typical for detail pages) */
.mobile-wrapper {
    width: 100%;
    max-width: 480px;
    margin: 0 auto 40px auto;
    background-color: var(--color-bg);
    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}
.theme-pink {
    --color-primary: #ea3a5d;
    --color-bg: #fff0f3;
    --color-text: #cc1b3e; /* Dark pink for contrast */
}
.theme-dark {
    --color-primary: #e0b06b;
    --color-bg: #1b1715;
    --color-text: #ffffff;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#555;">상세페이지 (Detail Page) 스타일 모바일 뷰어</div>
    
    <div class="mobile-wrapper theme-pink">
        ${heroHtml1}
    </div>

    <div class="mobile-wrapper theme-dark">
        ${heroHtml2}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-reference-layout.html', fullHtml);
console.log('✅ 상세페이지(Detail) 느낌 테스트 파일 생성 완료: scripts/test-reference-layout.html');
