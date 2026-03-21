#!/usr/bin/env npx tsx
// ============================================================
// Hero 배너 테스트 CLI
// 사용법: npx tsx scripts/test-hero.ts
//
// 제품 정보 입력 → v4 엔진 자동 결정 → HTML 생성 + 이미지 프롬프트 출력
// ============================================================

import * as readline from 'node:readline';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { runHeaderBanner } from '../src/engine/sections/01-header-banner/index';
import { renderHeroBanner } from '../src/engine/sections/01-header-banner/render';
import { getMoodStyles } from '../src/engine/sections/01-header-banner/moods';
import type { SectionAgentInput } from '../src/engine/sections/types';
import type { ProductBrief } from '../src/engine/01-product-intelligence/types';
import type { LayoutData } from '../src/engine/sections/01-header-banner/render';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> => new Promise((res) => rl.question(q, res));

function makeBrief(
  coreValue: string,
  usps: string[],
  decisionType: string,
): ProductBrief {
  return {
    productDNA: {
      coreValue,
      usp: usps,
      positioning: '프리미엄',
      valueHierarchy: { functional: coreValue, emotional: '만족', social: '트렌드' },
    },
    customerDesire: { surface: '편리함', real: '시간 절약', hidden: '인정' },
    customerFear: {
      problem: { level: 3, reason: '불만' },
      opportunity: { level: 2, reason: '놓칠까' },
      social: { level: 2, reason: '뒤처짐' },
    },
    resistanceMap: {
      price: { level: 2, reason: '' },
      trust: { level: 2, reason: '' },
      need: { level: 1, reason: '' },
      urgency: { level: 2, reason: '' },
      complexity: { level: 1, reason: '' },
    },
    decisionType: decisionType as ProductBrief['decisionType'],
    marketContext: {
      competitionLevel: 'medium' as const,
      priceSensitivity: 'medium' as const,
      purchaseCycle: 'monthly' as const,
      decisionTime: '1_day' as const,
      primaryChannel: 'online' as const,
    },
    confidenceScore: 85,
  };
}

async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Hero Banner 테스트 CLI (v4 엔진)    ║');
  console.log('╚════════════════════════════════════════╝\n');

  // 입력 수집
  const productName = await ask('제품명: ');
  const industry = await ask('업종 (예: 뷰티 스킨케어, 식품, B2B SaaS): ');
  const coreValue = await ask('핵심 가치 (헤드라인 소스): ');
  const uspRaw = await ask('USP 3개 (쉼표 구분): ');
  const usps = uspRaw.split(',').map((s) => s.trim()).filter(Boolean);
  const price = await ask('가격 (없으면 엔터): ');
  const discount = await ask('할인율 (없으면 엔터): ');
  const decisionType = await ask('구매 성향 [impulse/analytical/cautious/follower] (기본 impulse): ') || 'impulse';
  const imageUrl = await ask('이미지 URL (없으면 엔터): ');

  rl.close();

  // Brief 생성
  const brief = makeBrief(coreValue, usps, decisionType);

  // 엔진 실행
  const input: SectionAgentInput = {
    sectionKey: 'HEADER_BANNER',
    order: 1,
    productName,
    industry,
    brief,
    strategyHint: '',
    tone: 'confident',
    targetEmotion: 'desire',
  };

  const output = runHeaderBanner(input);
  const v4 = output.v4Meta!;

  // 결과 출력
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║          엔진 자동 결정 결과           ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`  레이아웃: ${v4.layoutId}`);
  console.log(`  무드:     ${v4.mood}`);
  console.log(`  폰트셋:   ${v4.fontSet}`);
  console.log(`  브랜드색:  ${v4.brandColor}`);

  const moodInfo = getMoodStyles(v4.mood as never, v4.brandColor);
  console.log(`  shadow:   ${moodInfo.productShadow.substring(0, 60)}...`);
  console.log(`  씬:       ${moodInfo.sceneDirection.substring(0, 60)}...`);

  console.log('\n── 이미지 프롬프트 ──');
  console.log(output.imagePrompt);

  // HTML 생성
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
    stats: usps.slice(0, 3).map((u) => ({ number: '', unit: '', label: u })),
    awards: [],
    ctaText: output.copy.ctaText,
    microCopy: output.copy.microCopy,
    price: price || undefined,
    discount: discount || undefined,
    imageUrl: imageUrl || undefined,
  };

  const html = renderHeroBanner(layoutData);

  const outDir = resolve('test-output/hero-cli');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, 'index.html');
  writeFileSync(outPath, html);

  console.log(`\n✅ HTML 생성 완료`);
  console.log(`file:///${outPath.replace(/\\/g, '/')}`);
}

main().catch(console.error);
