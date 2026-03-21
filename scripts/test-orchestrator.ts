/**
 * 오케스트레이터 E2E 테스트
 * 번들 1개 → 풀 HTML → 파일 출력
 */
import { renderBundle, renderDefaultBundle, renderFromUI } from "../src/engine/sections/orchestrator";
import { getAllBundles } from "../src/engine/sections/landing-bundles";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/orchestrator-test");
mkdirSync(OUT, { recursive: true });

// ── 뷰티 샘플 데이터 ──
const beautyData = {
  productName: "라네즈 워터슬리핑마스크",
  brandColor: "#2563EB",
  headline: "자는 동안 피부가 달라진다",
  subheadline: "히알루론산 5중 복합체, 72시간 수분 지속",
  heroImageUrl: "https://placehold.co/600x400/E0F2FE/2563EB?text=Water+Sleeping+Mask",
  features: [
    { title: "5중 보습 레이어", description: "히알루론산 복합체가 5겹의 보습 장벽을 형성합니다.", icon: "💧" },
    { title: "나이아신아마이드 10%", description: "피부 톤을 균일하게 정돈합니다.", icon: "✨" },
    { title: "저자극 비건", description: "민감성 피부 임상 테스트 완료.", icon: "🛡️" },
  ],
  specs: [
    { label: "용량", value: "120ml" },
    { label: "주요 성분", value: "히알루론산, 나이아신아마이드", badge: "핵심" },
    { label: "피부 타입", value: "모든 피부" },
    { label: "유통기한", value: "24개월" },
  ],
  reviews: [
    { quote: "피부결이 확실히 달라졌어요.", author: "김○○", meta: "30대", rating: 5, tags: ["재구매"] },
    { quote: "속건조가 사라졌습니다.", author: "이○○", meta: "40대", rating: 5 },
    { quote: "가격 대비 훌륭해요.", author: "박○○", meta: "20대", rating: 4 },
  ],
  faqItems: [
    { question: "배송은 얼마나 걸리나요?", answer: "결제 후 1~2영업일 출고." },
    { question: "민감성 피부도 가능한가요?", answer: "저자극 비건 인증 제품입니다." },
    { question: "환불 가능한가요?", answer: "30일 이내 무조건 환불." },
  ],
  stats: [
    { number: "72", unit: "시간", label: "보습 지속" },
    { number: "4.8", unit: "점", label: "평점" },
    { number: "2,847", unit: "건", label: "리뷰" },
  ],
  awards: [
    { name: "올리브영 1위", icon: "🏆", description: "3년 연속" },
    { name: "식약처 인증", icon: "🏅" },
    { name: "비건 인증", icon: "🌿" },
  ],
  benefits: [
    { icon: "📦", text: "무료배송" },
    { icon: "🔄", text: "30일 환불 보장" },
    { icon: "🎁", text: "미니 3종 증정" },
  ],
  ctaText: "혜택 받고 구매하기",
  secondaryCtaText: "더 알아보기",
  microCopy: "한정 수량 소진 시 조기 마감",
  averageRating: 4.8,
  totalReviews: 2847,
  statSource: "※ 2024년 임상 기준",
  beforeImageUrl: "https://placehold.co/400x400/FEE2E2/999?text=Before",
  afterImageUrl: "https://placehold.co/400x400/DBEAFE/2563EB?text=After",
  promoDeadline: "오늘 자정 마감",
  stockPercent: 73,
  bundleItems: [
    { name: "본품 120ml", quantity: 1, badge: "본품" },
    { name: "미니 30ml", quantity: 1 },
    { name: "마스크 5매", quantity: 1, badge: "증정" },
  ],
};

// ── beauty-a (기본) 렌더 ──
console.log("1. beauty-a 렌더...");
const beautyA = renderBundle("beauty", "a", beautyData);
writeFileSync(join(OUT, "beauty-a.html"), beautyA, "utf-8");
console.log("✅ beauty-a.html");

// ── beauty-b (후기 중심) 렌더 ──
console.log("2. beauty-b 렌더...");
const beautyB = renderBundle("beauty", "b", beautyData);
writeFileSync(join(OUT, "beauty-b.html"), beautyB, "utf-8");
console.log("✅ beauty-b.html");

// ── beauty-e (프로모) 렌더 ──
console.log("3. beauty-e 렌더...");
const beautyE = renderBundle("beauty", "e", beautyData);
writeFileSync(join(OUT, "beauty-e.html"), beautyE, "utf-8");
console.log("✅ beauty-e.html");

// ── UI 업종명으로 렌더 (ecommerce → electronics) ──
console.log("4. UI업종 'ecommerce' → electronics 기본 번들...");
const fromUI = renderFromUI("ecommerce", { ...beautyData, productName: "USB-C 허브", brandColor: "#059669" });
writeFileSync(join(OUT, "ui-ecommerce.html"), fromUI, "utf-8");
console.log("✅ ui-ecommerce.html");

// ── 번들 수 확인 ──
const all = getAllBundles();
console.log(`\n총 ${all.length}개 번들 등록 확인`);

// ── 인덱스 ──
const files = ["beauty-a.html", "beauty-b.html", "beauty-e.html", "ui-ecommerce.html"];
const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>오케스트레이터 테스트</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:8px}p{color:#666;margin-bottom:24px;font-size:14px}a{display:block;padding:16px;margin-bottom:8px;background:#f5f5f5;border-radius:12px;text-decoration:none;color:#333;font-weight:700}a:hover{background:#e8e8e8}</style></head><body><h1>오케스트레이터 E2E</h1><p>번들 → renderBundle() → 풀 HTML</p>${files.map(f => `<a href="${f}">${f}</a>`).join("")}</body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
