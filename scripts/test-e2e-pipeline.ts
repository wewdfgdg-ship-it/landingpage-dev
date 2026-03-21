/**
 * E2E 파이프라인 통합 테스트
 * 규칙 엔진 전 구간 검증 (AI 호출/DB/R2 없이 로컬 실행)
 *
 * 검증 범위:
 * ② Why Now → ④ Objection Killer → Section Dispatcher → Adapter
 * → Quality Gate → ⑨ Visual Style → ⑪ Code Engine → HTML 출력
 *
 * 3개 업종 (뷰티, SaaS, 식품) × 전 구간 검증
 *
 * 실행: npx tsx scripts/test-e2e-pipeline.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

import type { ProductBrief } from '../src/engine/01-product-intelligence/types.js';
import type { StrategyBlueprint, StructureSection } from '../src/engine/03-conversion-strategy/types.js';
import { runWhyNow } from '../src/engine/02-why-now/index.js';
import { runObjectionKiller } from '../src/engine/04-objection-killer/index.js';
import { dispatchSections } from '../src/engine/sections/dispatcher.js';
import { toCopyBlocks, toLayoutConfig, toAttentionConfig } from '../src/engine/sections/adapter.js';
import { evaluateCopyQuality } from '../src/engine/05-psychological-copy/quality-gate.js';
import { runVisualStyle } from '../src/engine/09-visual-style/index.js';
import { runCodeEngine } from '../src/engine/10-code-engine/index.js';

// ============================================================
// 테스트 데이터: 3개 업종
// ============================================================

const BEAUTY_BRIEF: ProductBrief = {
  productDNA: {
    coreValue: '피부 깊숙이 수분을 채워 하루 종일 촉촉한 피부를 유지해주는 고보습 세럼',
    usp: ['72시간 지속 보습', '세라마이드 5종 함유', '피부과 전문의 공동 개발'],
    positioning: 'premium',
    valueHierarchy: {
      functional: '72시간 깊은 보습과 피부 장벽 회복',
      emotional: '매일 아침 거울 속 달라진 피부를 확인하는 자신감',
      social: '전문가도 인정하는 스킨케어를 사용하는 스마트한 소비자',
    },
  },
  customerDesire: {
    surface: '건조하고 민감한 피부를 보습하고 싶다',
    real: '건강하고 빛나는 피부를 유지하고 싶다',
    hidden: '외모에 자신감을 갖고 주변의 칭찬을 듣고 싶다',
  },
  customerFear: {
    problem: '점점 건조해지고 주름이 깊어지는 피부',
    opportunity: '지금 관리하지 않으면 되돌릴 수 없는 피부 노화',
    social: '나이보다 늙어 보이는 것에 대한 두려움',
  },
  resistanceMap: {
    price: { level: 4, reason: '5만원대 세럼은 비싸다는 인식' },
    trust: { level: 3, reason: '새로운 브랜드에 대한 불신' },
    need: { level: 2, reason: '기존 보습제로 충분하다는 생각' },
    urgency: { level: 3, reason: '지금 꼭 바꿀 필요는 없다는 인식' },
    complexity: { level: 1, reason: '사용법이 간단함' },
  },
  decisionType: 'impulse',
  marketContext: {
    competitionLevel: 'red_ocean',
    priceSensitivity: 'medium',
    purchaseCycle: 'repeat',
    decisionTime: '1_day',
    primaryChannel: 'direct_online',
  },
  confidenceScore: 82,
};

const SAAS_BRIEF: ProductBrief = {
  productDNA: {
    coreValue: '팀 프로젝트 일정을 AI가 자동 최적화하여 야근을 줄여주는 업무 관리 도구',
    usp: ['AI 자동 일정 조율', '실시간 병목 감지', '슬랙/노션 통합'],
    positioning: 'innovation',
    valueHierarchy: {
      functional: '프로젝트 일정 자동 최적화와 병목 사전 감지',
      emotional: '퇴근 후 여유 시간을 되찾는 안도감',
      social: '효율적인 팀을 만드는 리더라는 인정',
    },
  },
  customerDesire: {
    surface: '프로젝트 일정을 효율적으로 관리하고 싶다',
    real: '야근 없이 성과를 내는 팀을 만들고 싶다',
    hidden: '능력 있는 리더로 인정받고 싶다',
  },
  customerFear: {
    problem: '계속되는 일정 지연과 팀원 번아웃',
    opportunity: '경쟁 팀은 이미 AI 도구로 효율을 높이고 있다',
    social: '무능한 관리자라는 평가를 받을까 두렵다',
  },
  resistanceMap: {
    price: { level: 3, reason: '월 구독료에 대한 부담' },
    trust: { level: 4, reason: 'AI 자동화에 대한 불안감' },
    need: { level: 2, reason: '기존 도구로 충분하다는 인식' },
    urgency: { level: 2, reason: '당장 바꿀 동기 부족' },
    complexity: { level: 4, reason: '팀 전체 마이그레이션 부담' },
  },
  decisionType: 'analytical',
  marketContext: {
    competitionLevel: 'red_ocean',
    priceSensitivity: 'low',
    purchaseCycle: 'subscription',
    decisionTime: '1_week',
    primaryChannel: 'comparison',
  },
  confidenceScore: 78,
};

const FOOD_BRIEF: ProductBrief = {
  productDNA: {
    coreValue: '100% 국산 유기농 재료로 만든 무첨가 수제 그래놀라',
    usp: ['100% 유기농 인증', '설탕 대신 꿀 사용', '당일 제조 배송'],
    positioning: 'premium',
    valueHierarchy: {
      functional: '건강한 아침 식사와 영양 균형',
      emotional: '가족에게 건강한 음식을 먹인다는 뿌듯함',
      social: '건강한 라이프스타일을 실천하는 사람',
    },
  },
  customerDesire: {
    surface: '간편하고 건강한 아침 식사를 하고 싶다',
    real: '가족 건강을 챙기면서 바쁜 아침을 해결하고 싶다',
    hidden: '좋은 부모/배우자로 인정받고 싶다',
  },
  customerFear: {
    problem: '첨가물 가득한 가공식품을 먹고 있다는 불안',
    opportunity: '건강 관리를 소홀히 하면 나중에 후회할 것',
    social: '가족 건강을 신경 쓰지 않는다는 죄책감',
  },
  resistanceMap: {
    price: { level: 3, reason: '일반 시리얼 대비 3배 가격' },
    trust: { level: 2, reason: '유기농 인증 신뢰' },
    need: { level: 3, reason: '기존 아침 루틴이 있다' },
    urgency: { level: 2, reason: '당장 바꿀 이유 부족' },
    complexity: { level: 1, reason: '그냥 먹으면 됨' },
  },
  decisionType: 'cautious',
  marketContext: {
    competitionLevel: 'niche',
    priceSensitivity: 'medium',
    purchaseCycle: 'repeat',
    decisionTime: '1_day',
    primaryChannel: 'direct_online',
  },
  confidenceScore: 85,
};

interface TestCase {
  name: string;
  industry: string;
  productName: string;
  priceRange: string;
  brief: ProductBrief;
  structure: StructureSection[];
}

function buildStructure(roles: [string, string, string][]): StructureSection[] {
  return roles.map(([role, type, purpose], i): StructureSection => ({
    order: i + 1,
    role: role as StructureSection['role'],
    sectionType: type,
    purpose,
  }));
}

const TEST_CASES: TestCase[] = [
  {
    name: '뷰티 (프리미엄 세럼)',
    industry: 'beauty',
    productName: '세라마이드 딥 하이드레이션 세럼',
    priceRange: '54,000원',
    brief: BEAUTY_BRIEF,
    structure: buildStructure([
      ['HOOK', 'hero_visual', '시선을 사로잡는 비주얼'],
      ['PAIN', 'pain_point', '건조한 피부 문제 공감'],
      ['SOLUTION', 'benefit_highlight', '72시간 보습 솔루션'],
      ['SOLUTION', 'feature_detail', '세라마이드 5종 상세'],
      ['SOLUTION', 'how_to_use', '3단계 사용법'],
      ['PROOF', 'reviews', '실사용자 리뷰'],
      ['PROOF', 'certification', '피부과 전문의 인증'],
      ['PROOF', 'stats', '임상 테스트 수치'],
      ['OBJECTION', 'faq', '자주 묻는 질문'],
      ['URGENCY', 'limited_offer', '한정 특가'],
      ['CTA', 'final_cta', '최종 구매 유도'],
    ]),
  },
  {
    name: 'SaaS (프로젝트 관리)',
    industry: 'saas',
    productName: 'PlanAI',
    priceRange: '월 29,000원',
    brief: SAAS_BRIEF,
    structure: buildStructure([
      ['HOOK', 'hero_visual', '메인 비주얼'],
      ['PAIN', 'pain_point', '일정 지연 문제'],
      ['SOLUTION', 'benefit_highlight', 'AI 자동 최적화'],
      ['SOLUTION', 'feature_detail', '핵심 기능 상세'],
      ['PROOF', 'stats', '도입 효과 수치'],
      ['PROOF', 'reviews', '고객 후기'],
      ['OBJECTION', 'faq', '도입 FAQ'],
      ['CTA', 'final_cta', '무료 체험 유도'],
    ]),
  },
  {
    name: '식품 (유기농 그래놀라)',
    industry: 'food',
    productName: '오가닉 허니 그래놀라',
    priceRange: '18,000원',
    brief: FOOD_BRIEF,
    structure: buildStructure([
      ['HOOK', 'hero_visual', '메인 비주얼'],
      ['PAIN', 'pain_point', '가공식품 불안'],
      ['SOLUTION', 'benefit_highlight', '유기농 솔루션'],
      ['PROOF', 'certification', '유기농 인증'],
      ['PROOF', 'reviews', '고객 후기'],
      ['OBJECTION', 'faq', 'FAQ'],
      ['URGENCY', 'limited_offer', '한정 특가'],
      ['CTA', 'final_cta', '구매 유도'],
    ]),
  },
];

// ============================================================
// 테스트 실행
// ============================================================

interface StepResult {
  step: string;
  passed: boolean;
  detail: string;
}

interface TestResult {
  name: string;
  passed: boolean;
  steps: StepResult[];
  metrics: {
    sectionCount: number;
    qualityScore: number;
    qualityPassed: boolean;
    failedSections: number;
    htmlLength: number;
    htmlSectionCount: number;
    mood: string;
  };
}

function runTest(tc: TestCase): TestResult {
  const steps: StepResult[] = [];

  // ② Why Now
  let urgencyBrief;
  try {
    urgencyBrief = runWhyNow(tc.brief, tc.industry, tc.priceRange);
    const ok = urgencyBrief.urgencyElements.length > 0;
    steps.push({
      step: '② Why Now',
      passed: ok,
      detail: `유형=${urgencyBrief.primaryType}, 요소=${urgencyBrief.urgencyElements.length}개, CTA긴급도=${urgencyBrief.ctaUrgencyLevel}/5`,
    });
  } catch (e) {
    steps.push({ step: '② Why Now', passed: false, detail: `에러: ${e instanceof Error ? e.message : String(e)}` });
    return { name: tc.name, passed: false, steps, metrics: {} as TestResult['metrics'] };
  }

  // Blueprint (mock)
  const blueprint: StrategyBlueprint = {
    strategyType: 'direct_sale',
    totalSections: tc.structure.length,
    structure: tc.structure,
    ctaPositions: tc.structure.filter((s) => s.role === 'CTA').map((s) => s.order),
    estimatedScrollDepth: `${tc.structure.length * 600}px`,
    targetReadTime: `${Math.ceil(tc.structure.length * 0.5)}분`,
  };

  // ④ Objection Killer
  let objectionMap;
  try {
    objectionMap = runObjectionKiller(tc.brief, blueprint);
    const ok = objectionMap.activeObjections.length > 0;
    steps.push({
      step: '④ Objection Killer',
      passed: ok,
      detail: `활성반론=${objectionMap.activeObjections.length}개`,
    });
  } catch (e) {
    steps.push({ step: '④ Objection Killer', passed: false, detail: `에러: ${e instanceof Error ? e.message : String(e)}` });
    return { name: tc.name, passed: false, steps, metrics: {} as TestResult['metrics'] };
  }

  // Section Dispatch
  let dispatchResult;
  try {
    dispatchResult = dispatchSections({
      brief: tc.brief,
      blueprint,
      objectionMap,
      productName: tc.productName,
      industry: tc.industry,
    });
    const ok = dispatchResult.sections.length === tc.structure.length;
    steps.push({
      step: '섹션 디스패치',
      passed: ok,
      detail: `입력=${tc.structure.length}개, 출력=${dispatchResult.sections.length}개`,
    });
  } catch (e) {
    steps.push({ step: '섹션 디스패치', passed: false, detail: `에러: ${e instanceof Error ? e.message : String(e)}` });
    return { name: tc.name, passed: false, steps, metrics: {} as TestResult['metrics'] };
  }

  // Adapter
  let copyBlocks, layoutConfig, attentionConfig;
  try {
    copyBlocks = toCopyBlocks(dispatchResult.sections);
    layoutConfig = toLayoutConfig(dispatchResult.sections);
    attentionConfig = toAttentionConfig(dispatchResult.sections);
    const copyOk = copyBlocks.sections.length === dispatchResult.sections.length;
    const layoutOk = layoutConfig.sections.length === dispatchResult.sections.length;
    steps.push({
      step: '어댑터 변환',
      passed: copyOk && layoutOk,
      detail: `Copy=${copyBlocks.sections.length}, Layout=${layoutConfig.sections.length}, Zones=${attentionConfig.zones.length}`,
    });
  } catch (e) {
    steps.push({ step: '어댑터 변환', passed: false, detail: `에러: ${e instanceof Error ? e.message : String(e)}` });
    return { name: tc.name, passed: false, steps, metrics: {} as TestResult['metrics'] };
  }

  // 데이터 무결성
  let integrityOk = true;
  const integrityIssues: string[] = [];
  for (const section of copyBlocks.sections) {
    if (!section.copy.headline || section.copy.headline.length === 0) {
      integrityIssues.push(`[${section.sectionOrder}] headline 누락`);
      integrityOk = false;
    }
    if (!section.copy.imageDirection || section.copy.imageDirection.length < 5) {
      integrityIssues.push(`[${section.sectionOrder}] imageDirection 부족`);
      integrityOk = false;
    }
    if (!section.role || !section.sectionType) {
      integrityIssues.push(`[${section.sectionOrder}] role/sectionType 누락`);
      integrityOk = false;
    }
  }
  steps.push({
    step: '데이터 무결성',
    passed: integrityOk,
    detail: integrityOk ? `${copyBlocks.sections.length}개 섹션 모두 정상` : integrityIssues.join(', '),
  });

  // Quality Gate
  let qualityResult;
  try {
    qualityResult = evaluateCopyQuality(copyBlocks, tc.industry);
    steps.push({
      step: '품질 게이트',
      passed: true, // 점수 측정만 (규칙 엔진 원본은 미통과가 정상)
      detail: `점수=${qualityResult.overallScore}/100, 통과=${qualityResult.passedSections}/${qualityResult.totalSections}`,
    });
  } catch (e) {
    steps.push({ step: '품질 게이트', passed: false, detail: `에러: ${e instanceof Error ? e.message : String(e)}` });
    return { name: tc.name, passed: false, steps, metrics: {} as TestResult['metrics'] };
  }

  // ⑨ Visual Style
  let styleConfig;
  try {
    styleConfig = runVisualStyle(tc.brief, tc.industry);
    const ok = !!styleConfig.mood && !!styleConfig.tokens;
    steps.push({
      step: '⑨ Visual Style',
      passed: ok,
      detail: `무드=${styleConfig.moodName} (${styleConfig.mood}), 폰트=${styleConfig.tokens.fontFamily}`,
    });
  } catch (e) {
    steps.push({ step: '⑨ Visual Style', passed: false, detail: `에러: ${e instanceof Error ? e.message : String(e)}` });
    return { name: tc.name, passed: false, steps, metrics: {} as TestResult['metrics'] };
  }

  // ⑪ Code Engine
  let generatedPage;
  try {
    generatedPage = runCodeEngine(
      tc.productName,
      copyBlocks,
      layoutConfig,
      styleConfig,
      attentionConfig.stickyCtaEnabled,
      `test-${tc.industry}`,
    );
    const htmlOk = generatedPage.fullHtml.length > 500;
    const sectionOk = generatedPage.totalSections === copyBlocks.sections.length;
    steps.push({
      step: '⑪ Code Engine',
      passed: htmlOk && sectionOk,
      detail: `HTML=${(generatedPage.fullHtml.length / 1024).toFixed(1)}KB, 섹션=${generatedPage.totalSections}`,
    });
  } catch (e) {
    steps.push({ step: '⑪ Code Engine', passed: false, detail: `에러: ${e instanceof Error ? e.message : String(e)}` });
    return { name: tc.name, passed: false, steps, metrics: {} as TestResult['metrics'] };
  }

  // HTML 파일 출력
  const outPath = join(process.cwd(), 'scripts', `e2e-output-${tc.industry}.html`);
  writeFileSync(outPath, generatedPage.fullHtml, 'utf-8');

  const allPassed = steps.every((s) => s.passed);

  return {
    name: tc.name,
    passed: allPassed,
    steps,
    metrics: {
      sectionCount: dispatchResult.sections.length,
      qualityScore: qualityResult.overallScore,
      qualityPassed: qualityResult.passed,
      failedSections: qualityResult.failedSections.length,
      htmlLength: generatedPage.fullHtml.length,
      htmlSectionCount: generatedPage.totalSections,
      mood: styleConfig.moodName,
    },
  };
}

// ============================================================
// 메인
// ============================================================

function main(): void {
  const p = process.stdout.write.bind(process.stdout);

  p('╔══════════════════════════════════════════════════╗\n');
  p('║  E2E 파이프라인 통합 테스트 (3개 업종)           ║\n');
  p('║  규칙 엔진 전 구간 (AI/DB/R2 없이)              ║\n');
  p('╚══════════════════════════════════════════════════╝\n\n');

  const results: TestResult[] = [];

  for (const tc of TEST_CASES) {
    p(`━━━ ${tc.name} ━━━\n`);
    p(`  제품: ${tc.productName} | 업종: ${tc.industry} | 가격: ${tc.priceRange}\n\n`);

    const result = runTest(tc);
    results.push(result);

    for (const step of result.steps) {
      const icon = step.passed ? '✅' : '❌';
      p(`  ${icon} ${step.step}: ${step.detail}\n`);
    }

    const m = result.metrics;
    if (m.sectionCount > 0) {
      p(`\n  📊 요약: ${m.sectionCount}개 섹션 | 품질 ${m.qualityScore}/100`);
      p(` (${m.failedSections}개 미통과) | HTML ${(m.htmlLength / 1024).toFixed(1)}KB | 무드: ${m.mood}\n`);
    }

    p(`\n  ${result.passed ? '✅ 통과' : '❌ 실패'}\n\n`);
  }

  // 전체 요약
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  p('══════════════════════════════════════════════════\n');
  p(`  전체 결과: ${results.length}개 테스트 | ✅ ${passed} 통과 | ❌ ${failed} 실패\n`);
  p('══════════════════════════════════════════════════\n');

  if (failed > 0) {
    p('\n❌ 일부 테스트 실패\n');
    for (const r of results.filter((x) => !x.passed)) {
      p(`  - ${r.name}: ${r.steps.filter((s) => !s.passed).map((s) => s.step).join(', ')}\n`);
    }
    process.exit(1);
  } else {
    p('\n✅ 모든 테스트 통과\n');
    p(`  HTML 출력: scripts/e2e-output-{beauty,saas,food}.html\n`);
  }
}

main();
