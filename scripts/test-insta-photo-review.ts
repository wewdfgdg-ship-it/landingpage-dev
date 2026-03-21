import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as instaPhotoReview from '../src/engine/10-code-engine/templates/feature/insta-photo-review';

const testCopyFeature: CopyBlock = {
  microCopy: '더 나은 세상을 위한 니어앤디어 클레어스 프로젝트',
  headline: 'Near & Dear, Klairs<br>인증샷 이벤트',
  subheadline: '',
  body: '일상 가까이에서 여러분의 균형 잡힌 삶과 함께하는 클레어스 제품의 인증샷을 촬영해 주세요! 📷<br><span style="color:#2196f3; font-weight:500;">#니어앤디어클레어스 #neardearklairs</span>',
  ctaText: '',
  imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600', 
  bulletPoints: [
    '#neardearklairs',
    '#니어앤디어클레어스'
  ],
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(인스타-포토리뷰) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f1ebd8; }

/* 템플릿 CSS */
${instaPhotoReview.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#fff;">레퍼런스(20-포토리뷰/인증샷) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(instaPhotoReview.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-insta-photo-review.html', fullHtml);
console.log('✅ 본문 섹션(인스타-포토리뷰) 클론 생성 완료: scripts/test-insta-photo-review.html');
