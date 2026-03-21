import { renderSection as renderBA } from "../src/engine/sections/common-before-after/index";
import { beforeAfterStyles } from "../src/engine/sections/common-before-after/styles";
import { renderSection as renderTR } from "../src/engine/sections/common-trust/index";
import { trustStyles } from "../src/engine/sections/common-trust/styles";
import { renderSection as renderCM } from "../src/engine/sections/common-comparison/index";
import { comparisonStyles } from "../src/engine/sections/common-comparison/styles";
import { renderSection as renderPH } from "../src/engine/sections/common-photo-review/index";
import { photoReviewStyles } from "../src/engine/sections/common-photo-review/styles";
import { renderSection as renderPL } from "../src/engine/sections/common-promo/index";
import { promoStyles } from "../src/engine/sections/common-promo/styles";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/tier4-test");
mkdirSync(OUT, { recursive: true });
const wrap = (t: string, css: string, html: string) => `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${t}</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Pretendard',sans-serif;display:flex;justify-content:center;min-height:100vh;background:#f0f0f0}.page{width:100%;max-width:960px}${css}</style></head><body><div class="page">${html}</div></body></html>`;

const ba = renderBA({ headline: "사용 전후 비교", beforeImageUrl: "https://placehold.co/400x400/FEE2E2/DC2626?text=BEFORE", afterImageUrl: "https://placehold.co/400x400/DCFCE7/059669?text=AFTER", body: "4주 사용 후 눈에 띄는 변화", mood: "clean", brandColor: "#059669" });
const ba_c = renderBA({ headline: "임상 결과", beforeImageUrl: "https://placehold.co/400x400/F5F5F5/666?text=Before", afterImageUrl: "https://placehold.co/400x400/F0FDF4/059669?text=After", stat: { number: "73.4", unit: "%", label: "개선률" }, mood: "dark", brandColor: "#2563EB", layoutId: "BA-C" });

const tr_a = renderTR({ headline: "인증 및 수상", awards: [{ name: "식약처 인증", icon: "🏅" }, { name: "GMP 제조", icon: "🏭" }, { name: "ISO 22716", icon: "✅" }, { name: "뷰티어워드", icon: "🏆" }], mood: "dark", brandColor: "#C9A96E" });
const tr_b = renderTR({ headline: "수상 이력", featuredAward: { name: "올리브영 1위", icon: "🏆", description: "스킨케어 부문 3년 연속" }, awards: [{ name: "FDA 등록", icon: "✅" }, { name: "iHerb 베스트", icon: "🌿" }], mood: "navy", brandColor: "#3B82F6" });

const cm_a = renderCM({ headline: "왜 우리 제품인가", ourName: "프리미엄 세럼", theirName: "일반 세럼", rows: [
  { label: "히알루론산 함량", ours: "5중 복합", theirs: "단일" }, { label: "임상 인증", ours: "✅", theirs: "❌" },
  { label: "무방부제", ours: "✅", theirs: "❌" }, { label: "가격", ours: "29,000원", theirs: "35,000원" },
], mood: "clean", brandColor: "#2563EB" });

const ph_a = renderPH({ headline: "포토 리뷰", totalCount: 3200, reviews: [
  { imageUrl: "https://placehold.co/300x300/FEF3C7/D97706?text=1", quote: "피부결 좋아짐", author: "김○○", rating: 5 },
  { imageUrl: "https://placehold.co/300x300/ECFDF5/059669?text=2", quote: "재구매 3번째", author: "이○○", rating: 5 },
  { imageUrl: "https://placehold.co/300x300/EDE9FE/7C3AED?text=3", quote: "선물용으로 최고", author: "박○○", rating: 4 },
  { imageUrl: "https://placehold.co/300x300/FEE2E2/DC2626?text=4", quote: "향 좋아요", author: "최○○", rating: 5 },
  { imageUrl: "https://placehold.co/300x300/E0F2FE/2563EB?text=5", quote: "촉촉함 오래감", author: "한○○", rating: 5 },
  { imageUrl: "https://placehold.co/300x300/F0FDF4/059669?text=6", author: "정○○", rating: 4 },
], mood: "clean", brandColor: "#D97706" });

const pl_a = renderPL({ deadline: "오늘 자정 마감", headline: "한정 특가", subheadline: "이 가격은 다시 없습니다", stockPercent: 73, cta: { text: "지금 구매하기" }, microCopy: "한정 수량 소진 시 조기 마감", mood: "dark", brandColor: "#DC2626" });
const pl_b = renderPL({ headline: "첫 구매 혜택", benefits: [{ icon: "📦", text: "무료배송" }, { icon: "🎁", text: "미니 증정" }, { icon: "🔄", text: "30일 환불" }], cta: { text: "혜택 받기" }, mood: "navy", brandColor: "#7C3AED" });

const files = [
  { name: "ba-a-side.html", html: ba, title: "BA-A 좌우비교 (09)", css: beforeAfterStyles },
  { name: "ba-c-stat.html", html: ba_c, title: "BA-C 수치강조 dark (09)", css: beforeAfterStyles },
  { name: "tr-a-grid.html", html: tr_a, title: "TR-A 배지그리드 dark (11)", css: trustStyles },
  { name: "tr-b-featured.html", html: tr_b, title: "TR-B 주요수상 navy (11)", css: trustStyles },
  { name: "cm-a-table.html", html: cm_a, title: "CM-A 비교테이블 (17)", css: comparisonStyles },
  { name: "ph-a-grid.html", html: ph_a, title: "PH-A 포토그리드 (20)", css: photoReviewStyles },
  { name: "pl-a-countdown.html", html: pl_a, title: "PL-A 긴급배너 dark (23)", css: promoStyles },
  { name: "pl-b-benefits.html", html: pl_b, title: "PL-B 혜택패키지 navy (23)", css: promoStyles },
];

for (const f of files) { writeFileSync(join(OUT, f.name), wrap(f.title, f.css, f.html), "utf-8"); console.log(`✅ ${f.name}`); }
const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>Tier 4</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:24px}a{display:block;padding:16px;margin-bottom:8px;background:#f5f5f5;border-radius:12px;text-decoration:none;color:#333;font-weight:700}a:hover{background:#e8e8e8}span{font-weight:400;color:#888;font-size:14px}</style></head><body><h1>T4 Before/After + T6 Trust + T11 Comparison + T13 Photo + T14 Promo</h1>${files.map(f => `<a href="${f.name}">${f.title} <span>→ ${f.name}</span></a>`).join("")}</body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
