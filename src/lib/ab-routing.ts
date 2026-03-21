// ============================================================
// A/B 테스트 트래픽 라우팅
// 가중치 기반 버전 선택 + 세션 고정 (쿠키)
// ============================================================

import { db } from '@/lib/db';

interface VersionCandidate {
  id: string;
  version: number;
  htmlContent: string;
  trafficWeight: number;
  isActive: boolean;
}

interface RoutingResult {
  html: string;
  versionId: string;
  version: number;
  isVariant: boolean;
}

/**
 * A/B 테스트 활성 시 가중치 기반으로 버전 선택
 * - 활성 테스트 없으면 기본 HTML 반환
 * - 쿠키에 기존 할당이 있으면 재사용 (세션 고정)
 * - 새 방문자는 trafficWeight 기반 확률적 할당
 */
export async function resolvePageVersion(
  projectId: string,
  defaultHtml: string,
  existingVersionId?: string,
): Promise<RoutingResult> {
  // 활성 A/B 테스트 확인
  const activeTest = await db.aBTest.findFirst({
    where: { projectId, status: 'RUNNING' },
    select: {
      id: true,
      controlVersionId: true,
      variantVersionId: true,
    },
  });

  if (!activeTest) {
    return {
      html: defaultHtml,
      versionId: '',
      version: 0,
      isVariant: false,
    };
  }

  // 세션 고정: 기존 할당된 버전이 있으면 재사용
  if (existingVersionId) {
    const assigned = await db.pageVersion.findFirst({
      where: {
        id: existingVersionId,
        projectId,
        isActive: true,
      },
      select: { id: true, version: true, htmlContent: true },
    });

    if (assigned?.htmlContent) {
      return {
        html: assigned.htmlContent,
        versionId: assigned.id,
        version: assigned.version,
        isVariant: assigned.id === activeTest.variantVersionId,
      };
    }
  }

  // 두 버전 조회
  const versions = await db.pageVersion.findMany({
    where: {
      id: { in: [activeTest.controlVersionId, activeTest.variantVersionId] },
      isActive: true,
    },
    select: {
      id: true,
      version: true,
      htmlContent: true,
      trafficWeight: true,
      isActive: true,
    },
  }) as VersionCandidate[];

  if (versions.length < 2) {
    return {
      html: defaultHtml,
      versionId: '',
      version: 0,
      isVariant: false,
    };
  }

  // 가중치 기반 랜덤 선택
  const totalWeight = versions.reduce((sum, v) => sum + v.trafficWeight, 0);
  const rand = Math.random() * totalWeight;
  let cumulative = 0;
  let selected: VersionCandidate | undefined;

  for (const v of versions) {
    cumulative += v.trafficWeight;
    if (rand <= cumulative) {
      selected = v;
      break;
    }
  }

  if (!selected) {
    selected = versions[0];
  }

  return {
    html: selected.htmlContent,
    versionId: selected.id,
    version: selected.version,
    isVariant: selected.id === activeTest.variantVersionId,
  };
}

/**
 * 필요 최소 샘플 크기 계산 (통계적 검정력 분석)
 * 양측 검정, 기본값: 검정력 80%, 유의수준 5%
 */
export function calculateMinSampleSize(
  baselineRate: number,
  mde: number,
  power: number = 0.8,
  alpha: number = 0.05,
): number {
  // Z값 근사
  const zAlpha = getZScore(1 - alpha / 2);
  const zBeta = getZScore(power);

  const p1 = baselineRate;
  const p2 = baselineRate + mde;

  const numerator = Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
  const denominator = Math.pow(p2 - p1, 2);

  if (denominator === 0) return Infinity;

  return Math.ceil(numerator / denominator);
}

/**
 * 테스트 지속 기간 추정 (일)
 */
export function estimateTestDuration(
  requiredSamplePerVariant: number,
  dailyVisitors: number,
  trafficSplit: number = 50,
): number {
  if (dailyVisitors === 0) return Infinity;
  const visitorsPerVariant = dailyVisitors * (trafficSplit / 100);
  return Math.ceil(requiredSamplePerVariant / visitorsPerVariant);
}

/**
 * 조기 종료 규칙 (Lan-DeMets O'Brien-Fleming 근사)
 * 중간 분석 시 과도한 유의성이 있으면 조기 종료 허용
 */
export function shouldStopEarly(
  confidence: number,
  fractionComplete: number,
): boolean {
  if (fractionComplete < 0.2) return false; // 최소 20% 진행
  if (fractionComplete >= 1.0) return true; // 100% 도달

  // O'Brien-Fleming 경계: 초기에는 엄격, 후기에는 관대
  const obfBoundary = 1 - (alpha(fractionComplete));
  return confidence >= obfBoundary;
}

function alpha(fraction: number): number {
  // O'Brien-Fleming 근사: α * exp(-Z²/(4*t))
  const nominalAlpha = 0.05;
  const z = getZScore(1 - nominalAlpha / 2);
  return nominalAlpha * Math.exp(-(z * z) / (4 * fraction));
}

/**
 * 표준정규분포 역함수 근사 (Rational approximation)
 */
function getZScore(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.383577518672690e2,
    -3.066479806614716e1,
    2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838e0,
    -2.549732539343734e0,
    4.374664141464968e0,
    2.938163982698783e0,
  ];
  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996e0,
    3.754408661907416e0,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number;
  let r: number;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
}
