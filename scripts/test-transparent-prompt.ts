/**
 * 투명 배경 이미지 프롬프트 테스트
 * 실행: npx tsx scripts/test-transparent-prompt.ts
 */
import { writeFileSync } from 'fs';
import { GoogleGenAI } from '@google/genai';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function gen(prompt: string, filename: string): Promise<void> {
  console.log(`🎨 ${filename}...`);
  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { responseModalities: ['image', 'text'] },
  });
  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part?.inlineData) { console.log(`   ❌ 실패`); return; }
  const buf = Buffer.from(part.inlineData.data!, 'base64');
  writeFileSync(`scripts/${filename}`, buf);
  console.log(`   ✅ ${Math.round(buf.length / 1024)}KB, mime: ${part.inlineData.mimeType}`);
}

async function main(): Promise<void> {
  // 시도 1: transparent background 강조
  await gen(
    `Generate a PNG image with TRANSPARENT background (alpha channel).
A Korean man in his 30s wearing black turtleneck, hugging a white pillow. Half body shot.
The background MUST be completely transparent, not white. Output as PNG with alpha transparency.
Professional studio photography style, clean edges, no background at all.`,
    'test-transparent-1.png'
  );

  // 시도 2: green screen 방식
  await gen(
    `A Korean man in his 30s wearing black turtleneck sweater, hugging a white premium pillow, looking at camera with confident smile. Half body from waist up.
Place the person on a solid bright green (#00FF00) chroma key background. The background must be perfectly uniform #00FF00 green with no variations.
Professional studio photo, sharp edges between person and green background.`,
    'test-greenscreen.png'
  );

  // 시도 3: 배경을 세이지 그린으로 직접 지정
  await gen(
    `A Korean man in his 30s wearing black turtleneck sweater, hugging a white premium pillow against his chest, looking at camera with calm confident expression. Half body shot from waist up.
Background: solid flat color #6B8F7B (muted sage green). The entire background must be exactly this color #6B8F7B with no gradients, no shadows, no floor.
Professional Korean e-commerce advertising photography. Studio lighting from upper right.`,
    'test-saggreen-bg.png'
  );

  console.log('\n✅ scripts/ 폴더에서 3개 이미지 확인');
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
