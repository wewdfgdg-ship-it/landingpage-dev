/**
 * 슬립웰 히어로 v3 — 배경색 매칭 방식
 * 실행: npx tsx scripts/build-slipwell-hero-v3.ts
 */
import { writeFileSync } from 'fs';
import { GoogleGenAI } from '@google/genai';

const BG_COLOR = '#6B8F7B';
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function gen(prompt: string, label: string): Promise<Buffer> {
  console.log(`🎨 ${label}...`);
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

async function main(): Promise<void> {
  const modelBuf = await gen(
    `A Korean man in his 30s wearing black turtleneck sweater, hugging a white premium pillow against his chest, looking at camera with calm confident expression. Half body shot from waist up.
Background: solid flat color ${BG_COLOR} (muted sage green). The entire background must be exactly this uniform color with no gradients, no shadows, no floor, no objects.
Professional Korean e-commerce advertising photography. Studio lighting from upper right. High quality.`,
    '인물 (세이지 그린 배경)'
  );

  const productBuf = await gen(
    `A premium white mattress shown from a 3/4 angle, revealing internal layers (memory foam, pocket springs, cooling gel). Product looks thick and luxurious.
Background: solid flat color ${BG_COLOR} (muted sage green). The entire background must be exactly this uniform color with no gradients, no shadows, no floor.
High quality studio product photography, e-commerce style.`,
    '매트리스 (세이지 그린 배경)'
  );

  const modelB64 = modelBuf.toString('base64');
  const productB64 = productBuf.toString('base64');

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
  background:${BG_COLOR};
  color:#FFFFFF;
  overflow:hidden;
  padding:0;
">
  <!-- 텍스트 -->
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
    <p style="font-size:36px;font-weight:800;letter-spacing:-0.01em;margin-bottom:12px;line-height:1.2;">SlipWell</p>
    <h1 style="font-size:clamp(36px,5.5vw,52px);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin:0;">수면 전문가가 선택한</h1>
    <h1 style="font-size:clamp(36px,5.5vw,52px);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin:0 0 40px 0;white-space:nowrap;">턱! 소리나는 매트리스</h1>
    <div style="width:1.5px;height:120px;background:rgba(255,255,255,0.2);"></div>
  </div>

  <!-- 인물 (배경색 매칭 → 자연스럽게 녹아듦) -->
  <div style="position:absolute;bottom:0;right:5%;z-index:3;width:45%;max-width:480px;display:flex;align-items:flex-end;justify-content:center;">
    <img src="data:image/png;base64,${modelB64}" alt="모델" style="width:100%;object-fit:contain;">
  </div>

  <!-- 제품 (배경색 매칭) -->
  <div style="position:absolute;bottom:40px;left:60px;z-index:4;width:220px;">
    <img src="data:image/png;base64,${productB64}" alt="매트리스" style="width:100%;">
  </div>
</section>

</body>
</html>`;

  writeFileSync('scripts/test-slipwell-hero-v3.html', html, 'utf-8');
  console.log('\n✅ scripts/test-slipwell-hero-v3.html 생성 완료');
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
