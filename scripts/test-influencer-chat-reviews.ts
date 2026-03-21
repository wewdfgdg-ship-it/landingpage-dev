import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as influencerChatReviews from '../src/engine/10-code-engine/templates/feature/influencer-chat-reviews';

const testCopyFeature: CopyBlock = {
  microCopy: '직접 써본 인플루언서',
  headline: '60인의 PICK!',
  subheadline: 'BEST<br>토너패드',
  body: '<h4>▶ YouTube</h4><p>이나 선유 현지니 무드휘 안나 한얼 드림아티 악마토끼 봉쓰 베레샤 아귀 박명명 아두찌 지나 띵미니 뮤시아 오아롱 슝이 뷰민주 파이리 융비 최또려니 슬슬 다솜쏨 지복 예술로그 주토토 까망주은 지민 홀리쥬</p><h4>◎ Instagram</h4><p>빈토리 베리소현 김지형 디토 쥬니월드 bbshy 유블리 레비올라 워니유 이밀리 younny 하루 갱냄이 림이 집요정 린지 소라 민쁘민정 영리 뷰티율 단아 뿜뿜 인애킴 미소 잇츠나라 홍아 정노엘 김정훈 나린 소오닝</p>',
  ctaText: '',
  imageUrl: '',
  imageDirection: '',
  bulletPoints: [
    'https://via.placeholder.com/80/ffcccc/333?text=A',
    '유튜버<br>홀리쥬',
    '깊고 빠르게 흡수되고, 정말 촉촉해요!<br>요즘 꾸준히 해 주고 있어요! <strong>진짜 너무 좋습니다!</strong>',
    'https://via.placeholder.com/80/ccccff/333?text=B',
    '유튜버<br>한얼',
    '저자극에 순한 패드라 매일 매일 사용해요!<br><strong>쓸수록 매~끈해지고 광이 예쁘게 돌아요.</strong>',
    'https://via.placeholder.com/80/ccffcc/333?text=C',
    '유튜버<br>안나',
    '마디힐에서 만든 패드라 믿음이 가고,<br><strong>패드가 큼지막해서 한 장이면 충분해요.</strong>',
    'https://via.placeholder.com/80/ffccff/333?text=D',
    '유튜버<br>뮤시아',
    '<strong>민낯 피부가 만족스러워져요!</strong><br>기획세트는 매일 2장씩 써도 100일을 써요.'
  ],
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(인플루언서-리뷰) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #ededed; }

/* 템플릿 CSS */
${influencerChatReviews.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#fff;">레퍼런스(21-SNS바이럴/인플루언서) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(influencerChatReviews.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-influencer-chat-reviews.html', fullHtml);
console.log('✅ 본문 섹션(인플루언서-리뷰) 클론 생성 완료: scripts/test-influencer-chat-reviews.html');
