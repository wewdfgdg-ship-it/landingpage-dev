import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as targetChecklist from '../src/engine/10-code-engine/templates/feature/target-checklist';

const testCopyFeature: CopyBlock = {
  microCopy: '리볼드 아르기닌 5000',
  headline: '이런분들께 추천드립니다!',
  subheadline: '',
  body: '',
  ctaText: '',
  bulletPoints: [
    '01', '<span class="tc-highlight">일상 속 활력과 에너지</span>가 필요한 분',
    '02', '강도 높은 운동을 위해 <span class="tc-highlight">부스터가 필요한 분</span>',
    '03', '업무, 가사, 육아로 지친 분',
    '04', '무기력에서 벗어나 <span class="tc-highlight">활기찬 아침</span>을 원하는 분',
    '05', '부족한 기력을 채우고 싶은 <span class="tc-highlight">중·장년층</span>'
  ],
  imageUrl: `<svg viewBox="0 0 24 24"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66C7.67 12.24 10.7 7 15 7h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C14.9 20.79 11 21 11 21z"/></svg>`,
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(타겟고객-체크리스트) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${targetChecklist.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(08-타겟고객-리볼드) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(targetChecklist.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-target-checklist.html', fullHtml);
console.log('✅ 본문 섹션(타겟고객-체크리스트) 클론 생성 완료: scripts/test-target-checklist.html');