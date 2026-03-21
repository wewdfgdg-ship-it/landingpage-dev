// ============================================================
// Group 3 검증: 업종별 4건 × 다른 레이아웃 자동 테스트
// Gemini 이미지 생성 + rembg + 15개 레이아웃 중 자동 선택
// ============================================================

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { config } from 'dotenv';

config({ path: resolve('.env') });
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY not found');

const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${GEMINI_KEY}`;

// ═══ 4개 업종 테스트 케이스 ═══
const TEST_CASES = [
  {
    id: 'beauty-F',
    productName: '설화수 자음생크림',
    industry: '뷰티/스킨케어',
    awards: ['올리브영 1위', '글로우픽 어워드'],
    stats: ['48시간 보습', '4.9점', '5,200건'],
    price: '', discount: '', event: '',
    ctaText: '지금 만나보기',
    expectedLayout: 'F',  // "1위" 감지
  },
  {
    id: 'food-C',
    productName: '비비고 왕교자',
    industry: '식품/냉장',
    awards: [],
    stats: ['2,000만개 판매', '4.7점'],
    price: '12,900원', discount: '25%', event: '',
    ctaText: '장바구니 담기',
    expectedLayout: 'C',  // 할인+가격
  },
  {
    id: 'tech-A',
    productName: '에어팟 프로 2세대',
    industry: '테크/가전',
    awards: [],
    stats: ['49dB 노이즈캔슬링', '6시간 재생', 'IP54 방수'],
    price: '', discount: '', event: '',
    ctaText: '구매하기',
    expectedLayout: 'A',  // 기본 센터
  },
  {
    id: 'health-D',
    productName: '종근당 프로바이오틱스',
    industry: '건강기능식품',
    awards: ['식약처 인증', 'GMP 제조', 'HACCP'],
    stats: ['100억 유산균', '4.8점', '3,200건'],
    price: '', discount: '', event: '',
    ctaText: '건강 시작하기',
    expectedLayout: 'D',  // 수상 2개 이상
  },
];

// ═══ v4 규칙 엔진 (인라인) ═══
const INDUSTRY_KEYWORDS = {
  beauty: ['뷰티', '화장품', '스킨케어'], health: ['건강', '영양제', '건기식', '비타민', '프로바이오'],
  food: ['식품', '냉장', '음료'], tech: ['테크', '가전', '전자'],
  b2b: ['B2B', 'SaaS'], fashion: ['패션', '의류'], kids: ['키즈', '유아'],
  organic: ['유기농', '비건'], cafe: ['카페', '베이커리'], medical: ['의료', '더마'],
};
const BRAND_COLORS = {
  beauty: '#C9A96E', health: '#2E7D32', food: '#DC2626', tech: '#0EA5E9',
  b2b: '#1D4ED8', fashion: '#0A0A0A', kids: '#FF6B6B', organic: '#4A7C59',
  cafe: '#C25E1A', medical: '#0369A1', default: '#4A90D9',
};
const MOOD_MAP_BY_CAT = {
  beauty: 'mood-dark', health: 'mood-dark', food: 'mood-warm', tech: 'mood-navy',
  b2b: 'mood-navy', fashion: 'mood-mono', kids: 'mood-playful', organic: 'mood-organic',
  cafe: 'mood-warm', medical: 'mood-clean', default: 'mood-dark',
};
const MOOD_FONTS = {
  'mood-dark': 'SET-2', 'mood-vivid': 'SET-1', 'mood-clean': 'SET-3',
  'mood-soft': 'SET-6', 'mood-red': 'SET-5', 'mood-navy': 'SET-2',
  'mood-organic': 'SET-3', 'mood-warm': 'SET-3', 'mood-mono': 'SET-12',
  'mood-playful': 'SET-7',
};

function resolveIndustry(str) {
  const norm = str.toLowerCase();
  for (const [cat, kws] of Object.entries(INDUSTRY_KEYWORDS))
    if (kws.some(k => norm.includes(k.toLowerCase()))) return cat;
  return 'default';
}

function selectLayout(input) {
  if (input.discount && input.price && input.event) return 'J';
  if (input.discount || input.price) return 'C';
  if (input.awards.some(a => a.includes('1위'))) return 'F';
  if (input.awards.length >= 2) return 'D';
  if (input.stats.length >= 4) return 'H';
  if (!input.stats.length && !input.price && !input.awards.length) return 'G';
  return 'A';
}

function selectMood(cat, discount) {
  if (discount) return 'mood-red';
  return MOOD_MAP_BY_CAT[cat] || 'mood-dark';
}

// ═══ Gemini 이미지 생성 ═══
async function generateProductImage(productName) {
  const prompt = `You are a product photographer. Generate ONLY the subject described below.
ABSOLUTE RULES:
- Render the subject on a solid pure white (#FFFFFF) background.
- The white must be perfectly uniform — no gradients, no shadows on the background.
- The subject floats on clean white. Nothing else exists.
- Do NOT add text, watermarks, logos, or decorative elements.
Product: ${productName}
Scene: The product as it would appear in a premium commercial photo.
Composition: Centered, product occupies 70% of frame.
Angle: front-facing with slight perspective.
Lighting: Soft studio lighting, clean commercial product photography.`;

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
      if (p.inlineData?.data) return p.inlineData.data;
  throw new Error('No image');
}

// ═══ rembg 배경 제거 ═══
function removeBackground(inputPath, outputPath) {
  try {
    execSync(`python -c "
from rembg import remove
with open('${inputPath.replace(/\\/g, '/')}', 'rb') as f:
    data = f.read()
result = remove(data)
with open('${outputPath.replace(/\\/g, '/')}', 'wb') as f:
    f.write(result)
"`, { timeout: 60000 });
    return true;
  } catch { return false; }
}

// ═══ 실행 ═══
const baseDir = resolve('test-output/layout-tests');
if (!existsSync(baseDir)) mkdirSync(baseDir, { recursive: true });

console.log('═══ Group 3: 업종별 4건 테스트 ═══\n');

for (const tc of TEST_CASES) {
  const cat = resolveIndustry(tc.industry);
  const layoutId = selectLayout(tc);
  const mood = selectMood(cat, tc.discount);
  const fontSet = MOOD_FONTS[mood] || 'SET-2';
  const brandColor = BRAND_COLORS[cat] || BRAND_COLORS.default;

  console.log(`[${tc.id}] ${tc.productName}`);
  console.log(`  업종: ${cat} | 레이아웃: ${layoutId} (예상: ${tc.expectedLayout}) ${layoutId === tc.expectedLayout ? '✅' : '❌'}`);
  console.log(`  무드: ${mood} | 폰트: ${fontSet} | 색상: ${brandColor}`);

  const dir = resolve(baseDir, tc.id);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  // 이미지 생성
  console.log(`  이미지 생성 중...`);
  try {
    const imgBase64 = await generateProductImage(tc.productName);
    const rawPath = resolve(dir, 'raw.png');
    writeFileSync(rawPath, Buffer.from(imgBase64, 'base64'));

    const productPath = resolve(dir, 'product.png');
    const rembgOk = removeBackground(rawPath, productPath);
    console.log(`  이미지: ${rembgOk ? '✅ 생성+누끼' : '⚠️ 생성만(rembg 실패)'}`);
  } catch (e) {
    console.log(`  이미지: ❌ ${e.message}`);
  }

  // HTML 생성 (간단 버전 — render.ts는 TS라 직접 호출 불가, 테스트용 인라인)
  const headline = tc.productName.length > 15
    ? tc.productName.slice(0, 12) + '의 힘'
    : tc.productName + '의 새로운 시작';

  const statsHtml = tc.stats.map(s => {
    const num = s.match(/[\d,.]+만?억?/)?.[0] || s;
    const unit = s.replace(num, '').trim();
    return `<div style="text-align:center"><div style="font-size:clamp(32px,4.8vw,72px);font-weight:900;color:${brandColor};letter-spacing:-2px">${num}</div><div style="font-size:clamp(14px,1.4vw,20px);font-weight:300;color:${brandColor}66">${unit}</div></div>`;
  }).join('');

  const isDark = mood.includes('dark') || mood.includes('red') || mood.includes('navy');
  const bgCSS = isDark
    ? `radial-gradient(ellipse at 50% 30%, ${brandColor}30 0%, transparent 60%), linear-gradient(180deg, #1a1410, #120e08 40%, #0d0a07)`
    : mood === 'mood-warm' ? 'linear-gradient(180deg, #FFF8F0, #F5E6D0)'
    : mood === 'mood-organic' ? 'linear-gradient(180deg, #F7F4EF, #EDE8E0)'
    : '#FFFFFF';

  const html = `<!-- LAYOUT: ${layoutId} | MOOD: ${mood} | FONT: ${fontSet} | COLOR: ${brandColor} -->
<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${tc.productName}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Pretendard',sans-serif;background:#0a0a0a;display:flex;justify-content:center}
@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.hero{width:100%;margin:0 auto;min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:clamp(32px,4vw,64px) 0 40px;background:${bgCSS};color:${isDark?'#fff':'#1a1a1a'}}
.eyebrow{font-size:clamp(11px,1.1vw,16px);font-weight:300;letter-spacing:5px;color:${isDark?brandColor+'80':'rgba(0,0,0,0.5)'};animation:fadeInUp .7s ease .1s both}
.headline{font-size:clamp(42px,7.2vw,100px);font-weight:900;letter-spacing:-4px;line-height:1.08;text-align:center;padding:20px 16px 0;word-break:keep-all;animation:fadeInUp .7s ease .2s both}
.accent{color:${brandColor}}
.desc{font-size:clamp(14px,1.6vw,22px);font-weight:300;color:${isDark?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.5)'};line-height:1.75;text-align:center;margin-top:clamp(12px,1.5vw,24px);padding:0 clamp(20px,3vw,48px);max-width:640px;animation:fadeInUp .7s ease .4s both}
.product-zone{position:relative;margin-top:clamp(16px,2vw,32px);width:55%;max-width:340px;z-index:3;transform:rotate(-2deg);animation:fadeInUp .8s ease .5s both}
.product-zone img{width:100%;height:auto;filter:drop-shadow(0 20px 40px rgba(0,0,0,${isDark?'0.5':'0.15'}))}
.stats{display:flex;justify-content:center;gap:clamp(24px,3.5vw,48px);margin-top:clamp(24px,3vw,48px);padding:0 clamp(20px,3vw,48px);animation:fadeInUp .7s ease .7s both}
${tc.awards.length ? `.trust{text-align:center;margin-top:clamp(20px,2.5vw,40px);animation:fadeInUp .7s ease .9s both}
.trust-card{display:inline-block;border:1px solid ${brandColor}20;border-radius:16px;background:${brandColor}08;padding:14px 32px}
.trust-rank{font-size:clamp(24px,3vw,42px);font-weight:900;color:${brandColor}}
.trust-platform{font-size:clamp(11px,0.9vw,13px);color:${isDark?'rgba(255,255,255,0.45)':'rgba(0,0,0,0.4)'};margin-top:4px}` : ''}
${tc.discount ? `.price-block{text-align:center;margin-top:clamp(16px,2vw,32px);animation:fadeInUp .7s ease .6s both}
.price-original{font-size:clamp(16px,1.7vw,24px);color:${isDark?'rgba(255,255,255,0.3)':'#999'};text-decoration:line-through}
.price-sale{font-size:clamp(48px,8.5vw,120px);font-weight:900;color:${isDark?'#fff':'#1a1a1a'};letter-spacing:-4px}
.discount-badge{display:inline-block;background:${brandColor};color:#fff;font-size:clamp(14px,1.4vw,20px);font-weight:900;padding:10px 28px;border-radius:999px;margin-bottom:clamp(12px,1.5vw,24px);animation:fadeInUp .7s ease .1s both}` : ''}
.cta-area{width:100%;padding:0 clamp(20px,3vw,48px);margin-top:clamp(20px,2.5vw,40px);animation:fadeInUp .7s ease 1s both}
.cta-btn{display:block;width:100%;padding:22px 0;font-size:clamp(16px,1.7vw,24px);font-weight:700;border-radius:16px;text-align:center;text-decoration:none;border:none;cursor:pointer;background:linear-gradient(135deg,${brandColor},${brandColor}dd);color:${isDark?'#0d0a07':'#fff'};box-shadow:0 8px 36px ${brandColor}59;transition:all .3s}
.cta-btn:hover{transform:translateY(-3px)}
.micro{font-size:clamp(11px,0.9vw,13px);font-weight:300;color:${isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.3)'};margin-top:12px;text-align:center}
</style></head><body>
<section class="hero ${mood}">
<p class="eyebrow">${tc.industry.replace('/', ' · ')}</p>
${tc.discount ? `<div class="discount-badge">🔥 ${tc.discount} OFF</div>` : ''}
<h1 class="headline">${headline.replace(/(\S+)$/, '<span class="accent">$1</span>')}</h1>
<div class="desc">${tc.stats.slice(0,2).join(' · ')}</div>
<div class="product-zone"><img src="product.png" alt="${tc.productName}"></div>
${tc.discount ? `<div class="price-block"><div class="price-original">${tc.price}</div><div class="price-sale">${Math.round(parseInt(tc.price.replace(/[^0-9]/g,''))*(1-parseInt(tc.discount)/100)).toLocaleString()}원</div></div>` : ''}
<div class="stats">${statsHtml}</div>
${tc.awards.length ? `<div class="trust"><div class="trust-card"><div class="trust-rank">🏆 ${tc.awards[0]}</div><div class="trust-platform">${tc.awards.slice(1).join(' · ')}</div></div></div>` : ''}
<div class="cta-area"><a href="#" class="cta-btn">${tc.ctaText}</a><p class="micro">전 상품 무료배송 · 100% 안심 환불 보장</p></div>
</section></body></html>`;

  writeFileSync(resolve(dir, 'index.html'), html);
  console.log(`  HTML: ✅ LAYOUT-${layoutId}\n`);
}

// 인덱스 페이지
const indexHtml = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>레이아웃 테스트 인덱스</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Pretendard',sans-serif;background:#111;color:#fff;padding:40px}
h1{font-size:28px;font-weight:900;margin-bottom:32px}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.card{background:#1a1a1a;border-radius:16px;overflow:hidden;text-decoration:none;color:#fff;transition:transform .2s}
.card:hover{transform:translateY(-4px)}.card-body{padding:16px}
.card-label{font-size:11px;font-weight:700;letter-spacing:2px;color:#666}.card-title{font-size:16px;font-weight:700;margin-top:4px}
.card-meta{font-size:12px;color:#555;margin-top:8px}</style></head><body>
<h1>v4 레이아웃 테스트 (4개 업종)</h1>
<div class="grid">
${TEST_CASES.map(tc => {
  const cat = resolveIndustry(tc.industry);
  const layoutId = selectLayout(tc);
  const mood = selectMood(cat, tc.discount);
  return `<a href="${tc.id}/index.html" class="card"><div class="card-body">
<div class="card-label">${tc.id.toUpperCase()}</div>
<div class="card-title">${tc.productName}</div>
<div class="card-meta">LAYOUT-${layoutId} · ${mood} · ${cat}</div>
</div></a>`;
}).join('')}
</div></body></html>`;
writeFileSync(resolve(baseDir, 'index.html'), indexHtml);

console.log('═══ 완료 ═══');
console.log(`인덱스: file:///${resolve(baseDir, 'index.html').replace(/\\/g, '/')}`);
