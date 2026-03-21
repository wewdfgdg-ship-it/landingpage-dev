/**
 * 8개 업종 기본 번들(a) 전수 렌더 테스트
 */
import { renderDefaultBundle } from "../src/engine/sections/orchestrator";
import { SAMPLE_DATA } from "../src/engine/sections/sample-data";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/all-industries");
mkdirSync(OUT, { recursive: true });

const industries = ["beauty", "food", "electronics", "fashion", "living", "saas", "education", "enterprise"] as const;
const labels: Record<string, string> = {
  beauty: "🧴 뷰티", food: "🍅 식품", electronics: "⚡ 전자기기", fashion: "👕 패션",
  living: "🏠 리빙", saas: "💻 SaaS", education: "📚 교육", enterprise: "🏢 B2B",
};

for (const ind of industries) {
  const data = SAMPLE_DATA[ind];
  const html = renderDefaultBundle(ind, data);
  writeFileSync(join(OUT, `${ind}.html`), html, "utf-8");
  console.log(`✅ ${ind}.html (${data.productName})`);
}

const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>8개 업종 풀 페이지</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:8px}p{color:#666;margin-bottom:24px;font-size:14px}a{display:block;padding:20px;margin-bottom:10px;border-radius:16px;text-decoration:none;color:#fff;font-weight:700;font-size:17px;transition:transform 0.2s}a:hover{transform:translateY(-2px)}span{display:block;font-size:13px;font-weight:400;margin-top:4px;opacity:0.8}</style></head><body><h1>8개 업종 풀 랜딩페이지</h1><p>각 업종 기본 번들(a) · 실제 샘플 데이터 · 10섹션 조합</p>${industries.map(ind => {
  const d = SAMPLE_DATA[ind];
  const colors: Record<string, string> = { beauty:"#2563EB", food:"#DC2626", electronics:"#059669", fashion:"#1F1235", living:"#6B8F71", saas:"#7C3AED", education:"#0891B2", enterprise:"#1E3A5F" };
  return `<a href="${ind}.html" style="background:${colors[ind]}">${labels[ind]}<span>${d.productName}</span></a>`;
}).join("")}</body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
