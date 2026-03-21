/**
 * 기준작 3개 — CTA 역할 분리 최종 (클린 버전)
 */
import { renderSection as renderFD } from "../src/engine/sections/common-feature-detail/index";
import { featureDetailStyles } from "../src/engine/sections/common-feature-detail/styles";
import { renderSection as renderFaq } from "../src/engine/sections/common-faq/index";
import { faqStyles } from "../src/engine/sections/common-faq/styles";
import { renderSection as renderCtaSection } from "../src/engine/sections/common-cta/index";
import { ctaStyles } from "../src/engine/sections/common-cta/styles";
import { sectionTokenCSS } from "../src/engine/sections/common-tokens/tokens";
import { globalCtaCSS, renderGlobalCtaGroup } from "../src/engine/sections/common-tokens/cta";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/reference-test");
mkdirSync(OUT, { recursive: true });

// ── 03 Feature Detail — CTA 없음 ──
const fd = renderFD({
  sectionId: "03-feature-detail",
  eyebrow: "POINT 01",
  headline: "5중 보습 레이어 시스템",
  body: "피부 깊숙이 침투하는 히알루론산 복합체가 5겹의 보습 장벽을 형성합니다. 외부 자극으로부터 피부를 보호하면서 24시간 촉촉함을 유지합니다.",
  bulletPoints: ["표피층 즉각 수분 공급", "진피층 장기 보습 유지", "각질층 보호막 강화"],
  imageUrl: "https://placehold.co/600x500/E0F2FE/2563EB?text=5-Layer+System",
  mood: "clean",
  brandColor: "#2563EB",
});

// ── 12 FAQ — ghost CTA ──
const faqBase = renderFaq({
  sectionId: "12-faq",
  eyebrow: "FAQ",
  headline: "자주 묻는 질문",
  subheadline: "구매 전 궁금한 점을 확인하세요.",
  mood: "clean",
  brandColor: "#2563EB",
  items: [
    { question: "배송은 얼마나 걸리나요?", answer: "결제 완료 후 1~2영업일 내 출고됩니다." },
    { question: "교환/환불은 어떻게 하나요?", answer: "수령 후 30일 이내 무조건 교환/반품 가능합니다." },
    { question: "민감성 피부에도 사용 가능한가요?", answer: "저자극 테스트 완료 비건 인증 제품입니다." },
    { question: "유통기한은 어떻게 되나요?", answer: "제조일로부터 24개월입니다." },
    { question: "해외 배송도 가능한가요?", answer: "현재 국내 배송만 지원합니다." },
  ],
});
const faqGhost = renderGlobalCtaGroup({ text: "1:1 문의하기", variant: "ghost" });
const faq = faqBase.replace('</div>\n</section>', `${faqGhost}</div>\n</section>`);

// ── 15 CTA — primary + secondary (공통 CTA 사용, 내장 CTA도 공통) ──
const cta = renderCtaSection({
  sectionId: "15-cta",
  badge: "🎁 첫 구매 한정",
  headline: "지금 시작하면 특별 혜택",
  subheadline: "30일 내 마음에 안 들면 전액 환불",
  body: "이미 12,000명이 선택한 프리미엄 스킨케어. 지금 구매하시면 아래 혜택을 모두 받으실 수 있습니다.",
  benefits: [
    { icon: "📦", text: "전 상품 무료배송" },
    { icon: "🔄", text: "30일 무조건 환불 보장" },
    { icon: "🎁", text: "미니 사이즈 3종 증정 (15,000원 상당)" },
    { icon: "💰", text: "다음 구매 시 5% 적립" },
  ],
  cta: { text: "혜택 받고 구매하기" },
  secondaryAction: { text: "더 알아보기" },
  microCopy: "한정 수량 소진 시 조기 마감될 수 있습니다",
  mood: "dark",
  brandColor: "#2563EB",
});

const fullPage = `${fd}\n${faq}\n${cta}`;

function buildHtml(title: string, content: string, styles: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
${sectionTokenCSS}
${globalCtaCSS}
${styles}
  </style>
</head>
<body>
  <div style="max-width:960px;margin:0 auto;">
    ${content}
  </div>
</body>
</html>`;
}

const allCSS = `${featureDetailStyles}\n${faqStyles}\n${ctaStyles}`;

const files = [
  { name: "fd-reference.html", html: buildHtml("03 Spec", fd, featureDetailStyles), title: "03 Spec — CTA 없음" },
  { name: "faq-reference.html", html: buildHtml("12 FAQ", faq, faqStyles), title: "12 FAQ — ghost CTA" },
  { name: "cta-reference.html", html: buildHtml("15 CTA", cta, ctaStyles), title: "15 CTA — primary + secondary" },
  { name: "full-page.html", html: buildHtml("풀 페이지", fullPage, allCSS), title: "풀 페이지 최종" },
];

for (const f of files) {
  writeFileSync(join(OUT, f.name), f.html, "utf-8");
  console.log(`✅ ${f.name}`);
}

const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>Reference</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:8px}p{color:#666;margin-bottom:24px;font-size:14px;line-height:1.6}a{display:block;padding:16px;margin-bottom:8px;background:#f5f5f5;border-radius:12px;text-decoration:none;color:#333;font-weight:700}a:hover{background:#e8e8e8}span{font-weight:400;color:#888;font-size:14px}.hl{background:#2563EB;color:#fff}.hl:hover{background:#1d4ed8}</style></head><body><h1>기준작 최종</h1><p>03: CTA 없음 · 12: ghost · 15: primary+secondary</p>${files.map((f) => `<a href="${f.name}" class="${f.name === "full-page.html" ? "hl" : ""}">${f.title} <span>→ ${f.name}</span></a>`).join("")}</body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
