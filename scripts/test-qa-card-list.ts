import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as qaCardList from '../src/engine/10-code-engine/templates/feature/qa-card-list';

const testCopyFeature: CopyBlock = {
  microCopy: '',
  headline: '자주 묻는 질문',
  subheadline: '',
  body: '',
  ctaText: '',
  bulletPoints: [
    '언제 얼마나 섭취하면 되나요?',
    '하루 중 식사를 마치시고 <strong>동일한 시간대에 1일 1회 1정씩 물과 함께 꾸준히 섭취</strong>하시는 걸 권장드립니다.',
    '임산부나 수유부도 섭취가 가능한가요?',
    '와일드 농축 여주정은 남녀노소 누구나 섭취가 가능한 제품이지만 체질의 변화가 생길 수 있는 <strong>임산부나 수유부의 경우 반드시 의사와 상담을 통해 섭취하시는 걸 권장</strong> 드립니다.'
  ],
  imageUrl: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(FAQ-카드형) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900;900i&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f6f6f6; }

/* 템플릿 CSS */
${qaCardList.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(12-FAQ-토스스타일) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(qaCardList.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-qa-card-list.html', fullHtml);
console.log('✅ 본문 섹션(FAQ-카드형) 클론 생성 완료: scripts/test-qa-card-list.html');
