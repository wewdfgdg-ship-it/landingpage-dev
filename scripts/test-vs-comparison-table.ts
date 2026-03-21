import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as vsComparisonTable from '../src/engine/10-code-engine/templates/feature/vs-comparison-table';

const testCopyFeature: CopyBlock = {
  microCopy: '고객님들의 이유있는 선택',
  headline: '타사 제품과 확실히<br><span class="vs-hl-color">비교해보세요!</span>',
  subheadline: '',
  body: '',
  ctaText: '',
  bulletPoints: [
    'https://images.unsplash.com/photo-1571687949921-1306bfb24b72?auto=format&fit=crop&q=80&w=400',
    '불편하고 어려운 설치',
    '2중 벤틸레이션',
    '심실링 처리되지 않아<br>틈새 방수 불가',
    '무거운 무게로<br>휴대성 DOWN',
    '에이팝<br>원터치 텐트',
    '원터치로 간편하게<br><strong>빠른설치</strong>',
    '4중 벤틸레이션<br><strong>통기성 우수</strong>',
    '기능성 원단+내부 심실링<br><strong>안심생활방수</strong>',
    '경량화 & 전용가방<br><strong>휴대성 UP</strong>'
  ],
  imageUrl: 'https://images.unsplash.com/photo-1628185567406-037190f7f3cb?auto=format&fit=crop&q=80&w=400',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(비교표-스플릿) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${vsComparisonTable.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(17-경쟁사비교/텐트) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(vsComparisonTable.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-vs-comparison-table.html', fullHtml);
console.log('✅ 본문 섹션(비교표-스플릿) 클론 생성 완료: scripts/test-vs-comparison-table.html');
