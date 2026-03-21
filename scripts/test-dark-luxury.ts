import { writeFileSync } from 'fs';
import { html, css } from '../src/engine/10-code-engine/templates/hero/dark-luxury-pro';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';

const testCopy: CopyBlock = {
  headline: '시대를 초월하는\n가장 깊은 휴식의 기준',
  subheadline: 'Heritage of Masterpiece',
  body: '압도적인 기술력과 최고급 소재의 완벽한 조화.\n단 1%만을 위해 허락된 하이엔드 수면 환경을 선사합니다.',
  bulletPoints: ['브랜드 대상 5년 연속 1위', '구매자 총 평점 4.9 / 5.0'],
  ctaText: '',
  microCopy: '네이버 프리미엄 브랜드관 입점',
  imageDirection: '',
  imageUrl: 'https://placehold.co/400x200/1a110a/e5a43b?text=SIGNATURE+PRODUCT',
};

const rendered = injectContent(html, testCopy);

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dark Luxury Pro Preview</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&family=Noto+Serif+KR:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
<style>
body{font-family:"Pretendard",-apple-system,sans-serif;margin:0;}
${css}
</style>
</head>
<body class="bg-black">
${rendered}
</body>
</html>`;

writeFileSync('scripts/test-dark-luxury.html', fullHtml);
process.stdout.write('✅ scripts/test-dark-luxury.html 생성 완료\n');
