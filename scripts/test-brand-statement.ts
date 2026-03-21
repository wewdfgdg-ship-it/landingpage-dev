import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as brandStatement from '../src/engine/10-code-engine/templates/feature/brand-statement';

const testCopyFeature: CopyBlock = {
  microCopy: 'Clicks Mode란?',
  headline: 'Clicks Mode',
  subheadline: '더 많은 단축키, 더 빠른 작업을 경험하세요',
  body: 'Clicks Mode는 36개의 키보드 버튼을 iOS 단축어와 연동하여<br><strong>더 많은 작업을 빠르고 효율적으로 수행할 수 있습니다.</strong><br><br>각 버튼에 자주 사용하는 앱을 실행하거나 스마트홈을 제어하고,<br>복잡한 워크플로우를 한 번의 클릭으로 실행하는 등 다양한 기능을 설정할 수 있습니다.<br><strong>Keyboard는 단순한 타이핑 도구를 넘선 무궁무진한 가능성과 창의력을 지닌 Gear입니다.</strong>',
  ctaText: '',
  imageUrl: 'https://via.placeholder.com/300x300/111/fff?text=C',
  imageDirection: '',
  bulletPoints: [
    '<span style="color:#aaa; margin-right:5px;">💡</span> 휴식 조명 켜기 <span style="background:#fff; color:#111; border-radius:4px; padding:2px 5px; font-size:0.8rem; margin-left:10px;">C + R</span>',
    '<span style="color:#e91e63; margin-right:5px;">🚗</span> 테슬라 프리컨디셔닝 <span style="background:#fff; color:#111; border-radius:4px; padding:2px 5px; font-size:0.8rem; margin-left:10px;">C + T</span>',
    '<span style="color:#2196f3; margin-right:5px;">🎵</span> AI 노래 검색 실행 <span style="background:#fff; color:#111; border-radius:4px; padding:2px 5px; font-size:0.8rem; margin-left:10px;">C + S</span>',
    '<span style="color:#4caf50; margin-right:5px;">🤖</span> ChatGPT 대화 실행 <span style="background:#fff; color:#111; border-radius:4px; padding:2px 5px; font-size:0.8rem; margin-left:10px;">C + G</span>',
    '<span style="color:#9c27b0; margin-right:5px;">📷</span> 카메라 실행하기 <span style="background:#fff; color:#111; border-radius:4px; padding:2px 5px; font-size:0.8rem; margin-left:10px;">C + P</span>'
  ],
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(브랜드-스테이트먼트) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #111; }

/* 템플릿 CSS */
${brandStatement.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#fff;">레퍼런스(18-브랜드스토리/클릭스) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(brandStatement.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-brand-statement.html', fullHtml);
console.log('✅ 본문 섹션(브랜드-스테이트먼트) 클론 생성 완료: scripts/test-brand-statement.html');
