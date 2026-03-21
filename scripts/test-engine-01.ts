/**
 * Engine ① Product Intelligence 단독 테스트
 * 실행: npx tsx scripts/test-engine-01.ts
 */

import 'dotenv/config';
import { runProductIntelligence } from '../src/engine/01-product-intelligence';
import type { ProductIntelligenceInput } from '../src/engine/01-product-intelligence';

const testInput: ProductIntelligenceInput = {
  basicInfo: {
    productName: '슬립마스터 베개',
    industry: '생활용품/침구',
    priceRange: '89,000원',
    pageGoal: '직접 구매',
    targetAudience: '수면 문제를 겪는 30~50대 직장인',
    competitorUrl: '',
  },
  images: [],
  deepAnswers: [
    {
      question: '이 제품의 고객은 주로 어떤 문제를 겪고 있나요?',
      answer: '목과 어깨 통증으로 잠을 제대로 못 자고, 아침에 일어나면 더 피곤한 상태입니다.',
    },
    {
      question: '경쟁 제품 대비 가장 다른 점은?',
      answer: '3D 인체공학 설계로 목뼈 C커브를 정확히 지지하며, 메모리폼+냉감젤 이중구조로 시원하게 잡니다.',
    },
    {
      question: '기존 고객이 가장 많이 하는 칭찬은?',
      answer: '베개 바꾸고 나서 아침에 개운하다, 목 통증이 사라졌다는 후기가 많습니다. 재구매율 40%입니다.',
    },
  ],
};

async function main() {
  console.log('🔍 Engine ① Product Intelligence 테스트 시작\n');
  console.log('입력:', testInput.basicInfo.productName);
  console.log('업종:', testInput.basicInfo.industry);
  console.log('심층 답변:', testInput.deepAnswers.length, '개\n');

  const start = Date.now();

  try {
    const result = await runProductIntelligence(testInput);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    console.log('✅ 성공! (' + elapsed + '초)\n');
    console.log('=== ProductBrief ===');
    console.log(JSON.stringify(result.brief, null, 2));
    console.log('\n=== 비용 ===');
    console.log('총 비용: $' + result.totalCost.toFixed(4), '(₩' + Math.round(result.totalCost * 1380) + ')');
    console.log('총 레이턴시:', result.totalLatencyMs + 'ms');
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.error('❌ 실패! (' + elapsed + '초)');
    console.error(err);
    process.exit(1);
  }
}

main();
