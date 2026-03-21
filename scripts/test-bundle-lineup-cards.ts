import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as bundleLineupCards from '../src/engine/10-code-engine/templates/feature/bundle-lineup-cards';

const testCopyFeature: CopyBlock = {
  microCopy: '공식몰에서도 만나보세요!',
  headline: '롬앤 신상 라인 업',
  subheadline: '',
  body: '',
  ctaText: '',
  imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=300',
  bulletPoints: [
    '6 COLORS',
    '희한한 과일 속살에서 찾은 레어 컬러',
    '더 쥬시 래스팅 틴트',
    '13,000원',
    '9,900원',
    '24%',
    '4 COLORS',
    '설탕처럼 콕콕 반짝이는 슈가 매트',
    '슬라이드 인 싱글',
    '7,000원',
    '4,900원',
    '30%',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300'
  ],
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(번들-라인업) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #fcfcfc; }

/* 템플릿 CSS */
${bundleLineupCards.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#fff;">레퍼런스(22-번들라인업/롬앤) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(bundleLineupCards.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-bundle-lineup-cards.html', fullHtml);
console.log('✅ 본문 섹션(번들라인업) 클론 생성 완료: scripts/test-bundle-lineup-cards.html');
