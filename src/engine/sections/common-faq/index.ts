import { renderFaqSection } from "./render";
import type { FaqItem, FaqLayoutId, FaqSectionInput, FaqSectionNormalized } from "./types";

function normalizeMood(mood?: string): string {
  if (!mood) return "mood--clean";
  if (mood.startsWith("mood--")) return mood;
  if (mood.startsWith("mood-")) return mood.replace("mood-", "mood--");
  return `mood--${mood}`;
}

function normalizeInput(input: FaqSectionInput): FaqSectionNormalized {
  const max = input.maxItems ?? 10;
  const items = (input.items || []).filter((i) => i.question?.trim() && i.answer?.trim()).slice(0, max).map((i, idx) => ({
    id: i.id?.trim() || `faq-${idx + 1}`,
    question: i.question.trim(),
    answer: i.answer.trim(),
  }));
  return {
    sectionId: input.sectionId?.trim() || "12-faq",
    eyebrow: input.eyebrow?.trim() || undefined,
    headline: input.headline?.trim() || "자주 묻는 질문",
    subheadline: input.subheadline?.trim() || undefined,
    items: items.length ? items : [
      { id: "faq-1", question: "배송은 얼마나 걸리나요?", answer: "결제 후 1~2영업일 내 출고됩니다." },
      { id: "faq-2", question: "환불 가능한가요?", answer: "수령 후 30일 이내 무조건 환불 가능합니다." },
      { id: "faq-3", question: "사이즈 교환이 되나요?", answer: "동일 상품 1회 무료 교환 가능합니다." },
    ],
    cta: input.cta?.text?.trim() ? { text: input.cta.text.trim(), href: input.cta.href?.trim() || "#" } : undefined,
    brandColor: input.brandColor?.trim() || "#4A90D9",
    moodClass: normalizeMood(input.mood),
    layoutId: input.layoutId,
  };
}

export function renderSection(input: FaqSectionInput): string {
  return renderFaqSection(normalizeInput(input));
}
export { renderFaqSection };
export type { FaqSectionInput, FaqSectionNormalized, FaqLayoutId };
