// ============================================================
// Deploy Engine — 비즈니스 규칙
// ============================================================

// --- 배포 상태 ---

export const DEPLOY_REQUIRED_STATUS = 'GENERATED' as const;
export const DEPLOY_ACTIVE_STATUS = 'DEPLOYED' as const;
export const DEPLOY_REVERTED_STATUS = 'GENERATED' as const;

// --- URL 패턴 ---

export const DEPLOY_URL_PREFIX = '/p/' as const;

// --- 에러 메시지 ---

export const DEPLOY_ERRORS = {
  projectNotFound: '프로젝트를 찾을 수 없습니다',
  invalidStatus: '생성 완료 상태에서만 배포할 수 있습니다',
  noHtml: '생성된 HTML이 없습니다',
} as const;
