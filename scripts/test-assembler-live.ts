// ============================================================
// assembler.ts 실전 테스트 — 6개 무드로 실제 HTML 페이지 생성
// 실행: npx tsx scripts/test-assembler-live.ts
// 결과: test-output/assembler-demo.html (브라우저에서 열기)
// ============================================================

import { assembleAllMoods, type AssemblerMood } from '@/engine/10-code-engine/assembler';
import { getTemplate } from '@/engine/10-code-engine/template-registry';
import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import { writeFileSync } from 'fs';
import { join } from 'path';

// 테스트용 카피 데이터 (슬립웰 매트리스)
const DEMO_COPY: Record<string, CopyBlock> = {
  hero: {
    headline: '완벽한 수면, 완벽한 아침',
    subheadline: '독일 엔지니어링과 천연 소재의 조화',
    body: '매일 밤, 5성급 호텔의 잠자리를 경험하세요. 7존 맞춤 지지 시스템이 당신의 체형을 기억합니다.',
    bulletPoints: [],
    ctaText: '무료 체험 시작하기',
    microCopy: '100일 무료 체험 · 무료 배송',
    imageDirection: '프리미엄 침실에 놓인 매트리스',
  },
  features: {
    headline: '왜 슬립웰인가',
    subheadline: '수면 과학으로 증명된 기술',
    body: '7존 체압분산 시스템, 스마트 온도 조절, 제로 모션 트랜스퍼 — 세 가지 핵심 기술이 만드는 차이.',
    bulletPoints: ['체형 맞춤 7존 지지 시스템', '사계절 쾌적한 온도 조절', '파트너 진동 완벽 차단', '10년 형태 유지 보증'],
    ctaText: '기술 자세히 보기',
    microCopy: '',
    imageDirection: '매트리스 내부 구조',
  },
  pricing: {
    headline: '지금이 가장 좋은 가격',
    subheadline: '런칭 특별가 한정 수량',
    body: '정가 590,000원에서 390,000원. 100일 무료 체험 + 10년 품질 보증 포함.',
    bulletPoints: ['7존 체압분산 매트리스', '프리미엄 커버 포함', '무료 배송 + 설치', '100일 무료 체험', '10년 품질 보증'],
    ctaText: '특별가로 시작하기',
    microCopy: '만족하지 않으면 100% 환불',
    imageDirection: '',
  },
  proof: {
    headline: '실제 고객 후기',
    subheadline: '98% 고객 만족도',
    body: '"허리 통증이 사라졌어요. 매일 아침이 달라졌습니다." — 김서윤, 34세',
    bulletPoints: ['50,000+ 고객이 선택', '98% 만족도', '4.9 평균 별점'],
    ctaText: '후기 더 보기',
    microCopy: '',
    imageDirection: '',
  },
  cta: {
    headline: '더 나은 내일을 위한 첫 걸음',
    subheadline: '지금 시작하면 100일 무료 체험 + 런칭 특별가',
    body: '만족하지 않으면 전액 환불. 무료 배송, 무료 설치, 무료 수거.',
    bulletPoints: [],
    ctaText: '무료 체험 시작하기',
    microCopy: '첫 달 무료 · 만족하지 않으면 100% 환불',
    imageDirection: '',
  },
  faq: {
    headline: '자주 묻는 질문',
    subheadline: '',
    body: '',
    bulletPoints: [
      '배송은 얼마나 걸리나요? → 주문 후 1~2일 내 무료 배송',
      '100일 체험은 어떻게 진행되나요? → 불만족 시 무료 반품',
      '사이즈 교환이 가능한가요? → 7일 이내 무료 교환',
      '기존 매트리스 수거도 해주나요? → 무료 수거 서비스 제공',
    ],
    ctaText: '',
    microCopy: '',
    imageDirection: '',
  },
  beforeAfter: {
    headline: '무엇이 달라지나요',
    subheadline: 'Before & After',
    body: '',
    bulletPoints: [
      'Before: 새벽 2시마다 뒤척임 → After: 7시간 숙면',
      'Before: 아침마다 허리 통증 → After: 통증 없는 아침',
      'Before: 매트리스 3년마다 교체 → After: 10년 보증',
    ],
    ctaText: '체험 시작하기',
    microCopy: '',
    imageDirection: '',
  },
};

// 섹션 순서별 렌더링
const SECTION_ORDER = ['hero', 'features', 'proof', 'pricing', 'beforeAfter', 'faq', 'cta'] as const;

function renderMoodSection(mood: AssemblerMood, tokens: import('@/engine/09-visual-style/types').DesignTokens, patterns: Record<string, string>): string {
  const sections: string[] = [];

  for (const [idx, sectionKey] of SECTION_ORDER.entries()) {
    const patternId = patterns[sectionKey];
    if (!patternId) continue;

    const template = getTemplate(patternId);
    if (!template) {
      sections.push(`<!-- ${sectionKey}: template "${patternId}" not found -->`);
      continue;
    }

    const copy = DEMO_COPY[sectionKey];
    if (!copy) continue;

    try {
      const html = template.render(copy, tokens, idx + 1);
      sections.push(`<!-- ${sectionKey} (${patternId}) -->\n${html}`);
    } catch (err) {
      sections.push(`<!-- ${sectionKey}: render error: ${err} -->`);
    }
  }

  return sections.join('\n\n');
}

// 메인 실행
const allMoods = assembleAllMoods();
const outputParts: string[] = [];

outputParts.push(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Assembler 실전 테스트 — 6개 무드 비교</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Noto Sans KR',sans-serif;background:#111;color:#fff;}
.mood-nav{position:sticky;top:0;z-index:9999;background:#000;padding:12px 24px;display:flex;gap:12px;border-bottom:1px solid #333;}
.mood-nav a{color:#888;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:.05em;padding:8px 16px;border:1px solid #333;transition:all .2s;}
.mood-nav a:hover,.mood-nav a:target{color:#fff;border-color:#fff;}
.mood-section{border-bottom:4px solid #333;}
.mood-header{padding:40px 24px;text-align:center;background:#0a0a0a;}
.mood-header h2{font-size:2rem;margin-bottom:8px;}
.mood-header p{color:#888;font-size:.9rem;}
.mood-body{max-width:1240px;margin:0 auto;overflow:hidden;}
</style>
</head>
<body>

<nav class="mood-nav">
  <span style="color:#555;font-size:12px;padding:8px 0;">ASSEMBLER TEST →</span>`);

for (const mood of Object.keys(allMoods)) {
  outputParts.push(`  <a href="#${mood}">${mood.toUpperCase()}</a>`);
}
outputParts.push(`</nav>\n`);

for (const [mood, assembly] of Object.entries(allMoods)) {
  const fontLink = `<link href="${assembly.fonts.url}" rel="stylesheet">`;

  outputParts.push(`
${fontLink}
<div class="mood-section" id="${mood}">
  <div class="mood-header">
    <h2>${mood.toUpperCase()}</h2>
    <p>배경: ${assembly.tokens.colors.background} | 주색: ${assembly.tokens.colors.primary} | 폰트: ${assembly.fonts.displayFont.split(',')[0].replace(/'/g, '')}</p>
  </div>
  <div class="mood-body" style="background:${assembly.tokens.colors.background};color:${assembly.tokens.colors.textPrimary};font-family:${assembly.fonts.bodyFont};">
    ${renderMoodSection(mood as AssemblerMood, assembly.tokens, assembly.patterns as unknown as Record<string, string>)}
  </div>
</div>`);
}

outputParts.push(`
</body>
</html>`);

const outPath = join(process.cwd(), 'test-output', 'assembler-demo.html');
writeFileSync(outPath, outputParts.join('\n'), 'utf-8');
console.log(`✅ 생성 완료: ${outPath}`);
console.log(`   브라우저에서 열기: file:///${outPath.replace(/\\/g, '/')}`);
