// ============================================================
// Mood Renderer 실전 테스트
// Premium 템플릿 + "에르고 의자" 데이터 → HTML 생성
// 실행: npx tsx scripts/test-mood-renderer.ts
// ============================================================

import { renderMoodTemplate, type MoodTemplateData } from '@/engine/10-code-engine/mood-renderer';
import { writeFileSync } from 'fs';
import { join } from 'path';

// 완전히 다른 제품 — "에르고 체어 프로"
const chairData: MoodTemplateData = {
  brand: 'ERGO CHAIR PRO',
  hero: {
    headline: '당신의 허리가<br><em>감사할 의자</em>',
    subheadline: '인체공학 설계 × 프리미엄 소재.<br>하루 8시간, 10년을 함께할 의자.',
    cta: '무료 체험 신청',
  },
  intro: {
    headline: '앉는 자세의 혁신,<br><em>ErgoChair</em> 프로',
    body: '15년간의 인체공학 연구와 3,000명의 임상 데이터를 기반으로 설계했습니다. 허리, 목, 어깨의 부담을 분산하여 장시간 앉아도 피로하지 않는 경험을 만듭니다.',
  },
  feat1: {
    headline: '4D <em>럼버 서포트</em>',
    body: '허리 곡선에 맞춰 4방향으로 조절되는 럼버 서포트. 앉는 순간 자동으로 체형을 감지합니다.',
    tag1: '자동 체형 감지',
    tag2: '4방향 조절',
  },
  feat2: {
    headline: '메시 <em>통기성</em> 소재',
    body: '항공우주급 메시 소재로 여름에도 쾌적합니다. 체온을 자동으로 조절하여 땀 없는 착석감.',
    tag1: '항공 메시',
    tag2: '온도 조절',
  },
  feat3: {
    headline: '12단계 <em>높이 조절</em>',
    body: '팔걸이, 좌석 높이, 등받이 각도까지 12개 포인트를 세밀하게 조절. 당신만의 완벽한 자세를 찾으세요.',
    tag1: '12포인트 조절',
    tag2: '맞춤 설정',
  },
  stat1: { value: '97', unit: '%', label: '고객 만족도' },
  stat2: { value: '8500', unit: '', label: '5성급 리뷰' },
  stat3: { value: '30', unit: '일', label: '무료 체험' },
  stat4: { value: '12', unit: '년', label: '프레임 보증' },
  fullbleed: {
    headline: '독일 엔지니어링의<br><em>정밀함</em>',
    body: '알루미늄 다이캐스트 프레임, 이탈리아산 가죽 팔걸이, 독일 가스 실린더 — 모든 부품은 TÜV 인증을 받았습니다. 10년 사용해도 처음 그대로.',
  },
  before1: { title: '오후 3시 허리 통증', desc: '일반 의자의 평평한 등받이로 요추 지지 부족' },
  before2: { title: '집중력 저하', desc: '불편한 자세로 인한 잦은 자세 변경, 업무 효율 감소' },
  before3: { title: '2년마다 의자 교체', desc: '쿠션 꺼짐, 가스 실린더 고장으로 반복 구매' },
  after1: { title: '8시간 무통증', desc: '4D 럼버 서포트가 허리를 완벽하게 받쳐줌' },
  after2: { title: '집중력 35% 향상', desc: '편안한 자세 유지로 몰입 시간 대폭 증가' },
  after3: { title: '12년 프레임 보증', desc: '알루미늄 프레임 + TÜV 인증 부품으로 장기 사용' },
  pricing: {
    headline: '합리적인 <em>투자</em>',
    tier1: {
      name: 'Standard',
      price: '₩690,000',
      unit: '/ 기본',
      desc: '완벽한 자세의 시작',
      features: ['4D 럼버 서포트', '메시 등받이', '3D 팔걸이', '무료 배송', '30일 무료 체험'],
      cta: 'Standard 선택',
    },
    tier2: {
      name: 'Premium',
      price: '₩1,190,000',
      unit: '/ 풀옵션',
      desc: '타협 없는 프리미엄',
      features: ['Standard 전체 포함', '이탈리아 가죽 팔걸이', '헤드레스트 포함', '좌석 깊이 조절', '12년 프레임 보증', '평생 무상 수리'],
      cta: 'Premium 선택',
    },
  },
  reviews: {
    headline: '실사용자 <em>후기</em>',
    items: [
      { name: '이정호', meta: '개발자 · 판교', avatar: 'https://i.pravatar.cc/120?img=11', quote: '하루 10시간 코딩하는데 허리가 안 아파요. 인생 의자입니다.' },
      { name: '박소연', meta: '디자이너 · 서울', avatar: 'https://i.pravatar.cc/120?img=45', quote: '이전 의자에서 목 통증이 심했는데 완전히 사라졌어요.' },
      { name: '김태현', meta: 'PO · 강남', avatar: 'https://i.pravatar.cc/120?img=53', quote: '회의실에서도 이 의자 쓰고 싶을 정도. 회사에 추가 주문했습니다.' },
      { name: '최유진', meta: '작가 · 제주', avatar: 'https://i.pravatar.cc/120?img=29', quote: '글 쓸 때 자세가 편하니까 집중 시간이 확 늘었어요.' },
    ],
  },
  faq: [
    { question: '조립이 어렵지 않나요?', answer: '전문 기사가 방문하여 무료로 조립 설치합니다. 30분이면 완료됩니다.' },
    { question: '30일 체험 후 반품 절차는?', answer: '고객센터에 연락하시면 48시간 내 수거 방문. 전액 환불이며 수거비 무료입니다.' },
    { question: '쿠션은 교체 가능한가요?', answer: '네, 좌석 쿠션과 팔걸이 패드는 개별 구매 가능합니다. 3년 주기 교체를 권장합니다.' },
    { question: '체중 제한이 있나요?', answer: '150kg까지 지원합니다. 알루미늄 프레임으로 내구성이 뛰어납니다.' },
  ],
  cta: {
    headline: '지금 바꾸면<br><em>내일이 다릅니다</em>',
    body: '30일 무위험 체험으로 시작하세요.<br>만족하지 못하시면 전액 환불해 드립니다.',
    cta: '무료 체험 신청',
    micro: '무료 배송 · 무료 조립 · 100% 환불 보장',
  },
};

const moods = ['luxury', 'tech', 'clean', 'bold', 'natural', 'premium'];
const outDir = join(process.cwd(), 'test-output');

for (const mood of moods) {
  try {
    const html = renderMoodTemplate(mood, chairData);
    const remaining = (html.match(/\{\{[^}]+\}\}/g) || []);
    const outPath = join(outDir, `mood-test-${mood}.html`);
    writeFileSync(outPath, html, 'utf-8');
    if (remaining.length === 0) {
      console.log(`  ✅ ${mood.padEnd(8)} — 치환 완료, 미치환 0개`);
    } else {
      console.log(`  ⚠️ ${mood.padEnd(8)} — 미치환 ${remaining.length}개: ${[...new Set(remaining)].slice(0, 5).join(', ')}`);
    }
  } catch (err) {
    console.log(`  ❌ ${mood.padEnd(8)} — ${err}`);
  }
}
console.log('\n결과 파일: test-output/mood-test-*.html');
