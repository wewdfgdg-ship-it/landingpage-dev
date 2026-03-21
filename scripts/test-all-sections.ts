// ============================================================
// 전체 26개 섹션 에이전트 통합 테스트
// 실행: npx tsx scripts/test-all-sections.ts
// ============================================================

import type { SectionAgentInput, SectionAgentOutput, SectionKey } from '../src/engine/sections/types';
import type { ProductBrief } from '../src/engine/01-product-intelligence/types';

import { runHeaderBanner } from '../src/engine/sections/01-header-banner';
import { runKeyFeatures } from '../src/engine/sections/02-key-features';
import { runFeatureDetail1 } from '../src/engine/sections/03-feature-detail-1';
import { runFeatureDetail2 } from '../src/engine/sections/04-feature-detail-2';
import { runFeatureDetail3 } from '../src/engine/sections/05-feature-detail-3';
import { runSpecs } from '../src/engine/sections/06-specs';
import { runHowToUse } from '../src/engine/sections/07-how-to-use';
import { runTargetPersona } from '../src/engine/sections/08-target-persona';
import { runBeforeAfter } from '../src/engine/sections/09-before-after';
import { runLifestyle } from '../src/engine/sections/10-lifestyle';
import { runCertification } from '../src/engine/sections/11-certification';
import { runFaq } from '../src/engine/sections/12-faq';
import { runReviews } from '../src/engine/sections/13-reviews';
import { runShipping } from '../src/engine/sections/14-shipping';
import { runCta } from '../src/engine/sections/15-cta';
import { runStatsNumbers } from '../src/engine/sections/16-stats-numbers';
import { runCompetitorCompare } from '../src/engine/sections/17-competitor-compare';
import { runBrandStory } from '../src/engine/sections/18-brand-story';
import { runPackageContents } from '../src/engine/sections/19-package-contents';
import { runPhotoReviews } from '../src/engine/sections/20-photo-reviews';
import { runSnsViral } from '../src/engine/sections/21-sns-viral';
import { runBundleSet } from '../src/engine/sections/22-bundle-set';
import { runLimitedOffer } from '../src/engine/sections/23-limited-offer';
import { runRefundPolicy } from '../src/engine/sections/24-refund-policy';
import { runCustomerService } from '../src/engine/sections/25-customer-service';
import { runPriceTable } from '../src/engine/sections/26-price-table';

// ────────────────────────────────────────────
// 테스트 유틸
// ────────────────────────────────────────────

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean): void {
  if (condition) {
    passed++;
  } else {
    failed++;
    // eslint-disable-next-line no-console
    console.log(`  ❌ ${name}`);
  }
}

function validateOutput(result: SectionAgentOutput, expectedKey: SectionKey, label: string): void {
  check(`${label}: sectionKey=${expectedKey}`, result.sectionKey === expectedKey);
  check(`${label}: order > 0`, result.order > 0);
  check(`${label}: headline 존재`, result.copy.headline.length > 0);
  check(`${label}: layout.type 존재`, result.layout.type.length > 0);
  check(`${label}: layout.structure 존재`, result.layout.structure.length > 0);
  check(`${label}: background 존재`, result.style.background.length > 0);
  check(`${label}: imagePrompt 존재`, result.imagePrompt.length > 0);
  check(`${label}: elementWeight 합산 > 0`,
    result.elementWeight.photo + result.elementWeight.text +
    result.elementWeight.graphic + result.elementWeight.animation > 0,
  );
}

// ────────────────────────────────────────────
// Mock 데이터: 뷰티 (impulse)
// ────────────────────────────────────────────

const beautyBrief: ProductBrief = {
  productDNA: {
    coreValue: '3초 만에 피부가 달라집니다',
    usp: ['임상시험 완료', '92% 만족도', '피부과 전문의 추천'],
    positioning: 'premium',
    valueHierarchy: { functional: '피부 개선', emotional: '자신감 회복', social: '주변 칭찬' },
  },
  customerDesire: { surface: '깨끗한 피부', real: '자신감 있는 외모', hidden: '사회적 인정' },
  customerFear: { problem: '피부 트러블 악화', opportunity: '좋은 제품 놓칠까봐', social: '나만 못 관리하는 느낌' },
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
// Mock 데이터: SaaS (analytical)
// ────────────────────────────────────────────

const saasBrief: ProductBrief = {
  ...beautyBrief,
  productDNA: {
    coreValue: '팀 생산성을 2배로',
    usp: ['실시간 협업', 'AI 자동 분석', '원클릭 리포트'],
    positioning: 'innovation',
    valueHierarchy: { functional: '업무 효율 향상', emotional: '성과에 대한 자신감', social: '팀 내 인정' },
  },
  customerDesire: { surface: '업무 효율화', real: '성과 인정', hidden: '승진/성장' },
  decisionType: 'analytical',
  marketContext: {
    ...beautyBrief.marketContext,
    competitionLevel: 'blue_ocean',
    purchaseCycle: 'subscription',
    priceSensitivity: 'low',
  },
};

// ────────────────────────────────────────────
// 26개 에이전트 매핑
// ────────────────────────────────────────────

const AGENTS: { key: SectionKey; run: (input: SectionAgentInput) => SectionAgentOutput }[] = [
  { key: 'HEADER_BANNER', run: runHeaderBanner },
  { key: 'KEY_FEATURES', run: runKeyFeatures },
  { key: 'FEATURE_DETAIL_1', run: runFeatureDetail1 },
  { key: 'FEATURE_DETAIL_2', run: runFeatureDetail2 },
  { key: 'FEATURE_DETAIL_3', run: runFeatureDetail3 },
  { key: 'SPECS', run: runSpecs },
  { key: 'HOW_TO_USE', run: runHowToUse },
  { key: 'TARGET_PERSONA', run: runTargetPersona },
  { key: 'BEFORE_AFTER', run: runBeforeAfter },
  { key: 'LIFESTYLE', run: runLifestyle },
  { key: 'CERTIFICATION', run: runCertification },
  { key: 'FAQ', run: runFaq },
  { key: 'REVIEWS', run: runReviews },
  { key: 'SHIPPING', run: runShipping },
  { key: 'CTA', run: runCta },
  { key: 'STATS_NUMBERS', run: runStatsNumbers },
  { key: 'COMPETITOR_COMPARE', run: runCompetitorCompare },
  { key: 'BRAND_STORY', run: runBrandStory },
  { key: 'PACKAGE_CONTENTS', run: runPackageContents },
  { key: 'PHOTO_REVIEWS', run: runPhotoReviews },
  { key: 'SNS_VIRAL', run: runSnsViral },
  { key: 'BUNDLE_SET', run: runBundleSet },
  { key: 'LIMITED_OFFER', run: runLimitedOffer },
  { key: 'REFUND_POLICY', run: runRefundPolicy },
  { key: 'CUSTOMER_SERVICE', run: runCustomerService },
  { key: 'PRICE_TABLE', run: runPriceTable },
];

// ────────────────────────────────────────────
// 실행: 뷰티 26개 + SaaS 26개
// ────────────────────────────────────────────

// eslint-disable-next-line no-console
console.log('\n========== 뷰티 (impulse) — 26개 섹션 ==========');

for (let i = 0; i < AGENTS.length; i++) {
  const { key, run } = AGENTS[i];
  const input: SectionAgentInput = {
    sectionKey: key,
    order: i + 1,
    productName: '글로우 세럼',
    industry: '뷰티/화장품',
    brief: beautyBrief,
    strategyHint: '가격 대비 성능 강조',
    tone: '강렬하고 직관적',
    targetEmotion: '즉시 필요성 체감',
  };
  const result = run(input);
  validateOutput(result, key, `뷰티-${key}`);
}

// eslint-disable-next-line no-console
console.log('\n========== SaaS (analytical) — 26개 섹션 ==========');

for (let i = 0; i < AGENTS.length; i++) {
  const { key, run } = AGENTS[i];
  const input: SectionAgentInput = {
    sectionKey: key,
    order: i + 1,
    productName: '프로덕티비',
    industry: 'SaaS/소프트웨어',
    brief: saasBrief,
    strategyHint: '무료 체험 유도',
    tone: '깔끔하고 전문적',
    targetEmotion: '업무 효율 기대',
  };
  const result = run(input);
  validateOutput(result, key, `SaaS-${key}`);
}

// ────────────────────────────────────────────
// 추가 검증: 업종별 비중 차이
// ────────────────────────────────────────────

// eslint-disable-next-line no-console
console.log('\n========== 업종별 비중 차이 검증 ==========');

const beautyHero = runHeaderBanner({
  sectionKey: 'HEADER_BANNER', order: 1, productName: '세럼', industry: '뷰티',
  brief: beautyBrief, strategyHint: '', tone: '', targetEmotion: '',
});
const saasHero = runHeaderBanner({
  sectionKey: 'HEADER_BANNER', order: 1, productName: '앱', industry: 'SaaS',
  brief: saasBrief, strategyHint: '', tone: '', targetEmotion: '',
});

check('뷰티 Hero: photo > graphic', beautyHero.elementWeight.photo > beautyHero.elementWeight.graphic);
check('SaaS Hero: graphic > photo', saasHero.elementWeight.graphic > saasHero.elementWeight.photo);
check('뷰티 impulse: 다크 배경', beautyHero.style.background === '#0F0F0F');
check('SaaS analytical: 라이트 배경', saasHero.style.background === '#FAFAFA');

// ────────────────────────────────────────────
// 결과
// ────────────────────────────────────────────

// eslint-disable-next-line no-console
console.log(`\n========== 결과: ${passed}/${passed + failed} 통과 ==========`);

if (failed > 0) {
  // eslint-disable-next-line no-console
  console.log(`❌ ${failed}개 실패`);
  process.exit(1);
} else {
  // eslint-disable-next-line no-console
  console.log('✅ 전체 통과');
}
