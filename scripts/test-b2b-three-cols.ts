import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as b2bThreeCols from '../src/engine/10-code-engine/templates/feature/b2b-three-cols';

// Dropbox SaaS 3열 그리드 레퍼런스와 1:1 동일 구조의 카피
const testCopyFeature: CopyBlock = {

  headline: '체계성 유지',
  subheadline: '기존의 파일, 클라우드 콘텐츠, Dropbox Paper 문서, 웹 바로 가기를 모두 한 공간으로 불러 모아 업무를 체계적이고<br>효율적으로 진행하세요.',
  microCopy: '',
  body: '',
  ctaText: '',

  // bullet.0 ~ bullet.8 (이미지 URL, 타이틀, 설명 반복)
  bulletPoints: [
    // [0] Item 1 Image
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
       <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
     </svg>`,
    // [1] Title
    '장소의 구애 없는 파일 저장과 액세스',
    // [2] Desc
    '하나의 안전한 공간에 <span class="btc-link-text">파일을 저장</span>해 컴퓨터, 휴대폰, 태블릿 등 원하는 장치로 액세스하세요. "바탕 화면" 등의 중요한 폴더를 백업하면 변경 사항이 계정 전체에 <span class="btc-link-text">동기화</span>됩니다.',

    // [3] Item 2 Image
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
       <polyline points="14 2 14 8 20 8"/>
       <line x1="16" y1="13" x2="8" y2="13"/>
       <line x1="16" y1="17" x2="8" y2="17"/>
       <polyline points="10 9 9 9 8 9"/>
     </svg>`,
    // [4] Title
    '모든 콘텐츠를 한 곳에',
    // [5] Desc
    '클라우드 콘텐츠, <span class="btc-link-text">Microsoft Office 파일</span> 등의 업무 파일을 Dropbox에서 바로 만들고 수정하세요. 이 앱 저 앱을 왔다 갔다 하거나 파일을 찾는 데 걸리는 시간이 절약됩니다.',

    // [6] Item 3 Image
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
       <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
       <line x1="8" y1="21" x2="16" y2="21"/>
       <line x1="12" y1="17" x2="12" y2="21"/>
     </svg>`,
    // [7] Title
    '데스크톱으로 더 스마트하게',
    // [8] Desc
    '<span class="btc-link-text">데스크톱</span>에서는 지능형 콘텐츠 추천 기능이 제공됩니다. 체계적으로 정리된 단일 공간으로 팀, 콘텐츠, 도구를 불러 모으세요.'
  ],
  
  imageUrl: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(B2B 3열그리드) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${b2bThreeCols.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(04-특징2-B2B 3열) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(b2bThreeCols.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-b2b-three-cols.html', fullHtml);
console.log('✅ 본문 섹션(B2B 3열 그리드) 클론 생성 완료: scripts/test-b2b-three-cols.html');