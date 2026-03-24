// ============================================================
// Layout Intelligence Engine — 규칙/상수
// 레이아웃 패턴 라이브러리(42개), 역할→카테고리 매핑
// ============================================================

import type { LayoutPattern, LayoutCategory } from './types';

/** 레이아웃 패턴 라이브러리 (~42개) */
export const PATTERNS: LayoutPattern[] = [
  // Hero (8)
  { id: 'hero_fullscreen_center', category: 'hero', name: '풀스크린 + 센터', description: '전체 화면 배경 + 중앙 정렬 카피', mobileScore: 95, bestForDecisionTypes: ['impulse', 'follower'], bestForZones: ['first_view'], minContentAmount: 1, maxContentAmount: 2 },
  { id: 'hero_left_right', category: 'hero', name: '좌카피 + 우이미지', description: '왼쪽 텍스트, 오른쪽 제품 이미지', mobileScore: 85, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['first_view'], minContentAmount: 2, maxContentAmount: 3 },
  { id: 'hero_video_bg', category: 'hero', name: '영상 배경', description: '자동 재생 영상 배경 + 오버레이 카피', mobileScore: 60, bestForDecisionTypes: ['impulse'], bestForZones: ['first_view'], minContentAmount: 1, maxContentAmount: 2 },
  { id: 'hero_gradient', category: 'hero', name: '그라디언트', description: '그라디언트 배경 + 타이포 중심', mobileScore: 90, bestForDecisionTypes: ['impulse', 'follower'], bestForZones: ['first_view'], minContentAmount: 1, maxContentAmount: 2 },
  { id: 'hero_split', category: 'hero', name: '스플릿', description: '화면 50:50 분할 (카피:비주얼)', mobileScore: 80, bestForDecisionTypes: ['analytical'], bestForZones: ['first_view'], minContentAmount: 2, maxContentAmount: 3 },
  { id: 'hero_product_center', category: 'hero', name: '제품 중심', description: '제품 이미지 크게 + 최소 카피', mobileScore: 90, bestForDecisionTypes: ['impulse', 'cautious'], bestForZones: ['first_view'], minContentAmount: 1, maxContentAmount: 2 },
  { id: 'hero_minimal_typo', category: 'hero', name: '미니멀 타이포', description: '큰 타이포그래피만으로 임팩트', mobileScore: 95, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['first_view'], minContentAmount: 1, maxContentAmount: 1 },
  { id: 'hero_card', category: 'hero', name: '카드형', description: '카드 위에 핵심 정보 집약', mobileScore: 85, bestForDecisionTypes: ['analytical'], bestForZones: ['first_view'], minContentAmount: 2, maxContentAmount: 3 },

  // Feature/Benefit (10)
  { id: 'feat_3col_grid', category: 'feature', name: '3컬럼 그리드', description: '3개 특장점 균등 배치', mobileScore: 80, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['interest', 'desire'], minContentAmount: 3, maxContentAmount: 3 },
  { id: 'feat_zigzag', category: 'feature', name: '지그재그', description: '좌우 교차 배치 (이미지+텍스트)', mobileScore: 90, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['interest', 'desire'], minContentAmount: 2, maxContentAmount: 5 },
  { id: 'feat_tab', category: 'feature', name: '탭', description: '탭으로 카테고리별 기능 전환', mobileScore: 85, bestForDecisionTypes: ['analytical'], bestForZones: ['interest', 'desire'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'feat_accordion', category: 'feature', name: '아코디언', description: '접었다 펼치는 상세 설명', mobileScore: 95, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['interest', 'desire'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'feat_card_grid', category: 'feature', name: '카드 그리드', description: '카드 형태로 기능 나열', mobileScore: 85, bestForDecisionTypes: ['impulse', 'follower'], bestForZones: ['interest'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'feat_icon_list', category: 'feature', name: '아이콘 리스트', description: '아이콘 + 한 줄 설명 세로 나열', mobileScore: 95, bestForDecisionTypes: ['impulse', 'follower'], bestForZones: ['interest'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'feat_large_img_bullets', category: 'feature', name: '대형이미지 + 불릿', description: '큰 이미지 한쪽 + 불릿 리스트', mobileScore: 80, bestForDecisionTypes: ['cautious', 'analytical'], bestForZones: ['interest', 'desire'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'feat_numbered_steps', category: 'feature', name: '번호 스텝', description: '1-2-3 단계별 프로세스', mobileScore: 90, bestForDecisionTypes: ['cautious', 'analytical'], bestForZones: ['interest'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'feat_infographic', category: 'feature', name: '인포그래픽', description: '시각적 데이터 표현', mobileScore: 70, bestForDecisionTypes: ['analytical'], bestForZones: ['desire'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'feat_comparison', category: 'feature', name: '비교표', description: '경쟁사/이전 대비 비교 테이블', mobileScore: 65, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['desire'], minContentAmount: 3, maxContentAmount: 5 },

  // Social Proof (6)
  { id: 'proof_review_carousel', category: 'social_proof', name: '리뷰 캐러셀', description: '고객 리뷰 슬라이드', mobileScore: 90, bestForDecisionTypes: ['follower', 'cautious'], bestForZones: ['desire'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'proof_testimonial_card', category: 'social_proof', name: '테스티모니얼 카드', description: '프로필 + 인용 카드', mobileScore: 85, bestForDecisionTypes: ['follower', 'cautious'], bestForZones: ['desire'], minContentAmount: 2, maxContentAmount: 4 },
  { id: 'proof_logo_bar', category: 'social_proof', name: '로고 바', description: '고객사/파트너 로고 가로 나열', mobileScore: 90, bestForDecisionTypes: ['analytical', 'follower'], bestForZones: ['interest', 'desire'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'proof_rating_text', category: 'social_proof', name: '별점 + 텍스트', description: '별점과 한 줄 리뷰 조합', mobileScore: 95, bestForDecisionTypes: ['impulse', 'follower'], bestForZones: ['desire'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'proof_sns_grid', category: 'social_proof', name: 'SNS 그리드', description: 'SNS 포스트 그리드 임베드', mobileScore: 80, bestForDecisionTypes: ['impulse', 'follower'], bestForZones: ['desire'], minContentAmount: 4, maxContentAmount: 5 },
  { id: 'proof_number_counter', category: 'social_proof', name: '숫자 카운터', description: '판매량/사용자 수 카운트업 애니메이션', mobileScore: 90, bestForDecisionTypes: ['follower', 'impulse'], bestForZones: ['interest', 'desire'], minContentAmount: 2, maxContentAmount: 4 },

  // Pricing (4)
  { id: 'price_3col_compare', category: 'pricing', name: '3컬럼 비교', description: '3개 요금제 나란히 비교', mobileScore: 70, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['desire', 'action'], minContentAmount: 3, maxContentAmount: 3 },
  { id: 'price_single_card', category: 'pricing', name: '단일 카드', description: '하나의 요금제 카드', mobileScore: 95, bestForDecisionTypes: ['impulse'], bestForZones: ['desire', 'action'], minContentAmount: 1, maxContentAmount: 2 },
  { id: 'price_toggle', category: 'pricing', name: '월간/연간 토글', description: '토글로 월간/연간 전환', mobileScore: 80, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['desire', 'action'], minContentAmount: 2, maxContentAmount: 3 },
  { id: 'price_feature_matrix', category: 'pricing', name: '기능 매트릭스', description: '기능별 체크 비교표', mobileScore: 60, bestForDecisionTypes: ['analytical'], bestForZones: ['desire'], minContentAmount: 4, maxContentAmount: 5 },

  // CTA (5)
  { id: 'cta_center', category: 'cta', name: '센터 정렬', description: '중앙 정렬 CTA 블록', mobileScore: 95, bestForDecisionTypes: ['impulse', 'follower'], bestForZones: ['action'], minContentAmount: 1, maxContentAmount: 2 },
  { id: 'cta_left_right', category: 'cta', name: '좌카피 + 우버튼', description: '왼쪽 요약 + 오른쪽 CTA 버튼', mobileScore: 85, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['action'], minContentAmount: 2, maxContentAmount: 3 },
  { id: 'cta_full_banner', category: 'cta', name: '풀폭 배너', description: '풀 너비 색상 배너 + CTA', mobileScore: 90, bestForDecisionTypes: ['impulse'], bestForZones: ['action', 'desire'], minContentAmount: 1, maxContentAmount: 2 },
  { id: 'cta_sticky_bar', category: 'cta', name: '스티키 바', description: '하단 고정 CTA 바', mobileScore: 95, bestForDecisionTypes: ['impulse', 'follower'], bestForZones: ['action'], minContentAmount: 1, maxContentAmount: 1 },
  { id: 'cta_popup', category: 'cta', name: '팝업', description: 'Exit-intent 또는 타이머 팝업', mobileScore: 70, bestForDecisionTypes: ['cautious', 'follower'], bestForZones: ['action'], minContentAmount: 1, maxContentAmount: 2 },

  // FAQ (3)
  { id: 'faq_accordion', category: 'faq', name: '아코디언', description: '질문 클릭 시 답변 펼침', mobileScore: 95, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['action'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'faq_2col', category: 'faq', name: '2컬럼 Q&A', description: '왼쪽 질문 + 오른쪽 답변', mobileScore: 75, bestForDecisionTypes: ['analytical'], bestForZones: ['action'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'faq_search', category: 'faq', name: '검색형', description: '검색 입력 + 필터링 Q&A', mobileScore: 85, bestForDecisionTypes: ['analytical'], bestForZones: ['action'], minContentAmount: 5, maxContentAmount: 5 },

  // Misc (6)
  { id: 'misc_before_after', category: 'misc', name: 'Before/After', description: '슬라이더로 전후 비교', mobileScore: 85, bestForDecisionTypes: ['impulse', 'cautious'], bestForZones: ['desire'], minContentAmount: 2, maxContentAmount: 2 },
  { id: 'misc_timeline', category: 'misc', name: '타임라인', description: '시간순 변화/과정 표시', mobileScore: 80, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['interest', 'desire'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'misc_process_flow', category: 'misc', name: '프로세스 플로우', description: '단계별 프로세스 시각화', mobileScore: 85, bestForDecisionTypes: ['analytical', 'cautious'], bestForZones: ['interest'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'misc_team', category: 'misc', name: '팀 소개', description: '팀원 프로필 카드 그리드', mobileScore: 80, bestForDecisionTypes: ['cautious', 'follower'], bestForZones: ['desire'], minContentAmount: 3, maxContentAmount: 5 },
  { id: 'misc_newsletter', category: 'misc', name: '뉴스레터', description: '이메일 구독 폼', mobileScore: 90, bestForDecisionTypes: ['analytical', 'follower'], bestForZones: ['action'], minContentAmount: 1, maxContentAmount: 2 },
  { id: 'misc_footer', category: 'misc', name: '푸터', description: '링크 + 정보 + 소셜', mobileScore: 90, bestForDecisionTypes: ['analytical', 'cautious', 'impulse', 'follower'], bestForZones: ['action'], minContentAmount: 2, maxContentAmount: 4 },
];

/** 섹션 역할 → 허용 레이아웃 카테고리 매핑 */
export const ROLE_CATEGORY_MAP: Record<string, LayoutCategory[]> = {
  HOOK: ['hero'],
  PAIN: ['feature', 'misc'],
  SOLUTION: ['feature', 'misc'],
  PROOF: ['social_proof', 'feature'],
  OBJECTION: ['faq', 'feature', 'misc'],
  URGENCY: ['cta', 'misc'],
  CTA: ['cta', 'pricing'],
};

/** Zone 경계 비율 */
export const ZONE_RATIOS = {
  /** interest Zone 종료 비율 */
  interest: 0.4,
  /** desire Zone 종료 비율 */
  desire: 0.75,
} as const;

/** 패턴 점수 계산 가중치 */
export const SCORE_WEIGHTS = {
  zone: 30,
  zoneFallback: 5,
  mobile: 25,
  decisionType: 20,
  decisionTypeFallback: 5,
  contentFit: 15,
  contentNearFit: 8,
  diversity: 10,
  diversitySameCategory: 5,
} as const;
