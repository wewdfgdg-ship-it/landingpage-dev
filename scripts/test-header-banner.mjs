// ============================================================
// 헤더배너 v4 통합 테스트
// 사용자 입력만으로 전체 파이프라인 실행:
// 입력 → 레이아웃 선택 → 무드 → 폰트셋 → 이미지 생성 → rembg → HTML
// ============================================================

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { config } from 'dotenv';

// .env 로드
config({ path: resolve('..', '.env') });
config({ path: resolve('.env') });

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY not found in .env');

const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${GEMINI_KEY}`;

// ════════════════════════════════════════
// 사용자 입력 (이것만 바꾸면 됨)
// ════════════════════════════════════════

const USER_INPUT = {
  productName: '로보락 S8 MaxV Ultra',
  industry: '테크/가전',
  headline: '',
  awards: [],
  stats: ['11,000Pa 흡입력', '5100mAh 배터리', '60일 자동비움'],
  price: '1,890,000원',
  discount: '32%',
  event: '',
  ctaText: '최저가 확인하기',
};

// ════════════════════════════════════════
// v4 규칙 엔진 (index.ts 로직 인라인)
// ════════════════════════════════════════

// 업종 분류
const INDUSTRY_KEYWORDS = {
  beauty: ['뷰티', '화장품', '스킨케어', '메이크업'],
  health: ['건강', '영양제', '건기식', '비타민'],
  food: ['식품', '냉장', '음료'],
  tech: ['테크', '가전', '전자'],
  b2b: ['B2B', 'SaaS', '기업'],
  fashion: ['패션', '의류'],
  kids: ['키즈', '유아'],
  organic: ['유기농', '비건'],
  cafe: ['카페', '베이커리'],
  medical: ['의료', '더마'],
};

const BRAND_COLORS = {
  beauty: '#C9A96E', health: '#2E7D32', food: '#DC2626', tech: '#0EA5E9',
  b2b: '#1D4ED8', fashion: '#0A0A0A', kids: '#FF6B6B', organic: '#4A7C59',
  cafe: '#C25E1A', medical: '#0369A1', default: '#4A90D9',
};

function resolveIndustry(str) {
  const norm = str.toLowerCase();
  for (const [cat, kws] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (kws.some(k => norm.includes(k.toLowerCase()))) return cat;
  }
  return 'default';
}

// 레이아웃 선택
function selectLayout(input) {
  if (input.discount && input.price && input.event) return 'J';
  if (input.discount || input.price) return 'C';
  if (input.awards.some(a => a.includes('1위'))) return 'F';
  if (input.awards.length >= 2) return 'D';
  if (input.stats.length >= 4) return 'H';
  if (!input.stats.length && !input.price && !input.awards.length) return 'G';
  return 'A';
}

// 무드 선택
function selectMood(cat, discount) {
  if (discount) return 'mood-red';
  const map = {
    beauty: 'mood-dark', health: 'mood-dark', food: 'mood-warm',
    tech: 'mood-navy', b2b: 'mood-navy', fashion: 'mood-mono',
    kids: 'mood-playful', organic: 'mood-organic', cafe: 'mood-warm',
    medical: 'mood-clean',
  };
  return map[cat] || 'mood-dark';
}

// 폰트셋
const MOOD_FONTS = {
  'mood-dark': 'SET-2', 'mood-vivid': 'SET-1', 'mood-clean': 'SET-3',
  'mood-soft': 'SET-6', 'mood-red': 'SET-5', 'mood-navy': 'SET-2',
  'mood-organic': 'SET-3', 'mood-warm': 'SET-3', 'mood-mono': 'SET-12',
  'mood-playful': 'SET-7',
};

const MODE_MAP = {
  A: 'hero-flow', B: 'flow', C: 'hero-flow', D: 'hero-flow',
  E: 'background', F: 'hero-flow', G: 'hero-flow', H: 'hero-absolute',
  I: 'hero-flow', J: 'hero-flow',
};

// ════════════════════════════════════════
// 파이프라인 실행
// ════════════════════════════════════════

const cat = resolveIndustry(USER_INPUT.industry);
const layoutId = selectLayout(USER_INPUT);
const mode = MODE_MAP[layoutId];
const mood = selectMood(cat, USER_INPUT.discount);
const fontSet = MOOD_FONTS[mood] || 'SET-2';
const brandColor = BRAND_COLORS[cat] || BRAND_COLORS.default;
const headline = USER_INPUT.headline || `${USER_INPUT.productName}의 새로운 시작`;

console.log('═══ v4 파이프라인 실행 ═══');
console.log(`제품: ${USER_INPUT.productName}`);
console.log(`업종: ${USER_INPUT.industry} → ${cat}`);
console.log(`레이아웃: ${layoutId} (${mode})`);
console.log(`무드: ${mood}`);
console.log(`폰트셋: ${fontSet}`);
console.log(`brandColor: ${brandColor}`);
console.log(`헤드라인: ${headline}`);

// ════════════════════════════════════════
// 이미지 생성 (Gemini)
// ════════════════════════════════════════

const imagePrompt = `You are a product photographer. Generate ONLY the subject described below.

ABSOLUTE RULES:
- Render the subject on a solid pure white (#FFFFFF) background.
- The white must be perfectly uniform — no gradients, no shadows on the background.
- The subject floats on clean white. Nothing else exists.
- Do NOT add text, watermarks, logos, or decorative elements.

Product: ${USER_INPUT.productName}
Scene: The product as it would appear in a premium commercial photo.
Composition: Centered, product occupies 70% of frame.
Angle: front-facing with slight perspective to show 3D form.
Lighting: Soft studio lighting, clean commercial product photography.`;

console.log(`\n[STEP 1] Gemini 이미지 생성...`);

const res = await fetch(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      imageConfig: { aspectRatio: '1:1' },
    },
  }),
  signal: AbortSignal.timeout(120_000),
});

if (!res.ok) throw new Error(`Gemini API ${res.status}: ${(await res.text()).slice(0, 300)}`);

const chunks = JSON.parse(await res.text());
let imageBase64 = null;
for (const chunk of (Array.isArray(chunks) ? chunks : [chunks])) {
  for (const part of (chunk?.candidates?.[0]?.content?.parts || [])) {
    if (part.inlineData?.data) imageBase64 = part.inlineData.data;
  }
}
if (!imageBase64) throw new Error('No image in response');

const outputDir = resolve('test-output/header-banner-v4');
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, 'raw.png'), Buffer.from(imageBase64, 'base64'));
console.log(`  ✅ raw.png (${(imageBase64.length * 0.75 / 1024).toFixed(0)}KB)`);

// ════════════════════════════════════════
// rembg 배경 제거
// ════════════════════════════════════════

console.log(`[STEP 2] rembg 배경 제거...`);
try {
  execSync(`python -c "
from rembg import remove
with open('${resolve(outputDir, 'raw.png').replace(/\\/g, '/')}', 'rb') as f:
    data = f.read()
result = remove(data)
with open('${resolve(outputDir, 'product.png').replace(/\\/g, '/')}', 'wb') as f:
    f.write(result)
print(f'{len(data)//1024}KB -> {len(result)//1024}KB')
"`, { stdio: 'inherit', timeout: 60000 });
  console.log(`  ✅ product.png 저장`);
} catch (e) {
  console.log(`  ⚠️ rembg 실패, raw.png를 그대로 사용`);
  execSync(`cp "${resolve(outputDir, 'raw.png')}" "${resolve(outputDir, 'product.png')}"`);
}

// ════════════════════════════════════════
// HTML 생성
// ════════════════════════════════════════

console.log(`[STEP 3] HTML 생성...`);

const isDark = mood.includes('dark') || mood.includes('red') || mood.includes('navy');
const bgCSS = isDark
  ? `radial-gradient(ellipse at 50% 30%, ${brandColor}30 0%, transparent 60%),
     linear-gradient(180deg, #1a1410 0%, #120e08 40%, #0d0a07 100%)`
  : mood === 'mood-clean' ? '#FFFFFF'
  : mood === 'mood-warm' ? `linear-gradient(180deg, #FFF8F0, #F5E6D0)`
  : mood === 'mood-organic' ? `linear-gradient(180deg, #F7F4EF, #EDE8E0)`
  : '#FFFFFF';

const textColor = isDark ? '#FFFFFF' : '#1a1a1a';
const subColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)';

const html = `<!-- LAYOUT: ${layoutId} | MOOD: ${mood} | FONT: ${fontSet} | MODE: ${mode} -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${USER_INPUT.productName}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Pretendard', sans-serif; background: #0a0a0a; display: flex; justify-content: center; }

    .hero {
      width: 100%; margin: 0 auto; min-height: 100vh;
      position: relative; overflow: hidden;
      display: flex; flex-direction: column; align-items: center;
      padding: clamp(32px, 4vw, 64px) 0 40px;
      background: ${bgCSS};
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    ${layoutId === 'F' || layoutId === 'D' ? `
    .trust-area {
      text-align: center; margin-bottom: clamp(16px, 2vw, 32px); z-index: 5;
      animation: fadeInUp 0.7s ease 0.1s both;
    }
    .trust-card {
      display: inline-block; border: 1px solid ${brandColor}20;
      border-radius: 16px; background: ${brandColor}08; padding: 14px 32px;
    }
    .trust-card .rank { font-size: clamp(24px, 3vw, 42px); font-weight: 900; color: ${brandColor}; }
    .trust-card .platform { font-size: clamp(11px, 0.9vw, 13px); font-weight: 400; color: ${subColor}; margin-top: 4px; }
    ` : ''}

    .eyebrow {
      font-size: clamp(11px, 1.1vw, 16px); font-weight: 300; letter-spacing: 5px;
      color: ${isDark ? brandColor + '80' : subColor}; text-align: center; z-index: 5;
      animation: fadeInUp 0.7s ease 0.1s both;
    }

    .headline {
      font-size: clamp(42px, 7.2vw, 100px); font-weight: 900; color: ${textColor};
      letter-spacing: -4px; line-height: 1.08; text-align: center;
      padding: 20px 16px 0; word-break: keep-all; z-index: 5;
      animation: fadeInUp 0.7s ease 0.2s both;
    }
    .headline .accent { color: ${brandColor}; }

    .desc {
      font-size: clamp(14px, 1.6vw, 22px); font-weight: 300; color: ${subColor};
      line-height: 1.75; text-align: center; margin-top: clamp(12px, 1.5vw, 24px);
      padding: 0 clamp(20px, 3vw, 48px); z-index: 5; max-width: 640px;
      animation: fadeInUp 0.7s ease 0.4s both;
    }

    .product-zone {
      position: relative; margin-top: clamp(16px, 2vw, 32px);
      width: 55%; max-width: 340px; z-index: 3;
      ${layoutId !== 'G' ? 'transform: rotate(-2deg);' : ''}
      animation: fadeInUp 0.8s ease 0.5s both;
    }
    .product-zone img {
      width: 100%; height: auto;
      filter: drop-shadow(0 20px 40px rgba(0,0,0,${isDark ? '0.5' : '0.15'}));
    }

    .stats {
      display: flex; justify-content: center; gap: clamp(24px, 3.5vw, 48px);
      margin-top: clamp(24px, 3vw, 48px); padding: 0 clamp(20px, 3vw, 48px); z-index: 5;
      animation: fadeInUp 0.7s ease 0.7s both;
    }
    .stat-item { text-align: center; }
    .stat-number {
      font-size: clamp(32px, 4.8vw, 72px); font-weight: 900; color: ${brandColor};
      letter-spacing: -2px;
    }
    .stat-unit { font-size: clamp(14px, 1.4vw, 20px); font-weight: 300; color: ${brandColor}66; margin-top: 2px; }

    .cta-area {
      width: 100%; padding: 0 clamp(20px, 3vw, 48px);
      margin-top: clamp(20px, 2.5vw, 40px); z-index: 5;
      animation: fadeInUp 0.7s ease 1.0s both;
    }
    .cta-btn {
      display: block; width: 100%; padding: 22px 0;
      font-size: clamp(16px, 1.7vw, 24px); font-weight: 700;
      border-radius: 16px; text-align: center; text-decoration: none; border: none; cursor: pointer;
      background: linear-gradient(135deg, ${brandColor}, ${brandColor}dd);
      color: ${isDark ? '#0d0a07' : '#ffffff'};
      box-shadow: 0 8px 36px ${brandColor}59;
      transition: all 0.3s ease;
    }
    .cta-btn:hover { transform: translateY(-3px); }

    .micro {
      font-size: clamp(11px, 0.9vw, 13px); font-weight: 300; color: ${subColor};
      margin-top: 12px; text-align: center; opacity: 0.6;
    }
  </style>
</head>
<body>
  <section class="hero ${mood}">

    ${(layoutId === 'F' || layoutId === 'D') ? `
    <div class="trust-area">
      <div class="trust-card">
        <div class="rank">🏆 ${USER_INPUT.awards[0] || '1위'}</div>
        <div class="platform">${USER_INPUT.awards.slice(1).join(' · ') || ''}</div>
      </div>
    </div>` : ''}

    <p class="eyebrow">${USER_INPUT.industry.replace('/', ' · ')}</p>
    <h1 class="headline">${headline.replace(/(\S+)$/, '<span class="accent">$1</span>')}</h1>

    <div class="desc">
      ${USER_INPUT.stats.slice(0, 2).join(' · ')}
    </div>

    <div class="product-zone">
      <img src="product.png" alt="${USER_INPUT.productName}">
    </div>

    ${USER_INPUT.stats.length > 0 ? `
    <div class="stats">
      ${USER_INPUT.stats.map(s => {
        const num = s.match(/[\d,.]+만?/)?.[0] || s;
        const unit = s.replace(num, '').trim();
        return `<div class="stat-item"><div class="stat-number">${num}</div><div class="stat-unit">${unit}</div></div>`;
      }).join('')}
    </div>` : ''}

    <div class="cta-area">
      <a href="#" class="cta-btn">${USER_INPUT.ctaText}</a>
      <p class="micro">전 상품 무료배송 · 100% 안심 환불 보장</p>
    </div>
  </section>
</body>
</html>`;

writeFileSync(resolve(outputDir, 'index.html'), html);
console.log(`  ✅ index.html 저장`);

console.log(`\n═══ 완료 ═══`);
console.log(`URL: file:///${resolve(outputDir, 'index.html').replace(/\\/g, '/')}`);
