// ============================================================
// Deploy Engine — 규칙/상수
// 배포 상태 전환 조건, URL 패턴
// ============================================================

/** 배포 가능한 프로젝트 상태 */
export const DEPLOYABLE_STATUS = 'GENERATED' as const;

/** 배포 후 프로젝트 상태 */
export const DEPLOYED_STATUS = 'DEPLOYED' as const;

/** 배포 해제 후 프로젝트 상태 */
export const UNDEPLOYED_STATUS = 'GENERATED' as const;

/** 배포된 페이지 공개 URL 경로 접두사 */
export const PUBLIC_URL_PREFIX = '/p/';

/** 에러 메시지 */
export const DEPLOY_ERRORS = {
  notFound: '프로젝트를 찾을 수 없습니다',
  notGenerated: '생성 완료 상태에서만 배포할 수 있습니다',
  noHtml: '생성된 HTML이 없습니다',
} as const;
