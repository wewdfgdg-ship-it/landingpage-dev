// ============================================================
// Group 3 검증 v2: 실제 templates 파일 사용 + tsx 실행
// 이미지는 기존 생성분 재사용 (API 비용 절약)
// ============================================================

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderHeroBanner } from '../src/engine/sections/01-header-banner/render';
import type { LayoutData } from '../src/engine/sections/01-header-banner/render';

const TEST_CASES: Array<{
  id: string;
  data: LayoutData;
  expectedLayout: string;
}> = [
  {
    id: 'beauty-F',
    expectedLayout: 'F',
    data: {
      layoutId: 'F',
      mood: 'mood-dark',
      fontSet: 'SET-2',
      brandColor: '#C9A96E',
      productName: '설화수 자음생크림',
      eyebrow: '뷰티 · 스킨케어',
      headline: '자는 동안 피부가\n달라진다',
      subheadline: '인삼 성분이 피부 깊숙이',
      desc: '48시간 보습 · 4.9점 평점',
      stats: [
        { number: '48', unit: '시간', label: '보습 지속' },
        { number: '4.9', unit: '점', label: '평균 평점' },
        { number: '5,200', unit: '건', label: '누적 리뷰' },
      ],
      awards: ['올리브영 1위', '글로우픽 어워드'],
      ctaText: '지금 만나보기',
      microCopy: '전 상품 무료배송 · 100% 안심 환불 보장',
      subjectSize: 'medium',
    },
  },
  {
    id: 'food-C',
    expectedLayout: 'C',
    data: {
      layoutId: 'C',
      mood: 'mood-red',
      fontSet: 'SET-5',
      brandColor: '#DC2626',
      productName: '비비고 왕교자',
      eyebrow: '식품 · 냉장',
      headline: '2천만이 선택한\n그 맛',
      subheadline: '바삭한 피, 육즙 가득',
      desc: '2,000만개 판매 · 4.7점',
      stats: [
        { number: '2,000만', unit: '개', label: '누적 판매' },
        { number: '4.7', unit: '점', label: '평균 평점' },
      ],
      awards: [],
      ctaText: '장바구니 담기',
      microCopy: '오늘 주문 내일 도착 · 신선 냉장 배송',
      price: '12,900원',
      discount: '25%',
      subjectSize: 'small',
    },
  },
  {
    id: 'tech-A',
    expectedLayout: 'A',
    data: {
      layoutId: 'A',
      mood: 'mood-navy',
      fontSet: 'SET-2',
      brandColor: '#0EA5E9',
      productName: '에어팟 프로 2세대',
      eyebrow: '테크 · 가전',
      headline: '소음은 사라지고\n음악만 남다',
      subheadline: '적응형 노이즈 캔슬링',
      desc: '49dB 노이즈캔슬링 · 6시간 재생',
      stats: [
        { number: '49', unit: 'dB', label: '노이즈캔슬링' },
        { number: '6', unit: '시간', label: '연속 재생' },
        { number: 'IP54', unit: '', label: '방수 등급' },
      ],
      awards: [],
      ctaText: '구매하기',
      microCopy: '무료 각인 서비스 · Apple 공식 리셀러',
      subjectSize: 'large',
    },
  },
  {
    id: 'health-D',
    expectedLayout: 'D',
    data: {
      layoutId: 'D',
      mood: 'mood-dark',
      fontSet: 'SET-2',
      brandColor: '#2E7D32',
      productName: '종근당 프로바이오틱스',
      eyebrow: '건강기능식품',
      headline: '장이 편해야\n하루가 편하다',
      subheadline: '100억 보장 유산균',
      desc: '100억 유산균 · 4.8점 평점',
      stats: [
        { number: '100억', unit: '', label: '보장 유산균' },
        { number: '4.8', unit: '점', label: '평균 평점' },
        { number: '3,200', unit: '건', label: '누적 리뷰' },
      ],
      awards: ['식약처 인증', 'GMP 제조', 'HACCP'],
      ctaText: '건강 시작하기',
      microCopy: '정기배송 10% 할인 · 30일 환불 보장',
      subjectSize: 'medium',
    },
  },
];

// ═══ 실행 ═══
const baseDir = resolve('test-output/layout-tests-v2');
if (!existsSync(baseDir)) mkdirSync(baseDir, { recursive: true });

console.log('═══ Group 3 v2: 실제 템플릿 사용 테스트 ═══\n');

for (const tc of TEST_CASES) {
  console.log(`[${tc.id}] LAYOUT-${tc.data.layoutId} | ${tc.data.mood} | ${tc.data.fontSet}`);

  try {
    const html = renderHeroBanner(tc.data);
    const dir = resolve(baseDir, tc.id);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    writeFileSync(resolve(dir, 'index.html'), html);

    // 기존 이미지 복사 (있으면)
    const { copyFileSync } = require('node:fs') as typeof import('node:fs');
    const oldImg = resolve('test-output/layout-tests', tc.id, 'product.png');
    if (existsSync(oldImg)) {
      copyFileSync(oldImg, resolve(dir, 'product.png'));
      console.log(`  ✅ HTML + 이미지 복사`);
    } else {
      console.log(`  ✅ HTML (이미지 없음 — 별도 생성 필요)`);
    }
  } catch (e) {
    console.log(`  ❌ ${(e as Error).message}`);
  }
}

// 인덱스
const indexHtml = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>v2 레이아웃 테스트</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Pretendard',sans-serif;background:#111;color:#fff;padding:40px}
h1{font-size:28px;font-weight:900;margin-bottom:8px}.sub{font-size:13px;color:#666;margin-bottom:32px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.card{background:#1a1a1a;border-radius:16px;overflow:hidden;text-decoration:none;color:#fff;transition:transform .2s}
.card:hover{transform:translateY(-4px)}.card-body{padding:16px}
.card-label{font-size:11px;font-weight:700;letter-spacing:2px;color:#666}.card-title{font-size:16px;font-weight:700;margin-top:4px}
.card-meta{font-size:12px;color:#555;margin-top:8px}</style></head><body>
<h1>v2 실제 템플릿 테스트</h1>
<p class="sub">Group 2에서 만든 templates 파일을 직접 호출한 결과</p>
<div class="grid">
${TEST_CASES.map(tc => `<a href="${tc.id}/index.html" class="card"><div class="card-body">
<div class="card-label">${tc.id.toUpperCase()}</div>
<div class="card-title">${tc.data.productName}</div>
<div class="card-meta">LAYOUT-${tc.data.layoutId} · ${tc.data.mood} · ${tc.data.fontSet}</div>
</div></a>`).join('')}
</div></body></html>`;
writeFileSync(resolve(baseDir, 'index.html'), indexHtml);

console.log(`\n═══ 완료 ═══`);
console.log(`URL: file:///${resolve(baseDir, 'index.html').replace(/\\/g, '/')}`);
