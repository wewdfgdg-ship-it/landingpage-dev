import { db } from '@/lib/db';

export type { DeployResult, DeployConfig } from './types';
import type { DeployResult } from './types';
import { DEPLOYABLE_STATUS, DEPLOYED_STATUS, UNDEPLOYED_STATUS, PUBLIC_URL_PREFIX, DEPLOY_ERRORS } from './rules';

// ============================================================
// Deploy Engine — 프로젝트 배포 처리
// slug 기반 내부 호스팅 (/p/[slug])
// ============================================================

export interface DeployInput {
  projectId: string;
  orgId: string;
}

/**
 * 프로젝트를 배포 상태로 전환
 * - generatedHtml 존재 확인
 * - isDeployed=true, status='DEPLOYED' 업데이트
 * - 공개 URL 반환
 */
export async function runDeploy(input: DeployInput): Promise<DeployResult> {
  const project = await db.project.findFirst({
    where: { id: input.projectId, orgId: input.orgId, deletedAt: null },
    select: { id: true, slug: true, status: true, generatedHtml: true },
  });

  if (!project) {
    throw new Error(DEPLOY_ERRORS.notFound);
  }

  if (project.status !== DEPLOYABLE_STATUS) {
    throw new Error(DEPLOY_ERRORS.notGenerated);
  }

  if (!project.generatedHtml) {
    throw new Error(DEPLOY_ERRORS.noHtml);
  }

  const now = new Date();

  await db.project.update({
    where: { id: input.projectId },
    data: {
      isDeployed: true,
      deployedAt: now,
      status: DEPLOYED_STATUS,
    },
  });

  const slug = project.slug ?? project.id;

  return {
    slug,
    url: `${PUBLIC_URL_PREFIX}${slug}`,
    deployedAt: now.toISOString(),
  };
}

/**
 * 배포 해제
 */
export async function undeploy(projectId: string, orgId: string): Promise<void> {
  await db.project.updateMany({
    where: { id: projectId, orgId, deletedAt: null },
    data: {
      isDeployed: false,
      status: UNDEPLOYED_STATUS,
    },
  });
}
