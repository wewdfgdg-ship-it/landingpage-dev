import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as lifestyleOverlay from '../src/engine/10-code-engine/templates/feature/lifestyle-overlay';

const testCopyFeature: CopyBlock = {
  microCopy: '',
  headline: 'Charge for All',
  subheadline: 'C타입 포트 2개 + USB A타입 포트 1개<br>+ AC 파워포트 2개',
  body: '',
  ctaText: '',
  bulletPoints: [
    'USB-C*3',
    'USB-A*1',
    'AC*2'
  ],
  imageUrl: 'https://images.unsplash.com/photo-1544976766-c30ff09761df?auto=format&fit=crop&q=80&w=2400',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(라이프스타일-오버레이) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${lifestyleOverlay.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(10-라이프스타일-충전기) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(lifestyleOverlay.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-lifestyle-overlay.html', fullHtml);
console.log('✅ 본문 섹션(라이프스타일-오버레이) 클론 생성 완료: scripts/test-lifestyle-overlay.html');
