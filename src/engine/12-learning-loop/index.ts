import { db } from '@/lib/db';
import type {
  TrackingEvent,
  Diagnosis,
  Severity,
  Prescription,
  ABTestResult,
  WinningPatternData,
  LearningLoopOutput,
} from './types';
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
} from './rules';

export type {
  TrackingEvent,
  DailyMetrics,
  Diagnosis,
  Prescription,
  ABTestResult,
  LearningLoopOutput,
} from './types';

// ============================================================
// Learning Loop ⑫ — 자율 학습 엔진
// 트래킹 → 진단 → 처방 → A/B 테스트 → 승리패턴 학습
// ============================================================

// ---------- 1. 이벤트 수집 ----------

export async function collectEvent(event: TrackingEvent): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // page_view → DailyAnalytics upsert
  if (event.eventType === 'page_view') {
    await db.dailyAnalytics.upsert({
      where: {
        projectId_date: { projectId: event.projectId, date: today },
      },
      create: {
        projectId: event.projectId,
        date: today,
        totalVisits: 1,
        uniqueVisitors: 1,
        sourceBreakdown: event.payload.referrer
          ? JSON.parse(JSON.stringify({ [event.payload.referrer]: 1 }))
          : undefined,
        deviceBreakdown: event.payload.device
          ? JSON.parse(JSON.stringify({ [event.payload.device]: 1 }))
          : undefined,
      },
      update: {
        totalVisits: { increment: 1 },
      },
    });
    return;
  }

  // conversion → DailyAnalytics 전환 수 증가
  if (event.eventType === 'conversion') {
    await db.dailyAnalytics.upsert({
      where: {
        projectId_date: { projectId: event.projectId, date: today },
      },
      create: {
        projectId: event.projectId,
        date: today,
        totalConversions: 1,
      },
      update: {
        totalConversions: { increment: 1 },
      },
    });

    // PageVersion 전환 수 증가 (A/B 테스트 지원)
    if (event.versionId) {
      await db.pageVersion.update({
        where: { id: event.versionId },
        data: { totalConversions: { increment: 1 } },
      });
    }
    return;
  }

  // section_view, section_dwell, cta_click → SectionAnalytics
  if (
    event.payload.sectionId &&
    (event.eventType === 'section_view' ||
      event.eventType === 'section_dwell' ||
      event.eventType === 'cta_click')
  ) {
    const sectionId = event.payload.sectionId;

    if (event.eventType === 'section_view') {
      await db.sectionAnalytics.upsert({
        where: { sectionId_date: { sectionId, date: today } },
        create: { sectionId, date: today, impressions: 1 },
        update: { impressions: { increment: 1 } },
      });
    }

    if (event.eventType === 'cta_click') {
      await db.sectionAnalytics.upsert({
        where: { sectionId_date: { sectionId, date: today } },
        create: { sectionId, date: today, ctaClicks: 1 },
        update: { ctaClicks: { increment: 1 } },
      });
    }
  }

  // scroll_depth → DailyAnalytics avgScrollDepth 업데이트
  if (event.eventType === 'scroll_depth' && event.payload.scrollPercent != null) {
    await db.dailyAnalytics.upsert({
      where: {
        projectId_date: { projectId: event.projectId, date: today },
      },
      create: {
        projectId: event.projectId,
        date: today,
        avgScrollDepth: event.payload.scrollPercent,
      },
      update: {
        avgScrollDepth: event.payload.scrollPercent,
      },
    });
  }
}

// ---------- 2. 일일 진단 ----------

function classifySeverity(value: number, lowThreshold: number, highThreshold: number): Severity {
  if (value >= highThreshold) return 'critical';
  if (value >= lowThreshold) return 'high';
  return 'medium';
}

export async function runDailyDiagnosis(projectId: string): Promise<Diagnosis[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daily = await db.dailyAnalytics.findUnique({
    where: { projectId_date: { projectId, date: today } },
  });

  if (!daily || daily.totalVisits < MIN_DATA_THRESHOLDS.dailyVisits) {
    return [];
  }

  const diagnoses: Diagnosis[] = [];

  // 이탈률 진단
  if (daily.bounceRate > THRESHOLDS.bounceRate.high) {
    diagnoses.push({
      type: 'bounce_high',
      severity: classifySeverity(daily.bounceRate, THRESHOLDS.bounceRate.high, THRESHOLDS.bounceRate.critical),
      details: {
        metric: 'bounceRate',
        currentValue: daily.bounceRate,
        threshold: THRESHOLDS.bounceRate.high,
        message: `이탈률 ${daily.bounceRate}% — 히어로 섹션 또는 로딩 속도 점검 필요`,
      },
    });
  }

  // 전환율 진단
  const convRate = daily.totalVisits > 0 ? (daily.totalConversions / daily.totalVisits) * 100 : 0;
  if (convRate < THRESHOLDS.conversionRate.low) {
    diagnoses.push({
      type: 'cta_ignored',
      severity: convRate < THRESHOLDS.conversionRate.veryLow ? 'critical' : 'high',
      details: {
        metric: 'conversionRate',
        currentValue: convRate,
        threshold: THRESHOLDS.conversionRate.low,
        message: `전환율 ${convRate.toFixed(2)}% — CTA 문구/위치/색상 변경 고려`,
      },
    });
  }

  // 스크롤 깊이 진단
  if (daily.avgScrollDepth < THRESHOLDS.avgScrollDepth.low && daily.avgScrollDepth > 0) {
    diagnoses.push({
      type: 'scroll_cliff',
      severity: daily.avgScrollDepth < THRESHOLDS.avgScrollDepth.veryLow ? 'critical' : 'high',
      details: {
        metric: 'avgScrollDepth',
        currentValue: daily.avgScrollDepth,
        threshold: THRESHOLDS.avgScrollDepth.low,
        message: `평균 스크롤 깊이 ${daily.avgScrollDepth}% — 초반 섹션에서 이탈 발생`,
      },
    });
  }

  // 체류시간 진단
  if (daily.avgTimeOnPage < THRESHOLDS.avgTimeOnPage.low && daily.avgTimeOnPage > 0) {
    diagnoses.push({
      type: 'dwell_low',
      severity: daily.avgTimeOnPage < THRESHOLDS.avgTimeOnPage.veryLow ? 'critical' : 'medium',
      details: {
        metric: 'avgTimeOnPage',
        currentValue: daily.avgTimeOnPage,
        threshold: THRESHOLDS.avgTimeOnPage.low,
        message: `평균 체류시간 ${daily.avgTimeOnPage}초 — 콘텐츠 관심도 낮음`,
      },
    });
  }

  // 섹션별 진단
  const sections = await db.section.findMany({
    where: { projectId },
    select: { id: true, order: true, type: true },
  });

  for (const section of sections) {
    const sectionStats = await db.sectionAnalytics.findUnique({
      where: { sectionId_date: { sectionId: section.id, date: today } },
    });

    if (!sectionStats || sectionStats.impressions < MIN_DATA_THRESHOLDS.sectionImpressions) continue;

    // 섹션 이탈률
    if (sectionStats.exitRate > THRESHOLDS.sectionExitRate.high) {
      diagnoses.push({
        type: 'section_dropout',
        severity: classifySeverity(
          sectionStats.exitRate,
          THRESHOLDS.sectionExitRate.high,
          THRESHOLDS.sectionExitRate.critical,
        ),
        details: {
          metric: 'sectionExitRate',
          currentValue: sectionStats.exitRate,
          threshold: THRESHOLDS.sectionExitRate.high,
          affectedSection: section.id,
          message: `섹션 #${section.order}(${section.type}) 이탈률 ${sectionStats.exitRate}%`,
        },
      });
    }

    // CTA 클릭률
    if (sectionStats.ctaClicks > 0 || sectionStats.impressions > MIN_DATA_THRESHOLDS.ctaImpressions) {
      const ctaRate = (sectionStats.ctaClicks / sectionStats.impressions) * 100;
      if (ctaRate < THRESHOLDS.ctaClickRate.low) {
        diagnoses.push({
          type: 'cta_ignored',
          severity: ctaRate < THRESHOLDS.ctaClickRate.veryLow ? 'high' : 'medium',
          details: {
            metric: 'ctaClickRate',
            currentValue: ctaRate,
            threshold: THRESHOLDS.ctaClickRate.low,
            affectedSection: section.id,
            message: `섹션 #${section.order} CTA 클릭률 ${ctaRate.toFixed(2)}%`,
          },
        });
      }
    }

    // 히어로 섹션 특별 진단
    if (section.order === 1 && sectionStats.exitRate > HERO_EXIT_RATE_THRESHOLD) {
      diagnoses.push({
        type: 'hero_weak',
        severity: sectionStats.exitRate > HERO_CRITICAL_EXIT_RATE ? 'critical' : 'high',
        details: {
          metric: 'heroExitRate',
          currentValue: sectionStats.exitRate,
          threshold: HERO_EXIT_RATE_THRESHOLD,
          affectedSection: section.id,
          message: `히어로 섹션 이탈률 ${sectionStats.exitRate}% — 첫인상 개선 필요`,
        },
      });
    }
  }

  // DB에 진단 결과 저장
  for (const diag of diagnoses) {
    const prescription = buildPrescriptionMap(diag);
    await db.diagnosisLog.create({
      data: {
        projectId,
        diagnosisType: diag.type,
        severity: diag.severity,
        details: JSON.parse(JSON.stringify(diag.details)),
        prescriptionLevel: prescription.level,
        prescription: JSON.parse(JSON.stringify(prescription)),
      },
    });
  }

  return diagnoses;
}

// ---------- 3. A/B 변형 자동 생성 ----------

export async function createAutoVariant(
  projectId: string,
  prescription: Prescription,
): Promise<{ testId: string; variantVersionId: string } | null> {
  const existingTest = await db.aBTest.findFirst({
    where: { projectId, status: 'RUNNING' },
  });
  if (existingTest) return null;

  const currentVersion = await db.pageVersion.findFirst({
    where: { projectId, isActive: true },
    orderBy: { version: 'desc' },
  });
  if (!currentVersion) return null;

  const nextVersion = await db.pageVersion.findFirst({
    where: { projectId },
    orderBy: { version: 'desc' },
    select: { version: true },
  });
  const versionNum = (nextVersion?.version ?? 0) + 1;

  const variantVersion = await db.pageVersion.create({
    data: {
      projectId,
      version: versionNum,
      label: `A/B 변형 #${versionNum}`,
      sectionSnapshot: currentVersion.sectionSnapshot ?? undefined,
      trafficWeight: AB_TEST_CONFIG.defaultTrafficSplit,
      isActive: true,
    },
  });

  await db.pageVersion.update({
    where: { id: currentVersion.id },
    data: { trafficWeight: AB_TEST_CONFIG.defaultTrafficSplit },
  });

  const modifications = prescription.actions.map((a) => ({
    actionType: a.type,
    target: a.target,
    description: a.description,
    expectedImprovement: a.expectedImprovement,
  }));

  const test = await db.aBTest.create({
    data: {
      projectId,
      controlVersionId: currentVersion.id,
      variantVersionId: variantVersion.id,
      optimizationLevel: prescription.level,
      targetMetric: AB_TEST_CONFIG.targetMetric,
      minSampleSize: prescription.level >= AB_SAMPLE_SIZE.highLevelThreshold
        ? AB_SAMPLE_SIZE.highLevel
        : AB_SAMPLE_SIZE.lowLevel,
    },
  });

  await db.diagnosisLog.create({
    data: {
      projectId,
      diagnosisType: AUTO_VARIANT_LOG_TYPE,
      severity: 'medium',
      prescriptionLevel: prescription.level,
      details: JSON.parse(JSON.stringify({
        action: AUTO_VARIANT_LOG_TYPE,
        testId: test.id,
        variantVersionId: variantVersion.id,
        modifications,
      })),
      prescription: JSON.parse(JSON.stringify(prescription)),
    },
  });

  return { testId: test.id, variantVersionId: variantVersion.id };
}

// ---------- 4. 승자 자동 교체 ----------

export async function autoSwapWinner(projectId: string): Promise<{
  swapped: boolean;
  testId?: string;
  winner?: string;
  improvement?: number;
}> {
  const concludedTests = await db.aBTest.findMany({
    where: {
      projectId,
      status: 'CONCLUDED',
      winner: { not: null },
      confidence: { gte: AB_TEST_CONFIG.confidenceThreshold },
    },
    include: {
      controlVersion: { select: { id: true, conversionRate: true, trafficWeight: true } },
      variantVersion: { select: { id: true, conversionRate: true, trafficWeight: true } },
    },
    orderBy: { concludedAt: 'desc' },
    take: 1,
  });

  if (concludedTests.length === 0) {
    return { swapped: false };
  }

  const test = concludedTests[0];
  const isVariantWinner = test.winner === 'variant';
  const winnerId = isVariantWinner ? test.variantVersion.id : test.controlVersion.id;
  const loserId = isVariantWinner ? test.controlVersion.id : test.variantVersion.id;
  const improvement = isVariantWinner
    ? test.variantVersion.conversionRate - test.controlVersion.conversionRate
    : test.controlVersion.conversionRate - test.variantVersion.conversionRate;

  await db.$transaction([
    db.pageVersion.update({
      where: { id: winnerId },
      data: { trafficWeight: AB_TEST_CONFIG.fullTrafficWeight, isActive: true },
    }),
    db.pageVersion.update({
      where: { id: loserId },
      data: { trafficWeight: AB_TEST_CONFIG.noTrafficWeight, isActive: false },
    }),
  ]);

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { inputData: true },
  });

  const inputData = project?.inputData as Record<string, unknown> | null;
  const industry = (inputData?.industry as string) ?? 'general';
  const conversionGoal = (inputData?.conversionGoal as string) ?? 'conversion';

  if (industry && conversionGoal) {
    await recordWinningPattern(industry, conversionGoal, {
      patternType: isVariantWinner ? 'variant_win' : 'control_retain',
      patternData: {
        optimizationLevel: test.optimizationLevel,
        targetMetric: test.targetMetric,
        controlRate: test.controlConversionRate,
        variantRate: test.variantConversionRate,
      },
      winRate: test.confidence ?? 0,
      sampleSize:
        (test.controlVersion.trafficWeight + test.variantVersion.trafficWeight) || 0,
      improvement,
    });
  }

  return {
    swapped: true,
    testId: test.id,
    winner: test.winner!,
    improvement,
  };
}

// ---------- 5. A/B 테스트 관리 ----------

export async function getActiveTests(projectId: string): Promise<ABTestResult[]> {
  const tests = await db.aBTest.findMany({
    where: { projectId, status: 'RUNNING' },
    include: {
      controlVersion: { select: { totalVisits: true, totalConversions: true, conversionRate: true } },
      variantVersion: { select: { totalVisits: true, totalConversions: true, conversionRate: true } },
    },
  });

  return tests.map((t) => ({
    testId: t.id,
    status: 'running' as const,
    controlRate: t.controlVersion.conversionRate,
    variantRate: t.variantVersion.conversionRate,
    winner: undefined,
    confidence: 0,
    sampleSize: {
      control: t.controlVersion.totalVisits,
      variant: t.variantVersion.totalVisits,
    },
  }));
}

export async function concludeTest(testId: string): Promise<ABTestResult> {
  const test = await db.aBTest.findUniqueOrThrow({
    where: { id: testId },
    include: {
      controlVersion: { select: { totalVisits: true, totalConversions: true } },
      variantVersion: { select: { totalVisits: true, totalConversions: true } },
    },
  });

  const cVisits = test.controlVersion.totalVisits;
  const cConv = test.controlVersion.totalConversions;
  const vVisits = test.variantVersion.totalVisits;
  const vConv = test.variantVersion.totalConversions;

  const cRate = cVisits > 0 ? cConv / cVisits : 0;
  const vRate = vVisits > 0 ? vConv / vVisits : 0;

  const confidence = calculateZTestConfidence(cVisits, cConv, vVisits, vConv);
  const winner = confidence >= AB_TEST_CONFIG.confidenceThreshold
    ? (vRate > cRate ? 'variant' : 'control')
    : undefined;

  await db.aBTest.update({
    where: { id: testId },
    data: {
      status: 'CONCLUDED',
      controlConversionRate: cRate * 100,
      variantConversionRate: vRate * 100,
      winner: winner ?? null,
      confidence,
      concludedAt: new Date(),
    },
  });

  return {
    testId,
    status: 'concluded',
    controlRate: cRate * 100,
    variantRate: vRate * 100,
    winner,
    confidence,
    sampleSize: { control: cVisits, variant: vVisits },
  };
}

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

// ---------- 6. 승리 패턴 학습 ----------

export async function recordWinningPattern(
  industry: string,
  goal: string,
  pattern: WinningPatternData,
): Promise<void> {
  await db.winningPattern.create({
    data: {
      industry,
      goal,
      patternType: pattern.patternType,
      patternData: JSON.parse(JSON.stringify(pattern.patternData)),
      winRate: pattern.winRate,
      sampleSize: pattern.sampleSize,
      improvement: pattern.improvement,
    },
  });
}

export async function getWinningPatterns(
  industry: string,
  goal: string,
): Promise<WinningPatternData[]> {
  const patterns = await db.winningPattern.findMany({
    where: { industry, goal },
    orderBy: { winRate: 'desc' },
    take: 10,
  });

  return patterns.map((p) => ({
    patternType: p.patternType,
    patternData: p.patternData as Record<string, unknown>,
    winRate: p.winRate,
    sampleSize: p.sampleSize,
    improvement: p.improvement,
  }));
}

// ---------- 7. 통합 실행 ----------

export async function runLearningLoop(projectId: string): Promise<LearningLoopOutput> {
  const diagnoses = await runDailyDiagnosis(projectId);
  const prescriptions = diagnoses.map((d) => buildPrescriptionMap(d));
  const activeTests = await getActiveTests(projectId);

  // 샘플 사이즈 도달한 테스트 자동 종료
  for (const test of activeTests) {
    const dbTest = await db.aBTest.findUnique({ where: { id: test.testId } });
    if (
      dbTest &&
      test.sampleSize.control >= dbTest.minSampleSize &&
      test.sampleSize.variant >= dbTest.minSampleSize
    ) {
      await concludeTest(test.testId);
    }
  }

  // 종료된 테스트의 승자 자동 교체
  await autoSwapWinner(projectId);

  // critical/high 진단이 있고 활성 테스트 없으면 자동 변형 생성
  const refreshedTests = await getActiveTests(projectId);
  if (refreshedTests.length === 0) {
    const criticalPrescription = prescriptions.find((p) => p.level >= AUTO_VARIANT_MIN_LEVEL);
    if (criticalPrescription) {
      await createAutoVariant(projectId, criticalPrescription);
    }
  }

  const updatedTests = await getActiveTests(projectId);

  return {
    diagnoses,
    prescriptions,
    activeTests: updatedTests,
    winningPatterns: [],
  };
}
