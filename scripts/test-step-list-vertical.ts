import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as stepListVertical from '../src/engine/10-code-engine/templates/feature/step-list-vertical';

const testCopyFeature: CopyBlock = {
  microCopy: '이렇게 드세요',
  headline: '당제로 통곡물 시리얼',
  subheadline: '',
  body: '',
  ctaText: '',
  bulletPoints: [
    // Step 1
    'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=400',
    '당제로 시리얼 1회분 30g<br>+ 저지방 우유 200ml (85kcal)',
    '한끼 당<br><strong>약 190kcal</strong>',

    // Step 2
    'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=400',
    '당제로 시리얼 1회분 30g<br>+ 무가당 두유 200ml (100kcal)',
    '한끼 당<br><strong>약 205kcal</strong>',

    // Step 3
    'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?auto=format&fit=crop&q=80&w=400',
    '당제로 시리얼 1회분 30g<br>+ 그릭요거트 100ml (90kcal)',
    '한끼 당<br><strong>약 195kcal</strong>'
  ],
  imageUrl: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(사용법-세로형 리스트) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f7f6f1; }

/* 템플릿 CSS */
\${stepListVertical.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
    background-color: transparent;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(07-사용법-씨리얼) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        \${injectContent(stepListVertical.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-step-list-vertical.html', fullHtml);
console.log('✅ 본문 섹션(사용법-세로형 리스트) 클론 생성 완료: scripts/test-step-list-vertical.html');
