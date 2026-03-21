// ============================================================
// 크롤러 엔진 — 타입 정의
// ============================================================

/** 크롤링 실행 설정 */
export interface CrawlConfig {
  /** 페이지당 네비게이션 타임아웃 (ms) — 기본 30000 */
  navigationTimeout: number;
  /** 브라우저 뷰포트 너비 (px) — 기본 1440 */
  viewportWidth: number;
  /** 브라우저 뷰포트 높이 (px) — 기본 900 */
  viewportHeight: number;
  /** 스크린샷 최대 높이 (px) — 기본 15000 */
  maxCaptureHeight: number;
  /** JPEG 품질 (1-100) — 기본 85 */
  jpegQuality: number;
  /** 최대 크롤링 페이지 수 — 기본 20 */
  maxPages: number;
  /** 섹션 감지 최소 confidence — 기본 0.6 */
  minConfidence: number;
  /** 페이지 간 대기 시간 (ms) — 기본 500 */
  delayBetweenPages: number;
}

/** 기본 크롤링 설정 */
export const DEFAULT_CRAWL_CONFIG: CrawlConfig = {
  navigationTimeout: 30_000,
  viewportWidth: 1440,
  viewportHeight: 900,
  maxCaptureHeight: 15_000,
  jpegQuality: 85,
  maxPages: 20,
  minConfidence: 0.6,
  delayBetweenPages: 500,
};

/** Gemini Vision이 감지한 섹션 영역 */
export interface DetectedSection {
  /** 섹션 타입 (HEADER_BANNER, HERO 등) */
  sectionType: string;
  /** 감지 확신도 (0.0 ~ 1.0) */
  confidence: number;
  /** 페이지 최상단 기준 y좌표 (px) */
  y: number;
  /** 섹션 높이 (px) */
  height: number;
  /** 섹션 내용 설명 */
  description: string;
}

/** Gemini Vision 응답 구조 */
export interface SectionDetectionResponse {
  sections: DetectedSection[];
  pageDescription: string;
}

/** 단일 페이지 크롤링 결과 */
export interface CrawlResult {
  /** 크롤링한 URL */
  url: string;
  /** 페이지 제목 */
  pageTitle: string;
  /** 감지된 전체 섹션 수 */
  sectionsFound: number;
  /** DB에 저장된 섹션 수 */
  sectionsUploaded: number;
  /** 스크린샷 base64 (full-page) */
  screenshotBase64: string | null;
  /** 에러 메시지 (있을 경우) */
  errors: string[];
}

/** 전체 크롤링 작업 결과 */
export interface CrawlJobResult {
  /** CrawlJob ID */
  crawlJobId: string;
  /** 처리한 총 페이지 수 */
  totalPages: number;
  /** 수집된 총 섹션 수 */
  collected: number;
  /** 실패한 페이지 수 */
  failed: number;
  /** 각 페이지별 결과 */
  pageResults: CrawlResult[];
  /** 전체 에러 목록 */
  errors: string[];
}

/** 검색 결과 URL */
export interface SearchResult {
  url: string;
  title: string;
}

/** 크롭된 섹션 이미지 (뷰포트 스캔 방식용) */
export interface CroppedSection {
  sectionType: string;
  confidence: number;
  imageBuffer: Buffer;
  width: number;
  height: number;
}

/** 크롤링 작업 DB 데이터 */
export interface CrawlJobData {
  crawlJobId: string;
  sectionType: string;
  industry: string;
  treatment: string;
  count: number;
  sourceSites: string[];
  keywords: string[];
  memo: string | null;
}

/** 크롤링 진행률 보고 */
export interface CrawlProgress {
  /** 처리 중인 페이지 번호 (1-based) */
  currentPage: number;
  /** 전체 대상 페이지 수 */
  totalPages: number;
  /** 현재까지 수집된 섹션 수 */
  collected: number;
  /** 목표 수량 */
  targetCount: number;
  /** 현재 처리 중인 URL */
  currentUrl: string;
  /** 진행 단계 */
  phase: 'searching' | 'crawling' | 'uploading' | 'done';
  /** 전체 진행률 (0~100) */
  percent: number;
}
