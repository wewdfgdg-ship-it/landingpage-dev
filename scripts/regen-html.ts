import { renderHeroBanner } from '../src/engine/sections/01-header-banner/render';
import type { LayoutData } from '../src/engine/sections/01-header-banner/render';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cases: Array<{ id: string; data: LayoutData }> = [
  { id: 'beauty-F', data: { layoutId: 'F', mood: 'mood-dark', fontSet: 'SET-2', brandColor: '#C9A96E', productName: '설화수 자음생크림', eyebrow: '뷰티 · 스킨케어', headline: '자는 동안 피부가\n달라진다', subheadline: '인삼 성분이 피부 깊숙이', desc: '48시간 보습 · 4.9점 평점', stats: [{number:'48',unit:'시간',label:'보습 지속'},{number:'4.9',unit:'점',label:'평균 평점'},{number:'5,200',unit:'건',label:'누적 리뷰'}], awards: ['올리브영 1위','글로우픽 어워드'], ctaText: '지금 만나보기', microCopy: '전 상품 무료배송 · 100% 안심 환불 보장', subjectSize: 'medium' } },
  { id: 'food-C', data: { layoutId: 'C', mood: 'mood-red', fontSet: 'SET-5', brandColor: '#DC2626', productName: '비비고 왕교자', eyebrow: '식품 · 냉장', headline: '2천만이 선택한\n그 맛', subheadline: '바삭한 피, 육즙 가득', desc: '2,000만개 판매 · 4.7점', stats: [{number:'2,000만',unit:'개',label:'누적 판매'},{number:'4.7',unit:'점',label:'평균 평점'}], awards: [], ctaText: '장바구니 담기', microCopy: '오늘 주문 내일 도착 · 신선 냉장 배송', price: '12,900원', discount: '25%', subjectSize: 'small' } },
  { id: 'tech-A', data: { layoutId: 'A', mood: 'mood-navy', fontSet: 'SET-2', brandColor: '#0EA5E9', productName: '에어팟 프로 2세대', eyebrow: '테크 · 가전', headline: '소음은 사라지고\n음악만 남다', subheadline: '적응형 노이즈 캔슬링', desc: '49dB 노이즈캔슬링 · 6시간 재생', stats: [{number:'49',unit:'dB',label:'노이즈캔슬링'},{number:'6',unit:'시간',label:'연속 재생'},{number:'IP54',unit:'',label:'방수 등급'}], awards: [], ctaText: '구매하기', microCopy: '무료 각인 서비스 · Apple 공식 리셀러', subjectSize: 'large' } },
  { id: 'health-D', data: { layoutId: 'D', mood: 'mood-dark', fontSet: 'SET-2', brandColor: '#2E7D32', productName: '종근당 프로바이오틱스', eyebrow: '건강기능식품', headline: '장이 편해야\n하루가 편하다', subheadline: '100억 보장 유산균', desc: '100억 유산균 · 4.8점 평점', stats: [{number:'100억',unit:'',label:'보장 유산균'},{number:'4.8',unit:'점',label:'평균 평점'},{number:'3,200',unit:'건',label:'누적 리뷰'}], awards: ['식약처 인증','GMP 제조','HACCP'], ctaText: '건강 시작하기', microCopy: '정기배송 10% 할인 · 30일 환불 보장', subjectSize: 'medium' } },
];

for (const c of cases) {
  const html = renderHeroBanner(c.data);
  const path = resolve('test-output/layout-tests-v3', c.id, 'index.html');
  writeFileSync(path, html);
  console.log(`${c.id}: HTML 재생성 (폰트 URL 수정 반영)`);
}
