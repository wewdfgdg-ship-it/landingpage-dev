// ============================================================
// Image Generation Engine — 타입 정의
// ============================================================

/** 섹션별 이미지 생성 요청 */
export interface SectionImageRequest {
  sectionOrder: number;
  sectionType: string;
  patternId: string;
  imageDirection: string; // Copy Engine이 생성한 이미지 지시문
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
  'hero_left_right', 'hero_split', 'hero_card', 'hero_product_center',
  'hero_split_left', 'hero_split_right',
  // Feature / Detail (이미지 영역 있는 패턴)
  'feat_zigzag', 'feat_large_img_bullets',
  'features_alternating',
  'detail_split_left', 'detail_split_right', 'detail_fullwidth',
  // Lifestyle (이미지 중심)
  'lifestyle_gallery', 'lifestyle_fullbleed', 'lifestyle_mosaic',
  // Photo Reviews (사진 필수)
  'photo_masonry', 'photo_carousel', 'photo_grid',
  // Before/After (비주얼 비교)
  'ba_split', 'ba_slider',
  // Brand Story (풀블리드)
  'story_fullwidth', 'story_split',
  // Package (제품 사진)
  'package_exploded', 'package_grid',
  // SNS (이미지 필요)
  'sns_feed', 'sns_cards',
]);
