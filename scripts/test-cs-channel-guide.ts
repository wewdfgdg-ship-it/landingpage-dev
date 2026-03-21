import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as csChannelGuide from '../src/engine/10-code-engine/templates/feature/cs-channel-guide';

const testCopyFeature: CopyBlock = {
  microCopy: 'Kakaotalk',
  headline: '상담톡 안내',
  subheadline: '편리한 카카오톡 상담과 다양한 쇼핑 정보 및 할인 혜택까지 받아보세요!',
  imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=300',
  bulletPoints: [
    '월 - 금 10:00 - 17:00',
    '12:00 - 13:00',
    '@잇수다LAB',
    '상담톡으로 편하게 상담해요!',
    '<p>별도의 앱 설치 없이 카카오톡 사용자라면 이용할 수 있습니다.</p><p>상담원 연결 전, 챗봇 기능으로 간단한 상담이 가능합니다.</p><p>전화 상담이 불편한 고객님들을 위한 부담 없는 1:1 채팅 상담 서비스입니다.</p><p>상담 시 이미지 전송이 가능하여 보다 정확한 상담이 가능합니다.</p>',
    '상담톡 이용안내',
    '<p>남겨주신 문의사항은 순차적으로 확인 후 답변드립니다.</p><p>주문번호 또는 성함과 연락처를 함께 기재해주시면 더욱 빠른 상담이 가능합니다.</p><p>상품에 대한 문의 시 정확한 상품명을 기재해주시면 정확한 상담이 가능합니다.</p>'
  ],
  body: '',
  ctaText: '',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(고객센터안내) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #ffc107; }

/* 템플릿 CSS */
${csChannelGuide.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#fff;">레퍼런스(25-고객센터/카카오톡) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(csChannelGuide.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-cs-channel-guide.html', fullHtml);
console.log('✅ 본문 섹션(고객센터안내) 클론 생성 완료: scripts/test-cs-channel-guide.html');
