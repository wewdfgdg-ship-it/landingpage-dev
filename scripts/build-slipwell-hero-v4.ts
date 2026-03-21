/**
 * 슬립웰 히어로 v4 — 그린스크린 → 배경 제거 → 투명 PNG
 */
import { writeFileSync, readFileSync } from 'fs';
const BG_COLOR = '#6B8F7B';

async function gen(prompt: string, label: string): Promise<Buffer> {
  console.log(`🎨 ${label}...`);
  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { responseModalities: ['image', 'text'] },
  });
  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part?.inlineData) throw new Error(`${label} 실패`);
  console.log(`   ✅ ${label} 생성 완료`);
  return Buffer.from(part.inlineData.data!, 'base64');
}

/** 그린스크린(#00FF00 계열) 배경을 투명으로 변환 */
async function chromaKey(inputBuf: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(inputBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // 초록색 판별: G가 높고, R과 B가 낮은 픽셀
    const isGreen = g > 100 && g > r * 1.3 && g > b * 1.3;

    if (isGreen) {
      pixels[i + 3] = 0; // 완전 투명
    }
    // 경계 anti-alias (초록 기운이 약간 있는 픽셀)
    else if (g > 80 && g > r * 1.1 && g > b * 1.1) {
      const greenness = (g - Math.max(r, b)) / g;
      const alpha = Math.round(255 * (1 - greenness));
      pixels[i + 3] = Math.min(pixels[i + 3], Math.max(alpha, 0));
      // 초록 잔상 제거 (de-spill)
      pixels[i + 1] = Math.round(Math.max(r, b) * 0.8 + g * 0.2);
    }
  }

  return sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();
}

async function main(): Promise<void> {
  // 기존 투명 PNG 재사용
  console.log('📦 기존 투명 PNG 재사용');
  const modelTransparent = readFileSync('scripts/transparent-model.png');
  const productTransparent = readFileSync('scripts/transparent-mattress.png');

  const modelB64 = modelTransparent.toString('base64');
  const productB64 = productTransparent.toString('base64');

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SlipWell — v4 크로마키</title>
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
  display:flex;
  align-items:center;
  justify-content:center;
">
  <!-- 중앙 컨테이너: 텍스트(좌) + 인물(우) 수평 정렬 -->
  <div style="
    display:flex;
    align-items:center;
    justify-content:center;
    width:100%;
    max-width:1200px;
    padding:40px 60px;
    gap:0;
  ">
    <!-- 좌측: 텍스트 -->
    <div style="flex:1;z-index:2;min-width:400px;">
      <span style="display:inline-block;width:fit-content;padding:6px 18px;border:1.5px solid rgba(255,255,255,0.45);border-radius:999px;font-size:11px;font-weight:600;letter-spacing:0.12em;color:rgba(255,255,255,0.8);margin-bottom:28px;text-transform:uppercase;">PREMIUM SLEEP</span>
      <p style="font-size:36px;font-weight:800;letter-spacing:-0.01em;margin-bottom:12px;line-height:1.2;">SlipWell</p>
      <h1 style="font-size:clamp(36px,5.5vw,52px);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin:0;">수면 전문가가 선택한</h1>
      <h1 style="font-size:clamp(36px,5.5vw,52px);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin:0 0 40px 0;white-space:nowrap;">턱! 소리나는 매트리스</h1>
      <div style="width:1.5px;height:120px;background:rgba(255,255,255,0.2);"></div>
    </div>

    <!-- 우측: 인물 (투명 PNG) -->
    <div style="flex:1;display:flex;align-items:center;justify-content:center;z-index:3;min-width:300px;">
      <img src="data:image/png;base64,${modelB64}" alt="모델" style="max-height:80vh;object-fit:contain;">
    </div>
  </div>

  <!-- 제품 (좌측 하단, 투명 PNG) -->
  <div style="position:absolute;bottom:40px;left:60px;z-index:4;width:220px;">
    <img src="data:image/png;base64,${productB64}" alt="매트리스" style="width:100%;">
  </div>
</section>

</body>
</html>`;

  writeFileSync('scripts/test-slipwell-hero-v4.html', html, 'utf-8');
  console.log('\n✅ scripts/test-slipwell-hero-v4.html 생성 완료');
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
