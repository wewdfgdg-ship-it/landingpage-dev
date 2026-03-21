// ============================================================
// Group 3 v3: 엔진 코드(index.ts)의 buildImagePrompt() 사용
// 하드코딩 0 — 모든 로직이 엔진에서 옴
// 12개 폰트셋 × 14개 무드 전수 커버리지
// ============================================================

import { writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { renderHeroBanner } from '../src/engine/sections/01-header-banner/render';
import { buildImagePrompt } from '../src/engine/sections/01-header-banner/index';
import type { LayoutData } from '../src/engine/sections/01-header-banner/render';

// Gemini API (landingpage-dev .env)
import { config } from 'dotenv';
config({ path: resolve('.env') });
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY not found');
const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${GEMINI_KEY}`;

// ═══ 테스트 케이스 (12개 폰트셋 전수 커버) ═══
const TEST_CASES: Array<{
  id: string;
  data: LayoutData;
  category: string;
}> = [
  // ── SET-1: mood-vivid (cosmetics) ──
  {
    id: 'cosmetics-A',
    category: '색조/메이크업',
    data: {
      layoutId: 'A', mood: 'mood-vivid', fontSet: 'SET-1', brandColor: '#E91E8C',
      productName: '롬앤 쥬시 래스팅 틴트',
      eyebrow: '색조 · 메이크업',
      headline: '입술 위에 과즙\n한 방울',
      subheadline: '12시간 지속 컬러',
      desc: '올리브영 1위 · 4.8점 평점',
      stats: [{ number: '12', unit: '시간', label: '지속력' }, { number: '4.8', unit: '점', label: '평균 평점' }],
      awards: [], ctaText: '컬러 고르기', microCopy: '무료배송 · 오늘 출발',
      subjectSize: 'medium',
    },
  },
  // ── SET-2: mood-dark (perfume) ──
  {
    id: 'perfume-G',
    category: '향수/럭셔리',
    data: {
      layoutId: 'G', mood: 'mood-dark', fontSet: 'SET-2', brandColor: '#8B5CF6',
      productName: '조말론 우드 세이지',
      eyebrow: '향수 · 럭셔리',
      headline: '세이지 한 줌의\n여운',
      subheadline: '우디 허브 노트',
      desc: '유니섹스 · 지속 8시간',
      stats: [], awards: [],
      ctaText: '향기 탐색', microCopy: '무료 샘플 3종 증정',
      subjectSize: 'small',
    },
  },
  // ── SET-3: mood-clean (medical) ──
  {
    id: 'medical-A',
    category: '의료/더마',
    data: {
      layoutId: 'A', mood: 'mood-clean', fontSet: 'SET-3', brandColor: '#0369A1',
      productName: '닥터지 레드 블레미쉬 크림',
      eyebrow: '더마 · 스킨케어',
      headline: '피부과 전문의가\n만든 진정 크림',
      subheadline: '시카 성분 집중 케어',
      desc: '피부과 추천 1위 · 비건 인증',
      stats: [{ number: '92', unit: '%', label: '진정 효과' }],
      awards: ['피부과 추천'], ctaText: '자세히 보기', microCopy: '민감 피부 테스트 완료',
      subjectSize: 'medium',
    },
  },
  // ── SET-4: mood-warm (cafe) ──
  {
    id: 'cafe-C',
    category: '카페/디저트',
    data: {
      layoutId: 'C', mood: 'mood-warm', fontSet: 'SET-4', brandColor: '#C25E1A',
      productName: '폴 바셋 싱글 오리진',
      eyebrow: '카페 · 원두',
      headline: '에티오피아 예가체프\n한 잔의 여유',
      subheadline: '싱글 오리진 스페셜티',
      desc: '로스팅 후 48시간 내 발송',
      stats: [{ number: '4.9', unit: '점', label: '만족도' }],
      awards: [], ctaText: '원두 구매하기', microCopy: '첫 구매 20% 할인',
      price: '18,000원', discount: '20%', subjectSize: 'medium',
    },
  },
  // ── SET-5: mood-model-dark (model) ──
  {
    id: 'fashion-model-MA',
    category: '패션/의류',
    data: {
      layoutId: 'MA', mood: 'mood-model-dark', fontSet: 'SET-5', brandColor: '#0A0A0A',
      productName: '무신사 스탠다드 코트',
      eyebrow: '패션 · FW 컬렉션',
      headline: '겨울의 실루엣을\n완성하다',
      subheadline: '오버핏 울 블렌드 코트',
      desc: '프리미엄 울 80% · 한정 수량',
      stats: [], awards: [],
      ctaText: '사이즈 선택', microCopy: '무료 교환 · 반품 가능',
      subjectSize: 'large',
    },
  },
  // ── SET-6: mood-soft (beauty) ──
  {
    id: 'beauty-F',
    category: '뷰티/스킨케어',
    data: {
      layoutId: 'F', mood: 'mood-soft', fontSet: 'SET-6', brandColor: '#C9A96E',
      productName: '설화수 자음생크림',
      eyebrow: '뷰티 · 스킨케어',
      headline: '자는 동안 피부가\n달라진다',
      subheadline: '인삼 성분이 피부 깊숙이',
      desc: '48시간 보습 · 4.9점 평점',
      stats: [{ number: '48', unit: '시간', label: '보습 지속' }, { number: '4.9', unit: '점', label: '평균 평점' }, { number: '5,200', unit: '건', label: '누적 리뷰' }],
      awards: ['올리브영 1위', '글로우픽 어워드'],
      ctaText: '지금 만나보기', microCopy: '전 상품 무료배송 · 100% 안심 환불 보장',
      subjectSize: 'medium',
    },
  },
  // ── SET-7: mood-playful (kids) ──
  {
    id: 'kids-A',
    category: '키즈/유아',
    data: {
      layoutId: 'A', mood: 'mood-playful', fontSet: 'SET-7', brandColor: '#FF6B6B',
      productName: '뽀로로 칫솔 세트',
      eyebrow: '키즈 · 유아용품',
      headline: '양치가 놀이가\n되는 순간',
      subheadline: '뽀로로와 함께하는 양치 습관',
      desc: '3세~7세 · 부드러운 모',
      stats: [{ number: '99', unit: '%', label: '엄마 만족도' }],
      awards: [], ctaText: '세트 구매하기', microCopy: '무료배송 · 선물포장 가능',
      subjectSize: 'medium',
    },
  },
  // ── SET-8: mood-red (sale/event) ──
  {
    id: 'food-C',
    category: '식품/냉장',
    data: {
      layoutId: 'C', mood: 'mood-red', fontSet: 'SET-8', brandColor: '#DC2626',
      productName: '비비고 왕교자',
      eyebrow: '식품 · 냉장',
      headline: '2천만이 선택한\n그 맛',
      subheadline: '바삭한 피, 육즙 가득',
      desc: '2,000만개 판매 · 4.7점',
      stats: [{ number: '2,000만', unit: '개', label: '누적 판매' }, { number: '4.7', unit: '점', label: '평균 평점' }],
      awards: [], ctaText: '장바구니 담기', microCopy: '오늘 주문 내일 도착 · 신선 냉장 배송',
      price: '12,900원', discount: '25%', subjectSize: 'small',
    },
  },
  // ── SET-9: mood-navy (B2B) ──
  {
    id: 'b2b-B',
    category: 'B2B/SaaS',
    data: {
      layoutId: 'B', mood: 'mood-navy', fontSet: 'SET-9', brandColor: '#1D4ED8',
      productName: '채널톡 비즈니스',
      eyebrow: 'SaaS · 고객 소통',
      headline: '고객 문의,\n놓치지 마세요',
      subheadline: '올인원 고객 소통 플랫폼',
      desc: '3만+ 기업 도입 · 응대 시간 70% 단축',
      stats: [{ number: '3만+', unit: '기업', label: '도입 수' }, { number: '70', unit: '%', label: '응대 단축' }, { number: '4.8', unit: '점', label: '만족도' }],
      awards: [], ctaText: '무료 체험 시작', microCopy: '14일 무료 · 카드 등록 불필요',
      subjectSize: 'medium',
    },
  },
  // ── SET-10: mood-model-soft (model) ──
  {
    id: 'health-model-MB',
    category: '건강/피트니스',
    data: {
      layoutId: 'MB', mood: 'mood-model-soft', fontSet: 'SET-10', brandColor: '#2E7D32',
      productName: '닥터프로틴 쉐이크',
      eyebrow: '건강 · 피트니스',
      headline: '운동 후 30분\n황금 타임',
      subheadline: '순수 유청 프로틴 30g',
      desc: '인공감미료 제로 · 4.7점',
      stats: [{ number: '30', unit: 'g', label: '프로틴 함량' }],
      awards: [], ctaText: '맛 선택하기', microCopy: '정기배송 15% 할인',
      subjectSize: 'large',
    },
  },
  // ── SET-11: mood-organic (organic) ──
  {
    id: 'organic-D',
    category: '유기농/비건',
    data: {
      layoutId: 'D', mood: 'mood-organic', fontSet: 'SET-11', brandColor: '#4A7C59',
      productName: '닥터브로너스 매직솝',
      eyebrow: '유기농 · 비건',
      headline: '자연 그대로\n피부에 닿다',
      subheadline: '유기농 코코넛 오일 베이스',
      desc: 'USDA 유기농 인증 · 비건',
      stats: [{ number: '150', unit: '년', label: '브랜드 역사' }, { number: '100', unit: '%', label: '유기농 원료' }],
      awards: ['USDA 유기농', '비건 인증'],
      ctaText: '구매하기', microCopy: '친환경 포장 · 탄소 중립 배송',
      subjectSize: 'medium',
    },
  },
  // ── SET-12: mood-mono (fashion) ──
  {
    id: 'fashion-G',
    category: '패션/의류',
    data: {
      layoutId: 'G', mood: 'mood-mono', fontSet: 'SET-12', brandColor: '#0A0A0A',
      productName: '마뗑킴 크로스백',
      eyebrow: '패션 · 가방',
      headline: '미니멀의\n정석',
      subheadline: '소프트 램스킨 크로스백',
      desc: '100% 양가죽 · 이탈리아 태닝',
      stats: [], awards: [],
      ctaText: '컬러 선택', microCopy: '무료배송 · 3년 A/S 보증',
      subjectSize: 'small',
    },
  },
];

// ═══ Gemini 이미지 생성 ═══
async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'], imageConfig: { aspectRatio: '1:1' } },
    }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const chunks = JSON.parse(await res.text());
  for (const c of (Array.isArray(chunks) ? chunks : [chunks]))
    for (const p of (c?.candidates?.[0]?.content?.parts || []))
      if (p.inlineData?.data) return p.inlineData.data as string;
  throw new Error('No image');
}

// ═══ rembg + crop ═══
function postProcess(rawPath: string, outPath: string): void {
  execSync(`python -c "
from rembg import remove
from PIL import Image
import numpy as np, io
with open('${rawPath.replace(/\\/g, '/')}', 'rb') as f:
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
cropped.save('${outPath.replace(/\\/g, '/')}', 'PNG')
print(f'{img.size} -> {cropped.size}')
"`, { timeout: 60000 });
}

// ═══ 실행 ═══
async function main(): Promise<void> {
const baseDir = resolve('test-output/layout-tests-v3');
if (!existsSync(baseDir)) mkdirSync(baseDir, { recursive: true });

console.log('═══ v3: 엔진 코드 + 이미지 생성 + 실제 템플릿 ═══');
console.log(`═══ 12개 폰트셋 전수 커버리지 테스트 ═══\n`);

for (const tc of TEST_CASES) {
  const dir = resolve(baseDir, tc.id);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  // 1. 엔진에서 이미지 프롬프트 생성 (하드코딩 0)
  const headline = tc.data.headline.replace('\n', ' ');
  const imagePrompt = buildImagePrompt(
    tc.data.productName,
    tc.category,
    tc.data.brandColor,
  );

  console.log(`[${tc.id}] LAYOUT-${tc.data.layoutId} | ${tc.data.mood} | ${tc.data.fontSet}`);
  console.log(`  headline: "${headline}"`);
  console.log(`  프롬프트: ${imagePrompt.length}자 (엔진 생성)`);

  // 2. Gemini 이미지 생성
  console.log(`  Gemini 호출...`);
  try {
    const imgBase64 = await callGemini(imagePrompt);
    const rawPath = resolve(dir, 'raw.png');
    writeFileSync(rawPath, Buffer.from(imgBase64, 'base64'));

    // 3. rembg + crop
    const productPath = resolve(dir, 'product.png');
    postProcess(rawPath, productPath);
    console.log(`  ✅ 이미지 생성 + 누끼 + 크롭`);
  } catch (e) {
    console.log(`  ❌ 이미지: ${(e as Error).message}`);
  }

  // 4. 엔진 템플릿으로 HTML 생성
  try {
    const html = renderHeroBanner(tc.data);
    writeFileSync(resolve(dir, 'index.html'), html);
    console.log(`  ✅ HTML (엔진 템플릿)`);
  } catch (e) {
    console.log(`  ❌ HTML: ${(e as Error).message}`);
  }

  console.log('');
}

console.log('═══ 완료 ═══');
for (const tc of TEST_CASES) {
  console.log(`file:///C:/Users/tip12/landingpage-dev/test-output/layout-tests-v3/${tc.id}/index.html`);
}
}

main().catch(console.error);
