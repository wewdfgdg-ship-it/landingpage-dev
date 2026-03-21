import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as horizontalPriceCard from '../src/engine/10-code-engine/templates/feature/horizontal-price-card';

const testCopyFeature: CopyBlock = {
  microCopy: '화해 어워드 1위, 안심 무기자차',
  headline: '다이브인 무기자차<br>마일드 선크림 60ml',
  subheadline: 'DIVE IN',
  body: '',
  ctaText: '',
  imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=300',
  bulletPoints: [
    '25,000원',
    '15,000원',
    '40%',
    '밸런스풀 시카 마스크 1매',
    '#bbdefb',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=150'
  ],
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(가격표-가로형카드) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #e5f6ff; }

/* 템플릿 CSS */
${horizontalPriceCard.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#fff;">레퍼런스(26-가격표/토리든) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(horizontalPriceCard.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-horizontal-price-card.html', fullHtml);
console.log('✅ 본문 섹션(가로형-가격카드) 클론 생성 완료: scripts/test-horizontal-price-card.html');
