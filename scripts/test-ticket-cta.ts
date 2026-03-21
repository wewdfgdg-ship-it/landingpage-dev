import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as ticketCta from '../src/engine/10-code-engine/templates/feature/ticket-cta';

const testCopyFeature: CopyBlock = {
  microCopy: '08.01 - 08.15',
  headline: '아무것도<br>묻지도 따지지도 않고<br>0원',
  subheadline: '아묻따 0원! promotion',
  body: '멤버십, 정기결제 걱정없이<br>한달 동안 0원에 즐기세요!',
  ctaText: '다운로드',
  bulletPoints: [
    '등록회원 누.구.나',
    '0원 쿠폰',
    'TRO COUPON'
  ],
  imageUrl: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(CTA-티켓박스) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${ticketCta.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(15-CTA-아묻따쿠폰) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(ticketCta.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-ticket-cta.html', fullHtml);
console.log('✅ 본문 섹션(CTA-티켓박스) 클론 생성 완료: scripts/test-ticket-cta.html');
