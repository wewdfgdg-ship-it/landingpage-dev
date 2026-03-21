// 파이프라인 테스트 — 인자로 실행 (Gemini 이미지 생성 + rembg 포함)
// npx tsx scripts/test-hero-run.ts "제품명" "업종" "핵심가치" "USP1,USP2" "가격" "할인" "성향"

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { config } from 'dotenv';
import { runHeaderBanner } from '../src/engine/sections/01-header-banner/index';
import { renderHeroBanner } from '../src/engine/sections/01-header-banner/render';
import { getMoodStyles } from '../src/engine/sections/01-header-banner/moods';
import type { SectionAgentInput } from '../src/engine/sections/types';
import type { ProductBrief } from '../src/engine/01-product-intelligence/types';
import type { LayoutData } from '../src/engine/sections/01-header-banner/render';

config({ path: resolve('.env') });

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY not found in .env');
const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${GEMINI_KEY}`;

const [,, productName, industry, coreValue, uspRaw, price, discount, decisionType] = process.argv;

if (!productName || !industry || !coreValue) {
  console.log('사용법: npx tsx scripts/test-hero-run.ts "제품명" "업종" "핵심가치" "USP1,USP2" "가격" "할인" "성향"');
  process.exit(1);
}

const usps = (uspRaw ?? '').split(',').map(s => s.trim()).filter(Boolean);
const slug = productName.replace(/\s+/g, '-');

// ── Gemini 이미지 생성 ──
async function callGemini(prompt: string): Promise<string> {
  console.log('  Gemini 호출 중...');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'], imageConfig: { aspectRatio: '1:1' } },
    }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const chunks = JSON.parse(await res.text());
  for (const c of (Array.isArray(chunks) ? chunks : [chunks]))
    for (const p of (c?.candidates?.[0]?.content?.parts || []))
      if (p.inlineData?.data) return p.inlineData.data as string;
  throw new Error('No image in Gemini response');
}

// ── rembg + crop (한글 경로 안전) ──
function postProcess(rawPath: string, outPath: string): void {
  console.log('  rembg 누끼 + 크롭 중...');
  // 한글 경로 문제를 피하기 위해 Python 스크립트를 임시 파일로 작성
  const scriptPath = resolve('test-output/hero-cli/_rembg.py');
  const pyScript = `
import sys
from rembg import remove
from PIL import Image
import numpy as np, io

raw_path = sys.argv[1]
out_path = sys.argv[2]

with open(raw_path, 'rb') as f:
    data = f.read()
result = remove(data)
img = Image.open(io.BytesIO(result)).convert('RGBA')
arr = np.array(img)
alpha = arr[:,:,3]
rows = np.any(alpha > 0, axis=1)
cols = np.any(alpha > 0, axis=0)
r0, r1 = np.where(rows)[0][[0,-1]]
c0, c1 = np.where(cols)[0][[0,-1]]
cropped = img.crop((c0, r0, c1+1, r1+1))
cropped.save(out_path, 'PNG')
print(f'  {img.size} -> {cropped.size}')
`;
  writeFileSync(scriptPath, pyScript);
  execSync(`python "${scriptPath}" "${rawPath}" "${outPath}"`, { timeout: 60000, stdio: 'inherit' });
}

async function main(): Promise<void> {
  // Brief 생성
  const brief: ProductBrief = {
    productDNA: { coreValue, usp: usps, positioning: '프리미엄', valueHierarchy: { functional: coreValue, emotional: '만족', social: '트렌드' } },
    customerDesire: { surface: '편리함', real: '시간 절약', hidden: '인정' },
    customerFear: { problem: { level: 3, reason: '' }, opportunity: { level: 2, reason: '' }, social: { level: 2, reason: '' } },
    resistanceMap: { price: { level: 2, reason: '' }, trust: { level: 2, reason: '' }, need: { level: 1, reason: '' }, urgency: { level: 2, reason: '' }, complexity: { level: 1, reason: '' } },
    decisionType: (decisionType || 'impulse') as ProductBrief['decisionType'],
    marketContext: { competitionLevel: 'medium' as const, priceSensitivity: 'medium' as const, purchaseCycle: 'monthly' as const, decisionTime: '1_day' as const, primaryChannel: 'online' as const },
    confidenceScore: 85,
  };

  // 엔진 실행
  const input: SectionAgentInput = {
    sectionKey: 'HEADER_BANNER', order: 1, productName, industry, brief,
    strategyHint: '', tone: 'confident', targetEmotion: 'desire',
  };

  const output = runHeaderBanner(input);
  const v4 = output.v4Meta!;
  const moodInfo = getMoodStyles(v4.mood as never, v4.brandColor);

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║          엔진 자동 결정 결과           ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`  레이아웃:  ${v4.layoutId}`);
  console.log(`  무드:      ${v4.mood}`);
  console.log(`  폰트셋:    ${v4.fontSet}`);
  console.log(`  브랜드색:   ${v4.brandColor}`);
  console.log(`  shadow:    ${moodInfo.productShadow.substring(0, 70)}...`);
  console.log(`  씬:        ${moodInfo.sceneDirection}`);

  // 출력 디렉토리
  const outDir = resolve(`test-output/hero-cli/${slug}`);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  // ── 이미지 생성 ──
  console.log('\n── 이미지 생성 ──');
  let productImgPath = 'product.png';
  try {
    const imgBase64 = await callGemini(output.imagePrompt);
    const rawPath = resolve(outDir, 'raw.png');
    writeFileSync(rawPath, Buffer.from(imgBase64, 'base64'));
    console.log('  ✅ Gemini 이미지 생성 완료');

    const finalPath = resolve(outDir, 'product.png');
    postProcess(rawPath, finalPath);
    productImgPath = 'product.png';
    console.log('  ✅ 누끼 + 크롭 완료');
  } catch (e) {
    console.log(`  ❌ 이미지 실패: ${(e as Error).message}`);
  }

  // ── HTML 생성 ──
  console.log('\n── HTML 생성 ──');
  const layoutData: LayoutData = {
    layoutId: v4.layoutId as LayoutData['layoutId'],
    mood: v4.mood as LayoutData['mood'],
    fontSet: v4.fontSet as LayoutData['fontSet'],
    brandColor: v4.brandColor,
    productName,
    eyebrow: industry,
    headline: output.copy.headline,
    subheadline: output.copy.subheadline,
    desc: output.copy.body,
    stats: usps.slice(0, 3).map(u => ({ number: '', unit: '', label: u })),
    awards: [],
    ctaText: output.copy.ctaText,
    microCopy: output.copy.microCopy,
    price: price || undefined,
    discount: discount || undefined,
    imageUrl: productImgPath,
  };

  const html = renderHeroBanner(layoutData);
  const outPath = resolve(outDir, 'index.html');
  writeFileSync(outPath, html);

  console.log(`  ✅ HTML 생성 완료`);
  console.log(`\n📁 file:///${outDir.replace(/\\/g, '/')}`);
  console.log(`🌐 file:///${outPath.replace(/\\/g, '/')}`);
}

main().catch(console.error);
