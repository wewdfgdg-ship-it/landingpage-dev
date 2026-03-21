// ============================================================
// Deploy Engine — 타입 정의
// 현재: slug 기반 내부 호스팅 (DB 직접 서빙)
// 향후: R2 정적 호스팅, 커스텀 도메인
// ============================================================

export interface DeployResult {
  slug: string;
  url: string;
  deployedAt: string;
  version?: number;
}

export interface DeployConfig {
  strategy: 'internal'; // 향후 'r2' | 'custom_domain' 추가
}
