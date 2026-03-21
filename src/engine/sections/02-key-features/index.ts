import { renderKeyFeaturesSection } from "./render";
import type {
  KeyFeatureItem,
  KeyFeaturesCTA,
  KeyFeaturesSectionInput,
  KeyFeaturesSectionNormalized,
} from "./types";

function normalizeMoodClass(mood?: string): string {
  if (!mood) return "mood--clean";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeFeatureItem(
  item: KeyFeatureItem,
  index: number
): KeyFeatureItem | null {
  const title = item.title?.trim();

  if (!title) return null;

  return {
    id: item.id?.trim() || `feature-${index + 1}`,
    title,
    description: item.description?.trim() || undefined,
    icon: item.icon?.trim() || undefined,
    imageUrl: item.imageUrl?.trim() || undefined,
    badge: item.badge?.trim() || undefined,
  };
}

function normalizeFeatures(
  features: KeyFeatureItem[] | undefined,
  maxItems: number
): KeyFeatureItem[] {
  if (!features?.length) {
    return [
      {
        id: "feature-1",
        title: "핵심 기능",
        description: "주요 강점을 짧고 명확하게 전달합니다.",
      },
      {
        id: "feature-2",
        title: "사용 편의성",
        description: "사용 흐름을 빠르게 이해할 수 있도록 구성합니다.",
      },
      {
        id: "feature-3",
        title: "차별화 포인트",
        description: "경쟁 대비 강점을 한눈에 보여줍니다.",
      },
    ];
  }

  return features
    .slice(0, Math.max(1, maxItems))
    .map(normalizeFeatureItem)
    .filter((item): item is KeyFeatureItem => Boolean(item));
}

function normalizeCta(cta?: KeyFeaturesCTA): KeyFeaturesCTA | undefined {
  if (!cta?.text?.trim()) return undefined;

  return {
    text: cta.text.trim(),
    href: cta.href?.trim() || "#",
  };
}

function normalizeInput(
  input: KeyFeaturesSectionInput
): KeyFeaturesSectionNormalized {
  const maxItems = input.maxItems ?? 6;

  return {
    sectionId: input.sectionId?.trim() || "02-key-features",
    eyebrow: input.eyebrow?.trim() || undefined,
    headline: input.headline?.trim() || "핵심 기능을 확인해보세요",
    subheadline: input.subheadline?.trim() || undefined,
    features: normalizeFeatures(input.features, maxItems),
    cta: normalizeCta(input.cta),
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMoodClass(input.mood),
    layoutId: input.layoutId,
  };
}

export function renderSection(input: KeyFeaturesSectionInput): string {
  const normalized = normalizeInput(input);
  return renderKeyFeaturesSection(normalized);
}

// ── 파이프라인 호환 래퍼 (dispatcher/adapter용) ──
import type { SectionAgentInput, SectionAgentOutput } from "@/engine/sections/types";

export function runKeyFeatures(input: SectionAgentInput): SectionAgentOutput {
  return {
    sectionKey: "KEY_FEATURES",
    order: input.order,
    copy: {
      headline: input.brief?.productDNA?.coreValue || "핵심 기능",
      subheadline: input.strategyHint || "",
      body: "",
      bulletPoints: [],
      ctaText: "자세히 보기",
      microCopy: "",
    },
    layout: {
      type: "KF-A",
      structure: [],
    },
    style: {
      background: "#ffffff",
      textColor: "#111827",
      accentColor: "#4A90D9",
      fontSize: { headline: "34px", body: "14px" },
      spacing: "28px",
    },
    imagePrompt: "",
    elementWeight: { photo: 20, text: 50, graphic: 30, animation: 0 },
  };
}
