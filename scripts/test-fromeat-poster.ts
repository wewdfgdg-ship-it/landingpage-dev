import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as fromeatPoster from '../src/engine/10-code-engine/templates/hero/fromeat-poster';

// 단백질 쉐이크 (프롬잇) 1:1 레퍼런스 동일 구조
const testCopyHero: CopyBlock = {
  // 상단 네비게이션 3단
  microCopy: '<span>5th Generation</span><span>Protein</span><span>Shake</span>',
  
  // 우측 스탯
  bulletPoints: [
    '고단백', '22<span class="fe-stat-unit">g</span>',
    '당류', '2<span class="fe-stat-unit">g</span>',
    '순탄수', '8<span class="fe-stat-unit">g</span>'
  ],
  
  // 하단 메인 타이틀
  headline: '고품질 WPI\n<span style="font-size: 1.8rem; font-weight: 500; opacity:0.9;">분리유청단백 30%이상</span>',
  body: '알파원료\n<span style="font-size: 1.5rem; font-weight: 500; opacity:0.8;">식단러 3대 고민해결</span>',
  
  subheadline: '',
  ctaText: '한정 특가 구매하기',
  imageDirection: '',
  // 단백질 쉐이크 비주얼
  imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(프롬잇 단백질) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f7f7f7; }

/* 템플릿 CSS */
${fromeatPoster.css}

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
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(프롬잇 단백질 쉐이크) 데스크탑 와이드(1280px) 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(fromeatPoster.html, testCopyHero)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-fromeat-poster.html', fullHtml);
console.log('✅ 1:1 레퍼런스(프롬잇 쉐이크) 클론 생성 완료: scripts/test-fromeat-poster.html');
