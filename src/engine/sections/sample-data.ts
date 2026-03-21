/**
 * 업종별 샘플 ProductData — 8개 업종 × 기본 번들(a)용
 * 데모/QA/스냅샷 테스트용
 */

import type { ProductData } from "./orchestrator";

export const SAMPLE_BEAUTY: ProductData = {
  productName: "라네즈 워터슬리핑마스크",
  brandColor: "#2563EB",
  fontSet: "SET-13",  // 뷰티프리미엄: 나눔명조
  headline: "자는 동안 피부가 달라진다",
  subheadline: "히알루론산 5중 복합체, 72시간 수분 지속",
  heroImageUrl: "https://placehold.co/600x400/E0F2FE/2563EB?text=Water+Sleeping+Mask",
  features: [
    { title: "5중 보습 레이어", description: "히알루론산 복합체가 5겹의 보습 장벽을 형성합니다.", icon: "💧", imageUrl: "https://placehold.co/400x400/E0F2FE/2563EB?text=Layer" },
    { title: "나이아신아마이드 10%", description: "피부 톤을 균일하게 정돈하고 모공을 관리합니다.", icon: "✨" },
    { title: "저자극 비건 인증", description: "민감성 피부 임상 테스트 완료. 비건 인증.", icon: "🛡️" },
  ],
  specs: [
    { label: "용량", value: "120ml" },
    { label: "주요 성분", value: "히알루론산, 나이아신아마이드", badge: "핵심" },
    { label: "피부 타입", value: "모든 피부" },
    { label: "유통기한", value: "제조일로부터 24개월", note: "※ 개봉 후 12개월" },
    { label: "원산지", value: "대한민국" },
  ],
  reviews: [
    { quote: "사용 후 피부결이 확실히 달라졌어요. 속건조가 사라졌습니다.", author: "김○○", meta: "30대 · 민감성", rating: 5, tags: ["재구매", "추천"] },
    { quote: "끈적임 없이 스며드는 게 신기해요. 아침까지 촉촉!", author: "이○○", meta: "40대 · 건성", rating: 5 },
    { quote: "가격 대비 성능이 훌륭합니다. 선물용으로도 좋아요.", author: "박○○", meta: "20대 · 복합성", rating: 4 },
  ],
  faqItems: [
    { question: "배송은 얼마나 걸리나요?", answer: "결제 완료 후 1~2영업일 내 출고됩니다." },
    { question: "민감성 피부에도 사용 가능한가요?", answer: "저자극 테스트를 완료한 비건 인증 제품입니다." },
    { question: "사용 순서가 어떻게 되나요?", answer: "세안 → 토너 → 세럼 → 슬리핑마스크 순서입니다." },
    { question: "환불 가능한가요?", answer: "수령 후 30일 이내 무조건 환불 가능합니다." },
  ],
  stats: [
    { number: "72", unit: "시간", label: "보습 지속력" },
    { number: "4.8", unit: "점", label: "고객 평점" },
    { number: "2,847", unit: "건", label: "실구매 리뷰" },
  ],
  awards: [
    { name: "올리브영 1위", icon: "🏆", description: "수분크림 부문 3년 연속" },
    { name: "식약처 기능성 인증", icon: "🏅" },
    { name: "2024 뷰티어워드", icon: "🥇" },
    { name: "비건 인증", icon: "🌿" },
  ],
  benefits: [
    { icon: "📦", text: "전 상품 무료배송" },
    { icon: "🔄", text: "30일 무조건 환불 보장" },
    { icon: "🎁", text: "미니 사이즈 3종 증정" },
    { icon: "💰", text: "다음 구매 시 5% 적립" },
  ],
  bundleItems: [
    { name: "본품 120ml", quantity: 1, imageUrl: "https://placehold.co/200x200/DBEAFE/2563EB?text=Main", badge: "본품" },
    { name: "미니 세럼 30ml", quantity: 1, imageUrl: "https://placehold.co/200x200/DBEAFE/2563EB?text=Mini" },
    { name: "시트마스크 5매", quantity: 1, imageUrl: "https://placehold.co/200x200/DBEAFE/2563EB?text=Mask", badge: "증정" },
  ],
  ctaText: "혜택 받고 구매하기",
  secondaryCtaText: "더 알아보기",
  microCopy: "한정 수량 소진 시 조기 마감될 수 있습니다",
  averageRating: 4.8,
  totalReviews: 2847,
  statSource: "※ 2024년 자체 임상 기준",
  beforeImageUrl: "https://placehold.co/400x400/FEE2E2/999?text=Before",
  afterImageUrl: "https://placehold.co/400x400/DBEAFE/2563EB?text=After",
  promoDeadline: "오늘 자정 마감",
  stockPercent: 73,
};

export const SAMPLE_FOOD: ProductData = {
  productName: "곰곰 유기농 토마토즙",
  brandColor: "#DC2626",
  fontSet: "SET-3",  // 커머스: 고도체
  headline: "100% 국내산 유기농 토마토",
  subheadline: "충남 부여 계약 농가, 수확 당일 착즙",
  heroImageUrl: "https://placehold.co/600x400/FEE2E2/DC2626?text=Organic+Tomato",
  features: [
    { title: "리코펜 3배", description: "일반 토마토즙 대비 리코펜 함량 3배. 항산화 효과 극대화.", icon: "🍅" },
    { title: "무첨가 100%", description: "설탕, 식품첨가물, 물 일절 무첨가. 토마토 원물만.", icon: "🚫" },
    { title: "간편 1포", description: "1포 = 토마토 3개 분량. 하루 1포면 충분합니다.", icon: "📦" },
  ],
  specs: [
    { label: "내용량", value: "80ml × 30포" },
    { label: "원재료", value: "유기농 토마토 100%", badge: "유기농" },
    { label: "보관", value: "냉장보관 (2~10°C)" },
    { label: "유통기한", value: "제조일로부터 6개월" },
    { label: "원산지", value: "충남 부여" },
  ],
  reviews: [
    { quote: "아침 공복에 한 포 마시면 하루가 개운해요.", author: "정○○", meta: "50대 · 건강관리", rating: 5, tags: ["꾸준구매"] },
    { quote: "토마토 싫어하는 아이도 잘 마셔요!", author: "한○○", meta: "30대 · 엄마", rating: 5 },
    { quote: "첨가물 없어서 안심하고 먹습니다.", author: "송○○", meta: "40대", rating: 5 },
  ],
  faqItems: [
    { question: "하루에 몇 포 마시나요?", answer: "1일 1~2포 권장. 공복 섭취 시 흡수율이 높습니다." },
    { question: "아이도 마셔도 되나요?", answer: "만 3세 이상부터 섭취 가능합니다." },
    { question: "냉동 보관해도 되나요?", answer: "냉장보관 권장. 냉동 시 식감이 변할 수 있습니다." },
    { question: "배송은 어떻게 되나요?", answer: "냉장 택배, 결제 후 1~2일 내 출고됩니다." },
  ],
  stats: [
    { number: "15", unit: "mg", label: "리코펜 함량 (1포)" },
    { number: "0", unit: "g", label: "첨가당" },
    { number: "35", unit: "kcal", label: "칼로리 (1포)" },
  ],
  awards: [
    { name: "유기농 인증", icon: "🌱" },
    { name: "HACCP", icon: "✅" },
    { name: "GAP 인증", icon: "🏅" },
  ],
  benefits: [
    { icon: "🚚", text: "냉장 무료배송" },
    { icon: "🔄", text: "맛 보장, 100% 환불" },
    { icon: "🎁", text: "미니 5포 증정" },
  ],
  bundleItems: [
    { name: "토마토즙 30포", quantity: 1, imageUrl: "https://placehold.co/200x200/FEE2E2/DC2626?text=30pk", badge: "본품" },
    { name: "미니 5포", quantity: 1, imageUrl: "https://placehold.co/200x200/FEE2E2/DC2626?text=5pk", badge: "증정" },
  ],
  ctaText: "특가로 구매하기",
  secondaryCtaText: "성분 더 보기",
  microCopy: "오늘 자정 마감 · 한정 500세트",
  averageRating: 4.9,
  totalReviews: 5200,
  statSource: "※ 식품의약품안전처 기준",
  promoDeadline: "오늘 자정 마감",
  stockPercent: 65,
};

export const SAMPLE_ELECTRONICS: ProductData = {
  productName: "UGREEN 100W GaN 충전기",
  brandColor: "#059669",
  fontSet: "SET-8",  // 어그로: SB어그로체
  headline: "GaN III, 충전의 새로운 기준",
  subheadline: "주먹보다 작은 크기에 100W 출력. 모든 기기를 하나로.",
  heroImageUrl: "https://placehold.co/600x400/ECFDF5/059669?text=100W+GaN+Charger",
  features: [
    { title: "100W 초고속", description: "맥북 프로 14인치 완속 충전 가능", icon: "⚡" },
    { title: "4포트 동시", description: "USB-C ×3 + USB-A ×1", icon: "🔌" },
    { title: "GaN III 칩셋", description: "기존 대비 40% 소형화, 발열 30% 감소", icon: "🧊" },
    { title: "접이식 플러그", description: "파우치 없이 가방에 바로. 여행 최적화.", icon: "✈️" },
  ],
  specs: [
    { label: "최대 출력", value: "100W" },
    { label: "포트", value: "USB-C ×3 + USB-A ×1" },
    { label: "크기", value: "68 × 68 × 32mm" },
    { label: "무게", value: "218g" },
    { label: "입력", value: "AC 100~240V (해외 겸용)" },
    { label: "프로토콜", value: "PD3.1, QC5.0, PPS" },
  ],
  reviews: [
    { quote: "맥북+아이패드+아이폰 동시 충전. 짐이 확 줄었습니다.", author: "조○○", meta: "IT 종사자", rating: 5, tags: ["출장필수"] },
    { quote: "이 크기에 100W라니. 기술력이 느껴집니다.", author: "윤○○", meta: "테크 유튜버", rating: 5 },
    { quote: "발열 적고 안정적. 2개째 구매.", author: "최○○", meta: "디자이너", rating: 4 },
  ],
  faqItems: [
    { question: "맥북 프로 충전 되나요?", answer: "14인치까지 단독 포트 100W 완속 충전 가능합니다." },
    { question: "발열이 심하지 않나요?", answer: "GaN III 칩셋이 발열을 30% 줄여줍니다." },
    { question: "해외에서도 사용 가능한가요?", answer: "AC 100~240V 프리볼트. 전 세계 사용 가능." },
    { question: "보증 기간은?", answer: "구매일로부터 24개월 무상 보증." },
  ],
  stats: [
    { number: "100", unit: "W", label: "최대 출력" },
    { number: "30", unit: "분", label: "아이폰 0→50%" },
    { number: "93", unit: "%", label: "충전 효율" },
  ],
  awards: [
    { name: "KC 인증", icon: "✅" },
    { name: "FCC", icon: "🇺🇸" },
    { name: "CE", icon: "🇪🇺" },
    { name: "MFi", icon: "🍎" },
  ],
  benefits: [
    { icon: "📦", text: "무료배송" },
    { icon: "🔄", text: "24개월 보증" },
    { icon: "🎁", text: "USB-C 케이블 증정" },
  ],
  compareRows: [
    { label: "출력", ours: "100W", theirs: "65W" },
    { label: "포트 수", ours: "4개", theirs: "2개" },
    { label: "GaN III", ours: "✅", theirs: "❌" },
    { label: "접이식 플러그", ours: "✅", theirs: "❌" },
    { label: "가격", ours: "42,900원", theirs: "49,000원" },
  ],
  pricing: { originalPrice: "59,000원", salePrice: "42,900원", discount: "27%" },
  ctaText: "지금 구매하기",
  secondaryCtaText: "스펙 비교",
  microCopy: "오늘 주문 시 내일 도착",
  averageRating: 4.7,
  totalReviews: 1890,
  statSource: "※ USB-PD 3.1 기준",
};

export const SAMPLE_FASHION: ProductData = {
  productName: "에센셜 오버핏 코튼 티셔츠",
  brandColor: "#1F1235",
  fontSet: "SET-2",  // 프리미엄: 넥슨Lv1고딕
  headline: "매일 입어도 질리지 않는 핏",
  subheadline: "수피마 코튼 100%. 세탁 50회에도 변형 없는 원단.",
  heroImageUrl: "https://placehold.co/600x400/F5F3FF/1F1235?text=Cotton+Tee",
  features: [
    { title: "수피마 코튼", description: "일반 면 대비 2배 내구성. 부드럽고 가벼운 착용감.", icon: "🧵" },
    { title: "오버핏 실루엣", description: "어깨 드롭 설계. 체형 커버 + 트렌디한 룩.", icon: "👕" },
    { title: "논 아이론", description: "세탁 후 그대로 입어도 깔끔한 형태 유지.", icon: "✨" },
  ],
  specs: [
    { label: "소재", value: "수피마 코튼 100%" },
    { label: "사이즈", value: "S / M / L / XL" },
    { label: "두께", value: "210g (적당한 두께감)" },
    { label: "세탁", value: "찬물 단독세탁 권장" },
    { label: "제조", value: "대한민국" },
  ],
  reviews: [
    { quote: "핏이 진짜 예뻐요. 3장 더 샀습니다.", author: "민○○", meta: "남성 · 175cm", rating: 5, tags: ["재구매"] },
    { quote: "원단 질감이 확실히 다릅니다. 비싼 값 합니다.", author: "서○○", meta: "여성 · 163cm", rating: 5 },
    { quote: "세탁해도 늘어나지 않아서 만족.", author: "강○○", meta: "남성 · 180cm", rating: 4 },
  ],
  faqItems: [
    { question: "사이즈가 크게 나오나요?", answer: "오버핏 기준이라 평소 사이즈 추천합니다." },
    { question: "줄어듦이 있나요?", answer: "세탁 50회 테스트 완료. 수축률 1% 미만." },
    { question: "교환/반품은?", answer: "수령 후 7일 이내 무료 교환/반품." },
  ],
  stats: [
    { number: "50", unit: "회", label: "세탁 내구성" },
    { number: "4.7", unit: "점", label: "평점" },
    { number: "15,000", unit: "장", label: "누적 판매" },
  ],
  awards: [
    { name: "OEKO-TEX 인증", icon: "🏅" },
    { name: "무신사 베스트", icon: "🏆" },
  ],
  benefits: [
    { icon: "📦", text: "무료배송" },
    { icon: "🔄", text: "7일 무료 교환" },
    { icon: "👕", text: "사이즈 교환 1회 무료" },
  ],
  ctaText: "장바구니 담기",
  microCopy: "오늘 주문 시 내일 도착",
  averageRating: 4.7,
  totalReviews: 3200,
};

export const SAMPLE_LIVING: ProductData = {
  productName: "모던 허브 디퓨저",
  brandColor: "#6B8F71",
  fontSet: "SET-6",  // 소프트: 나눔스퀘어라운드
  headline: "집 안 가득 자연의 향",
  subheadline: "100% 천연 에센셜 오일. 90일 지속 프리미엄 디퓨저.",
  heroImageUrl: "https://placehold.co/600x400/F0FDF4/6B8F71?text=Herb+Diffuser",
  features: [
    { title: "천연 에센셜 오일", description: "합성 향료 0%. 라벤더, 유칼립투스, 시더우드 블렌드.", icon: "🌿" },
    { title: "90일 지속", description: "200ml 대용량. 하루 8시간 기준 3개월.", icon: "⏰" },
    { title: "인테리어 오브제", description: "미니멀 세라믹 보틀. 어떤 공간에도 자연스럽게.", icon: "🏠" },
  ],
  specs: [
    { label: "용량", value: "200ml" },
    { label: "지속 기간", value: "약 90일" },
    { label: "향", value: "라벤더 / 유칼립투스 / 시더우드" },
    { label: "소재", value: "세라믹 보틀 + 자작나무 스틱" },
    { label: "원산지", value: "대한민국" },
  ],
  reviews: [
    { quote: "은은하게 퍼지는 향이 정말 좋아요. 합성 향 냄새가 전혀 없습니다.", author: "윤○○", meta: "원룸 거주", rating: 5 },
    { quote: "인테리어 소품으로도 완벽. 선물했더니 대만족.", author: "김○○", meta: "신혼집", rating: 5 },
    { quote: "3개월 넘게 쓰고 있는데 아직도 향이 납니다.", author: "이○○", meta: "오피스", rating: 4 },
  ],
  faqItems: [
    { question: "향이 강한 편인가요?", answer: "천연 오일 특성상 은은하게 퍼지며, 환기 정도에 따라 다릅니다." },
    { question: "스틱은 몇 개 꽂나요?", answer: "3~5개 권장. 많을수록 향이 강해집니다." },
    { question: "반려동물에게 안전한가요?", answer: "천연 오일이지만 고양이가 있는 집은 사전 확인 부탁드립니다." },
  ],
  stats: [
    { number: "90", unit: "일", label: "향 지속" },
    { number: "4.9", unit: "점", label: "평점" },
    { number: "8,500", unit: "개", label: "누적 판매" },
  ],
  awards: [
    { name: "천연 인증", icon: "🌱" },
    { name: "리빙 브랜드 1위", icon: "🏆" },
  ],
  benefits: [
    { icon: "📦", text: "무료배송" },
    { icon: "🔄", text: "향 불만족 시 교환" },
    { icon: "🎁", text: "미니 캔들 증정" },
  ],
  ctaText: "지금 주문하기",
  microCopy: "당일 출고 · 무료배송",
  averageRating: 4.9,
  totalReviews: 8500,
};

export const SAMPLE_SAAS: ProductData = {
  productName: "Flowdesk",
  brandColor: "#7C3AED",
  fontSet: "SET-1",  // 임팩트: 넥슨카트고딕
  headline: "팀 업무, 한눈에 정리",
  subheadline: "프로젝트 관리부터 문서 협업까지. 올인원 워크스페이스.",
  heroImageUrl: "https://placehold.co/600x400/EDE9FE/7C3AED?text=Flowdesk+App",
  features: [
    { title: "칸반 + 타임라인", description: "프로젝트 진행 상황을 한눈에. 드래그 앤 드롭으로 관리.", icon: "📋" },
    { title: "실시간 문서 협업", description: "노션처럼 쓰고, 슬랙처럼 소통. 하나의 공간에서.", icon: "📝" },
    { title: "자동화 워크플로우", description: "반복 작업을 규칙 기반으로 자동 처리. 시간 절약.", icon: "⚡" },
    { title: "통합 대시보드", description: "OKR, KPI, 진행률을 한 화면에서 확인.", icon: "📊" },
  ],
  specs: [
    { label: "팀원 수", value: "무제한" },
    { label: "스토리지", value: "100GB (Pro 기준)" },
    { label: "연동", value: "Slack, Notion, Google, Jira" },
    { label: "보안", value: "SOC2, 256-bit 암호화" },
    { label: "지원", value: "24/7 이메일 + 채팅" },
  ],
  reviews: [
    { quote: "노션+슬랙+지라를 하나로. 툴 피로도가 확 줄었습니다.", author: "스타트업 A사 CTO", rating: 5 },
    { quote: "온보딩 5분이면 끝. 팀원들이 바로 적응했어요.", author: "마케팅 팀장 B", rating: 5 },
    { quote: "자동화 기능 때문에 주 5시간 절약하고 있습니다.", author: "PM C", rating: 5 },
  ],
  faqItems: [
    { question: "무료 플랜이 있나요?", answer: "팀원 5명까지 무료. 기능 제한 없음." },
    { question: "기존 데이터 마이그레이션은?", answer: "Notion, Jira에서 1클릭 임포트 지원." },
    { question: "보안 인증은?", answer: "SOC2 Type II 인증 완료. 엔터프라이즈 등급 보안." },
    { question: "해지하면 데이터는?", answer: "해지 후 30일간 데이터 보존. CSV 내보내기 가능." },
  ],
  stats: [
    { number: "12,000", unit: "팀", label: "도입 기업" },
    { number: "5", unit: "시간/주", label: "업무 시간 절약" },
    { number: "99.9", unit: "%", label: "가동률" },
  ],
  awards: [
    { name: "SOC2 인증", icon: "🔒" },
    { name: "ProductHunt #1", icon: "🏆" },
    { name: "G2 Leader", icon: "⭐" },
  ],
  benefits: [
    { icon: "🆓", text: "14일 무료 체험" },
    { icon: "💳", text: "카드 등록 불필요" },
    { icon: "🔄", text: "언제든 해지 가능" },
    { icon: "📞", text: "전담 온보딩 지원" },
  ],
  pricing: {
    plans: [
      { name: "Free", price: "0원", period: "/월", benefits: [{ text: "팀원 5명" }, { text: "기본 기능" }], ctaText: "시작하기" },
      { name: "Pro", price: "9,900원", originalPrice: "15,000원", period: "/월", badge: "추천", recommended: true, benefits: [{ text: "팀원 무제한" }, { text: "자동화" }, { text: "100GB" }], ctaText: "무료 체험" },
      { name: "Enterprise", price: "문의", benefits: [{ text: "전체 기능" }, { text: "전담 매니저" }, { text: "SLA 보장" }], ctaText: "문의하기" },
    ],
  },
  ctaText: "14일 무료 체험 시작",
  secondaryCtaText: "데모 요청",
  microCopy: "카드 등록 없이 시작 · 언제든 해지",
  averageRating: 4.8,
  totalReviews: 3400,
};

export const SAMPLE_EDUCATION: ProductData = {
  productName: "코딩캠프 부트캠프",
  fontSet: "SET-7",  // 유쾌: Paperlogy
  brandColor: "#0891B2",
  headline: "12주 만에 개발자 되기",
  subheadline: "현직 시니어 개발자 1:1 멘토링. 취업률 94%.",
  heroImageUrl: "https://placehold.co/600x400/ECFEFF/0891B2?text=Coding+Bootcamp",
  features: [
    { title: "실무 프로젝트 5개", description: "포트폴리오에 바로 넣을 수 있는 실전 프로젝트.", icon: "💻" },
    { title: "1:1 멘토링", description: "현직 시니어 개발자가 주 2회 코드 리뷰.", icon: "👨‍🏫" },
    { title: "취업 연계", description: "파트너 기업 50곳 이상. 이력서·면접 코칭 포함.", icon: "🏢" },
  ],
  specs: [
    { label: "기간", value: "12주 (풀타임)" },
    { label: "커리큘럼", value: "HTML/CSS → JS → React → Node.js → 프로젝트" },
    { label: "정원", value: "기수당 20명" },
    { label: "수강 방식", value: "온라인 라이브 + 녹화 제공" },
    { label: "수료 조건", value: "출석 80% + 프로젝트 5개 완료" },
  ],
  reviews: [
    { quote: "비전공자인데 12주 만에 스타트업에 취업했습니다.", author: "이○○", meta: "27세 · 비전공", rating: 5, tags: ["취업성공"] },
    { quote: "멘토님 코드 리뷰가 진짜 성장의 핵심이었어요.", author: "김○○", meta: "31세 · 전직 디자이너", rating: 5 },
    { quote: "다른 부트캠프 2개 듣다가 여기서 처음 완주했습니다.", author: "박○○", meta: "24세 · 대학생", rating: 5 },
  ],
  faqItems: [
    { question: "비전공자도 가능한가요?", answer: "전체 수강생 60%가 비전공자입니다. 기초부터 시작합니다." },
    { question: "노트북 사양은?", answer: "RAM 8GB 이상이면 충분합니다." },
    { question: "중도 포기 시 환불은?", answer: "수강 시작 14일 이내 전액 환불." },
    { question: "취업 못 하면?", answer: "6개월 내 취업 못 할 경우 수강료 전액 환불." },
  ],
  stats: [
    { number: "94", unit: "%", label: "취업률" },
    { number: "3,200", unit: "명", label: "수료생" },
    { number: "12", unit: "주", label: "커리큘럼" },
  ],
  awards: [
    { name: "고용노동부 인증", icon: "🏅" },
    { name: "취업률 1위", icon: "🏆" },
    { name: "수강생 만족도 A+", icon: "⭐" },
  ],
  benefits: [
    { icon: "💰", text: "취업 실패 시 전액 환불" },
    { icon: "👨‍🏫", text: "현직 시니어 1:1 멘토링" },
    { icon: "🏢", text: "파트너 기업 50곳 취업 연계" },
    { icon: "📹", text: "수업 녹화본 평생 제공" },
  ],
  pricing: {
    originalPrice: "4,500,000원",
    salePrice: "2,990,000원",
    discount: "33%",
  },
  ctaText: "무료 상담 신청",
  secondaryCtaText: "커리큘럼 보기",
  microCopy: "6개월 내 취업 못 하면 전액 환불",
  averageRating: 4.9,
  totalReviews: 1200,
  statSource: "※ 2024년 수료생 기준",
};

export const SAMPLE_ENTERPRISE: ProductData = {
  productName: "SecureGate",
  brandColor: "#1E3A5F",
  fontSet: "SET-9",  // 클래식고딕: 조선견고딕
  headline: "기업 보안, 한 단계 올리세요",
  subheadline: "제로 트러스트 보안 플랫폼. 도입 즉시 위험 73% 감소.",
  heroImageUrl: "https://placehold.co/600x400/E0F2FE/1E3A5F?text=SecureGate",
  features: [
    { title: "제로 트러스트 아키텍처", description: "모든 접근을 검증. 내부 위협까지 실시간 탐지.", icon: "🔒" },
    { title: "SIEM 통합", description: "기존 보안 인프라와 원클릭 연동. 마이그레이션 불필요.", icon: "🔗" },
    { title: "컴플라이언스 자동화", description: "SOC2, ISO27001, GDPR 자동 준수 보고서 생성.", icon: "📋" },
    { title: "24/7 SOC", description: "보안 운영 센터 상시 모니터링. 평균 대응 시간 3분.", icon: "🛡️" },
  ],
  specs: [
    { label: "도입 기간", value: "2주 (기본 설정)" },
    { label: "연동", value: "AWS, Azure, GCP, On-premise" },
    { label: "인증", value: "SOC2, ISO27001, GDPR" },
    { label: "SLA", value: "99.99% 가동률 보장" },
    { label: "지원", value: "전담 TAM + 24/7 긴급 대응" },
  ],
  reviews: [
    { quote: "도입 2주 만에 보안 인시던트 73% 감소. ROI가 즉시 나왔습니다.", author: "A사 CISO", rating: 5 },
    { quote: "컴플라이언스 보고서를 자동으로 만들어줘서 감사 준비 시간이 80% 줄었습니다.", author: "B사 CTO", rating: 5 },
    { quote: "기존 인프라 건드리지 않고 바로 연동. 마이그레이션 스트레스가 없었습니다.", author: "C사 DevOps Lead", rating: 5 },
  ],
  faqItems: [
    { question: "기존 보안 솔루션과 충돌하나요?", answer: "아닙니다. SIEM/EDR 등 기존 솔루션과 병행 운영 가능합니다." },
    { question: "최소 도입 규모는?", answer: "직원 50명 이상 기업부터 도입 가능합니다." },
    { question: "커스터마이징 가능한가요?", answer: "Enterprise 플랜에서 정책/대시보드 완전 커스터마이징 지원." },
    { question: "POC 가능한가요?", answer: "2주 무료 POC를 제공합니다. 실 환경에서 테스트 가능." },
  ],
  stats: [
    { number: "73", unit: "%", label: "위험 감소" },
    { number: "3", unit: "분", label: "평균 대응 시간" },
    { number: "500", unit: "+", label: "도입 기업" },
  ],
  awards: [
    { name: "SOC2 Type II", icon: "🔒" },
    { name: "ISO 27001", icon: "🏅" },
    { name: "Gartner 선정", icon: "⭐" },
    { name: "KISA 인증", icon: "🇰🇷" },
  ],
  benefits: [
    { icon: "🆓", text: "2주 무료 POC" },
    { icon: "🔗", text: "기존 인프라 무중단 연동" },
    { icon: "📋", text: "컴플라이언스 자동 보고서" },
    { icon: "👨‍💼", text: "전담 TAM 배정" },
  ],
  compareRows: [
    { label: "제로 트러스트", ours: "✅ 완전 구현", theirs: "부분 지원" },
    { label: "도입 기간", ours: "2주", theirs: "2~3개월" },
    { label: "컴플라이언스 자동화", ours: "✅", theirs: "❌" },
    { label: "24/7 SOC", ours: "✅ 포함", theirs: "별도 비용" },
    { label: "SLA", ours: "99.99%", theirs: "99.9%" },
  ],
  ctaText: "무료 POC 신청",
  secondaryCtaText: "도입 사례 보기",
  microCopy: "2주 무료 체험 · 기술 미팅 30분 제공",
  averageRating: 4.8,
  totalReviews: 340,
  statSource: "※ 2024년 도입 기업 평균",
};

// ── 전체 맵 ──
export const SAMPLE_DATA: Record<string, ProductData> = {
  beauty: SAMPLE_BEAUTY,
  food: SAMPLE_FOOD,
  electronics: SAMPLE_ELECTRONICS,
  fashion: SAMPLE_FASHION,
  living: SAMPLE_LIVING,
  saas: SAMPLE_SAAS,
  education: SAMPLE_EDUCATION,
  enterprise: SAMPLE_ENTERPRISE,
};

export function getSampleData(industry: string): ProductData {
  return SAMPLE_DATA[industry] || SAMPLE_BEAUTY;
}
