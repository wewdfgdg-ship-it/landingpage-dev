/**
 * 섹션 조합 프리셋 5종
 * 같은 제품(뷰티 세럼)으로 5가지 다른 조합을 보여줌
 */
import { renderSection as renderFD } from "../src/engine/sections/common-feature-detail/index";
import { featureDetailStyles } from "../src/engine/sections/common-feature-detail/styles";
import { renderSection as renderKF } from "../src/engine/sections/02-key-features/index";
import { keyFeaturesStyles } from "../src/engine/sections/02-key-features/styles";
import { renderSection as renderSI } from "../src/engine/sections/common-spec-info/index";
import { specInfoStyles } from "../src/engine/sections/common-spec-info/styles";
import { renderSection as renderFaq } from "../src/engine/sections/common-faq/index";
import { faqStyles } from "../src/engine/sections/common-faq/styles";
import { renderSection as renderStats } from "../src/engine/sections/common-stats/index";
import { statsStyles } from "../src/engine/sections/common-stats/styles";
import { renderSection as renderReviews } from "../src/engine/sections/common-reviews/index";
import { reviewsStyles } from "../src/engine/sections/common-reviews/styles";
import { renderSection as renderCta } from "../src/engine/sections/common-cta/index";
import { ctaStyles } from "../src/engine/sections/common-cta/styles";
import { renderSection as renderBA } from "../src/engine/sections/common-before-after/index";
import { beforeAfterStyles } from "../src/engine/sections/common-before-after/styles";
import { renderSection as renderTR } from "../src/engine/sections/common-trust/index";
import { trustStyles } from "../src/engine/sections/common-trust/styles";
import { renderSection as renderBN } from "../src/engine/sections/common-bundle/index";
import { bundleStyles } from "../src/engine/sections/common-bundle/styles";
import { renderSection as renderPR } from "../src/engine/sections/common-pricing/index";
import { pricingStyles } from "../src/engine/sections/common-pricing/styles";
import { renderSection as renderLS } from "../src/engine/sections/common-lifestyle/index";
import { lifestyleStyles } from "../src/engine/sections/common-lifestyle/styles";
import { renderSection as renderCM } from "../src/engine/sections/common-comparison/index";
import { comparisonStyles } from "../src/engine/sections/common-comparison/styles";
import { renderSection as renderPH } from "../src/engine/sections/common-photo-review/index";
import { photoReviewStyles } from "../src/engine/sections/common-photo-review/styles";
import { renderSection as renderPL } from "../src/engine/sections/common-promo/index";
import { promoStyles } from "../src/engine/sections/common-promo/styles";
import { sectionTokenCSS } from "../src/engine/sections/common-tokens/tokens";
import { globalCtaCSS } from "../src/engine/sections/common-tokens/cta";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/combo-presets");
mkdirSync(OUT, { recursive: true });

const allCSS = [featureDetailStyles, keyFeaturesStyles, specInfoStyles, faqStyles, statsStyles, reviewsStyles, ctaStyles, beforeAfterStyles, trustStyles, bundleStyles, pricingStyles, lifestyleStyles, comparisonStyles, photoReviewStyles, promoStyles].join("\n");
const B = "#2563EB";

function buildPage(title: string, subtitle: string, sections: string[]): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${sectionTokenCSS}\n${globalCtaCSS}\n${allCSS}</style>
</head>
<body>
  <div style="max-width:960px;margin:0 auto;">
    <div style="padding:40px 20px 0;text-align:center;font-family:var(--s-font);">
      <p style="font-size:12px;font-weight:700;letter-spacing:0.14em;color:${B};text-transform:uppercase;margin-bottom:8px;">${subtitle}</p>
    </div>
    ${sections.join("\n")}
  </div>
</body>
</html>`;
}

// ═══ 공통 섹션 데이터 ═══
const fd1 = (mood: string) => renderFD({ sectionId: "03", eyebrow: "POINT 01", headline: "5중 보습 레이어 시스템", body: "히알루론산 복합체가 5겹의 보습 장벽을 형성합니다.", bulletPoints: ["표피층 즉각 수분", "진피층 장기 보습", "각질층 보호막"], imageUrl: "https://placehold.co/600x500/E0F2FE/2563EB?text=5-Layer", mood, brandColor: B });
const fd2 = (mood: string) => renderFD({ sectionId: "04", eyebrow: "POINT 02", headline: "나이아신아마이드 10%", body: "피부 톤을 균일하게 정돈하고 모공을 관리합니다.", imageUrl: "https://placehold.co/600x500/DBEAFE/2563EB?text=Niacinamide", mood, brandColor: B, imageRight: false });
const fd3 = (mood: string) => renderFD({ sectionId: "05", eyebrow: "POINT 03", headline: "임상 검증된 효과", body: "독립 기관 임상 테스트에서 73.4% 보습 개선 효과가 입증되었습니다.", stat: { number: "73.4", unit: "%", label: "보습 개선률" }, mood, brandColor: B, layoutId: "FD-C" });
const kf = (mood: string) => renderKF({ eyebrow: "WHY CHOOSE US", headline: "핵심 기능 3가지", mood, brandColor: B, features: [
  { title: "빠른 흡수", description: "워터 텍스처, 즉시 흡수", icon: "⚡" },
  { title: "72시간 보습", description: "임상 테스트 완료", icon: "💧" },
  { title: "저자극", description: "민감성 피부 OK", icon: "🛡️" },
]});
const stats = () => renderStats({ eyebrow: "PROVEN", headline: "숫자로 증명합니다", mood: "dark", brandColor: B, stats: [
  { number: "72", unit: "시간", label: "보습 지속" },
  { number: "4.8", unit: "점", label: "평점" },
  { number: "2,847", unit: "건", label: "리뷰" },
], source: "※ 2024 임상 기준" });
const trust = () => renderTR({ headline: "인증 및 수상", awards: [
  { name: "올리브영 1위", icon: "🏆", description: "3년 연속" },
  { name: "식약처 인증", icon: "🏅" },
  { name: "뷰티어워드", icon: "🥇" },
  { name: "비건 인증", icon: "🌿" },
], mood: "dark", brandColor: B });
const ba = () => renderBA({ headline: "4주 전후 비교", beforeImageUrl: "https://placehold.co/400x400/FEE2E2/999?text=Before", afterImageUrl: "https://placehold.co/400x400/DBEAFE/2563EB?text=After", stat: { number: "73.4", unit: "%", label: "개선률" }, mood: "clean", brandColor: B, layoutId: "BA-C" });
const specs = () => renderSI({ sectionId: "06", eyebrow: "SPECS", headline: "상세 사양", mood: "clean", brandColor: B, items: [
  { label: "용량", value: "120ml" },
  { label: "주요 성분", value: "히알루론산, 나이아신아마이드", badge: "핵심" },
  { label: "피부 타입", value: "모든 피부" },
  { label: "유통기한", value: "24개월" },
  { label: "원산지", value: "대한민국" },
]});
const howto = () => renderSI({ sectionId: "07", eyebrow: "HOW TO USE", headline: "사용 방법", mood: "clean", brandColor: B, numbered: true, items: [
  { label: "세안", description: "미온수로 얼굴을 깨끗이 씻어줍니다." },
  { label: "도포", description: "적당량을 얼굴 전체에 펴 발라줍니다." },
  { label: "흡수", description: "5분간 가볍게 두드려 흡수시킵니다." },
]});
const bundle = () => renderBN({ headline: "세트 구성", mood: "clean", brandColor: B, items: [
  { name: "본품 120ml", quantity: 1, imageUrl: "https://placehold.co/200x200/DBEAFE/2563EB?text=Main", badge: "본품" },
  { name: "미니 30ml", quantity: 1, imageUrl: "https://placehold.co/200x200/DBEAFE/2563EB?text=Mini" },
  { name: "마스크 5매", quantity: 1, imageUrl: "https://placehold.co/200x200/DBEAFE/2563EB?text=Mask", badge: "증정" },
], totalValue: "89,000원", salePrice: "59,000원", cta: { text: "세트 구매" } });
const reviews = () => renderReviews({ headline: "고객 후기", averageRating: 4.8, totalCount: 2847, mood: "clean", brandColor: B, reviews: [
  { quote: "피부결이 확실히 달라졌어요.", author: "김○○", meta: "30대", rating: 5, tags: ["재구매"] },
  { quote: "속건조가 사라졌습니다.", author: "이○○", meta: "40대", rating: 5 },
  { quote: "가격 대비 훌륭해요.", author: "박○○", meta: "20대", rating: 4 },
]});
const photoRv = () => renderPH({ headline: "포토 리뷰", totalCount: 1200, mood: "clean", brandColor: B, reviews: [
  { imageUrl: "https://placehold.co/300x300/DBEAFE/2563EB?text=Photo1", quote: "텍스처 최고", author: "A", rating: 5 },
  { imageUrl: "https://placehold.co/300x300/DBEAFE/2563EB?text=Photo2", quote: "촉촉함 지속", author: "B", rating: 5 },
  { imageUrl: "https://placehold.co/300x300/DBEAFE/2563EB?text=Photo3", quote: "선물용 추천", author: "C", rating: 5 },
  { imageUrl: "https://placehold.co/300x300/DBEAFE/2563EB?text=Photo4", quote: "데일리 필수", author: "D", rating: 4 },
  { imageUrl: "https://placehold.co/300x300/DBEAFE/2563EB?text=Photo5", author: "E", rating: 5 },
  { imageUrl: "https://placehold.co/300x300/DBEAFE/2563EB?text=Photo6", author: "F", rating: 5 },
]});
const faq = () => renderFaq({ eyebrow: "FAQ", headline: "자주 묻는 질문", mood: "clean", brandColor: B, items: [
  { question: "배송은 얼마나 걸리나요?", answer: "결제 후 1~2영업일 내 출고됩니다." },
  { question: "민감성 피부에도 사용 가능한가요?", answer: "저자극 비건 인증 제품입니다." },
  { question: "환불 가능한가요?", answer: "30일 이내 무조건 환불 가능합니다." },
  { question: "유통기한은?", answer: "제조일로부터 24개월입니다." },
]});
const compare = () => renderCM({ headline: "왜 이 제품인가", ourName: "워터슬리핑마스크", theirName: "일반 수분크림", mood: "clean", brandColor: B, rows: [
  { label: "히알루론산", ours: "5중 복합", theirs: "단일" },
  { label: "보습 지속", ours: "72시간", theirs: "8시간" },
  { label: "임상 인증", ours: "✅", theirs: "❌" },
  { label: "비건 인증", ours: "✅", theirs: "❌" },
  { label: "가격", ours: "29,000원", theirs: "35,000원" },
]});
const lifestyle = () => renderLS({ headline: "나만의 스킨케어 루틴", subheadline: "하루의 마무리를 부드럽게", images: [{ url: "https://placehold.co/800x500/E0F2FE/2563EB?text=Evening+Routine", caption: "나이트 케어" }], tags: ["저녁 루틴", "수면 중 관리"], mood: "soft", brandColor: B });
const pricing = () => renderPR({ headline: "가격 안내", originalPrice: "39,000원", salePrice: "29,000원", discount: "25%", mood: "clean", brandColor: B, benefits: [
  { icon: "📦", text: "무료배송" },
  { icon: "🔄", text: "30일 환불" },
  { icon: "🎁", text: "미니 증정" },
], cta: { text: "지금 구매" }, microCopy: "오늘 주문 시 내일 도착" });
const promo = () => renderPL({ deadline: "오늘 자정 마감", headline: "한정 특가", subheadline: "이 가격은 다시 없습니다", stockPercent: 73, cta: { text: "특가 구매" }, microCopy: "잔여 수량 소진 시 조기 마감", mood: "dark", brandColor: "#DC2626" });
const ctaBasic = () => renderCta({ headline: "지금 시작하세요", subheadline: "30일 환불 보장", cta: { text: "구매하기" }, microCopy: "무료배송 · 당일출고", mood: "dark", brandColor: B });
const ctaFull = () => renderCta({ badge: "🎁 첫 구매 한정", headline: "지금 시작하면 특별 혜택", subheadline: "30일 내 전액 환불", body: "12,000명이 선택한 프리미엄 스킨케어.", benefits: [
  { icon: "📦", text: "무료배송" },
  { icon: "🔄", text: "30일 환불 보장" },
  { icon: "🎁", text: "미니 3종 증정" },
  { icon: "💰", text: "5% 적립" },
], cta: { text: "혜택 받고 구매하기" }, secondaryAction: { text: "더 알아보기" }, microCopy: "한정 수량 소진 시 조기 마감", mood: "dark", brandColor: B });
const shipping = () => renderSI({ sectionId: "14", eyebrow: "DELIVERY", headline: "배송 안내", mood: "clean", brandColor: B, items: [
  { label: "배송비", value: "무료", icon: "📦", badge: "무료" },
  { label: "소요 기간", value: "1~2일", icon: "🚚" },
  { label: "도서산간", value: "+3,000원", icon: "🏝️" },
]});

// ═══════════════════════════════════════════
// COMBO 1: 기본형 (Standard) — 가장 보편적인 구성
// FD → KF → Specs → Reviews → FAQ → CTA
// ═══════════════════════════════════════════
const combo1 = [
  fd1("clean"),
  kf("clean"),
  specs(),
  reviews(),
  faq(),
  ctaBasic(),
];

// ═══════════════════════════════════════════
// COMBO 2: 설득형 (Persuasion) — 근거 강화
// FD×2 → Stats → BA → Trust → Reviews → CTA
// ═══════════════════════════════════════════
const combo2 = [
  fd1("clean"),
  fd2("clean"),
  stats(),
  ba(),
  trust(),
  reviews(),
  ctaFull(),
];

// ═══════════════════════════════════════════
// COMBO 3: 감성형 (Emotional) — 라이프스타일 중심
// Lifestyle → FD → KF → PhotoReview → FAQ → CTA
// ═══════════════════════════════════════════
const combo3 = [
  lifestyle(),
  fd1("clean"),
  kf("soft"),
  photoRv(),
  faq(),
  ctaBasic(),
];

// ═══════════════════════════════════════════
// COMBO 4: 프로모형 (Promo) — 할인/긴급성 중심
// Promo → FD → Bundle → Compare → Reviews → Pricing → CTA
// ═══════════════════════════════════════════
const combo4 = [
  promo(),
  fd1("clean"),
  bundle(),
  compare(),
  reviews(),
  pricing(),
  ctaFull(),
];

// ═══════════════════════════════════════════
// COMBO 5: 풀스펙형 (Full) — 모든 섹션 동원
// FD×3 → KF → BA → Stats → Trust → Specs → HowTo → Bundle → Lifestyle → Compare → Reviews → PhotoRv → Shipping → FAQ → CTA
// ═══════════════════════════════════════════
const combo5 = [
  fd1("clean"),
  fd2("clean"),
  fd3("clean"),
  kf("clean"),
  ba(),
  stats(),
  trust(),
  specs(),
  howto(),
  bundle(),
  lifestyle(),
  compare(),
  reviews(),
  photoRv(),
  shipping(),
  faq(),
  ctaFull(),
];

// ═══ 생성 ═══
const pages = [
  { name: "combo1-standard.html", sections: combo1, title: "COMBO 1: 기본형", sub: "STANDARD · 6 SECTIONS" },
  { name: "combo2-persuasion.html", sections: combo2, title: "COMBO 2: 설득형", sub: "PERSUASION · 7 SECTIONS" },
  { name: "combo3-emotional.html", sections: combo3, title: "COMBO 3: 감성형", sub: "EMOTIONAL · 6 SECTIONS" },
  { name: "combo4-promo.html", sections: combo4, title: "COMBO 4: 프로모형", sub: "PROMO · 7 SECTIONS" },
  { name: "combo5-full.html", sections: combo5, title: "COMBO 5: 풀스펙형", sub: "FULL SPEC · 17 SECTIONS" },
];

for (const p of pages) {
  writeFileSync(join(OUT, p.name), buildPage(p.title, p.sub, p.sections), "utf-8");
  console.log(`✅ ${p.name} (${p.sections.length}개 섹션)`);
}

const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>조합 프리셋 5종</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:8px}p{color:#666;margin-bottom:24px;font-size:14px;line-height:1.6}a{display:block;padding:20px;margin-bottom:10px;border:1px solid #e5e7eb;border-radius:16px;text-decoration:none;color:#111;transition:all 0.2s}a:hover{border-color:#2563EB;transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,99,235,0.1)}strong{display:block;font-size:17px;margin-bottom:4px}span{font-size:13px;color:#666}em{font-style:normal;font-size:12px;color:#2563EB;font-weight:700}</style></head><body><h1>섹션 조합 프리셋 5종</h1><p>같은 제품(뷰티 세럼), 다른 조합. 섹션 수와 구성만 다르게.</p>${pages.map(p => `<a href="${p.name}"><strong>${p.title}</strong><em>${p.sub}</em><span>${p.name}</span></a>`).join("")}</body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
