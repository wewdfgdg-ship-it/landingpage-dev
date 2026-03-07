import { askClaude } from '@/lib/ai/claude';
import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { UrgencyBrief } from '@/engine/02-why-now/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { ObjectionMap } from '@/engine/04-objection-killer/types';
import type { CopyBlocks, SectionCopy } from './types';
import {
  evaluateCopyQuality,
  buildRetryPrompt,
  mergeCopy,
  MAX_RETRIES,
  type QualityGateResult,
} from './quality-gate';
export type { CopyBlocks } from './types';
export type { QualityGateResult } from './quality-gate';

// ============================================================
// Psychological Copy Engine — AI 1회
// 전체 섹션의 카피를 한 번에 생성
// ============================================================

const TONE_MAP: Record<string, string> = {
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

const SYSTEM_PROMPT = `당신은 세일즈 카피라이팅 전문가입니다. 랜딩페이지의 모든 섹션에 대해 설득력 있는 카피를 한 번에 작성합니다.

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

function buildCopyMessage(
  brief: ProductBrief,
  urgency: UrgencyBrief,
  blueprint: StrategyBlueprint,
  objectionMap: ObjectionMap,
  industry: string,
): string {
  const tone = TONE_MAP[industry] ?? TONE_MAP.other;

  const sectionList = blueprint.structure
    .map((s) => `  ${s.order}. [${s.role}] ${s.sectionType} — ${s.purpose}`)
    .join('\n');

  const activeObjections = objectionMap.activeObjections
    .map((o) => `  - ${o.type}(Lv${o.level}): ${o.copyDirection}`)
    .join('\n');

  return `■ 제품 정보
핵심 가치: ${brief.productDNA.coreValue}
USP: ${brief.productDNA.usp.join(', ')}
포지셔닝: ${brief.productDNA.positioning}

■ 고객 심리
표면 욕망: ${brief.customerDesire.surface}
진짜 욕망: ${brief.customerDesire.real}
숨은 욕망: ${brief.customerDesire.hidden}
핵심 공포: ${brief.customerFear.problem}
의사결정 유형: ${brief.decisionType}

■ 긴급성
유형: ${urgency.primaryType}${urgency.secondaryType ? ` + ${urgency.secondaryType}` : ''}
메시지: ${urgency.urgencyElements.map((e) => e.message).join(' / ')}

■ 저항 해소 방향
${activeObjections || '  (활성 저항 없음)'}

■ 톤: ${tone}

■ 섹션 구조 (총 ${blueprint.totalSections}개)
${sectionList}

위 모든 섹션에 대해 카피를 작성해주세요.`;
}

export interface CopyEngineResult {
  copyBlocks: CopyBlocks;
  cost: number;
  qualityGate: QualityGateResult;
  retryCount: number;
}

export async function runPsychologicalCopy(
  brief: ProductBrief,
  urgency: UrgencyBrief,
  blueprint: StrategyBlueprint,
  objectionMap: ObjectionMap,
  industry: string,
  onRetry?: (attempt: number, failedCount: number) => void,
): Promise<CopyEngineResult> {
  const userMessage = buildCopyMessage(brief, urgency, blueprint, objectionMap, industry);
  const tone = TONE_MAP[industry] ?? TONE_MAP.other;
  let totalCost = 0;

  // 1차 생성
  const result = await askClaude<{
    sections: SectionCopy[];
    qualityScore: number;
  }>(SYSTEM_PROMPT, userMessage);
  totalCost += result.cost;

  let copyBlocks: CopyBlocks = {
    sections: result.data.sections,
    tone,
    qualityScore: result.data.qualityScore,
  };

  // 품질 게이트 루프
  let retryCount = 0;
  let qualityGate = evaluateCopyQuality(copyBlocks, industry);

  while (!qualityGate.passed && retryCount < MAX_RETRIES) {
    retryCount++;
    onRetry?.(retryCount, qualityGate.failedSections.length);

    const retryPrompt = buildRetryPrompt(qualityGate.failedSections, copyBlocks);
    const retryResult = await askClaude<{
      sections: SectionCopy[];
    }>(SYSTEM_PROMPT, retryPrompt);
    totalCost += retryResult.cost;

    copyBlocks = mergeCopy(copyBlocks, retryResult.data.sections);
    qualityGate = evaluateCopyQuality(copyBlocks, industry);
  }

  // 최종 점수를 qualityScore에 반영
  copyBlocks.qualityScore = qualityGate.overallScore;

  return {
    copyBlocks,
    cost: totalCost,
    qualityGate,
    retryCount,
  };
}
