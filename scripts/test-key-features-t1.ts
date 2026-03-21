/**
 * T1 Feature Grid — KF-A / KF-B / KF-C 출력 테스트
 * 실행: npx tsx scripts/test-key-features-t1.ts
 */
import { renderSection } from "../src/engine/sections/02-key-features/index";
import { keyFeaturesStyles } from "../src/engine/sections/02-key-features/styles";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT_DIR = join(__dirname, "../output/t1-test");
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
    body {
      font-family: 'Pretendard', -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      display: flex;
      justify-content: center;
      min-height: 100vh;
      background: #f0f0f0;
    }
    .page { width: 100%; max-width: 960px; }
    ${keyFeaturesStyles}
  </style>
</head>
<body>
  <div class="page">
    ${sectionHtml}
  </div>
</body>
</html>`;
}

// ── KF-A: 기본 그리드 (아이콘 3개, 이미지 없음) ──
const htmlA = renderSection({
  eyebrow: "WHY CHOOSE US",
  headline: "핵심 기능 3가지",
  subheadline: "한눈에 이해되는 강점만 정리합니다.",
  mood: "clean",
  brandColor: "#4A90D9",
  cta: { text: "자세히 보기", href: "/detail" },
  features: [
    { title: "빠른 설정", description: "처음 써도 바로 이해되는 간단한 시작 흐름", icon: "⚡", badge: "NEW" },
    { title: "정확한 제어", description: "핵심 옵션만 남겨 복잡도를 줄였습니다.", icon: "🎯" },
    { title: "안정적인 운영", description: "반복 작업을 줄이고 일관된 품질을 유지합니다.", icon: "🛡️" },
  ],
});

// ── KF-B: 이미지 2개+ → 자동 선택 ──
const htmlB = renderSection({
  eyebrow: "PRODUCT FEATURES",
  headline: "눈에 보이는 차이",
  subheadline: "직접 사용해보면 느낄 수 있습니다.",
  mood: "soft",
  brandColor: "#7C3AED",
  cta: { text: "체험하기" },
  features: [
    { title: "프리미엄 소재", description: "천연 원료만 사용한 부드러운 텍스처", imageUrl: "https://placehold.co/400x400/EDE9FE/7C3AED?text=Texture", badge: "BEST" },
    { title: "지속력", description: "12시간 이상 유지되는 밀착력", imageUrl: "https://placehold.co/400x400/EDE9FE/7C3AED?text=Lasting" },
    { title: "저자극", description: "민감성 피부 테스트 완료", imageUrl: "https://placehold.co/400x400/EDE9FE/7C3AED?text=Gentle" },
  ],
});

// ── KF-C: 5개 이상 → 자동 선택 ──
const htmlC = renderSection({
  eyebrow: "SPECIFICATIONS",
  headline: "6가지 핵심 스펙",
  mood: "dark",
  brandColor: "#D97706",
  cta: { text: "전체 스펙 보기" },
  features: [
    { title: "배터리", description: "5000mAh 대용량, 하루 종일 사용 가능" },
    { title: "디스플레이", description: "6.7인치 AMOLED, 120Hz 주사율" },
    { title: "프로세서", description: "최신 8세대 칩셋, 전작 대비 40% 향상" },
    { title: "카메라", description: "5000만 화소 메인 + 광각 + 망원 트리플" },
    { title: "충전", description: "65W 초고속 충전, 30분에 80% 충전" },
    { title: "방수방진", description: "IP68 등급, 일상 방수 완벽 대응" },
  ],
});

// ── mood-navy 테스트 ──
const htmlNavy = renderSection({
  eyebrow: "ENTERPRISE",
  headline: "비즈니스를 위한 설계",
  subheadline: "보안과 확장성을 동시에 잡았습니다.",
  mood: "navy",
  brandColor: "#3B82F6",
  features: [
    { title: "보안 인증", description: "SOC2, ISO27001 인증 완료", icon: "🔒" },
    { title: "확장성", description: "1만 동시접속 처리 가능", icon: "📈" },
    { title: "SLA 보장", description: "99.9% 가동률 보장", icon: "✅" },
    { title: "전담 지원", description: "24/7 기술 지원팀 배정", icon: "🎧" },
  ],
});

// ── KF-A 2개 카드 (최소) ──
const html2 = renderSection({
  headline: "핵심 포인트",
  mood: "clean",
  brandColor: "#059669",
  features: [
    { title: "간편 주문", description: "3번의 터치로 주문 완료", icon: "📱" },
    { title: "빠른 배송", description: "당일 출고, 내일 도착", icon: "🚚" },
  ],
});

// ── KF-A 8개 카드 (대량) ──
const html8 = renderSection({
  eyebrow: "ALL FEATURES",
  headline: "8가지 강점",
  mood: "soft",
  brandColor: "#EC4899",
  features: Array.from({ length: 8 }, (_, i) => ({
    title: `기능 ${i + 1}`,
    description: `${i + 1}번째 핵심 강점에 대한 설명입니다.`,
    icon: ["⚡", "🎯", "🛡️", "💎", "🔥", "✨", "🚀", "💡"][i],
  })),
});

// ── KF-A 10개 카드 (최대급) ──
const html10 = renderSection({
  headline: "10가지 이유",
  mood: "dark",
  brandColor: "#F59E0B",
  cta: { text: "전체 보기" },
  features: Array.from({ length: 10 }, (_, i) => ({
    title: `장점 ${i + 1}`,
    description: `이 제품을 선택해야 하는 ${i + 1}번째 이유.`,
    icon: ["⚡", "🎯", "🛡️", "💎", "🔥", "✨", "🚀", "💡", "🌟", "🏆"][i],
  })),
});

// ── 파일 저장 ──
const files = [
  { name: "kf-a-clean.html", html: htmlA, title: "KF-A 3개 mood-clean" },
  { name: "kf-b-soft.html", html: htmlB, title: "KF-B 이미지 mood-soft" },
  { name: "kf-c-dark.html", html: htmlC, title: "KF-C 6개 리스트 mood-dark" },
  { name: "kf-navy.html", html: htmlNavy, title: "KF-A 4개 mood-navy" },
  { name: "kf-a-2cards.html", html: html2, title: "KF-A 2개 카드" },
  { name: "kf-a-8cards.html", html: html8, title: "KF-A 8개 카드" },
  { name: "kf-a-10cards.html", html: html10, title: "KF-A 10개 카드 dark" },
];

for (const f of files) {
  const path = join(OUT_DIR, f.name);
  writeFileSync(path, wrapHtml(f.title, f.html), "utf-8");
  console.log(`✅ ${f.name} → ${path}`);
}

// ── 인덱스 페이지 ──
const indexHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>T1 Key Features Test</title>
  <style>
    body { font-family: 'Pretendard', sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; }
    h1 { font-size: 24px; margin-bottom: 24px; }
    a { display: block; padding: 16px; margin-bottom: 8px; background: #f5f5f5; border-radius: 12px; text-decoration: none; color: #333; font-weight: 700; }
    a:hover { background: #e8e8e8; }
    span { font-weight: 400; color: #888; font-size: 14px; }
  </style>
</head>
<body>
  <h1>T1 Feature Grid — 테스트</h1>
  ${files.map((f) => `<a href="${f.name}">${f.title} <span>→ ${f.name}</span></a>`).join("\n  ")}
</body>
</html>`;
writeFileSync(join(OUT_DIR, "index.html"), indexHtml, "utf-8");
console.log(`\n📋 인덱스: ${join(OUT_DIR, "index.html")}`);
console.log("완료!");
