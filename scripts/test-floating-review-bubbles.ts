import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as floatingReviewBubbles from '../src/engine/10-code-engine/templates/feature/floating-review-bubbles';

const testCopyFeature: CopyBlock = {
  microCopy: '시카 크림!',
  headline: '왜 이렇게 좋다는 사람이 많나요?',
  subheadline: '',
  body: '',
  ctaText: '',
  bulletPoints: [
    '요즘 거울보는 재미로 살아요<br>인생 최고 피부 경험 중 입니다!',
    '진짜 좋아 지는 게 눈에 보이네요<br>괜히 후기가 좋은 게 아닌 듯!',
    '정말 제 피부를 구원해준 제품이에요ㅠㅠ'
  ],
  imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=1200', /* 크림 이미지 */
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(리뷰-말풍선) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${floatingReviewBubbles.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(13-리뷰-시카크림) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(floatingReviewBubbles.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-floating-review-bubbles.html', fullHtml);
console.log('✅ 본문 섹션(리뷰-말풍선) 클론 생성 완료: scripts/test-floating-review-bubbles.html');
