// ============================================================
// Hero 섹션 에이전트 테스트
// 실행: npx tsx scripts/test-section-hero.ts
// ============================================================

import { runHeaderBanner } from '../src/engine/sections/01-header-banner';
import type { SectionAgentInput } from '../src/engine/sections/types';
import type { ProductBrief } from '../src/engine/01-product-intelligence/types';

// 테스트용 ProductBrief
const mockBrief: ProductBrief = {
  productDNA: {
    coreValue: '3초 만에 피부가 달라집니다',
    usp: ['임상시험 완료', '92% 만족도', '피부과 전문의 추천'],
    positioning: 'premium',
    valueHierarchy: {
      functional: '피부 개선',
      emotional: '자신감 회복',
      social: '주변 칭찬',
    },
  },
  customerDesire: {
    surface: '깨끗한 피부',
    real: '자신감 있는 외모',
    hidden: '사회적 인정',
  },
  customerFear: {
    problem: '피부 트러블 악화',
    opportunity: '좋은 제품 놓칠까봐',
    social: '나만 못 관리하는 느낌',
  },
  resistanceMap: {
    price: { level: 3, reason: '가격이 좀 있음' },
    trust: { level: 2, reason: '브랜드 인지도 부족' },
    need: { level: 1, reason: '필요성 높음' },
    urgency: { level: 3, reason: '당장 급하지 않음' },
    complexity: { level: 1, reason: '사용법 간단' },
  },
  decisionType: 'impulse',
  marketContext: {
    competitionLevel: 'red_ocean',
    priceSensitivity: 'medium',
    purchaseCycle: 'repeat',
    decisionTime: '1_day',
    primaryChannel: 'direct_online',
  },
  confidenceScore: 85,
};

// ────────────────────────────────────────────
// 테스트 1: 뷰티 업종
// ────────────────────────────────────────────
const beautyInput: SectionAgentInput = {
  sectionKey: 'HEADER_BANNER',
  order: 1,
  productName: '글로우 세럼',
  industry: '뷰티/화장품',
  brief: mockBrief,
  strategyHint: '가격 대비 성능 강조, 충동구매 유도',
  tone: '강렬하고 직관적',
  targetEmotion: '즉시 필요성 체감',
};

const beautyResult = runHeaderBanner(beautyInput);

// eslint-disable-next-line no-console
console.log('\n========== 뷰티 HERO ==========');
// eslint-disable-next-line no-console
console.log(JSON.stringify(beautyResult, null, 2));

// ────────────────────────────────────────────
// 테스트 2: SaaS 업종
// ────────────────────────────────────────────
const saasBrief: ProductBrief = {
  ...mockBrief,
  productDNA: {
    coreValue: '팀 생산성을 2배로',
    usp: ['실시간 협업', 'AI 자동 분석', '원클릭 리포트'],
    positioning: 'innovation',
    valueHierarchy: {
      functional: '업무 효율 향상',
      emotional: '성과에 대한 자신감',
      social: '팀 내 인정',
    },
  },
  customerDesire: {
    surface: '업무 효율화',
    real: '성과 인정',
    hidden: '승진/성장',
  },
  decisionType: 'analytical',
};

const saasInput: SectionAgentInput = {
  sectionKey: 'HEADER_BANNER',
  order: 1,
  productName: '프로덕티비',
  industry: 'SaaS/소프트웨어',
  brief: saasBrief,
  strategyHint: '무료 체험 유도, 기능 비교 강조',
  tone: '깔끔하고 전문적',
  targetEmotion: '업무 효율 기대',
};

const saasResult = runHeaderBanner(saasInput);

// eslint-disable-next-line no-console
console.log('\n========== SaaS HERO ==========');
// eslint-disable-next-line no-console
console.log(JSON.stringify(saasResult, null, 2));

// ────────────────────────────────────────────
// 검증
// ────────────────────────────────────────────
let passed = 0;
let failed = 0;

function check(name: string, condition: boolean): void {
  if (condition) {
    passed++;
    // eslint-disable-next-line no-console
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    // eslint-disable-next-line no-console
    console.log(`  ❌ ${name}`);
  }
}

// eslint-disable-next-line no-console
console.log('\n========== 검증 ==========');

check('뷰티: sectionKey', beautyResult.sectionKey === 'HEADER_BANNER');
check('뷰티: order', beautyResult.order === 1);
check('뷰티: photo 비중 높음', beautyResult.elementWeight.photo > beautyResult.elementWeight.graphic);
check('뷰티: 레이아웃 split', beautyResult.layout.type === 'hero_split_left');
check('뷰티: headline 15자 이하', beautyResult.copy.headline.length <= 15);
check('뷰티: bulletPoints 존재', beautyResult.copy.bulletPoints.length > 0);
check('뷰티: impulse 스타일 (다크)', beautyResult.style.background === '#0F0F0F');
check('뷰티: imagePrompt 존재', beautyResult.imagePrompt.length > 0);

check('SaaS: graphic 비중 높음', saasResult.elementWeight.graphic > saasResult.elementWeight.photo);
check('SaaS: 레이아웃 gradient', saasResult.layout.type === 'hero_gradient_overlay');
check('SaaS: analytical 스타일 (라이트)', saasResult.style.background === '#FAFAFA');
check('SaaS: headline', saasResult.copy.headline.length > 0);

// eslint-disable-next-line no-console
console.log(`\n결과: ${passed}/${passed + failed} 통과`);

if (failed > 0) {
  process.exit(1);
}
