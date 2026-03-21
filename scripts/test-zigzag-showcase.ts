import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as zigzagShowcase from '../src/engine/10-code-engine/templates/feature/zigzag-showcase';

// 샌드위치 메이커 레퍼런스와 1:1 동일 구조의 카피
const testCopyFeature: CopyBlock = {

  subheadline: '설레임 샌드위치 메이커',
  headline: '취향저격 <span class="zz-hl-eng">3colors</span>',
  microCopy: '',
  body: '',
  ctaText: '',

  // bullet.0 ~ bullet.11 (배경영문, 제목, 설명, 이미지URL 의 반복)
  bulletPoints: [
    // --- Item 1 (우측 이미지. 회색빛 민트. Ash White) ---
    // [0] Background Text (Ash white) 
    'Ash white',
    // [1] Title
    '애쉬화이트',
    // [2] Desc
    '어디에나 모던하게<br>잘 어울리는 화이트 컬러',
    // [3] Image URL (Since we don't have the exact device, let's use a proxy image for a sandwich maker or kitchen device) // 샌드위치 메이커 이미지
    'https://images.unsplash.com/photo-1584269600519-112d061fb912?auto=format&fit=crop&q=80&w=400',

    // --- Item 2 (좌측 이미지. 핑크 배경. Baby pink) ---
    // [4] Background Text (Baby pink)
    'Baby pink',
    // [5] Title
    '베이비 핑크',
    // [6] Desc
    '사랑스러움이 묻어나는<br>러블리한 핑크 컬러',
    // [7] Image URL
    'https://images.unsplash.com/photo-1584269600519-112d061fb912?auto=format&fit=crop&q=80&w=400',

    // --- Item 3 (우측 이미지. 블루/민트 배경. Aqua mint) ---
    // [8] Background Text (Aqua mint)
    'Aqua mint',
    // [9] Title
    '아쿠아 민트',
    // [10] Desc
    '청량감에 기분 좋아지는<br>인테리어 포인트 민트 컬러',
    // [11] Image URL
    'https://images.unsplash.com/photo-1584269600519-112d061fb912?auto=format&fit=crop&q=80&w=400'
  ],
  
  imageUrl: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(지그재그 특징) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${zigzagShowcase.css}

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
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(06-상세스펙-지그재그형) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(zigzagShowcase.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-zigzag-showcase.html', fullHtml);
console.log('✅ 본문 섹션(지그재그 3컬러 특징) 클론 생성 완료: scripts/test-zigzag-showcase.html');
