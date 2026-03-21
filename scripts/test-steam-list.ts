import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as steamList from '../src/engine/10-code-engine/templates/feature/steam-list';

// 스팀 가습기 레퍼런스와 1:1 동일 구조 카피 (6개 리스트 아이템)
const testCopyFeature: CopyBlock = {

  subheadline: '진짜 100°C 가열로 살균된',
  headline: '더 순수한 스팀',
  microCopy: '',
  body: '',
  ctaText: '',

  // bullet.0 ~ bullet.11 (아이콘과 텍스트 번갈아가며 매핑)
  bulletPoints: [
    // [0] Item 1 Icon (Pot with Steam)
    `<svg viewBox="0 0 100 100">
       <path d="M25 45 V70 C25 80, 75 80, 75 70 V45" />
       <path d="M20 45 H80" />
       <path d="M25 45 C35 35, 65 35, 75 45" />
       <!-- Steam lines -->
       <path d="M40 30 Q35 25 40 20 T40 10 M50 32 Q45 25 52 18 T50 8 M60 30 Q55 25 60 20 T60 10" stroke-width="2" />
     </svg>`,
    // [1] Item 1 Text
    `진짜 100°C 가열로 순수한 스팀`,
    
    // [2] Item 2 Icon (Cylinder with arrows)
    `<svg viewBox="0 0 100 100">
       <!-- Cylinder -->
       <path d="M25 35 C25 25, 75 25, 75 35 V65 C75 75, 25 75, 25 65 Z" />
       <path d="M25 35 C25 45, 75 45, 75 35" />
       <!-- Arrows -->
       <path d="M35 45 L40 50 M35 45 V52 M35 45 H42" />
       <path d="M65 45 L60 50 M65 45 V52 M65 45 H58" />
       <path d="M35 60 L40 55 M35 60 V53 M35 60 H42" />
       <path d="M65 60 L60 55 M65 60 V53 M65 60 H58" />
     </svg>`,
    // [3] Item 2 Text
    `만수 4.5L (최대 3.5L)<br>대용량 물탱크`,

    // [4] Item 3 Icon (Handle Tank STS 304)
    `<svg viewBox="0 0 100 100">
       <!-- Circle tank top view -->
       <circle cx="50" cy="55" r="25" />
       <circle cx="50" cy="55" r="30" stroke-dasharray="8 6" />
       <!-- Handle lifting -->
       <path d="M30 40 Q50 30 70 40 L70 35 Q50 20 20 35 Z" />
       <!-- Hand drawing simplified -->
       <path d="M10 32 C15 32, 20 38, 20 45 M10 32 C10 25, 30 20, 30 35" />
     </svg>`,
    // [5] Item 3 Text
    `완벽 분리 가능 STS 304<br>물탱크&클린커버`,

    // [6] Item 4 Icon (Chart Arrow Up)
    `<svg viewBox="0 0 100 100">
       <!-- Bars -->
       <rect x="20" y="60" width="10" height="20" />
       <rect x="35" y="50" width="10" height="30" />
       <rect x="50" y="35" width="10" height="45" />
       <!-- Arrow -->
       <path d="M20 50 L75 20 M75 20 V35 M75 20 H60" stroke-width="2" />
       <!-- Base line -->
       <path d="M15 80 H85" />
     </svg>`,
    // [7] Item 4 Text
    `3단계 가습 조절 가능 최대<br>600ml/h 분무량`,

    // [8] Item 5 Icon (Lock)
    `<svg viewBox="0 0 100 100">
       <!-- Shackle -->
       <path d="M30 45 V35 C30 20, 70 20, 70 35 V45" />
       <!-- Body -->
       <rect x="20" y="45" width="60" height="40" rx="3" />
       <!-- Keyhole -->
       <circle cx="50" cy="60" r="4" />
       <path d="M48 62 L48 72 H52 L52 62" />
     </svg>`,
    // [9] Item 5 Text
    `2중 잠금 키즈락 적용`,

    // [10] Item 6 Icon (Shield Check)
    `<svg viewBox="0 0 100 100">
       <!-- Inner Shield -->
       <path d="M50 25 L32 32 V50 C32 65, 50 78, 50 78 C50 78, 68 65, 68 50 V32 Z" />
       <!-- Checkmark -->
       <path d="M42 55 L48 60 L60 45" stroke-width="2" />
       <!-- Outer Shield -->
       <path d="M50 15 L25 25 V50 C25 70, 50 85, 50 85 C50 85, 75 70, 75 50 V25 Z" />
     </svg>`,
    // [11] Item 6 Text
    `스팀이 지나는 모든 통로<br>안심 소재 사용`
  ],
  
  imageUrl: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(스팀 특징 6열) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${steamList.css}

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
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(블루 스팀 6열 리스트) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(steamList.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-steam-list.html', fullHtml);
console.log('✅ 본문 섹션(스팀 특징 6열 리스트) 클론 생성 완료: scripts/test-steam-list.html');
