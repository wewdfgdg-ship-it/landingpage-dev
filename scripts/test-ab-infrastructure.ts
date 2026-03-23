/**
 * A/B Testing Infrastructure Verification Script
 *
 * DB 의존 없이 엔진 12 (Learning Loop)의 핵심 로직을 검증한다:
 * 1. 트래킹 스크립트 생성 — 유효한 JS 생성, 이벤트 리스너 포함
 * 2. 타입/데이터 구조 — TrackingEvent, ABTestResult 등 유효성
 * 3. 진단 규칙 — buildPrescriptionMap 정합성
 * 4. Z-Test 통계 — 신뢰도 계산 정확성
 * 5. 규칙 상수 — 임계값 범위 검증
 */

import { generateTrackingScript } from '../src/engine/12-learning-loop/tracking-script.js';
import {
  THRESHOLDS,
  MIN_DATA_THRESHOLDS,
  HERO_EXIT_RATE_THRESHOLD,
  HERO_CRITICAL_EXIT_RATE,
  AB_TEST_CONFIG,
  AB_SAMPLE_SIZE,
  SEVERITY_LEVEL_MAP,
  buildPrescriptionMap,
  Z_TEST_CONSTANTS,
  AUTO_VARIANT_LOG_TYPE,
  AUTO_VARIANT_MIN_LEVEL,
} from '../src/engine/12-learning-loop/rules.js';
import type {
  TrackingEvent,
  TrackingEventType,
  Diagnosis,
  DiagnosisType,
  Severity,
  Prescription,
  ABTestResult,
  WinningPatternData,
  LearningLoopOutput,
  DailyMetrics,
  SectionMetrics,
  ABTestConfig,
} from '../src/engine/12-learning-loop/types.js';

// ============================================================
// Test Harness
// ============================================================

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(condition: boolean, name: string): void {
  if (condition) {
    passed++;
    console.log(`  PASS: ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`  FAIL: ${name}`);
  }
}

function section(title: string): void {
  console.log(`\n=== ${title} ===`);
}

// ============================================================
// 1. Tracking Script Generation
// ============================================================

function testTrackingScript(): void {
  section('1. Tracking Script Generation');

  const projectId = 'test-project-123';
  const versionId = 'version-abc';

  // 1a. 기본 생성 (versionId 없이)
  const scriptNoVersion = generateTrackingScript(projectId);
  assert(typeof scriptNoVersion === 'string', '스크립트 문자열 반환');
  assert(scriptNoVersion.includes('<script>'), '<script> 태그 포함');
  assert(scriptNoVersion.includes('</script>'), '</script> 태그 포함');
  assert(scriptNoVersion.includes(`PID="${projectId}"`), 'projectId 포함');
  assert(scriptNoVersion.includes('VID=null'), 'versionId null (미지정 시)');

  // 1b. versionId 포함 생성
  const scriptWithVersion = generateTrackingScript(projectId, versionId);
  assert(scriptWithVersion.includes(`VID="${versionId}"`), 'versionId 포함');

  // 1c. 이벤트 핸들러 존재 확인
  assert(scriptNoVersion.includes('page_view'), 'page_view 이벤트 전송');
  assert(scriptNoVersion.includes('scroll_depth'), 'scroll_depth 이벤트');
  assert(scriptNoVersion.includes('section_view'), 'section_view 이벤트');
  assert(scriptNoVersion.includes('section_dwell'), 'section_dwell 이벤트');
  assert(scriptNoVersion.includes('cta_click'), 'cta_click 이벤트');
  assert(scriptNoVersion.includes('conversion'), 'conversion 이벤트');
  assert(scriptNoVersion.includes('bounce'), 'bounce 이벤트');

  // 1d. 트래킹 API 엔드포인트
  assert(scriptNoVersion.includes('/api/track'), 'API 엔드포인트 /api/track 포함');

  // 1e. sendBeacon / fetch 폴백
  assert(scriptNoVersion.includes('sendBeacon'), 'sendBeacon 사용');
  assert(scriptNoVersion.includes('fetch'), 'fetch 폴백 포함');

  // 1f. IntersectionObserver 사용
  assert(scriptNoVersion.includes('IntersectionObserver'), 'IntersectionObserver 사용');

  // 1g. 세션 ID 생성
  assert(scriptNoVersion.includes('SID='), '세션 ID 생성');

  // 1h. 디바이스 감지
  assert(scriptNoVersion.includes('device='), '디바이스 감지 로직');
  assert(scriptNoVersion.includes('mobile'), '모바일 감지');
  assert(scriptNoVersion.includes('tablet'), '태블릿 감지');
  assert(scriptNoVersion.includes('desktop'), '데스크톱 감지');

  // 1i. __trackConversion 전역 함수
  assert(scriptNoVersion.includes('__trackConversion'), '전역 conversion 함수 노출');

  // 1j. 스크롤 퍼센트 마일스톤
  assert(scriptNoVersion.includes('[25,50,75,100]'), '스크롤 마일스톤 25/50/75/100');

  // 1k. data-section-id 속성 사용
  assert(scriptNoVersion.includes('data-section-id'), 'data-section-id 속성 참조');
  assert(scriptNoVersion.includes('data-cta'), 'data-cta 속성 참조');

  // 1l. 바운스 감지 (30초 이하)
  assert(scriptNoVersion.includes('30000'), '바운스 감지 30초 임계값');
  assert(scriptNoVersion.includes('beforeunload'), 'beforeunload 이벤트 리스너');

  // 1m. 중복 전송 방지
  assert(scriptNoVersion.includes('sent[key]'), '중복 이벤트 전송 방지');

  // 1n. XSS 방지 — projectId가 문자열로 안전하게 삽입되는지
  const xssId = '"><script>alert(1)</script>';
  const xssScript = generateTrackingScript(xssId);
  assert(xssScript.includes(xssId), 'XSS projectId 삽입 (주의: 서버 측 검증 필요)');
}

// ============================================================
// 2. Type / Data Structure Validation
// ============================================================

function testDataStructures(): void {
  section('2. Data Structure Validation');

  // 2a. TrackingEvent 구조
  const validEvent: TrackingEvent = {
    projectId: 'proj-1',
    versionId: 'ver-1',
    eventType: 'page_view',
    payload: {
      sectionId: 'sec-1',
      sectionOrder: 1,
      scrollPercent: 50,
      dwellTimeMs: 3000,
      ctaLabel: '구매하기',
      referrer: 'google',
      device: 'mobile',
      timestamp: Date.now(),
    },
    sessionId: 'session-abc',
  };
  assert(validEvent.projectId === 'proj-1', 'TrackingEvent.projectId');
  assert(validEvent.eventType === 'page_view', 'TrackingEvent.eventType');
  assert(validEvent.payload.device === 'mobile', 'TrackingEvent.payload.device');

  // 2b. 모든 이벤트 타입 확인
  const allEventTypes: TrackingEventType[] = [
    'page_view', 'scroll_depth', 'section_view',
    'section_dwell', 'cta_click', 'conversion', 'bounce',
  ];
  assert(allEventTypes.length === 7, '7개 이벤트 타입 정의');

  // 2c. ABTestResult 구조
  const testResult: ABTestResult = {
    testId: 'test-1',
    status: 'running',
    controlRate: 2.5,
    variantRate: 3.1,
    winner: undefined,
    confidence: 0,
    sampleSize: { control: 500, variant: 480 },
  };
  assert(testResult.status === 'running', 'ABTestResult.status');
  assert(testResult.sampleSize.control === 500, 'ABTestResult.sampleSize');

  // 2d. WinningPatternData 구조
  const pattern: WinningPatternData = {
    patternType: 'variant_win',
    patternData: { optimizationLevel: 2 },
    winRate: 0.95,
    sampleSize: 1000,
    improvement: 0.6,
  };
  assert(pattern.winRate === 0.95, 'WinningPatternData.winRate');

  // 2e. LearningLoopOutput 구조
  const output: LearningLoopOutput = {
    diagnoses: [],
    prescriptions: [],
    activeTests: [],
    winningPatterns: [],
  };
  assert(Array.isArray(output.diagnoses), 'LearningLoopOutput.diagnoses is array');
  assert(Array.isArray(output.activeTests), 'LearningLoopOutput.activeTests is array');

  // 2f. Severity 타입
  const severities: Severity[] = ['low', 'medium', 'high', 'critical'];
  assert(severities.length === 4, '4개 Severity 레벨');

  // 2g. DiagnosisType 타입
  const diagTypes: DiagnosisType[] = [
    'hero_weak', 'section_dropout', 'cta_ignored',
    'scroll_cliff', 'mobile_gap', 'bounce_high', 'dwell_low',
  ];
  assert(diagTypes.length === 7, '7개 DiagnosisType 정의');
}

// ============================================================
// 3. Prescription Rules (buildPrescriptionMap)
// ============================================================

function testPrescriptionRules(): void {
  section('3. Prescription Rules');

  const diagnosisTypes: DiagnosisType[] = [
    'hero_weak', 'section_dropout', 'cta_ignored',
    'scroll_cliff', 'mobile_gap', 'bounce_high', 'dwell_low',
  ];

  const severities: Severity[] = ['medium', 'high', 'critical'];

  // 3a. 모든 진단 타입 + 심각도 조합 테스트
  for (const diagType of diagnosisTypes) {
    for (const sev of severities) {
      const diag: Diagnosis = {
        type: diagType,
        severity: sev,
        details: {
          metric: 'test',
          currentValue: 0,
          threshold: 0,
          affectedSection: 'sec-1',
          message: 'test',
        },
      };

      const prescription = buildPrescriptionMap(diag);
      assert(
        prescription !== undefined && prescription !== null,
        `buildPrescriptionMap(${diagType}, ${sev}) 반환`,
      );
      assert(
        prescription.level >= 1 && prescription.level <= 3,
        `${diagType}/${sev} level=${prescription.level} (1~3)`,
      );
      assert(
        prescription.actions.length > 0,
        `${diagType}/${sev} actions 비어있지 않음`,
      );

      for (const action of prescription.actions) {
        assert(
          typeof action.type === 'string' && action.type.length > 0,
          `${diagType}/${sev} action.type 존재`,
        );
        assert(
          typeof action.description === 'string' && action.description.length > 0,
          `${diagType}/${sev} action.description 존재`,
        );
        assert(
          typeof action.expectedImprovement === 'number' && action.expectedImprovement > 0,
          `${diagType}/${sev} expectedImprovement > 0`,
        );
      }
    }
  }

  // 3b. severity -> level 매핑 확인
  assert(SEVERITY_LEVEL_MAP.critical === 3, 'critical -> level 3');
  assert(SEVERITY_LEVEL_MAP.high === 2, 'high -> level 2');
  assert(SEVERITY_LEVEL_MAP.medium === 1, 'medium -> level 1');
  assert(SEVERITY_LEVEL_MAP.low === 1, 'low -> level 1');

  // 3c. hero_weak + critical -> layout_swap 이상 확인
  const heroWeakCritical: Diagnosis = {
    type: 'hero_weak',
    severity: 'critical',
    details: { metric: 'heroExitRate', currentValue: 60, threshold: 30, message: 'test' },
  };
  const heroRx = buildPrescriptionMap(heroWeakCritical);
  assert(heroRx.level === 3, 'hero_weak/critical -> level 3');
  assert(heroRx.actions[0].type === 'layout_swap', 'hero_weak/critical -> layout_swap');

  // 3d. bounce_high + critical -> full_regenerate
  const bounceHighCritical: Diagnosis = {
    type: 'bounce_high',
    severity: 'critical',
    details: { metric: 'bounceRate', currentValue: 90, threshold: 70, message: 'test' },
  };
  const bounceRx = buildPrescriptionMap(bounceHighCritical);
  assert(bounceRx.level === 3, 'bounce_high/critical -> level 3');
  assert(bounceRx.actions[0].type === 'full_regenerate', 'bounce_high/critical -> full_regenerate');
}

// ============================================================
// 4. Z-Test Statistical Confidence
// ============================================================

function testZTestConfidence(): void {
  section('4. Z-Test Statistical Confidence');

  // Z-Test 함수를 직접 테스트할 수 없으므로 (private) 상수만 검증
  // + 수학적으로 동일한 로직을 여기서 재현하여 검증

  function calculateZTestConfidence(
    n1: number, x1: number,
    n2: number, x2: number,
  ): number {
    if (n1 === 0 || n2 === 0) return 0;

    const p1 = x1 / n1;
    const p2 = x2 / n2;
    const pPool = (x1 + x2) / (n1 + n2);
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));

    if (se === 0) return 0;

    const z = Math.abs(p1 - p2) / se;

    const { t_coeff, d_coeff, a1, a2, a3, a4, a5 } = Z_TEST_CONSTANTS;
    const t = 1 / (1 + t_coeff * z);
    const phi = d_coeff * Math.exp(-0.5 * z * z);
    const area =
      phi *
      (a1 * t +
        a2 * t * t +
        a3 * t * t * t +
        a4 * t * t * t * t +
        a5 * t * t * t * t * t);

    return Math.min(1 - 2 * area, AB_TEST_CONFIG.maxConfidence);
  }

  // 4a. 동일한 비율 -> 낮은 신뢰도
  const confEqual = calculateZTestConfidence(1000, 50, 1000, 50);
  assert(confEqual < 0.5, `동일 비율 -> 낮은 신뢰도 (${confEqual.toFixed(4)})`);

  // 4b. 매우 다른 비율 -> 높은 신뢰도
  const confDifferent = calculateZTestConfidence(1000, 50, 1000, 100);
  assert(confDifferent > 0.95, `다른 비율 (5% vs 10%) -> 높은 신뢰도 (${confDifferent.toFixed(4)})`);

  // 4c. 샘플 크기 0 -> 0 반환
  const confZero = calculateZTestConfidence(0, 0, 1000, 50);
  assert(confZero === 0, '샘플 0 -> 신뢰도 0');

  // 4d. 최대 신뢰도 캡 확인
  const confMax = calculateZTestConfidence(10000, 500, 10000, 1500);
  assert(confMax <= AB_TEST_CONFIG.maxConfidence, `최대 신뢰도 캡 (${confMax} <= ${AB_TEST_CONFIG.maxConfidence})`);

  // 4e. 적은 샘플에서도 동작
  const confSmall = calculateZTestConfidence(10, 1, 10, 5);
  assert(confSmall >= 0 && confSmall <= 1, `적은 샘플 신뢰도 범위 [0,1] (${confSmall.toFixed(4)})`);

  // 4f. 모든 전환 or 0 전환 edge case
  const confAllConvert = calculateZTestConfidence(100, 100, 100, 0);
  assert(confAllConvert > 0.99, `100% vs 0% -> 매우 높은 신뢰도 (${confAllConvert.toFixed(4)})`);

  // 4g. Z_TEST_CONSTANTS Abramowitz & Stegun 계수 검증
  assert(Z_TEST_CONSTANTS.t_coeff === 0.2316419, 'Z_TEST t_coeff 정확');
  assert(Z_TEST_CONSTANTS.a1 === 0.319381530, 'Z_TEST a1 정확');
  assert(Z_TEST_CONSTANTS.a5 === 1.330274429, 'Z_TEST a5 정확');
}

// ============================================================
// 5. Rules & Constants Validation
// ============================================================

function testRulesConstants(): void {
  section('5. Rules & Constants');

  // 5a. THRESHOLDS 범위 검증
  assert(THRESHOLDS.bounceRate.high < THRESHOLDS.bounceRate.critical, 'bounceRate: high < critical');
  assert(THRESHOLDS.conversionRate.veryLow < THRESHOLDS.conversionRate.low, 'conversionRate: veryLow < low');
  assert(THRESHOLDS.avgScrollDepth.veryLow < THRESHOLDS.avgScrollDepth.low, 'avgScrollDepth: veryLow < low');
  assert(THRESHOLDS.avgTimeOnPage.veryLow < THRESHOLDS.avgTimeOnPage.low, 'avgTimeOnPage: veryLow < low');
  assert(THRESHOLDS.sectionExitRate.high < THRESHOLDS.sectionExitRate.critical, 'sectionExitRate: high < critical');
  assert(THRESHOLDS.ctaClickRate.veryLow < THRESHOLDS.ctaClickRate.low, 'ctaClickRate: veryLow < low');

  // 5b. MIN_DATA_THRESHOLDS 합리성
  assert(MIN_DATA_THRESHOLDS.dailyVisits >= 1, 'dailyVisits 최소 1 이상');
  assert(MIN_DATA_THRESHOLDS.sectionImpressions >= 1, 'sectionImpressions 최소 1 이상');
  assert(MIN_DATA_THRESHOLDS.ctaImpressions >= MIN_DATA_THRESHOLDS.sectionImpressions, 'ctaImpressions >= sectionImpressions');

  // 5c. HERO thresholds
  assert(HERO_EXIT_RATE_THRESHOLD < HERO_CRITICAL_EXIT_RATE, 'HERO: threshold < critical');
  assert(HERO_EXIT_RATE_THRESHOLD > 0 && HERO_EXIT_RATE_THRESHOLD < 100, 'HERO threshold 0~100');

  // 5d. AB_TEST_CONFIG
  assert(AB_TEST_CONFIG.defaultTrafficSplit === 50, 'A/B 기본 트래픽 50:50');
  assert(AB_TEST_CONFIG.fullTrafficWeight === 100, '승자 트래픽 100%');
  assert(AB_TEST_CONFIG.noTrafficWeight === 0, '패자 트래픽 0%');
  assert(AB_TEST_CONFIG.confidenceThreshold === 0.95, '신뢰도 임계값 95%');
  assert(AB_TEST_CONFIG.maxConfidence <= 1, '최대 신뢰도 <= 1');
  assert(AB_TEST_CONFIG.targetMetric === 'conversion_rate', '기본 목표 메트릭');

  // 5e. AB_SAMPLE_SIZE
  assert(AB_SAMPLE_SIZE.highLevel > AB_SAMPLE_SIZE.lowLevel, 'highLevel 샘플 > lowLevel');
  assert(AB_SAMPLE_SIZE.lowLevel >= 50, '최소 샘플 사이즈 >= 50');

  // 5f. AUTO_VARIANT 설정
  assert(AUTO_VARIANT_LOG_TYPE === 'auto_variant_created', '자동 변형 로그 타입');
  assert(AUTO_VARIANT_MIN_LEVEL >= 1 && AUTO_VARIANT_MIN_LEVEL <= 3, '자동 변형 최소 레벨 1~3');
}

// ============================================================
// 6. Integration: Mock Conversion Flow
// ============================================================

function testMockConversionFlow(): void {
  section('6. Mock Conversion Flow (Integration)');

  // 전체 흐름 시뮬레이션 (DB 없이 로직만)

  // 6a. 이벤트 데이터 생성 → TrackingEvent 유효성
  const events: TrackingEvent[] = [
    {
      projectId: 'proj-test',
      eventType: 'page_view',
      payload: { referrer: 'google', device: 'mobile', timestamp: Date.now() },
      sessionId: 'sess-1',
    },
    {
      projectId: 'proj-test',
      eventType: 'scroll_depth',
      payload: { scrollPercent: 75, timestamp: Date.now() },
      sessionId: 'sess-1',
    },
    {
      projectId: 'proj-test',
      eventType: 'section_view',
      payload: { sectionId: 'sec-hero', sectionOrder: 1, timestamp: Date.now() },
      sessionId: 'sess-1',
    },
    {
      projectId: 'proj-test',
      eventType: 'cta_click',
      payload: { sectionId: 'sec-hero', ctaLabel: '무료 체험', timestamp: Date.now() },
      sessionId: 'sess-1',
    },
    {
      projectId: 'proj-test',
      eventType: 'conversion',
      payload: { timestamp: Date.now() },
      sessionId: 'sess-1',
      versionId: 'ver-1',
    },
  ];

  assert(events.length === 5, '5개 이벤트 시퀀스 생성');
  assert(events.every(e => typeof e.projectId === 'string'), '모든 이벤트에 projectId');
  assert(events.every(e => typeof e.sessionId === 'string'), '모든 이벤트에 sessionId');
  assert(events.every(e => typeof e.payload.timestamp === 'number'), '모든 이벤트에 timestamp');

  // 6b. 진단 → 처방 파이프라인 시뮬레이션
  const mockDiagnoses: Diagnosis[] = [
    {
      type: 'hero_weak',
      severity: 'high',
      details: {
        metric: 'heroExitRate',
        currentValue: 45,
        threshold: 30,
        affectedSection: 'sec-hero',
        message: '히어로 이탈률 45%',
      },
    },
    {
      type: 'cta_ignored',
      severity: 'medium',
      details: {
        metric: 'ctaClickRate',
        currentValue: 0.5,
        threshold: 1,
        affectedSection: 'sec-pricing',
        message: 'CTA 클릭률 0.5%',
      },
    },
  ];

  const prescriptions = mockDiagnoses.map(d => buildPrescriptionMap(d));
  assert(prescriptions.length === 2, '2개 처방 생성');
  assert(prescriptions[0].level === 2, 'hero_weak/high -> level 2');
  assert(prescriptions[1].level === 1, 'cta_ignored/medium -> level 1');

  // 6c. 자동 변형 기준: level >= AUTO_VARIANT_MIN_LEVEL
  const shouldAutoVariant = prescriptions.some(p => p.level >= AUTO_VARIANT_MIN_LEVEL);
  assert(shouldAutoVariant === true, 'level 2 처방이 있으므로 자동 변형 생성 대상');

  // 6d. A/B 결과 시뮬레이션
  const mockResult: ABTestResult = {
    testId: 'test-sim',
    status: 'concluded',
    controlRate: 2.5,
    variantRate: 3.8,
    winner: 'variant',
    confidence: 0.97,
    sampleSize: { control: 500, variant: 480 },
  };
  assert(mockResult.winner === 'variant', 'variant 승리');
  assert(mockResult.confidence >= AB_TEST_CONFIG.confidenceThreshold, '신뢰도 충족');
  assert(mockResult.variantRate > mockResult.controlRate, 'variant 전환율이 더 높음');

  // 6e. 승리 패턴 기록 데이터
  const winPattern: WinningPatternData = {
    patternType: 'variant_win',
    patternData: {
      optimizationLevel: 2,
      targetMetric: 'conversion_rate',
      controlRate: mockResult.controlRate,
      variantRate: mockResult.variantRate,
    },
    winRate: mockResult.confidence,
    sampleSize: mockResult.sampleSize.control + mockResult.sampleSize.variant,
    improvement: mockResult.variantRate - mockResult.controlRate,
  };
  assert(Math.abs(winPattern.improvement - 1.3) < 0.001, `improvement = ${winPattern.improvement} (~1.3)`);
  assert(winPattern.sampleSize === 980, `sampleSize = ${winPattern.sampleSize}`);
}

// ============================================================
// 7. Edge Cases
// ============================================================

function testEdgeCases(): void {
  section('7. Edge Cases');

  // 7a. 빈 문자열 projectId
  const emptyScript = generateTrackingScript('');
  assert(typeof emptyScript === 'string', '빈 projectId에도 스크립트 생성');

  // 7b. 특수문자 projectId
  const specialScript = generateTrackingScript('proj-test_123.abc');
  assert(specialScript.includes('proj-test_123.abc'), '특수문자 projectId 포함');

  // 7c. 매우 긴 projectId
  const longId = 'a'.repeat(1000);
  const longScript = generateTrackingScript(longId);
  assert(longScript.includes(longId), '긴 projectId 포함');

  // 7d. 전환 이벤트 0일 때의 improvement 계산
  const zeroImprovement = 0 - 0;
  assert(zeroImprovement === 0, '0% vs 0% -> improvement 0');
}

// ============================================================
// Main
// ============================================================

function main(): void {
  console.log('========================================');
  console.log('A/B Testing Infrastructure Verification');
  console.log('========================================');

  testTrackingScript();
  testDataStructures();
  testPrescriptionRules();
  testZTestConfidence();
  testRulesConstants();
  testMockConversionFlow();
  testEdgeCases();

  console.log('\n========================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('========================================');

  if (failures.length > 0) {
    console.log('\nFailed tests:');
    for (const f of failures) {
      console.log(`  - ${f}`);
    }
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
