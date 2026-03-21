import Anthropic from '@anthropic-ai/sdk';
import type { AIResponse } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const MODEL = 'claude-sonnet-4-20250514';

// Claude Sonnet 4 pricing (USD per 1M tokens)
const INPUT_COST_PER_M = 3.0;
const OUTPUT_COST_PER_M = 15.0;

const MAX_RETRIES = 2;

/**
 * AI가 생성한 malformed JSON을 복구 시도
 */
function repairJson(str: string): string {
  let s = str;

  // trailing commas: ,} → } / ,] → ]
  s = s.replace(/,\s*([\]}])/g, '$1');

  // 누락된 쉼표 패턴들
  s = s.replace(/(")\s*\n\s*(")/g, '$1,\n$2');
  s = s.replace(/(})\s*\n\s*(")/g, '$1,\n$2');
  s = s.replace(/(])\s*\n\s*(")/g, '$1,\n$2');
  s = s.replace(/(})\s*\n\s*(\{)/g, '$1,\n$2');
  s = s.replace(/(\d)\s*\n\s*(")/g, '$1,\n$2');
  s = s.replace(/(true|false|null)\s*\n\s*(")/g, '$1,\n$2');

  // 제어문자 제거
  s = s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');

  return s;
}

function extractJson(text: string): string {
  let jsonStr = text.trim();

  // ```json ... ``` 또는 ``` ... ``` 블록 추출
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // 앞뒤 설명 텍스트 제거
  if (!jsonStr.startsWith('{') && !jsonStr.startsWith('[')) {
    const startIdx = Math.min(
      jsonStr.indexOf('{') >= 0 ? jsonStr.indexOf('{') : Infinity,
      jsonStr.indexOf('[') >= 0 ? jsonStr.indexOf('[') : Infinity,
    );
    if (startIdx !== Infinity) {
      jsonStr = jsonStr.substring(startIdx);
    }
  }
  if (!jsonStr.endsWith('}') && !jsonStr.endsWith(']')) {
    const endIdx = Math.max(jsonStr.lastIndexOf('}'), jsonStr.lastIndexOf(']'));
    if (endIdx >= 0) {
      jsonStr = jsonStr.substring(0, endIdx + 1);
    }
  }

  return jsonStr;
}

function parseJsonSafe<T>(text: string): T {
  const jsonStr = extractJson(text);

  // 1차: 원본 파싱
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    // 2차: repair 후 파싱
    const repaired = repairJson(jsonStr);
    try {
      console.warn('[askClaude] JSON repair 적용');
      return JSON.parse(repaired) as T;
    } catch (e2) {
      const errPos = e2 instanceof SyntaxError
        ? e2.message.match(/position (\d+)/)?.[1]
        : undefined;
      console.error('[askClaude] JSON 파싱 실패, 위치:', errPos);
      if (errPos) {
        const pos = parseInt(errPos);
        console.error('[askClaude] 주변:', repaired.substring(Math.max(0, pos - 80), pos + 80));
      }
      throw e2;
    }
  }
}

export async function askClaude<T>(
  systemPrompt: string,
  userMessage: string,
): Promise<AIResponse<T>> {
  let lastError: Error | null = null;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalLatencyMs = 0;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const start = Date.now();

    // Anthropic JSON prefill 기법:
    // assistant 메시지를 '{'로 시작시켜 AI가 순수 JSON만 이어서 생성하게 함
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage },
        { role: 'assistant', content: '{' },
      ],
    });

    const latencyMs = Date.now() - start;
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;

    totalInputTokens += inputTokens;
    totalOutputTokens += outputTokens;
    totalLatencyMs += latencyMs;

    const rawText =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // prefill '{' + AI 응답을 합쳐서 완전한 JSON 생성
    const text = '{' + rawText;

    try {
      const data = parseJsonSafe<T>(text);

      const cost =
        (totalInputTokens / 1_000_000) * INPUT_COST_PER_M +
        (totalOutputTokens / 1_000_000) * OUTPUT_COST_PER_M;

      if (attempt > 0) {
        console.warn(`[askClaude] ${attempt + 1}번째 시도에서 성공`);
      }

      return { data, model: MODEL, inputTokens: totalInputTokens, outputTokens: totalOutputTokens, cost, latencyMs: totalLatencyMs };
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < MAX_RETRIES) {
        console.warn(`[askClaude] JSON 파싱 실패, 재시도 ${attempt + 1}/${MAX_RETRIES}`);
      }
    }
  }

  throw new Error(`AI 응답 JSON 파싱 실패 (${MAX_RETRIES + 1}회 시도): ${lastError?.message}`);
}
