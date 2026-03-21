import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as pressShot from '../src/engine/10-code-engine/templates/hero/press-shot';

// 프레스샷 1:1 레퍼런스 카피 데이터
const testCopyHero: CopyBlock = {
  subheadline: '원 샷으로 한번에\n올인원 토탈 <span class="accent-pink">영양앰플</span>', // 상단 타이틀
  headline: '프레스샷!', // 거대한 검은색 메인 타이틀
  bulletPoints: [
    '비타민B12', // Left 1
    '나이아신', // Right 1
    '비타민E', // Left 2
    '비타민D', // Right 2
    '아연', // Left 3
    '엽산'  // Right 3
  ],
  microCopy: 'ONE\nSHOT', // 떠다니는 핑크색 뱃지 내용
  body: '<span style="font-size: 2rem; font-weight: 600; letter-spacing: -0.03em;">온누리 Store</span>\n<span style="font-size: 4.5rem; font-weight: 950; letter-spacing: -0.05em; display: inline-block; margin: 5px 0 15px 0; text-shadow: 0 5px 15px rgba(0,0,0,0.4);">비타민B 1위!</span>\n<span style="font-size:0.9rem; font-weight:400; opacity:0.6; display:block;">*온누리스토어 2022년 2월 ~ 2023년 1월 매출 기준</span>', // 하단 보라색 배너 멘트
  ctaText: '지금 바로 구매하기', // 원래 이미지엔 없지만, 연결되는 CTA
  imageDirection: '',
  // 앰플 느낌 레퍼런스 
  imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(프레스샷) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f7f7f7; padding-top:20px; }

/* 템플릿 CSS */
${pressShot.css}

/* 데스크탑(PC) 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto 40px auto;
    background-color: #fff;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(프레스샷) 데스크탑 와이드(1280px) 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(pressShot.html, testCopyHero)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-press-shot.html', fullHtml);
console.log('✅ 1:1 레퍼런스(프레스샷) 클론 생성 완료: scripts/test-press-shot.html');
