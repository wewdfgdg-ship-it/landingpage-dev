// ============================================================
// Key Features Section — 프롬프트 빌더
// copyPrompt: Claude용 / imagePrompt: Gemini용
// ============================================================

import type { KeyFeaturesSectionInput } from "./types";

function joinFeatureLines(input: KeyFeaturesSectionInput): string {
  return (input.features || [])
    .slice(0, 6)
    .map((feature, index) => {
      const parts = [
        `${index + 1}. ${feature.title}`,
        feature.description ? `- ${feature.description}` : "",
        feature.badge ? `- badge: ${feature.badge}` : "",
      ].filter(Boolean);
      return parts.join(" ");
    })
    .join("\n");
}

export function buildCopyPrompt(input: KeyFeaturesSectionInput): string {
  return [
    "You are writing Korean ecommerce feature-section copy.",
    "Return concise, conversion-focused copy for a KEY_FEATURES section.",
    "Keep headline within 18 Korean characters if possible.",
    "Each feature title should be short and scannable.",
    "Each feature description should be one sentence.",
    "",
    `[section] KEY_FEATURES`,
    `[eyebrow] ${input.eyebrow || ""}`,
    `[headline] ${input.headline || ""}`,
    `[subheadline] ${input.subheadline || ""}`,
    `[cta] ${input.cta?.text || ""}`,
    "",
    "[features]",
    joinFeatureLines(input),
  ].join("\n");
}

export function buildImagePrompt(featureTitle: string, brandColor?: string): string {
  return [
    `Feature: ${featureTitle}`,
    `Brand color: ${brandColor || "#4A90D9"}`,
    "Generate ONLY the subject icon or object.",
    "Simple ecommerce graphic asset, square composition, centered subject.",
    "No text. No logo. No environment. No floor. No shadow.",
    "Clean modern product-feature visual.",
  ].join("\n");
}
