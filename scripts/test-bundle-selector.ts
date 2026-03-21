/**
 * 번들 선택 UI — 8업종 × 5변형 = 40개 번들 브라우저에서 선택/미리보기
 */
import { getAllBundles, getBundles, type Industry, type LandingBundle } from "../src/engine/sections/landing-bundles";
import { renderBundleHTML } from "../src/engine/sections/orchestrator";
import { SAMPLE_DATA } from "../src/engine/sections/sample-data";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/bundle-selector");
mkdirSync(OUT, { recursive: true });

const industries: Industry[] = ["beauty", "food", "electronics", "fashion", "living", "saas", "education", "enterprise"];
const labels: Record<string, string> = {
  beauty: "🧴 뷰티", food: "🍅 식품", electronics: "⚡ 전자기기", fashion: "👕 패션",
  living: "🏠 리빙", saas: "💻 SaaS", education: "📚 교육", enterprise: "🏢 B2B",
};
const colors: Record<string, string> = {
  beauty: "#2563EB", food: "#DC2626", electronics: "#059669", fashion: "#1F1235",
  living: "#6B8F71", saas: "#7C3AED", education: "#0891B2", enterprise: "#1E3A5F",
};
const variantLabels: Record<string, string> = {
  a: "A 기능중심", b: "B 후기중심", c: "C 수치중심", d: "D 감성중심", e: "E 프로모중심",
};

// 40개 번들 HTML 생성
let count = 0;
for (const ind of industries) {
  const bundles = getBundles(ind);
  const data = SAMPLE_DATA[ind];
  for (const bundle of bundles) {
    const filename = `${ind}-${bundle.variant}.html`;
    const html = renderBundleHTML(bundle, data);
    writeFileSync(join(OUT, filename), html, "utf-8");
    count++;
  }
  console.log(`✅ ${ind} (5개)`);
}
console.log(`\n총 ${count}개 페이지 생성`);

// 선택 UI 페이지
const selectorHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>번들 선택기 — 8업종 × 5변형</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Pretendard', sans-serif; background: #f5f5f5; color: #111; }

    .top-bar {
      position: sticky; top: 0; z-index: 100;
      background: #fff; border-bottom: 1px solid #e5e7eb;
      padding: 16px 24px;
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    }
    .top-bar h1 { font-size: 18px; font-weight: 900; white-space: nowrap; }
    .top-bar .info { font-size: 13px; color: #888; }

    .industry-tabs {
      display: flex; gap: 6px; padding: 12px 24px; overflow-x: auto;
      background: #fff; border-bottom: 1px solid #f0f0f0;
      position: sticky; top: 57px; z-index: 99;
    }
    .industry-tab {
      padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 700;
      cursor: pointer; white-space: nowrap; border: 1.5px solid #e5e7eb;
      background: #fff; color: #555; transition: all 0.15s;
    }
    .industry-tab:hover { border-color: #aaa; }
    .industry-tab.active { background: var(--active-color, #111); color: #fff; border-color: transparent; }

    .variant-bar {
      display: flex; gap: 8px; padding: 12px 24px;
      background: #fafafa; border-bottom: 1px solid #f0f0f0;
      position: sticky; top: 105px; z-index: 98;
    }
    .variant-btn {
      padding: 8px 20px; border-radius: 12px; font-size: 13px; font-weight: 700;
      cursor: pointer; border: 1.5px solid #e5e7eb; background: #fff; color: #555;
      transition: all 0.15s;
    }
    .variant-btn:hover { border-color: #aaa; }
    .variant-btn.active { background: #111; color: #fff; border-color: transparent; }
    .variant-btn .default-tag { font-size: 10px; color: #2563EB; margin-left: 4px; }

    .preview-frame {
      max-width: 960px; margin: 24px auto; background: #fff;
      border-radius: 16px; overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    }
    .preview-header {
      padding: 16px 24px; border-bottom: 1px solid #f0f0f0;
      display: flex; justify-content: space-between; align-items: center;
    }
    .preview-header .label { font-size: 14px; font-weight: 700; }
    .preview-header .meta { font-size: 12px; color: #888; }
    .preview-header a {
      font-size: 13px; font-weight: 700; color: #2563EB; text-decoration: none;
    }
    iframe {
      width: 100%; height: 80vh; border: none; display: block;
    }

    .bundle-grid {
      display: none; max-width: 960px; margin: 24px auto; padding: 0 24px;
    }
    .bundle-grid.show { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
    .bundle-card {
      padding: 16px; border-radius: 14px; border: 1.5px solid #e5e7eb;
      background: #fff; cursor: pointer; transition: all 0.15s; text-align: center;
    }
    .bundle-card:hover { border-color: #aaa; transform: translateY(-2px); }
    .bundle-card.active { border-color: #2563EB; box-shadow: 0 4px 16px rgba(37,99,235,0.15); }
    .bundle-card h3 { font-size: 14px; font-weight: 800; margin-bottom: 4px; }
    .bundle-card p { font-size: 11px; color: #888; line-height: 1.4; }

    @media (max-width: 768px) {
      .bundle-grid.show { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <h1>번들 선택기</h1>
    <span class="info">8업종 × 5변형 = 40개 번들 · 실시간 미리보기</span>
  </div>

  <div class="industry-tabs" id="industryTabs">
    ${industries.map((ind) => `<div class="industry-tab" data-industry="${ind}" style="--active-color:${colors[ind]}">${labels[ind]}</div>`).join("")}
  </div>

  <div class="variant-bar" id="variantBar">
    ${["a","b","c","d","e"].map((v) => `<div class="variant-btn" data-variant="${v}">${variantLabels[v]}${v === "a" ? '<span class="default-tag">기본</span>' : ""}</div>`).join("")}
  </div>

  <div class="preview-frame">
    <div class="preview-header">
      <div>
        <span class="label" id="previewLabel">뷰티 — A 기능중심</span>
        <span class="meta" id="previewMeta">10섹션 · beauty-a</span>
      </div>
      <a id="previewLink" href="beauty-a.html" target="_blank">새 탭에서 열기 ↗</a>
    </div>
    <iframe id="previewFrame" src="beauty-a.html"></iframe>
  </div>

  <script>
    const industries = ${JSON.stringify(industries)};
    const labels = ${JSON.stringify(labels)};
    const variantLabels = ${JSON.stringify(variantLabels)};
    let currentIndustry = 'beauty';
    let currentVariant = 'a';

    function update() {
      const file = currentIndustry + '-' + currentVariant + '.html';
      document.getElementById('previewFrame').src = file;
      document.getElementById('previewLink').href = file;
      document.getElementById('previewLabel').textContent =
        labels[currentIndustry] + ' — ' + variantLabels[currentVariant];
      document.getElementById('previewMeta').textContent =
        '10섹션 · ' + file.replace('.html', '');

      document.querySelectorAll('.industry-tab').forEach(el => {
        el.classList.toggle('active', el.dataset.industry === currentIndustry);
      });
      document.querySelectorAll('.variant-btn').forEach(el => {
        el.classList.toggle('active', el.dataset.variant === currentVariant);
      });
    }

    document.getElementById('industryTabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.industry-tab');
      if (tab) { currentIndustry = tab.dataset.industry; update(); }
    });

    document.getElementById('variantBar').addEventListener('click', (e) => {
      const btn = e.target.closest('.variant-btn');
      if (btn) { currentVariant = btn.dataset.variant; update(); }
    });

    update();
  </script>
</body>
</html>`;

writeFileSync(join(OUT, "index.html"), selectorHtml, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
