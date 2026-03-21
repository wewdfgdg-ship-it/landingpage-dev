// ============================================================
// Header Banner Mood CSS Mapping — 14 moods
// getMoodStyles(mood, brandColor) → MoodStyles
// ============================================================

import type { HeroMood } from './types';

export interface MoodStyles {
  background: string;
  textColor: string;
  subColor: string;
  accentColor: string;
  ctaBackground: string;
  ctaColor: string;
  ctaRadius: string;
  noiseOpacity: string;
  ghostOpacity: string;
  overlayGradient: string;
  /** 제품 이미지 drop-shadow CSS */
  productShadow: string;
  /** 이미지 생성 프롬프트용 씬 디렉션 */
  sceneDirection: string;
  /** 텍스트 weight 체계: eyebrow/desc/micro/stat-label/cta */
  fontWeights: {
    eyebrow: number;   // 아이브로우 (상단 레이블)
    desc: number;      // 설명 텍스트
    micro: number;     // 마이크로 카피
    cta: number;       // CTA 버튼
    statLabel: number; // 스탯 라벨
  };
}

// ── helpers ──

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.min(255, Math.round(r + (255 - r) * amount));
  const lg = Math.min(255, Math.round(g + (255 - g) * amount));
  const lb = Math.min(255, Math.round(b + (255 - b) * amount));
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

function pastel(hex: string): string {
  return lighten(hex, 0.85);
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function complementary(hex: string): string {
  const r = 255 - parseInt(hex.slice(1, 3), 16);
  const g = 255 - parseInt(hex.slice(3, 5), 16);
  const b = 255 - parseInt(hex.slice(5, 7), 16);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ── default CTA radius from design-tokens ──

const DEFAULT_CTA_RADIUS = '10px';

// ── mood builders ──

type MoodBuilder = (brandColor: string) => MoodStyles;

const moodDark: MoodBuilder = (brandColor) => ({
  background: [
    `radial-gradient(ellipse at 50% 80%, ${hexToRgba(brandColor, 0.18)} 0%, transparent 60%)`,
    'linear-gradient(180deg, #1a1410 0%, #120f0a 40%, #0d0a07 100%)',
  ].join(', '),
  textColor: '#ffffff',
  subColor: 'rgba(255,255,255,0.45)',
  accentColor: brandColor,
  ctaBackground: `linear-gradient(135deg, ${lighten(brandColor, 0.3)}, ${brandColor})`,
  ctaColor: '#0d0a07',
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0.025',
  ghostOpacity: '0.025',
  overlayGradient: '',
  productShadow: `drop-shadow(0 20px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 40px ${hexToRgba(brandColor, 0.25)})`,
  sceneDirection: 'Low-key studio lighting, deep shadows, dark background, luxury premium atmosphere',
  fontWeights: { eyebrow: 300, desc: 300, micro: 300, cta: 700, statLabel: 300 },
});

const moodVivid: MoodBuilder = (brandColor) => ({
  background: brandColor,
  textColor: '#ffffff',
  subColor: 'rgba(255,255,255,0.75)',
  accentColor: brandColor,
  ctaBackground: '#ffffff',
  ctaColor: brandColor,
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: '',
  productShadow: `drop-shadow(0 16px 40px rgba(0,0,0,0.4)) drop-shadow(0 0 30px ${hexToRgba(brandColor, 0.3)})`,
  sceneDirection: 'High saturation, vibrant colors, energetic lighting, bold color contrast',
  fontWeights: { eyebrow: 700, desc: 400, micro: 400, cta: 900, statLabel: 700 },
});

const moodClean: MoodBuilder = (brandColor) => ({
  background: '#ffffff',
  textColor: '#1a1a1a',
  subColor: '#555555',
  accentColor: brandColor,
  ctaBackground: brandColor,
  ctaColor: '#ffffff',
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: '',
  productShadow: 'drop-shadow(0 8px 24px rgba(0,0,0,0.1)) drop-shadow(0 2px 8px rgba(0,0,0,0.06))',
  sceneDirection: 'Bright clinical white background, soft diffused light, minimal and clean',
  fontWeights: { eyebrow: 400, desc: 400, micro: 400, cta: 700, statLabel: 400 },
});

const moodSoft: MoodBuilder = (brandColor) => ({
  background: `linear-gradient(180deg, ${pastel(brandColor)} 0%, #ffffff 100%)`,
  textColor: '#1a1a1a',
  subColor: '#555555',
  accentColor: brandColor,
  ctaBackground: brandColor,
  ctaColor: '#ffffff',
  ctaRadius: '30px',
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: '',
  productShadow: `drop-shadow(0 12px 32px rgba(0,0,0,0.12)) drop-shadow(0 0 20px ${hexToRgba(brandColor, 0.1)})`,
  sceneDirection: 'Warm pastel tones, soft gradient background, gentle diffused light, feminine',
  fontWeights: { eyebrow: 300, desc: 300, micro: 300, cta: 700, statLabel: 300 },
});

const moodRed: MoodBuilder = () => ({
  background: [
    'radial-gradient(ellipse at 50% 80%, rgba(220,38,38,0.15) 0%, transparent 60%)',
    'linear-gradient(180deg, #1a0e08 0%, #120a06 50%, #0d0703 100%)',
  ].join(', '),
  textColor: '#ffffff',
  subColor: 'rgba(255,255,255,0.5)',
  accentColor: '#DC3C1E',
  ctaBackground: 'linear-gradient(135deg, #DC3C1E, #FF4D2A)',
  ctaColor: '#ffffff',
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0.025',
  ghostOpacity: '0.03',
  overlayGradient: '',
  productShadow: 'drop-shadow(0 16px 48px rgba(220,38,38,0.4)) drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
  sceneDirection: 'Bold red accents, high contrast, urgency feel, sale promotion atmosphere, dramatic lighting',
  fontWeights: { eyebrow: 700, desc: 400, micro: 400, cta: 900, statLabel: 700 },
});

const moodNavy: MoodBuilder = (brandColor) => ({
  background: '#0c1024',
  textColor: '#ffffff',
  subColor: 'rgba(255,255,255,0.5)',
  accentColor: brandColor,
  ctaBackground: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
  ctaColor: '#ffffff',
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0.02',
  ghostOpacity: '0.025',
  overlayGradient: '',
  productShadow: 'drop-shadow(0 16px 48px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(29,78,216,0.2))',
  sceneDirection: 'Corporate blue tone, professional studio lighting, trustworthy business atmosphere',
  fontWeights: { eyebrow: 400, desc: 300, micro: 300, cta: 700, statLabel: 400 },
});

const moodOrganic: MoodBuilder = (brandColor) => ({
  background: 'linear-gradient(180deg, #F7F4EF 0%, #EDE8E0 100%)',
  textColor: '#2A2520',
  subColor: '#6B6058',
  accentColor: brandColor,
  ctaBackground: brandColor,
  ctaColor: '#ffffff',
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0.015',
  ghostOpacity: '0',
  overlayGradient: '',
  productShadow: 'drop-shadow(0 12px 32px rgba(42,37,32,0.15)) drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
  sceneDirection: 'Natural daylight, earth tones, raw organic texture, eco-friendly atmosphere, linen/wood props',
  fontWeights: { eyebrow: 300, desc: 300, micro: 300, cta: 700, statLabel: 300 },
});

const moodWarm: MoodBuilder = (brandColor) => ({
  background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF0E0 100%)',
  textColor: '#3D1F00',
  subColor: '#7A5230',
  accentColor: brandColor,
  ctaBackground: brandColor,
  ctaColor: '#ffffff',
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: '',
  productShadow: `drop-shadow(0 12px 32px rgba(61,31,0,0.2)) drop-shadow(0 0 20px ${hexToRgba(brandColor, 0.15)})`,
  sceneDirection: 'Golden hour warmth, cozy atmosphere, warm wood/ceramic props, cafe-like ambiance',
  fontWeights: { eyebrow: 400, desc: 400, micro: 300, cta: 700, statLabel: 400 },
});

const moodMono: MoodBuilder = () => ({
  background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
  textColor: '#1a1a1a',
  subColor: '#6b6b6b',
  accentColor: '#2D2D2D',
  ctaBackground: '#2D2D2D',
  ctaColor: '#ffffff',
  ctaRadius: '0px',
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: '',
  productShadow: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))',
  sceneDirection: 'Black and white, high contrast, editorial fashion photography, sharp geometric shadows',
  fontWeights: { eyebrow: 400, desc: 300, micro: 300, cta: 900, statLabel: 400 },
});

const moodPlayful: MoodBuilder = (brandColor) => ({
  background: `linear-gradient(135deg, ${pastel(brandColor)} 0%, #E0F2FE 33%, #FCE7F3 66%, #FEF3C7 100%)`,
  textColor: '#1a1a1a',
  subColor: '#555555',
  accentColor: brandColor,
  ctaBackground: brandColor,
  ctaColor: '#ffffff',
  ctaRadius: '999px',
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: '',
  productShadow: `drop-shadow(0 12px 32px rgba(0,0,0,0.2)) drop-shadow(0 0 24px ${hexToRgba(brandColor, 0.2)})`,
  sceneDirection: 'Bright pop colors, fun angles, playful composition, toy-like quality, children-friendly',
  fontWeights: { eyebrow: 700, desc: 700, micro: 400, cta: 900, statLabel: 700 },
});

// ── model moods ──

const moodModelDark: MoodBuilder = (brandColor) => ({
  background: 'transparent',
  textColor: '#ffffff',
  subColor: 'rgba(255,255,255,0.65)',
  accentColor: brandColor,
  ctaBackground: brandColor,
  ctaColor: '#ffffff',
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.88) 65%)',
  productShadow: 'none',
  sceneDirection: 'Model with product, dark cinematic mood, dramatic rim lighting, fashion editorial',
  fontWeights: { eyebrow: 300, desc: 300, micro: 300, cta: 700, statLabel: 300 },
});

const moodModelVivid: MoodBuilder = (brandColor) => ({
  background: 'transparent',
  textColor: '#ffffff',
  subColor: 'rgba(255,255,255,0.8)',
  accentColor: brandColor,
  ctaBackground: '#ffffff',
  ctaColor: brandColor,
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: `linear-gradient(180deg, transparent 20%, ${hexToRgba(brandColor, 0.9)} 60%)`,
  productShadow: 'none',
  sceneDirection: 'Model with product, vibrant saturated colors, energetic dynamic pose, sporty/active',
  fontWeights: { eyebrow: 700, desc: 400, micro: 400, cta: 900, statLabel: 700 },
});

const moodModelSoft: MoodBuilder = (brandColor) => ({
  background: 'transparent',
  textColor: '#1a1a1a',
  subColor: '#555555',
  accentColor: darken(brandColor, 0.2),
  ctaBackground: brandColor,
  ctaColor: '#ffffff',
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: `linear-gradient(180deg, transparent 30%, ${hexToRgba(brandColor, 0.15)} 70%, ${pastel(brandColor)} 100%)`,
  productShadow: 'none',
  sceneDirection: 'Model with product, soft pastel tones, gentle natural light, beauty/wellness mood',
  fontWeights: { eyebrow: 300, desc: 300, micro: 300, cta: 700, statLabel: 300 },
});

const moodModelClean: MoodBuilder = (brandColor) => ({
  background: '#ffffff',
  textColor: '#1a1a1a',
  subColor: '#555555',
  accentColor: brandColor,
  ctaBackground: brandColor,
  ctaColor: '#ffffff',
  ctaRadius: DEFAULT_CTA_RADIUS,
  noiseOpacity: '0',
  ghostOpacity: '0',
  overlayGradient: '',
  productShadow: 'none',
  sceneDirection: 'Model with product, bright white clinical background, medical/derma professional look',
  fontWeights: { eyebrow: 400, desc: 400, micro: 400, cta: 700, statLabel: 400 },
});

// ── mood registry ──

const MOOD_MAP: Record<HeroMood, MoodBuilder> = {
  'mood-dark': moodDark,
  'mood-vivid': moodVivid,
  'mood-clean': moodClean,
  'mood-soft': moodSoft,
  'mood-red': moodRed,
  'mood-navy': moodNavy,
  'mood-organic': moodOrganic,
  'mood-warm': moodWarm,
  'mood-mono': moodMono,
  'mood-playful': moodPlayful,
  'mood-model-dark': moodModelDark,
  'mood-model-vivid': moodModelVivid,
  'mood-model-soft': moodModelSoft,
  'mood-model-clean': moodModelClean,
};

// ── public API ──

export function getMoodStyles(mood: HeroMood, brandColor: string): MoodStyles {
  const builder = MOOD_MAP[mood];
  return builder(brandColor);
}
