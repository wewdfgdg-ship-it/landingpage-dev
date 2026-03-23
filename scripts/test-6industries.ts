// ============================================================
// 6개 업종 × 6개 레이아웃 데모
// 실행: npx tsx scripts/test-6industries.ts
// ============================================================

import { renderMoodTemplate, type MoodTemplateData, type StyleTokens } from '@/engine/10-code-engine/mood-renderer';
import { writeFileSync } from 'fs';
import { join } from 'path';

// ============================================================
// 토큰 정의
// ============================================================

const TOKENS: Record<string, StyleTokens> = {
  premium: {
    fontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&family=Noto+Sans+KR:wght@300;400;500;700&display=swap',
    fontDisplay: "'Cormorant Garamond','Noto Sans KR',serif",
    fontBody: "'Outfit','Noto Sans KR',sans-serif",
    bg: '#0A1628', surface: '#0E1F3D', surfaceLight: '#132A4A',
    primary: '#9DC4E0', primaryLight: '#B8DCF0', primaryPale: '#D4EAF5',
    frost: 'rgba(157,196,224,.12)', frostLine: 'rgba(157,196,224,.18)', frostGlow: 'rgba(157,196,224,.08)',
    textPrimary: '#F0F4FA', textSecondary: '#B8C8D8', textBright: '#FFFFFF',
    sizeDisplay: 'clamp(3.2rem,7.5vw,6.5rem)', sizeH1: 'clamp(2.4rem,4vw,3.5rem)',
    sizeH2: 'clamp(1.8rem,3.5vw,2.8rem)', sizeH3: 'clamp(1.3rem,2vw,1.7rem)', sizeBody: 'clamp(1rem,1.2vw,1.1rem)',
  },
  luxury: {
    fontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Noto+Serif+KR:wght@400;700;900&display=swap',
    fontDisplay: "'Playfair Display','Noto Serif KR',serif",
    fontBody: "'Cormorant','Noto Serif KR',serif",
    bg: '#0A0806', surface: '#141210', surfaceLight: '#1E1A16',
    primary: '#C6A44E', primaryLight: '#E8D5A0', primaryPale: 'rgba(198,164,78,.15)',
    frost: 'rgba(245,239,224,.55)', frostLine: 'rgba(245,239,224,.25)', frostGlow: 'rgba(198,164,78,.08)',
    textPrimary: '#F5EFE0', textSecondary: 'rgba(245,239,224,.55)', textBright: '#F5EFE0',
    sizeDisplay: 'clamp(3rem,5vw,5.5rem)', sizeH1: 'clamp(2.2rem,3.5vw,3rem)',
    sizeH2: 'clamp(1.6rem,3vw,2.4rem)', sizeH3: 'clamp(1.2rem,1.8vw,1.5rem)', sizeBody: 'clamp(.95rem,1.1vw,1.05rem)',
  },
  tech: {
    fontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
    fontDisplay: "'Outfit','Noto Sans KR',sans-serif",
    fontBody: "'Noto Sans KR','Outfit',sans-serif",
    bg: '#07070E', surface: '#0E0E1A', surfaceLight: '#141422',
    primary: '#7C3AED', primaryLight: '#A78BFA', primaryPale: '#5B21B6',
    frost: 'rgba(6,214,160,.25)', frostLine: '#1E1E35', frostGlow: 'rgba(124,58,237,.3)',
    textPrimary: '#606080', textSecondary: '#A0A0BE', textBright: '#F0F0F5',
    sizeDisplay: 'clamp(3rem,7vw,5rem)', sizeH1: 'clamp(2rem,3.5vw,3rem)',
    sizeH2: 'clamp(1.6rem,3vw,2.4rem)', sizeH3: 'clamp(1.2rem,1.8vw,1.5rem)', sizeBody: 'clamp(.9rem,1.1vw,1rem)',
  },
  clean: {
    fontUrl: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
    fontDisplay: "'Instrument Serif','Noto Sans KR',serif",
    fontBody: "'DM Sans','Noto Sans KR',sans-serif",
    bg: '#FAFAF8', surface: '#FFFFFF', surfaceLight: '#F0F0EE',
    primary: '#E63225', primaryLight: '#FF6B5E', primaryPale: '#FFE8E6',
    frost: 'rgba(230,50,37,.08)', frostLine: '#E0E0E0', frostGlow: 'rgba(230,50,37,.04)',
    textPrimary: '#1A1A1A', textSecondary: '#777777', textBright: '#000000',
    sizeDisplay: 'clamp(3rem,7vw,5.5rem)', sizeH1: 'clamp(2rem,3.5vw,3rem)',
    sizeH2: 'clamp(1.6rem,3vw,2.4rem)', sizeH3: 'clamp(1.2rem,1.8vw,1.5rem)', sizeBody: 'clamp(.95rem,1.1vw,1.05rem)',
  },
  bold: {
    fontUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
    fontDisplay: "'Bebas Neue',sans-serif",
    fontBody: "'Noto Sans KR',sans-serif",
    bg: '#000000', surface: '#111111', surfaceLight: '#1A1A1A',
    primary: '#FF2D20', primaryLight: '#FF6B5E', primaryPale: '#FFD60A',
    frost: 'rgba(255,45,32,.1)', frostLine: 'rgba(255,255,255,.1)', frostGlow: 'rgba(255,45,32,.05)',
    textPrimary: '#FFFFFF', textSecondary: '#888888', textBright: '#FFFFFF',
    sizeDisplay: 'clamp(4rem,10vw,8rem)', sizeH1: 'clamp(2.5rem,5vw,4rem)',
    sizeH2: 'clamp(2rem,4vw,3rem)', sizeH3: 'clamp(1.4rem,2vw,1.8rem)', sizeBody: 'clamp(.95rem,1.1vw,1.05rem)',
  },
  natural: {
    fontUrl: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Josefin+Sans:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap',
    fontDisplay: "'Lora','Noto Sans KR',serif",
    fontBody: "'Josefin Sans','Noto Sans KR',sans-serif",
    bg: '#F5F0E8', surface: '#FAF7F0', surfaceLight: '#FFFDF8',
    primary: '#2D5F3F', primaryLight: '#3A7A52', primaryPale: '#8B6914',
    frost: 'rgba(45,95,63,.08)', frostLine: 'rgba(0,0,0,.08)', frostGlow: 'rgba(45,95,63,.04)',
    textPrimary: '#1A1812', textSecondary: '#8A8070', textBright: '#1A1812',
    sizeDisplay: 'clamp(3rem,7vw,5.5rem)', sizeH1: 'clamp(2rem,3.5vw,3rem)',
    sizeH2: 'clamp(1.8rem,3.5vw,2.8rem)', sizeH3: 'clamp(1.2rem,1.8vw,1.5rem)', sizeBody: 'clamp(.95rem,1.1vw,1.05rem)',
  },
  magazine: {
    fontUrl: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Mono:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap',
    fontDisplay: "'DM Serif Display','Noto Sans KR',serif",
    fontBody: "'Space Mono','Noto Sans KR',monospace",
    bg: '#1A1A1A', surface: '#222222', surfaceLight: '#2A2A2A',
    primary: '#FF5E1A', primaryLight: '#FF8C5A', primaryPale: '#FF5E1A',
    frost: 'rgba(255,94,26,.08)', frostLine: 'rgba(242,237,232,.12)', frostGlow: 'rgba(255,94,26,.05)',
    textPrimary: '#F2EDE8', textSecondary: 'rgba(242,237,232,.5)', textBright: '#FFFFFF',
    sizeDisplay: 'clamp(3.5rem,9vw,7rem)', sizeH1: 'clamp(2.2rem,4vw,3.5rem)',
    sizeH2: 'clamp(1.8rem,3.5vw,2.8rem)', sizeH3: 'clamp(1.2rem,2vw,1.6rem)', sizeBody: 'clamp(.85rem,1vw,.95rem)',
  },
};

// ============================================================
// 6개 업종 데이터
// ============================================================

function makeData(d: Partial<MoodTemplateData> & Pick<MoodTemplateData, 'brand' | 'hero' | 'intro' | 'feat1' | 'feat2' | 'feat3' | 'pricing' | 'cta'>): MoodTemplateData {
  return {
    images: d.images ?? {
      hero: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=85',
      feat1: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      feat2: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=600&q=80',
      feat3: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
      fullbleed: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&q=85',
      gallery1: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      gallery2: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
      gallery3: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      product1: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
      product2: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=600&q=80',
      product3: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      product4: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80',
    },
    stat1: { value: '98', unit: '%', label: '고객 만족도' },
    stat2: { value: '5000', unit: '+', label: '누적 고객' },
    stat3: { value: '30', unit: '일', label: '무료 체험' },
    stat4: { value: '5', unit: '년', label: '품질 보증' },
    fullbleed: { headline: d.fullbleed?.headline ?? '최고만을 <em>고집합니다</em>', body: d.fullbleed?.body ?? '모든 제품은 엄격한 품질 관리를 거칩니다.' },
    before1: { title: '기존 문제 1', desc: '불편함이 지속됨' },
    before2: { title: '기존 문제 2', desc: '비효율적인 경험' },
    before3: { title: '기존 문제 3', desc: '반복적인 비용 발생' },
    after1: { title: '개선 결과 1', desc: '확실한 차이를 느낌' },
    after2: { title: '개선 결과 2', desc: '효율이 크게 향상됨' },
    after3: { title: '개선 결과 3', desc: '장기적 비용 절감' },
    products: d.products ?? {
      headline: '제품 라인업',
      item1: { name: '제품 1', sub: 'Product One' },
      item2: { name: '제품 2', sub: 'Product Two' },
      item3: { name: '제품 3', sub: 'Product Three' },
      item4: { name: '제품 4', sub: 'Product Four' },
    },
    process1: d.process1 ?? { title: '온라인 주문', desc: '3분이면 완료' },
    process2: d.process2 ?? { title: '무료 배송', desc: '주문 후 1~2일' },
    process3: d.process3 ?? { title: '체험 시작', desc: '불만족 시 전액 환불' },
    reviews: {
      headline: '고객 <em>후기</em>',
      items: [
        { name: '김지현', meta: '32세', avatar: 'https://i.pravatar.cc/120?img=32', quote: '정말 만족합니다. 주변에 추천하고 있어요.' },
        { name: '이준호', meta: '41세', avatar: 'https://i.pravatar.cc/120?img=60', quote: '기대 이상이었어요. 삶의 질이 달라졌습니다.' },
        { name: '박서연', meta: '28세', avatar: 'https://i.pravatar.cc/120?img=47', quote: '이 가격에 이 품질이라니. 최고의 선택.' },
        { name: '정민수', meta: '35세', avatar: 'https://i.pravatar.cc/120?img=12', quote: '두 번째 구매입니다. 변함없는 품질.' },
      ],
    },
    faq: [
      { question: '배송은 얼마나 걸리나요?', answer: '주문 후 1~3일 내 무료 배송됩니다.' },
      { question: '반품/교환이 가능한가요?', answer: '체험 기간 내 무료 반품 가능합니다.' },
      { question: '보증 기간은?', answer: '품질 보증 기간 동안 무상 수리 가능합니다.' },
      { question: 'AS는 어떻게 받나요?', answer: '고객센터에 연락하시면 48시간 내 처리됩니다.' },
    ],
    ...d,
  } as MoodTemplateData;
}

// 1. 고급 시계 (Premium 레이아웃)
const watch = makeData({
  images: {
    hero: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1400&q=85',
    feat1: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
    feat2: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&q=80',
    feat3: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
    fullbleed: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1400&q=85',
    gallery1: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
    gallery2: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80',
    gallery3: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80',
    product1: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80',
    product2: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80',
    product3: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
    product4: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80',
  },
  brand: 'CHRONOS ATELIER',
  hero: { headline: '시간의 예술,<br><em>손목 위의 걸작</em>', subheadline: '스위스 무브먼트 × 사파이어 크리스탈.<br>100년을 함께할 타임피스.', cta: '컬렉션 보기' },
  intro: { headline: '장인 정신의 결정체,<br><em>Chronos</em> 워치', body: '1892년 창립 이래 4대에 걸친 시계 장인의 손끝에서 탄생합니다. 하나의 무브먼트에 312개의 부품, 800시간의 수작업.' },
  feat1: { headline: '스위스 <em>오토매틱</em> 무브먼트', body: 'ETA 2824-2 기반 자체 칼리버. 40시간 파워 리저브, 일차 ±4초 정밀도.', tag1: '자체 칼리버', tag2: '40h 파워리저브' },
  feat2: { headline: '사파이어 <em>크리스탈</em>', body: '경도 9의 합성 사파이어. 양면 AR 코팅으로 어떤 각도에서도 선명한 시인성.', tag1: '경도 9', tag2: 'AR 코팅' },
  feat3: { headline: '316L <em>스테인리스</em> 스틸', body: '의료용 스테인리스 스틸 케이스. 100m 방수, 10년 사용해도 변색 없는 내구성.', tag1: '100m 방수', tag2: '10년 내구성' },
  stat1: { value: '132', unit: '년', label: '브랜드 역사' }, stat2: { value: '312', unit: '개', label: '무브먼트 부품' },
  stat3: { value: '800', unit: 'h', label: '수작업 시간' }, stat4: { value: '100', unit: 'm', label: '방수 등급' },
  fullbleed: { headline: '시간을 <em>만드는</em> 손', body: '모든 Chronos 워치는 장인의 손으로 조립되고 테스트됩니다. 기계식 시계의 아름다움은 세밀함에서 옵니다.' },
  pricing: {
    headline: '타임피스 <em>컬렉션</em>',
    tier1: { name: 'Classic', price: '₩2,800,000', unit: '', desc: '입문의 정석', features: ['ETA 무브먼트', '사파이어 글라스', '송아지 가죽 스트랩', '무료 각인', '5년 보증'], cta: 'Classic 선택' },
    tier2: { name: 'Grand', price: '₩5,200,000', unit: '', desc: '컬렉터를 위한 선택', features: ['자체 칼리버', '티타늄 케이스', '악어가죽 스트랩', '시리얼 넘버 각인', '평생 무상 수리', '리미티드 에디션'], cta: 'Grand 선택' },
  },
  before1: { title: '패션 시계 1년 수명', desc: '배터리 교체, 방수 불량, 변색' },
  before2: { title: '시간이 자꾸 틀어짐', desc: '저가 무브먼트의 한계' },
  before3: { title: '매년 시계 교체', desc: '소모품처럼 쓰고 버리는 시계' },
  after1: { title: '100년 전승 가능', desc: '대를 이어 물려줄 수 있는 타임피스' },
  after2: { title: '일차 ±4초 정밀도', desc: '스위스 COSC 크로노미터 인증' },
  after3: { title: '평생 무상 수리', desc: 'Grand 라인 평생 보증 프로그램' },
  cta: { headline: '시간의 <em>가치</em>를 아는 당신에게', body: '30일 무위험 체험. 마음에 들지 않으면 전액 환불.', cta: '무료 체험 시작', micro: '무료 배송 · 무료 각인 · 100% 환불' },
});

// 2. 호텔 스파 (Luxury 레이아웃)
const spa = makeData({
  images: {
    hero: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=85',
    feat1: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
    feat2: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80',
    feat3: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6a?w=800&q=80',
    fullbleed: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1400&q=85',
    gallery1: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    gallery2: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80',
    gallery3: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
    product1: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
    product2: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80',
    product3: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
    product4: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6a?w=600&q=80',
  },
  brand: 'MAISON SÉRÉNÉ',
  hero: { headline: '도심 속<br><em>오아시스</em>', subheadline: '프렌치 아로마테라피 × 한방 힐링.<br>당신만을 위한 90분의 여정.', cta: '예약하기' },
  intro: { headline: '몸과 마음의 <em>균형</em>', body: '파리 르봉마르셰에서 영감을 받은 공간. 유기농 에센셜 오일과 전통 한방 기법을 결합한 시그니처 트리트먼트.' },
  feat1: { headline: '아로마 <em>딥 릴렉스</em>', body: '라벤더, 일랑일랑, 베르가못 블렌딩. 근육 이완과 스트레스 해소를 동시에.', tag1: '유기농 오일', tag2: '90분 코스' },
  feat2: { headline: '한방 <em>경락</em> 테라피', body: '12경락 순환 마사지. 동의보감 기반 체질별 맞춤 처방으로 근본적 피로 해소.', tag1: '체질별 맞춤', tag2: '경락 순환' },
  feat3: { headline: '프라이빗 <em>스위트</em>', body: '완벽한 방음, 자연광 조명, 온수 자쿠지. 예약 1팀만을 위한 독립 공간.', tag1: '완전 독립', tag2: '자쿠지 포함' },
  stat1: { value: '4.9', unit: '', label: '평균 별점' }, stat2: { value: '12000', unit: '+', label: '누적 방문' },
  stat3: { value: '98', unit: '%', label: '재방문율' }, stat4: { value: '15', unit: '종', label: '시그니처 오일' },
  fullbleed: { headline: '자연에서 온 <em>치유</em>', body: '모든 오일은 프랑스 프로방스 직수입 유기농 원료. ECOCERT 인증, 동물실험 하지 않습니다.' },
  pricing: {
    headline: '트리트먼트 <em>메뉴</em>',
    tier1: { name: 'Signature', price: '₩280,000', unit: '/ 90분', desc: '시그니처 아로마 코스', features: ['아로마 딥 릴렉스 90분', '유기농 에센셜 오일', '허브티 서비스', '프라이빗 라운지', '주차 2시간 무료'], cta: '예약하기' },
    tier2: { name: 'Grand Ritual', price: '₩480,000', unit: '/ 150분', desc: '최상의 힐링 경험', features: ['Signature 전체 포함', '한방 경락 테라피 추가', '자쿠지 30분', '샴페인 서비스', 'VIP 스위트룸', '발레파킹'], cta: '예약하기' },
  },
  cta: { headline: '오늘, <em>당신</em>을 위한 시간', body: '첫 방문 20% 할인. 마음에 들지 않으면 전액 환불.', cta: '첫 방문 예약', micro: '당일 예약 가능 · 주차 무료 · 100% 환불' },
});

// 3. AI SaaS (Tech 레이아웃)
const saas = makeData({
  images: {
    hero: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85',
    feat1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    feat2: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    feat3: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    fullbleed: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1400&q=85',
    gallery1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    gallery2: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    gallery3: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
    product1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    product2: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    product3: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
    product4: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80',
  },
  brand: 'NEXUS AI',
  hero: { headline: '데이터를<br><em>인사이트</em>로', subheadline: 'GPT-4 기반 비즈니스 인텔리전스.<br>10분 만에 리포트가 완성됩니다.', cta: '무료로 시작하기' },
  intro: { headline: '의사결정의 <em>속도</em>를 바꾸다', body: '엑셀 파일을 업로드하면 AI가 자동으로 트렌드, 이상치, 예측을 분석합니다. 비개발자도 SQL 없이 데이터 분석.' },
  feat1: { headline: '자연어 <em>쿼리</em>', body: '"지난 달 매출 상위 10개 제품 보여줘" — 한국어로 물어보면 차트가 나옵니다.', tag1: '한국어 지원', tag2: 'SQL 불필요' },
  feat2: { headline: '<em>실시간</em> 대시보드', body: 'Slack, Notion, Google Sheets 연동. 데이터가 바뀌면 대시보드가 자동 업데이트.', tag1: '30+ 연동', tag2: '실시간 동기화' },
  feat3: { headline: 'AI <em>예측</em> 모델', body: '과거 데이터 기반 매출 예측, 이탈 예측, 재고 최적화. 정확도 94%.', tag1: '94% 정확도', tag2: '자동 학습' },
  stat1: { value: '94', unit: '%', label: '예측 정확도' }, stat2: { value: '3200', unit: '+', label: '기업 고객' },
  stat3: { value: '10', unit: '분', label: '리포트 생성' }, stat4: { value: '30', unit: '+', label: '연동 서비스' },
  fullbleed: { headline: '엔터프라이즈 <em>보안</em>', body: 'SOC 2 Type II 인증. 데이터는 한국 리전에 저장되며, 고객 데이터로 모델을 학습하지 않습니다.' },
  pricing: {
    headline: '<em>요금제</em>',
    tier1: { name: 'Starter', price: '₩49,000', unit: '/ 월', desc: '소규모 팀을 위한 시작', features: ['사용자 5명', '월 1,000 쿼리', '기본 대시보드', 'Slack 연동', '이메일 지원'], cta: '무료 체험' },
    tier2: { name: 'Business', price: '₩199,000', unit: '/ 월', desc: '성장하는 팀의 선택', features: ['사용자 무제한', '쿼리 무제한', 'AI 예측 모델', '30+ 연동', '전담 매니저', 'SSO/SAML'], cta: '데모 요청' },
  },
  cta: { headline: '데이터가 <em>답</em>합니다', body: '14일 무료 체험. 신용카드 불필요.', cta: '무료로 시작하기', micro: '14일 무료 · 언제든 취소 · 데이터 삭제 보장' },
});

// 4. 스킨케어 (Clean 레이아웃)
const skincare = makeData({
  images: {
    hero: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1400&q=85',
    feat1: 'https://images.unsplash.com/photo-1570194065650-d99fb4a38c5f?w=800&q=80',
    feat2: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
    feat3: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80',
    fullbleed: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1400&q=85',
    gallery1: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    gallery2: 'https://images.unsplash.com/photo-1570194065650-d99fb4a38c5f?w=600&q=80',
    gallery3: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    product1: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
    product2: 'https://images.unsplash.com/photo-1570194065650-d99fb4a38c5f?w=600&q=80',
    product3: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    product4: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80',
  },
  brand: 'HARU BOTANICS',
  hero: { headline: '피부가 먹는<br><em>진짜 자연</em>', subheadline: '제주 동백 × 일본 쌀겨 발효.<br>7일이면 피부결이 달라집니다.', cta: '지금 시작하기' },
  intro: { headline: '<em>덜어내는</em> 스킨케어', body: '성분 10개 미만. 불필요한 화학 성분을 모두 덜어내고, 피부가 진짜 필요한 것만 남겼습니다.' },
  feat1: { headline: '제주 <em>동백</em> 오일', body: '제주 한림읍 자생 동백에서 냉압착 추출. 올레산 85% 함유로 깊은 보습과 장벽 강화.', tag1: '냉압착', tag2: '올레산 85%' },
  feat2: { headline: '쌀겨 <em>발효</em> 에센스', body: '일본 니가타현 코시히카리 쌀겨 72시간 자연 발효. 피부결 개선과 톤업을 동시에.', tag1: '72시간 발효', tag2: '톤업 효과' },
  feat3: { headline: '비건 <em>인증</em> 포뮬러', body: 'EVE VEGAN, ECOCERT 이중 인증. 동물성 원료 0%, 생분해 가능 패키지.', tag1: '비건 인증', tag2: '친환경 패키지' },
  stat1: { value: '97', unit: '%', label: '피부결 개선' }, stat2: { value: '10', unit: '개 미만', label: '성분 수' },
  stat3: { value: '7', unit: '일', label: '첫 효과 체감' }, stat4: { value: '0', unit: '%', label: '화학 방부제' },
  fullbleed: { headline: '제주에서 <em>피부</em>까지', body: '원료 수확부터 제품 완성까지 72시간. 냉장 배송으로 활성 성분의 신선함을 유지합니다.' },
  pricing: {
    headline: '시작하기 좋은 <em>세트</em>',
    tier1: { name: 'Basic Set', price: '₩68,000', unit: '', desc: '입문 3종 세트', features: ['동백 클렌징 오일', '쌀겨 발효 토너', '동백 모이스처 크림', '파우치 증정', '무료 배송'], cta: 'Basic 시작' },
    tier2: { name: 'Full Set', price: '₩128,000', unit: '', desc: '풀 라인 6종', features: ['Basic 전체 포함', '발효 에센스', '동백 아이크림', '선크림 SPF50+', '7일 여행 키트', '30일 교환/환불'], cta: 'Full 시작' },
  },
  cta: { headline: '피부가 <em>답</em>을 압니다', body: '첫 구매 20% 할인. 7일 사용 후 불만족 시 전액 환불.', cta: '첫 구매 혜택 받기', micro: '무료 배송 · 7일 환불 · 동물실험 반대' },
});

// 5. 크로스핏 짐 (Bold 레이아웃)
const gym = makeData({
  images: {
    hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=85',
    feat1: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&q=80',
    feat2: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
    feat3: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
    fullbleed: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1400&q=85',
    gallery1: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    gallery2: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80',
    gallery3: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80',
    product1: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    product2: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80',
    product3: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80',
    product4: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
  },
  brand: 'IRON REPUBLIC',
  hero: { headline: '약해질<br><em>시간은 없다</em>', subheadline: '새벽 5시부터 밤 11시까지.<br>변명 대신 바벨을 잡아라.', cta: '1주 무료 체험' },
  intro: { headline: '<em>결과</em>로 말한다', body: '평균 3개월, 체지방 -8%, 근력 +40%. 우리 멤버의 실제 데이터가 증명합니다.' },
  feat1: { headline: 'WOD <em>프로그래밍</em>', body: '레벨별 맞춤 WOD. 입문자도 6주면 풀업 10개. 코치가 1:1로 폼을 교정합니다.', tag1: '레벨별 맞춤', tag2: '1:1 코칭' },
  feat2: { headline: 'ROGUE <em>장비</em> 풀셋', body: '미국 Rogue Fitness 풀라인업. 올림픽 바벨, 에어바이크, GHD — 장비 핑계는 없다.', tag1: 'Rogue 정품', tag2: '풀라인업' },
  feat3: { headline: '24시간 <em>오픈짐</em>', body: '새벽 5시 클래스부터 밤 11시 오픈짐까지. 주말/공휴일 무휴. 당신의 스케줄에 맞춘다.', tag1: '연중무휴', tag2: '새벽 오픈' },
  stat1: { value: '8', unit: '%↓', label: '평균 체지방 감소' }, stat2: { value: '40', unit: '%↑', label: '근력 향상' },
  stat3: { value: '500', unit: '+', label: '활성 멤버' }, stat4: { value: '12', unit: '명', label: '전문 코치' },
  fullbleed: { headline: '<em>커뮤니티</em>의 힘', body: '혼자 하면 운동, 함께 하면 훈련. 500명의 멤버가 서로를 밀어주는 곳.' },
  pricing: {
    headline: '멤버십 <em>플랜</em>',
    tier1: { name: 'Standard', price: '₩180,000', unit: '/ 월', desc: '주 3회 클래스', features: ['주 3회 WOD 클래스', '오픈짐 무제한', '체성분 월 1회', '락커 제공', '주차 무료'], cta: '1주 무료 체험' },
    tier2: { name: 'Unlimited', price: '₩280,000', unit: '/ 월', desc: '무제한 + PT', features: ['클래스 무제한', '오픈짐 무제한', 'PT 월 4회 포함', '영양 상담', '체성분 주 1회', '전용 락커'], cta: '1주 무료 체험' },
  },
  cta: { headline: '변명은 <em>끝</em>이다', body: '1주 무료 체험. 마음에 안 들면 그냥 안 오면 됩니다.', cta: '지금 시작하기', micro: '1주 무료 · 위약금 없음 · 언제든 해지' },
});

// 6. 유기농 차 (Natural 레이아웃)
const tea = makeData({
  images: {
    hero: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=1400&q=85',
    feat1: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
    feat2: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&q=80',
    feat3: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=600&q=80',
    fullbleed: 'https://images.unsplash.com/photo-1542888847-05b0527e9f42?w=1400&q=85',
    gallery1: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=800&q=80',
    gallery2: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
    gallery3: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&q=80',
    product1: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&q=80',
    product2: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
    product3: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&q=80',
    product4: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=600&q=80',
  },
  before1: { title: '마트 티백 습관', desc: '향도 맛도 없는 대량생산 차' },
  before2: { title: '카페인 의존', desc: '커피 없이 못 버티는 하루' },
  before3: { title: '쉬는 시간 없음', desc: '바쁜 일상에 여유가 사라짐' },
  after1: { title: '매일 다른 향', desc: '계절마다 달라지는 야생차의 깊은 풍미' },
  after2: { title: '자연스러운 각성', desc: 'L-테아닌의 부드러운 집중력' },
  after3: { title: '나만의 의식', desc: '차 한 잔으로 시작하는 고요한 시간' },
  products: {
    headline: '티 컬렉션',
    item1: { name: '하동 야생 녹차', sub: '봄 첫물차 30g' },
    item2: { name: '감귤 블렌딩', sub: '제주 청견 20g' },
    item3: { name: '가마솥 덖음차', sub: '수제 한정판 20g' },
    item4: { name: '다관 티백', sub: '간편 우림 10매' },
  },
  process1: { title: '티 선택', desc: '취향에 맞는 차를 고르세요' },
  process2: { title: '냉장 배송', desc: '채엽 48시간 내 배송' },
  process3: { title: '우려 마시기', desc: '가이드북과 함께 즐기세요' },
  brand: 'SONAMU CHA',
  hero: { headline: '한 잔의<br><em>고요한 시간</em>', subheadline: '하동 야생 녹차 × 제주 감귤.<br>자연이 빚은 블렌딩 티.', cta: '티 컬렉션 보기' },
  intro: { headline: '<em>느리게</em> 우려낸 가치', body: '경남 하동 화개골 해발 400m 야생 차밭. 할머니의 손으로 채엽하고, 가마솥에서 덖어 만듭니다.' },
  feat1: { headline: '하동 <em>야생</em> 녹차', body: '50년 이상 무농약 야생 차나무. 봄 첫물차만 수확하여 L-테아닌 함량 극대화.', tag1: '야생 차밭', tag2: '봄 첫물차' },
  feat2: { headline: '제주 <em>감귤</em> 블렌딩', body: '제주 무농약 청견 감귤 껍질을 저온 건조. 녹차의 쓴맛을 부드럽게 잡아주는 시트러스 향.', tag1: '무농약 감귤', tag2: '저온 건조' },
  feat3: { headline: '수제 <em>가마솥</em> 덖음', body: '기계 대신 손으로. 300도 가마솥에서 숙련된 장인이 직접 덖어 깊은 향미를 끌어냅니다.', tag1: '수제 덖음', tag2: '장인 제다' },
  stat1: { value: '50', unit: '년+', label: '야생 차밭 수령' }, stat2: { value: '0', unit: '%', label: '농약 사용' },
  stat3: { value: '300', unit: '°C', label: '가마솥 덖음 온도' }, stat4: { value: '4', unit: '대째', label: '가업 전승' },
  fullbleed: { headline: '자연 그대로,<br><em>찻잔</em> 안에', body: '차밭에서 찻잔까지 48시간. 당일 채엽, 당일 덖음, 냉장 배송으로 신선함을 지킵니다.' },
  pricing: {
    headline: '티 <em>컬렉션</em>',
    tier1: { name: '입문 세트', price: '₩38,000', unit: '', desc: '처음 만나는 소나무차', features: ['야생 녹차 30g', '감귤 블렌딩 20g', '다관 티백 10매', '보관 틴케이스', '무료 배송'], cta: '입문 세트 주문' },
    tier2: { name: '프리미엄 세트', price: '₩78,000', unit: '', desc: '차를 아는 분을 위한', features: ['입문 세트 전체', '첫물차 한정판 20g', '수제 다식 4종', '차 우리기 가이드북', '선물 포장', '손글씨 카드'], cta: '프리미엄 주문' },
  },
  cta: { headline: '오늘, <em>한 잔</em>의 여유', body: '첫 주문 무료 배송. 맛이 마음에 안 들면 환불해 드립니다.', cta: '지금 주문하기', micro: '무료 배송 · 7일 환불 · 냉장 배송' },
});

// 7. 독립 커피 로스터리 (Magazine 레이아웃)
const coffee = makeData({
  images: {
    hero: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&q=85',
    feat1: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    feat2: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    feat3: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80',
    fullbleed: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1400&q=85',
    gallery1: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    gallery2: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',
    gallery3: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    product1: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    product2: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    product3: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&q=80',
    product4: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
  },
  before1: { title: '편의점 캔커피', desc: '설탕+합성향 — 진짜 커피 맛을 모름' },
  before2: { title: '프랜차이즈 획일화', desc: '어디서나 같은 맛, 개성 없음' },
  before3: { title: '원두 출처 불명', desc: '어디서 왔는지, 언제 볶았는지 모름' },
  after1: { title: '산지 직송 스페셜티', desc: '에티오피아 예가체프 싱글 오리진' },
  after2: { title: '주문 후 로스팅', desc: '주문일에 볶아서 48시간 내 배송' },
  after3: { title: '로스팅 프로필 공개', desc: '온도, 시간, 크랙 포인트 전부 투명' },
  products: {
    headline: '이번 시즌 원두',
    item1: { name: '예가체프 내추럴', sub: 'Ethiopia · Light' },
    item2: { name: '과테말라 안티구아', sub: 'Guatemala · Medium' },
    item3: { name: '콜롬비아 수프리모', sub: 'Colombia · Medium-Dark' },
    item4: { name: '하우스 블렌드', sub: 'Blend · City Roast' },
  },
  process1: { title: '원두 선택', desc: '산지와 로스팅 레벨을 고르세요' },
  process2: { title: '주문일 로스팅', desc: '갓 볶은 원두를 밀봉 포장' },
  process3: { title: '48시간 배송', desc: '신선함이 살아있는 상태로 도착' },
  brand: 'MANO ROASTERS',
  hero: { headline: '한 잔에<br>담긴 <em>여정</em>', subheadline: '에티오피아 농장에서 당신의 컵까지.<br>주문 후 로스팅, 48시간 내 배송.', cta: '원두 보러가기' },
  intro: { headline: '커피는 <em>농산물</em>이다', body: '와인처럼 산지, 품종, 가공법에 따라 맛이 완전히 달라집니다. 우리는 매 시즌 최고의 생두를 직접 선별하고, 주문이 들어온 날 로스팅합니다. 대량 생산과 유통 과정에서 잃어버린 커피 본연의 맛을 되찾아 드립니다.' },
  feat1: { headline: '싱글 오리진 <em>스페셜티</em>', body: 'SCA 85점 이상 스페셜티 등급만 취급. 에티오피아, 과테말라, 콜롬비아 농장과 직거래.', tag1: 'SCA 85+', tag2: '산지 직거래' },
  feat2: { headline: '주문 후 <em>로스팅</em>', body: '재고 원두 없음. 주문이 들어오면 그날 볶습니다. 로스팅 일자와 프로필을 라벨에 기재.', tag1: '당일 로스팅', tag2: '프로필 공개' },
  feat3: { headline: '<em>핸드드립</em> 가이드', body: '원두마다 최적의 추출 레시피를 함께 보내드립니다. 물 온도, 비율, 시간 — 바리스타 수준의 한 잔.', tag1: '추출 레시피', tag2: '바리스타 가이드' },
  stat1: { value: '85', unit: '+', label: 'SCA 점수' }, stat2: { value: '48', unit: 'h', label: '로스팅→배송' },
  stat3: { value: '12', unit: '개국', label: '산지 네트워크' }, stat4: { value: '3200', unit: '+', label: '구독 고객' },
  fullbleed: { headline: '농장에서<br><em>컵</em>까지', body: '우리가 거래하는 모든 농장을 직접 방문합니다. 공정한 가격, 지속 가능한 재배, 투명한 유통.' },
  pricing: {
    headline: '구독 <em>플랜</em>',
    tier1: { name: 'Explorer', price: '₩24,000', unit: '/ 월', desc: '매달 새로운 싱글 오리진', features: ['200g × 1종', '로스팅 프로필 카드', '핸드드립 레시피', '무료 배송', '언제든 해지'], cta: '구독 시작하기' },
    tier2: { name: 'Connoisseur', price: '₩42,000', unit: '/ 월', desc: '2종 비교 테이스팅', features: ['200g × 2종', 'Explorer 전체 포함', '테이스팅 노트', '드립백 5매 보너스', '시즌 한정 원두 우선 접근', '커핑 클래스 초대'], cta: '구독 시작하기' },
  },
  cta: { headline: '오늘 볶은<br><em>커피</em>를 내일 마시다', body: '첫 구독 30% 할인. 마음에 안 들면 전액 환불.', cta: '첫 구독 시작', micro: '무료 배송 · 언제든 해지 · 100% 환불' },
});

// ============================================================
// 렌더링 실행
// ============================================================

const cases: Array<{ layout: string; token: string; data: MoodTemplateData; label: string }> = [
  { layout: 'premium', token: 'premium', data: watch, label: '고급시계-Premium' },
  { layout: 'luxury',  token: 'luxury',  data: spa,   label: '호텔스파-Luxury' },
  { layout: 'tech',    token: 'tech',    data: saas,  label: 'AI-SaaS-Tech' },
  { layout: 'clean',   token: 'clean',   data: skincare, label: '스킨케어-Clean' },
  { layout: 'bold',    token: 'bold',    data: gym,   label: '크로스핏-Bold' },
  { layout: 'natural', token: 'natural', data: tea,   label: '유기농차-Natural' },
  { layout: 'magazine', token: 'magazine', data: coffee, label: '커피로스터리-Magazine' },
];

const outDir = join(process.cwd(), 'test-output');

for (const c of cases) {
  try {
    const html = renderMoodTemplate(c.layout, c.data, TOKENS[c.token]);
    const remaining = (html.match(/\{\{[^}]+\}\}/g) || []);
    const path = join(outDir, `industry-${c.label}.html`);
    writeFileSync(path, html, 'utf-8');
    if (remaining.length === 0) {
      console.log(`  ✅ ${c.label.padEnd(20)} — 완료`);
    } else {
      console.log(`  ⚠️ ${c.label.padEnd(20)} — 미치환 ${remaining.length}개: ${[...new Set(remaining)].slice(0, 3).join(', ')}`);
    }
  } catch (err) {
    console.log(`  ❌ ${c.label.padEnd(20)} — ${err}`);
  }
}

console.log('\n결과: test-output/industry-*.html');
