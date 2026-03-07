import { db } from '@/lib/db';

// ============================================================
// 플랜 설정 & 결제 유틸리티
// DB Plan 모델 기반 + 하드코딩 폴백
// ============================================================

export type PlanType = 'FREE' | 'PRO' | 'BUSINESS';

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  quotaLimit: number;
  features: string[];
  generateLimit: number;
  deployLimit: number;
  exportEnabled: boolean;
  customDomainEnabled: boolean;
  analyticsEnabled: boolean;
  abTestEnabled: boolean;
}

// 폴백용 기본 플랜 (DB 조회 실패 시 사용)
const DEFAULT_PLANS: Record<PlanType, PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: '무료',
    description: '시작하기 좋은 기본 플랜',
    price: 0,
    yearlyPrice: 0,
    quotaLimit: 3,
    features: ['프로젝트 3개', '월 5회 생성', 'HTML 내보내기', '기본 분석'],
    generateLimit: 5,
    deployLimit: 1,
    exportEnabled: true,
    customDomainEnabled: false,
    analyticsEnabled: true,
    abTestEnabled: false,
  },
  PRO: {
    id: 'PRO',
    name: '프로',
    description: '성장하는 비즈니스를 위한 플랜',
    price: 29000,
    yearlyPrice: 24000,
    quotaLimit: 20,
    features: ['프로젝트 20개', '월 50회 생성', '배포 5개', 'React ZIP 내보내기', '커스텀 도메인', '고급 분석', 'A/B 테스트'],
    generateLimit: 50,
    deployLimit: 5,
    exportEnabled: true,
    customDomainEnabled: true,
    analyticsEnabled: true,
    abTestEnabled: true,
  },
  BUSINESS: {
    id: 'BUSINESS',
    name: '비즈니스',
    description: '대규모 팀과 에이전시를 위한 플랜',
    price: 79000,
    yearlyPrice: 66000,
    quotaLimit: 100,
    features: ['프로젝트 100개', '무제한 생성', '무제한 배포', '모든 내보내기', '커스텀 도메인', '고급 분석 + AI 진단', 'A/B 테스트', '우선 지원'],
    generateLimit: -1,
    deployLimit: -1,
    exportEnabled: true,
    customDomainEnabled: true,
    analyticsEnabled: true,
    abTestEnabled: true,
  },
};

// 후방 호환: 기존 PLANS 상수 export 유지
export const PLANS: Record<string, PlanConfig> = { ...DEFAULT_PLANS };

// ============================================================
// DB 기반 플랜 조회
// ============================================================

/** DB에서 활성 플랜 목록 조회 (없으면 폴백) */
export async function getPlans(): Promise<PlanConfig[]> {
  try {
    const dbPlans = await db.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (dbPlans.length === 0) return Object.values(DEFAULT_PLANS);

    return dbPlans.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      yearlyPrice: p.yearlyPrice,
      quotaLimit: p.quotaLimit,
      features: p.features as string[],
      generateLimit: p.generateLimit,
      deployLimit: p.deployLimit,
      exportEnabled: p.exportEnabled,
      customDomainEnabled: p.customDomainEnabled,
      analyticsEnabled: p.analyticsEnabled,
      abTestEnabled: p.abTestEnabled,
    }));
  } catch {
    // Plan 테이블 미존재 시 폴백
    return Object.values(DEFAULT_PLANS);
  }
}

/** 특정 플랜 조회 (DB → 폴백) */
export async function getPlanConfig(planId: string): Promise<PlanConfig> {
  try {
    const dbPlan = await db.plan.findUnique({ where: { id: planId } });
    if (dbPlan) {
      return {
        id: dbPlan.id,
        name: dbPlan.name,
        description: dbPlan.description,
        price: dbPlan.price,
        yearlyPrice: dbPlan.yearlyPrice,
        quotaLimit: dbPlan.quotaLimit,
        features: dbPlan.features as string[],
        generateLimit: dbPlan.generateLimit,
        deployLimit: dbPlan.deployLimit,
        exportEnabled: dbPlan.exportEnabled,
        customDomainEnabled: dbPlan.customDomainEnabled,
        analyticsEnabled: dbPlan.analyticsEnabled,
        abTestEnabled: dbPlan.abTestEnabled,
      };
    }
  } catch {
    // Plan 테이블 미존재
  }
  const fallback = DEFAULT_PLANS[planId as PlanType];
  if (fallback) return fallback;
  return DEFAULT_PLANS.FREE;
}

/** DB에 기본 플랜 시딩 */
export async function seedPlans(): Promise<void> {
  for (const [idx, plan] of Object.values(DEFAULT_PLANS).entries()) {
    await db.plan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        yearlyPrice: plan.yearlyPrice,
        quotaLimit: plan.quotaLimit,
        features: plan.features,
        generateLimit: plan.generateLimit,
        deployLimit: plan.deployLimit,
        exportEnabled: plan.exportEnabled,
        customDomainEnabled: plan.customDomainEnabled,
        analyticsEnabled: plan.analyticsEnabled,
        abTestEnabled: plan.abTestEnabled,
        sortOrder: idx,
      },
      create: {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        yearlyPrice: plan.yearlyPrice,
        quotaLimit: plan.quotaLimit,
        features: plan.features,
        generateLimit: plan.generateLimit,
        deployLimit: plan.deployLimit,
        exportEnabled: plan.exportEnabled,
        customDomainEnabled: plan.customDomainEnabled,
        analyticsEnabled: plan.analyticsEnabled,
        abTestEnabled: plan.abTestEnabled,
        sortOrder: idx,
      },
    });
  }
}

// ============================================================
// 사용량 조회
// ============================================================

export interface UsageInfo {
  plan: PlanType;
  planConfig: PlanConfig;
  projectCount: number;
  quotaLimit: number;
  monthlyGenerateCount: number;
  generateLimit: number;
  deployCount: number;
  deployLimit: number;
}

export async function getOrgUsage(orgId: string): Promise<UsageInfo> {
  const org = await db.organization.findUniqueOrThrow({
    where: { id: orgId },
    select: { plan: true, quotaLimit: true },
  });

  const plan = org.plan as PlanType;
  const planConfig = await getPlanConfig(plan);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [projectCount, monthlyGenerateCount, deployCount] = await Promise.all([
    db.project.count({
      where: { orgId, deletedAt: null },
    }),
    db.project.count({
      where: {
        orgId,
        deletedAt: null,
        updatedAt: { gte: monthStart },
        status: { in: ['GENERATED', 'DEPLOYED', 'EDITING'] },
      },
    }),
    db.project.count({
      where: { orgId, deletedAt: null, isDeployed: true },
    }),
  ]);

  return {
    plan,
    planConfig,
    projectCount,
    quotaLimit: org.quotaLimit,
    monthlyGenerateCount,
    generateLimit: planConfig.generateLimit,
    deployCount,
    deployLimit: planConfig.deployLimit,
  };
}

// ============================================================
// 쿼터 검증
// ============================================================

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
}

export function checkProjectQuota(usage: UsageInfo): QuotaCheckResult {
  if (usage.projectCount >= usage.quotaLimit) {
    return {
      allowed: false,
      reason: `프로젝트 한도 초과 (${usage.projectCount}/${usage.quotaLimit}). 플랜을 업그레이드하세요.`,
    };
  }
  return { allowed: true };
}

export function checkGenerateQuota(usage: UsageInfo): QuotaCheckResult {
  if (usage.generateLimit === -1) return { allowed: true };
  if (usage.monthlyGenerateCount >= usage.generateLimit) {
    return {
      allowed: false,
      reason: `이번 달 생성 한도 초과 (${usage.monthlyGenerateCount}/${usage.generateLimit}). 플랜을 업그레이드하세요.`,
    };
  }
  return { allowed: true };
}

export function checkDeployQuota(usage: UsageInfo): QuotaCheckResult {
  if (usage.deployLimit === -1) return { allowed: true };
  if (usage.deployCount >= usage.deployLimit) {
    return {
      allowed: false,
      reason: `배포 한도 초과 (${usage.deployCount}/${usage.deployLimit}). 플랜을 업그레이드하세요.`,
    };
  }
  return { allowed: true };
}

export async function checkFeature(
  plan: PlanType,
  feature: 'customDomain' | 'abTest' | 'export' | 'analytics',
): Promise<QuotaCheckResult> {
  const config = await getPlanConfig(plan);
  const featureMap: Record<string, boolean> = {
    customDomain: config.customDomainEnabled,
    abTest: config.abTestEnabled,
    export: config.exportEnabled,
    analytics: config.analyticsEnabled,
  };

  if (!featureMap[feature]) {
    return {
      allowed: false,
      reason: `${config.name} 플랜에서는 이 기능을 사용할 수 없습니다. 업그레이드가 필요합니다.`,
    };
  }
  return { allowed: true };
}
