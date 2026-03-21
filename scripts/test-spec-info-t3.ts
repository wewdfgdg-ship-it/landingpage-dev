/**
 * T3 Spec/Info — SI-A / SI-B / SI-C 출력 테스트
 * 실행: npx tsx scripts/test-spec-info-t3.ts
 */
import { renderSection } from "../src/engine/sections/common-spec-info/index";
import { specInfoStyles } from "../src/engine/sections/common-spec-info/styles";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT_DIR = join(__dirname, "../output/t3-test");
mkdirSync(OUT_DIR, { recursive: true });

function wrapHtml(title: string, sectionHtml: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Pretendard', sans-serif; display: flex; justify-content: center; min-height: 100vh; background: #f0f0f0; }
    .page { width: 100%; max-width: 960px; }
    ${specInfoStyles}
  </style>
</head>
<body>
  <div class="page">${sectionHtml}</div>
</body>
</html>`;
}

// ── SI-A: 06-specs (오버레이 스펙) ──
const htmlA = renderSection({
  sectionId: "06-specs",
  eyebrow: "SPECIFICATIONS",
  headline: "상세 사양",
  subheadline: "핵심 스펙을 한눈에 확인하세요.",
  mood: "clean",
  brandColor: "#2563EB",
  heroImageUrl: "https://placehold.co/800x500/EBF5FF/2563EB?text=Product+Diagram",
  annotations: ["5중 레이어", "나노 코팅", "고밀도 소재"],
  metric: "73.4%",
  metricLabel: "보습 지속률 (임상 기준)",
  items: [
    { label: "용량", value: "120ml" },
    { label: "주요 성분", value: "히알루론산, 나이아신아마이드", badge: "핵심" },
    { label: "원산지", value: "대한민국" },
    { label: "유통기한", value: "제조일로부터 24개월", note: "※ 개봉 후 12개월" },
    { label: "인증", value: "식약처 기능성 인증", icon: "✅" },
  ],
  footnote: "※ 개인차가 있을 수 있습니다.",
  cta: { text: "전체 성분 보기" },
});

// ── SI-B: 07-how-to-use (단계형) ──
const htmlB = renderSection({
  sectionId: "07-how-to-use",
  eyebrow: "HOW TO USE",
  headline: "간단 3단계 사용법",
  mood: "soft",
  brandColor: "#7C3AED",
  numbered: true,
  items: [
    { label: "세안", description: "미온수로 얼굴을 깨끗이 씻어줍니다.", icon: "🧼" },
    { label: "도포", description: "적당량을 손바닥에 덜어 얼굴 전체에 펴 발라줍니다.", icon: "✋", imageUrl: "https://placehold.co/600x300/F5F3FF/7C3AED?text=Step+2" },
    { label: "흡수", description: "5분간 가볍게 두드려 충분히 흡수시킵니다.", icon: "✨" },
  ],
  footnote: "※ 아침, 저녁 2회 사용을 권장합니다.",
});

// ── SI-C: 14-shipping (패널 카드) ──
const htmlC_ship = renderSection({
  sectionId: "14-shipping",
  eyebrow: "DELIVERY",
  headline: "배송 안내",
  mood: "clean",
  brandColor: "#059669",
  items: [
    { label: "배송비", value: "무료", icon: "📦", badge: "무료" },
    { label: "배송 기간", value: "1~2일", description: "결제 완료 후 당일 출고", icon: "🚚" },
    { label: "도서산간", value: "+3,000원", description: "제주/도서산간 추가 배송비", icon: "🏝️" },
  ],
});

// ── SI-C: 24-refund (패널 카드 dark) ──
const htmlC_refund = renderSection({
  sectionId: "24-refund-policy",
  eyebrow: "REFUND POLICY",
  headline: "환불 보장 정책",
  mood: "dark",
  brandColor: "#D97706",
  items: [
    { label: "교환/반품", value: "30일 이내", icon: "🔄", description: "수령 후 30일 이내 무조건 교환/반품" },
    { label: "환불 처리", value: "3영업일", icon: "💰", description: "반품 확인 후 3영업일 내 환불" },
    { label: "불량 교환", value: "100% 무상", icon: "✅", badge: "보장" },
  ],
  footnote: "※ 고객 변심 반품 시 왕복 배송비 부담",
});

// ── SI-C: 25-customer-service (navy) ──
const htmlC_cs = renderSection({
  sectionId: "25-customer-service",
  eyebrow: "SUPPORT",
  headline: "고객 지원",
  mood: "navy",
  brandColor: "#3B82F6",
  items: [
    { label: "1:1 채팅", value: "24시간", icon: "💬" },
    { label: "전화 상담", value: "1588-0000", icon: "📞", description: "평일 09:00~18:00" },
    { label: "이메일", value: "support@brand.com", icon: "📧" },
    { label: "카카오톡", value: "@브랜드명", icon: "💛" },
  ],
  cta: { text: "1:1 문의하기" },
});

const files = [
  { name: "si-a-specs.html", html: htmlA, title: "SI-A 스펙 오버레이 (06)" },
  { name: "si-b-howto.html", html: htmlB, title: "SI-B 사용법 단계형 (07)" },
  { name: "si-c-shipping.html", html: htmlC_ship, title: "SI-C 배송안내 카드 (14)" },
  { name: "si-c-refund.html", html: htmlC_refund, title: "SI-C 환불정책 dark (24)" },
  { name: "si-c-support.html", html: htmlC_cs, title: "SI-C 고객지원 navy (25)" },
];

for (const f of files) {
  writeFileSync(join(OUT_DIR, f.name), wrapHtml(f.title, f.html), "utf-8");
  console.log(`✅ ${f.name}`);
}

const indexHtml = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>T3 Spec/Info Test</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:24px}a{display:block;padding:16px;margin-bottom:8px;background:#f5f5f5;border-radius:12px;text-decoration:none;color:#333;font-weight:700}a:hover{background:#e8e8e8}span{font-weight:400;color:#888;font-size:14px}</style></head><body><h1>T3 Spec/Info — 테스트</h1>${files.map((f) => `<a href="${f.name}">${f.title} <span>→ ${f.name}</span></a>`).join("")}</body></html>`;
writeFileSync(join(OUT_DIR, "index.html"), indexHtml, "utf-8");
console.log(`\n📋 인덱스: ${join(OUT_DIR, "index.html")}`);
