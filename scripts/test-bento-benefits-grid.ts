import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as bentoBenefitsGrid from '../src/engine/10-code-engine/templates/feature/bento-benefits-grid';

const testCopyFeature: CopyBlock = {
  microCopy: '이정돈, 슬리피노에선',
  headline: '혜택이 아니라 <span class="bb-hl-color">기본이예요!</span>',
  subheadline: '',
  body: '',
  ctaText: '',
  bulletPoints: [
    'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=400',
    '1개만 주문해도',
    '배송비는 0원',
    'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=400',
    '슬리피노 쿨쿨이불',
    '전용 보관백 증정',
    'https://via.placeholder.com/150x80/0066ff/ffffff?text=30,000+COUPON',
    '신규 회원가입 시',
    '웰컴쿠폰팩<br>3만원 지급',
    'https://via.placeholder.com/150x80/0066ff/ffffff?text=10,000+POINT',
    '리뷰 작성시',
    '최대 10,000<br>포인트 지급',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300',
    '블로그 포스팅시',
    '스벅 기프티콘<br>+ 포인트 지급'
  ],
  imageUrl: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(혜택-벤토그리드) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #f0f0f0; }

/* 템플릿 CSS */
${bentoBenefitsGrid.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777;">레퍼런스(14-배송안내/혜택-슬리피노) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(bentoBenefitsGrid.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-bento-benefits-grid.html', fullHtml);
console.log('✅ 본문 섹션(혜택/배송-벤토그리드) 클론 생성 완료: scripts/test-bento-benefits-grid.html');
