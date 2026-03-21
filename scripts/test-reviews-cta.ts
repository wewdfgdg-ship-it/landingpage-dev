import { renderSection as renderReviews } from "../src/engine/sections/common-reviews/index";
import { reviewsStyles } from "../src/engine/sections/common-reviews/styles";
import { renderSection as renderCta } from "../src/engine/sections/common-cta/index";
import { ctaStyles } from "../src/engine/sections/common-cta/styles";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../output/t8t9-test");
mkdirSync(OUT, { recursive: true });

const wrap = (title: string, css: string, html: string) => `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Pretendard',sans-serif;display:flex;justify-content:center;min-height:100vh;background:#f0f0f0}.page{width:100%;max-width:960px}${css}</style></head><body><div class="page">${html}</div></body></html>`;

// T8 Reviews
const rv_a = renderReviews({
  eyebrow: "REVIEWS", headline: "고객이 직접 말합니다", averageRating: 4.8, totalCount: 2847,
  mood: "clean", brandColor: "#4A90D9",
  reviews: [
    { quote: "사용 후 피부결이 확실히 달라졌어요.", author: "김○○", meta: "30대 · 민감성", rating: 5, tags: ["재구매", "추천"] },
    { quote: "속건조가 사라졌습니다. 인생템!", author: "이○○", meta: "40대 · 건성", rating: 5 },
    { quote: "가격 대비 성능이 훌륭해요.", author: "박○○", meta: "20대 · 복합성", rating: 4 },
  ],
  cta: { text: "후기 더 보기" },
});

const rv_b = renderReviews({
  headline: "베스트 리뷰", mood: "dark", brandColor: "#EC4899",
  featuredReview: { quote: "3개월 사용 후 눈에 띄는 변화. 피부과 갈 일이 줄었어요.", author: "정○○", meta: "뷰티 에디터", rating: 5 },
  reviews: [
    { quote: "재구매 3번째", author: "최○○", rating: 5 },
    { quote: "선물했더니 대만족", author: "한○○", rating: 5 },
  ],
});

const rv_c = renderReviews({
  headline: "포토 리뷰", mood: "soft", brandColor: "#7C3AED", totalCount: 5200,
  reviews: [
    { quote: "텍스처 최고", author: "A", imageUrl: "https://placehold.co/300x300/EDE9FE/7C3AED?text=1" },
    { quote: "피부 촉촉", author: "B", imageUrl: "https://placehold.co/300x300/EDE9FE/7C3AED?text=2" },
    { quote: "데일리 필수", author: "C", imageUrl: "https://placehold.co/300x300/EDE9FE/7C3AED?text=3" },
    { quote: "강추!", author: "D", imageUrl: "https://placehold.co/300x300/EDE9FE/7C3AED?text=4" },
  ],
});

// T9 CTA
const ct_a = renderCta({
  headline: "지금 시작하세요", subheadline: "더 이상 망설일 이유가 없습니다.",
  cta: { text: "무료 체험 시작" }, microCopy: "가입 후 7일 무료 · 언제든 해지",
  mood: "dark", brandColor: "#2563EB",
});

const ct_b = renderCta({
  badge: "🔥 오늘만", headline: "첫 구매 특별 혜택", body: "지금 구매하면 아래 혜택을 모두 받으실 수 있습니다.",
  benefits: [
    { icon: "📦", text: "무료 배송" },
    { icon: "🔄", text: "30일 무조건 환불" },
    { icon: "🎁", text: "미니 사이즈 증정" },
  ],
  cta: { text: "혜택 받고 구매하기" }, secondaryAction: { text: "더 알아보기" },
  microCopy: "한정 수량 소진 시 조기 마감", mood: "navy", brandColor: "#7C3AED",
});

const ct_c = renderCta({
  headline: "특별한 경험을 시작하세요", body: "프리미엄 스킨케어의 새로운 기준",
  cta: { text: "지금 구매하기" }, backgroundImageUrl: "https://placehold.co/1200x600/1a1a1a/333?text=Banner+BG",
  mood: "dark", brandColor: "#D97706",
});

const files = [
  { name: "rv-a-cards.html", html: rv_a, title: "RV-A 카드 리뷰", css: reviewsStyles },
  { name: "rv-b-featured.html", html: rv_b, title: "RV-B 대표 후기 dark", css: reviewsStyles },
  { name: "rv-c-photo.html", html: rv_c, title: "RV-C 포토 리뷰 soft", css: reviewsStyles },
  { name: "ct-a-centered.html", html: ct_a, title: "CTA-A 센터 dark", css: ctaStyles },
  { name: "ct-b-benefits.html", html: ct_b, title: "CTA-B 혜택스택 navy", css: ctaStyles },
  { name: "ct-c-banner.html", html: ct_c, title: "CTA-C 비주얼배너", css: ctaStyles },
];

for (const f of files) {
  writeFileSync(join(OUT, f.name), wrap(f.title, f.css, f.html), "utf-8");
  console.log(`✅ ${f.name}`);
}

const idx = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>T8+T9 Test</title><style>body{font-family:'Pretendard',sans-serif;max-width:600px;margin:40px auto;padding:0 20px}h1{font-size:24px;margin-bottom:24px}a{display:block;padding:16px;margin-bottom:8px;background:#f5f5f5;border-radius:12px;text-decoration:none;color:#333;font-weight:700}a:hover{background:#e8e8e8}span{font-weight:400;color:#888;font-size:14px}</style></head><body><h1>T8 Reviews + T9 CTA</h1>${files.map(f => `<a href="${f.name}">${f.title} <span>→ ${f.name}</span></a>`).join("")}</body></html>`;
writeFileSync(join(OUT, "index.html"), idx, "utf-8");
console.log(`\n📋 ${join(OUT, "index.html")}`);
