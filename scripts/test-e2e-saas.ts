/**
 * E2E 파이프라인 드라이런 — SaaS 제품 시나리오
 * 실행: npx tsx scripts/test-e2e-saas.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

import type { ProductBrief } from '../src/engine/01-product-intelligence/types.js';
import type { StrategyBlueprint, StructureSection } from '../src/engine/03-conversion-strategy/types.js';
import { runWhyNow } from '../src/engine/02-why-now/index.js';
import { runObjectionKiller } from '../src/engine/04-objection-killer/index.js';
import { dispatchSections } from '../src/engine/sections/dispatcher.js';
import { toCopyBlocks, toLayoutConfig, toAttentionConfig } from '../src/engine/sections/adapter.js';
import { runVisualStyle } from '../src/engine/09-visual-style/index.js';
import { runCodeEngine } from '../src/engine/10-code-engine/index.js';

const saasBrief: ProductBrief = {
  productDNA: {
    coreValue: '팀 생산성을 3배 높이는 AI 기반 프로젝트 관리 플랫폼',
    usp: ['AI 자동 일정 최적화', '실시간 병목 감지 알림', 'Slack/Jira 원클릭 연동'],
    positioning: 'innovation',
    valueHierarchy: {
      functional: '프로젝트 관리 시간 60% 절감',
      emotional: '마감 스트레스에서 해방되는 여유로움',
      social: '최신 AI 도구를 도입한 혁신적 팀으로 인정',
    },
  },
  customerDesire: {
    surface: '프로젝트 일정을 효율적으로 관리하고 싶다',
    real: '팀 전체의 생산성을 체계적으로 높이고 싶다',
    hidden: '성과를 인정받아 승진하고 싶다',
  },
  customerFear: {
    problem: '늘어나는 프로젝트에 기존 도구로는 관리 불가능',
    opportunity: '경쟁사가 AI 도구 도입으로 앞서가는 것',
    social: '비효율적 팀 운영으로 리더십 의문시',
  },
  resistanceMap: {
    price: { level: 3, reason: '월 구독료 부담 (팀당 월 99,000원)' },
    trust: { level: 4, reason: 'AI 도구 정확도에 대한 의구심' },
    need: { level: 3, reason: '기존 Jira/Asana로 충분하다는 인식' },
    urgency: { level: 4, reason: '도입 시기를 미루는 경향' },
    complexity: { level: 4, reason: '팀 전체 마이그레이션의 부담감' },
  },
  decisionType: 'analytical',
  marketContext: {
    competitionLevel: 'red_ocean',
    priceSensitivity: 'medium',
    purchaseCycle: 'subscription',
    decisionTime: '1_week',
    primaryChannel: 'comparison',
  },
  confidenceScore: 75,
};

const saasStructure: StructureSection[] = [
  { order: 1, role: 'HOOK', sectionType: 'hero_visual', purpose: '혁신적 AI PM 도구 임팩트' },
  { order: 2, role: 'PAIN', sectionType: 'pain_point', purpose: '프로젝트 관리 병목 문제 공감' },
  { order: 3, role: 'SOLUTION', sectionType: 'key_features', purpose: '3대 핵심 기능 소개' },
  { order: 4, role: 'SOLUTION', sectionType: 'feature_detail', purpose: 'AI 일정 최적화 상세' },
  { order: 5, role: 'SOLUTION', sectionType: 'feature_detail', purpose: '병목 감지 알림 상세' },
  { order: 6, role: 'SOLUTION', sectionType: 'feature_detail', purpose: '연동 기능 상세' },
  { order: 7, role: 'SOLUTION', sectionType: 'how_to_use', purpose: '3단계 도입 프로세스' },
  { order: 8, role: 'PROOF', sectionType: 'stats', purpose: '도입 효과 수치' },
  { order: 9, role: 'PROOF', sectionType: 'reviews', purpose: '기업 고객 사례' },
  { order: 10, role: 'PROOF', sectionType: 'comparison', purpose: '경쟁 도구 비교표' },
  { order: 11, role: 'PROOF', sectionType: 'brand_story', purpose: '팀과 비전 소개' },
  { order: 12, role: 'OBJECTION', sectionType: 'faq', purpose: '기술적 질문 해소' },
  { order: 13, role: 'CTA', sectionType: 'pricing', purpose: '요금제 비교표' },
  { order: 14, role: 'CTA', sectionType: 'final_cta', purpose: '무료 체험 시작' },
];

const saasBlueprint: StrategyBlueprint = {
  strategyType: 'free_trial',
  totalSections: saasStructure.length,
  structure: saasStructure,
  ctaPositions: [7, 10, 14],
  estimatedScrollDepth: `${saasStructure.length * 600}px`,
  targetReadTime: `${Math.ceil(saasStructure.length * 0.5)}분`,
};

function main(): void {
  const p = process.stdout.write.bind(process.stdout);

  p('========================================\n');
  p('  E2E SaaS 시나리오 드라이런\n');
  p('========================================\n\n');

  const urgency = runWhyNow(saasBrief, 'saas', '99,000원/월');
  p(`② 긴급성: ${urgency.primaryType}, CTA Lv${urgency.ctaUrgencyLevel}\n`);

  const objections = runObjectionKiller(saasBrief, saasBlueprint);
  p(`④ 반론: ${objections.activeObjections.map(o => `${o.type}(Lv${o.level})`).join(', ')}\n`);

  const dispatched = dispatchSections({
    brief: saasBrief,
    blueprint: saasBlueprint,
    objectionMap: objections,
    productName: 'TeamFlow AI',
    industry: 'saas',
  });
  p(`디스패치: ${dispatched.dispatched}개 섹션\n`);

  const copy = toCopyBlocks(dispatched.sections);
  const layout = toLayoutConfig(dispatched.sections);
  const attention = toAttentionConfig(dispatched.sections);

  const style = runVisualStyle(saasBrief, 'saas');
  p(`⑨ 스타일: ${style.moodName} (${style.mood})\n`);

  const page = runCodeEngine('TeamFlow AI', copy, layout, style, attention.stickyCtaEnabled, 'test-saas-001');
  p(`⑪ 코드: ${page.totalSections}개 섹션, ${page.fullHtml.length.toLocaleString()} chars\n\n`);

  let ok = 0;
  for (const s of page.sections) {
    const valid = s.html.includes('<section');
    if (valid) ok++;
    p(`  ${valid ? '✅' : '❌'} [${s.order}] ${s.role} → ${s.patternId}\n`);
  }

  const outPath = join(process.cwd(), 'scripts', 'e2e-output-saas.html');
  writeFileSync(outPath, page.fullHtml, 'utf-8');
  p(`\n📄 HTML: ${outPath}\n`);

  p(`\n${ok === page.totalSections ? '✅ SaaS E2E 성공' : '❌ SaaS E2E 실패'} — ${ok}/${page.totalSections}\n`);
  if (ok !== page.totalSections) process.exit(1);
}

main();
