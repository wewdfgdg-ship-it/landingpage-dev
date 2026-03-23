import Anthropic from '@anthropic-ai/sdk';
import type { AIResponse } from './types';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY must be set');
}

const anthropic = new Anthropic({ apiKey });

const MODEL = 'claude-sonnet-4-20250514';

// Claude Sonnet 4 pricing (USD per 1M tokens)
const INPUT_COST_PER_M = 3.0;
const OUTPUT_COST_PER_M = 15.0;

export async function askClaude<T>(
  systemPrompt: string,
  userMessage: string,
): Promise<AIResponse<T>> {
  const start = Date.now();

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const latencyMs = Date.now() - start;
  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const cost =
    (inputTokens / 1_000_000) * INPUT_COST_PER_M +
    (outputTokens / 1_000_000) * OUTPUT_COST_PER_M;

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';

  // JSON 파싱 (여러 형식 시도)
  const jsonCodeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonArray = text.match(/\[[\s\S]*\]/);
  const jsonObject = text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonCodeBlock?.[1] ?? jsonArray?.[0] ?? jsonObject?.[0] ?? text;
  const data = JSON.parse(jsonStr.trim()) as T;

  return { data, model: MODEL, inputTokens, outputTokens, cost, latencyMs };
}
