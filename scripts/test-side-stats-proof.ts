import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as sideStatsProof from '../src/engine/10-code-engine/templates/feature/side-stats-proof';

const testCopyFeature: CopyBlock = {
  microCopy: '',
  headline: '4주 만에 나타나는<br><span class="sp-hl-color">콜라겐 관리 효과*</span>',
  subheadline: '',
  body: '* 리커버 힐러 부스팅 젤을 동시 사용 시<br>| 시험기관: 한국피부과학연구원 | 시험 기간: 2023년 4월 6일 ~ 5월 4일 | 시험 대상자: 43~65세 성인 여성 23명, 피부 상태에 따라 개인차 있음',
  ctaText: '',
  bulletPoints: [
    '볼 부위 겉탄력 개선',
    '3.25% <svg viewBox="0 0 24 24"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>',
    '턱 부위 피부 탄력 개선',
    '70% <svg viewBox="0 0 24 24"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>',
    '눈가 피부 치밀도 개선',
    '21.79% <svg viewBox="0 0 24 24"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>',
    '피부 거칠기 개선',
    '13.24% <svg viewBox="0 0 24 24"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>'
  ],
  imageUrl: 'https://images.unsplash.com/photo-1615397823963-26a9dd136d8d?auto=format&fit=crop&q=80&w=800',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(인증수상-스탯) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${sideStatsProof.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(11-인증수상-콜라겐효과) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(sideStatsProof.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-side-stats-proof.html', fullHtml);
console.log('✅ 본문 섹션(인증수상-스탯 사이드) 클론 생성 완료: scripts/test-side-stats-proof.html');
