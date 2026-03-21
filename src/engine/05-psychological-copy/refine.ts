import { askClaude } from '@/lib/ai/claude';
import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { CopyBlocks, SectionCopy } from './types';
import {
  evaluateCopyQuality,
  buildRetryPrompt,
  mergeCopy,
  MAX_RETRIES,
  type QualityGateResult,
} from './quality-gate';

// ============================================================
// Copy Refiner — 규칙 엔진 카피 → AI 설득형 카피 재작성
// Claude 1회 호출로 전체 섹션 일괄 리파인
// 품질 게이트 통과 시까지 최대 2회 재시도
// ============================================================

const REFINE_SYSTEM = `당신은 대한민국 최고의 CRO(전환율 최적화) 카피라이터입니다.
규칙 엔진이 만든 "뼈대 카피"를 받아서, 제품과 고객 심리에 맞는 "설득형 카피"로 전면 재작성합니다.

## 재작성 원칙

### headline (15자 이내)
- 기능이 아닌 변화/결과를 약속
- ❌ "72시간 지속 보습" (기능 나열)
- ✅ "건조함 없는 하루의 시작" (변화 약속)
- ❌ "AI 프로젝트 관리 도구" (카테고리)
- ✅ "야근 없는 팀을 만드는 법" (결과)

### subheadline
- 헤드라인의 구체적 근거 또는 타겟 특정
- "{타겟}을 위한 새로운 선택" 같은 범용 템플릿 절대 금지
- 고객의 숨은 욕망(hidden desire) + 제품 포지셔닝 결합

### body (2~4줄)
- 고객의 현재 고통 → 해결 → 변화의 미니 스토리
- USP 직접 나열 금지 — 고객 관점에서 재해석
- 구체적 숫자와 감각적 표현 활용

### bulletPoints (3~5개)
- 각각 "혜택 → 근거" 구조 필수
- ❌ "AI 자동 일정 최적화" (기능만)
- ✅ "AI가 팀 일정을 자동 조율 → 회의 시간 60% 절감" (혜택+근거)

### ctaText
- 행동의 결과를 담은 구체적 텍스트
- ❌ "지금 시작하기" (범용)
- ✅ "무료로 피부 변화 체험하기" (구체적 결과)

### microCopy
- CTA 하단 저항 해소
- 가격 저항 높으면: "첫 달 무료, 언제든 해지 가능"
- 신뢰 저항 높으면: "100% 환불 보장"
- 복잡성 저항 높으면: "3분 만에 설정 완료"

### imageDirection (5줄 이상 필수)
반드시 아래 5가지를 모두 포함:
① 분위기/톤: 제품 포지셔닝에 맞는 비주얼 무드 (예: "프리미엄 미니멀, 차분한 뉴트럴 톤")
② 구도/레이아웃: 카메라 앵글, 여백, 초점 (예: "제품 클로즈업, 좌측 1/3 배치, 우측 여백")
③ 주요 피사체: 무엇을 보여줄지 (예: "세럼 드롭이 피부 위에 떨어지는 순간")
④ 배경/환경: 세팅과 소품 (예: "흰 대리석 위, 유칼립투스 잎, 자연광")
⑤ 절대 포함하지 말 것: (예: "텍스트, 로고, 사람 얼굴, 과도한 그래픽")

## 섹션 role별 설득 전략
- HOOK: 3초 안에 "이건 내 이야기"라는 확신. 감정적 헤드라인 + 구체적 약속
- PAIN: 고객이 느끼는 문제를 생생하게 묘사. 공감이 핵심
- SOLUTION: 기능이 아닌 "경험"으로 해결 과정을 보여줌
- PROOF: 제3자 증거 — 숫자, 실제 후기, 인증. 자기 자랑 금지
- OBJECTION: 구매 망설임의 정확한 지점을 짚고 해소
- URGENCY: 진짜 이유가 있는 긴급성. 거짓 긴급성 금지
- CTA: 행동 후 얻는 결과를 구체적으로 제시

## JSON 응답 형식
{
  "sections": [
    {
      "sectionOrder": 1,
      "role": "HOOK",
      "sectionType": "hero_visual",
      "copy": {
        "headline": "재작성",
        "subheadline": "재작성",
        "body": "재작성",
        "bulletPoints": ["혜택+근거", "혜택+근거", "혜택+근거"],
        "ctaText": "재작성",
        "microCopy": "재작성",
        "imageDirection": "5줄 이상 상세 디렉션"
      }
    }
  ],
  "tone": "전체 톤 1문장",
  "qualityScore": 85
}`;

function buildRefineMessage(
  brief: ProductBrief,
  rawCopy: CopyBlocks,
  productName: string,
  industry: string,
): string {
  let msg = `## 제품 정보
제품명: ${productName}
업종: ${industry}
포지셔닝: ${brief.productDNA.positioning}
핵심 가치: ${brief.productDNA.coreValue}
USP: ${brief.productDNA.usp.join(', ')}

## 가치 계층
- 기능적: ${brief.productDNA.valueHierarchy.functional}
- 감정적: ${brief.productDNA.valueHierarchy.emotional}
- 사회적: ${brief.productDNA.valueHierarchy.social}

## 고객 심리
- 표면 욕망: ${brief.customerDesire.surface}
- 진짜 욕망: ${brief.customerDesire.real}
- 숨은 욕망: ${brief.customerDesire.hidden}

## 고객 공포
- 문제 공포: ${brief.customerFear.problem}
- 기회 공포: ${brief.customerFear.opportunity}
- 사회 공포: ${brief.customerFear.social}

## 구매 저항 (1~5)
- 가격: Lv${brief.resistanceMap.price.level} — ${brief.resistanceMap.price.reason}
- 신뢰: Lv${brief.resistanceMap.trust.level} — ${brief.resistanceMap.trust.reason}
- 필요성: Lv${brief.resistanceMap.need.level} — ${brief.resistanceMap.need.reason}
- 긴급성: Lv${brief.resistanceMap.urgency.level} — ${brief.resistanceMap.urgency.reason}
- 복잡성: Lv${brief.resistanceMap.complexity.level} — ${brief.resistanceMap.complexity.reason}

## 의사결정 유형: ${brief.decisionType}

---

## 재작성 대상 (${rawCopy.sections.length}개 섹션)
`;

  for (const s of rawCopy.sections) {
    msg += `
### [${s.sectionOrder}] ${s.role} / ${s.sectionType}
headline: ${s.copy.headline}
subheadline: ${s.copy.subheadline}
body: ${s.copy.body}
bulletPoints: ${s.copy.bulletPoints.join(' | ')}
ctaText: ${s.copy.ctaText}
microCopy: ${s.copy.microCopy}
imageDirection: ${s.copy.imageDirection}`;
  }

  msg += `

---
위 ${rawCopy.sections.length}개 섹션 전부를 설득형 카피로 재작성하세요.
각 섹션의 role에 맞는 설득 전략 적용, 제품 고유의 가치와 고객 심리 반영.
imageDirection은 반드시 5줄 이상으로 상세 작성.
headline은 15자 이내.`;

  return msg;
}

export interface RefineCopyResult {
  refined: CopyBlocks;
  cost: number;
  latencyMs: number;
  qualityGate: QualityGateResult;
  retryCount: number;
}

export async function refineCopy(
  brief: ProductBrief,
  rawCopy: CopyBlocks,
  productName: string,
  industry: string,
  onRetry?: (attempt: number, failedCount: number) => void,
): Promise<RefineCopyResult> {
  const userMessage = buildRefineMessage(brief, rawCopy, productName, industry);
  let totalCost = 0;
  let totalLatencyMs = 0;

  // 1차 리파인
  const result = await askClaude<{
    sections: Array<{
      sectionOrder: number;
      role: string;
      sectionType: string;
      copy: {
        headline: string;
        subheadline: string;
        body: string;
        bulletPoints: string[];
        ctaText: string;
        microCopy: string;
        imageDirection: string;
      };
    }>;
    tone: string;
    qualityScore: number;
  }>(REFINE_SYSTEM, userMessage);

  totalCost += result.cost;
  totalLatencyMs += result.latencyMs;

  // AI 응답 → CopyBlocks 변환 (누락 섹션은 원본 유지)
  const aiSections: SectionCopy[] = result.data.sections.map((s): SectionCopy => ({
    sectionOrder: s.sectionOrder,
    role: s.role,
    sectionType: s.sectionType,
    copy: {
      headline: s.copy.headline,
      subheadline: s.copy.subheadline,
      body: s.copy.body,
      bulletPoints: s.copy.bulletPoints,
      ctaText: s.copy.ctaText,
      microCopy: s.copy.microCopy,
      imageDirection: s.copy.imageDirection,
    },
  }));

  let copyBlocks: CopyBlocks = {
    sections: rawCopy.sections.map((original) => {
      const refined = aiSections.find((r) => r.sectionOrder === original.sectionOrder);
      return refined ?? original;
    }),
    tone: result.data.tone || rawCopy.tone,
    qualityScore: result.data.qualityScore || 85,
  };

  // 품질 게이트 (frames + tone-matrix)
  let retryCount = 0;
  let qualityGate = evaluateCopyQuality(copyBlocks, industry);

  while (!qualityGate.passed && retryCount < MAX_RETRIES) {
    retryCount++;
    onRetry?.(retryCount, qualityGate.failedSections.length);

    const retryPrompt = buildRetryPrompt(qualityGate.failedSections, copyBlocks);
    const retryResult = await askClaude<{
      sections: SectionCopy[];
    }>(REFINE_SYSTEM, retryPrompt);

    totalCost += retryResult.cost;
    totalLatencyMs += retryResult.latencyMs;

    copyBlocks = mergeCopy(copyBlocks, retryResult.data.sections);
    qualityGate = evaluateCopyQuality(copyBlocks, industry);
  }

  copyBlocks.qualityScore = qualityGate.overallScore;

  return {
    refined: copyBlocks,
    cost: totalCost,
    latencyMs: totalLatencyMs,
    qualityGate,
    retryCount,
  };
}
