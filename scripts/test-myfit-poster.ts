import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as myfitPoster from '../src/engine/10-code-engine/templates/hero/myfit-poster';

// 동국제약 레퍼런스와 완전히 동일한 텍스트 구조
const testCopyHero: CopyBlock = {
  microCopy: '하루한번 1초 섭취', // 최상단 기울어진 후킹 멘트
  subheadline: '간 건강 과 스트레스로 인한\n피로개선, 활력까지', // 중간 서브 헤드라인 
  headline: '동시케어!', // 메인 빅 타이틀 (빨간색 그림자 포인트)
  body: '마이핏 V 멀티비타민 피로앤 리버샷', // 메인 타이틀 아래 서브 텍스트
  bulletPoints: [
    '1day', // 스티커 상단
    '1 shot' // 스티커 하단
  ],
  ctaText: '지금 바로 구매하기',
  imageDirection: '',
  // 세로로 긴 영양제 병 형태의 이미지 (누끼)
  imageUrl: 'https://images.unsplash.com/photo-1550572017-edb7df089ea3?auto=format&fit=crop&q=80&w=400',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(마이핏) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #111; padding-top:20px; }

/* 템플릿의 CSS 렌더링 */
${myfitPoster.css}

/* 모바일 래퍼 디자인 */
.mobile-wrapper {
    width: 100%;
    max-width: 480px;
    margin: 0 auto 40px auto;
    background-color: #000;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#aaa;">레퍼런스(동국제약 마이핏) 1:1 완벽 클론 뷰어</div>
    
    <div class="mobile-wrapper">
        ${injectContent(myfitPoster.html, testCopyHero)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-myfit-poster.html', fullHtml);
console.log('✅ 1:1 레퍼런스 클론 생성 완료: scripts/test-myfit-poster.html');
