/**
 * 크롤러 테스트 스크립트
 * 실행: npx tsx scripts/test-crawler.ts
 *
 * 단계별 테스트:
 * 1. Google Search API 연결 확인
 * 2. Playwright 스크린샷 테스트
 * 3. Gemini 섹션 감지 테스트
 */

import 'dotenv/config';

const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_SEARCH_CX;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

async function testGoogleSearch(): Promise<void> {
  process.stdout.write('\n=== 1. Google Search API 테스트 ===\n');

  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    process.stdout.write('❌ GOOGLE_SEARCH_API_KEY 또는 GOOGLE_SEARCH_CX 미설정\n');
    return;
  }

  const query = '화장품 스킨케어 헤더 배너 랜딩페이지';
  const params = new URLSearchParams({
    key: GOOGLE_API_KEY,
    cx: GOOGLE_CX,
    q: query,
    num: '5',
    lr: 'lang_ko',
  });

  process.stdout.write(`검색어: "${query}"\n`);

  const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);

  if (!res.ok) {
    const errBody = await res.text();
    process.stdout.write(`❌ API 오류 ${res.status}: ${errBody.substring(0, 200)}\n`);
    return;
  }

  const data = await res.json() as {
    searchInformation?: { totalResults?: string };
    items?: Array<{ link: string; title: string }>;
  };

  const total = data.searchInformation?.totalResults ?? '0';
  const items = data.items ?? [];

  process.stdout.write(`✅ 검색 성공 — 총 ${total}건, 반환 ${items.length}건\n`);
  for (const item of items) {
    process.stdout.write(`  → ${item.title}\n    ${item.link}\n`);
  }
}

async function testPlaywright(): Promise<void> {
  process.stdout.write('\n=== 2. Playwright 스크린샷 테스트 ===\n');

  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const testUrl = 'https://www.amorepacific.com';
    process.stdout.write(`대상: ${testUrl}\n`);

    await page.goto(testUrl, { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.title();

    const screenshot = await page.screenshot({ fullPage: true, type: 'jpeg', quality: 85 });
    const sizeKB = Math.round(screenshot.length / 1024);

    process.stdout.write(`✅ 스크린샷 성공 — 제목: "${title}", 크기: ${sizeKB}KB\n`);

    await browser.close();

    // 버퍼를 다음 테스트에서 사용
    return screenshot as unknown as void;
  } catch (err) {
    process.stdout.write(`❌ Playwright 오류: ${err instanceof Error ? err.message : err}\n`);
    process.stdout.write('   → npx playwright install chromium 실행 필요할 수 있음\n');
  }
}

async function testGeminiVision(): Promise<void> {
  process.stdout.write('\n=== 3. Gemini Vision 섹션 감지 테스트 ===\n');

  if (!GEMINI_KEY) {
    process.stdout.write('❌ GEMINI_API_KEY 미설정\n');
    return;
  }

  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await page.goto('https://www.amorepacific.com', { waitUntil: 'networkidle', timeout: 30000 });

    // 페이지 높이
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'jpeg',
      quality: 85,
      clip: pageHeight > 5000 ? { x: 0, y: 0, width: 1440, height: 5000 } : undefined,
    });
    await browser.close();

    const base64 = Buffer.from(screenshot).toString('base64');
    process.stdout.write(`스크린샷: ${Math.round(screenshot.length / 1024)}KB, 높이: ${Math.min(pageHeight, 5000)}px\n`);

    // Gemini API 호출
    const { GoogleGenAI } = await import('@google/genai');
    const genai = new GoogleGenAI({ apiKey: GEMINI_KEY });

    const prompt = `이 웹페이지 스크린샷을 분석하여 각 섹션의 위치를 식별해주세요.

응답 형식 (순수 JSON만):
{
  "sections": [
    { "sectionType": "HEADER_BANNER", "confidence": 0.95, "y": 0, "height": 600, "description": "설명" }
  ],
  "pageDescription": "페이지 설명"
}

섹션 타입: HEADER_BANNER, HERO, KEY_FEATURES, BENEFITS, REVIEWS, FAQ, CTA, BRAND_STORY, FOOTER 등`;

    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64 } },
          { text: prompt },
        ],
      }],
      config: { responseMimeType: 'application/json' },
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const parsed = JSON.parse(rawText) as { sections?: Array<{ sectionType: string; confidence: number; y: number; height: number; description: string }>; pageDescription?: string };

    process.stdout.write(`✅ 섹션 감지 성공 — ${parsed.sections?.length ?? 0}개 섹션 발견\n`);
    process.stdout.write(`   페이지: ${parsed.pageDescription ?? '?'}\n`);
    for (const s of parsed.sections ?? []) {
      process.stdout.write(`   → ${s.sectionType} (${Math.round(s.confidence * 100)}%) y:${s.y} h:${s.height} — ${s.description}\n`);
    }
  } catch (err) {
    process.stdout.write(`❌ Gemini 오류: ${err instanceof Error ? err.message : err}\n`);
  }
}

async function main(): Promise<void> {
  process.stdout.write('🔍 크롤러 테스트 시작\n');
  process.stdout.write(`환경변수: GOOGLE_API=${GOOGLE_API_KEY ? '✅' : '❌'} CX=${GOOGLE_CX ? '✅' : '❌'} GEMINI=${GEMINI_KEY ? '✅' : '❌'}\n`);

  await testGoogleSearch();
  await testPlaywright();
  await testGeminiVision();

  process.stdout.write('\n🏁 테스트 완료\n');
}

main().catch((e) => {
  process.stderr.write(`${e}\n`);
  process.exit(1);
});
