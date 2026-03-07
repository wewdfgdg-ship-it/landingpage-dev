import { askClaude } from '@/lib/ai/claude';
import type { ProductBrief, ProductIntelligenceInput } from './types';
export type { ProductBrief, ProductIntelligenceInput } from './types';

// ============================================================
// Product Intelligence Engine
// 3회 AI 호출: Phase A (제품 DNA) → Phase B (고객 심리) → Phase C (시장 + 종합)
// ============================================================

const PHASE_A_SYSTEM = `당신은 마케팅 전략가입니다. 제품/서비스의 DNA를 분석합니다.

분석 항목:
1. 핵심 가치 (Core Value): 이 제품이 존재하는 이유 1문장
2. USP (Unique Selling Point): 경쟁사 대비 유일한 차별점 1~3개
3. 포지셔닝: premium(프리미엄) | value(가성비) | innovation(혁신) | tradition(전통)
4. 가치 계층: 기능적 가치 → 감정적 가치 → 사회적 가치

JSON으로 응답:
{
  "coreValue": "1문장",
  "usp": ["차별점1", "차별점2"],
  "positioning": "premium|value|innovation|tradition",
  "valueHierarchy": {
    "functional": "기능적 가치",
    "emotional": "감정적 가치",
    "social": "사회적 가치"
  }
}`;

const PHASE_B_SYSTEM = `당신은 소비자 심리 분석가입니다. 제품에 대한 고객 심리를 분석합니다.

분석 항목:
1. 고객 욕망 3계층: 표면 욕망, 진짜 욕망, 숨은 욕망
2. 고객 공포 3계층: 문제 공포, 기회 공포, 사회 공포
3. 구매 저항 5요소 (각 1~5 레벨): 가격, 신뢰, 필요성, 긴급성, 복잡성
4. 의사결정 유형: impulse(충동형) | analytical(분석형) | cautious(신중형) | follower(추종형)

JSON으로 응답:
{
  "customerDesire": { "surface": "", "real": "", "hidden": "" },
  "customerFear": { "problem": "", "opportunity": "", "social": "" },
  "resistanceMap": {
    "price": { "level": 4, "reason": "이유" },
    "trust": { "level": 3, "reason": "이유" },
    "need": { "level": 2, "reason": "이유" },
    "urgency": { "level": 5, "reason": "이유" },
    "complexity": { "level": 1, "reason": "이유" }
  },
  "decisionType": "analytical"
}`;

const PHASE_C_SYSTEM = `당신은 시장 분석가입니다. 시장 컨텍스트를 분석하고 전체 분석의 신뢰도 점수를 매깁니다.

분석 항목:
1. 경쟁 강도: red_ocean | blue_ocean | niche
2. 가격 감수성: high | medium | low
3. 구매 주기: one_time | repeat | subscription
4. 의사결정 소요시간: instant | 1_day | 1_week | 1_month_plus
5. 주요 구매 채널: direct_online | comparison | referral
6. 신뢰도 점수 (0~100): 입력 데이터의 충분도와 분석 확신도 기반

JSON으로 응답:
{
  "marketContext": {
    "competitionLevel": "red_ocean",
    "priceSensitivity": "medium",
    "purchaseCycle": "repeat",
    "decisionTime": "1_day",
    "primaryChannel": "direct_online"
  },
  "confidenceScore": 78
}`;

function buildUserMessage(input: ProductIntelligenceInput): string {
  const { basicInfo, deepAnswers } = input;

  let msg = `제품명: ${basicInfo.productName}
업종: ${basicInfo.industry}
가격대: ${basicInfo.priceRange}
페이지 목표: ${basicInfo.pageGoal}
타겟 고객: ${basicInfo.targetAudience || '미입력'}
경쟁사 URL: ${basicInfo.competitorUrl || '미입력'}
업로드 이미지: ${input.images.length}장`;

  if (deepAnswers.length > 0) {
    msg += '\n\n--- 심층 답변 ---';
    for (const qa of deepAnswers) {
      if (qa.answer.trim()) {
        msg += `\n\nQ: ${qa.question}\nA: ${qa.answer}`;
      }
    }
  }

  return msg;
}

export async function runProductIntelligence(
  input: ProductIntelligenceInput,
): Promise<{ brief: ProductBrief; totalCost: number; totalLatencyMs: number }> {
  const userMessage = buildUserMessage(input);

  // Phase A: 제품 DNA 추출
  const phaseA = await askClaude<{
    coreValue: string;
    usp: string[];
    positioning: 'premium' | 'value' | 'innovation' | 'tradition';
    valueHierarchy: { functional: string; emotional: string; social: string };
  }>(PHASE_A_SYSTEM, userMessage);

  // Phase B: 고객 심리 분석 (Phase A 결과 포함)
  const phaseBMessage = `${userMessage}\n\n--- 제품 DNA 분석 결과 ---\n핵심 가치: ${phaseA.data.coreValue}\nUSP: ${phaseA.data.usp.join(', ')}\n포지셔닝: ${phaseA.data.positioning}`;

  const phaseB = await askClaude<{
    customerDesire: { surface: string; real: string; hidden: string };
    customerFear: { problem: string; opportunity: string; social: string };
    resistanceMap: {
      price: { level: number; reason: string };
      trust: { level: number; reason: string };
      need: { level: number; reason: string };
      urgency: { level: number; reason: string };
      complexity: { level: number; reason: string };
    };
    decisionType: 'impulse' | 'analytical' | 'cautious' | 'follower';
  }>(PHASE_B_SYSTEM, phaseBMessage);

  // Phase C: 시장 컨텍스트 + 신뢰도 점수
  const phaseC = await askClaude<{
    marketContext: {
      competitionLevel: 'red_ocean' | 'blue_ocean' | 'niche';
      priceSensitivity: 'high' | 'medium' | 'low';
      purchaseCycle: 'one_time' | 'repeat' | 'subscription';
      decisionTime: 'instant' | '1_day' | '1_week' | '1_month_plus';
      primaryChannel: 'direct_online' | 'comparison' | 'referral';
    };
    confidenceScore: number;
  }>(PHASE_C_SYSTEM, userMessage);

  const brief: ProductBrief = {
    productDNA: phaseA.data,
    customerDesire: phaseB.data.customerDesire,
    customerFear: phaseB.data.customerFear,
    resistanceMap: phaseB.data.resistanceMap,
    decisionType: phaseB.data.decisionType,
    marketContext: phaseC.data.marketContext,
    confidenceScore: phaseC.data.confidenceScore,
  };

  const totalCost = phaseA.cost + phaseB.cost + phaseC.cost;
  const totalLatencyMs = phaseA.latencyMs + phaseB.latencyMs + phaseC.latencyMs;

  return { brief, totalCost, totalLatencyMs };
}
