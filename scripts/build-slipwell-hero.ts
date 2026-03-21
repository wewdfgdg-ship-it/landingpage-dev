/**
 * 슬립웰 매트리스 — Denps 스타일 히어로 (AI 컷아웃 생성 + HTML 조립)
 * 실행: npx tsx scripts/build-slipwell-hero.ts
 */
import { writeFileSync } from 'fs';
import { GoogleGenAI } from '@google/genai';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function generateImage(prompt: string, label: string): Promise<Buffer> {
  console.log(`🎨 ${label} 생성 중...`);
  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { responseModalities: ['image', 'text'] },
  });
  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part?.inlineData) throw new Error(`${label} 이미지 생성 실패`);
  const buf = Buffer.from(part.inlineData.data!, 'base64');
  console.log(`   ✅ ${label} 완료 (${Math.round(buf.length / 1024)}KB)`);
  return buf;
}

async function main(): Promise<void> {
  // 1) 인물 컷아웃 생성
  const modelBuf = await generateImage(
    `A Korean man in his early 30s wearing a black turtleneck sweater, hugging a large white premium pillow against his chest with both arms, looking directly at camera with a calm confident expression. Half body shot from waist up.
Isolated figure on pure white background. No background elements, no shadows on ground, no floor visible. Clean studio cutout style.
High quality, professional studio photography, Korean premium e-commerce advertising style. Soft studio lighting from upper right.`,
    '인물 컷아웃'
  );

  // 2) 제품 컷아웃 생성
  const productBuf = await generateImage(
    `A premium white mattress shown from a 3/4 side angle, revealing the internal layers (memory foam, pocket spring, cooling gel layer). Clean product photography on pure white background.
Isolated product, no background, no floor, no shadows. Clean cutout style.
High quality studio product shot, e-commerce style. The mattress should look thick and luxurious with visible layer details.`,
    '매트리스 제품'
  );

  const modelB64 = modelBuf.toString('base64');
  const productB64 = productBuf.toString('base64');

  // 3) HTML 조립 — Denps 구조 그대로, 텍스트/이미지만 슬립웰로 변경
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

  <!-- 레이어 2: 텍스트 영역 (좌측) -->
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
    <!-- 배지 -->
    <span style="
      display:inline-block;
      width:fit-content;
      padding:6px 18px;
      border:1.5px solid rgba(255,255,255,0.45);
      border-radius:999px;
      font-size:11px;
      font-weight:600;
      letter-spacing:0.12em;
      color:rgba(255,255,255,0.8);
      margin-bottom:28px;
      text-transform:uppercase;
    ">PREMIUM SLEEP</span>

    <!-- 브랜드명 -->
    <p style="
      font-size:36px;
      font-weight:800;
      letter-spacing:-0.01em;
      margin-bottom:12px;
      color:#FFFFFF;
      line-height:1.2;
    ">SlipWell</p>

    <!-- 헤드라인 1줄 -->
    <h1 style="
      font-size:clamp(36px, 5.5vw, 52px);
      font-weight:900;
      line-height:1.2;
      letter-spacing:-0.03em;
      color:#FFFFFF;
      margin:0;
    ">수면 전문가가 선택한</h1>

    <!-- 헤드라인 2줄 -->
    <h1 style="
      font-size:clamp(36px, 5.5vw, 52px);
      font-weight:900;
      line-height:1.2;
      letter-spacing:-0.03em;
      color:#FFFFFF;
      margin:0 0 40px 0;
      white-space:nowrap;
    ">턱! 소리나는 매트리스</h1>

    <!-- 세로 구분선 -->
    <div style="
      width:1.5px;
      height:120px;
      background:rgba(255,255,255,0.2);
      margin-left:0;
    "></div>
  </div>

  <!-- 레이어 3: 인물 컷아웃 (텍스트 위에 겹침) -->
  <div style="
    position:absolute;
    bottom:0;
    right:5%;
    z-index:3;
    width:45%;
    max-width:480px;
    display:flex;
    align-items:flex-end;
    justify-content:center;
  ">
    <img
      src="data:image/png;base64,${modelB64}"
      alt="슬립웰 모델"
      style="width:100%;object-fit:contain;mix-blend-mode:multiply;"
    >
  </div>

  <!-- 레이어 4: 제품 이미지 (최상위, 인물 앞) -->
  <div style="
    position:absolute;
    bottom:40px;
    left:60px;
    z-index:4;
    width:200px;
  ">
    <img
      src="data:image/png;base64,${productB64}"
      alt="슬립웰 매트리스"
      style="
        width:100%;
        border-radius:8px;
        mix-blend-mode:multiply;
      "
    >
  </div>

</section>

</body>
</html>`;

  writeFileSync('scripts/test-slipwell-hero.html', html, 'utf-8');
  console.log('\n✅ scripts/test-slipwell-hero.html 생성 완료');
  console.log('   브라우저에서 열어서 확인하세요');
}

main().catch((e) => {
  console.error('❌ 에러:', e.message);
  process.exit(1);
});
