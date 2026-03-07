// ============================================================
// Psychological Copy Engine — 타입 정의
// ============================================================

export interface CopyBlock {
  headline: string; // 1줄, 최대 15자
  subheadline: string; // 1~2줄
  body: string; // 2~4줄
  bulletPoints: string[]; // 3~5개
  ctaText: string; // 버튼 텍스트
  microCopy: string; // 버튼 하단 보조
  imageDirection: string; // 이미지 생성용 지시
  imageUrl?: string; // 생성된 이미지 CDN URL (이미지 엔진이 주입)
}

export interface SectionCopy {
  sectionOrder: number;
  role: string;
  sectionType: string;
  copy: CopyBlock;
}

export interface CopyBlocks {
  sections: SectionCopy[];
  tone: string; // 전체 톤 설명
  qualityScore: number; // 0~100
}
