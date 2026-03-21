import type { SectionImageRequest } from './types';

// ============================================================
// Image Generation Prompts
// ============================================================

/** 섹션 타입별 컨텍스트 설명 */
const SECTION_CONTEXT_MAP: Record<string, string> = {
  hero: '랜딩페이지 메인 히어로 영역 — 시선을 사로잡는 대표 이미지',
  feature: '기능/특징 소개 영역 — 제품의 핵심 가치를 보여주는 이미지',
  benefit: '혜택 설명 영역 — 사용자가 얻는 이점을 시각화',
  social_proof: '사회적 증거 영역 — 신뢰를 구축하는 이미지',
  how_it_works: '사용 방법 영역 — 단계별 프로세스를 설명하는 이미지',
  comparison: '비교 영역 — 제품의 차별점을 보여주는 이미지',
};

function getSectionContext(sectionType: string): string {
  return SECTION_CONTEXT_MAP[sectionType] ?? '제품과 관련된 전문적인 이미지';
}

/** imageDirection을 Gemini 프롬프트로 변환 */
export function buildImagePrompt(
  req: SectionImageRequest,
  productName: string,
  industry: string,
  moodPreset: string,
): string {
  const sectionContext = getSectionContext(req.sectionType);

  return `당신은 전문 상업용 제품 사진작가입니다.

제품: ${productName}
산업: ${industry}
분위기: ${moodPreset}
섹션 용도: ${sectionContext}

다음 지시에 따라 고품질 상업용 이미지를 생성하세요:
${req.imageDirection}

요구사항:
- 깨끗하고 전문적인 상업 사진 스타일
- 텍스트나 글자를 이미지에 포함하지 마세요
- 제품과 관련된 시각적 요소만 포함
- 4:3 가로 비율
- 밝고 선명한 색감
- 배경은 심플하게`;
}
