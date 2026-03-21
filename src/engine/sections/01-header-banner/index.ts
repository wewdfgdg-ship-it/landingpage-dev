// ============================================================
// Header Banner (Hero) Section Agent — v4 규칙 엔진
// v4 프롬프트 문서 기반: 15 레이아웃 × 14 무드 × 12 폰트셋 × 6 이미지 모드
// AI 호출 없이 brief 데이터 기반으로 Hero 섹션 결정
// ============================================================

import type { DecisionType } from '@/engine/01-product-intelligence/types';
import type {
  ElementWeight,
  LayoutElement,
  SectionAgentInput,
  SectionAgentOutput,
} from '@/engine/sections/types';
import type {
  LayoutId,
  ProductMode,
  HeroMood,
  FontSetId,
  IndustryCategory,
  ImageAnalyze,
} from './types';
import { BRAND_COLOR_MAP } from './types';
import { getMoodStyles } from './moods';

// ────────────────────────────────────────────────────────────
// [IMAGE-DETECT] 이미지 타입 감지 + [선택 우선순위 로직]
// ────────────────────────────────────────────────────────────

interface HeroInput {
  productName: string;
  industry: string;
  headline: string;
  subheadline: string;
  stats: string[];
  awards: string[];
  price: string;
  discount: string;
  event: string;
  badges: string[];
  ctaText: string;
  brandColor: string;
  hasProductImage: boolean;
  hasModelImage: boolean;
  headlineFront: string;
  headlineBack: string;
}

function selectLayout(input: HeroInput): LayoutId {
  const { hasModelImage, hasProductImage, discount, price, awards, stats, event, badges, headlineFront, headlineBack, headline, industry } = input;

  // 모델 이미지 있을 때 → MA~ME
  if (hasModelImage) {
    if (event && badges.length >= 2) return 'ME';
    if (headlineFront && headlineBack) return 'MC';
    if (headline.split('\n').length >= 3) return 'MB';
    return 'MA';
  }

  // 제품 이미지만 있거나 둘 다 없을 때 → A~J
  if (discount && price && event) return 'J';
  if (discount || price) return 'C';
  if (awards.some(a => a.includes('1위'))) return 'F';
  if (awards.length >= 2) return 'D';
  if (stats.length >= 4 && hasProductImage) return 'H';
  if (stats.length === 1 && /\d/.test(stats[0])) return 'I';
  if (['b2b', 'tech'].includes(resolveIndustry(industry)) && stats.length >= 3) return 'B';
  if (!stats.length && !price && !awards.length) return 'G';
  return 'A';
}

// ────────────────────────────────────────────────────────────
// [IMAGE-PLACEMENT] product.mode 결정
// ────────────────────────────────────────────────────────────

const MODE_MAP: Record<LayoutId, ProductMode> = {
  A: 'hero-flow', B: 'flow', C: 'hero-flow', D: 'hero-flow',
  E: 'background', F: 'hero-flow', G: 'hero-flow', H: 'hero-absolute',
  I: 'hero-flow', J: 'hero-flow',
  MA: 'background', MB: 'contain', MC: 'overlap', MD: 'background', ME: 'background',
};

// ────────────────────────────────────────────────────────────
// [MOOD] 무드 자동 선택
// ────────────────────────────────────────────────────────────

function selectMood(industry: string, hasModel: boolean, discount: string, event: string): HeroMood {
  const cat = resolveIndustry(industry);

  // 모델 이미지 → 업종별 모델 무드 분기
  if (hasModel) {
    if (['cosmetics', 'sports'].includes(cat)) return 'mood-model-vivid';
    if (['beauty', 'health', 'pet'].includes(cat)) return 'mood-model-soft';
    if (['medical', 'organic'].includes(cat)) return 'mood-model-clean';
    return 'mood-model-dark';
  }

  // 할인/이벤트 → mood-red
  if (discount || event) return 'mood-red';

  // 업종별 무드
  if (['b2b'].includes(cat)) return 'mood-navy';
  if (['organic'].includes(cat)) return 'mood-organic';
  if (['kids'].includes(cat)) return 'mood-playful';
  if (['cafe', 'food'].includes(cat)) return 'mood-warm';
  if (['medical'].includes(cat)) return 'mood-clean';
  if (['fashion'].includes(cat)) return 'mood-mono';
  if (['cosmetics', 'sports'].includes(cat)) return 'mood-vivid';
  if (['beauty', 'health', 'pet', 'interior'].includes(cat)) return 'mood-soft';
  if (['perfume'].includes(cat)) return 'mood-dark';
  return 'mood-dark';
}

// ────────────────────────────────────────────────────────────
// [FONT-SET] 무드별 폰트셋 매핑
// ────────────────────────────────────────────────────────────

const MOOD_FONTSET_MAP: Record<string, FontSetId> = {
  // 제품 무드 (10개) — 12 폰트셋 전량 사용
  'mood-dark':    'SET-2',   // 프리미엄: NEXON Lv1 Gothic
  'mood-vivid':   'SET-1',   // 임팩트: Kartrider ExtraBold
  'mood-clean':   'SET-3',   // 커머스: GodoB
  'mood-soft':    'SET-6',   // 소프트: NanumSquareRound
  'mood-red':     'SET-8',   // 어그로: SBAggroB (세일/이벤트 강렬)
  'mood-navy':    'SET-9',   // 클래식고딕: ChosunBg (B2B/기업)
  'mood-organic': 'SET-11',  // 감성필기: 한교안심상장체 (유기농/자연)
  'mood-warm':    'SET-4',   // 감성: Cafe24빛나는별 (카페/음식)
  'mood-mono':    'SET-12',  // 세련세리프: 서강체 (패션)
  'mood-playful': 'SET-7',   // 유쾌: Jua (키즈)
  // 모델 무드 (4개)
  'mood-model-dark':  'SET-5',   // 강렬: Callifont (모델+다크)
  'mood-model-vivid': 'SET-1',   // 임팩트: Kartrider (모델+비비드)
  'mood-model-soft':  'SET-10',  // 전통명조: 독립체 (모델+소프트)
  'mood-model-clean': 'SET-3',   // 커머스: GodoB (모델+클린)
};

// ────────────────────────────────────────────────────────────
// [IMAGE-ANALYZE] derived 모드 (레퍼런스 없을 때)
// ────────────────────────────────────────────────────────────

function deriveAnalyze(layoutId: LayoutId, mode: ProductMode, mood: HeroMood): ImageAnalyze {
  // subjectSize: 레이아웃별 적정 크기
  // F(배지 강조), J(카운트다운) → large (제품이 주인공)
  // A(센터), D(신뢰) → medium (밸런스)
  // G(미니멀), B(좌우분할) → small (여백 중심)
  // H(플로팅) → medium
  const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
    A: 'large', B: 'small', C: 'medium', D: 'medium',
    E: 'large', F: 'large', G: 'small', H: 'medium',
    I: 'small', J: 'large',
    MA: 'large', MB: 'large', MC: 'large', MD: 'large', ME: 'large',
  };

  return {
    source: 'derived',
    contentType: 'photo',
    composition: ['B'].includes(layoutId) ? 'left' : 'center',
    subjectSize: sizeMap[layoutId] ?? 'medium',
    subjectPosition: mode === 'contain' ? 'bottom'
      : mode === 'background' ? 'top' : 'middle',
    backgroundType: 'clean',
    angle: mood === 'mood-mono' || layoutId === 'G' ? 'straight' : 'tilted',
  };
}

// ────────────────────────────────────────────────────────────
// [IMAGE-GENERATION] v4 4단계 프롬프트 조합
// ────────────────────────────────────────────────────────────

// 상수: 고정 누끼 (배경 제거)
const FIXED_NUKKI = `Generate ONLY the subject. Nothing else.
No background. No environment. No floor. No surface.
No shadow. No reflection. No decoration.
No text. No letters. No words. No typography. No watermarks.
Only the subject exists in the image.`;

// 상수: 원본 유지 (레퍼런스 이미지 있을 때)
const ORIGINAL_KEEP = `Use the exact same product from the reference image.
Do not change the product design, shape, color, or texture.
Keep the product appearance 100% consistent with the reference.`;

// subject size → 프레임 비율 지시
const SIZE_DIRECTION: Record<string, string> = {
  small: 'Subject fills about 35% of the frame. Leave generous negative space around the product.',
  medium: 'Subject fills about 50% of the frame. Balanced product-to-space ratio.',
  large: 'Subject fills about 70% of the frame. Product dominates the image with strong presence.',
};

// composition → 구도 지시
const COMPOSITION_DIRECTION: Record<string, string> = {
  left: 'Product positioned on the LEFT side of the frame. Right side left open for text overlay.',
  center: 'Product centered in the frame. Symmetric composition.',
  right: 'Product positioned on the RIGHT side of the frame. Left side left open for text overlay.',
};

// angle → 촬영 각도 지시
const ANGLE_DIRECTION: Record<string, string> = {
  tilted: 'Product slightly tilted 10-15° for dynamic, energetic feel.',
  straight: 'Product shot straight-on, perfectly symmetric, formal and clean.',
};

// 최종 이미지 프롬프트 조합 (모든 analyze 결과 + mood 반영)
function buildImagePrompt(
  productName: string,
  category: string,
  brandColor: string,
  analyze?: ImageAnalyze,
  sceneDirection?: string,
): string {
  const compositionDir = COMPOSITION_DIRECTION[analyze?.composition ?? 'center'];
  const sizeDir = SIZE_DIRECTION[analyze?.subjectSize ?? 'medium'];
  const angleDir = ANGLE_DIRECTION[analyze?.angle ?? 'tilted'];

  return `Product: ${productName}
Category: ${category}
Brand color: ${brandColor}

Create a premium Korean e-commerce product photo.

[Composition]
${compositionDir}

[Subject Size]
${sizeDir}

[Camera Angle]
${angleDir}

[Scene & Mood]
${sceneDirection ?? 'Professional studio lighting, premium commercial photography.'}

${FIXED_NUKKI}

${ORIGINAL_KEEP}`;
}

// export for test scripts
export { buildImagePrompt, FIXED_NUKKI, ORIGINAL_KEEP };

// ────────────────────────────────────────────────────────────
// [COLOR] brandColor 결정
// ────────────────────────────────────────────────────────────

function resolveBrandColor(inputColor: string, industry: string): string {
  if (inputColor && inputColor.startsWith('#')) return inputColor;
  const cat = resolveIndustry(industry);
  return BRAND_COLOR_MAP[cat];
}

// ────────────────────────────────────────────────────────────
// 업종 키워드 → 카테고리
// ────────────────────────────────────────────────────────────

const INDUSTRY_KEYWORDS: Record<IndustryCategory, string[]> = {
  beauty: ['뷰티', '화장품', '스킨케어', '메이크업', '코스메틱'],
  cosmetics: ['색조', '립', '파운데이션', '아이섀도'],
  perfume: ['향수', '럭셔리', '프래그런스'],
  health: ['건강', '영양제', '건기식', '건강기능', '비타민'],
  organic: ['유기농', '비건', '친환경', '자연'],
  food: ['식품', '냉장', '음료', '간식', '음식'],
  cafe: ['카페', '베이커리', '커피', '디저트'],
  sports: ['스포츠', '헬스', '운동', '피트니스'],
  tech: ['테크', '가전', '전자', '디바이스', 'IT'],
  fashion: ['패션', '의류', '옷', '슈즈'],
  kids: ['키즈', '유아', '아동', '어린이'],
  pet: ['펫', '반려', '강아지', '고양이'],
  interior: ['인테리어', '가구', '리빙'],
  medical: ['의료', '더마', '병원', '클리닉'],
  b2b: ['B2B', 'SaaS', '기업', '솔루션'],
  default: [],
};

function resolveIndustry(industry: string): IndustryCategory {
  const norm = industry.toLowerCase();
  for (const [cat, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (cat === 'default') continue;
    if (keywords.some(kw => norm.includes(kw.toLowerCase()))) {
      return cat as IndustryCategory;
    }
  }
  return 'default';
}

// ────────────────────────────────────────────────────────────
// v4 → 기존 SectionAgentOutput 호환 변환
// ────────────────────────────────────────────────────────────

function v4ToLayoutStructure(layoutId: LayoutId): { type: string; structure: LayoutElement[] } {
  const structures: Record<string, LayoutElement[]> = {
    A: [{ element: 'text_block', position: 'center', width: '100%' }, { element: 'image', position: 'center', width: '55%' }],
    B: [{ element: 'text_block', position: 'left', width: '55%' }, { element: 'image', position: 'right', width: '45%' }],
    C: [{ element: 'badge', position: 'top', width: 'auto' }, { element: 'text_block', position: 'center', width: '100%' }, { element: 'image', position: 'center', width: '45%' }],
    D: [{ element: 'badge', position: 'top', width: '100%' }, { element: 'text_block', position: 'center', width: '100%' }, { element: 'image', position: 'center', width: '55%' }],
    E: [{ element: 'image', position: 'center', width: '100%' }, { element: 'text_block', position: 'center', width: '80%' }],
    F: [{ element: 'badge', position: 'center', width: '280px' }, { element: 'text_block', position: 'center', width: '100%' }, { element: 'image', position: 'center', width: '55%' }],
    G: [{ element: 'text_block', position: 'center', width: '100%' }, { element: 'image', position: 'center', width: '40%' }],
    H: [{ element: 'text_block', position: 'center', width: '100%' }, { element: 'image', position: 'center', width: '50%' }, { element: 'card', position: 'left', width: 'auto' }, { element: 'card', position: 'right', width: 'auto' }],
    I: [{ element: 'card', position: 'center', width: '100%' }, { element: 'text_block', position: 'center', width: '100%' }, { element: 'image', position: 'center', width: '40%' }],
    J: [{ element: 'badge', position: 'top', width: '100%' }, { element: 'text_block', position: 'center', width: '100%' }, { element: 'image', position: 'center', width: '45%' }],
    MA: [{ element: 'image', position: 'center', width: '100%' }, { element: 'text_block', position: 'bottom', width: '100%' }],
    MB: [{ element: 'text_block', position: 'top', width: '100%' }, { element: 'image', position: 'bottom', width: '80%' }],
    MC: [{ element: 'text_block', position: 'center', width: '100%' }, { element: 'image', position: 'center', width: '80%' }],
    MD: [{ element: 'image', position: 'top', width: '100%' }, { element: 'text_block', position: 'bottom', width: '100%' }],
    ME: [{ element: 'image', position: 'center', width: '100%' }, { element: 'badge', position: 'right', width: 'auto' }, { element: 'text_block', position: 'bottom', width: '100%' }],
  };
  return {
    type: `v4_layout_${layoutId}`,
    structure: structures[layoutId] ?? structures['A'],
  };
}

function moodToStyle(mood: HeroMood, brandColor: string): SectionAgentOutput['style'] {
  const isDark = mood.includes('dark') || mood.includes('red') || mood.includes('navy');
  return {
    background: isDark ? '#120e08' : '#FFFFFF',
    textColor: isDark ? '#FFFFFF' : '#1a1a1a',
    accentColor: brandColor,
    fontSize: { headline: 'clamp(42px, 7.2vw, 100px)', body: 'clamp(14px, 1.6vw, 22px)' },
    spacing: 'clamp(20px, 2.5vw, 40px)',
  };
}

// ────────────────────────────────────────────────────────────
// 헬퍼: headline/cta 생성
// ────────────────────────────────────────────────────────────

function buildHeadline(coreValue: string): string {
  const MAX = 15;
  const trimmed = coreValue.trim();
  if (trimmed.length <= MAX) return trimmed;
  const seps = [',', '.', '!', '—', '-', ':'];
  for (const sep of seps) {
    const idx = trimmed.indexOf(sep);
    if (idx > 0 && idx <= MAX) return trimmed.slice(0, idx).trim();
  }
  const truncated = trimmed.slice(0, MAX);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.slice(0, lastSpace).trim() : truncated;
}

function extractCtaText(strategyHint: string): string {
  const DEFAULT = '지금 시작하기';
  if (!strategyHint.trim()) return DEFAULT;
  const patterns = [/CTA[:\s]*[""]?([^""]+)[""]?/i, /버튼[:\s]*[""]?([^""]+)[""]?/];
  for (const p of patterns) {
    const m = strategyHint.match(p);
    if (m?.[1]) return m[1].trim();
  }
  return DEFAULT;
}

// ────────────────────────────────────────────────────────────
// 메인: Hero 섹션 에이전트 실행
// ────────────────────────────────────────────────────────────

export function runHeaderBanner(input: SectionAgentInput): SectionAgentOutput {
  const { brief, productName, industry, strategyHint, targetEmotion, order } = input;
  const { productDNA, customerDesire, decisionType } = brief;

  // v4 입력 변환
  const heroInput: HeroInput = {
    productName,
    industry,
    headline: productDNA.coreValue,
    subheadline: customerDesire.surface || '',
    stats: productDNA.usp.slice(0, 3),
    awards: [],
    price: '',
    discount: '',
    event: '',
    badges: [],
    ctaText: extractCtaText(strategyHint),
    brandColor: '',
    hasProductImage: false,
    hasModelImage: false,
    headlineFront: '',
    headlineBack: '',
  };

  // v4 파이프라인 실행
  const layoutId = selectLayout(heroInput);
  const mode = MODE_MAP[layoutId];
  const mood = selectMood(industry, heroInput.hasModelImage, heroInput.discount, heroInput.event);
  const fontSet = MOOD_FONTSET_MAP[mood] ?? 'SET-2';
  const brandColor = resolveBrandColor(heroInput.brandColor, industry);
  const analyze = deriveAnalyze(layoutId, mode, mood);

  // 카피 생성
  const headline = buildHeadline(productDNA.coreValue);
  const subheadline = customerDesire.surface
    ? `${customerDesire.surface}을 위한 새로운 선택`
    : '당신이 찾던 바로 그 제품';
  const body = `${productDNA.usp[0] ?? productDNA.coreValue}. 지금 바로 경험하세요.`;
  const bulletPoints = productDNA.usp.length > 0 ? [...productDNA.usp] : [productDNA.coreValue];
  const ctaText = heroInput.ctaText;
  const microCopy = decisionType === 'impulse' ? '가입 즉시 혜택'
    : decisionType === 'analytical' ? '상세 스펙 보기'
    : decisionType === 'cautious' ? '무료 체험 가능'
    : '100만명이 선택';

  // mood의 sceneDirection 가져오기
  const moodStyles = getMoodStyles(mood, brandColor);

  // 이미지 프롬프트 (analyze + mood sceneDirection + angle 전부 반영)
  const imagePrompt = buildImagePrompt(
    productName, industry, brandColor,
    analyze, moodStyles.sceneDirection,
  );

  // 4요소 비중 (v4 기반)
  const cat = resolveIndustry(industry);
  const WEIGHT_MAP: Record<string, ElementWeight> = {
    beauty: { photo: 80, text: 40, graphic: 30, animation: 20 },
    food: { photo: 70, text: 50, graphic: 30, animation: 20 },
    tech: { photo: 60, text: 50, graphic: 60, animation: 40 },
    b2b: { photo: 20, text: 60, graphic: 80, animation: 60 },
    default: { photo: 50, text: 50, graphic: 50, animation: 30 },
  };
  const elementWeight = WEIGHT_MAP[cat] ?? WEIGHT_MAP['default'];

  return {
    sectionKey: 'HEADER_BANNER',
    order,
    copy: { headline, subheadline, body, bulletPoints, ctaText, microCopy },
    layout: v4ToLayoutStructure(layoutId),
    style: moodToStyle(mood, brandColor),
    imagePrompt,
    elementWeight,
    v4Meta: {
      layoutId,
      mood,
      fontSet,
      brandColor,
    },
  };
}
