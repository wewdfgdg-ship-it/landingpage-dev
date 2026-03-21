import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as theDanbaekGrid from '../src/engine/10-code-engine/templates/feature/the-danbaek-grid';

// 더:단백 프로틴바 핵심특징 1:1 레퍼런스 카피 데이터
const testCopyFeature: CopyBlock = {

  // SVG 로고 + 브랜드 명
  microCopy: `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#e84022"/>
      <path d="M12 10a2 2 0 114 0 2 2 0 01-4 0z" fill="#fff"/>
      <path d="M16 13c-2 0-3.5 1.5-4 3l-1.5 5 2 .5 1-3 2 4 1-5h4l.5-2h-3l-2-2.5z" fill="#fff"/>
    </svg>
    더<span style="opacity:0.3; margin:0 2px;">:</span>단백 프로틴바
  `,

  headline: `제품 설계는 <span class="td-hl-blue"><span class="td-dot">물</span><span class="td-dot">론</span></span><br>맛까지 차원이 다릅니다.`,
  subheadline: '',
  body: '',
  ctaText: '',

  // SVG 아이콘과 텍스트를 교대로 배열 (짝수: SVG 아이콘 (bullet.0, bullet.2...), 홀수: HTML 텍스트 (bullet.1, bullet.3...))
  bulletPoints: [
    // [0] Item 1 Icon (Muscle)
    `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
       <path d="M25 60 C 25 35, 45 40, 50 25 C 55 10, 75 10, 75 25 C 75 40, 55 50, 60 75" stroke="#403028" stroke-width="4" stroke-linecap="round"/>
       <!-- Orange accent lines -->
       <path d="M20 30 L 30 20 M15 45 L 25 35" stroke="#e84022" stroke-width="4" stroke-linecap="round"/>
     </svg>`,
    // [1] Item 1 Text
    `균형있게 설계된<span class="td-strong">완전 단백질<br>15g / 1개</span><span class="td-small">(달걀 2.7개분)</span>`,
    
    // [2] Item 2 Icon (Atom/Science)
    `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
       <ellipse cx="50" cy="50" rx="35" ry="15" stroke="#403028" stroke-width="4" transform="rotate(30 50 50)"/>
       <ellipse cx="50" cy="50" rx="35" ry="15" stroke="#403028" stroke-width="4" transform="rotate(-30 50 50)"/>
       <ellipse cx="50" cy="50" rx="35" ry="15" stroke="#403028" stroke-width="4" transform="rotate(90 50 50)"/>
       <circle cx="50" cy="50" r="8" fill="#e84022"/>
       
       <circle cx="80" cy="75" r="12" fill="#fff" stroke="#403028" stroke-width="4"/>
       <path d="M75 75 L 78 78 L 86 70" stroke="#e84022" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
     </svg>`,
    // [3] Item 2 Text
    `<span class="td-strong">필수아미노산 6종 및<br>BCAA 함유로</span>건강까지 생각한<br>고단백바`,

    // [4] Item 3 Icon (Lightning Bar)
    `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
       <rect x="15" y="35" width="70" height="30" rx="2" stroke="#403028" stroke-width="4" transform="rotate(-15 50 50)"/>
       <path d="M12 30 L 15 35 L 12 40 L 15 45 L 12 50 L 15 55" stroke="#403028" stroke-width="4" transform="rotate(-15 15 35)"/>
       <path d="M85 30 L 88 35 L 85 40 L 88 45 L 85 50 L 88 55" stroke="#403028" stroke-width="4" transform="rotate(-15 85 35)"/>
       <path d="M55 35 L 45 50 H 55 L 45 65" fill="#e84022" stroke="#e84022" stroke-width="2"/>
       <!-- Stars -->
       <path d="M25 25 L 30 20 M80 20 L 75 25" stroke="#e84022" stroke-width="4" stroke-linecap="round"/>
     </svg>`,
    // [5] Item 3 Text
    `취향따라 골라먹는<span class="td-strong">다양한 타입의<br>프로틴바</span>
     <span class="td-list">* 바삭하고 고소한 맛의 초코/피넛버터<br>* 당 1g미만의 담백한 아몬드쿠키</span>`,

    // [6] Item 4 Icon (Clock/Check)
    `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
       <circle cx="50" cy="50" r="30" stroke="#403028" stroke-width="4" stroke-dasharray="0 0 1000 0"/>
       <path d="M50 30 L 50 50 L 65 55" stroke="#403028" stroke-width="4" stroke-linecap="round"/>
       <circle cx="50" cy="50" r="30" stroke="#403028" stroke-width="4" stroke-dasharray="140 10"/>
       
       <circle cx="45" cy="65" r="14" fill="#fff" stroke="#403028" stroke-width="4"/>
       <path d="M38 65 L 43 70 L 52 61" stroke="#e84022" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
       
       <!-- Stars -->
       <path d="M75 35 L 80 40 M25 35 L 20 30" stroke="#e84022" stroke-width="3" stroke-linecap="round"/>
     </svg>`,
    // [7] Item 4 Text
    `<span class="td-strong">넉넉한 유통기한으로<br>보관걱정 NO!</span>믿을 수 있는 안전한<br>제조공정에서 생산`
  ],
  
  // 우측 하단 제품 (땅콩버터/초콜릿 느낌)
  imageUrl: 'https://images.unsplash.com/photo-1599598425947-3304a0cd91db?auto=format&fit=crop&q=80&w=400',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(더단백 특징) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${theDanbaekGrid.css}

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
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(본문 - 핵심특징 그리드) 데스크탑 와이드(1280px) 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(theDanbaekGrid.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-the-danbaek-grid.html', fullHtml);
console.log('✅ 본문 섹션 레퍼런스(핵심특징 2x2 그리드) 클론 생성 완료: scripts/test-the-danbaek-grid.html');
