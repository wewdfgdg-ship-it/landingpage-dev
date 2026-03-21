/**
 * 풀 랜딩페이지 — 6개 섹션 조합
 * 03 Feature Detail → 02 Key Features → 12 FAQ → 16 Stats → 13 Reviews → 15 CTA
 */
import { renderSection as renderFD } from "../src/engine/sections/common-feature-detail/index";
import { featureDetailStyles } from "../src/engine/sections/common-feature-detail/styles";
import { renderSection as renderKF } from "../src/engine/sections/02-key-features/index";
import { keyFeaturesStyles } from "../src/engine/sections/02-key-features/styles";
import { renderSection as renderFaq } from "../src/engine/sections/common-faq/index";
import { faqStyles } from "../src/engine/sections/common-faq/styles";
import { renderSection as renderStats } from "../src/engine/sections/common-stats/index";
import { statsStyles } from "../src/engine/sections/common-stats/styles";
import { renderSection as renderReviews } from "../src/engine/sections/common-reviews/index";
import { reviewsStyles } from "../src/engine/sections/common-reviews/styles";
import { renderSection as renderCta } from "../src/engine/sections/common-cta/index";
import { ctaStyles } from "../src/engine/sections/common-cta/styles";
import { sectionTokenCSS } from "../src/engine/sections/common-tokens/tokens";
import { globalCtaCSS } from "../src/engine/sections/common-tokens/cta";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/full-page");
mkdirSync(OUT, { recursive: true });

const BRAND = "#2563EB";

const s1 = renderFD({
  sectionId: "03-feature-detail", eyebrow: "POINT 01", headline: "5중 보습 레이어 시스템",
  body: "피부 깊숙이 침투하는 히알루론산 복합체가 5겹의 보습 장벽을 형성합니다. 외부 자극으로부터 피부를 보호하면서 24시간 촉촉함을 유지합니다.",
  bulletPoints: ["표피층 즉각 수분 공급", "진피층 장기 보습 유지", "각질층 보호막 강화"],
  imageUrl: "https://placehold.co/600x500/E0F2FE/2563EB?text=5-Layer+System",
  mood: "clean", brandColor: BRAND,
});

const s2 = renderKF({
  eyebrow: "WHY CHOOSE US", headline: "핵심 기능 3가지",
  subheadline: "한눈에 이해되는 강점만 정리합니다.",
  mood: "clean", brandColor: BRAND,
  features: [
    { title: "빠른 흡수", description: "바르는 즉시 피부에 스며드는 워터 텍스처", icon: "⚡" },
    { title: "장기 보습", description: "72시간 지속되는 수분 장벽", icon: "💧" },
    { title: "저자극", description: "민감성 피부 임상 테스트 완료", icon: "🛡️" },
  ],
});

const s3 = renderFaq({
  sectionId: "12-faq", eyebrow: "FAQ", headline: "자주 묻는 질문",
  subheadline: "구매 전 궁금한 점을 확인하세요.",
  mood: "clean", brandColor: BRAND,
  items: [
    { question: "배송은 얼마나 걸리나요?", answer: "결제 완료 후 1~2영업일 내 출고됩니다." },
    { question: "교환/환불은 어떻게 하나요?", answer: "수령 후 30일 이내 무조건 교환/반품 가능합니다." },
    { question: "민감성 피부에도 사용 가능한가요?", answer: "저자극 테스트 완료 비건 인증 제품입니다." },
    { question: "유통기한은 어떻게 되나요?", answer: "제조일로부터 24개월입니다." },
    { question: "해외 배송도 가능한가요?", answer: "현재 국내 배송만 지원합니다." },
  ],
});

const s4 = renderStats({
  sectionId: "16-stats", eyebrow: "PROVEN RESULTS", headline: "숫자로 증명합니다",
  mood: "dark", brandColor: BRAND,
  stats: [
    { number: "72", unit: "시간", label: "보습 지속력" },
    { number: "4.8", unit: "점", label: "고객 평점" },
    { number: "2,847", unit: "건", label: "실구매 리뷰" },
  ],
  source: "※ 2024년 자체 임상 기준",
});

const s5 = renderReviews({
  sectionId: "13-reviews", headline: "고객이 직접 말합니다",
  averageRating: 4.8, totalCount: 2847,
  mood: "clean", brandColor: BRAND,
  reviews: [
    { quote: "사용 후 피부결이 확실히 달라졌어요.", author: "김○○", meta: "30대 · 민감성", rating: 5, tags: ["재구매", "추천"] },
    { quote: "속건조가 사라졌습니다. 인생템!", author: "이○○", meta: "40대 · 건성", rating: 5 },
    { quote: "가격 대비 성능이 훌륭해요.", author: "박○○", meta: "20대 · 복합성", rating: 4 },
  ],
});

const s6 = renderCta({
  sectionId: "15-cta", badge: "🎁 첫 구매 한정",
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
  mood: "dark", brandColor: BRAND,
});

const allCSS = [featureDetailStyles, keyFeaturesStyles, faqStyles, statsStyles, reviewsStyles, ctaStyles].join("\n");
const allSections = [s1, s2, s3, s4, s5, s6].join("\n");

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>라네즈 워터슬리핑마스크 — 풀 페이지</title>
  <style>
${sectionTokenCSS}
${globalCtaCSS}
${allCSS}
  </style>
</head>
<body>
  <div style="max-width:960px;margin:0 auto;">
    ${allSections}
  </div>
</body>
</html>`;

writeFileSync(join(OUT, "index.html"), html, "utf-8");
console.log(`✅ ${join(OUT, "index.html")}`);
