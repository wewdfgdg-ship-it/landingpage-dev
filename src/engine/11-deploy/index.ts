import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type { DeployResult, DeployConfig } from './types';
import type { DeployResult } from './types';

// ============================================================
// Deploy Engine — 프로젝트 배포 처리
// slug 기반 내부 호스팅 (/p/[slug])
// 배포 이력 관리 (PageVersion)
// ============================================================

export interface DeployInput {
  projectId: string;
  orgId: string;
}

/**
 * 프로젝트를 배포 상태로 전환
 * - generatedHtml 존재 확인
 * - PageVersion 스냅샷 저장 (이력 + 롤백 지원)
 * - isDeployed=true, status='DEPLOYED' 업데이트
 * - 캐시 무효화 (revalidatePath + Vercel purge)
 * - 공개 URL 반환
 */
export async function runDeploy(input: DeployInput): Promise<DeployResult> {
  const project = await db.project.findFirst({
    where: { id: input.projectId, orgId: input.orgId, deletedAt: null },
    select: {
      id: true,
      slug: true,
      status: true,
      generatedHtml: true,
      generatedPage: true,
    },
  });

  if (!project) {
    throw new Error('프로젝트를 찾을 수 없습니다');
  }

  // GENERATED 또는 이미 DEPLOYED (재배포) 허용
  if (project.status !== 'GENERATED' && project.status !== 'DEPLOYED') {
    throw new Error('생성 완료 또는 배포 상태에서만 배포할 수 있습니다');
  }

  if (!project.generatedHtml) {
    throw new Error('생성된 HTML이 없습니다');
  }

  const now = new Date();
  const slug = project.slug ?? project.id;

  // PageVersion 스냅샷 저장 (배포 이력)
  const lastVersion = await db.pageVersion.findFirst({
    where: { projectId: input.projectId },
    orderBy: { version: 'desc' },
    select: { version: true },
  });

  const nextVersion = (lastVersion?.version ?? 0) + 1;

  await db.pageVersion.create({
    data: {
      projectId: input.projectId,
      version: nextVersion,
      label: `배포 v${nextVersion}`,
      htmlContent: project.generatedHtml,
      sectionSnapshot: project.generatedPage ?? undefined,
    },
  });

  // DB 상태 업데이트
  await db.project.update({
    where: { id: input.projectId },
    data: {
      isDeployed: true,
      deployedAt: now,
      status: 'DEPLOYED',
    },
  });

  // 캐시 무효화 — Next.js ISR + Vercel Edge Cache
  try {
    revalidatePath(`/p/${slug}`);
  } catch {
    // 빌드 타임 등 revalidate 불가 환경 무시
  }

  return {
    slug,
    url: `/p/${slug}`,
    deployedAt: now.toISOString(),
    version: nextVersion,
  };
}

/**
 * 특정 버전으로 롤백
 * - PageVersion에서 HTML 복원
 * - 새 배포 이력 생성
 */
export async function rollbackDeploy(
  projectId: string,
  orgId: string,
  targetVersion: number,
): Promise<DeployResult> {
  const project = await db.project.findFirst({
    where: { id: projectId, orgId, deletedAt: null },
    select: { id: true, slug: true, status: true },
  });

  if (!project) {
    throw new Error('프로젝트를 찾을 수 없습니다');
  }

  const pageVersion = await db.pageVersion.findFirst({
    where: { projectId, version: targetVersion },
    select: { htmlContent: true, sectionSnapshot: true, version: true },
  });

  if (!pageVersion?.htmlContent) {
    throw new Error(`버전 ${targetVersion}의 HTML을 찾을 수 없습니다`);
  }

  // 롤백 대상 HTML을 프로젝트에 복원
  await db.project.update({
    where: { id: projectId },
    data: {
      generatedHtml: pageVersion.htmlContent,
      generatedPage: pageVersion.sectionSnapshot ?? undefined,
    },
  });

  // 새 버전으로 재배포
  return runDeploy({ projectId, orgId });
}

/**
 * 배포 이력 조회
 */
export async function getDeployHistory(
  projectId: string,
): Promise<{ version: number; label: string | null; createdAt: Date }[]> {
  return db.pageVersion.findMany({
    where: { projectId },
    orderBy: { version: 'desc' },
    select: { version: true, label: true, createdAt: true },
    take: 20,
  });
}

/**
 * 배포 해제
 */
export async function undeploy(projectId: string, orgId: string): Promise<void> {
  const project = await db.project.findFirst({
    where: { id: projectId, orgId, deletedAt: null },
    select: { slug: true },
  });

  await db.project.updateMany({
    where: { id: projectId, orgId, deletedAt: null },
    data: {
      isDeployed: false,
      status: 'GENERATED',
    },
  });

  // 캐시 무효화
  if (project?.slug) {
    try {
      revalidatePath(`/p/${project.slug}`);
    } catch {
      // 무시
    }
  }
}
