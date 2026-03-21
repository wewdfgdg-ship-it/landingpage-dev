/**
 * 업종별 랜딩 번들 — 5업종 × 5변형 = 25개
 * 각 번들 10섹션 고정
 *
 * 사용: getBundles('beauty') → 5개 번들
 *       getDefaultBundle('beauty') → beauty-a (기본)
 *       getBundle('beauty', 'c') → beauty-c
 */

export type Industry = "beauty" | "electronics" | "food" | "living" | "fashion" | "saas" | "education" | "enterprise";
export type BundleVariant = "a" | "b" | "c" | "d" | "e";

export type SectionFamily =
  | "hero" | "t1" | "t2" | "t3" | "t4" | "t5" | "t6"
  | "t7" | "t8" | "t9" | "t10" | "t11" | "t12" | "t13" | "t14" | "t15";

export type Mood = "clean" | "soft" | "dark" | "warm" | "navy";

export type BundleSection = {
  order: number;
  family: SectionFamily;
  layoutId: string;
  mood: Mood;
  purpose: string;
};

export type LandingBundle = {
  industry: Industry;
  variant: BundleVariant;
  label: string;
  strategy: string;
  isDefault: boolean;
  sections: BundleSection[];
};

// ═══════════════════════════════════════════
// BEAUTY
// ═══════════════════════════════════════════
const BEAUTY: LandingBundle[] = [
  {
    industry: "beauty", variant: "a", label: "성분/기능 중심", strategy: "핵심 성분과 효능을 근거와 함께 설득", isDefault: true,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-a", mood: "soft", purpose: "제품 첫인상, 핵심 효능" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "핵심 특징 3~4개 요약" },
      { order: 3, family: "t2", layoutId: "FD-A", mood: "soft", purpose: "주성분 상세 설명" },
      { order: 4, family: "t3", layoutId: "SI-B", mood: "clean", purpose: "사용법 3단계" },
      { order: 5, family: "t10", layoutId: "ST-B", mood: "clean", purpose: "임상 수치 강조" },
      { order: 6, family: "t4", layoutId: "BA-C", mood: "clean", purpose: "사용 전후 변화" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증/임상 근거" },
      { order: 8, family: "t8", layoutId: "RV-A", mood: "soft", purpose: "평점 + 대표 후기" },
      { order: 9, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "의심 해소" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "구매 유도" },
    ],
  },
  {
    industry: "beauty", variant: "b", label: "후기/전환 중심", strategy: "실사용 후기와 감성으로 전환 유도", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-b", mood: "soft", purpose: "감성 히어로" },
      { order: 2, family: "t1", layoutId: "KF-B", mood: "clean", purpose: "핵심 특징 요약" },
      { order: 3, family: "t5", layoutId: "LS-A", mood: "soft", purpose: "사용 장면" },
      { order: 4, family: "t8", layoutId: "RV-A", mood: "soft", purpose: "후기 카드" },
      { order: 5, family: "t13", layoutId: "PR-A", mood: "clean", purpose: "포토 리뷰" },
      { order: 6, family: "t10", layoutId: "ST-A", mood: "clean", purpose: "만족도 수치" },
      { order: 7, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "수상/인증" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "의심 해소" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "beauty", variant: "c", label: "임상/수치 중심", strategy: "데이터와 비교로 논리적 설득", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-c", mood: "clean", purpose: "수치 강조 히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "핵심 특징" },
      { order: 3, family: "t10", layoutId: "ST-A", mood: "clean", purpose: "핵심 수치" },
      { order: 4, family: "t2", layoutId: "FD-B", mood: "clean", purpose: "임상 근거 상세" },
      { order: 5, family: "t4", layoutId: "BA-A", mood: "clean", purpose: "전후 비교" },
      { order: 6, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "경쟁 제품 비교" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 8, family: "t8", layoutId: "RV-B", mood: "soft", purpose: "대표 후기" },
      { order: 9, family: "t7", layoutId: "FAQ-B", mood: "clean", purpose: "FAQ" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "beauty", variant: "d", label: "감성/라이프스타일", strategy: "감성과 분위기로 브랜드 경험 전달", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-d", mood: "soft", purpose: "감성 히어로" },
      { order: 2, family: "t5", layoutId: "LS-A", mood: "soft", purpose: "라이프스타일" },
      { order: 3, family: "t1", layoutId: "KF-C", mood: "clean", purpose: "특징 리스트" },
      { order: 4, family: "t2", layoutId: "FD-C", mood: "soft", purpose: "감성+효능 교차" },
      { order: 5, family: "t8", layoutId: "RV-B", mood: "soft", purpose: "대표 후기" },
      { order: 6, family: "t13", layoutId: "PR-A", mood: "clean", purpose: "포토 리뷰" },
      { order: 7, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "신뢰" },
      { order: 8, family: "t2", layoutId: "FD-A", mood: "soft", purpose: "브랜드 스토리" },
      { order: 9, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "의심 해소" },
      { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "beauty", variant: "e", label: "프로모/구성 중심", strategy: "가격과 구성으로 즉시 전환 유도", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-e", mood: "dark", purpose: "프로모 히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "핵심 특징" },
      { order: 3, family: "t12", layoutId: "BN-B", mood: "clean", purpose: "세트 구성" },
      { order: 4, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "가격 안내" },
      { order: 5, family: "t8", layoutId: "RV-A", mood: "soft", purpose: "후기" },
      { order: 6, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 7, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "환불/보장" },
      { order: 8, family: "t14", layoutId: "PL-A", mood: "dark", purpose: "긴급 프로모" },
      { order: 9, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
];

// ═══════════════════════════════════════════
// DEVICE
// ═══════════════════════════════════════════
const DEVICE: LandingBundle[] = [
  {
    industry: "electronics", variant: "a", label: "스펙/성능 중심", strategy: "기술력과 수치로 성능 증명", isDefault: true,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-a", mood: "dark", purpose: "제품 히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "핵심 스펙 요약" },
      { order: 3, family: "t3", layoutId: "SI-A", mood: "clean", purpose: "상세 스펙" },
      { order: 4, family: "t2", layoutId: "FD-A", mood: "clean", purpose: "핵심 기능 상세" },
      { order: 5, family: "t10", layoutId: "ST-A", mood: "dark", purpose: "성능 수치" },
      { order: 6, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "경쟁 비교" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 8, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
      { order: 9, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "의심 해소" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "electronics", variant: "b", label: "사용성/경험 중심", strategy: "실사용 경험과 편의성 강조", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-b", mood: "dark", purpose: "히어로" },
      { order: 2, family: "t5", layoutId: "LS-A", mood: "clean", purpose: "사용 장면" },
      { order: 3, family: "t1", layoutId: "KF-B", mood: "clean", purpose: "특징" },
      { order: 4, family: "t2", layoutId: "FD-C", mood: "clean", purpose: "기능 상세" },
      { order: 5, family: "t3", layoutId: "SI-B", mood: "clean", purpose: "사용법 단계" },
      { order: 6, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
      { order: 7, family: "t10", layoutId: "ST-A", mood: "dark", purpose: "수치" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "electronics", variant: "c", label: "비교/우위 중심", strategy: "경쟁 제품 대비 차별성 부각", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-c", mood: "dark", purpose: "히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t11", layoutId: "CM-B", mood: "clean", purpose: "비교 강조" },
      { order: 4, family: "t10", layoutId: "ST-B", mood: "dark", purpose: "대표 수치" },
      { order: 5, family: "t2", layoutId: "FD-A", mood: "clean", purpose: "기능 상세" },
      { order: 6, family: "t4", layoutId: "BA-C", mood: "clean", purpose: "개선 포인트" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 8, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
      { order: 9, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "가격" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "electronics", variant: "d", label: "브랜드/디자인 중심", strategy: "디자인 철학과 브랜드 감성 전달", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-d", mood: "dark", purpose: "감성 히어로" },
      { order: 2, family: "t5", layoutId: "LS-B", mood: "clean", purpose: "라이프스타일" },
      { order: 3, family: "t1", layoutId: "KF-C", mood: "clean", purpose: "특징 리스트" },
      { order: 4, family: "t2", layoutId: "FD-B", mood: "clean", purpose: "디자인 상세" },
      { order: 5, family: "t2", layoutId: "FD-C", mood: "clean", purpose: "브랜드 철학" },
      { order: 6, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
      { order: 7, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "수상" },
      { order: 8, family: "t7", layoutId: "FAQ-B", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "electronics", variant: "e", label: "가격/번들 중심", strategy: "가격과 구성으로 즉시 전환", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-e", mood: "dark", purpose: "프로모 히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t12", layoutId: "BN-A", mood: "clean", purpose: "번들 구성" },
      { order: 4, family: "t15", layoutId: "PR-B", mood: "clean", purpose: "플랜 비교" },
      { order: 5, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "보장/AS" },
      { order: 6, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
];

// ═══════════════════════════════════════════
// FOOD
// ═══════════════════════════════════════════
const FOOD: LandingBundle[] = [
  {
    industry: "food", variant: "a", label: "원재료/효능 중심", strategy: "원재료와 영양 근거로 설득", isDefault: true,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-a", mood: "warm", purpose: "제품 히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "핵심 특징" },
      { order: 3, family: "t2", layoutId: "FD-A", mood: "warm", purpose: "원재료 상세" },
      { order: 4, family: "t3", layoutId: "SI-A", mood: "clean", purpose: "영양 성분표" },
      { order: 5, family: "t10", layoutId: "ST-B", mood: "dark", purpose: "함량 수치" },
      { order: 6, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "HACCP/인증" },
      { order: 7, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/환불 안내" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "food", variant: "b", label: "후기/재구매 중심", strategy: "실구매 후기로 신뢰 확보", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-b", mood: "warm", purpose: "히어로" },
      { order: 2, family: "t1", layoutId: "KF-B", mood: "clean", purpose: "특징" },
      { order: 3, family: "t5", layoutId: "LS-A", mood: "warm", purpose: "사용 장면" },
      { order: 4, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기 카드" },
      { order: 5, family: "t13", layoutId: "PR-A", mood: "clean", purpose: "포토 리뷰" },
      { order: 6, family: "t10", layoutId: "ST-A", mood: "dark", purpose: "재구매율" },
      { order: 7, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "인증" },
      { order: 8, family: "t7", layoutId: "FAQ-B", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "food", variant: "c", label: "비교/신뢰 중심", strategy: "비교와 인증으로 논리적 설득", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-c", mood: "clean", purpose: "히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "비교표" },
      { order: 4, family: "t10", layoutId: "ST-A", mood: "dark", purpose: "수치" },
      { order: 5, family: "t3", layoutId: "SI-B", mood: "clean", purpose: "섭취 가이드" },
      { order: 6, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 7, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
      { order: 8, family: "t12", layoutId: "BN-B", mood: "clean", purpose: "구성" },
      { order: 9, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "가격" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "food", variant: "d", label: "감성/산지 스토리", strategy: "산지와 브랜드 감성으로 공감", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-d", mood: "warm", purpose: "감성 히어로" },
      { order: 2, family: "t5", layoutId: "LS-B", mood: "warm", purpose: "산지 장면" },
      { order: 3, family: "t1", layoutId: "KF-C", mood: "clean", purpose: "특징 리스트" },
      { order: 4, family: "t2", layoutId: "FD-C", mood: "warm", purpose: "원재료 스토리" },
      { order: 5, family: "t2", layoutId: "FD-B", mood: "warm", purpose: "브랜드 이야기" },
      { order: 6, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
      { order: 7, family: "t13", layoutId: "PR-A", mood: "clean", purpose: "포토 리뷰" },
      { order: 8, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "인증" },
      { order: 9, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "의심 해소" },
      { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "food", variant: "e", label: "세트/프로모션 중심", strategy: "구성과 가격으로 즉시 전환", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-e", mood: "dark", purpose: "프로모 히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t12", layoutId: "BN-A", mood: "clean", purpose: "세트 구성" },
      { order: 4, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "가격" },
      { order: 5, family: "t3", layoutId: "SI-B", mood: "clean", purpose: "섭취법/보관법" },
      { order: 6, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
];

// ═══════════════════════════════════════════
// LIVING
// ═══════════════════════════════════════════
const LIVING: LandingBundle[] = [
  {
    industry: "living", variant: "a", label: "기능/문제해결 중심", strategy: "기능과 편의성으로 문제 해결 제시", isDefault: true,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-a", mood: "clean", purpose: "히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t2", layoutId: "FD-A", mood: "clean", purpose: "기능 상세" },
      { order: 4, family: "t3", layoutId: "SI-A", mood: "clean", purpose: "스펙" },
      { order: 5, family: "t10", layoutId: "ST-B", mood: "dark", purpose: "수치" },
      { order: 6, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "비교" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 8, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
      { order: 9, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "의심 해소" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "living", variant: "b", label: "사용성/리뷰 중심", strategy: "실사용 경험과 편의성 부각", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-b", mood: "clean", purpose: "히어로" },
      { order: 2, family: "t5", layoutId: "LS-A", mood: "clean", purpose: "사용 장면" },
      { order: 3, family: "t1", layoutId: "KF-B", mood: "clean", purpose: "특징" },
      { order: 4, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
      { order: 5, family: "t13", layoutId: "PR-A", mood: "clean", purpose: "포토 리뷰" },
      { order: 6, family: "t3", layoutId: "SI-B", mood: "clean", purpose: "사용법" },
      { order: 7, family: "t10", layoutId: "ST-A", mood: "dark", purpose: "수치" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "living", variant: "c", label: "비교/수치 중심", strategy: "비교와 데이터로 합리적 선택 유도", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-c", mood: "clean", purpose: "히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t10", layoutId: "ST-A", mood: "dark", purpose: "수치" },
      { order: 4, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "비교표" },
      { order: 5, family: "t4", layoutId: "BA-C", mood: "clean", purpose: "전후 비교" },
      { order: 6, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 7, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
      { order: 8, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "보장/정책" },
      { order: 9, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "가격" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "living", variant: "d", label: "공간감/라이프스타일", strategy: "공간 연출과 감성으로 공감", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-d", mood: "clean", purpose: "감성 히어로" },
      { order: 2, family: "t5", layoutId: "LS-B", mood: "clean", purpose: "공간 장면" },
      { order: 3, family: "t1", layoutId: "KF-C", mood: "clean", purpose: "특징 리스트" },
      { order: 4, family: "t2", layoutId: "FD-C", mood: "clean", purpose: "디자인 상세" },
      { order: 5, family: "t2", layoutId: "FD-B", mood: "clean", purpose: "브랜드 스토리" },
      { order: 6, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
      { order: 7, family: "t13", layoutId: "PR-A", mood: "clean", purpose: "포토 리뷰" },
      { order: 8, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "수상" },
      { order: 9, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "의심 해소" },
      { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "living", variant: "e", label: "구성/가격 중심", strategy: "가격과 구성으로 즉시 전환", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-e", mood: "dark", purpose: "프로모 히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t12", layoutId: "BN-B", mood: "clean", purpose: "번들" },
      { order: 4, family: "t15", layoutId: "PR-B", mood: "clean", purpose: "가격 비교" },
      { order: 5, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "보장/정책" },
      { order: 6, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
];

// ═══════════════════════════════════════════
// FASHION
// ═══════════════════════════════════════════
const FASHION: LandingBundle[] = [
  {
    industry: "fashion", variant: "a", label: "제품특징/소재 중심", strategy: "소재와 핏으로 제품력 증명", isDefault: true,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-a", mood: "soft", purpose: "히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t2", layoutId: "FD-A", mood: "soft", purpose: "소재/핏 상세" },
      { order: 4, family: "t3", layoutId: "SI-A", mood: "clean", purpose: "사이즈/관리" },
      { order: 5, family: "t5", layoutId: "LS-A", mood: "soft", purpose: "착용 장면" },
      { order: 6, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "브랜드 신뢰" },
      { order: 7, family: "t8", layoutId: "RV-A", mood: "soft", purpose: "후기" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/환불 안내" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "fashion", variant: "b", label: "후기/착용감 중심", strategy: "실착 후기와 감성으로 전환", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-b", mood: "soft", purpose: "히어로" },
      { order: 2, family: "t5", layoutId: "LS-B", mood: "soft", purpose: "착용 장면" },
      { order: 3, family: "t1", layoutId: "KF-B", mood: "clean", purpose: "특징" },
      { order: 4, family: "t8", layoutId: "RV-A", mood: "soft", purpose: "후기" },
      { order: 5, family: "t13", layoutId: "PR-A", mood: "soft", purpose: "포토 리뷰" },
      { order: 6, family: "t10", layoutId: "ST-A", mood: "clean", purpose: "만족도" },
      { order: 7, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "신뢰" },
      { order: 8, family: "t7", layoutId: "FAQ-B", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "fashion", variant: "c", label: "비교/선택가이드", strategy: "비교와 가이드로 합리적 선택", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-c", mood: "clean", purpose: "히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "소재/핏 비교" },
      { order: 4, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "옵션 카드" },
      { order: 5, family: "t10", layoutId: "ST-B", mood: "clean", purpose: "수치" },
      { order: 6, family: "t8", layoutId: "RV-B", mood: "soft", purpose: "대표 후기" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "가격" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "fashion", variant: "d", label: "감성/브랜드 무드", strategy: "브랜드 감성과 비주얼로 공감", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-d", mood: "soft", purpose: "감성 히어로" },
      { order: 2, family: "t5", layoutId: "LS-C", mood: "soft", purpose: "멀티 이미지" },
      { order: 3, family: "t1", layoutId: "KF-C", mood: "clean", purpose: "특징 리스트" },
      { order: 4, family: "t2", layoutId: "FD-C", mood: "soft", purpose: "브랜드 스토리" },
      { order: 5, family: "t2", layoutId: "FD-B", mood: "soft", purpose: "디자인 상세" },
      { order: 6, family: "t8", layoutId: "RV-B", mood: "soft", purpose: "대표 후기" },
      { order: 7, family: "t13", layoutId: "PR-A", mood: "soft", purpose: "포토 리뷰" },
      { order: 8, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "수상" },
      { order: 9, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "의심 해소" },
      { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
    ],
  },
  {
    industry: "fashion", variant: "e", label: "가격/프로모션 중심", strategy: "가격과 구성으로 즉시 전환", isDefault: false,
    sections: [
      { order: 1, family: "hero", layoutId: "hero-e", mood: "dark", purpose: "프로모 히어로" },
      { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
      { order: 3, family: "t12", layoutId: "BN-A", mood: "clean", purpose: "구성" },
      { order: 4, family: "t15", layoutId: "PR-B", mood: "clean", purpose: "가격 비교" },
      { order: 5, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/교환" },
      { order: 6, family: "t8", layoutId: "RV-A", mood: "soft", purpose: "후기" },
      { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
      { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
      { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
    ],
  },
];

// ═══════════════════════════════════════════
// SAAS
// ═══════════════════════════════════════════
const SAAS: LandingBundle[] = [
  { industry: "saas", variant: "a", label: "기능/제품 중심", strategy: "핵심 기능과 성과 지표로 제품력 증명", isDefault: true, sections: [
    { order: 1, family: "hero", layoutId: "hero-a", mood: "clean", purpose: "제품 가치 제안" },
    { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "주요 기능 요약" },
    { order: 3, family: "t2", layoutId: "FD-A", mood: "clean", purpose: "핵심 기능 상세" },
    { order: 4, family: "t3", layoutId: "SI-A", mood: "clean", purpose: "기능 리스트" },
    { order: 5, family: "t10", layoutId: "ST-A", mood: "clean", purpose: "성과 지표" },
    { order: 6, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "경쟁 툴 비교" },
    { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "고객사 로고" },
    { order: 8, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "사용자 리뷰" },
    { order: 9, family: "t15", layoutId: "PR-B", mood: "clean", purpose: "요금제 비교" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "가입/체험" },
  ]},
  { industry: "saas", variant: "b", label: "사용성/온보딩 중심", strategy: "쉬운 시작과 UX로 도입 장벽 낮춤", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-b", mood: "clean", purpose: "히어로" },
    { order: 2, family: "t1", layoutId: "KF-B", mood: "clean", purpose: "특징" },
    { order: 3, family: "t5", layoutId: "LS-A", mood: "clean", purpose: "사용 화면" },
    { order: 4, family: "t3", layoutId: "SI-B", mood: "clean", purpose: "온보딩 단계" },
    { order: 5, family: "t2", layoutId: "FD-C", mood: "clean", purpose: "기능 흐름" },
    { order: 6, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "사용 후기" },
    { order: 7, family: "t10", layoutId: "ST-A", mood: "clean", purpose: "활성 데이터" },
    { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "도입 FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
    { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
  ]},
  { industry: "saas", variant: "c", label: "데이터/성과 중심", strategy: "ROI와 데이터로 논리적 설득", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-c", mood: "clean", purpose: "히어로" },
    { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
    { order: 3, family: "t10", layoutId: "ST-B", mood: "clean", purpose: "핵심 수치" },
    { order: 4, family: "t2", layoutId: "FD-B", mood: "clean", purpose: "데이터 기반 설명" },
    { order: 5, family: "t4", layoutId: "BA-C", mood: "clean", purpose: "도입 전후" },
    { order: 6, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "경쟁 비교" },
    { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "기업 고객" },
    { order: 8, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
    { order: 9, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "가격" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
  ]},
  { industry: "saas", variant: "d", label: "브랜드/비전 중심", strategy: "비전과 스토리로 브랜드 신뢰 구축", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-d", mood: "clean", purpose: "비전 히어로" },
    { order: 2, family: "t5", layoutId: "LS-B", mood: "clean", purpose: "브랜드 비주얼" },
    { order: 3, family: "t1", layoutId: "KF-C", mood: "clean", purpose: "특징 리스트" },
    { order: 4, family: "t2", layoutId: "FD-C", mood: "clean", purpose: "기능 설명" },
    { order: 5, family: "t2", layoutId: "FD-B", mood: "clean", purpose: "창업/비전" },
    { order: 6, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
    { order: 7, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "수상/인증" },
    { order: 8, family: "t7", layoutId: "FAQ-B", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
    { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
  ]},
  { industry: "saas", variant: "e", label: "전환/가격 중심", strategy: "요금제와 혜택으로 즉시 전환", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-e", mood: "dark", purpose: "프로모 히어로" },
    { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
    { order: 3, family: "t15", layoutId: "PR-B", mood: "clean", purpose: "요금제" },
    { order: 4, family: "t12", layoutId: "BN-A", mood: "clean", purpose: "플랜 구성" },
    { order: 5, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "보안/정책" },
    { order: 6, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
    { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
    { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
  ]},
];

// ═══════════════════════════════════════════
// EDUCATION
// ═══════════════════════════════════════════
const EDUCATION: LandingBundle[] = [
  { industry: "education", variant: "a", label: "커리큘럼/내용 중심", strategy: "강의 내용과 성과로 가치 증명", isDefault: true, sections: [
    { order: 1, family: "hero", layoutId: "hero-a", mood: "soft", purpose: "강의 소개" },
    { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "강의 특징" },
    { order: 3, family: "t2", layoutId: "FD-A", mood: "soft", purpose: "커리큘럼 상세" },
    { order: 4, family: "t3", layoutId: "SI-A", mood: "clean", purpose: "강의 구성" },
    { order: 5, family: "t10", layoutId: "ST-B", mood: "clean", purpose: "합격률/성과" },
    { order: 6, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증/강사진" },
    { order: 7, family: "t8", layoutId: "RV-A", mood: "soft", purpose: "수강 후기" },
    { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/환불 안내" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "수강 신청" },
  ]},
  { industry: "education", variant: "b", label: "후기/합격 중심", strategy: "합격 후기와 인증으로 신뢰 확보", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-b", mood: "soft", purpose: "히어로" },
    { order: 2, family: "t1", layoutId: "KF-B", mood: "clean", purpose: "특징" },
    { order: 3, family: "t8", layoutId: "RV-A", mood: "soft", purpose: "후기 카드" },
    { order: 4, family: "t13", layoutId: "PR-A", mood: "soft", purpose: "합격 인증" },
    { order: 5, family: "t10", layoutId: "ST-A", mood: "clean", purpose: "합격자 수" },
    { order: 6, family: "t5", layoutId: "LS-A", mood: "soft", purpose: "학습 장면" },
    { order: 7, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "강사 신뢰" },
    { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
  ]},
  { industry: "education", variant: "c", label: "성과/데이터 중심", strategy: "합격률과 데이터로 논리적 설득", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-c", mood: "clean", purpose: "히어로" },
    { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
    { order: 3, family: "t10", layoutId: "ST-A", mood: "clean", purpose: "핵심 수치" },
    { order: 4, family: "t2", layoutId: "FD-B", mood: "clean", purpose: "데이터 설명" },
    { order: 5, family: "t4", layoutId: "BA-C", mood: "clean", purpose: "수강 전후" },
    { order: 6, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "타 강의 비교" },
    { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
    { order: 8, family: "t8", layoutId: "RV-B", mood: "soft", purpose: "대표 후기" },
    { order: 9, family: "t7", layoutId: "FAQ-B", mood: "clean", purpose: "FAQ" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
  ]},
  { industry: "education", variant: "d", label: "동기/감성 중심", strategy: "동기 부여와 강사 감성으로 공감", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-d", mood: "soft", purpose: "감성 히어로" },
    { order: 2, family: "t5", layoutId: "LS-B", mood: "soft", purpose: "학습 비주얼" },
    { order: 3, family: "t1", layoutId: "KF-C", mood: "clean", purpose: "특징 리스트" },
    { order: 4, family: "t2", layoutId: "FD-C", mood: "soft", purpose: "강의 설명" },
    { order: 5, family: "t2", layoutId: "FD-B", mood: "soft", purpose: "강사 스토리" },
    { order: 6, family: "t8", layoutId: "RV-B", mood: "soft", purpose: "대표 후기" },
    { order: 7, family: "t13", layoutId: "PR-A", mood: "soft", purpose: "인증 포토" },
    { order: 8, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "신뢰" },
    { order: 9, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "의심 해소" },
    { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "전환" },
  ]},
  { industry: "education", variant: "e", label: "가격/패키지 중심", strategy: "가격과 패키지로 즉시 수강 유도", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-e", mood: "dark", purpose: "프로모 히어로" },
    { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
    { order: 3, family: "t12", layoutId: "BN-B", mood: "clean", purpose: "강의 패키지" },
    { order: 4, family: "t15", layoutId: "PR-B", mood: "clean", purpose: "가격표" },
    { order: 5, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "환불/정책" },
    { order: 6, family: "t8", layoutId: "RV-A", mood: "soft", purpose: "후기" },
    { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
    { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
  ]},
];

// ═══════════════════════════════════════════
// ENTERPRISE
// ═══════════════════════════════════════════
const ENTERPRISE: LandingBundle[] = [
  { industry: "enterprise", variant: "a", label: "솔루션/기능 중심", strategy: "기능과 성과로 도입 가치 증명", isDefault: true, sections: [
    { order: 1, family: "hero", layoutId: "hero-a", mood: "navy", purpose: "솔루션 소개" },
    { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "핵심 기능" },
    { order: 3, family: "t2", layoutId: "FD-A", mood: "clean", purpose: "기능 상세" },
    { order: 4, family: "t3", layoutId: "SI-A", mood: "clean", purpose: "기능 구성" },
    { order: 5, family: "t10", layoutId: "ST-A", mood: "clean", purpose: "성과 수치" },
    { order: 6, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "경쟁 비교" },
    { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "고객사 로고" },
    { order: 8, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "B2B 후기" },
    { order: 9, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "플랜/견적" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "문의/도입" },
  ]},
  { industry: "enterprise", variant: "b", label: "사례/레퍼런스 중심", strategy: "도입 사례와 고객 후기로 신뢰 확보", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-b", mood: "navy", purpose: "히어로" },
    { order: 2, family: "t1", layoutId: "KF-B", mood: "clean", purpose: "특징" },
    { order: 3, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "고객사 후기" },
    { order: 4, family: "t2", layoutId: "FD-B", mood: "clean", purpose: "케이스 스터디" },
    { order: 5, family: "t10", layoutId: "ST-B", mood: "clean", purpose: "도입 성과" },
    { order: 6, family: "t5", layoutId: "LS-A", mood: "clean", purpose: "적용 사례" },
    { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "고객사" },
    { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
    { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "문의" },
  ]},
  { industry: "enterprise", variant: "c", label: "데이터/ROI 중심", strategy: "ROI와 비교 데이터로 논리적 설득", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-c", mood: "navy", purpose: "히어로" },
    { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
    { order: 3, family: "t10", layoutId: "ST-A", mood: "clean", purpose: "ROI 수치" },
    { order: 4, family: "t4", layoutId: "BA-C", mood: "clean", purpose: "도입 전후" },
    { order: 5, family: "t2", layoutId: "FD-B", mood: "clean", purpose: "상세 설명" },
    { order: 6, family: "t11", layoutId: "CM-A", mood: "clean", purpose: "경쟁 비교" },
    { order: 7, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
    { order: 8, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
    { order: 9, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "견적" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
  ]},
  { industry: "enterprise", variant: "d", label: "브랜드/비전 중심", strategy: "기업 비전과 철학으로 파트너십 구축", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-d", mood: "navy", purpose: "비전 히어로" },
    { order: 2, family: "t5", layoutId: "LS-B", mood: "clean", purpose: "브랜드 비주얼" },
    { order: 3, family: "t1", layoutId: "KF-C", mood: "clean", purpose: "특징 리스트" },
    { order: 4, family: "t2", layoutId: "FD-C", mood: "clean", purpose: "기업 비전" },
    { order: 5, family: "t2", layoutId: "FD-A", mood: "clean", purpose: "솔루션 설명" },
    { order: 6, family: "t8", layoutId: "RV-B", mood: "clean", purpose: "대표 후기" },
    { order: 7, family: "t6", layoutId: "TR-B", mood: "clean", purpose: "파트너" },
    { order: 8, family: "t7", layoutId: "FAQ-B", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
    { order: 10, family: "t9", layoutId: "CTA-A", mood: "dark", purpose: "문의" },
  ]},
  { industry: "enterprise", variant: "e", label: "계약/전환 중심", strategy: "가격과 정책으로 즉시 도입 결정", isDefault: false, sections: [
    { order: 1, family: "hero", layoutId: "hero-e", mood: "dark", purpose: "프로모 히어로" },
    { order: 2, family: "t1", layoutId: "KF-A", mood: "clean", purpose: "특징" },
    { order: 3, family: "t15", layoutId: "PR-A", mood: "clean", purpose: "플랜/견적" },
    { order: 4, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "보안/정책" },
    { order: 5, family: "t12", layoutId: "BN-A", mood: "clean", purpose: "서비스 구성" },
    { order: 6, family: "t6", layoutId: "TR-A", mood: "clean", purpose: "인증" },
    { order: 7, family: "t8", layoutId: "RV-A", mood: "clean", purpose: "후기" },
    { order: 8, family: "t7", layoutId: "FAQ-A", mood: "clean", purpose: "FAQ" },
      { order: 9, family: "t3", layoutId: "SI-C", mood: "clean", purpose: "배송/보장 안내" },
    { order: 10, family: "t9", layoutId: "CTA-B", mood: "dark", purpose: "전환" },
  ]},
];

// ═══════════════════════════════════════════
// Registry + API
// ═══════════════════════════════════════════
const ALL_BUNDLES: Record<Industry, LandingBundle[]> = {
  beauty: BEAUTY,
  electronics: DEVICE,
  food: FOOD,
  living: LIVING,
  fashion: FASHION,
  saas: SAAS,
  education: EDUCATION,
  enterprise: ENTERPRISE,
};

/** 업종별 5개 번들 반환 */
export function getBundles(industry: Industry): LandingBundle[] {
  return ALL_BUNDLES[industry] || [];
}

/** 업종별 기본 번들 (variant a, isDefault=true) */
export function getDefaultBundle(industry: Industry): LandingBundle {
  const bundles = getBundles(industry);
  return bundles.find((b) => b.isDefault) || bundles[0];
}

/** 특정 번들 조회 */
export function getBundle(industry: Industry, variant: BundleVariant): LandingBundle | undefined {
  return getBundles(industry).find((b) => b.variant === variant);
}

/** 전체 번들 목록 */
export function getAllBundles(): LandingBundle[] {
  return Object.values(ALL_BUNDLES).flat();
}
