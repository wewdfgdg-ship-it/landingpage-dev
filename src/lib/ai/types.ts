/** AI 호출 공통 응답 */
export interface AIResponse<T> {
  data: T;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number; // USD
  latencyMs: number;
}

/** 이미지 생성 결과 */
export interface GeneratedImageResult {
  imageData: Buffer;
  mimeType: string;
  prompt: string;
  model: string;
  cost: number;
}
