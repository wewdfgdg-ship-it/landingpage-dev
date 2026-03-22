// ============================================================
// Image Generation Engine — 타입 정의
// ============================================================

/** 섹션별 이미지 생성 요청 */
export interface SectionImageRequest {
  sectionOrder: number;
  sectionType: string;
  patternId: string;
  imageDirection: string; // Copy Engine이 생성한 이미지 지시문
  cutout: boolean; // 크로마키 배경 제거 여부
}

/** 생성된 이미지 결과 */
export interface SectionImageResult {
  sectionOrder: number;
  cdnUrl: string;
  storageKey: string;
  cost: number;
}

/** 이미지 생성 엔진 전체 출력 */
export interface ImageGenerationOutput {
  images: SectionImageResult[];
  totalCost: number;
  totalImages: number;
  failedSections: number[];
}

/** 이미지가 필요한 패턴 목록 */
export const IMAGE_REQUIRED_PATTERNS = new Set([
  // Hero (이미지 영역 있는 패턴)
  'hero_left_right',
  'hero_split',
  'hero_card',
  'hero_product_center',
  // Feature (이미지 영역 있는 패턴)
  'feat_zigzag',
  'feat_large_img_bullets',
]);
