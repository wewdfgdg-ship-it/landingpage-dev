import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { StrategyBlueprint } from '@/engine/03-conversion-strategy/types';
import type { AttentionConfig } from '@/engine/07-attention-architecture/types';
import type { LayoutPattern, LayoutCategory, SectionLayout, LayoutConfig } from './types';
export type { LayoutConfig } from './types';

// ============================================================
// Layout Intelligence Engine — 규칙 엔진 (AI 호출 없음)
// 섹션 타입 × 역할 × Zone → 최적 레이아웃 패턴 자동 선택
// ============================================================

// --- 레이아웃 패턴 라이브러리 (~42개) ---

const PATTERNS: LayoutPattern[] = [
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

// --- 역할 → 카테고리 매핑 ---

const ROLE_CATEGORY_MAP: Record<string, LayoutCategory[]> = {
  HOOK: ['hero'],
  PAIN: ['feature', 'misc'],
  SOLUTION: ['feature', 'misc'],
  PROOF: ['social_proof', 'feature'],
  OBJECTION: ['faq', 'feature', 'misc'],
  URGENCY: ['cta', 'misc'],
  CTA: ['cta', 'pricing'],
};

// --- Zone 결정 (섹션 순서 기반) ---

function getZoneForOrder(order: number, totalSections: number): string {
  const ratio = order / totalSections;
  if (order === 1) return 'first_view';
  if (ratio <= 0.4) return 'interest';
  if (ratio <= 0.75) return 'desire';
  return 'action';
}

// --- 패턴 점수 계산 ---

function scorePattern(
  pattern: LayoutPattern,
  zone: string,
  decisionType: string,
  contentAmount: number,
  usedPatterns: Set<string>,
): number {
  let score = 0;

  // Zone 적합성 (30%)
  if (pattern.bestForZones.includes(zone)) {
    score += 30;
  } else {
    score += 5; // 기본점
  }

  // 모바일 친화도 (25%)
  score += (pattern.mobileScore / 100) * 25;

  // 의사결정 유형 매칭 (20%)
  if (pattern.bestForDecisionTypes.includes(decisionType)) {
    score += 20;
  } else {
    score += 5;
  }

  // 콘텐츠 양 적합 (15%)
  if (contentAmount >= pattern.minContentAmount && contentAmount <= pattern.maxContentAmount) {
    score += 15;
  } else if (
    Math.abs(contentAmount - pattern.minContentAmount) <= 1 ||
    Math.abs(contentAmount - pattern.maxContentAmount) <= 1
  ) {
    score += 8;
  }

  // 시각적 다양성 (10%) — 이전에 사용한 패턴과 겹치면 감점
  if (usedPatterns.has(pattern.id)) {
    score += 0;
  } else if (usedPatterns.has(pattern.category)) {
    score += 5; // 같은 카테고리면 부분 감점
  } else {
    score += 10;
  }

  return Math.round(score);
}

// --- 콘텐츠 양 추정 (역할 기반) ---

function estimateContentAmount(role: string): number {
  switch (role) {
    case 'HOOK':
      return 2;
    case 'PAIN':
      return 3;
    case 'SOLUTION':
      return 4;
    case 'PROOF':
      return 4;
    case 'OBJECTION':
      return 4;
    case 'URGENCY':
      return 2;
    case 'CTA':
      return 1;
    default:
      return 3;
  }
}

// --- 메인 엔진 ---

export function runLayoutIntelligence(
  brief: ProductBrief,
  blueprint: StrategyBlueprint,
  _attention: AttentionConfig,
): LayoutConfig {
  const usedPatterns = new Set<string>();
  const sections: SectionLayout[] = [];

  for (const section of blueprint.structure) {
    const zone = getZoneForOrder(section.order, blueprint.totalSections);
    const contentAmount = estimateContentAmount(section.role);

    // 역할에 맞는 카테고리 필터
    const allowedCategories = ROLE_CATEGORY_MAP[section.role] ?? ['feature', 'misc'];
    const candidates = PATTERNS.filter((p) => allowedCategories.includes(p.category));

    // 점수 계산 + 정렬
    const scored = candidates
      .map((p) => ({
        pattern: p,
        score: scorePattern(p, zone, brief.decisionType, contentAmount, usedPatterns),
      }))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (!best) continue;

    usedPatterns.add(best.pattern.id);
    usedPatterns.add(best.pattern.category);

    sections.push({
      order: section.order,
      role: section.role,
      sectionType: section.sectionType,
      selectedPattern: best.pattern.id,
      patternName: best.pattern.name,
      score: best.score,
      reasoning: `Zone(${zone}) + ${brief.decisionType} + 콘텐츠(${contentAmount})`,
    });
  }

  // 다양성 점수: 고유 카테고리 수 / 전체 섹션 수
  const uniquePatterns = new Set(sections.map((s) => s.selectedPattern));
  const diversityScore = Math.round(
    (uniquePatterns.size / Math.max(sections.length, 1)) * 100,
  );

  // 모바일 준비도: 전체 섹션의 mobileScore 평균
  const mobileScores = sections.map((s) => {
    const pattern = PATTERNS.find((p) => p.id === s.selectedPattern);
    return pattern?.mobileScore ?? 80;
  });
  const mobileReadyScore = Math.round(
    mobileScores.reduce((a, b) => a + b, 0) / Math.max(mobileScores.length, 1),
  );

  return { sections, diversityScore, mobileReadyScore };
}
