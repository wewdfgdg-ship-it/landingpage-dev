/**
 * 슬립웰 히어로 v2 — 배경 제거 + HTML 조립
 * 실행: npx tsx scripts/build-slipwell-hero-v2.ts
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function generateImage(prompt: string, label: string): Promise<Buffer> {
  console.log(`🎨 ${label} 생성 중...`);
  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { responseModalities: ['image', 'text'] },
  });
  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part?.inlineData) throw new Error(`${label} 실패`);
  console.log(`   ✅ ${label} 완료`);
  return Buffer.from(part.inlineData.data!, 'base64');
}

/** 흰색/밝은 배경을 투명으로 변환 */
async function removeWhiteBg(inputBuf: Buffer, threshold: number = 240): Promise<Buffer> {
  const { data, info } = await sharp(inputBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    // 밝은 픽셀(흰색/연회색)을 투명으로
    if (r >= threshold && g >= threshold && b >= threshold) {
      pixels[i + 3] = 0; // alpha = 0
    }
    // 경계 부드럽게 (anti-alias)
    else if (r >= threshold - 20 && g >= threshold - 20 && b >= threshold - 20) {
      const avg = (r + g + b) / 3;
      const alpha = Math.round(255 * (1 - (avg - (threshold - 20)) / 20));
      pixels[i + 3] = Math.min(pixels[i + 3], alpha);
    }
  }

  return sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();
}

async function main(): Promise<void> {
  // 이미 생성된 이미지가 있으면 재사용
  let modelBuf: Buffer;
  let productBuf: Buffer;

  if (existsSync('scripts/cutout-model-product.png') && existsSync('scripts/cutout-mattress.png')) {
    console.log('📦 기존 이미지 재사용');
    modelBuf = readFileSync('scripts/cutout-model-product.png');
    productBuf = readFileSync('scripts/cutout-mattress.png');
  } else {
    modelBuf = await generateImage(
      `A Korean man in his early 30s wearing a black turtleneck sweater, hugging a large white premium pillow against his chest with both arms, looking directly at camera with a calm confident expression. Half body shot from waist up.
Isolated figure on pure white background. No background elements, no shadows on ground. Clean studio cutout style.
High quality, professional studio photography, Korean premium e-commerce advertising style.`,
      '인물'
    );
    productBuf = await generateImage(
      `A premium white mattress shown from a 3/4 side angle, revealing the internal layers (memory foam, pocket spring, cooling gel layer). Clean product photography on pure white background.
Isolated product, no background, no floor, no shadows. Clean cutout.
High quality studio product shot, e-commerce style.`,
      '매트리스'
    );
    writeFileSync('scripts/cutout-model-product.png', modelBuf);
    writeFileSync('scripts/cutout-mattress.png', productBuf);
  }

  // 배경 제거
  console.log('🔧 인물 배경 제거 중...');
  const modelTransparent = await removeWhiteBg(modelBuf, 235);
  writeFileSync('scripts/model-transparent.png', modelTransparent);
  console.log(`   ✅ 완료 (${Math.round(modelTransparent.length / 1024)}KB)`);

  console.log('🔧 매트리스 배경 제거 중...');
  const productTransparent = await removeWhiteBg(productBuf, 240);
  writeFileSync('scripts/mattress-transparent.png', productTransparent);
  console.log(`   ✅ 완료 (${Math.round(productTransparent.length / 1024)}KB)`);

  const modelB64 = modelTransparent.toString('base64');
  const productB64 = productTransparent.toString('base64');

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SlipWell — 수면 전문가가 선택한 매트리스</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Noto Sans KR',-apple-system,sans-serif;-webkit-font-smoothing:antialiased;margin:0;}
img{max-width:100%;height:auto;display:block;}
</style>
</head>
<body>

<section style="
  position:relative;
  min-height:100vh;
  background:#6B8F7B;
  color:#FFFFFF;
  overflow:hidden;
  padding:0;
">
  <!-- 레이어 2: 텍스트 -->
  <div style="
    position:relative;
    z-index:2;
    padding:80px 0 80px 60px;
    max-width:520px;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
  ">
    <span style="display:inline-block;width:fit-content;padding:6px 18px;border:1.5px solid rgba(255,255,255,0.45);border-radius:999px;font-size:11px;font-weight:600;letter-spacing:0.12em;color:rgba(255,255,255,0.8);margin-bottom:28px;text-transform:uppercase;">PREMIUM SLEEP</span>

    <p style="font-size:36px;font-weight:800;letter-spacing:-0.01em;margin-bottom:12px;color:#FFFFFF;line-height:1.2;">SlipWell</p>

    <h1 style="font-size:clamp(36px,5.5vw,52px);font-weight:900;line-height:1.2;letter-spacing:-0.03em;color:#FFFFFF;margin:0;">수면 전문가가 선택한</h1>
    <h1 style="font-size:clamp(36px,5.5vw,52px);font-weight:900;line-height:1.2;letter-spacing:-0.03em;color:#FFFFFF;margin:0 0 40px 0;white-space:nowrap;">턱! 소리나는 매트리스</h1>

    <div style="width:1.5px;height:120px;background:rgba(255,255,255,0.2);"></div>
  </div>

  <!-- 레이어 3: 인물 컷아웃 (투명 PNG) -->
  <div style="position:absolute;bottom:0;right:5%;z-index:3;width:45%;max-width:480px;display:flex;align-items:flex-end;justify-content:center;">
    <img src="data:image/png;base64,${modelB64}" alt="모델" style="width:100%;object-fit:contain;">
  </div>

  <!-- 레이어 4: 제품 (투명 PNG) -->
  <div style="position:absolute;bottom:40px;left:60px;z-index:4;width:220px;">
    <img src="data:image/png;base64,${productB64}" alt="매트리스" style="width:100%;">
  </div>
</section>

</body>
</html>`;

  writeFileSync('scripts/test-slipwell-hero-v2.html', html, 'utf-8');
  console.log('\n✅ scripts/test-slipwell-hero-v2.html 생성 완료');
}

main().catch((e) => {
  console.error('❌ 에러:', e.message);
  process.exit(1);
});
