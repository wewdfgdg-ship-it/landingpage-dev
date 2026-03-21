/**
 * 르젠 체중계 스타일 히어로 — 슬립웰 매트리스 버전
 * 실행: npx tsx scripts/build-lezen-style.ts
 */
import { writeFileSync } from 'fs';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

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

async function chromaKey(inputBuf: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(inputBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = new Uint8Array(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    if (g > 100 && g > r * 1.3 && g > b * 1.3) {
      pixels[i + 3] = 0;
    } else if (g > 80 && g > r * 1.1 && g > b * 1.1) {
      const greenness = (g - Math.max(r, b)) / g;
      pixels[i + 3] = Math.min(pixels[i + 3], Math.max(Math.round(255 * (1 - greenness)), 0));
      pixels[i + 1] = Math.round(Math.max(r, b) * 0.8 + g * 0.2);
    }
  }
  return sharp(Buffer.from(pixels), { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function main(): Promise<void> {
  // 르젠 스타일: 여러 색상 제품이 벽에 기대어 진열된 구도
  // → 슬립웰: 여러 색상 매트리스가 벽에 기대어 진열
  const productBuf = await gen(
    `Multiple premium mattresses in different colors (white, light blue, pink, cream, dark gray) leaning against a light gray wall at various angles on a light gray floor. Studio product photography showing 5-6 mattresses arranged in a casual group display. Each mattress shows its side profile revealing internal layers. Clean minimalist studio setting with soft shadows.
Background: solid bright green #00FF00 chroma key. The entire background (wall and floor) must be #00FF00 green. Only the mattresses visible against the green.
High quality, professional Korean e-commerce product photography style.`,
    '매트리스 그룹샷 (그린스크린)'
  );

  console.log('🔧 크로마키 처리...');
  const productTransparent = await chromaKey(productBuf);
  writeFileSync('scripts/lezen-mattresses.png', productTransparent);
  console.log(`   ✅ 투명 PNG (${Math.round(productTransparent.length / 1024)}KB)`);

  const productB64 = productTransparent.toString('base64');

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SlipWell — 르젠 스타일</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Noto Sans KR',-apple-system,sans-serif;-webkit-font-smoothing:antialiased;margin:0;}
img{max-width:100%;height:auto;display:block;}
</style>
</head>
<body>

<section style="
  position:relative;
  width:100%;
  min-height:100vh;
  background:linear-gradient(180deg, #E8E4DF 0%, #D9D3CC 100%);
  overflow:hidden;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-start;
  padding:0;
">

  <!-- 상단 네비: 브랜드 + 슬로건 -->
  <div style="
    width:100%;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:28px 40px;
    position:relative;
    z-index:10;
  ">
    <span style="font-size:18px;font-weight:700;letter-spacing:0.08em;color:#3A3A3A;">SLIPWELL</span>
    <span style="font-size:12px;font-weight:400;color:#8A8A8A;letter-spacing:0.02em;">어떤 밤이든 완벽한 수면을 연구합니다.</span>
  </div>

  <!-- 중앙 텍스트 -->
  <div style="
    text-align:center;
    position:relative;
    z-index:10;
    margin-top:6vh;
    padding:0 24px;
  ">
    <h1 style="
      font-size:clamp(32px, 5.5vw, 52px);
      font-weight:800;
      line-height:1.3;
      letter-spacing:-0.02em;
      color:#2A2A2A;
      margin-bottom:8px;
    ">슬립웰 FLOW IN 7존</h1>
    <h1 style="
      font-size:clamp(32px, 5.5vw, 52px);
      font-weight:800;
      line-height:1.3;
      letter-spacing:-0.02em;
      color:#2A2A2A;
      margin-bottom:28px;
    ">초고속 체압분산 매트리스</h1>

    <p style="
      font-size:14px;
      font-weight:500;
      letter-spacing:0.15em;
      color:#6A6A6A;
      margin-bottom:6px;
    ">SLIPWELL PREMIUM EDITION</p>
    <p style="
      font-size:13px;
      font-weight:400;
      letter-spacing:0.1em;
      color:#9A9A9A;
    ">SW-M700</p>
  </div>

  <!-- 제품 이미지 (하단, 화면 가득) -->
  <div style="
    position:absolute;
    bottom:0;
    left:50%;
    transform:translateX(-50%);
    width:90%;
    max-width:900px;
    z-index:5;
    display:flex;
    align-items:flex-end;
    justify-content:center;
  ">
    <img
      src="data:image/png;base64,${productB64}"
      alt="슬립웰 매트리스 컬렉션"
      style="width:100%;object-fit:contain;"
    >
  </div>

</section>

</body>
</html>`;

  writeFileSync('scripts/test-lezen-style.html', html, 'utf-8');
  console.log('\n✅ scripts/test-lezen-style.html 생성 완료');
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
