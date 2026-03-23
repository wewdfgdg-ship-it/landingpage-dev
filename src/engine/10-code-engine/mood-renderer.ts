// ============================================================
// Mood Renderer — HTML 템플릿 + 플레이스홀더 치환 엔진
// 직접 만든 HTML 디자인을 그대로 유지하면서 콘텐츠만 교체
// ============================================================

import { readFileSync } from 'fs';
import { join } from 'path';

// ============================================================
// 0. 디자인 토큰 (폰트, 크기, 색상을 외부에서 주입)
// ============================================================

export interface StyleTokens {
  fontUrl: string;
  fontDisplay: string;
  fontBody: string;
  bg: string;
  surface: string;
  surfaceLight: string;
  primary: string;
  primaryLight: string;
  primaryPale: string;
  frost: string;
  frostLine: string;
  frostGlow: string;
  textPrimary: string;
  textSecondary: string;
  textBright: string;
  sizeDisplay: string;
  sizeH1: string;
  sizeH2: string;
  sizeH3: string;
  sizeBody: string;
}

// ============================================================
// 1. 데이터 타입
// ============================================================

export interface ReviewData {
  name: string;
  meta: string;
  avatar: string;
  quote: string;
  stars?: number;
}

export interface FaqData {
  question: string;
  answer: string;
}

export interface PricingTier {
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  cta: string;
}

export interface MoodTemplateData {
  brand: string;
  images: {
    hero: string;
    feat1: string;
    feat2: string;
    feat3: string;
    fullbleed: string;
    gallery1: string;
    gallery2: string;
    gallery3: string;
    product1: string;
    product2: string;
    product3: string;
    product4: string;
  };
  hero: { headline: string; subheadline: string; cta: string };
  intro: { headline: string; body: string };
  feat1: { headline: string; body: string; tag1: string; tag2: string };
  feat2: { headline: string; body: string; tag1: string; tag2: string };
  feat3: { headline: string; body: string; tag1: string; tag2: string };
  stat1: { value: string; unit: string; label: string };
  stat2: { value: string; unit: string; label: string };
  stat3: { value: string; unit: string; label: string };
  stat4: { value: string; unit: string; label: string };
  fullbleed: { headline: string; body: string };
  before1: { title: string; desc: string };
  before2: { title: string; desc: string };
  before3: { title: string; desc: string };
  after1: { title: string; desc: string };
  after2: { title: string; desc: string };
  after3: { title: string; desc: string };
  pricing: {
    headline: string;
    tier1: PricingTier;
    tier2: PricingTier;
  };
  reviews: {
    headline: string;
    items: ReviewData[];
  };
  faq: FaqData[];
  products: {
    headline: string;
    item1: { name: string; sub: string };
    item2: { name: string; sub: string };
    item3: { name: string; sub: string };
    item4: { name: string; sub: string };
  };
  process1: { title: string; desc: string };
  process2: { title: string; desc: string };
  process3: { title: string; desc: string };
  cta: { headline: string; body: string; cta: string; micro: string };
}

// ============================================================
// 2. 반복 블록 렌더러
// ============================================================

function renderReviewCards(reviews: ReviewData[], mood?: string): string {
  // Natural 템플릿은 rev-card 구조
  if (mood === 'natural') {
    return reviews.map((r, i) => `
    <div class="rev-card rv"${i > 0 ? ` data-d="${i}"` : ''}>
      <div class="rev-card__top"><img class="rev-card__avatar" src="${r.avatar}" alt=""><div><p class="rev-card__name">${r.name}</p><p class="rev-card__meta">${r.meta}</p></div></div>
      <p class="rev-card__stars">${'★'.repeat(r.stars ?? 5)}</p>
      <p class="rev-card__text">"${r.quote}"</p>
    </div>`).join('\n');
  }
  // Bold 템플릿은 다른 HTML 구조
  if (mood === 'bold') {
    return reviews.map((r, i) => `
    <div class="rev__item rv"${i > 0 ? ` data-d="${i}"` : ''}>
      <div class="rev__quote-mark">"</div>
      <p class="rev__text">"${r.quote}"</p>
      <div class="rev__who">
        <img class="rev__avatar" src="${r.avatar}" alt="">
        <span>${r.name} · ${r.meta}</span>
        <span class="rev__stars">${'★'.repeat(r.stars ?? 5)}</span>
      </div>
    </div>`).join('\n');
  }
  return reviews.map((r, i) => `
    <div class="review-card rv" data-d="${i + 1}">
      <div class="review-card__top">
        <img class="review-card__avatar" src="${r.avatar}" alt="">
        <div class="review-card__info"><p class="review-card__name">${r.name}</p><p class="review-card__meta">${r.meta}</p></div>
      </div>
      <p class="review-card__stars">${'★'.repeat(r.stars ?? 5)}</p>
      <p class="review-card__quote">"${r.quote}"</p>
    </div>`).join('\n');
}

function renderFaqItems(faqs: FaqData[], mood?: string): string {
  // Clean은 카드 그리드 (아코디언 아님)
  if (mood === 'clean') {
    return faqs.map((f, i) => `
    <div class="faq__card rv"${i > 0 ? ` data-d="${i}"` : ''}>
      <h4>${f.question}</h4>
      <p>${f.answer}</p>
    </div>`).join('\n');
  }
  // Bold/Natural은 details/summary 구조
  if (mood === 'bold' || mood === 'natural') {
    return faqs.map((f, i) => `
    <details class="faq__item rv"${i > 0 ? ` data-d="${i}"` : ''}><summary class="faq__q">${f.question}</summary><p class="faq__a">${f.answer}</p></details>`).join('\n');
  }
  return faqs.map((f, i) => `
    <div class="faq__item rv" data-d="${i + 1}">
      <h4 class="faq__q">${f.question}</h4>
      <p class="faq__a">${f.answer}</p>
    </div>`).join('\n');
}

function renderFeatureList(features: string[]): string {
  return features.map(f => `<li>${f}</li>`).join('\n        ');
}

// ============================================================
// 3. 메인 렌더러
// ============================================================

export function renderMoodTemplate(
  mood: string,
  data: MoodTemplateData,
  tokens?: StyleTokens,
): string {
  const templatePath = join(__dirname, 'mood-templates', `${mood}.html`);
  let html = readFileSync(templatePath, 'utf-8');

  // 반복 블록 먼저 처리
  html = html.replace('{{reviews.cards}}', renderReviewCards(data.reviews.items, mood));
  html = html.replace('{{reviews.headline}}', data.reviews.headline);
  html = html.replace('{{faq.items}}', renderFaqItems(data.faq, mood));
  html = html.replace('{{pricing.tier1.features}}', renderFeatureList(data.pricing.tier1.features));
  html = html.replace('{{pricing.tier2.features}}', renderFeatureList(data.pricing.tier2.features));

  // 토큰 치환 (폰트, 크기, 색상)
  if (tokens) {
    const tokenFlat = flattenObject({ token: tokens });
    for (const [key, value] of Object.entries(tokenFlat)) {
      if (typeof value === 'string') {
        html = html.replaceAll(`{{${key}}}`, value);
      }
    }
  }

  // 단순 플레이스홀더 치환 (dot notation flatten)
  const flat = flattenObject(data);
  for (const [key, value] of Object.entries(flat)) {
    if (typeof value === 'string') {
      html = html.replaceAll(`{{${key}}}`, value);
    }
  }

  return html;
}

// ============================================================
// 4. 유틸: 중첩 객체 → flat key
// ============================================================

function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result[fullKey] = value;
    } else if (typeof value === 'number') {
      result[fullKey] = String(value);
    } else if (Array.isArray(value)) {
      // 배열은 반복 블록에서 처리하므로 스킵
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
    }
  }

  return result;
}
