// ============================================================
// 섹션 영역 감지 — AI Vision으로 풀페이지 스크린샷 분석
// Gemini Flash로 각 섹션의 y좌표 + 높이 식별
// ============================================================

import { GoogleGenAI } from '@google/genai';
import type { DetectedSection, SectionDetectionResponse } from './types';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const VISION_MODEL = 'gemini-2.5-flash';

/** 우리 시스템의 섹션 타입 목록 */
const KNOWN_SECTION_TYPES = [
  'HEADER_BANNER', 'HERO', 'KEY_FEATURES', 'BENEFITS',
  'BEFORE_AFTER', 'PRODUCT_DETAIL', 'INGREDIENTS', 'HOW_TO_USE',
  'REVIEWS', 'TESTIMONIAL', 'SOCIAL_PROOF',
  'FAQ', 'CTA', 'PRICE_TABLE', 'COMPARISON',
  'BRAND_STORY', 'TEAM', 'PARTNERS', 'STATS',
  'GUARANTEE', 'PROCESS', 'GALLERY', 'VIDEO',
  'NEWSLETTER', 'CONTACT', 'FOOTER',
] as const;

/**
 * 풀페이지 스크린샷에서 섹션 영역 감지
 *
 * @param screenshotBuffer - JPEG 스크린샷 버퍼
 * @param pageHeight - 페이지 전체 높이 (px)
 * @param targetSectionType - 찾으려는 특정 섹션 타입 (없으면 전체 감지)
 */
export async function detectSections(
  screenshotBuffer: Buffer,
  pageHeight: number,
  targetSectionType?: string,
): Promise<DetectedSection[]> {
  const base64Image = screenshotBuffer.toString('base64');

  const sectionList = KNOWN_SECTION_TYPES.join(', ');
  const targetHint = targetSectionType
    ? `\n특히 "${targetSectionType}" 섹션을 최우선으로 찾아주세요.`
    : '';

  const prompt = `당신은 랜딩페이지/상세페이지의 섹션 구조를 분석하는 전문가입니다.

이 풀페이지 스크린샷(높이: ${pageHeight}px)을 분석하여 각 섹션의 위치를 식별해주세요.
${targetHint}

## 섹션 타입 목록
${sectionList}

## 응답 형식 (순수 JSON만 반환)
{
  "sections": [
    {
      "sectionType": "HEADER_BANNER",
      "confidence": 0.95,
      "y": 0,
      "height": 600,
      "description": "메인 히어로 배너, 제품 이미지와 CTA 버튼"
    }
  ],
  "pageDescription": "뷰티 브랜드 랜딩페이지"
}

## 규칙
1. y좌표는 페이지 최상단(0px)부터의 절대 위치
2. height는 해당 섹션의 세로 크기 (px)
3. confidence는 0.0~1.0 (0.5 미만은 제외)
4. 같은 sectionType이 여러 번 나올 수 있음
5. 이미지 내 비율로 추정하여 실제 px 좌표 계산
6. sections 배열은 y좌표 오름차순 정렬`;

  const response = await genai.models.generateContent({
    model: VISION_MODEL,
    contents: [{
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    }],
    config: {
      responseMimeType: 'application/json',
    },
  });

  const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

  let parsed: SectionDetectionResponse;
  try {
    parsed = JSON.parse(rawText) as SectionDetectionResponse;
  } catch {
    console.error('[section-detect] JSON 파싱 실패:', rawText.substring(0, 200));
    return [];
  }

  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    return [];
  }

  // confidence 0.5 이상만 필터 + y좌표 정렬
  return parsed.sections
    .filter((s) => s.confidence >= 0.5 && s.height > 50)
    .sort((a, b) => a.y - b.y);
}

/**
 * 특정 섹션 타입만 필터
 */
export function filterByType(
  sections: DetectedSection[],
  sectionType: string,
): DetectedSection[] {
  return sections.filter((s) => s.sectionType === sectionType);
}
