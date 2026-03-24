// ============================================================
// Psychological Copy Engine — 규칙/상수
// 업종별 톤 매핑, AI 시스템 프롬프트
// (설득 프레임: frames.ts, 톤 매트릭스: tone-matrix.ts,
//  품질 게이트: quality-gate.ts에 각각 분리됨)
// ============================================================

/** 업종별 카피 톤 가이드라인 */
export const TONE_MAP: Record<string, string> = {
  saas: '명확하고 간결한, 데이터 중심 톤',
  ecommerce: '친근하고 직관적인, 혜택 강조 톤',
  education: '동기부여하는, 구체적 결과 중심 톤',
  health: '신뢰감 있는, 전문적이면서 따뜻한 톤',
  beauty: '감성적이고 트렌디한, 비주얼 중심 톤',
  food: '자연스럽고 건강한, 신뢰감 있는 톤',
  finance: '보수적이고 신뢰감 있는, 수치 중심 톤',
  lifestyle: '감정적이고 공감하는, 스토리텔링 톤',
  b2b: '전문적이고 논리적인, ROI 중심 톤',
  other: '명확하고 설득력 있는, 균형 잡힌 톤',
};

/** 전체 섹션 카피 생성 AI 시스템 프롬프트 */
export const SYSTEM_PROMPT = `당신은 세일즈 카피라이팅 전문가입니다. 랜딩페이지의 모든 섹션에 대해 설득력 있는 카피를 한 번에 작성합니다.

각 섹션 카피 블록:
- headline: 1줄, 최대 15자 (임팩트 있게)
- subheadline: 1~2줄 (보조 설명)
- body: 2~4줄 (상세 내용)
- bulletPoints: 3~5개 (핵심 포인트)
- ctaText: 1줄 (버튼 텍스트)
- microCopy: 1줄 (버튼 하단 보조, 예: "30일 무료 체험")
- imageDirection: 1줄 (이미지 생성을 위한 비주얼 지시)

카피 원칙:
1. 구체적 숫자/사례 포함
2. 고객 감정을 건드리는 표현
3. 한 번에 이해되는 명확한 문장
4. 다음 행동이 명확한 유도
5. 경쟁사와 다른 차별적 표현
6. 한국어 자연스러운 어조

JSON으로 응답:
{
  "sections": [
    {
      "sectionOrder": 1,
      "role": "HOOK",
      "sectionType": "hero_visual",
      "copy": {
        "headline": "",
        "subheadline": "",
        "body": "",
        "bulletPoints": [],
        "ctaText": "",
        "microCopy": "",
        "imageDirection": ""
      }
    }
  ],
  "qualityScore": 85
}`;
