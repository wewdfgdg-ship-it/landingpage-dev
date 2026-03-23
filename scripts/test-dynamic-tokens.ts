// ============================================================
// 동적 토큰 테스트 — 같은 레이아웃, 다른 스타일
// Premium 레이아웃 + 2가지 토큰 세트
// 실행: npx tsx scripts/test-dynamic-tokens.ts
// ============================================================

import { renderMoodTemplate, type MoodTemplateData, type StyleTokens } from '@/engine/10-code-engine/mood-renderer';
import { writeFileSync } from 'fs';
import { join } from 'path';

// 에르고 체어 데이터 (동일)
const chairData: MoodTemplateData = {
  brand: 'ERGO CHAIR PRO',
  images: {
    hero: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
    feat1: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    feat2: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    feat3: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    fullbleed: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80',
    gallery1: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80',
    gallery2: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80',
    gallery3: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80',
    product1: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80',
    product2: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80',
    product3: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80',
    product4: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80',
  },
  hero: { headline: '당신의 허리가<br><em>감사할 의자</em>', subheadline: '인체공학 설계 × 프리미엄 소재.<br>하루 8시간, 10년을 함께할 의자.', cta: '무료 체험 신청' },
  intro: { headline: '앉는 자세의 혁신,<br><em>ErgoChair</em> 프로', body: '15년간의 인체공학 연구와 3,000명의 임상 데이터를 기반으로 설계했습니다.' },
  feat1: { headline: '4D <em>럼버 서포트</em>', body: '허리 곡선에 맞춰 4방향으로 조절되는 럼버 서포트.', tag1: '자동 체형 감지', tag2: '4방향 조절' },
  feat2: { headline: '메시 <em>통기성</em> 소재', body: '항공우주급 메시 소재로 여름에도 쾌적합니다.', tag1: '항공 메시', tag2: '온도 조절' },
  feat3: { headline: '12단계 <em>높이 조절</em>', body: '팔걸이, 좌석 높이, 등받이 각도까지 12개 포인트.', tag1: '12포인트', tag2: '맞춤 설정' },
  stat1: { value: '97', unit: '%', label: '고객 만족도' },
  stat2: { value: '8500', unit: '', label: '5성급 리뷰' },
  stat3: { value: '30', unit: '일', label: '무료 체험' },
  stat4: { value: '12', unit: '년', label: '프레임 보증' },
  fullbleed: { headline: '독일 엔지니어링의<br><em>정밀함</em>', body: '알루미늄 다이캐스트 프레임, 이탈리아산 가죽 팔걸이, 독일 가스 실린더.' },
  before1: { title: '오후 3시 허리 통증', desc: '평평한 등받이로 요추 지지 부족' },
  before2: { title: '집중력 저하', desc: '불편한 자세로 잦은 자세 변경' },
  before3: { title: '2년마다 의자 교체', desc: '쿠션 꺼짐, 가스 실린더 고장' },
  after1: { title: '8시간 무통증', desc: '4D 럼버 서포트가 허리를 완벽 지지' },
  after2: { title: '집중력 35% 향상', desc: '편안한 자세로 몰입 시간 증가' },
  after3: { title: '12년 프레임 보증', desc: '알루미늄 프레임 + TÜV 인증' },
  pricing: {
    headline: '합리적인 <em>투자</em>',
    tier1: { name: 'Standard', price: '₩690,000', unit: '/ 기본', desc: '완벽한 자세의 시작', features: ['4D 럼버 서포트', '메시 등받이', '3D 팔걸이', '무료 배송', '30일 체험'], cta: 'Standard 선택' },
    tier2: { name: 'Premium', price: '₩1,190,000', unit: '/ 풀옵션', desc: '타협 없는 프리미엄', features: ['Standard 전체', '가죽 팔걸이', '헤드레스트', '좌석 깊이 조절', '12년 보증', '평생 수리'], cta: 'Premium 선택' },
  },
  reviews: {
    headline: '실사용자 <em>후기</em>',
    items: [
      { name: '이정호', meta: '개발자 · 판교', avatar: 'https://i.pravatar.cc/120?img=11', quote: '하루 10시간 코딩하는데 허리가 안 아파요.' },
      { name: '박소연', meta: '디자이너 · 서울', avatar: 'https://i.pravatar.cc/120?img=45', quote: '목 통증이 완전히 사라졌어요.' },
      { name: '김태현', meta: 'PO · 강남', avatar: 'https://i.pravatar.cc/120?img=53', quote: '회사에 추가 주문했습니다.' },
      { name: '최유진', meta: '작가 · 제주', avatar: 'https://i.pravatar.cc/120?img=29', quote: '글 쓸 때 집중 시간이 확 늘었어요.' },
    ],
  },
  faq: [
    { question: '조립이 어렵지 않나요?', answer: '전문 기사가 무료 조립 설치합니다.' },
    { question: '30일 체험 후 반품은?', answer: '48시간 내 수거, 전액 환불.' },
    { question: '쿠션 교체 가능?', answer: '좌석 쿠션, 팔걸이 패드 개별 구매 가능.' },
    { question: '체중 제한?', answer: '150kg까지 지원. 알루미늄 프레임.' },
  ],
  products: {
    headline: '라인업 <em>소개</em>',
    item1: { name: 'ErgoChair Standard', sub: '기본형 인체공학 의자' },
    item2: { name: 'ErgoChair Premium', sub: '풀옵션 프리미엄 의자' },
    item3: { name: 'ErgoDesk Pro', sub: '높이조절 스탠딩 데스크' },
    item4: { name: 'ErgoMonitor Arm', sub: '모니터 암 거치대' },
  },
  process1: { title: '온라인 주문', desc: '원하는 모델을 선택하고 주문하세요.' },
  process2: { title: '무료 배송 · 설치', desc: '전문 기사가 방문하여 조립 설치합니다.' },
  process3: { title: '30일 무료 체험', desc: '만족하지 못하면 전액 환불해 드립니다.' },
  cta: { headline: '지금 바꾸면<br><em>내일이 다릅니다</em>', body: '30일 무위험 체험으로 시작하세요.', cta: '무료 체험 신청', micro: '무료 배송 · 무료 조립 · 100% 환불' },
};

// --- 토큰 A: 원래 Premium (딥 네이비 + 아이스블루) ---
const premiumTokens: StyleTokens = {
  fontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&family=Noto+Sans+KR:wght@300;400;500;700&display=swap',
  fontDisplay: "'Cormorant Garamond','Noto Sans KR',serif",
  fontBody: "'Outfit','Noto Sans KR',sans-serif",
  bg: '#0A1628',
  surface: '#0E1F3D',
  surfaceLight: '#132A4A',
  primary: '#9DC4E0',
  primaryLight: '#B8DCF0',
  primaryPale: '#D4EAF5',
  frost: 'rgba(157,196,224,.12)',
  frostLine: 'rgba(157,196,224,.18)',
  frostGlow: 'rgba(157,196,224,.08)',
  textPrimary: '#F0F4FA',
  textSecondary: '#B8C8D8',
  textBright: '#FFFFFF',
  sizeDisplay: 'clamp(3.2rem,7.5vw,6.5rem)',
  sizeH1: 'clamp(2.4rem,4vw,3.5rem)',
  sizeH2: 'clamp(1.8rem,3.5vw,2.8rem)',
  sizeH3: 'clamp(1.3rem,2vw,1.7rem)',
  sizeBody: 'clamp(1rem,1.2vw,1.1rem)',
};

// --- 토큰 B: 블랙 + 골드 럭셔리 (같은 레이아웃, 완전 다른 느낌) ---
const luxuryTokens: StyleTokens = {
  fontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Raleway:wght@300;400;500;600&family=Noto+Serif+KR:wght@400;700&display=swap',
  fontDisplay: "'Playfair Display','Noto Serif KR',serif",
  fontBody: "'Raleway','Noto Sans KR',sans-serif",
  bg: '#0A0806',
  surface: '#141210',
  surfaceLight: '#1E1A16',
  primary: '#C6A44E',
  primaryLight: '#E8D5A0',
  primaryPale: '#F0E8D0',
  frost: 'rgba(198,164,78,.12)',
  frostLine: 'rgba(198,164,78,.2)',
  frostGlow: 'rgba(198,164,78,.08)',
  textPrimary: '#F5EFE0',
  textSecondary: '#B8A890',
  textBright: '#FFFFFF',
  sizeDisplay: 'clamp(3.5rem,8vw,7rem)',
  sizeH1: 'clamp(2.2rem,3.5vw,3rem)',
  sizeH2: 'clamp(1.6rem,3vw,2.4rem)',
  sizeH3: 'clamp(1.2rem,1.8vw,1.5rem)',
  sizeBody: 'clamp(.95rem,1.1vw,1.05rem)',
};

// --- 토큰 C: 화이트 + 레드 클린 (라이트 모드) ---
const cleanTokens: StyleTokens = {
  fontUrl: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap',
  fontDisplay: "'Instrument Serif','Noto Sans KR',serif",
  fontBody: "'DM Sans','Noto Sans KR',sans-serif",
  bg: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceLight: '#F0F0EE',
  primary: '#E63225',
  primaryLight: '#FF6B5E',
  primaryPale: '#FFE8E6',
  frost: 'rgba(230,50,37,.08)',
  frostLine: 'rgba(0,0,0,.08)',
  frostGlow: 'rgba(230,50,37,.04)',
  textPrimary: '#1A1A1A',
  textSecondary: '#777777',
  textBright: '#000000',
  sizeDisplay: 'clamp(3rem,7vw,5.5rem)',
  sizeH1: 'clamp(2rem,3.5vw,3rem)',
  sizeH2: 'clamp(1.6rem,3vw,2.4rem)',
  sizeH3: 'clamp(1.2rem,1.8vw,1.5rem)',
  sizeBody: 'clamp(.95rem,1.1vw,1.05rem)',
};

const outDir = join(process.cwd(), 'test-output');

// A: Premium 토큰 (원래)
const htmlA = renderMoodTemplate('premium', chairData, premiumTokens);
writeFileSync(join(outDir, 'dynamic-A-premium.html'), htmlA, 'utf-8');
console.log('✅ A: Premium 레이아웃 + 딥네이비/아이스블루 토큰');

// B: 같은 레이아웃 + 럭셔리 토큰
const htmlB = renderMoodTemplate('premium', chairData, luxuryTokens);
writeFileSync(join(outDir, 'dynamic-B-luxury.html'), htmlB, 'utf-8');
console.log('✅ B: Premium 레이아웃 + 블랙/골드 토큰');

// C: 같은 레이아웃 + 클린 토큰
const htmlC = renderMoodTemplate('premium', chairData, cleanTokens);
writeFileSync(join(outDir, 'dynamic-C-clean.html'), htmlC, 'utf-8');
console.log('✅ C: Premium 레이아웃 + 화이트/레드 토큰');

console.log('\n세 파일 모두 같은 레이아웃, 같은 텍스트, 다른 폰트/크기/색상!');
