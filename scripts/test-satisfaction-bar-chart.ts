import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as satisfactionBarChart from '../src/engine/10-code-engine/templates/feature/satisfaction-bar-chart';

const testCopyFeature: CopyBlock = {
  microCopy: '인체적용시험으로 확인된',
  headline: '즉각 개선 효과!',
  subheadline: '[ 사용자 만족도 평가 ]',
  body: '',
  ctaText: '',
  bulletPoints: [
    '자극 없이 순한 편이다',
    '95%',
    '95',
    '피지 및 유분 케어가 잘 되는 것 같다',
    '91%',
    '91',
    '세안 후, 피부 결이 매끈해지는 느낌이다',
    '100%',
    '100',
    '세안 후, 피부가 투명해진 느낌이다',
    '90%',
    '90'
  ],
  imageUrl: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(만족도-바차트) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f7f7f7; }

/* 템플릿 CSS */
${satisfactionBarChart.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(16-숫자로보는실적/만족도바) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(satisfactionBarChart.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-satisfaction-bar-chart.html', fullHtml);
console.log('✅ 본문 섹션(만족도-바차트) 클론 생성 완료: scripts/test-satisfaction-bar-chart.html');
