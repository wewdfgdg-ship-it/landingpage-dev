import { askClaude } from '@/lib/ai/claude';
import type { ProductBrief, ProductIntelligenceInput } from './types';
import { PHASE_A_SYSTEM, PHASE_B_SYSTEM, PHASE_C_SYSTEM } from './rules';
export type { ProductBrief, ProductIntelligenceInput } from './types';

// ============================================================
// Product Intelligence Engine
// 3회 AI 호출: Phase A (제품 DNA) → Phase B (고객 심리) → Phase C (시장 + 종합)
// ============================================================

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
