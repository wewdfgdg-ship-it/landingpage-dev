import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';
import * as darkGlowFeature from '../src/engine/10-code-engine/templates/feature/dark-glow-feature';

const testCopyFeature: CopyBlock = {
  microCopy: '',
  headline: '',
  subheadline: '',
  body: '* AI Companion은 Zoom 사용자 계정에 할당된 유료 서비스에 추가 비용 없이 포함될 수 있습니다.',
  ctaText: '',
  bulletPoints: [
    `<svg viewBox="0 0 24 24"><path d="M9 21h6v-1H9v1zm3-19C7.58 2 4 5.58 4 10c0 2.82 1.48 5.28 3.73 6.64l.27.16V19h8v-2.2l.27-.16C18.52 15.28 20 12.82 20 10c0-4.42-3.58-8-8-8zm0 14h-2v-1h2v1zm2 0h-2v-1h2v1zm1.16-2.5l-.16.1V15H9v-1.4l-.16-.1C6.9 12.38 6 11.24 6 10c0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.24-.9 2.38-1.84 3.5z"/></svg>`,
    '아이디어를 생성하고 초안을 작성하세요',
    '채팅 답변, 이메일, 화이트보드 세션에서 사용할 브레인스토밍 아이디어를 제안받아 보세요. (기존 데이터와 통합)',
    `<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>`,
    '미팅 내용을 요약하세요',
    'AI Companion이 미팅, 채팅 스레드를 요약하여 핵심 질문에 답을 제공해 중요한 내용을 놓치지 않게 합니다.',
    `<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4l6.5 14h-13L12 6z"/></svg>`,
    '스킬을 다듬고 속도를 높이세요',
    'AI 기반 피드백을 통해 협업 능력을 개선하고 더욱 원활하게 소통할 수 있도록 개인 코칭을 받으세요.'
  ],
  imageUrl: 'https://images.unsplash.com/photo-1611162618479-ee44e99f5cb8?auto=format&fit=crop&q=80&w=1200',
  imageDirection: '',
};

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>레퍼런스(Zoom AI 다크모드) 1:1 완벽 클론 테스트</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Pretendard", sans-serif; overflow-x: hidden; background-color: #0b0c10; }

/* 템플릿 CSS */
${darkGlowFeature.css}

/* 와이드 랜딩페이지 래퍼 디자인 */
.desktop-wrapper {
    width: 100%;
    margin: 0 auto;
    background-color: #0b0c10;
}
</style>
</head>
<body>
    <div style="text-align:center; padding: 20px 0; font-weight:bold; color:#777; background:#000;">레퍼런스(05-특징3-다크글로우 SaaS) 데스크탑 모드 클론 뷰어</div>
    
    <div class="desktop-wrapper">
        ${injectContent(darkGlowFeature.html, testCopyFeature)}
    </div>
</body>
</html>`;

writeFileSync('scripts/test-dark-glow-feature.html', fullHtml);
console.log('✅ 본문 섹션(Dark Glow SaaS) 클론 생성 완료: scripts/test-dark-glow-feature.html');
