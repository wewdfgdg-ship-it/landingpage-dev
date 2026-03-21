import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as collagenEffect from '../src/engine/10-code-engine/templates/hero/collagen-effect';

// 콜라겐 레퍼런스와 1:1 동일 구조의 카피
const testCopyHero: CopyBlock = {
  // 상하단 메인 타이틀
  subheadline: '4주 만에 나타나는',
  headline: '콜라겐 관리 효과*',
  
  // 얼굴 좌우에 배치될 포인트 4개
  bulletPoints: [
    '볼 부위 겉탄력 개선', '3.25%',     // Top Left
    '턱 부위 피부 탄력 개선', '70%',     // Bottom Left
    '눈가 피부<br>치밀도 개선', '21.79%', // Top Right
    '피부 거칠기 개선', '13.24%'       // Bottom Right
  ],
  
  // 작은 디스클레이머 텍스트
  body: '* 리커버 힐러 부스팅 젤을 동시 사용 시\n| 시험기관: 한국피부과학연구원 | 시험 기간: 2023년 4월 6일~5월 4일 | 시험 대상자: 43~65세 성인 여성 23명, 피부 상태에 따라 개인차 있음',
  
  microCopy: '',
  ctaText: '지금 바로 관리 시작하기',
  imageDirection: '',
  
  // 레퍼런스처럼 깔끔한 인물 누끼 느낌의 뷰티 모델 사진
  imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=600',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(콜라겐 뷰티) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${collagenEffect.css}

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
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(뷰티 콜라겐) 데스크탑 와이드(1280px) 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(collagenEffect.html, testCopyHero)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-collagen-effect.html', fullHtml);
console.log('✅ 1:1 레퍼런스(콜라겐 뷰티) 클론 생성 완료: scripts/test-collagen-effect.html');
