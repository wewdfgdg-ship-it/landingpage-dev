// ============================================================
// Mood Renderer — HTML 템플릿 + 플레이스홀더 치환 엔진
// 직접 만든 HTML 디자인을 그대로 유지하면서 콘텐츠만 교체
// ============================================================

import { readFileSync } from 'fs';
import { join } from 'path';

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
  cta: { headline: string; body: string; cta: string; micro: string };
}

// ============================================================
// 2. 반복 블록 렌더러
// ============================================================

function renderReviewCards(reviews: ReviewData[]): string {
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

function renderFaqItems(faqs: FaqData[]): string {
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
): string {
  const templatePath = join(__dirname, 'mood-templates', `${mood}.html`);
  let html = readFileSync(templatePath, 'utf-8');

  // 반복 블록 먼저 처리
  html = html.replace('{{reviews.cards}}', renderReviewCards(data.reviews.items));
  html = html.replace('{{reviews.headline}}', data.reviews.headline);
  html = html.replace('{{faq.items}}', renderFaqItems(data.faq));
  html = html.replace('{{pricing.tier1.features}}', renderFeatureList(data.pricing.tier1.features));
  html = html.replace('{{pricing.tier2.features}}', renderFeatureList(data.pricing.tier2.features));

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
