import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as pointShowcase from '../src/engine/10-code-engine/templates/feature/point-showcase';

// 뷰티/코스메틱 POINT 01 플로팅 뱃지 레퍼런스와 1:1 동일 카피
const testCopyFeature: CopyBlock = {

  microCopy: 'POINT 01',
  headline: '1등* 코팩 노하우 집약한<br>1등** 피지클리너로<br><span class="ps-hl-color" style="font-size: 4rem;">피지, 블랙헤드<br>굿-바이</span>',
  subheadline: '',
  body: '<span style="font-size: 1.25rem; font-weight:700;">리포좀화한 세범 리무브 콤플렉스로<br>부드러운 피지, 블랙헤드 케어</span><span class="ps-footer-small">※ 원료적 설명에 한함<br>*노우즈팩 2024 화해 명예의 전당 코팩 부문 3년 연속 1위<br>** 소프트너 2024 화해 스크럽/ 필링 부문 1위</span>',
  ctaText: '',

  // bullet.0: 왼쪽 상단 콜아웃, bullet.1: 오른쪽 하단 콜아웃
  bulletPoints: [
    'SEBUM REMOVE COMPLEX',
    'pH 약알칼리 베이스'
  ],
  
  // 제품 용기 누끼 이미지 대체 (뷰티 앰플/화장품 스포이드 같은 형태)
  imageUrl: 'https://images.unsplash.com/photo-1608248593802-8eb3a1b415cd?auto=format&fit=crop&q=80&w=400',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(POINT 01 플로팅뱃지) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${pointShowcase.css}

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
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(04-특징2-POINT뱃지) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(pointShowcase.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-point-showcase.html', fullHtml);
console.log('✅ 본문 섹션(POINT 콜아웃 쇼케이스) 클론 생성 완료: scripts/test-point-showcase.html');