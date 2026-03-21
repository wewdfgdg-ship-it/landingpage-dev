// ============================================================
// Section Adapter — SectionAgentOutput[] → 기존 엔진 포맷 변환
// ⑩ Code Engine, Image Generation이 기대하는 형식으로 변환
// ============================================================

import type { CopyBlock, CopyBlocks, SectionCopy } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig, SectionLayout } from '@/engine/08-layout-intelligence/types';
import type { AttentionConfig } from '@/engine/07-attention-architecture/types';
import type { SectionAgentOutput } from '@/engine/sections/types';

// ────────────────────────────────────────────────────────────
// SectionAgentOutput[] → CopyBlocks
// ────────────────────────────────────────────────────────────

export function toCopyBlocks(sections: SectionAgentOutput[]): CopyBlocks {
  const sectionCopies: SectionCopy[] = sections.map((s): SectionCopy => {
    const copyBlock: CopyBlock = {
      headline: s.copy.headline,
      subheadline: s.copy.subheadline,
      body: s.copy.body,
      bulletPoints: [...s.copy.bulletPoints],
      ctaText: s.copy.ctaText,
      microCopy: s.copy.microCopy,
      imageDirection: s.imagePrompt,
    };

    return {
      sectionOrder: s.order,
      role: mapKeyToRole(s.sectionKey),
      sectionType: s.layout.type,
      copy: copyBlock,
    };
  });

  return {
    sections: sectionCopies,
    tone: '섹션 에이전트 자동 결정',
    qualityScore: 80,
  };
}

// ────────────────────────────────────────────────────────────
// SectionAgentOutput[] → LayoutConfig
// ────────────────────────────────────────────────────────────

export function toLayoutConfig(sections: SectionAgentOutput[]): LayoutConfig {
  const sectionLayouts: SectionLayout[] = sections.map((s): SectionLayout => ({
    order: s.order,
    role: mapKeyToRole(s.sectionKey),
    sectionType: s.sectionKey.toLowerCase(),
    selectedPattern: s.layout.type,
    patternName: s.layout.type,
    score: 80,
    reasoning: '섹션 에이전트 규칙 엔진 기반 선택',
    ...(s.v4Meta ? { v4Meta: s.v4Meta } : {}),
  }));

  return {
    sections: sectionLayouts,
    diversityScore: calculateDiversity(sectionLayouts),
    mobileReadyScore: 85,
  };
}

// ────────────────────────────────────────────────────────────
// SectionAgentOutput[] → AttentionConfig (간소화)
// ────────────────────────────────────────────────────────────

export function toAttentionConfig(sections: SectionAgentOutput[]): AttentionConfig {
  const totalSections = sections.length;
  const quarter = Math.ceil(totalSections / 4);

  return {
    hookType: 'visual_hook',
    gazePattern: 'f_pattern',
    zones: [
      {
        zone: 'first_view',
        pixelRange: { start: 0, end: 900 },
        visualRatio: 60,
        textRatio: 30,
        dataRatio: 5,
        ctaRatio: 5,
        rhythm: 'high_impact',
        interactions: ['scroll_indicator'],
        restrictions: [],
      },
      {
        zone: 'interest',
        pixelRange: { start: 900, end: quarter * 600 },
        visualRatio: 40,
        textRatio: 40,
        dataRatio: 15,
        ctaRatio: 5,
        rhythm: 'steady',
        interactions: ['hover_reveal'],
        restrictions: [],
      },
      {
        zone: 'desire',
        pixelRange: { start: quarter * 600, end: quarter * 3 * 600 },
        visualRatio: 30,
        textRatio: 40,
        dataRatio: 20,
        ctaRatio: 10,
        rhythm: 'building',
        interactions: ['social_proof_ticker'],
        restrictions: [],
      },
      {
        zone: 'action',
        pixelRange: { start: quarter * 3 * 600, end: totalSections * 600 },
        visualRatio: 20,
        textRatio: 30,
        dataRatio: 10,
        ctaRatio: 40,
        rhythm: 'climax',
        interactions: ['countdown', 'sticky_cta'],
        restrictions: [],
      },
    ],
    stickyCtaEnabled: totalSections >= 6,
    exitIntentEnabled: true,
  };
}

// ────────────────────────────────────────────────────────────
// 헬퍼
// ────────────────────────────────────────────────────────────

function mapKeyToRole(sectionKey: string): string {
  const roleMap: Record<string, string> = {
    HEADER_BANNER: 'HOOK',
    KEY_FEATURES: 'SOLUTION',
    FEATURE_DETAIL_1: 'SOLUTION',
    FEATURE_DETAIL_2: 'SOLUTION',
    FEATURE_DETAIL_3: 'SOLUTION',
    SPECS: 'SOLUTION',
    HOW_TO_USE: 'SOLUTION',
    TARGET_PERSONA: 'PAIN',
    BEFORE_AFTER: 'PAIN',
    LIFESTYLE: 'SOLUTION',
    CERTIFICATION: 'PROOF',
    FAQ: 'OBJECTION',
    REVIEWS: 'PROOF',
    SHIPPING: 'OBJECTION',
    CTA: 'CTA',
    STATS_NUMBERS: 'PROOF',
    COMPETITOR_COMPARE: 'PROOF',
    BRAND_STORY: 'PROOF',
    PACKAGE_CONTENTS: 'SOLUTION',
    PHOTO_REVIEWS: 'PROOF',
    SNS_VIRAL: 'PROOF',
    BUNDLE_SET: 'URGENCY',
    LIMITED_OFFER: 'URGENCY',
    REFUND_POLICY: 'OBJECTION',
    CUSTOMER_SERVICE: 'OBJECTION',
    PRICE_TABLE: 'CTA',
  };
  return roleMap[sectionKey] ?? 'SOLUTION';
}

function calculateDiversity(layouts: SectionLayout[]): number {
  const patterns = new Set(layouts.map((l) => l.selectedPattern));
  const uniqueRatio = patterns.size / Math.max(layouts.length, 1);
  return Math.round(uniqueRatio * 100);
}
