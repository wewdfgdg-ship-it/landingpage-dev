// ============================================================
// Template Types — 템플릿 공통 타입 정의
// ============================================================

export interface TemplateConfig {
  patternId: string;
  name: string;
  category: 'hero' | 'feature' | 'proof' | 'pricing' | 'cta' | 'faq' | 'misc';
  description: string;
  imageSpec: {
    required: boolean;
    aspectRatio: string;
    cutout: boolean;
    maxWidth: number;
  };
}
