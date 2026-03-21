import { renderSection as renderFaq } from "../src/engine/sections/common-faq/index";
import { faqStyles } from "../src/engine/sections/common-faq/styles";
import { renderSection as renderStats } from "../src/engine/sections/common-stats/index";
import { statsStyles } from "../src/engine/sections/common-stats/styles";
import { renderSection as renderPricing } from "../src/engine/sections/common-pricing/index";
import { pricingStyles } from "../src/engine/sections/common-pricing/styles";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/t7t10t15-test");
mkdirSync(OUT, { recursive: true });

const wrap = (title: string, css: string, html: string) => `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Pretendard',sans-serif;display:flex;justify-content:center;min-height:100vh;background:#f0f0f0}.page{width:100%;max-width:960px}${css}</style></head><body><div class="page">${html}</div></body></html>`;

// T7 FAQ
const faq_a = renderFaq({ headline: "자주 묻는 질문", mood: "clean", brandColor: "#059669", items: [
  { question: "배송은 얼마나 걸리나요?", answer: "결제 완료 후 1~2영업일 내 출고, 출고 후 1~2일 소요됩니다." },
  { question: "교환/환불은 어떻게 하나요?", answer: "수령 후 30일 이내 무조건 교환/반품 가능합니다. 고객센터로 문의해주세요." },
  { question: "사이즈가 안 맞으면?", answer: "동일 상품 1회 무료 교환 가능합니다." },
  { question: "성분이 피부에 안 맞으면?", answer: "전액 환불해드립니다. 사용 후에도 가능합니다." },
  { question: "해외 배송 되나요?", answer: "현재 국내 배송만 지원합니다." },
]});

const faq_b = renderFaq({ headline: "궁금한 점", mood: "dark", brandColor: "#EC4899", items: [
  { question: "유통기한은?", answer: "제조일로부터 24개월" },
  { question: "알레르기 성분?", answer: "글루텐프리, 비건 인증" },
  { question: "복용법?", answer: "하루 1캡슐, 식후 30분" },
]});

const faq_c = renderFaq({ headline: "Quick FAQ", mood: "soft", brandColor: "#7C3AED", layoutId: "FAQ-C", items: [
  { question: "배송비?", answer: "무료" },
  { question: "환불?", answer: "30일 이내" },
  { question: "사이즈?", answer: "프리사이즈" },
  { question: "원산지?", answer: "국내" },
]});

// T10 Stats
const st_a = renderStats({ eyebrow: "PROVEN RESULTS", headline: "숫자로 증명합니다", mood: "dark", brandColor: "#D97706", stats: [
  { number: "72", unit: "시간", label: "보습 지속력" },
  { number: "4.8", unit: "점", label: "고객 평점" },
  { number: "2,847", unit: "건", label: "실구매 리뷰" },
], source: "※ 2024년 자체 임상 기준" });

const st_b = renderStats({ headline: "보습 지속력", mood: "navy", brandColor: "#3B82F6", stats: [
  { number: "73.4", unit: "%", label: "보습 지속률", description: "24시간 임상 테스트 기준" },
  { number: "98", unit: "%", label: "천연 유래" },
  { number: "0", unit: "%", label: "유해 성분" },
]});

const st_c = renderStats({ headline: "핵심 스펙", mood: "dark", brandColor: "#F59E0B", stats: [
  { number: "5000", unit: "mAh", label: "배터리" },
  { number: "6.7", unit: "인치", label: "디스플레이" },
  { number: "120", unit: "Hz", label: "주사율" },
  { number: "65", unit: "W", label: "초고속 충전" },
]});

// T15 Pricing
const pr_a = renderPricing({ discount: "34%", headline: "오늘만 이 가격", originalPrice: "89,000원", salePrice: "58,740원", mood: "clean", brandColor: "#C0392B",
  benefits: [{ icon: "📦", text: "무료배송" }, { icon: "🔄", text: "30일 환불보장" }, { icon: "🎁", text: "미니 사이즈 증정" }],
  cta: { text: "지금 구매하기" }, microCopy: "한정 수량 소진 시 조기 마감" });

const pr_b = renderPricing({ headline: "플랜을 선택하세요", mood: "navy", brandColor: "#7C3AED", plans: [
  { name: "기본", price: "39,000원", period: "/월", benefits: [{ text: "기본 기능" }, { text: "이메일 지원" }], ctaText: "선택" },
  { name: "프로", price: "59,000원", originalPrice: "79,000원", period: "/월", badge: "추천", recommended: true, benefits: [{ text: "기본 기능" }, { text: "우선 지원" }, { text: "고급 분석" }], ctaText: "시작하기" },
  { name: "엔터프라이즈", price: "문의", benefits: [{ text: "전체 기능" }, { text: "전담 매니저" }, { text: "SLA 보장" }], ctaText: "문의하기" },
]});

const pr_c = renderPricing({ headline: "혜택 총 정리", mood: "dark", brandColor: "#D97706", originalPrice: "89,000원", salePrice: "44,000원",
  giftItems: [{ name: "할인", value: "-30,000원" }, { name: "미니세트 증정", value: "+15,000원 상당" }],
  benefits: [{ text: "무료배송" }, { text: "적립 5%" }],
  cta: { text: "혜택 받고 구매" }, microCopy: "실질 구매가 44,000원" });

const files = [
  { name: "faq-a-accordion.html", html: faq_a, title: "FAQ-A 아코디언", css: faqStyles },
  { name: "faq-b-inline.html", html: faq_b, title: "FAQ-B 전체노출 dark", css: faqStyles },
  { name: "faq-c-cards.html", html: faq_c, title: "FAQ-C 카드형 soft", css: faqStyles },
  { name: "st-a-row.html", html: st_a, title: "ST-A 수평 나열 dark", css: statsStyles },
  { name: "st-b-big.html", html: st_b, title: "ST-B 대형 숫자 navy", css: statsStyles },
  { name: "st-c-grid.html", html: st_c, title: "ST-C 카드 그리드 dark", css: statsStyles },
  { name: "pr-a-single.html", html: pr_a, title: "PR-A 가격 전면 clean", css: pricingStyles },
  { name: "pr-b-plans.html", html: pr_b, title: "PR-B 플랜 비교 navy", css: pricingStyles },
  { name: "pr-c-calc.html", html: pr_c, title: "PR-C 혜택 계산 dark", css: pricingStyles },
];

for (const f of files) { writeFileSync(join(OUT, f.name), wrap(f.title, f.css, f.html), "utf-8"); console.log(`✅ ${f.name}`); }

const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>T7+T10+T15</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:24px}a{display:block;padding:16px;margin-bottom:8px;background:#f5f5f5;border-radius:12px;text-decoration:none;color:#333;font-weight:700}a:hover{background:#e8e8e8}span{font-weight:400;color:#888;font-size:14px}</style></head><body><h1>T7 FAQ + T10 Stats + T15 Pricing</h1>${files.map(f => `<a href="${f.name}">${f.title} <span>→ ${f.name}</span></a>`).join("")}</body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
