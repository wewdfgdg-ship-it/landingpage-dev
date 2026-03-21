/**
 * 8개 업종 비교 그리드 — 한눈에 차이 확인
 * 각 업종 Hero + Key Features + CTA 3개 섹션만 추출해서 나란히
 */
import { getDefaultBundle } from "../src/engine/sections/landing-bundles";
import { renderBundleSections, getAllStyles } from "../src/engine/sections/orchestrator";
import { SAMPLE_DATA } from "../src/engine/sections/sample-data";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/comparison-grid");
mkdirSync(OUT, { recursive: true });

const industries = ["beauty", "food", "electronics", "fashion", "living", "saas", "education", "enterprise"] as const;
const labels: Record<string, string> = {
  beauty: "🧴 뷰티", food: "🍅 식품", electronics: "⚡ 전자기기", fashion: "👕 패션",
  living: "🏠 리빙", saas: "💻 SaaS", education: "📚 교육", enterprise: "🏢 B2B",
};
const colors: Record<string, string> = {
  beauty: "#2563EB", food: "#DC2626", electronics: "#059669", fashion: "#1F1235",
  living: "#6B8F71", saas: "#7C3AED", education: "#0891B2", enterprise: "#1E3A5F",
};

// 각 업종에서 Hero(0) + KeyFeatures(1) + CTA(마지막) 추출
const cards = industries.map((ind) => {
  const bundle = getDefaultBundle(ind);
  const data = SAMPLE_DATA[ind];
  const sections = renderBundleSections(bundle, data);
  // Hero = 0, KF = 1, CTA = last
  return {
    industry: ind,
    label: labels[ind],
    product: data.productName,
    color: colors[ind],
    hero: sections[0] || "",
    kf: sections[1] || "",
    cta: sections[sections.length - 1] || "",
    sectionCount: sections.length,
    bundleLabel: bundle.label,
    strategy: bundle.strategy,
  };
});

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>8개 업종 비교 그리드</title>
  <style>
    ${getAllStyles()}

    body {
      font-family: 'Pretendard', -apple-system, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
      -webkit-font-smoothing: antialiased;
    }

    .page-header {
      text-align: center;
      padding: 40px 20px 20px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.04em;
      margin: 0 0 8px;
    }

    .page-header p {
      font-size: 15px;
      color: #666;
      margin: 0;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
      max-width: 1600px;
      margin: 24px auto;
      padding: 0 20px;
    }

    .industry-card {
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      transition: transform 0.2s;
    }

    .industry-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
    }

    .card-header {
      padding: 16px 20px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      font-size: 18px;
      font-weight: 800;
      margin: 0;
    }

    .card-header .product {
      font-size: 13px;
      opacity: 0.8;
    }

    .card-meta {
      padding: 12px 20px;
      background: #fafafa;
      border-bottom: 1px solid #f0f0f0;
      font-size: 12px;
      color: #888;
      display: flex;
      gap: 16px;
    }

    .card-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .section-preview {
      max-height: 400px;
      overflow: hidden;
      position: relative;
    }

    .section-preview::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 80px;
      background: linear-gradient(transparent, #fff);
    }

    .section-preview > * {
      transform: scale(0.7);
      transform-origin: top left;
      width: 143%;
    }

    .card-link {
      display: block;
      padding: 14px 20px;
      text-align: center;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      border-top: 1px solid #f0f0f0;
      transition: background 0.2s;
    }

    .card-link:hover {
      background: #f5f5f5;
    }

    .section-tabs {
      display: flex;
      border-bottom: 1px solid #f0f0f0;
    }

    .section-tab {
      flex: 1;
      padding: 10px;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      color: #999;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .section-tab.active {
      color: #333;
      border-bottom-color: currentColor;
    }

    @media (max-width: 480px) {
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="page-header">
    <h1>8개 업종 비교</h1>
    <p>업종 · 제품 · 브랜드 컬러 · 번들 전략 · Hero 미리보기</p>
  </div>

  <div class="grid">
    ${cards.map((c) => `
      <div class="industry-card">
        <div class="card-header" style="background:${c.color};">
          <div>
            <h2>${c.label}</h2>
            <div class="product">${c.product}</div>
          </div>
          <div style="font-size:12px;opacity:0.7;">${c.color}</div>
        </div>
        <div class="card-meta">
          <span>📐 ${c.sectionCount}섹션</span>
          <span>🎯 ${c.bundleLabel}</span>
        </div>
        <div class="card-meta" style="background:#fff;border-bottom:none;color:#555;">
          <span>${c.strategy}</span>
        </div>
        <div class="section-preview">
          ${c.hero}
        </div>
        <a href="../all-industries/${c.industry}.html" class="card-link" style="color:${c.color};">
          풀 페이지 보기 →
        </a>
      </div>
    `).join("")}
  </div>
</body>
</html>`;

writeFileSync(join(OUT, "index.html"), html, "utf-8");
console.log(`✅ ${join(OUT, "index.html")}`);
