import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as beforeAfterArrow from '../src/engine/10-code-engine/templates/feature/before-after-arrow';

const testCopyFeature: CopyBlock = {
  microCopy: '',
  headline: '화장한지 얼마 안됐는데..<br>왜 벌써 <span class="ba-hl-box">칙칙</span>해보이지?',
  subheadline: '',
  body: '<span class="ba-footer-hl">칙칙한 피부톤</span>은<br>화장으로도 금방 티가나요!',
  ctaText: '',
  bulletPoints: [
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=400', 
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400' 
  ],
  imageUrl: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(비포애프터-화살표) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${beforeAfterArrow.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(09-비포애프터-피부톤) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(beforeAfterArrow.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-before-after-arrow.html', fullHtml);
console.log('✅ 본문 섹션(비포애프터-화살표) 클론 생성 완료: scripts/test-before-after-arrow.html');
