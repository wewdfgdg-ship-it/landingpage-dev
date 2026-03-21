/**
 * 업종별 풀 랜딩페이지 3개 — 뷰티 / 식품 / 테크
 * 각 페이지에 10~12개 섹션 조합
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
import { sectionTokenCSS } from "../src/engine/sections/common-tokens/tokens";
import { globalCtaCSS } from "../src/engine/sections/common-tokens/cta";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/industry-pages");
mkdirSync(OUT, { recursive: true });

const allCSS = [featureDetailStyles, keyFeaturesStyles, specInfoStyles, faqStyles, statsStyles, reviewsStyles, ctaStyles, beforeAfterStyles, trustStyles, bundleStyles, pricingStyles, lifestyleStyles].join("\n");

function buildPage(title: string, sections: string[]): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
${sectionTokenCSS}
${globalCtaCSS}
${allCSS}
  </style>
</head>
<body>
  <div style="max-width:960px;margin:0 auto;">
    ${sections.join("\n")}
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════
// 1. 뷰티 — 라네즈 워터슬리핑마스크
// ═══════════════════════════════════════════
const B = "#2563EB";
const beauty = [
  // 03 Feature Detail
  renderFD({ sectionId: "03", eyebrow: "POINT 01", headline: "5중 보습 레이어 시스템", body: "피부 깊숙이 침투하는 히알루론산 복합체가 5겹의 보습 장벽을 형성합니다.", bulletPoints: ["표피층 즉각 수분 공급", "진피층 장기 보습 유지", "각질층 보호막 강화"], imageUrl: "https://placehold.co/600x500/E0F2FE/2563EB?text=5-Layer", mood: "clean", brandColor: B }),
  // 04 Feature Detail 2
  renderFD({ sectionId: "04", eyebrow: "POINT 02", headline: "나이아신아마이드 10%", body: "피부 톤을 균일하게 정돈하고 모공을 관리합니다. 자극 없이 밝고 매끄러운 피부를 만듭니다.", imageUrl: "https://placehold.co/600x500/DBEAFE/2563EB?text=Niacinamide", mood: "clean", brandColor: B, imageRight: false }),
  // 02 Key Features
  renderKF({ eyebrow: "WHY CHOOSE US", headline: "핵심 기능 3가지", subheadline: "한눈에 이해되는 강점만 정리합니다.", mood: "clean", brandColor: B, features: [
    { title: "빠른 흡수", description: "바르는 즉시 피부에 스며드는 워터 텍스처", icon: "⚡" },
    { title: "72시간 보습", description: "임상 테스트 완료, 장기 수분 유지", icon: "💧" },
    { title: "저자극", description: "민감성 피부 임상 테스트 완료", icon: "🛡️" },
  ]}),
  // 09 Before/After
  renderBA({ headline: "4주 사용 전후 비교", beforeImageUrl: "https://placehold.co/400x400/FEE2E2/999?text=BEFORE", afterImageUrl: "https://placehold.co/400x400/DBEAFE/2563EB?text=AFTER", body: "건조했던 피부가 촉촉하고 탄력 있게 변화", stat: { number: "73.4", unit: "%", label: "보습 개선률" }, mood: "clean", brandColor: B, layoutId: "BA-C" }),
  // 16 Stats
  renderStats({ eyebrow: "PROVEN RESULTS", headline: "숫자로 증명합니다", mood: "dark", brandColor: B, stats: [
    { number: "72", unit: "시간", label: "보습 지속력" },
    { number: "4.8", unit: "점", label: "고객 평점" },
    { number: "2,847", unit: "건", label: "실구매 리뷰" },
  ], source: "※ 2024년 자체 임상 기준" }),
  // 11 Trust
  renderTR({ headline: "인증 및 수상", awards: [
    { name: "올리브영 1위", icon: "🏆", description: "수분크림 부문 3년 연속" },
    { name: "식약처 인증", icon: "🏅" },
    { name: "뷰티어워드 2024", icon: "🥇" },
    { name: "비건 인증", icon: "🌿" },
  ], mood: "dark", brandColor: B }),
  // 06 Specs
  renderSI({ sectionId: "06-specs", eyebrow: "SPECIFICATIONS", headline: "상세 사양", mood: "clean", brandColor: B, items: [
    { label: "용량", value: "120ml" },
    { label: "주요 성분", value: "히알루론산, 나이아신아마이드", badge: "핵심" },
    { label: "피부 타입", value: "모든 피부" },
    { label: "유통기한", value: "24개월", note: "※ 개봉 후 12개월" },
    { label: "원산지", value: "대한민국" },
  ], footnote: "※ 개인차가 있을 수 있습니다." }),
  // 19 Bundle
  renderBN({ headline: "세트 구성", mood: "clean", brandColor: B, items: [
    { name: "워터슬리핑마스크 120ml", quantity: 1, imageUrl: "https://placehold.co/200x200/DBEAFE/2563EB?text=Main", badge: "본품" },
    { name: "미니 세럼 30ml", quantity: 1, imageUrl: "https://placehold.co/200x200/DBEAFE/2563EB?text=Mini" },
    { name: "시트마스크 5매", quantity: 1, imageUrl: "https://placehold.co/200x200/DBEAFE/2563EB?text=Mask", badge: "증정" },
  ], totalValue: "89,000원", salePrice: "59,000원", cta: { text: "세트 구매하기" } }),
  // 13 Reviews
  renderReviews({ headline: "고객이 직접 말합니다", averageRating: 4.8, totalCount: 2847, mood: "clean", brandColor: B, reviews: [
    { quote: "사용 후 피부결이 확실히 달라졌어요. 속건조가 사라졌습니다.", author: "김○○", meta: "30대 · 민감성", rating: 5, tags: ["재구매", "추천"] },
    { quote: "끈적임 없이 스며드는 게 신기해요. 아침까지 촉촉!", author: "이○○", meta: "40대 · 건성", rating: 5 },
    { quote: "가격 대비 성능이 훌륭합니다. 선물용으로도 좋아요.", author: "박○○", meta: "20대 · 복합성", rating: 4 },
  ]}),
  // 12 FAQ
  renderFaq({ eyebrow: "FAQ", headline: "자주 묻는 질문", subheadline: "구매 전 궁금한 점을 확인하세요.", mood: "clean", brandColor: B, items: [
    { question: "배송은 얼마나 걸리나요?", answer: "결제 완료 후 1~2영업일 내 출고, 출고 후 1~2일 수령 가능합니다." },
    { question: "민감성 피부에도 사용 가능한가요?", answer: "저자극 테스트를 완료한 비건 인증 제품입니다." },
    { question: "사용 순서가 어떻게 되나요?", answer: "세안 → 토너 → 세럼 → 슬리핑마스크 순서로 사용하세요." },
    { question: "유통기한은 어떻게 되나요?", answer: "제조일로부터 24개월, 개봉 후 12개월입니다." },
    { question: "환불 가능한가요?", answer: "수령 후 30일 이내 무조건 환불 가능합니다." },
  ]}),
  // 15 CTA
  renderCta({ badge: "🎁 첫 구매 한정", headline: "지금 시작하면 특별 혜택", subheadline: "30일 내 마음에 안 들면 전액 환불", body: "이미 12,000명이 선택한 프리미엄 스킨케어.", benefits: [
    { icon: "📦", text: "전 상품 무료배송" },
    { icon: "🔄", text: "30일 무조건 환불 보장" },
    { icon: "🎁", text: "미니 사이즈 3종 증정" },
    { icon: "💰", text: "다음 구매 시 5% 적립" },
  ], cta: { text: "혜택 받고 구매하기" }, secondaryAction: { text: "더 알아보기" }, microCopy: "한정 수량 소진 시 조기 마감", mood: "dark", brandColor: B }),
];

// ═══════════════════════════════════════════
// 2. 식품 — 곰곰 유기농 토마토즙
// ═══════════════════════════════════════════
const F = "#DC2626";
const food = [
  renderFD({ sectionId: "03", eyebrow: "원재료", headline: "100% 국내산 유기농 토마토", body: "충남 부여 계약 농가에서 완숙 수확한 토마토만 사용합니다. 비닐하우스가 아닌 노지 재배로 일조량을 충분히 받아 당도가 높습니다.", bulletPoints: ["GAP 인증 농가", "수확 당일 착즙", "무농약 재배"], imageUrl: "https://placehold.co/600x500/FEE2E2/DC2626?text=Organic+Tomato", mood: "clean", brandColor: F }),
  renderFD({ sectionId: "04", eyebrow: "공법", headline: "저온 진공 착즙 공법", body: "열을 가하지 않는 저온 진공 방식으로 토마토의 리코펜과 비타민을 최대한 보존합니다.", imageUrl: "https://placehold.co/600x500/FEF2F2/DC2626?text=Cold+Press", mood: "clean", brandColor: F, imageRight: false }),
  renderKF({ eyebrow: "WHY THIS JUICE", headline: "선택해야 하는 이유", mood: "clean", brandColor: F, features: [
    { title: "리코펜 3배", description: "일반 토마토즙 대비 리코펜 함량 3배", icon: "🍅" },
    { title: "무첨가", description: "설탕, 식품첨가물, 물 일절 무첨가", icon: "🚫" },
    { title: "간편 섭취", description: "1포 = 토마토 3개 분량, 하루 1포면 충분", icon: "📦" },
  ]}),
  renderStats({ eyebrow: "NUTRITION FACTS", headline: "영양 성분", mood: "dark", brandColor: F, stats: [
    { number: "15", unit: "mg", label: "리코펜 함량 (1포)" },
    { number: "0", unit: "g", label: "첨가당" },
    { number: "35", unit: "kcal", label: "칼로리 (1포)" },
  ], source: "※ 식품의약품안전처 기준" }),
  renderBA({ headline: "3개월 섭취 전후", beforeImageUrl: "https://placehold.co/400x400/FEE2E2/999?text=Before", afterImageUrl: "https://placehold.co/400x400/FEF2F2/DC2626?text=After", body: "매일 1포 꾸준히 섭취한 결과", stat: { number: "89", unit: "%", label: "만족도" }, mood: "clean", brandColor: F, layoutId: "BA-C" }),
  renderTR({ headline: "인증", awards: [
    { name: "유기농 인증", icon: "🌱" },
    { name: "HACCP", icon: "✅" },
    { name: "GAP 인증", icon: "🏅" },
  ], mood: "dark", brandColor: F }),
  renderSI({ sectionId: "06-specs", eyebrow: "제품 정보", headline: "상세 스펙", mood: "clean", brandColor: F, items: [
    { label: "내용량", value: "80ml × 30포" },
    { label: "원재료", value: "유기농 토마토 100%", badge: "유기농" },
    { label: "보관", value: "냉장보관 (2~10°C)" },
    { label: "유통기한", value: "제조일로부터 6개월" },
    { label: "원산지", value: "충남 부여" },
  ]}),
  renderBN({ headline: "패키지 구성", mood: "clean", brandColor: F, items: [
    { name: "토마토즙 30포", quantity: 1, imageUrl: "https://placehold.co/200x200/FEE2E2/DC2626?text=30pk", badge: "본품" },
    { name: "미니 5포", quantity: 1, imageUrl: "https://placehold.co/200x200/FEE2E2/DC2626?text=5pk", badge: "증정" },
  ], totalValue: "45,000원", salePrice: "32,900원", cta: { text: "세트 구매" } }),
  renderReviews({ headline: "실구매 후기", averageRating: 4.9, totalCount: 5200, mood: "clean", brandColor: F, reviews: [
    { quote: "아침에 공복으로 한 포 마시면 하루가 개운해요.", author: "정○○", meta: "50대 · 건강관리", rating: 5, tags: ["꾸준구매"] },
    { quote: "토마토 싫어하는 아이도 잘 마셔요. 맛있어요!", author: "한○○", meta: "30대 · 엄마", rating: 5 },
    { quote: "첨가물 없어서 안심하고 먹습니다.", author: "송○○", meta: "40대", rating: 5 },
  ]}),
  renderFaq({ headline: "자주 묻는 질문", mood: "clean", brandColor: F, items: [
    { question: "하루에 몇 포 마시나요?", answer: "1일 1~2포를 권장합니다. 공복 섭취가 흡수율이 높습니다." },
    { question: "아이도 마셔도 되나요?", answer: "만 3세 이상부터 섭취 가능합니다." },
    { question: "냉동 보관해도 되나요?", answer: "냉장보관을 권장하며, 냉동 시 식감이 변할 수 있습니다." },
    { question: "배송은 어떻게 되나요?", answer: "냉장 택배로 발송되며, 결제 후 1~2일 내 출고됩니다." },
  ]}),
  renderCta({ badge: "🔥 오늘만 특가", headline: "지금이 가장 좋은 가격", body: "첫 구매 고객 한정 30% 할인 + 미니팩 증정", benefits: [
    { icon: "🚚", text: "냉장 무료배송" },
    { icon: "🔄", text: "맛 보장, 100% 환불" },
    { icon: "🎁", text: "미니 5포 증정" },
  ], cta: { text: "특가로 구매하기" }, secondaryAction: { text: "성분 더 보기" }, microCopy: "오늘 자정 마감 · 한정 500세트", mood: "dark", brandColor: F }),
];

// ═══════════════════════════════════════════
// 3. 테크 — UGREEN 100W GaN 충전기
// ═══════════════════════════════════════════
const T = "#059669";
const tech = [
  renderFD({ sectionId: "03", eyebrow: "TECHNOLOGY", headline: "GaN III 반도체 기술", body: "3세대 질화갈륨 칩셋으로 기존 충전기 대비 40% 작은 크기에 100W 출력을 실현했습니다.", bulletPoints: ["발열 30% 감소", "효율 93% 달성", "크기 40% 소형화"], imageUrl: "https://placehold.co/600x500/ECFDF5/059669?text=GaN+III", mood: "clean", brandColor: T }),
  renderFD({ sectionId: "04", eyebrow: "DESIGN", headline: "여행에 최적화된 크기", body: "주먹보다 작은 사이즈에 USB-C 3포트 + USB-A 1포트. 어디서든 모든 기기를 충전하세요.", imageUrl: "https://placehold.co/600x500/ECFDF5/059669?text=Compact", mood: "clean", brandColor: T, imageRight: false }),
  renderKF({ eyebrow: "KEY FEATURES", headline: "핵심 스펙 4가지", mood: "clean", brandColor: T, features: [
    { title: "100W 출력", description: "맥북 프로 14인치 완속 충전 가능", icon: "⚡" },
    { title: "4포트 동시", description: "USB-C ×3 + USB-A ×1", icon: "🔌" },
    { title: "안전 인증", description: "KC, FCC, CE 인증 완료", icon: "🛡️" },
    { title: "접이식 플러그", description: "파우치 없이 가방에 바로", icon: "✈️" },
  ]}),
  renderStats({ eyebrow: "PERFORMANCE", headline: "성능 비교", mood: "dark", brandColor: T, stats: [
    { number: "100", unit: "W", label: "최대 출력" },
    { number: "30", unit: "분", label: "아이폰 0→50%" },
    { number: "93", unit: "%", label: "충전 효율" },
  ], source: "※ USB-PD 3.1 기준 자체 측정" }),
  renderLS({ headline: "어디서든 충전", subheadline: "출장, 카페, 공항. 하나면 충분합니다.", images: [{ url: "https://placehold.co/800x500/ECFDF5/059669?text=Travel+Charging", caption: "출장 필수템" }], tags: ["여행", "재택근무", "카페"], mood: "soft", brandColor: T }),
  renderTR({ headline: "글로벌 인증", awards: [
    { name: "KC 인증", icon: "✅" },
    { name: "FCC", icon: "🇺🇸" },
    { name: "CE", icon: "🇪🇺" },
    { name: "MFi", icon: "🍎" },
  ], mood: "dark", brandColor: T }),
  renderSI({ sectionId: "06-specs", eyebrow: "SPECIFICATIONS", headline: "상세 스펙", mood: "clean", brandColor: T, items: [
    { label: "최대 출력", value: "100W" },
    { label: "포트", value: "USB-C ×3 + USB-A ×1" },
    { label: "크기", value: "68 × 68 × 32mm" },
    { label: "무게", value: "218g" },
    { label: "입력", value: "AC 100~240V (해외 겸용)" },
    { label: "프로토콜", value: "PD3.1, QC5.0, PPS" },
  ]}),
  renderReviews({ headline: "사용자 후기", averageRating: 4.7, totalCount: 1890, mood: "clean", brandColor: T, reviews: [
    { quote: "맥북+아이패드+아이폰 동시 충전이 돼요. 짐이 확 줄었습니다.", author: "조○○", meta: "IT 종사자", rating: 5, tags: ["출장필수"] },
    { quote: "이 크기에 100W라니... 기술력이 느껴집니다.", author: "윤○○", meta: "테크 유튜버", rating: 5 },
    { quote: "발열도 적고 안정적이에요. 2개째 구매.", author: "최○○", meta: "디자이너", rating: 4 },
  ]}),
  renderFaq({ headline: "자주 묻는 질문", mood: "clean", brandColor: T, items: [
    { question: "맥북 프로 충전 가능한가요?", answer: "네, 14인치 맥북 프로까지 단독 포트 100W로 완속 충전됩니다." },
    { question: "발열이 심하지 않나요?", answer: "GaN III 칩셋이 발열을 30% 줄여줍니다. 장시간 사용해도 안전합니다." },
    { question: "해외에서도 사용 가능한가요?", answer: "AC 100~240V 프리볼트로 전 세계 어디서든 사용 가능합니다." },
    { question: "보증 기간은?", answer: "구매일로부터 24개월 무상 보증합니다." },
  ]}),
  renderPR({ headline: "가격 안내", originalPrice: "59,000원", salePrice: "42,900원", discount: "27%", mood: "clean", brandColor: T, benefits: [
    { icon: "📦", text: "무료배송" },
    { icon: "🔄", text: "24개월 보증" },
    { icon: "🎁", text: "USB-C 케이블 증정" },
  ], cta: { text: "지금 구매하기" }, microCopy: "오늘 주문 시 내일 도착" }),
  renderCta({ headline: "더 가볍게, 더 빠르게", subheadline: "충전기 하나로 모든 기기를 해결하세요", benefits: [
    { icon: "⚡", text: "100W 초고속 충전" },
    { icon: "✈️", text: "접이식 플러그, 여행 최적화" },
    { icon: "🛡️", text: "KC/FCC/CE 글로벌 인증" },
  ], cta: { text: "구매하기" }, secondaryAction: { text: "스펙 비교하기" }, microCopy: "30일 내 환불 보장", mood: "dark", brandColor: T }),
];

// ═══ 파일 생성 ═══
const pages = [
  { name: "beauty.html", sections: beauty, title: "라네즈 워터슬리핑마스크 — 뷰티" },
  { name: "food.html", sections: food, title: "곰곰 유기농 토마토즙 — 식품" },
  { name: "tech.html", sections: tech, title: "UGREEN 100W GaN 충전기 — 테크" },
];

for (const p of pages) {
  const html = buildPage(p.title, p.sections);
  writeFileSync(join(OUT, p.name), html, "utf-8");
  console.log(`✅ ${p.name} (${p.sections.length}개 섹션)`);
}

const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>업종별 랜딩페이지</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:8px}p{color:#666;margin-bottom:24px;font-size:14px;line-height:1.6}a{display:block;padding:20px;margin-bottom:10px;border-radius:16px;text-decoration:none;color:#fff;font-weight:700;font-size:18px;transition:transform 0.2s}a:hover{transform:translateY(-2px)}span{display:block;font-size:13px;font-weight:400;margin-top:4px;opacity:0.8}.beauty{background:#2563EB}.food{background:#DC2626}.tech{background:#059669}</style></head><body><h1>업종별 풀 랜딩페이지</h1><p>실제 제품 데이터 기반 · 10~12개 섹션 조합 · 토큰 시스템 적용</p><a href="beauty.html" class="beauty">🧴 뷰티 — 라네즈 워터슬리핑마스크<span>12개 섹션 · Feature Detail → Key Features → Before/After → Stats → Trust → Specs → Bundle → Reviews → FAQ → CTA</span></a><a href="food.html" class="food">🍅 식품 — 곰곰 유기농 토마토즙<span>11개 섹션 · Feature Detail ×2 → Key Features → Stats → Before/After → Trust → Specs → Bundle → Reviews → FAQ → CTA</span></a><a href="tech.html" class="tech">⚡ 테크 — UGREEN 100W GaN 충전기<span>11개 섹션 · Feature Detail ×2 → Key Features → Stats → Lifestyle → Trust → Specs → Reviews → FAQ → Pricing → CTA</span></a></body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
