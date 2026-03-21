import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as dynamicPoster from '../src/engine/10-code-engine/templates/hero/dynamic-poster';

// 동국제약 레퍼런스 스타일
const testCopyHero1: CopyBlock = {
  headline: '피로개선, 활력까지\n동시케어!',
  subheadline: '간 건강 과 스트레스로 인한\n하루한번 1초 섭취',
  body: '밀크씨슬, 로디올라 로세아\n멀티비타민 & 미네랄 배합',
  bulletPoints: [
    '간 건강',
    '스트레스 완화',
    '원샷 에너지'
  ],
  ctaText: '지금 바로 구매하기',
  microCopy: '1DAY\n1SHOT', // 떠다니는 스티커 뱃지용
  imageDirection: '',
  // 영양제/음료 느낌의 레퍼런스 이미지
  imageUrl: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=400',
};

// 스프라이트 제로 / 커피 레퍼런스 스타일
const testCopyHero2: CopyBlock = {
  headline: '스프라이트\n제로 !',
  subheadline: '제대로 상쾌한 맛남',
  body: '제로슈거 제로칼로리로\n부담 없이 즐기세요',
  bulletPoints: [
    'ZERO SUGAR',
    'ZERO CALORIE',
    '상쾌함 100%'
  ],
  ctaText: '한정판 구매하기',
  microCopy: 'NEW', // 새로웠다는 느낌
  imageDirection: '',
  // 캔 음료 느낌
  imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
};

const globalCss1 = `:root {
  --color-primary: #ff4757; /* 붉은색 계열 포인트 포스터 */
  --color-bg: #1e1e24; /* 어두운 배경 */
  --color-text: #ffffff;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #000;}
` + dynamicPoster.css;

const globalCss2 = `:root {
  --color-primary: #00b894; /* 스프라이트 초록색 포인트 */
  --color-bg: #000000;
  --color-text: #ffffff;
}`;

const heroHtml1 = injectContent(dynamicPoster.html, testCopyHero1);
const heroHtml2 = injectContent(dynamicPoster.html, testCopyHero2);

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dynamic Ad Poster 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
${globalCss1}
${globalCss2}
/* Wrapper to simulate mobile ad screen */
.mobile-wrapper {
    width: 100%;
    max-width: 480px;
    margin: 0 auto 40px auto;
    background-color: var(--color-bg);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.1);
}
.theme-red {
    --color-primary: #ff4757;
    --color-bg: #110e1a; /* 네이비 다크 톤 */
    --color-text: #ffffff;
}
.theme-green {
    --color-primary: #2ed573;
    --color-bg: #052c16; /* 다크 그린 톤 */
    --color-text: #ffffff;
}
</style>
</head>
<body style="padding-top:20px;">
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#fff;">다이내믹 광고 포스터 스타일 뷰어 (동국제약/스프라이트 참고)</div>
    
    <div class="mobile-wrapper theme-red">
        ${heroHtml1}
    </div>

    <div class="mobile-wrapper theme-green">
        ${heroHtml2}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-dynamic-poster.html', fullHtml);
console.log('✅ 컴포넌트 생성 완료: scripts/test-dynamic-poster.html');
