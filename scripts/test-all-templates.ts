import { writeFileSync } from 'fs';
import { injectContent } from '../src/engine/10-code-engine/template-engine';
import type { CopyBlock } from '../src/engine/05-psychological-copy/types';

import * as pinkGradient from '../src/engine/10-code-engine/templates/hero/pink-gradient';
import * as darkAward from '../src/engine/10-code-engine/templates/hero/dark-award';
import * as darkLuxuryPro from '../src/engine/10-code-engine/templates/hero/dark-luxury-pro';
import * as awardLight from '../src/engine/10-code-engine/templates/hero/award-light';
import * as darkBoldRed from '../src/engine/10-code-engine/templates/hero/dark-bold-red';
import * as sleekEvent from '../src/engine/10-code-engine/templates/hero/sleek-event';
import * as techSpecs from '../src/engine/10-code-engine/templates/hero/tech-specs';
import * as saleCloud from '../src/engine/10-code-engine/templates/hero/sale-cloud';
import * as splitProduct from '../src/engine/10-code-engine/templates/hero/split-product';
import * as statsCenter from '../src/engine/10-code-engine/templates/hero/stats-center';
import * as colorBold from '../src/engine/10-code-engine/templates/hero/color-bold';
import * as darkPremium from '../src/engine/10-code-engine/templates/hero/dark-premium';
import * as neonRetinol from '../src/engine/10-code-engine/templates/hero/neon-retinol';
import * as eventPromo from '../src/engine/10-code-engine/templates/hero/event-promo';

const templates = [
  { name: '1. Pink Gradient (ChatGPT)', tmpl: pinkGradient },
  { name: '2. Dark Award (ChatGPT)', tmpl: darkAward },
  { name: '3. Dark Luxury Pro (ChatGPT)', tmpl: darkLuxuryPro },
  { name: '4. Award Light (ChatGPT)', tmpl: awardLight },
  { name: '5. Dark Bold Red (ChatGPT)', tmpl: darkBoldRed },
  { name: '6. Sleek Event (ChatGPT)', tmpl: sleekEvent },
  { name: '7. Tech Specs (ChatGPT)', tmpl: techSpecs },
  { name: '8. Sale Cloud (ChatGPT)', tmpl: saleCloud },
  { name: '9. Neon Retinol (ChatGPT)', tmpl: neonRetinol },
  { name: '10. Event Promo (ChatGPT)', tmpl: eventPromo },
  { name: '10. Split Product', tmpl: splitProduct },
  { name: '11. Stats Center', tmpl: statsCenter },
  { name: '12. Color Bold', tmpl: colorBold },
  { name: '13. Dark Premium', tmpl: darkPremium },
];

const testCopy: CopyBlock = {
  headline: '피부 본연의 빛을\n되찾다',
  subheadline: '더마 사이언스 연구소',
  body: '10년 연구 끝에 완성된 레티놀 앰플. 28일 사용 후 주름 개선 효과가 임상으로 입증되었습니다.',
  bulletPoints: ['누적 판매 5만개', '피부과 전문의 추천', '28일 임상 완료'],
  ctaText: '지금 구매하기',
  microCopy: '첫 구매 30% 할인 · 무료배송',
  imageDirection: '',
  imageUrl: 'https://placehold.co/400x500/1a1a2e/ffffff?text=PRODUCT',
};

let allCss = '';
let sections = '';

for (const { name, tmpl } of templates) {
  const rendered = injectContent(tmpl.html, testCopy);
  allCss += (tmpl.css || '') + '\n';
  sections += `<div style="text-align:center;padding:12px;background:#0a0a0a;color:#888;font-size:11px;font-weight:600;letter-spacing:0.15em;">${name}</div>\n${rendered}\n`;
}

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>전체 Hero 템플릿 미리보기 (${templates.length}종)</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&family=Noto+Serif+KR:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:"Pretendard",-apple-system,sans-serif;-webkit-font-smoothing:antialiased;}
img{max-width:100%;display:block;}
${allCss}
</style>
</head>
<body>
${sections}
</body>
</html>`;

writeFileSync('scripts/test-all-templates.html', fullHtml);
process.stdout.write('✅ scripts/test-all-templates.html 생성 완료 (${templates.length}종)\n');
