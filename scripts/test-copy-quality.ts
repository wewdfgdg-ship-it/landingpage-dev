/**
 * 카피 품질 게이트 테스트
 * 규칙 엔진 원본 카피의 품질 점수를 측정하여 리파인 필요성 확인
 *
 * 실행: npx tsx scripts/test-copy-quality.ts
 */

import type { ProductBrief } from '../src/engine/01-product-intelligence/types.js';
import type { StrategyBlueprint, StructureSection } from '../src/engine/03-conversion-strategy/types.js';
import { runWhyNow } from '../src/engine/02-why-now/index.js';
import { runObjectionKiller } from '../src/engine/04-objection-killer/index.js';
import { dispatchSections } from '../src/engine/sections/dispatcher.js';
import { toCopyBlocks } from '../src/engine/sections/adapter.js';
import { evaluateCopyQuality } from '../src/engine/05-psychological-copy/quality-gate.js';

// ============================================================
// Mock: ① Product Intelligence (뷰티 제품)
// ============================================================

const beautyBrief: ProductBrief = {
  productDNA: {
    coreValue: '피부 깊숙이 수분을 채워 하루 종일 촉촉한 피부를 유지해주는 고보습 세럼',
    usp: ['72시간 지속 보습', '피부 장벽 강화 세라마이드 5종 함유', '피부과 전문의 공동 개발'],
    positioning: 'premium',
    valueHierarchy: {
      functional: '72시간 깊은 보습과 피부 장벽 회복',
      emotional: '매일 아침 거울 속 달라진 피부를 확인하는 자신감',
      social: '전문가도 인정하는 스킨케어를 사용하는 스마트한 소비자',
    },
  },
  customerDesire: {
    surface: '건조하고 민감한 피부를 보습하고 싶다',
    real: '나이가 들어도 건강하고 빛나는 피부를 유지하고 싶다',
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

// ============================================================
// Mock: ③ Blueprint
// ============================================================

const mockStructure: StructureSection[] = [
  { order: 1, role: 'HOOK', sectionType: 'hero_visual', purpose: '시선을 사로잡는 비주얼 히어로' },
  { order: 2, role: 'PAIN', sectionType: 'pain_point', purpose: '건조한 피부 문제 공감' },
  { order: 3, role: 'SOLUTION', sectionType: 'benefit_highlight', purpose: '72시간 보습 솔루션 제시' },
  { order: 4, role: 'SOLUTION', sectionType: 'feature_detail', purpose: '세라마이드 5종 핵심 성분 상세' },
  { order: 5, role: 'SOLUTION', sectionType: 'how_to_use', purpose: '3단계 사용법' },
  { order: 6, role: 'PROOF', sectionType: 'reviews', purpose: '실사용자 리뷰' },
  { order: 7, role: 'PROOF', sectionType: 'certification', purpose: '피부과 전문의 인증' },
  { order: 8, role: 'PROOF', sectionType: 'stats', purpose: '임상 테스트 결과 수치' },
  { order: 9, role: 'OBJECTION', sectionType: 'faq', purpose: '자주 묻는 질문 해소' },
  { order: 10, role: 'URGENCY', sectionType: 'limited_offer', purpose: '한정 특가 카운트다운' },
  { order: 11, role: 'CTA', sectionType: 'final_cta', purpose: '최종 구매 유도' },
];

const mockBlueprint: StrategyBlueprint = {
  strategyType: 'direct_sale',
  totalSections: mockStructure.length,
  structure: mockStructure,
  ctaPositions: [5, 8, 11],
  estimatedScrollDepth: `${mockStructure.length * 600}px`,
  targetReadTime: `${Math.ceil(mockStructure.length * 0.5)}분`,
};

// ============================================================
// 실행
// ============================================================

function main(): void {
  const p = process.stdout.write.bind(process.stdout);

  p('========================================\n');
  p('  카피 품질 게이트 테스트\n');
  p('  규칙 엔진 원본 카피 품질 측정\n');
  p('========================================\n\n');

  // 파이프라인 실행 (규칙 엔진만)
  const urgencyBrief = runWhyNow(beautyBrief, 'beauty', '54,000원');
  const objectionMap = runObjectionKiller(beautyBrief, mockBlueprint);
  const dispatchResult = dispatchSections({
    brief: beautyBrief,
    blueprint: mockBlueprint,
    objectionMap,
    productName: '세라마이드 딥 하이드레이션 세럼',
    industry: 'beauty',
  });
  const copyBlocks = toCopyBlocks(dispatchResult.sections);

  // 품질 게이트 실행
  const qualityResult = evaluateCopyQuality(copyBlocks, 'beauty');

  p(`전체 평균 점수: ${qualityResult.overallScore}/100\n`);
  p(`통과: ${qualityResult.passedSections}/${qualityResult.totalSections}\n`);
  p(`실패: ${qualityResult.failedSections.length}개\n`);
  p(`게이트 통과: ${qualityResult.passed ? '✅' : '❌'}\n\n`);

  // 섹션별 상세
  p('--- 섹션별 상세 ---\n\n');
  for (const r of qualityResult.allResults) {
    const icon = r.passed ? '✅' : '❌';
    p(`${icon} [${r.sectionOrder}] ${r.role} / ${r.sectionType}\n`);
    p(`   점수: ${r.combinedScore}/100 (프레임: ${r.frameScore.score}, 톤: ${r.toneScore.score})\n`);

    if (r.frameScore.failedElements.length > 0) {
      p(`   ⚠ 프레임 부족: ${r.frameScore.failedElements.join(', ')}\n`);
    }
    if (r.toneScore.failedRules.length > 0) {
      p(`   ⚠ 톤 부족: ${r.toneScore.failedRules.join(', ')}\n`);
    }

    // 해당 섹션의 실제 카피 미리보기
    const section = copyBlocks.sections.find((s) => s.sectionOrder === r.sectionOrder);
    if (section) {
      p(`   headline: "${section.copy.headline}"\n`);
      p(`   ctaText: "${section.copy.ctaText}"\n`);
      p(`   imageDir: "${section.copy.imageDirection.substring(0, 60)}..."\n`);
    }
    p('\n');
  }

  // 요약
  p('========================================\n');
  p('  요약\n');
  p('========================================\n');
  p(`  평균 점수: ${qualityResult.overallScore}/100\n`);
  p(`  통과 기준: 80점 (전 섹션 통과 필요)\n`);

  const belowAvg = qualityResult.allResults.filter((r) => r.combinedScore < 80);
  if (belowAvg.length > 0) {
    p(`\n  🔻 80점 미만 섹션 (${belowAvg.length}개):\n`);
    for (const r of belowAvg) {
      p(`     [${r.sectionOrder}] ${r.role}: ${r.combinedScore}점\n`);
    }
    p(`\n  → AI 카피 리파인이 이 ${belowAvg.length}개 섹션을 우선 개선합니다.\n`);
    p(`  → 리파인 후 품질 게이트 재검증 (최대 2회 재시도)\n`);
  } else {
    p(`\n  ✅ 모든 섹션이 80점 이상 — 리파인 불필요\n`);
  }

  p('========================================\n');
}

main();
