// ============================================================
// Real Usage Pipeline Test — 실제 제품 데이터 기반 파이프라인 검증
// AI 호출 없이 규칙 엔진(2,4,6,7,8,9) + 크로스 브릿지 + 코드 엔진(10)
// + 무드 템플릿 렌더링(renderMoodTemplate, renderFranchiseTemplate) 테스트
//
// 실행: npx tsx scripts/test-real-usage.ts
// ============================================================

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// 엔진 임포트
import { runWhyNow } from '@/engine/02-why-now';
import { runObjectionKiller } from '@/engine/04-objection-killer';
import { runTrustArchitecture } from '@/engine/06-trust-architecture';
import { runAttentionArchitecture } from '@/engine/07-attention-architecture';
import { runLayoutIntelligence } from '@/engine/08-layout-intelligence';
import { runVisualStyle } from '@/engine/09-visual-style';
import { runCodeEngine } from '@/engine/10-code-engine';
import { runCrossEngineBridge, injectZoneAttributes } from '@/engine/cross-engine-bridge';
import {
  renderMoodTemplate,
  renderFranchiseTemplate,
  type MoodTemplateData,
  type FranchiseTemplateData,
  type StyleTokens,
} from '@/engine/10-code-engine/mood-renderer';

// 타입 임포트
import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint, SectionRole } from '@/engine/03-conversion-strategy/types';
import type { CopyBlocks, SectionCopy } from '@/engine/05-psychological-copy/types';

// ============================================================
// 유틸: HTML 검증
// ============================================================

interface ValidationResult {
  hasDoctype: boolean;
  hasHead: boolean;
  hasBody: boolean;
  hasSections: boolean;
  sectionCount: number;
  fileSize: number;
  fileSizeKB: string;
  passed: boolean;
  errors: string[];
}

function validateHtml(html: string): ValidationResult {
  const errors: string[] = [];

  const hasDoctype = html.toLowerCase().startsWith('<!doctype html');
  if (!hasDoctype) errors.push('DOCTYPE 없음');

  const hasHead = /<head[\s>]/i.test(html) && /<\/head>/i.test(html);
  if (!hasHead) errors.push('<head> 없음');

  const hasBody = /<body[\s>]/i.test(html) && /<\/body>/i.test(html);
  if (!hasBody) errors.push('<body> 없음');

  const sectionMatches = html.match(/data-section-order="/g);
  const sectionCount = sectionMatches?.length ?? 0;
  const hasSections = sectionCount >= 1;
  if (!hasSections) errors.push('섹션 없음');

  const fileSize = Buffer.byteLength(html, 'utf-8');

  return {
    hasDoctype,
    hasHead,
    hasBody,
    hasSections,
    sectionCount,
    fileSize,
    fileSizeKB: (fileSize / 1024).toFixed(1),
    passed: errors.length === 0,
    errors,
  };
}

function validateMoodHtml(html: string): ValidationResult {
  const errors: string[] = [];

  const hasDoctype = html.toLowerCase().startsWith('<!doctype html');
  if (!hasDoctype) errors.push('DOCTYPE 없음');

  const hasHead = /<head[\s>]/i.test(html) && /<\/head>/i.test(html);
  if (!hasHead) errors.push('<head> 없음');

  const hasBody = /<body[\s>]/i.test(html) && /<\/body>/i.test(html);
  if (!hasBody) errors.push('<body> 없음');

  const sectionMatches = html.match(/<section[\s>]/gi);
  const sectionCount = sectionMatches?.length ?? 0;
  const hasSections = sectionCount >= 1;
  if (!hasSections) errors.push('섹션 없음');

  const fileSize = Buffer.byteLength(html, 'utf-8');

  return {
    hasDoctype,
    hasHead,
    hasBody,
    hasSections,
    sectionCount,
    fileSize,
    fileSizeKB: (fileSize / 1024).toFixed(1),
    passed: errors.length === 0,
    errors,
  };
}

// ============================================================
// 시나리오 1: 담가화로구이 (프랜차이즈 BBQ)
// ============================================================

function createDamgaBrief(): ProductBrief {
  return {
    productDNA: {
      coreValue: '직화 숯불 위에서 담그는 특허 화로구이 프랜차이즈',
      usp: ['특허받은 담가 화로 시스템', '매장당 월 평균 매출 1.2억', '본사 직영 소스 공급'],
      positioning: 'value',
      valueHierarchy: {
        functional: '간편한 오퍼레이션으로 소자본 창업 가능',
        emotional: '내 가게를 가진다는 성취감',
        social: '성공한 자영업자로서의 인정',
      },
    },
    customerDesire: {
      surface: '안정적인 프랜차이즈 창업',
      real: '실패하지 않는 검증된 사업',
      hidden: '경제적 자유와 독립',
    },
    customerFear: {
      problem: '폐업률 높은 외식업에서 실패할까봐',
      opportunity: '좋은 입지를 다른 브랜드에 뺏길까봐',
      social: '실패하면 주변 시선이 두려움',
    },
    resistanceMap: {
      price: { level: 4, reason: '가맹비 + 인테리어비 등 초기 투자비용 부담' },
      trust: { level: 3, reason: '본사 지원이 실제로 충분한지 의심' },
      need: { level: 2, reason: '외식 프랜차이즈의 필요성은 명확' },
      urgency: { level: 3, reason: '지금 시작해야 하는 이유 부족' },
      complexity: { level: 2, reason: '본사 시스템으로 운영 간편' },
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
}

function createDamgaBlueprint(): StrategyBlueprint {
  return {
    strategyType: 'lead_generation',
    totalSections: 10,
    structure: [
      { order: 1, role: 'HOOK' as SectionRole, sectionType: 'hero_visual', purpose: '매출 데이터로 시선 강탈' },
      { order: 2, role: 'PROOF' as SectionRole, sectionType: 'number_proof', purpose: '가맹점 실적 증명' },
      { order: 3, role: 'PAIN' as SectionRole, sectionType: 'pain_point', purpose: '외식창업 불안 자극' },
      { order: 4, role: 'SOLUTION' as SectionRole, sectionType: 'benefit_highlight', purpose: '담가 시스템 소개' },
      { order: 5, role: 'PROOF' as SectionRole, sectionType: 'social_proof', purpose: '성공 가맹점주 스토리' },
      { order: 6, role: 'SOLUTION' as SectionRole, sectionType: 'feature_detail', purpose: '본사 지원 상세' },
      { order: 7, role: 'OBJECTION' as SectionRole, sectionType: 'comparison', purpose: '타 브랜드 대비 비교' },
      { order: 8, role: 'PROOF' as SectionRole, sectionType: 'media_feature', purpose: 'TV/SNS 노출' },
      { order: 9, role: 'URGENCY' as SectionRole, sectionType: 'urgency_trigger', purpose: '남은 상권 한정' },
      { order: 10, role: 'CTA' as SectionRole, sectionType: 'final_cta', purpose: '창업 상담 신청' },
    ],
    ctaPositions: [5, 10],
    estimatedScrollDepth: '85%',
    targetReadTime: '3분',
  };
}

function createDamgaCopyBlocks(): CopyBlocks {
  const sections: SectionCopy[] = [
    {
      sectionOrder: 1, role: 'HOOK', sectionType: 'hero_visual',
      copy: {
        headline: '월 매출 1.2억의 비밀',
        subheadline: '담가화로구이가 대한민국 숯불구이의 기준을 바꾸고 있습니다',
        body: '특허받은 화로 시스템으로 누구나 전문 화로구이를 제공할 수 있습니다.',
        bulletPoints: ['특허 화로 시스템', '본사 직영 소스', '평균 매출 1.2억'],
        ctaText: '창업 상담 신청',
        microCopy: '30초면 신청 완료',
        imageDirection: '화로 위에서 고기가 구워지는 역동적인 장면',
      },
    },
    {
      sectionOrder: 2, role: 'PROOF', sectionType: 'number_proof',
      copy: {
        headline: '숫자가 증명합니다',
        subheadline: '담가화로구이 가맹점의 실제 성과',
        body: '전국 120개 가맹점이 월 평균 1.2억의 매출을 기록하고 있습니다.',
        bulletPoints: ['120개 가맹점', '월 평균 매출 1.2억', '폐업률 2.3%'],
        ctaText: '실적 자료 받기',
        microCopy: '',
        imageDirection: '매장 내부 전경',
      },
    },
    {
      sectionOrder: 3, role: 'PAIN', sectionType: 'pain_point',
      copy: {
        headline: '외식 창업, 왜 실패할까요?',
        subheadline: '외식업 폐업률 60%. 검증 없는 시작이 문제입니다',
        body: '메뉴 차별화 없는 브랜드, 체계 없는 운영, 부족한 본사 지원. 이 세 가지가 실패의 원인입니다.',
        bulletPoints: ['메뉴 경쟁력 부재', '운영 매뉴얼 미흡', '본사 지원 부족'],
        ctaText: '',
        microCopy: '',
        imageDirection: '비어있는 음식점 내부',
      },
    },
    {
      sectionOrder: 4, role: 'SOLUTION', sectionType: 'benefit_highlight',
      copy: {
        headline: '담가 시스템이 다릅니다',
        subheadline: '특허 화로 + 직영 소스 + 완벽한 운영 시스템',
        body: '초보 사장님도 오픈 첫 달부터 안정적인 매출을 만들 수 있도록 설계된 시스템입니다.',
        bulletPoints: ['특허 화로 시스템으로 맛 균일화', '본사 직영 소스로 원가 절감', '전담 SV 1:1 밀착 관리'],
        ctaText: '시스템 상세 보기',
        microCopy: '',
        imageDirection: '화로구이 시스템 클로즈업',
      },
    },
    {
      sectionOrder: 5, role: 'PROOF', sectionType: 'social_proof',
      copy: {
        headline: '가맹점주님들의 이야기',
        subheadline: '',
        body: '실제 운영 중인 가맹점주님들이 직접 전하는 담가화로구이의 가치입니다.',
        bulletPoints: [],
        ctaText: '가맹 문의하기',
        microCopy: '창업비용 0원 상담',
        imageDirection: '가맹점주 인터뷰 장면',
      },
    },
    {
      sectionOrder: 6, role: 'SOLUTION', sectionType: 'feature_detail',
      copy: {
        headline: '본사가 끝까지 함께합니다',
        subheadline: '오픈 전 교육부터 매출 관리까지',
        body: '담가화로구이 본사는 단순 브랜드 제공이 아닌 매출 성장 파트너입니다.',
        bulletPoints: ['2주 집중 교육 프로그램', '오픈 후 3개월 SV 상주', '분기별 매출 분석 리포트'],
        ctaText: '',
        microCopy: '',
        imageDirection: '교육 현장',
      },
    },
    {
      sectionOrder: 7, role: 'OBJECTION', sectionType: 'comparison',
      copy: {
        headline: '왜 담가화로구이인가요?',
        subheadline: '타 브랜드와 솔직하게 비교합니다',
        body: '가맹비, 로열티, 매출 실적, 본사 지원까지 투명하게 공개합니다.',
        bulletPoints: ['가맹비 업계 평균 대비 20% 저렴', '로열티 매출 3% (업계 5~7%)', '폐업률 2.3% (업계 평균 30%)'],
        ctaText: '비교 자료 다운로드',
        microCopy: '',
        imageDirection: '비교 차트',
      },
    },
    {
      sectionOrder: 8, role: 'PROOF', sectionType: 'media_feature',
      copy: {
        headline: '언론이 주목한 담가화로구이',
        subheadline: 'TV, SNS에서 화제인 이유',
        body: 'SBS 생활경제, 유튜브 먹방 크리에이터들이 선택한 화로구이 맛집.',
        bulletPoints: ['SBS 생활경제 출연', '유튜브 누적 조회 500만', 'SNS 태그 10만+'],
        ctaText: '',
        microCopy: '',
        imageDirection: 'TV 출연 장면',
      },
    },
    {
      sectionOrder: 9, role: 'URGENCY', sectionType: 'urgency_trigger',
      copy: {
        headline: '남은 상권이 많지 않습니다',
        subheadline: '2026년 상반기 오픈 가능 지역 확인하세요',
        body: '서울/경기 주요 상권은 이미 80% 이상 계약 완료. 유망 상권 선점이 곧 성공의 시작입니다.',
        bulletPoints: ['서울 잔여 상권 12개', '경기 잔여 상권 23개', '지방 광역시 35개'],
        ctaText: '잔여 상권 확인',
        microCopy: '무료 상권 분석 포함',
        imageDirection: '지역 지도',
      },
    },
    {
      sectionOrder: 10, role: 'CTA', sectionType: 'final_cta',
      copy: {
        headline: '지금 바로 창업 상담을 시작하세요',
        subheadline: '담가화로구이와 함께라면 성공이 가까워집니다',
        body: '전문 상담사가 1:1로 맞춤 창업 컨설팅을 제공합니다.',
        bulletPoints: ['무료 상권 분석', '맞춤 투자 계획', '수익 시뮬레이션'],
        ctaText: '무료 창업 상담 신청',
        microCopy: '통화료 무료 · 1분 상담 신청',
        imageDirection: '',
      },
    },
  ];

  return { sections, tone: '신뢰감 있고 데이터 중심의 설득적 톤', qualityScore: 85 };
}

// ============================================================
// 시나리오 2: 하루보타닉스 (스킨케어)
// ============================================================

function createHaruBrief(): ProductBrief {
  return {
    productDNA: {
      coreValue: '식물 유래 성분으로 민감성 피부를 건강하게',
      usp: ['비건 인증 100% 식물성', '피부과 전문의 공동 개발', '30일 피부 개선 프로그램'],
      positioning: 'premium',
      valueHierarchy: {
        functional: '자극 없이 피부 장벽 강화',
        emotional: '내 피부를 아끼는 건강한 선택',
        social: '클린뷰티를 실천하는 의식 있는 소비자',
      },
    },
    customerDesire: {
      surface: '민감성 피부에 맞는 화장품',
      real: '피부 트러블 없이 자신감 있는 외모',
      hidden: '나 자신을 사랑하고 돌보는 라이프스타일',
    },
    customerFear: {
      problem: '새 제품이 피부에 안 맞을까봐',
      opportunity: '이 기회를 놓치면 피부가 더 나빠질까봐',
      social: '주변에서 피부 상태를 지적할까봐',
    },
    resistanceMap: {
      price: { level: 3, reason: '프리미엄 스킨케어 가격 부담' },
      trust: { level: 3, reason: '성분 효과에 대한 확신 부족' },
      need: { level: 4, reason: '기존 제품도 있는데 바꿔야 하나' },
      urgency: { level: 2, reason: '피부는 항상 관리해야 하므로' },
      complexity: { level: 1, reason: '바르기만 하면 되니까' },
    },
    decisionType: 'analytical',
    marketContext: {
      competitionLevel: 'red_ocean',
      priceSensitivity: 'medium',
      purchaseCycle: 'repeat',
      decisionTime: '1_day',
      primaryChannel: 'direct_online',
    },
    confidenceScore: 78,
  };
}

function createHaruBlueprint(): StrategyBlueprint {
  return {
    strategyType: 'direct_sale',
    totalSections: 9,
    structure: [
      { order: 1, role: 'HOOK' as SectionRole, sectionType: 'hero_visual', purpose: '클린뷰티 감성 전달' },
      { order: 2, role: 'PAIN' as SectionRole, sectionType: 'pain_point', purpose: '민감성 피부 고민 공감' },
      { order: 3, role: 'SOLUTION' as SectionRole, sectionType: 'benefit_highlight', purpose: '핵심 성분 소개' },
      { order: 4, role: 'PROOF' as SectionRole, sectionType: 'social_proof', purpose: '임상 데이터 제시' },
      { order: 5, role: 'SOLUTION' as SectionRole, sectionType: 'feature_detail', purpose: '사용법/프로그램 안내' },
      { order: 6, role: 'PROOF' as SectionRole, sectionType: 'testimonial', purpose: '실사용자 리뷰' },
      { order: 7, role: 'OBJECTION' as SectionRole, sectionType: 'faq', purpose: '성분/효과 궁금증 해소' },
      { order: 8, role: 'URGENCY' as SectionRole, sectionType: 'pricing', purpose: '첫 구매 혜택' },
      { order: 9, role: 'CTA' as SectionRole, sectionType: 'final_cta', purpose: '구매 유도' },
    ],
    ctaPositions: [4, 9],
    estimatedScrollDepth: '80%',
    targetReadTime: '2분 30초',
  };
}

function createHaruCopyBlocks(): CopyBlocks {
  const sections: SectionCopy[] = [
    {
      sectionOrder: 1, role: 'HOOK', sectionType: 'hero_visual',
      copy: {
        headline: '피부가 편안해지는 시간',
        subheadline: '식물의 힘으로 민감성 피부를 다시 건강하게',
        body: '하루보타닉스는 피부과 전문의와 함께 개발한 100% 비건 스킨케어입니다.',
        bulletPoints: ['비건 인증', '피부과 공동 개발', '무자극 테스트 완료'],
        ctaText: '30일 프로그램 시작하기',
        microCopy: '첫 구매 20% 할인',
        imageDirection: '자연광 아래 식물 성분과 제품 배치',
      },
    },
    {
      sectionOrder: 2, role: 'PAIN', sectionType: 'pain_point',
      copy: {
        headline: '민감성 피부, 포기하지 마세요',
        subheadline: '화장품을 바꿀 때마다 트러블이 반복된다면',
        body: '합성 성분, 강한 향료, 자극적인 보존제. 민감성 피부의 적은 성분표에 숨어있습니다.',
        bulletPoints: ['화장품 교체 시 트러블 반복', '성분 확인이 어려움', '순한 제품도 자극적'],
        ctaText: '',
        microCopy: '',
        imageDirection: '피부 고민을 가진 여성의 자연스러운 표정',
      },
    },
    {
      sectionOrder: 3, role: 'SOLUTION', sectionType: 'benefit_highlight',
      copy: {
        headline: '자연이 만든 피부 장벽',
        subheadline: '센텔라 × 병풀 × 녹차 — 3대 진정 성분',
        body: '하루보타닉스의 핵심 성분은 모두 유기농 인증을 받은 식물 유래 성분입니다.',
        bulletPoints: ['센텔라아시아티카 — 피부 장벽 강화', '병풀추출물 — 진정 및 재생', '녹차 카테킨 — 항산화 보호'],
        ctaText: '성분 상세 보기',
        microCopy: '',
        imageDirection: '식물 성분 일러스트',
      },
    },
    {
      sectionOrder: 4, role: 'PROOF', sectionType: 'social_proof',
      copy: {
        headline: '임상이 증명한 효과',
        subheadline: '서울대학교 피부과학연구소 공동 임상 시험',
        body: '4주간 200명 임상 시험 결과, 피부 장벽 개선율 89%, 트러블 감소율 76%를 기록했습니다.',
        bulletPoints: ['피부 장벽 개선 89%', '트러블 감소 76%', '수분 보유력 향상 92%'],
        ctaText: '임상 리포트 보기',
        microCopy: '',
        imageDirection: '임상 데이터 차트',
      },
    },
    {
      sectionOrder: 5, role: 'SOLUTION', sectionType: 'feature_detail',
      copy: {
        headline: '30일 피부 리셋 프로그램',
        subheadline: '매일 아침저녁 3단계로 피부를 바꿉니다',
        body: '세안 → 토너 → 크림의 간단한 3스텝으로 피부 장벽을 회복합니다.',
        bulletPoints: ['1단계: 저자극 클렌저', '2단계: 센텔라 토너', '3단계: 장벽 강화 크림'],
        ctaText: '',
        microCopy: '',
        imageDirection: '3스텝 제품 라인업',
      },
    },
    {
      sectionOrder: 6, role: 'PROOF', sectionType: 'testimonial',
      copy: {
        headline: '실사용자 후기',
        subheadline: '',
        body: '하루보타닉스를 사용한 분들의 생생한 후기입니다.',
        bulletPoints: [],
        ctaText: '',
        microCopy: '',
        imageDirection: '사용 전후 비교 사진',
      },
    },
    {
      sectionOrder: 7, role: 'OBJECTION', sectionType: 'faq',
      copy: {
        headline: '자주 묻는 질문',
        subheadline: '',
        body: '',
        bulletPoints: [],
        ctaText: '',
        microCopy: '',
        imageDirection: '',
      },
    },
    {
      sectionOrder: 8, role: 'URGENCY', sectionType: 'pricing',
      copy: {
        headline: '첫 만남 특별 혜택',
        subheadline: '30일 프로그램 풀세트 20% 할인',
        body: '정가 89,000원 → 첫 구매 특가 71,200원. 무료 배송 + 미니어처 세트 증정.',
        bulletPoints: ['20% 첫 구매 할인', '무료 배송', '미니어처 세트 증정'],
        ctaText: '특가로 시작하기',
        microCopy: '30일 이내 전액 환불 보장',
        imageDirection: '제품 풀세트',
      },
    },
    {
      sectionOrder: 9, role: 'CTA', sectionType: 'final_cta',
      copy: {
        headline: '오늘, 피부에게 좋은 선택을',
        subheadline: '하루보타닉스와 함께 건강한 피부를 시작하세요',
        body: '30일 프로그램으로 달라진 피부를 직접 경험하세요.',
        bulletPoints: ['비건 인증', '전액 환불 보장', '무료 배송'],
        ctaText: '지금 시작하기',
        microCopy: '30일 이내 전액 환불 보장',
        imageDirection: '',
      },
    },
  ];

  return { sections, tone: '부드럽고 과학적인 클린뷰티 톤', qualityScore: 80 };
}

// ============================================================
// 시나리오 3: 테크스타트업 (SaaS)
// ============================================================

function createTechBrief(): ProductBrief {
  return {
    productDNA: {
      coreValue: 'AI 기반 고객 데이터 분석으로 매출을 자동 최적화',
      usp: ['GPT-4 기반 고객 행동 예측', '30분 만에 설치 완료', '타 솔루션 대비 ROI 3배'],
      positioning: 'innovation',
      valueHierarchy: {
        functional: '데이터 분석 자동화로 마케팅 효율 극대화',
        emotional: '데이터 기반 의사결정으로 확신 있는 경영',
        social: '최첨단 AI 도입 기업이라는 브랜드 이미지',
      },
    },
    customerDesire: {
      surface: '마케팅 성과 분석 도구',
      real: '적은 비용으로 매출을 늘리는 방법',
      hidden: '경쟁사보다 앞서나가는 우위',
    },
    customerFear: {
      problem: '데이터는 많은데 활용을 못하고 있음',
      opportunity: '경쟁사가 먼저 AI를 도입하면 뒤처질까봐',
      social: '기술 트렌드에 뒤처진 기업으로 보일까봐',
    },
    resistanceMap: {
      price: { level: 3, reason: '월 구독료 부담' },
      trust: { level: 4, reason: '신생 스타트업 서비스 안정성 의문' },
      need: { level: 3, reason: '기존 GA/CRM으로 충분한지 고민' },
      urgency: { level: 2, reason: 'AI 트렌드는 인지하고 있음' },
      complexity: { level: 3, reason: '기존 시스템과 연동 복잡성' },
    },
    decisionType: 'analytical',
    marketContext: {
      competitionLevel: 'niche',
      priceSensitivity: 'low',
      purchaseCycle: 'subscription',
      decisionTime: '1_week',
      primaryChannel: 'direct_online',
    },
    confidenceScore: 75,
  };
}

function createTechBlueprint(): StrategyBlueprint {
  return {
    strategyType: 'free_trial',
    totalSections: 9,
    structure: [
      { order: 1, role: 'HOOK' as SectionRole, sectionType: 'hero_visual', purpose: 'ROI 데이터로 즉시 관심' },
      { order: 2, role: 'PAIN' as SectionRole, sectionType: 'pain_point', purpose: '데이터 활용 못하는 현실' },
      { order: 3, role: 'SOLUTION' as SectionRole, sectionType: 'benefit_highlight', purpose: 'AI 분석 핵심 기능' },
      { order: 4, role: 'PROOF' as SectionRole, sectionType: 'number_proof', purpose: '도입 기업 성과 데이터' },
      { order: 5, role: 'SOLUTION' as SectionRole, sectionType: 'feature_detail', purpose: '대시보드/연동 상세' },
      { order: 6, role: 'OBJECTION' as SectionRole, sectionType: 'comparison', purpose: '기존 도구 대비 비교' },
      { order: 7, role: 'PROOF' as SectionRole, sectionType: 'testimonial', purpose: '도입 기업 사례' },
      { order: 8, role: 'URGENCY' as SectionRole, sectionType: 'pricing', purpose: '무료 체험 혜택' },
      { order: 9, role: 'CTA' as SectionRole, sectionType: 'final_cta', purpose: '무료 체험 시작' },
    ],
    ctaPositions: [4, 9],
    estimatedScrollDepth: '75%',
    targetReadTime: '2분',
  };
}

function createTechCopyBlocks(): CopyBlocks {
  const sections: SectionCopy[] = [
    {
      sectionOrder: 1, role: 'HOOK', sectionType: 'hero_visual',
      copy: {
        headline: '데이터를 매출로 바꾸는 AI',
        subheadline: 'DataPulse AI — 고객 행동 예측으로 마케팅 ROI 3배 달성',
        body: '30분 설치, 즉시 분석. GPT-4 기반 AI가 고객 데이터를 매출 전략으로 전환합니다.',
        bulletPoints: ['AI 고객 행동 예측', '30분 설치', 'ROI 3배'],
        ctaText: '14일 무료 체험 시작',
        microCopy: '신용카드 불필요 · 즉시 시작',
        imageDirection: 'AI 대시보드 화면',
      },
    },
    {
      sectionOrder: 2, role: 'PAIN', sectionType: 'pain_point',
      copy: {
        headline: '데이터는 쌓이는데 매출은 안 오르나요?',
        subheadline: 'GA, CRM 리포트를 보고도 다음 액션을 모르겠다면',
        body: '대부분의 기업이 데이터를 수집하지만, 실제 매출로 연결하는 기업은 12%에 불과합니다.',
        bulletPoints: ['데이터 수집만 하는 기업 88%', '분석 인력 부족', '리포트만 쌓이는 악순환'],
        ctaText: '',
        microCopy: '',
        imageDirection: '복잡한 스프레드시트',
      },
    },
    {
      sectionOrder: 3, role: 'SOLUTION', sectionType: 'benefit_highlight',
      copy: {
        headline: 'AI가 분석, 예측, 추천까지',
        subheadline: 'DataPulse의 3가지 AI 엔진',
        body: '고객 세그멘테이션, 이탈 예측, 캠페인 자동 최적화를 하나의 플랫폼에서.',
        bulletPoints: ['AI 세그멘테이션 — 고객을 자동 분류', '이탈 예측 — 7일 전 경고', '캠페인 최적화 — A/B 테스트 자동화'],
        ctaText: '기능 상세 보기',
        microCopy: '',
        imageDirection: 'AI 분석 프로세스 다이어그램',
      },
    },
    {
      sectionOrder: 4, role: 'PROOF', sectionType: 'number_proof',
      copy: {
        headline: '도입 기업의 실제 성과',
        subheadline: '평균 도입 3개월 후 측정 결과',
        body: 'DataPulse를 도입한 기업들이 실제로 달성한 성과입니다.',
        bulletPoints: ['마케팅 ROI 평균 312% 향상', '고객 이탈률 47% 감소', '캠페인 효율 2.8배 증가'],
        ctaText: '성공 사례 보기',
        microCopy: '',
        imageDirection: '성과 그래프',
      },
    },
    {
      sectionOrder: 5, role: 'SOLUTION', sectionType: 'feature_detail',
      copy: {
        headline: '30분이면 시작할 수 있습니다',
        subheadline: '기존 시스템과 원클릭 연동',
        body: 'Shopify, 카페24, GA4, 메타 광고 등 주요 플랫폼과 즉시 연동됩니다.',
        bulletPoints: ['Shopify / 카페24 연동', 'GA4 / 메타 광고 연동', 'REST API 커스텀 연동'],
        ctaText: '',
        microCopy: '',
        imageDirection: '연동 플랫폼 로고',
      },
    },
    {
      sectionOrder: 6, role: 'OBJECTION', sectionType: 'comparison',
      copy: {
        headline: '기존 도구와 비교해보세요',
        subheadline: 'GA4, 기본 CRM과의 차이',
        body: 'DataPulse는 데이터 수집을 넘어 AI 기반 액션 추천까지 제공합니다.',
        bulletPoints: ['GA4: 수집만 | DataPulse: 수집+분석+추천', 'CRM: 수동 세그먼트 | DataPulse: AI 자동 분류', '엑셀: 사후 분석 | DataPulse: 실시간 예측'],
        ctaText: '무료 체험으로 비교',
        microCopy: '',
        imageDirection: '기능 비교 표',
      },
    },
    {
      sectionOrder: 7, role: 'PROOF', sectionType: 'testimonial',
      copy: {
        headline: '도입 기업 후기',
        subheadline: '',
        body: 'DataPulse를 도입한 기업들의 생생한 후기입니다.',
        bulletPoints: [],
        ctaText: '',
        microCopy: '',
        imageDirection: '기업 로고 및 담당자',
      },
    },
    {
      sectionOrder: 8, role: 'URGENCY', sectionType: 'pricing',
      copy: {
        headline: '지금 시작하면 더 유리합니다',
        subheadline: '14일 무료 체험 + 얼리버드 30% 할인',
        body: '월 99,000원부터 시작. 얼리버드 기간에는 월 69,300원으로 이용 가능합니다.',
        bulletPoints: ['스타터: ₩69,300/월', '프로: ₩149,000/월', '엔터프라이즈: 별도 문의'],
        ctaText: '14일 무료 체험',
        microCopy: '신용카드 불필요',
        imageDirection: '가격표',
      },
    },
    {
      sectionOrder: 9, role: 'CTA', sectionType: 'final_cta',
      copy: {
        headline: '데이터의 힘을 직접 경험하세요',
        subheadline: '14일 무료 체험으로 DataPulse AI의 가치를 확인하세요',
        body: '지금 시작하면 전담 온보딩 매니저가 설정을 도와드립니다.',
        bulletPoints: ['14일 무료 체험', '전담 온보딩 지원', '즉시 데이터 연동'],
        ctaText: '무료 체험 시작하기',
        microCopy: '30초 가입 · 신용카드 불필요',
        imageDirection: '',
      },
    },
  ];

  return { sections, tone: '전문적이고 데이터 중심의 테크 톤', qualityScore: 82 };
}

// ============================================================
// 무드 템플릿 데이터: 하루보타닉스 (clean 무드)
// ============================================================

function createHaruMoodData(): MoodTemplateData {
  return {
    brand: 'HARU BOTANICS',
    images: {
      hero: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80',
      feat1: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80',
      feat2: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80',
      feat3: 'https://images.unsplash.com/photo-1570194065650-d99fb4a38026?w=800&q=80',
      fullbleed: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80',
      gallery1: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
      gallery2: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
      gallery3: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80',
      product1: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
      product2: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
      product3: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80',
      product4: 'https://images.unsplash.com/photo-1570194065650-d99fb4a38026?w=400&q=80',
    },
    hero: {
      headline: '피부가 편안해지는<br><em>자연의 시간</em>',
      subheadline: '100% 비건 인증 식물 성분으로<br>민감성 피부를 건강하게.',
      cta: '30일 프로그램 시작하기',
    },
    intro: {
      headline: '하루보타닉스,<br><em>과학이 만난 자연</em>',
      body: '피부과 전문의와 식물학자가 함께 개발한 클린뷰티 브랜드입니다. 자극 없이 피부 장벽을 강화하는 식물 유래 성분만을 사용합니다.',
    },
    feat1: {
      headline: '센텔라<br><em>장벽 강화</em>',
      body: '마다가스카르산 센텔라아시아티카가 손상된 피부 장벽을 복구합니다. 4주간 89%의 장벽 개선 효과.',
      tag1: '피부 장벽',
      tag2: '89% 개선',
    },
    feat2: {
      headline: '병풀<br><em>진정 재생</em>',
      body: '제주도 유기농 병풀 추출물이 붉은기와 트러블을 빠르게 진정시킵니다.',
      tag1: '항염 진정',
      tag2: '유기농 인증',
    },
    feat3: {
      headline: '녹차<br><em>항산화 보호</em>',
      body: '보성 녹차의 카테킨 성분이 외부 자극과 활성산소로부터 피부를 보호합니다.',
      tag1: '카테킨',
      tag2: '항산화',
    },
    stat1: { value: '89', unit: '%', label: '장벽 개선율' },
    stat2: { value: '76', unit: '%', label: '트러블 감소' },
    stat3: { value: '92', unit: '%', label: '수분 보유력' },
    stat4: { value: '200', unit: '명', label: '임상 참여자' },
    fullbleed: {
      headline: '자연에서 답을 찾다',
      body: '하루보타닉스의 모든 성분은 유기농 인증 농장에서 직접 수확합니다.',
    },
    before1: { title: '자극받은 피부', desc: '새 제품마다 트러블 반복' },
    before2: { title: '무너진 장벽', desc: '수분이 빠져나가는 건조함' },
    before3: { title: '붉은기와 염증', desc: '가려움과 따가움 반복' },
    after1: { title: '건강한 장벽', desc: '4주 만에 장벽 89% 회복' },
    after2: { title: '촉촉한 피부', desc: '수분 보유력 92% 향상' },
    after3: { title: '깨끗한 피부결', desc: '트러블 76% 감소' },
    pricing: {
      headline: '첫 만남 <em>특별 혜택</em>',
      tier1: {
        name: '30일 프로그램',
        price: '71,200',
        unit: '원',
        desc: '정가 89,000원에서 20% 할인',
        features: ['클렌저 120ml', '센텔라 토너 150ml', '장벽 크림 50ml', '미니어처 세트 증정'],
        cta: '특가로 시작하기',
      },
      tier2: {
        name: '60일 풀케어',
        price: '128,000',
        unit: '원',
        desc: '정가 178,000원에서 28% 할인',
        features: ['30일 프로그램 전체', '세럼 30ml 추가', '마스크팩 10매', '피부 상담 1회 포함'],
        cta: '풀케어 시작하기',
      },
    },
    reviews: {
      headline: '사용자 <em>후기</em>',
      items: [
        { name: '김서연', meta: '민감성 · 2개월 사용', avatar: '', quote: '처음으로 트러블 없이 한 달을 보냈어요', stars: 5 },
        { name: '이지은', meta: '건성 · 3개월 사용', avatar: '', quote: '수분감이 하루 종일 유지돼요', stars: 5 },
        { name: '박민지', meta: '복합성 · 1개월 사용', avatar: '', quote: '순한데 효과가 확실해요', stars: 4 },
      ],
    },
    faq: [
      { question: '민감성 피부도 사용할 수 있나요?', answer: '네, 피부과 임상 테스트를 통과한 저자극 제품입니다.' },
      { question: '비건 인증은 어디서 받았나요?', answer: '한국비건인증원과 EVE VEGAN 국제 인증을 받았습니다.' },
      { question: '환불이 가능한가요?', answer: '30일 이내 전액 환불 보장합니다.' },
    ],
    products: {
      headline: '라인업',
      item1: { name: '클렌저', sub: '저자극 약산성 120ml' },
      item2: { name: '토너', sub: '센텔라 진정 150ml' },
      item3: { name: '크림', sub: '장벽 강화 50ml' },
      item4: { name: '세럼', sub: '재생 집중 30ml' },
    },
    process1: { title: '1단계 클렌징', desc: '약산성 클렌저로 자극 없이 세안' },
    process2: { title: '2단계 토너', desc: '센텔라 토너로 pH 밸런스 조절' },
    process3: { title: '3단계 크림', desc: '장벽 강화 크림으로 수분 밀봉' },
    cta: {
      headline: '오늘 시작하면<br>피부가 달라집니다',
      body: '30일 프로그램으로 건강한 피부를 경험하세요.',
      cta: '지금 시작하기',
      micro: '30일 이내 전액 환불 보장',
    },
  };
}

// ============================================================
// 프랜차이즈 템플릿 데이터: 담가화로구이
// ============================================================

function createDamgaFranchiseData(): FranchiseTemplateData {
  return {
    brand: '담가화로구이',
    images: {
      hero: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
      videoBg: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
      brand: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
      product1: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
      product2: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
      product3: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80',
      founder: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      marketingTv: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
    },
    hero: {
      eyebrow: '대한민국 No.1 숯불 화로구이 프랜차이즈',
      number: '1.2',
      unit: '억',
      unitLabel: '월 평균 매출',
      headline: '검증된 매출,<br>검증된 시스템',
      subheadline: '특허받은 화로 시스템으로 초보 사장님도<br>오픈 첫 달부터 안정적인 매출을 만듭니다.',
      cta: '창업 상담 신청하기',
    },
    trust: {
      tag: '실적 증명',
      headline: '숫자가 증명하는<br>담가의 힘',
      card1: { stamp: '공식 인증', label: '전국 가맹점', value: '120', valueUnit: '개', unit: '개점', sub: '2024년 3월 기준' },
      card2: { stamp: '실적 인증', label: '월 평균 매출', value: '1.2', valueUnit: '억', unit: '원', sub: '전 가맹점 평균' },
    },
    video: {
      tag: '매장 현장',
      headline: '담가화로구이의<br>현장을 확인하세요',
      url: 'https://www.youtube.com/watch?v=example',
    },
    stores: {
      tag: '성공 가맹점',
      headline: '실제 매출을<br>공개합니다',
      items: [
        { name: '강남역점', revenue: '1.5', revenueUnit: '억', period: '오픈 6개월', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
        { name: '홍대입구점', revenue: '1.3', revenueUnit: '억', period: '오픈 1년', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
        { name: '분당서현점', revenue: '1.1', revenueUnit: '억', period: '오픈 8개월', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
      ],
    },
    compare: {
      tag: '경쟁 비교',
      headline: '왜 담가화로구이<br>인가요?',
      leftTitle: '일반 고기집',
      rightTitle: '담가화로구이',
      leftItems: [
        { text: '가스 그릴 — 맛 차별화 없음', highlight: false },
        { text: '소스 직접 제조 — 품질 불균일', highlight: false },
        { text: '교육 1주 — 레시피만 전달', highlight: false },
        { text: '폐업률 30%+', highlight: false },
      ],
      rightItems: [
        { text: '특허 화로 — 숯불 풍미 극대화', highlight: true },
        { text: '본사 직영 소스 — 균일한 맛', highlight: true },
        { text: '2주 집중 교육 + 3개월 SV 상주', highlight: true },
        { text: '폐업률 2.3%', highlight: true },
      ],
    },
    brandIntro: {
      tag: '브랜드 소개',
      headline: '담가(湛佳),<br>깊고 아름다운 맛',
      body: '담가화로구이는 "깊이 담근다"는 뜻의 담가(湛佳)에서 이름을 가져왔습니다. 특허받은 화로 시스템과 30년 전통의 소스 레시피로 대한민국 숯불구이의 새로운 기준을 만들고 있습니다.',
      sub: '2018년 1호점 오픈 이래, 5년 만에 전국 120개 가맹점 돌파',
    },
    strengths: {
      tag: '핵심 경쟁력',
      headline: '4가지 성공<br>시스템',
    },
    strength1: { title: '특허 화로 시스템', body: '불 조절 자동화로 초보자도 균일한 맛을 구현. 화재 위험 최소화.' },
    strength2: { title: '직영 소스 공급', body: '본사 자체 공장에서 제조한 5종 소스를 매일 신선하게 공급합니다.' },
    strength3: { title: '전담 SV 관리', body: '1:1 전담 슈퍼바이저가 오픈 후 3개월간 상주하며 매출을 관리합니다.' },
    strength4: { title: '매출 보장 프로그램', body: '6개월 내 월 매출 8천만원 미달 시 본사 추가 지원 프로그램 가동.' },
    winwin: {
      tag: '상생 구조',
      headline: '본사와 가맹점,<br>함께 성장합니다',
      leftIcon: '🏢',
      leftTitle: '본사 지원',
      leftItems: ['인테리어 설계 무료', '오픈 마케팅 500만원 지원', '분기별 매출 분석 리포트', '신메뉴 R&D 무료 제공'],
      rightIcon: '🏪',
      rightTitle: '가맹점 혜택',
      rightItems: ['로열티 매출 3%', '재료 원가율 30% 이하', '연 2회 해외 연수', '가맹점주 자녀 장학금'],
    },
    marketing: {
      tag: '마케팅 지원',
      headline: '이미 유명한<br>브랜드입니다',
      tvBadge: 'SBS 생활경제 2회 출연',
      snsCards: [
        { icon: '📺', name: 'YouTube', handle: '구독자 12만' },
        { icon: '📸', name: 'Instagram', handle: '팔로워 8.5만' },
        { icon: '📱', name: 'TikTok', handle: '조회 500만+' },
      ],
    },
    ingredients: {
      tag: '핵심 재료',
      headline: '최상의 재료만<br>사용합니다',
      body: '담가화로구이는 국내산 1++ 한우와 직접 수입한 프리미엄 수입육만을 사용합니다.',
      items: [
        { name: '1++ 한우 등심', desc: '강원도 횡성 직거래', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=300&q=80' },
        { name: '프리미엄 양념갈비', desc: '30년 전통 비법 소스', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80' },
        { name: '특수부위 모듬', desc: '매일 수작업 발골', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&q=80' },
      ],
    },
    products: {
      tag: '시그니처 메뉴',
      headline: '담가의 자랑,<br>시그니처 3종',
    },
    product1: { name: '담가 화로 등심', desc: '특허 화로에서 구운 1++ 한우 등심', badge: 'BEST' },
    product2: { name: '양념 왕갈비', desc: '30년 비법 소스에 48시간 숙성', badge: 'NEW' },
    product3: { name: '특수부위 모듬', desc: '살치살, 토시살, 안창살 프리미엄 세트', badge: 'HOT' },
    story: {
      tag: '브랜드 스토리',
      headline: '담가의 여정',
      founderName: '김대표',
      founderRole: '담가화로구이 대표이사',
      items: [
        { year: '2018', text: '강남 1호점 오픈' },
        { year: '2019', text: '특허 화로 시스템 등록' },
        { year: '2020', text: '가맹사업 시작, 10개점 돌파' },
        { year: '2022', text: 'SBS 생활경제 출연', active: true },
        { year: '2024', text: '전국 120개점 돌파' },
      ],
    },
    cta: {
      headline: '담가화로구이와<br>함께 시작하세요',
      body: '전문 상담사가 1:1 맞춤 창업 컨설팅을 제공합니다.',
      cta: '창업 상담 신청',
      phone: '1588-0000',
      kakao: 'damga_franchise',
      nameLabel: '이름',
      namePlaceholder: '홍길동',
      phoneLabel: '연락처',
      phonePlaceholder: '010-1234-5678',
      regionLabel: '희망 지역',
      regionPlaceholder: '서울 강남구',
      messageLabel: '문의사항',
      messagePlaceholder: '궁금한 점을 적어주세요',
    },
  };
}

// ============================================================
// 메인 실행
// ============================================================

interface ScenarioResult {
  name: string;
  codeEnginePassed: boolean;
  codeEngineValidation: ValidationResult | null;
  codeEngineTime: number;
  moodPassed: boolean;
  moodValidation: ValidationResult | null;
  moodTime: number;
  moodType: string;
  errors: string[];
}

function runScenario(
  name: string,
  brief: ProductBrief,
  blueprint: StrategyBlueprint,
  copyBlocks: CopyBlocks,
  industry: string,
  priceRange: string,
): { codeResult: ValidationResult; codeHtml: string; codeTime: number } {
  const codeStart = performance.now();

  // Engine 2: Why Now
  const urgencyBrief = runWhyNow(brief, industry, priceRange);
  console.log(`  [E2] Why Now: ${urgencyBrief.primaryType}, CTA urgency: ${urgencyBrief.ctaUrgencyLevel}`);

  // Engine 4: Objection Killer
  const objectionMap = runObjectionKiller(brief, blueprint);
  console.log(`  [E4] Objections: ${objectionMap.activeObjections.length}개 (${objectionMap.activeObjections.map(o => o.type).join(', ')})`);

  // Engine 6: Trust Architecture
  const trustConfig = runTrustArchitecture(brief, blueprint);
  console.log(`  [E6] Trust: ${trustConfig.trustElements.length}개 레벨, score=${trustConfig.trustScore}`);

  // Engine 7: Attention Architecture
  const attentionConfig = runAttentionArchitecture(brief, blueprint, industry);
  console.log(`  [E7] Attention: hook=${attentionConfig.hookType}, gaze=${attentionConfig.gazePattern}, zones=${attentionConfig.zones.length}`);

  // Engine 8: Layout Intelligence
  let layoutConfig = runLayoutIntelligence(brief, blueprint, attentionConfig);
  console.log(`  [E8] Layout: ${layoutConfig.sections.length}개 섹션, diversity=${layoutConfig.diversityScore}, mobile=${layoutConfig.mobileReadyScore}`);

  // Engine 9: Visual Style
  const styleConfig = runVisualStyle(brief, industry);
  console.log(`  [E9] Style: mood=${styleConfig.mood}, ${styleConfig.moodName}`);

  // Cross-Engine Bridge
  const bridgeResult = runCrossEngineBridge(copyBlocks, objectionMap, trustConfig, attentionConfig, layoutConfig);
  const enrichedCopy = bridgeResult.copyBlocks;
  layoutConfig = bridgeResult.layoutConfig;
  console.log(`  [Bridge] objection=${bridgeResult.stats.objectionInjections}, trust=${bridgeResult.stats.trustAdjustments}, zones=${bridgeResult.stats.zoneAnnotations}`);

  // Engine 10: Code Engine
  const generatedPage = runCodeEngine(
    name,
    enrichedCopy,
    layoutConfig,
    styleConfig,
    attentionConfig.stickyCtaEnabled,
    'test-project-id',
  );

  // Zone attributes injection
  generatedPage.fullHtml = injectZoneAttributes(generatedPage.fullHtml, bridgeResult.zoneAnnotations);

  const codeTime = performance.now() - codeStart;
  console.log(`  [E10] Code: ${generatedPage.totalSections}개 섹션, ${(Buffer.byteLength(generatedPage.fullHtml, 'utf-8') / 1024).toFixed(1)}KB`);

  const codeResult = validateHtml(generatedPage.fullHtml);

  return { codeResult, codeHtml: generatedPage.fullHtml, codeTime };
}

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Real Usage Pipeline Test');
  console.log('='.repeat(60));
  console.log();

  const outputDir = join(process.cwd(), 'public');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const results: ScenarioResult[] = [];

  // ── 시나리오 1: 담가화로구이 ──
  console.log('━'.repeat(50));
  console.log('시나리오 1: 담가화로구이 (프랜차이즈 BBQ)');
  console.log('━'.repeat(50));

  const damgaErrors: string[] = [];

  const { codeResult: damgaCodeResult, codeHtml: damgaCodeHtml, codeTime: damgaCodeTime } = runScenario(
    '담가화로구이',
    createDamgaBrief(),
    createDamgaBlueprint(),
    createDamgaCopyBlocks(),
    '외식/프랜차이즈',
    '가맹비 3000만원',
  );

  const damgaCodePath = join(outputDir, 'test-output-damga.html');
  writeFileSync(damgaCodePath, damgaCodeHtml, 'utf-8');
  console.log(`  > Code Engine HTML 저장: ${damgaCodePath}`);

  // 프랜차이즈 템플릿 렌더링
  let damgaMoodResult: ValidationResult | null = null;
  let damgaMoodTime = 0;
  let damgaMoodPassed = false;
  try {
    const moodStart = performance.now();
    const franchiseTokens: StyleTokens = {
      fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
      fontDisplay: "'Noto Sans KR', sans-serif",
      fontBody: "'Noto Sans KR', sans-serif",
      bg: '#0A0A0A',
      surface: '#151515',
      surfaceLight: '#1E1E1E',
      primary: '#FF6B35',
      primaryLight: '#FF8C5A',
      primaryPale: 'rgba(255,107,53,.08)',
      frost: 'rgba(255,255,255,.04)',
      frostLine: 'rgba(255,255,255,.08)',
      frostGlow: 'rgba(255,107,53,.15)',
      textPrimary: '#FFFFFF',
      textSecondary: '#999999',
      textBright: '#FF6B35',
      sizeDisplay: 'clamp(3rem, 7vw, 5.5rem)',
      sizeH1: 'clamp(2.4rem, 5vw, 4rem)',
      sizeH2: 'clamp(1.8rem, 3.5vw, 2.8rem)',
      sizeH3: 'clamp(1.2rem, 1.8vw, 1.5rem)',
      sizeBody: '1rem',
    };
    const franchiseHtml = renderFranchiseTemplate(createDamgaFranchiseData(), franchiseTokens);
    damgaMoodTime = performance.now() - moodStart;
    const franchisePath = join(outputDir, 'test-output-damga-franchise.html');
    writeFileSync(franchisePath, franchiseHtml, 'utf-8');
    damgaMoodResult = validateMoodHtml(franchiseHtml);
    damgaMoodPassed = damgaMoodResult.passed;
    console.log(`  > Franchise Template HTML 저장: ${franchisePath}`);
    console.log(`  > 섹션: ${damgaMoodResult.sectionCount}개, 크기: ${damgaMoodResult.fileSizeKB}KB, 시간: ${damgaMoodTime.toFixed(0)}ms`);
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    damgaErrors.push(`Franchise 렌더링 실패: ${err}`);
    console.log(`  > Franchise Template 실패: ${err}`);
  }

  results.push({
    name: '담가화로구이',
    codeEnginePassed: damgaCodeResult.passed,
    codeEngineValidation: damgaCodeResult,
    codeEngineTime: damgaCodeTime,
    moodPassed: damgaMoodPassed,
    moodValidation: damgaMoodResult,
    moodTime: damgaMoodTime,
    moodType: 'franchise',
    errors: damgaErrors,
  });

  console.log();

  // ── 시나리오 2: 하루보타닉스 ──
  console.log('━'.repeat(50));
  console.log('시나리오 2: 하루보타닉스 (스킨케어)');
  console.log('━'.repeat(50));

  const haruErrors: string[] = [];

  const { codeResult: haruCodeResult, codeHtml: haruCodeHtml, codeTime: haruCodeTime } = runScenario(
    '하루보타닉스',
    createHaruBrief(),
    createHaruBlueprint(),
    createHaruCopyBlocks(),
    '뷰티/화장품',
    '89000원',
  );

  const haruCodePath = join(outputDir, 'test-output-haru.html');
  writeFileSync(haruCodePath, haruCodeHtml, 'utf-8');
  console.log(`  > Code Engine HTML 저장: ${haruCodePath}`);

  // Clean 무드 템플릿 렌더링
  let haruMoodResult: ValidationResult | null = null;
  let haruMoodTime = 0;
  let haruMoodPassed = false;
  try {
    const moodStart = performance.now();
    const cleanTokens: StyleTokens = {
      fontUrl: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
      fontDisplay: "'Instrument Serif', 'Noto Sans KR', serif",
      fontBody: "'DM Sans', 'Noto Sans KR', sans-serif",
      bg: '#FAFAF8',
      surface: '#FFFFFF',
      surfaceLight: '#F5F5F3',
      primary: '#E63225',
      primaryLight: '#FF6B5E',
      primaryPale: 'rgba(230,50,37,.06)',
      frost: 'rgba(0,0,0,.02)',
      frostLine: 'rgba(0,0,0,.08)',
      frostGlow: 'rgba(230,50,37,.08)',
      textPrimary: '#1A1A1A',
      textSecondary: '#777777',
      textBright: '#E63225',
      sizeDisplay: 'clamp(3rem, 7vw, 5.5rem)',
      sizeH1: 'clamp(2.4rem, 5vw, 4rem)',
      sizeH2: 'clamp(1.8rem, 3.5vw, 2.8rem)',
      sizeH3: 'clamp(1.2rem, 1.8vw, 1.5rem)',
      sizeBody: '1rem',
    };
    const cleanHtml = renderMoodTemplate('clean', createHaruMoodData(), cleanTokens);
    haruMoodTime = performance.now() - moodStart;
    const cleanPath = join(outputDir, 'test-output-haru-clean.html');
    writeFileSync(cleanPath, cleanHtml, 'utf-8');
    haruMoodResult = validateMoodHtml(cleanHtml);
    haruMoodPassed = haruMoodResult.passed;
    console.log(`  > Clean Mood Template HTML 저장: ${cleanPath}`);
    console.log(`  > 섹션: ${haruMoodResult.sectionCount}개, 크기: ${haruMoodResult.fileSizeKB}KB, 시간: ${haruMoodTime.toFixed(0)}ms`);
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    haruErrors.push(`Clean 렌더링 실패: ${err}`);
    console.log(`  > Clean Mood Template 실패: ${err}`);
  }

  results.push({
    name: '하루보타닉스',
    codeEnginePassed: haruCodeResult.passed,
    codeEngineValidation: haruCodeResult,
    codeEngineTime: haruCodeTime,
    moodPassed: haruMoodPassed,
    moodValidation: haruMoodResult,
    moodTime: haruMoodTime,
    moodType: 'clean',
    errors: haruErrors,
  });

  console.log();

  // ── 시나리오 3: 테크스타트업 (SaaS) ──
  console.log('━'.repeat(50));
  console.log('시나리오 3: DataPulse AI (SaaS)');
  console.log('━'.repeat(50));

  const techErrors: string[] = [];

  const { codeResult: techCodeResult, codeHtml: techCodeHtml, codeTime: techCodeTime } = runScenario(
    'DataPulse AI',
    createTechBrief(),
    createTechBlueprint(),
    createTechCopyBlocks(),
    'IT/소프트웨어',
    '월 99000원',
  );

  const techCodePath = join(outputDir, 'test-output-tech.html');
  writeFileSync(techCodePath, techCodeHtml, 'utf-8');
  console.log(`  > Code Engine HTML 저장: ${techCodePath}`);

  // Tech 무드 템플릿 렌더링
  let techMoodResult: ValidationResult | null = null;
  let techMoodTime = 0;
  let techMoodPassed = false;
  try {
    const moodStart = performance.now();
    const techData: MoodTemplateData = {
      brand: 'DATAPULSE AI',
      images: {
        hero: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
        feat1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        feat2: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        feat3: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
        fullbleed: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
        gallery1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
        gallery2: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
        gallery3: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
        product1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
        product2: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
        product3: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=80',
        product4: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
      },
      hero: {
        headline: '데이터를<br><em>매출로 바꾸는 AI</em>',
        subheadline: 'GPT-4 기반 고객 행동 예측으로<br>마케팅 ROI 3배를 달성하세요.',
        cta: '14일 무료 체험',
      },
      intro: {
        headline: '<em>DataPulse</em>,<br>AI 마케팅의 새 기준',
        body: '데이터 수집을 넘어 AI 기반 분석, 예측, 자동 최적화까지. 마케팅의 모든 단계를 하나의 플랫폼에서 해결합니다.',
      },
      feat1: {
        headline: 'AI<br><em>세그멘테이션</em>',
        body: 'GPT-4가 고객 행동 데이터를 분석하여 정밀한 세그먼트를 자동으로 생성합니다.',
        tag1: '자동 분류',
        tag2: 'GPT-4',
      },
      feat2: {
        headline: '이탈<br><em>예측 엔진</em>',
        body: '고객 이탈을 7일 전에 예측하고 자동으로 리텐션 캠페인을 실행합니다.',
        tag1: '7일 전 예측',
        tag2: '자동 캠페인',
      },
      feat3: {
        headline: '캠페인<br><em>자동 최적화</em>',
        body: 'A/B 테스트를 자동으로 설계하고 실행. 최적의 조합을 AI가 찾아냅니다.',
        tag1: 'A/B 자동화',
        tag2: 'ROI 극대화',
      },
      stat1: { value: '312', unit: '%', label: 'ROI 향상' },
      stat2: { value: '47', unit: '%', label: '이탈률 감소' },
      stat3: { value: '2.8', unit: 'x', label: '캠페인 효율' },
      stat4: { value: '30', unit: '분', label: '설치 시간' },
      fullbleed: {
        headline: 'AI가 일하는<br><em>동안 당신은 쉬세요</em>',
        body: '24시간 AI가 데이터를 분석하고, 매출 기회를 자동으로 발굴합니다.',
      },
      before1: { title: '수동 분석', desc: '엑셀과 씨름하는 매일' },
      before2: { title: '직감 의존', desc: '데이터 없는 의사결정' },
      before3: { title: '느린 대응', desc: '고객 이탈 후 뒤늦은 파악' },
      after1: { title: 'AI 자동 분석', desc: '실시간 인사이트 대시보드' },
      after2: { title: '데이터 기반', desc: 'AI 추천으로 확신 있는 결정' },
      after3: { title: '선제 대응', desc: '7일 전 이탈 예측 및 방지' },
      pricing: {
        headline: '합리적인 <em>요금제</em>',
        tier1: {
          name: '스타터',
          price: '69,300',
          unit: '원/월',
          desc: '소규모 이커머스를 위한 플랜',
          features: ['MAU 1만 이하', 'AI 세그멘테이션', '기본 대시보드', '이메일 리포트'],
          cta: '무료 체험 시작',
        },
        tier2: {
          name: '프로',
          price: '149,000',
          unit: '원/월',
          desc: '성장하는 기업을 위한 플랜',
          features: ['MAU 10만 이하', '이탈 예측 엔진', '캠페인 자동 최적화', '전담 매니저 배정', 'API 연동'],
          cta: '프로 체험 시작',
        },
      },
      reviews: {
        headline: '도입 기업 <em>후기</em>',
        items: [
          { name: '김마케터', meta: 'A커머스 마케팅팀장', avatar: '', quote: '리포트 작성 시간이 80% 줄었습니다', stars: 5 },
          { name: '이대표', meta: 'B패션 대표', avatar: '', quote: 'ROI가 실제로 3배 이상 올랐습니다', stars: 5 },
          { name: '박팀장', meta: 'C푸드 그로스팀장', avatar: '', quote: '이탈 예측 정확도가 놀랍습니다', stars: 5 },
        ],
      },
      faq: [
        { question: '설치가 어렵지 않나요?', answer: 'Shopify, 카페24 등 주요 플랫폼과 원클릭 연동됩니다. 30분이면 완료.' },
        { question: '기존 GA4와 중복되지 않나요?', answer: 'GA4는 수집, DataPulse는 AI 분석+예측. 상호 보완됩니다.' },
        { question: '무료 체험 후 자동 결제되나요?', answer: '아니요. 14일 체험 후 직접 유료 전환하셔야 합니다.' },
      ],
      products: {
        headline: '주요 기능',
        item1: { name: '세그멘테이션', sub: 'AI 고객 분류' },
        item2: { name: '이탈 예측', sub: '7일 전 알림' },
        item3: { name: '캠페인 최적화', sub: 'A/B 자동화' },
        item4: { name: '대시보드', sub: '실시간 인사이트' },
      },
      process1: { title: '1. 연동', desc: '기존 플랫폼과 30분 내 연동' },
      process2: { title: '2. AI 분석', desc: '24시간 내 첫 인사이트 도출' },
      process3: { title: '3. 실행', desc: 'AI 추천 캠페인 자동 실행' },
      cta: {
        headline: '지금 무료로<br>시작하세요',
        body: '14일 무료 체험. 신용카드 불필요.',
        cta: '무료 체험 시작',
        micro: '30초 가입 · 신용카드 불필요',
      },
    };
    const techTokens: StyleTokens = {
      fontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
      fontDisplay: "'Outfit', 'Noto Sans KR', sans-serif",
      fontBody: "'Noto Sans KR', 'Outfit', sans-serif",
      bg: '#07070E',
      surface: '#0E0E1A',
      surfaceLight: '#16162A',
      primary: '#7C3AED',
      primaryLight: '#A78BFA',
      primaryPale: 'rgba(124,58,237,.08)',
      frost: 'rgba(255,255,255,.03)',
      frostLine: 'rgba(255,255,255,.06)',
      frostGlow: 'rgba(124,58,237,.12)',
      textPrimary: '#F0F0F5',
      textSecondary: '#A0A0BE',
      textBright: '#A78BFA',
      sizeDisplay: 'clamp(3rem, 7vw, 5rem)',
      sizeH1: 'clamp(2.4rem, 5vw, 4rem)',
      sizeH2: 'clamp(1.8rem, 3.5vw, 2.8rem)',
      sizeH3: 'clamp(1.2rem, 1.8vw, 1.5rem)',
      sizeBody: '1rem',
    };
    const techHtml = renderMoodTemplate('tech', techData, techTokens);
    techMoodTime = performance.now() - moodStart;
    const techMoodPath = join(outputDir, 'test-output-tech-mood.html');
    writeFileSync(techMoodPath, techHtml, 'utf-8');
    techMoodResult = validateMoodHtml(techHtml);
    techMoodPassed = techMoodResult.passed;
    console.log(`  > Tech Mood Template HTML 저장: ${techMoodPath}`);
    console.log(`  > 섹션: ${techMoodResult.sectionCount}개, 크기: ${techMoodResult.fileSizeKB}KB, 시간: ${techMoodTime.toFixed(0)}ms`);
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    techErrors.push(`Tech 렌더링 실패: ${err}`);
    console.log(`  > Tech Mood Template 실패: ${err}`);
  }

  results.push({
    name: 'DataPulse AI',
    codeEnginePassed: techCodeResult.passed,
    codeEngineValidation: techCodeResult,
    codeEngineTime: techCodeTime,
    moodPassed: techMoodPassed,
    moodValidation: techMoodResult,
    moodTime: techMoodTime,
    moodType: 'tech',
    errors: techErrors,
  });

  // ── 최종 요약 ──
  console.log();
  console.log('='.repeat(60));
  console.log('최종 결과 요약');
  console.log('='.repeat(60));
  console.log();

  let allPassed = true;

  for (const r of results) {
    const codeStatus = r.codeEnginePassed ? 'PASS' : 'FAIL';
    const moodStatus = r.moodPassed ? 'PASS' : 'FAIL';
    const cv = r.codeEngineValidation;
    const mv = r.moodValidation;

    console.log(`[${codeStatus}] ${r.name} — Code Engine`);
    if (cv) {
      console.log(`       섹션: ${cv.sectionCount}개, 크기: ${cv.fileSizeKB}KB, 시간: ${r.codeEngineTime.toFixed(0)}ms`);
      if (!cv.passed) console.log(`       오류: ${cv.errors.join(', ')}`);
    }

    console.log(`[${moodStatus}] ${r.name} — Mood Template (${r.moodType})`);
    if (mv) {
      console.log(`       섹션: ${mv.sectionCount}개, 크기: ${mv.fileSizeKB}KB, 시간: ${r.moodTime.toFixed(0)}ms`);
      if (!mv.passed) console.log(`       오류: ${mv.errors.join(', ')}`);
    }

    if (r.errors.length > 0) {
      console.log(`       추가 오류: ${r.errors.join('; ')}`);
    }

    if (!r.codeEnginePassed || !r.moodPassed) allPassed = false;
    console.log();
  }

  console.log('='.repeat(60));
  if (allPassed) {
    console.log('ALL PASSED — 6/6 테스트 통과');
  } else {
    console.log('SOME FAILED — 일부 테스트 실패');
    process.exit(1);
  }
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
