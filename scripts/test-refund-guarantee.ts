import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as refundGuarantee from '../src/engine/10-code-engine/templates/feature/refund-guarantee';

const testCopyFeature: CopyBlock = {
  microCopy: '일주일 사용 후<br>불만족 시',
  headline: '100<span style="font-size:0.5em;">%</span>',
  subheadline: '환불해드립니다!',
  bulletPoints: [
    '7일동안 프리미엄 러닝벨트를 경험해보세요.',
  ],
  body: '품질에 문제가 있다면,<br><strong>100% 환불</strong> 해드립니다.',
  ctaText: '',
  imageUrl: 'https://images.unsplash.com/photo-1579621970588-a3f5ce5a08ae?auto=format&fit=crop&q=80&w=200', 
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(환불보장-엠블럼) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${refundGuarantee.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#fff;">레퍼런스(24-환불보장/100%) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(refundGuarantee.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-refund-guarantee.html', fullHtml);
console.log('✅ 본문 섹션(환불보장-엠블럼) 클론 생성 완료: scripts/test-refund-guarantee.html');
