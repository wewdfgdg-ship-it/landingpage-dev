/**
 * AI 파이프라인 → ProductData → renderBundle 전체 흐름 테스트
 * 실제 API 호출 없이 mock 데이터로 검증
 */
import type { ProductBrief } from "../src/engine/01-product-intelligence/types";
import type { SectionAgentOutput } from "../src/engine/sections/types";
import { pipelineToProductData, briefToProductData } from "../src/engine/sections/pipeline-adapter";
import { renderBundle, renderDefaultBundle } from "../src/engine/sections/orchestrator";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/pipeline-test");
mkdirSync(OUT, { recursive: true });

// ═══ Mock ProductBrief (① Product Intelligence 출력) ═══
const mockBrief: ProductBrief = {
  productDNA: {
    coreValue: "피부 장벽을 강화하는 세라마이드 크림",
    usp: ["세라마이드 5종 복합", "48시간 보습 지속", "피부과 공동 개발"],
    positioning: "premium",
    valueHierarchy: {
      functional: "피부 장벽 강화",
      emotional: "건강한 피부에 대한 자신감",
      social: "전문가가 인정한 스킨케어",
    },
  },
  customerDesire: {
    surface: "촉촉하고 건강한 피부",
    real: "피부 트러블 걱정 없는 안정감",
    hidden: "나이 들어도 좋은 피부 유지",
  },
  customerFear: {
    problem: "건조함과 피부 당김이 반복됨",
    opportunity: "지금 관리 안 하면 주름이 깊어짐",
    social: "피부 나빠 보이면 인상이 안 좋아짐",
  },
  resistanceMap: {
    price: "이 가격이면 피부과 시술 1회보다 저렴",
    quality: "피부과 전문의 공동 개발, 임상 완료",
    trust: "올리브영 1위, 48,000건 리뷰",
    time: "세안 후 1분, 하루 2회면 충분",
  },
  decisionType: "cautious",
  marketContext: {
    competitors: ["설화수 자음생크림", "키엘 울트라 크림"],
    marketTrend: "피부 장벽 강화 트렌드 지속",
    seasonality: "겨울철 수요 급증",
  },
  confidenceScore: 85,
};

// ═══ Mock SectionAgentOutput[] (섹션 에이전트 출력) ═══
const mockSections: SectionAgentOutput[] = [
  {
    sectionKey: "HEADER_BANNER",
    order: 1,
    copy: {
      headline: "피부 장벽, 48시간 지킨다",
      subheadline: "세라마이드 5종 복합 크림",
      body: "피부과 전문의와 함께 개발한 장벽 강화 솔루션",
      bulletPoints: ["세라마이드 5종", "48시간 보습", "피부과 공동 개발"],
      ctaText: "지금 시작하기",
      microCopy: "무료배송 · 30일 환불보장",
    },
    layout: { type: "A", structure: [] },
    style: { background: "#0f0b07", textColor: "#ffffff", accentColor: "#2563EB", fontSize: { headline: "64px", body: "15px" }, spacing: "24px" },
    imagePrompt: "세라마이드 크림 제품 사진",
    elementWeight: { photo: 60, text: 40, graphic: 20, animation: 10 },
  },
  {
    sectionKey: "KEY_FEATURES",
    order: 2,
    copy: {
      headline: "왜 이 크림인가",
      subheadline: "3가지 핵심 강점",
      body: "",
      bulletPoints: ["세라마이드 5종 복합으로 장벽 즉시 강화", "48시간 보습 지속 임상 완료", "피부과 전문의 공동 개발 포뮬러"],
      ctaText: "",
      microCopy: "",
    },
    layout: { type: "KF-A", structure: [] },
    style: { background: "#ffffff", textColor: "#111827", accentColor: "#2563EB", fontSize: { headline: "34px", body: "14px" }, spacing: "28px" },
    imagePrompt: "",
    elementWeight: { photo: 20, text: 60, graphic: 30, animation: 0 },
  },
  {
    sectionKey: "STATS_NUMBERS",
    order: 5,
    copy: {
      headline: "임상으로 증명된 효과",
      subheadline: "",
      body: "",
      bulletPoints: ["48 시간 보습 지속", "4.9 점 고객 평점", "48000 건 누적 리뷰"],
      ctaText: "",
      microCopy: "",
    },
    layout: { type: "ST-A", structure: [] },
    style: { background: "#0f0b07", textColor: "#ffffff", accentColor: "#2563EB", fontSize: { headline: "34px", body: "14px" }, spacing: "28px" },
    imagePrompt: "",
    elementWeight: { photo: 0, text: 40, graphic: 60, animation: 0 },
  },
  {
    sectionKey: "REVIEWS",
    order: 8,
    copy: {
      headline: "실제 사용자 후기",
      subheadline: "48,000건의 진심 리뷰",
      body: "",
      bulletPoints: [
        "건조한 겨울에도 하루 종일 촉촉해요. 인생크림!",
        "피부과에서 추천받고 샀는데 진짜 달라졌어요",
        "민감성인데 트러블 없이 잘 맞아요. 재구매 3번째",
      ],
      ctaText: "후기 더 보기",
      microCopy: "만족도 97%",
    },
    layout: { type: "RV-A", structure: [] },
    style: { background: "#ffffff", textColor: "#111827", accentColor: "#2563EB", fontSize: { headline: "34px", body: "14px" }, spacing: "28px" },
    imagePrompt: "",
    elementWeight: { photo: 30, text: 70, graphic: 10, animation: 0 },
  },
  {
    sectionKey: "FAQ",
    order: 9,
    copy: {
      headline: "자주 묻는 질문",
      subheadline: "",
      body: "",
      bulletPoints: [
        "민감성 피부도 사용 가능한가요? 네, 피부 자극 테스트 완료 제품입니다.",
        "하루에 몇 번 바르나요? 아침, 저녁 세안 후 2회 사용을 권장합니다.",
        "다른 제품과 같이 써도 되나요? 네, 세럼 다음 단계에서 사용하시면 됩니다.",
        "환불이 가능한가요? 수령 후 30일 이내 무조건 환불 가능합니다.",
      ],
      ctaText: "",
      microCopy: "",
    },
    layout: { type: "FAQ-A", structure: [] },
    style: { background: "#ffffff", textColor: "#111827", accentColor: "#2563EB", fontSize: { headline: "34px", body: "14px" }, spacing: "28px" },
    imagePrompt: "",
    elementWeight: { photo: 0, text: 90, graphic: 10, animation: 0 },
  },
  {
    sectionKey: "CTA",
    order: 10,
    copy: {
      headline: "지금 시작하면 특별 혜택",
      subheadline: "30일 환불 보장",
      body: "48,000명이 선택한 장벽 강화 크림. 지금이 가장 좋은 타이밍.",
      bulletPoints: ["무료배송", "30일 환불 보장", "미니 키트 증정", "다음 구매 10% 할인"],
      ctaText: "혜택 받고 구매하기",
      microCopy: "한정 수량 소진 시 조기 마감",
    },
    layout: { type: "CTA-B", structure: [] },
    style: { background: "#0f0b07", textColor: "#ffffff", accentColor: "#2563EB", fontSize: { headline: "34px", body: "14px" }, spacing: "28px" },
    imagePrompt: "",
    elementWeight: { photo: 10, text: 60, graphic: 30, animation: 10 },
  },
  {
    sectionKey: "CERTIFICATION",
    order: 7,
    copy: {
      headline: "인증 및 수상",
      subheadline: "",
      body: "",
      bulletPoints: ["올리브영 크림 부문 1위", "피부과 전문의 추천", "EWG 그린 등급", "비건 인증"],
      ctaText: "",
      microCopy: "",
    },
    layout: { type: "TR-A", structure: [] },
    style: { background: "#0f0b07", textColor: "#ffffff", accentColor: "#C9A96E", fontSize: { headline: "34px", body: "14px" }, spacing: "28px" },
    imagePrompt: "",
    elementWeight: { photo: 10, text: 50, graphic: 40, animation: 0 },
  },
  {
    sectionKey: "SPECS",
    order: 4,
    copy: {
      headline: "상세 사양",
      subheadline: "",
      body: "",
      bulletPoints: [
        "용량: 50ml",
        "주요 성분: 세라마이드 NP, 세라마이드 AP, 세라마이드 EOP",
        "피부 타입: 모든 피부 (민감성 테스트 완료)",
        "유통기한: 제조일로부터 24개월",
        "원산지: 대한민국",
      ],
      ctaText: "",
      microCopy: "",
    },
    layout: { type: "SI-A", structure: [] },
    style: { background: "#ffffff", textColor: "#111827", accentColor: "#2563EB", fontSize: { headline: "34px", body: "14px" }, spacing: "28px" },
    imagePrompt: "",
    elementWeight: { photo: 10, text: 80, graphic: 20, animation: 0 },
  },
];

const wizardInput = {
  productName: "닥터셀라 세라마이드 크림",
  industry: "beauty",
  brandColor: "#2563EB",
  fontSet: "SET-13",
  priceRange: "38,000원",
  imageUrls: ["https://placehold.co/600x400/E0F2FE/2563EB?text=Ceramide+Cream"],
};

// ═══ 테스트 1: 풀 파이프라인 → ProductData ═══
console.log("1. pipelineToProductData 변환...");
const productData = pipelineToProductData(mockBrief, mockSections, wizardInput);
console.log("  features:", productData.features?.length);
console.log("  specs:", productData.specs?.length);
console.log("  reviews:", productData.reviews?.length);
console.log("  faqItems:", productData.faqItems?.length);
console.log("  stats:", productData.stats?.length);
console.log("  awards:", productData.awards?.length);
console.log("  benefits:", productData.benefits?.length);
console.log("  headline:", productData.headline);
console.log("  ctaText:", productData.ctaText);

// ═══ 테스트 2: ProductData → renderBundle ═══
console.log("\n2. renderBundle('beauty', 'a')...");
const html1 = renderBundle("beauty", "a", productData);
writeFileSync(join(OUT, "pipeline-beauty-a.html"), html1, "utf-8");
console.log("✅ pipeline-beauty-a.html");

// ═══ 테스트 3: briefToProductData (최소 데이터) ═══
console.log("\n3. briefToProductData (AI 카피 없이)...");
const minData = briefToProductData(mockBrief, wizardInput);
const html2 = renderDefaultBundle("beauty", minData);
writeFileSync(join(OUT, "brief-only-beauty.html"), html2, "utf-8");
console.log("✅ brief-only-beauty.html");

// ═══ 테스트 4: 다른 업종으로 렌더 ═══
console.log("\n4. 같은 데이터 → electronics 번들...");
const html3 = renderBundle("electronics", "a", { ...productData, productName: "닥터셀라 디바이스", fontSet: "SET-8" });
writeFileSync(join(OUT, "pipeline-electronics-a.html"), html3, "utf-8");
console.log("✅ pipeline-electronics-a.html");

// ═══ 인덱스 ═══
const files = ["pipeline-beauty-a.html", "brief-only-beauty.html", "pipeline-electronics-a.html"];
const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>파이프라인 테스트</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:8px}p{color:#666;margin-bottom:24px;font-size:14px;line-height:1.6}a{display:block;padding:16px;margin-bottom:8px;background:#f5f5f5;border-radius:12px;text-decoration:none;color:#333;font-weight:700}a:hover{background:#e8e8e8}</style></head><body><h1>AI 파이프라인 → 렌더 테스트</h1><p>mock ProductBrief + SectionAgentOutput[] → pipelineToProductData() → renderBundle()</p>${files.map(f => `<a href="${f}">${f}</a>`).join("")}</body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
