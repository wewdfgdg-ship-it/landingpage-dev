/**
 * Gemini 배경 없는 인물 이미지 생성 테스트
 * 실행: npx tsx scripts/test-gemini-cutout.ts
 */
import { writeFileSync } from 'fs';
import { GoogleGenAI } from '@google/genai';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function generateCutoutImage(prompt: string, filename: string): Promise<void> {
  console.log(`\n🎨 생성 중: ${filename}`);
  console.log(`   프롬프트: ${prompt.slice(0, 80)}...`);

  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseModalities: ['image', 'text'],
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData,
  );

  if (!part?.inlineData) {
    console.log(`   ❌ 실패: 이미지 없음`);
    return;
  }

  const buffer = Buffer.from(part.inlineData.data!, 'base64');
  const ext = part.inlineData.mimeType?.includes('png') ? 'png' : 'jpg';
  const path = `scripts/${filename}.${ext}`;
  writeFileSync(path, buffer);
  console.log(`   ✅ 저장: ${path} (${Math.round(buffer.length / 1024)}KB)`);
}

async function main(): Promise<void> {
  // 테스트 1: 배경 없는 인물 (매트리스 관련)
  await generateCutoutImage(
    `A Korean woman in her 30s wearing comfortable pajamas, stretching happily after waking up, full body shot.
Isolated figure on pure white background, no background elements, no shadows on ground, clean cutout style.
High quality, professional studio photography, e-commerce product model style.`,
    'cutout-person'
  );

  // 테스트 2: 배경 없는 매트리스 제품
  await generateCutoutImage(
    `A premium white mattress, side angle view showing layers and thickness, clean product photography.
Isolated on pure white background, no background elements, no floor, no shadows, clean cutout.
High quality, professional studio product shot, e-commerce style.`,
    'cutout-mattress'
  );

  // 테스트 3: 인물 + 제품 조합
  await generateCutoutImage(
    `A Korean man in his 30s wearing a black turtleneck, holding a white premium mattress pillow, looking at camera with confident expression. Half body shot.
Isolated figure on pure white background, no background, no shadows, clean cutout style.
High quality, professional studio photography, Korean e-commerce advertising style.`,
    'cutout-model-product'
  );

  console.log('\n✅ 완료. scripts/ 폴더에서 이미지를 확인하세요.');
}

main().catch((e) => {
  console.error('❌ 에러:', e.message);
  process.exit(1);
});
