// ============================================================
// E2E Integration Test — 12엔진 파이프라인
// AI 호출/DB/외부 API 없이 규칙 엔진(02-10) 전체 테스트
// 실행: npx tsx scripts/test-e2e-pipeline.ts
// ============================================================

// --- Mock 환경변수 (모듈 로드 전에 설정) ---
process.env.ANTHROPIC_API_KEY = 'test-key-not-real';
process.env.R2_BUCKET_NAME = 'test-bucket';
process.env.R2_ACCOUNT_ID = 'test-account';
process.env.R2_ACCESS_KEY_ID = 'test-access';
process.env.R2_SECRET_ACCESS_KEY = 'test-secret';

import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { UrgencyBrief } from '@/engine/02-why-now/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { ObjectionMap } from '@/engine/04-objection-killer/types';
import type { CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { TrustConfig } from '@/engine/06-trust-architecture/types';
import type { AttentionConfig } from '@/engine/07-attention-architecture/types';
import type { LayoutConfig } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig } from '@/engine/09-visual-style/types';
import type { GeneratedPage } from '@/engine/10-code-engine/types';

import { runWhyNow } from '@/engine/02-why-now';
import { runObjectionKiller } from '@/engine/04-objection-killer';
import { runTrustArchitecture } from '@/engine/06-trust-architecture';
import { runAttentionArchitecture } from '@/engine/07-attention-architecture';
import { runLayoutIntelligence } from '@/engine/08-layout-intelligence';
import { runVisualStyle } from '@/engine/09-visual-style';
import { runCodeEngine } from '@/engine/10-code-engine';
import { runCrossEngineBridge, injectZoneAttributes } from '@/engine/cross-engine-bridge';

// ============================================================
// 테스트 결과 추적
// ============================================================

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function test(name: string, fn: () => void): void {
  const start = performance.now();
  try {
    fn();
    const durationMs = Math.round(performance.now() - start);
    results.push({ name, passed: true, durationMs });
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    const message = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, durationMs, error: message });
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function assertDefined<T>(value: T | null | undefined, name: string): T {
  if (value === null || value === undefined) {
    throw new Error(`${name} is null/undefined`);
  }
  return value;
}

// ============================================================
// Mock 데이터: 한국 BBQ 프랜차이즈 (엔진 01 출력 대체)
// ============================================================

const MOCK_BRIEF: ProductBrief = {
  productDNA: {
    coreValue: '정통 숯불 화로구이의 맛과 감성을 프랜차이즈로 전수',
    usp: [
      '직화 숯불 화로구이 전문 시스템',
      '30년 장인 레시피 기반 소스',
      '월 순이익 1,200만원 이상 검증',
    ],
    positioning: 'premium',
    valueHierarchy: {
      functional: '검증된 숯불구이 맛과 운영 시스템',
      emotional: '내 가게를 갖는 자부심과 안정감',
      social: '동네 맛집 사장님이라는 사회적 지위',
    },
  },
  customerDesire: {
    surface: '안정적인 수익을 내는 내 가게를 갖고 싶다',
    real: '직장 생활의 불안에서 벗어나 내 사업으로 독립하고 싶다',
    hidden: '가족에게 능력 있는 가장임을 증명하고 싶다',
  },
  customerFear: {
    problem: '프랜차이즈 실패 시 투자금 전액 손실 위험',
    opportunity: '좋은 자리를 다른 가맹점에 빼앗길 수 있다',
    social: '주변에서 사업 실패했다고 손가락질할까 봐',
  },
  resistanceMap: {
    price: { level: 4, reason: '가맹비+인테리어 총 1억 이상 투자 부담' },
    trust: { level: 3, reason: '프랜차이즈 본사 신뢰도 검증 필요' },
    need: { level: 2, reason: '창업 자체에 대한 필요성은 높음' },
    urgency: { level: 3, reason: '좋은 상권 선점 욕구' },
    complexity: { level: 3, reason: '창업 절차가 복잡해 보임' },
  },
  decisionType: 'cautious',
  marketContext: {
    competitionLevel: 'red_ocean',
    priceSensitivity: 'medium',
    purchaseCycle: 'one_time',
    decisionTime: '1_month_plus',
    primaryChannel: 'comparison',
  },
  confidenceScore: 82,
};

const INDUSTRY = 'food';
const PRICE_RANGE = '1억 2천만원';
const PRODUCT_NAME = '담가화로구이';
const PAGE_GOAL = 'inquiry';

// ============================================================
// 테스트 실행
// ============================================================

console.log('='.repeat(60));
console.log('  E2E 파이프라인 통합 테스트');
console.log('  제품: 담가화로구이 (한국 BBQ 프랜차이즈)');
console.log('='.repeat(60));
console.log('');

const pipelineStart = performance.now();

// --- 엔진 02: Why Now ---
let urgencyBrief: UrgencyBrief;
test('엔진 02: Why Now (긴급성 분석)', () => {
  urgencyBrief = runWhyNow(MOCK_BRIEF, INDUSTRY, PRICE_RANGE);
  assertDefined(urgencyBrief, 'urgencyBrief');
  assertDefined(urgencyBrief.primaryType, 'primaryType');
  assert(urgencyBrief.urgencyElements.length > 0, 'urgencyElements가 비어있음');
  assert(urgencyBrief.ctaUrgencyLevel >= 1, 'ctaUrgencyLevel이 1 미만');
  assert(urgencyBrief.ctaUrgencyLevel <= 5, 'ctaUrgencyLevel이 5 초과');
  assert(urgencyBrief.placement.length > 0, 'placement가 비어있음');
});

// --- 엔진 03 결과 Mock (AI 엔진이므로 결과를 하드코딩) ---
const MOCK_BLUEPRINT: StrategyBlueprint = {
  strategyType: 'lead_generation',
  totalSections: 14,
  structure: [
    { order: 1, role: 'HOOK', sectionType: 'hero_visual', purpose: '시각적 임팩트로 주의 환기' },
    { order: 2, role: 'PAIN', sectionType: 'pain_point', purpose: '창업 실패 공포 자극' },
    { order: 3, role: 'SOLUTION', sectionType: 'benefit_highlight', purpose: '검증된 시스템 제시' },
    { order: 4, role: 'PROOF', sectionType: 'testimonial', purpose: '실제 가맹점주 성공 사례' },
    { order: 5, role: 'SOLUTION', sectionType: 'feature_detail', purpose: '숯불 화로구이 시스템 상세' },
    { order: 6, role: 'PROOF', sectionType: 'number_proof', purpose: '매출/수익 수치 증명' },
    { order: 7, role: 'OBJECTION', sectionType: 'faq', purpose: '비용/절차 불안 해소' },
    { order: 8, role: 'SOLUTION', sectionType: 'process_steps', purpose: '창업 절차 간소화' },
    { order: 9, role: 'PROOF', sectionType: 'brand_story', purpose: '30년 장인 레시피 스토리' },
    { order: 10, role: 'OBJECTION', sectionType: 'comparison', purpose: '경쟁 프랜차이즈 비교' },
    { order: 11, role: 'URGENCY', sectionType: 'urgency_section', purpose: '상권 선점 긴급성' },
    { order: 12, role: 'PROOF', sectionType: 'gallery', purpose: '매장 인테리어 사진' },
    { order: 13, role: 'CTA', sectionType: 'pricing', purpose: '가맹 조건 제시' },
    { order: 14, role: 'CTA', sectionType: 'final_cta', purpose: '상담 신청 유도' },
  ],
  ctaPositions: [6, 13, 14],
  estimatedScrollDepth: '8400px',
  targetReadTime: '7분',
};

// --- 엔진 04: Objection Killer ---
let objectionMap: ObjectionMap;
test('엔진 04: Objection Killer (반론 방어)', () => {
  objectionMap = runObjectionKiller(MOCK_BRIEF, MOCK_BLUEPRINT);
  assertDefined(objectionMap, 'objectionMap');
  assertDefined(objectionMap.activeObjections, 'activeObjections');
  // price 저항이 level 4이므로 반드시 활성화
  assert(objectionMap.activeObjections.length > 0, 'activeObjections가 비어있음');
  const priceObj = objectionMap.activeObjections.find((o) => o.type === 'price');
  assert(priceObj !== undefined, 'price 반론이 없음 (level 4인데)');
});

// --- 엔진 05 결과 Mock (AI 엔진이므로 하드코딩) ---
const MOCK_COPY_BLOCKS: CopyBlocks = {
  sections: MOCK_BLUEPRINT.structure.map((s) => ({
    sectionOrder: s.order,
    role: s.role,
    sectionType: s.sectionType,
    copy: {
      headline: `${s.sectionType} 헤드라인`,
      subheadline: `${s.purpose}에 대한 서브헤드라인`,
      body: `담가화로구이는 30년 전통의 숯불 화로구이 시스템을 기반으로 한 프리미엄 프랜차이즈입니다. ${s.purpose}`,
      bulletPoints: [
        '월 평균 매출 4,500만원 달성',
        '본사 직영 교육 시스템 제공',
        '전국 150개 가맹점 운영 중',
      ],
      ctaText: s.role === 'CTA' ? '무료 상담 신청하기' : '',
      microCopy: s.role === 'CTA' ? '상담 신청은 무료이며 의무가 없습니다' : '',
      imageDirection: `${PRODUCT_NAME} ${s.sectionType} 이미지: 숯불 위 고기가 구워지는 장면`,
    },
  })),
  tone: '신뢰감 있고 전문적인 톤, 프랜차이즈 창업의 안정성 강조',
  qualityScore: 78,
};

// --- 엔진 06: Trust Architecture ---
let trustConfig: TrustConfig;
test('엔진 06: Trust Architecture (신뢰 구조)', () => {
  trustConfig = runTrustArchitecture(MOCK_BRIEF, MOCK_BLUEPRINT);
  assertDefined(trustConfig, 'trustConfig');
  assertDefined(trustConfig.trustElements, 'trustElements');
  assert(trustConfig.trustElements.length > 0, 'trustElements가 비어있음');
  assert(trustConfig.trustScore >= 0, 'trustScore가 0 미만');
  assert(trustConfig.trustScore <= 100, 'trustScore가 100 초과');
});

// --- 엔진 07: Attention Architecture ---
let attentionConfig: AttentionConfig;
test('엔진 07: Attention Architecture (주목도 설계)', () => {
  attentionConfig = runAttentionArchitecture(MOCK_BRIEF, MOCK_BLUEPRINT, INDUSTRY);
  assertDefined(attentionConfig, 'attentionConfig');
  assertDefined(attentionConfig.hookType, 'hookType');
  assertDefined(attentionConfig.gazePattern, 'gazePattern');
  assert(attentionConfig.zones.length > 0, 'zones가 비어있음');
  // 4 Zone 모두 존재하는지 확인
  const zoneTypes = attentionConfig.zones.map((z) => z.zone);
  assert(zoneTypes.includes('first_view'), 'first_view zone 없음');
  assert(zoneTypes.includes('interest'), 'interest zone 없음');
  assert(zoneTypes.includes('desire'), 'desire zone 없음');
  assert(zoneTypes.includes('action'), 'action zone 없음');
});

// --- 엔진 08: Layout Intelligence ---
let layoutConfig: LayoutConfig;
test('엔진 08: Layout Intelligence (레이아웃 구성)', () => {
  layoutConfig = runLayoutIntelligence(MOCK_BRIEF, MOCK_BLUEPRINT, attentionConfig!);
  assertDefined(layoutConfig, 'layoutConfig');
  assertDefined(layoutConfig.sections, 'sections');
  assert(layoutConfig.sections.length > 0, 'layout sections가 비어있음');
  assert(layoutConfig.diversityScore >= 0, 'diversityScore가 0 미만');
  assert(layoutConfig.mobileReadyScore >= 0, 'mobileReadyScore가 0 미만');

  // 모든 섹션에 selectedPattern이 있는지 확인
  for (const section of layoutConfig.sections) {
    assertDefined(section.selectedPattern, `section ${section.order} selectedPattern`);
    assert(section.selectedPattern.length > 0, `section ${section.order} selectedPattern이 빈 문자열`);
  }
});

// --- 엔진 09: Visual Style ---
let styleConfig: StyleConfig;
test('엔진 09: Visual Style (비주얼 스타일)', () => {
  styleConfig = runVisualStyle(MOCK_BRIEF, INDUSTRY);
  assertDefined(styleConfig, 'styleConfig');
  assertDefined(styleConfig.mood, 'mood');
  assertDefined(styleConfig.tokens, 'tokens');
  assertDefined(styleConfig.tokens.colors.primary, 'primary color');
  assertDefined(styleConfig.tokens.typography.h1, 'typography h1');
  assert(styleConfig.reasoning.length > 0, 'reasoning이 비어있음');
});

// --- Cross-Engine Bridge ---
let bridgeResult: ReturnType<typeof runCrossEngineBridge>;
test('Cross-Engine Bridge (엔진 간 교차 반영)', () => {
  bridgeResult = runCrossEngineBridge(
    MOCK_COPY_BLOCKS,
    objectionMap!,
    trustConfig!,
    attentionConfig!,
    layoutConfig!,
  );
  assertDefined(bridgeResult, 'bridgeResult');
  assertDefined(bridgeResult.copyBlocks, 'bridge copyBlocks');
  assertDefined(bridgeResult.layoutConfig, 'bridge layoutConfig');
  assertDefined(bridgeResult.zoneAnnotations, 'zoneAnnotations');
  assertDefined(bridgeResult.stats, 'bridge stats');
});

// --- 엔진 10: Code Engine (HTML 생성) ---
let generatedPage: GeneratedPage;
test('엔진 10: Code Engine (HTML 코드 생성)', () => {
  const copyBlocks = bridgeResult!.copyBlocks;
  const finalLayout = bridgeResult!.layoutConfig;

  generatedPage = runCodeEngine(
    PRODUCT_NAME,
    copyBlocks,
    finalLayout,
    styleConfig!,
    attentionConfig!.stickyCtaEnabled,
    'test-project-id',
  );

  assertDefined(generatedPage, 'generatedPage');
  assertDefined(generatedPage.fullHtml, 'fullHtml');
  assert(generatedPage.fullHtml.length > 0, 'fullHtml이 비어있음');
  assert(generatedPage.totalSections > 0, 'totalSections가 0');
  assertDefined(generatedPage.meta.title, 'meta title');
  assert(generatedPage.globalCss.length > 0, 'globalCss가 비어있음');
});

// --- Zone Annotation 주입 ---
test('Zone Annotation HTML 주입', () => {
  const annotated = injectZoneAttributes(
    generatedPage!.fullHtml,
    bridgeResult!.zoneAnnotations,
  );
  assertDefined(annotated, 'annotated HTML');
  assert(annotated.length >= generatedPage!.fullHtml.length, 'annotation 주입 후 HTML이 더 짧아짐');
});

// --- HTML 품질 검증 ---
test('HTML 구조 검증: DOCTYPE + head + body', () => {
  const html = generatedPage!.fullHtml;
  assert(html.includes('<!DOCTYPE html>'), 'DOCTYPE 없음');
  assert(html.includes('<html'), '<html> 태그 없음');
  assert(html.includes('<head>'), '<head> 태그 없음');
  assert(html.includes('</head>'), '</head> 태그 없음');
  assert(html.includes('<body>'), '<body> 태그 없음');
  assert(html.includes('</body>'), '</body> 태그 없음');
  assert(html.includes('</html>'), '</html> 태그 없음');
});

test('HTML 검증: 메타 태그', () => {
  const html = generatedPage!.fullHtml;
  assert(html.includes('charset='), 'charset 메타 없음');
  assert(html.includes('viewport'), 'viewport 메타 없음');
  assert(html.includes('<title>'), 'title 없음');
  assert(html.includes(PRODUCT_NAME), '제품명이 HTML에 없음');
  assert(html.includes('og:title'), 'og:title 없음');
});

test('HTML 검증: 글로벌 CSS', () => {
  const html = generatedPage!.fullHtml;
  assert(html.includes('<style>'), 'style 태그 없음');
  assert(html.includes('box-sizing'), 'box-sizing CSS 없음');
  assert(html.includes('scroll-behavior'), 'scroll-behavior CSS 없음');
});

test('HTML 검증: 섹션 구조 + data 속성', () => {
  const html = generatedPage!.fullHtml;
  assert(html.includes('data-section-id'), 'data-section-id 없음');
  assert(html.includes('data-section-order'), 'data-section-order 없음');
  // 최소 5개 이상 섹션 존재
  const sectionCount = (html.match(/data-section-order/g) ?? []).length;
  assert(sectionCount >= 5, `섹션이 5개 미만: ${sectionCount}개`);
});

test('HTML 검증: 트래킹 스크립트', () => {
  const html = generatedPage!.fullHtml;
  assert(html.includes('<script>'), 'script 태그 없음');
  assert(html.includes('test-project-id'), 'projectId가 트래킹에 없음');
});

test('HTML 검증: 반응형 CSS', () => {
  const html = generatedPage!.fullHtml;
  assert(html.includes('@media'), '@media 쿼리 없음');
  assert(html.includes('max-width:'), 'max-width 미디어쿼리 없음');
});

test('HTML 검증: 폰트 로딩', () => {
  const html = generatedPage!.fullHtml;
  assert(html.includes('preconnect'), 'font preconnect 없음');
  assert(
    html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com'),
    'Google Fonts 로딩 없음',
  );
});

// --- 엔진 간 데이터 정합성 검증 ---
test('정합성: Layout 섹션 수 == Blueprint 섹션 수', () => {
  // Layout은 Blueprint의 모든 섹션을 커버해야 함
  assert(
    layoutConfig!.sections.length === MOCK_BLUEPRINT.structure.length,
    `layout(${layoutConfig!.sections.length}) != blueprint(${MOCK_BLUEPRINT.structure.length})`,
  );
});

test('정합성: StyleConfig mood가 유효한 프리셋', () => {
  const validMoods = [
    'luxury', 'clean', 'tech', 'natural', 'fun_pop',
    'professional', 'startup', 'premium', 'bold', 'minimal',
  ];
  assert(
    validMoods.includes(styleConfig!.mood),
    `무효한 mood: ${styleConfig!.mood}`,
  );
});

test('정합성: AttentionConfig zones 비율 합 검증', () => {
  for (const zone of attentionConfig!.zones) {
    const total = zone.visualRatio + zone.textRatio + zone.dataRatio + zone.ctaRatio;
    // action zone은 ctaRatio 70%만 사용 (나머지는 의도적 미할당)
    // 다른 zone은 100%를 채움
    assert(total > 0, `zone ${zone.zone} 비율 합이 0`);
    assert(total <= 100, `zone ${zone.zone} 비율 합이 100 초과: ${total}`);
  }
});

// ============================================================
// 결과 출력
// ============================================================

const totalDuration = Math.round(performance.now() - pipelineStart);
const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;

console.log('');
console.log('-'.repeat(60));
console.log('  테스트 결과');
console.log('-'.repeat(60));
console.log('');

for (const r of results) {
  const icon = r.passed ? 'PASS' : 'FAIL';
  const tag = r.passed ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  console.log(`  ${tag}[${icon}]${reset} ${r.name} (${r.durationMs}ms)`);
  if (!r.passed && r.error) {
    console.log(`         ${tag}=> ${r.error}${reset}`);
  }
}

console.log('');
console.log('-'.repeat(60));
console.log(`  총 ${results.length}개 테스트 | ${passed} 통과 | ${failed} 실패 | ${totalDuration}ms`);
console.log('-'.repeat(60));

// --- 엔진별 상세 출력 ---
console.log('');
console.log('  엔진별 상세 결과:');
if (urgencyBrief!) {
  console.log(`    02 WhyNow: type=${urgencyBrief.primaryType}, elements=${urgencyBrief.urgencyElements.length}`);
}
if (objectionMap!) {
  console.log(`    04 Objection: active=${objectionMap.activeObjections.length}, types=[${objectionMap.activeObjections.map((o) => o.type).join(',')}]`);
}
if (trustConfig!) {
  console.log(`    06 Trust: elements=${trustConfig.trustElements.length}, score=${trustConfig.trustScore}`);
}
if (attentionConfig!) {
  console.log(`    07 Attention: hook=${attentionConfig.hookType}, gaze=${attentionConfig.gazePattern}, zones=${attentionConfig.zones.length}`);
}
if (layoutConfig!) {
  console.log(`    08 Layout: sections=${layoutConfig.sections.length}, diversity=${layoutConfig.diversityScore}, mobile=${layoutConfig.mobileReadyScore}`);
}
if (styleConfig!) {
  console.log(`    09 Style: mood=${styleConfig.mood}, font=${styleConfig.tokens.fontFamily}`);
}
if (generatedPage!) {
  console.log(`    10 Code: sections=${generatedPage.totalSections}, html=${generatedPage.fullHtml.length} chars`);
}
if (bridgeResult!) {
  console.log(`    Bridge: ${JSON.stringify(bridgeResult.stats)}`);
}

console.log('');

// 실패 시 exit code 1
if (failed > 0) {
  process.exit(1);
}
