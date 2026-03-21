import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as mamondeCream from '../src/engine/10-code-engine/templates/hero/mamonde-cream';

// 마몽드 플로라 글로우 레퍼런스와 1:1 동일한 카피 구조
const testCopyHero: CopyBlock = {
  microCopy: 'NEW', 
  headline: '마몽드 플로라 글로우 로즈 스무딩 크림', 
  subheadline: 'Flora Glow Rose Smoothing Cream',
  
  // {{{var}}} 형태로 들어갈 HTML 태그 지원 (template-engine 업데이트 버전 적용)
  bulletPoints: [
    // Left 1: 화장이 잘먹는 결크림
    `<div class="mc-hl-wrap">
        <span class="mc-highlight">화장이 잘먹는</span>
        <span class="mc-highlight">결크림</span>
     </div>
     <div class="mc-desc">화잘먹 속성<br>TEST 인증</div>`,
    
    // Right 1: 착붙 멜팅텍스처
    `<div class="mc-hl-wrap">
        <span class="mc-highlight">착붙</span>
        <span class="mc-highlight">멜팅텍스처</span>
     </div>
     <div class="mc-desc">피부에 녹아들어<br>촘광 피부 완성</div>`,

    // Left 2: 저자극 비건
    `<div class="mc-hl-wrap">
        <span class="mc-highlight">저자극 비건</span>
     </div>
     <div class="mc-desc">비건인증 크림</div>`,
  ],
  body: '', 
  ctaText: '지금 바로 구매하기', // 원래 이미지엔 없지만, 스크롤 유도를 위한 CTA
  imageDirection: '',
  // 비슷한 화장품(크림) 단지 이미지 
  imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(마몽드 크림) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${mamondeCream.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(화장품 결크림) 데스크탑 와이드(1280px) 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(mamondeCream.html, testCopyHero)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-mamonde-cream.html', fullHtml);
console.log('✅ 1:1 레퍼런스(마몽드 크림) 클론 생성 완료: scripts/test-mamonde-cream.html');
