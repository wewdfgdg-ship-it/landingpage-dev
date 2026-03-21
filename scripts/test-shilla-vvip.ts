import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as shillaVvip from '../src/engine/10-code-engine/templates/hero/shilla-vvip';

// 신라면세점 VVIP 레퍼런스와 1:1 동일 구조의 카피
const testCopyHero: CopyBlock = {
  // 상단 최상위 등급 명칭
  microCopy: 'VVIP',
  
  // 브릿지 멘트
  subheadline: '고객에게 드리는',
  
  // 브랜드
  body: '신·라·면·세·점·의',
  
  // 메인 타이틀 (얇은 사선 장식이 들어감)
  headline: '한정판 혜택',
  
  // 기간 및 지점 안내
  bulletPoints: [
    '기간 · 2020.01.01 ~ 2020.2.29', 
    '대상점 · 인천공항점'
  ],
  
  ctaText: '', // 원본 모델은 순수 공지사항 포스터 
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(신라 VVIP) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #000; }

/* 템플릿 CSS */
${shillaVvip.css}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#111;">레퍼런스(신라 VVIP 골드) 데스크탑 와이드 모드 클론 뷰어</div>
    
    <!-- 래퍼 제거 (완전한 블랙 풀스크린 몰입감 제공) -->
    ${injectContent(shillaVvip.html, testCopyHero)}
</body>
</html>`;

writeFileSync('scripts/test-shilla-vvip.html', fullHtml);
console.log('✅ 1:1 레퍼런스(신라 VVIP) 클론 생성 완료: scripts/test-shilla-vvip.html');
