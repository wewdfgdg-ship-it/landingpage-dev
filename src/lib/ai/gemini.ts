import { GoogleGenAI } from '@google/genai';
import type { GeneratedImageResult } from './types';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY must be set');
}

const genai = new GoogleGenAI({ apiKey: geminiApiKey });

const IMAGE_MODEL = 'gemini-2.0-flash-exp';

export async function generateImage(
  prompt: string,
  referenceImageBase64?: string,
): Promise<GeneratedImageResult> {
  const contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

  // 레퍼런스 이미지 (제품 사진)
  if (referenceImageBase64) {
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: referenceImageBase64,
      },
    });
  }

  contents.push({ text: prompt });

  const response = await genai.models.generateContent({
    model: IMAGE_MODEL,
    contents: [{ role: 'user', parts: contents }],
    config: {
      responseModalities: ['image', 'text'],
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData,
  );

  if (!part?.inlineData) {
    throw new Error('이미지 생성 실패: 응답에 이미지가 없습니다');
  }

  return {
    imageData: Buffer.from(part.inlineData.data ?? '', 'base64'),
    mimeType: part.inlineData.mimeType ?? 'image/jpeg',
    prompt,
    model: IMAGE_MODEL,
    cost: 0.04, // 예상 비용
  };
}
