import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as specialOfferCard from '../src/engine/10-code-engine/templates/feature/special-offer-card';

const testCopyFeature: CopyBlock = {
  microCopy: 'Gift',
  headline: '에이지알 리프팅 세트 구매시<br>바디라인 잡아주는 바디샷 <strong>0원</strong>',
  subheadline: '9주년 기념 50% & 기기 정품 증정',
  body: '',
  ctaText: '2종 세트 장바구니 바로 담기',
  imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400',
  bulletPoints: [
    '에이지알 프리미엄 리프팅 2종 세트',
    '에이지알 석션 바디샷 증정',
    '# 슬림바디 기술로 피하지방 자극',
    '50%',
    '1,356,000원',
    '678,000원'
  ],
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(한정특가-카드) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #fcfcfc; }

/* 템플릿 CSS */
${specialOfferCard.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#fff;">레퍼런스(23-한정특가/메디큐브) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(specialOfferCard.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-special-offer-card.html', fullHtml);
console.log('✅ 본문 섹션(한정특가-카드) 클론 생성 완료: scripts/test-special-offer-card.html');
