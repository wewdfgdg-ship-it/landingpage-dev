import type { ProductBrief } from '@/engine/01-product-intelligence/types';
import type { UrgencyBrief, UrgencyType, UrgencyElement, UrgencyPlacement } from './types';
export type { UrgencyBrief } from './types';

// ============================================================
// Why Now Engine — 규칙 엔진 (AI 호출 없음)
// Product Brief의 저항/시장 데이터 기반으로 긴급성 전략 결정
// ============================================================

const HIGH_PRICE_INDUSTRIES = ['saas', 'b2b', 'finance'];
const LIFESTYLE_INDUSTRIES = ['lifestyle', 'beauty', 'education'];

function extractPriceNumber(priceRange: string): number {
  const nums = priceRange.replace(/[^0-9]/g, '');
  return nums ? parseInt(nums, 10) : 0;
}

function selectPrimaryType(
  brief: ProductBrief,
  industry: string,
  priceRange: string,
): UrgencyType {
  const price = extractPriceNumber(priceRange);

  // 문제 해결형 제품 → 상황 기반
  if (brief.customerFear.problem && brief.resistanceMap.need.level >= 3) {
    return 'situational';
  }

  // 고가 제품 또는 SaaS → 가격 앵커링
  if (price >= 100000 || HIGH_PRICE_INDUSTRIES.includes(industry)) {
    return 'price_anchor';
  }

  // 라이프스타일/뷰티/교육 → 감정 기반
  if (LIFESTYLE_INDUSTRIES.includes(industry)) {
    return 'emotional';
  }

  // 디폴트: 상황 기반
  return 'situational';
}

function selectSecondaryType(
  primary: UrgencyType,
  brief: ProductBrief,
): UrgencyType | null {
  // urgency 저항이 5면 복합 적용
  if (brief.resistanceMap.urgency.level < 5) return null;

  const fallbacks: Record<UrgencyType, UrgencyType> = {
    time_based: 'quantity_based',
    quantity_based: 'time_based',
    situational: 'emotional',
    emotional: 'situational',
    price_anchor: 'situational',
  };

  return fallbacks[primary] ?? null;
}

function generateElements(
  primaryType: UrgencyType,
  secondaryType: UrgencyType | null,
  brief: ProductBrief,
  priceRange: string,
): UrgencyElement[] {
  const elements: UrgencyElement[] = [];

  const generators: Record<UrgencyType, () => UrgencyElement> = {
    time_based: () => ({
      type: 'countdown',
      message: '특별 할인이 곧 종료됩니다',
    }),
    quantity_based: () => ({
      type: 'scarcity',
      message: '한정 수량으로 준비되었습니다',
    }),
    situational: () => ({
      type: 'loss_calculator',
      message: brief.customerFear.problem || '지금 시작하지 않으면 문제가 계속됩니다',
    }),
    emotional: () => ({
      type: 'aspiration',
      message: brief.customerDesire.real || '더 나은 변화를 시작할 수 있습니다',
    }),
    price_anchor: () => ({
      type: 'price_comparison',
      message: `${priceRange} = 일상의 작은 투자로 큰 변화`,
    }),
  };

  elements.push(generators[primaryType]());

  if (secondaryType) {
    elements.push(generators[secondaryType]());
  }

  return elements;
}

function decidePlacement(
  primaryType: UrgencyType,
  brief: ProductBrief,
): UrgencyPlacement[] {
  const placements: UrgencyPlacement[] = ['final_cta'];

  if (brief.resistanceMap.urgency.level >= 4) {
    placements.unshift('mid_page');
  }

  if (primaryType === 'time_based' || primaryType === 'quantity_based') {
    placements.push('sticky_bar');
  }

  if (primaryType === 'price_anchor') {
    placements.push('pricing');
  }

  return placements;
}

export function runWhyNow(
  brief: ProductBrief,
  industry: string,
  priceRange: string,
): UrgencyBrief {
  const primaryType = selectPrimaryType(brief, industry, priceRange);
  const secondaryType = selectSecondaryType(primaryType, brief);

  const urgencyElements = generateElements(primaryType, secondaryType, brief, priceRange);
  const ctaUrgencyLevel = Math.min(
    5,
    Math.max(1, brief.resistanceMap.urgency.level),
  );
  const placement = decidePlacement(primaryType, brief);

  return {
    primaryType,
    secondaryType,
    urgencyElements,
    ctaUrgencyLevel,
    placement,
  };
}
