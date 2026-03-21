import { renderSection as renderFD } from "../src/engine/sections/common-feature-detail/index";
import { featureDetailStyles } from "../src/engine/sections/common-feature-detail/styles";
import { renderSection as renderBN } from "../src/engine/sections/common-bundle/index";
import { bundleStyles } from "../src/engine/sections/common-bundle/styles";
import { renderSection as renderLS } from "../src/engine/sections/common-lifestyle/index";
import { lifestyleStyles } from "../src/engine/sections/common-lifestyle/styles";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/t2t12t5-test");
mkdirSync(OUT, { recursive: true });
const wrap = (title: string, css: string, html: string) => `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Pretendard',sans-serif;display:flex;justify-content:center;min-height:100vh;background:#f0f0f0}.page{width:100%;max-width:960px}${css}</style></head><body><div class="page">${html}</div></body></html>`;

// T2
const fd_a = renderFD({ sectionId: "03", eyebrow: "POINT 01", headline: "5중 보습 레이어", body: "피부 깊숙이 침투하는 히알루론산 복합체가 5겹의 보습 장벽을 형성합니다.", bulletPoints: ["표피층 즉각 수분 공급", "진피층 장기 보습", "각질층 보호막 강화"], imageUrl: "https://placehold.co/600x500/E0F2FE/2563EB?text=Layer+Structure", mood: "clean", brandColor: "#2563EB" });
const fd_a2 = renderFD({ sectionId: "04", eyebrow: "POINT 02", headline: "나이아신아마이드 10%", body: "피부 톤을 균일하게 정돈하고 모공을 관리합니다.", imageUrl: "https://placehold.co/600x500/FEF3C7/D97706?text=Ingredient", mood: "soft", brandColor: "#D97706", imageRight: false });
const fd_b = renderFD({ sectionId: "05", eyebrow: "POINT 03", headline: "임상으로 증명된 효과", imageUrl: "https://placehold.co/800x600/F0FDF4/059669?text=Clinical+Result", annotations: [{ text: "결 밀도 +42%" }, { text: "수분량 +73%" }, { text: "탄력 +28%" }], mood: "clean", brandColor: "#059669", layoutId: "FD-B" });
const fd_c = renderFD({ sectionId: "08", eyebrow: "TECHNOLOGY", headline: "마이크로 전달 시스템", body: "독자 개발 나노 캡슐이 유효 성분을 피부 깊이 전달합니다.", stat: { number: "73.4", unit: "%", label: "흡수율 (임상 기준)" }, mood: "dark", brandColor: "#7C3AED", layoutId: "FD-C" });

// T12
const bn_a = renderBN({ headline: "세트 구성", mood: "clean", brandColor: "#059669", items: [
  { name: "본품 120ml", quantity: 1, imageUrl: "https://placehold.co/200x200/ECFDF5/059669?text=Main", badge: "본품" },
  { name: "미니 30ml", quantity: 1, imageUrl: "https://placehold.co/200x200/ECFDF5/059669?text=Mini" },
  { name: "마스크 5매", quantity: 1, imageUrl: "https://placehold.co/200x200/ECFDF5/059669?text=Mask", badge: "증정" },
], totalValue: "89,000원", salePrice: "59,000원", cta: { text: "세트 구매하기" } });
const bn_b = renderBN({ headline: "프리미엄 번들", mood: "dark", brandColor: "#D97706", items: [
  { name: "프리미엄 세럼", quantity: 1, imageUrl: "https://placehold.co/300x300/FEF3C7/D97706?text=Serum", badge: "메인" },
  { name: "클렌저", quantity: 1 }, { name: "토너", quantity: 1 }, { name: "크림", quantity: 1 },
  { name: "마스크팩 10매", quantity: 1, badge: "증정" }, { name: "파우치", quantity: 1 },
], totalValue: "210,000원", salePrice: "129,000원", cta: { text: "번들 구매" } });

// T5
const ls_a = renderLS({ headline: "아침을 여는 루틴", subheadline: "하루의 시작을 부드럽게", images: [{ url: "https://placehold.co/800x500/FFF7ED/D97706?text=Morning+Routine", caption: "모닝 케어" }], tags: ["아침 루틴", "데일리 케어", "5분 완성"], mood: "soft", brandColor: "#D97706" });
const ls_b = renderLS({ headline: "일상 속 특별함", subheadline: "바쁜 하루에도 나를 위한 시간은 필요합니다. 간단한 루틴으로 하루를 마무리하세요.", images: [{ url: "https://placehold.co/600x800/F0F9FF/3B82F6?text=Evening" }], tags: ["저녁 루틴"], mood: "clean", brandColor: "#3B82F6" });
const ls_c = renderLS({ headline: "다양한 순간", images: [
  { url: "https://placehold.co/400x400/FEF3C7/D97706?text=Scene+1", caption: "출근길" },
  { url: "https://placehold.co/400x400/ECFDF5/059669?text=Scene+2", caption: "카페에서" },
  { url: "https://placehold.co/400x400/EDE9FE/7C3AED?text=Scene+3", caption: "운동 후" },
  { url: "https://placehold.co/400x400/FEE2E2/DC2626?text=Scene+4", caption: "여행 중" },
], tags: ["멀티유즈", "올시즌"], mood: "soft", brandColor: "#7C3AED" });

const files = [
  { name: "fd-a-right.html", html: fd_a, title: "FD-A 이미지 우측 (03)", css: featureDetailStyles },
  { name: "fd-a-left.html", html: fd_a2, title: "FD-A 이미지 좌측 (04)", css: featureDetailStyles },
  { name: "fd-b-overlay.html", html: fd_b, title: "FD-B 풀블리드 오버레이 (05)", css: featureDetailStyles },
  { name: "fd-c-stat.html", html: fd_c, title: "FD-C 수치 강조 dark (08)", css: featureDetailStyles },
  { name: "bn-a-grid.html", html: bn_a, title: "BN-A 그리드 (19)", css: bundleStyles },
  { name: "bn-b-main.html", html: bn_b, title: "BN-B 메인+서브 dark (22)", css: bundleStyles },
  { name: "ls-a-hero.html", html: ls_a, title: "LS-A 풀블리드 soft (10)", css: lifestyleStyles },
  { name: "ls-b-split.html", html: ls_b, title: "LS-B 분할 clean (21)", css: lifestyleStyles },
  { name: "ls-c-collage.html", html: ls_c, title: "LS-C 콜라주 soft", css: lifestyleStyles },
];

for (const f of files) { writeFileSync(join(OUT, f.name), wrap(f.title, f.css, f.html), "utf-8"); console.log(`✅ ${f.name}`); }
const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>T2+T12+T5</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:24px}a{display:block;padding:16px;margin-bottom:8px;background:#f5f5f5;border-radius:12px;text-decoration:none;color:#333;font-weight:700}a:hover{background:#e8e8e8}span{font-weight:400;color:#888;font-size:14px}</style></head><body><h1>T2 Feature Detail + T12 Bundle + T5 Lifestyle</h1>${files.map(f => `<a href="${f.name}">${f.title} <span>→ ${f.name}</span></a>`).join("")}</body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
