import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as elegantGrid from '../src/engine/10-code-engine/templates/feature/elegant-grid';

// 친환경 소재 침구 레퍼런스와 1:1 동일 카피
const testCopyFeature: CopyBlock = {

  microCopy: '02',
  headline: 'FABRIC',
  subheadline: '친환경 소재',
  
  // bullet.0 ~ bullet.7 (아이콘, 텍스트 교차 배열)
  bulletPoints: [
    // [0] Item 1 Icon 
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
       <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
     </svg>`,
    // [1] Item 1 Text
    `<span class="eg-item-title">100% 친환경 소재</span>
     인체에 무해한 <span class="eg-highlight">친환경</span><br>
     <span class="eg-highlight">소재</span>로 세탁 후에도<br>
     동일 성능을 오래 유지`,
    
    // [2] Item 2 Icon (Cloud)
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
       <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
     </svg>`,
    // [3] Item 2 Text
    `<span class="eg-item-title">부드러운 촉감</span>
     극세 섬유 원단을<br>
     사용하여 <span class="eg-highlight">매끄럽고</span><br>
     <span class="eg-highlight">부들부들한 촉감</span>`,

    // [4] Item 3 Icon (Thermometer)
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
       <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/><path d="M12 7v5"/>
     </svg>`,
    // [5] Item 3 Text
    `<span class="eg-item-title">신체 온도 3-5° UP</span>
     열에너지를 흡수해주는<br>
     특수 발열 가공<br>
     처리로 <span class="eg-highlight">신체온도가</span><br>
     <span class="eg-highlight">3-5도 오르는 효과</span>`,

    // [6] Item 4 Icon (Box)
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
       <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
       <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
       <line x1="12" y1="22.08" x2="12" y2="12"/>
     </svg>`,
    // [7] Item 4 Text
    `<span class="eg-item-title">국내 생산</span>
     저가의 해외제품과는<br>
     달리 꼼꼼한 검수를 거쳐<br>
     제작되며 <span class="eg-highlight">한국인 체형에</span><br>
     <span class="eg-highlight">맞는 사이즈 보장</span>`
  ],
  
  body: '',
  ctaText: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(우아한 그리드) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS (배경 이미지를 CSS 변수로 주입) */
:root {
  --eg-bg-image: url('https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200'); /* 침구/따뜻한 방 톤의 배경 */
}
${elegantGrid.css}

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
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(03-본문-FABRIC) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(elegantGrid.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-elegant-grid.html', fullHtml);
console.log('✅ 본문 섹션(우아한 오버레이 2x2 그리드) 클론 생성 완료: scripts/test-elegant-grid.html');
