// ============================================================
// Section Agent 공통 유틸리티
// 26개 섹션 에이전트가 공유하는 헬퍼 함수
// ============================================================

import type { DecisionType } from '@/engine/01-product-intelligence/types';
import type { ElementWeight } from '@/engine/sections/types';

// ────────────────────────────────────────────────────────────
// 업종 카테고리
// ────────────────────────────────────────────────────────────

export type IndustryCategory =
  | 'beauty'
  | 'food'
  | 'electronics'
  | 'fashion'
  | 'living'
  | 'saas'
  | 'education'
  | 'enterprise'
  | 'default';

const INDUSTRY_KEYWORDS: Record<IndustryCategory, string[]> = {
  beauty:      ['뷰티', '화장품', '스킨케어', '메이크업', '코스메틱', '미용'],
  food:        ['식품', '건강식품', '음식', '음료', '건기식', '영양제', '건강기능'],
  electronics: ['전자', '가전', '디바이스', '기기', '테크', '전자기기', '충전기', '이어폰', '스피커'],
  fashion:     ['패션', '의류', '옷', '티셔츠', '바지', '원피스', '자켓', '슈즈', '가방', '액세서리'],
  living:      ['리빙', '생활용품', '가구', '인테리어', '수납', '주방', '욕실', '홈', '매트리스', '쿠션'],
  saas:        ['saas', 'SaaS', '소프트웨어', '앱', '플랫폼', '서비스형'],
  education:   ['교육', '강의', '온라인', '클래스', '학습', '코스', '과정'],
  enterprise:  ['기업', 'B2B', '솔루션', '엔터프라이즈', '비즈니스'],
  default:     [],
};

export function resolveIndustry(industry: string): IndustryCategory {
  const normalized = industry.toLowerCase();
  const categories = Object.keys(INDUSTRY_KEYWORDS) as IndustryCategory[];
  for (const cat of categories) {
    if (cat === 'default') continue;
    if (INDUSTRY_KEYWORDS[cat].some((kw) => normalized.includes(kw.toLowerCase()))) {
      return cat;
    }
  }
  return 'default';
}

// ────────────────────────────────────────────────────────────
// 업종별 4요소 비중 조회
// ────────────────────────────────────────────────────────────

export function getWeight(
  map: Record<IndustryCategory, ElementWeight>,
  industry: string,
): ElementWeight {
  const cat = resolveIndustry(industry);
  return { ...map[cat] };
}

// ────────────────────────────────────────────────────────────
// 의사결정 유형별 스타일 프리셋
// ────────────────────────────────────────────────────────────

export interface StylePreset {
  background: string;
  textColor: string;
  accentColor: string;
  fontSize: { headline: string; body: string };
  spacing: string;
}

const DECISION_STYLES: Record<DecisionType, StylePreset> = {
  impulse: {
    background: '#0F0F0F',
    textColor: '#FFFFFF',
    accentColor: '#FF4D4F',
    fontSize: { headline: '3.5rem', body: '1.125rem' },
    spacing: '2rem',
  },
  analytical: {
    background: '#FAFAFA',
    textColor: '#1A1A1A',
    accentColor: '#2563EB',
    fontSize: { headline: '3rem', body: '1rem' },
    spacing: '2.5rem',
  },
  cautious: {
    background: '#F8F6F3',
    textColor: '#333333',
    accentColor: '#059669',
    fontSize: { headline: '2.75rem', body: '1.0625rem' },
    spacing: '2.25rem',
  },
  follower: {
    background: '#FFFFFF',
    textColor: '#222222',
    accentColor: '#7C3AED',
    fontSize: { headline: '3rem', body: '1.0625rem' },
    spacing: '2rem',
  },
};

export function getStyle(decisionType: DecisionType): StylePreset {
  return { ...DECISION_STYLES[decisionType] };
}

// ────────────────────────────────────────────────────────────
// 공통 레이아웃 선택 (dominant element 기반)
// ────────────────────────────────────────────────────────────

export function dominantElement(w: ElementWeight): keyof ElementWeight {
  const entries: { key: keyof ElementWeight; value: number }[] = [
    { key: 'photo', value: w.photo },
    { key: 'text', value: w.text },
    { key: 'graphic', value: w.graphic },
    { key: 'animation', value: w.animation },
  ];
  entries.sort((a, b) => b.value - a.value);
  return entries[0].key;
}

// ────────────────────────────────────────────────────────────
// 공통 카피 헬퍼
// ────────────────────────────────────────────────────────────

export function truncate(text: string, maxLen: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;

  const separators = [',', '.', '!', '\u2014', '-', ':'];
  for (const sep of separators) {
    const idx = trimmed.indexOf(sep);
    if (idx > 0 && idx <= maxLen) return trimmed.slice(0, idx).trim();
  }

  const cut = trimmed.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > 0 ? cut.slice(0, lastSpace).trim() : cut;
}

export function buildImagePrompt(
  productName: string,
  industry: string,
  emotion: string,
  sectionDesc: string,
): string {
  const mood = emotion.trim() || '\uD504\uB9AC\uBBF8\uC5C4';
  return `${productName} \uC81C\uD488, ${industry} \uC5C5\uC885, ${mood} \uBD84\uC704\uAE30, ${sectionDesc}, \uACE0\uD574\uC0C1\uB3C4 \uB79C\uB529\uD398\uC774\uC9C0\uC6A9`;
}

export function pickCta(strategyHint: string, fallback: string): string {
  if (!strategyHint.trim()) return fallback;
  const patterns = [
    /CTA[:\s]*[\u201C\u201D"]?([^\u201C\u201D"]+)[\u201C\u201D"]?/i,
    /\uBC84\uD2BC[:\s]*[\u201C\u201D"]?([^\u201C\u201D"]+)[\u201C\u201D"]?/,
  ];
  for (const p of patterns) {
    const m = strategyHint.match(p);
    if (m?.[1]) return m[1].trim();
  }
  return fallback;
}

export function microCopyByDecision(decisionType: DecisionType): string {
  switch (decisionType) {
    case 'impulse': return '\uAC00\uC785 \uC989\uC2DC \uD61C\uD0DD';
    case 'analytical': return '\uC0C1\uC138 \uC2A4\uD399 \uBCF4\uAE30';
    case 'cautious': return '\uBB34\uB8CC \uCCB4\uD5D8 \uAC00\uB2A5';
    case 'follower': return '100\uB9CC\uBA85\uC774 \uC120\uD0DD';
    default: return '\uBB34\uB8CC \uCCB4\uD5D8';
  }
}
