/**
 * Denps 스타일 히어로 v2 — AI 생성 컷아웃 이미지 사용
 * 실행: npx tsx scripts/build-denps-v2.ts
 */
import { readFileSync, writeFileSync } from 'fs';

const modelB64 = readFileSync('scripts/cutout-model-product.png').toString('base64');
const mattressB64 = readFileSync('scripts/cutout-mattress.png').toString('base64');
const personB64 = readFileSync('scripts/cutout-person.png').toString('base64');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>슬립웰 매트리스 — Denps 스타일 v2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Noto Sans KR',-apple-system,sans-serif;-webkit-font-smoothing:antialiased;background:#f1f5f9;}
img{max-width:100%;height:auto;display:block;}
a{color:inherit;text-decoration:none;}
.label{text-align:center;padding:32px;background:#1e293b;color:#fff;font-size:1.3rem;font-weight:700;letter-spacing:0.05em;}
</style>
</head>
<body>

<!-- ========================================== -->
<!-- 1. Denps 스타일 — 세이지 그린 + 남성 모델 -->
<!-- ========================================== -->
<div class="label">1. Denps 스타일 — 세이지 그린 + 남성 모델 컷아웃</div>

<section style="
  position:relative;
  min-height:100vh;
  background:#5C7A6B;
  color:#FFFFFF;
  overflow:hidden;
  padding:0;
">
  <!-- 텍스트 영역 (좌측) -->
  <div style="
    position:relative;
    z-index:2;
    padding:80px 60px;
    max-width:520px;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
  ">
    <span style="display:inline-block;width:fit-content;padding:6px 18px;border:1.5px solid rgba(255,255,255,0.45);border-radius:999px;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;color:rgba(255,255,255,0.8);margin-bottom:28px;">PRODUCT INTRO</span>

    <p style="font-size:2rem;font-weight:800;letter-spacing:-0.01em;margin-bottom:12px;">SlipWell</p>

    <h1 style="font-size:clamp(2.2rem,5.5vw,3.5rem);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin-bottom:0;">수면 전문가가 선택한</h1>
    <h1 style="font-size:clamp(2.2rem,5.5vw,3.5rem);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin-bottom:40px;">턱! 소리나는 매트리스</h1>
  </div>

  <!-- 모델 컷아웃 (우측, 텍스트 위에 겹침) -->
  <div style="
    position:absolute;
    bottom:0;
    right:5%;
    z-index:3;
    width:45%;
    max-width:480px;
    display:flex;
    align-items:flex-end;
    justify-content:center;
  ">
    <img src="data:image/png;base64,${modelB64}" alt="모델" style="width:100%;object-fit:contain;">
  </div>

  <!-- 제품 이미지 (좌측 하단, 모델 앞) -->
  <div style="
    position:absolute;
    bottom:40px;
    left:60px;
    z-index:4;
    width:200px;
  ">
    <img src="data:image/png;base64,${mattressB64}" alt="슬립웰 매트리스" style="width:100%;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.2);">
  </div>
</section>

<!-- ========================================== -->
<!-- 2. 다크 네이비 + 남성 모델 -->
<!-- ========================================== -->
<div class="label">2. 다크 네이비 + 남성 모델 컷아웃</div>

<section style="
  position:relative;
  min-height:100vh;
  background:#1B2838;
  color:#FFFFFF;
  overflow:hidden;
  padding:0;
">
  <div style="
    position:relative;
    z-index:2;
    padding:80px 60px;
    max-width:520px;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
  ">
    <span style="display:inline-block;width:fit-content;padding:6px 18px;border:1.5px solid rgba(255,255,255,0.35);border-radius:999px;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;color:rgba(255,255,255,0.7);margin-bottom:28px;">PREMIUM SLEEP</span>

    <p style="font-size:2rem;font-weight:800;margin-bottom:12px;">SlipWell</p>

    <h1 style="font-size:clamp(2.2rem,5.5vw,3.5rem);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin-bottom:0;">매일 아침이 기대되는</h1>
    <h1 style="font-size:clamp(2.2rem,5.5vw,3.5rem);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin-bottom:32px;">7존 체압분산 매트리스</h1>

    <div style="border-left:2px solid rgba(255,255,255,0.2);padding-left:20px;margin-bottom:36px;">
      <p style="font-size:0.9rem;line-height:1.8;color:rgba(255,255,255,0.6);">
        당신의 체형을 기억하는 7존 시스템.<br>
        100일 무료 체험, 만족하지 않으면 100% 환불.
      </p>
    </div>

    <a href="#" style="display:inline-block;width:fit-content;padding:14px 36px;background:#FFFFFF;color:#1B2838;border-radius:999px;font-weight:700;font-size:0.95rem;">100일 무료 체험 시작하기</a>
  </div>

  <div style="position:absolute;bottom:0;right:5%;z-index:3;width:45%;max-width:480px;display:flex;align-items:flex-end;justify-content:center;">
    <img src="data:image/png;base64,${modelB64}" alt="모델" style="width:100%;object-fit:contain;">
  </div>

  <div style="position:absolute;bottom:40px;left:60px;z-index:4;width:200px;">
    <img src="data:image/png;base64,${mattressB64}" alt="매트리스" style="width:100%;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
  </div>
</section>

<!-- ========================================== -->
<!-- 3. 따뜻한 베이지 + 여성 모델 -->
<!-- ========================================== -->
<div class="label">3. 따뜻한 베이지 + 여성 모델 컷아웃</div>

<section style="
  position:relative;
  min-height:100vh;
  background:#E8E0D5;
  color:#2C2420;
  overflow:hidden;
  padding:0;
">
  <div style="
    position:relative;
    z-index:2;
    padding:80px 60px;
    max-width:520px;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
  ">
    <span style="display:inline-block;width:fit-content;padding:6px 18px;border:1.5px solid rgba(44,36,32,0.35);border-radius:999px;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;color:rgba(44,36,32,0.6);margin-bottom:28px;">GOOD MORNING</span>

    <p style="font-size:2rem;font-weight:800;margin-bottom:12px;">SlipWell</p>

    <h1 style="font-size:clamp(2.2rem,5.5vw,3.5rem);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin-bottom:0;">당신의 체형을 기억하는</h1>
    <h1 style="font-size:clamp(2.2rem,5.5vw,3.5rem);font-weight:900;line-height:1.2;letter-spacing:-0.03em;margin-bottom:32px;">프리미엄 수면 솔루션</h1>

    <div style="border-left:2px solid rgba(44,36,32,0.2);padding-left:20px;margin-bottom:36px;">
      <p style="font-size:0.9rem;line-height:1.8;color:rgba(44,36,32,0.55);">
        뻐근한 허리, 뒤척이는 밤은 이제 끝.<br>
        독일 인증 7존 체압분산 시스템.<br>
        100일 체험 후 결정하세요.
      </p>
    </div>

    <a href="#" style="display:inline-block;width:fit-content;padding:14px 36px;background:#2C2420;color:#FFFFFF;border-radius:999px;font-weight:700;font-size:0.95rem;">무료 체험 신청하기</a>
    <p style="margin-top:10px;font-size:0.78rem;color:rgba(44,36,32,0.4);">무료 배송 · 무료 설치 · 100일 환불 보장</p>
  </div>

  <div style="position:absolute;bottom:0;right:3%;z-index:3;width:42%;max-width:440px;display:flex;align-items:flex-end;justify-content:center;">
    <img src="data:image/png;base64,${personB64}" alt="모델" style="width:100%;object-fit:contain;">
  </div>

  <div style="position:absolute;bottom:40px;left:60px;z-index:4;width:200px;">
    <img src="data:image/png;base64,${mattressB64}" alt="매트리스" style="width:100%;border-radius:8px;box-shadow:0 8px 24px rgba(44,36,32,0.15);">
  </div>
</section>

</body>
</html>`;

writeFileSync('scripts/test-denps-v2.html', html, 'utf-8');
console.log('✅ scripts/test-denps-v2.html 생성 완료');
console.log('   브라우저에서 열어서 확인하세요');
