import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { LifestyleImage } from "./types";

export function escapeHtml(value: string = ""): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function renderImage(img: LifestyleImage, cls?: string): string {
  return `<div class="ls__img-wrap ${cls || ""}"><img class="ls__img" src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt || "")}" loading="lazy" />${img.caption ? `<span class="ls__img-caption">${escapeHtml(img.caption)}</span>` : ""}</div>`;
}

export function renderPlaceholder(): string {
  return `<div class="ls__placeholder"><span>라이프스타일 이미지</span></div>`;
}

export function renderTags(tags: string[]): string {
  if (!tags.length) return "";
  return `<div class="ls__tags">${tags.map((t) => `<span class="ls__tag">${escapeHtml(t)}</span>`).join("")}</div>`;
}

export function renderText(headline: string, sub?: string): string {
  return `<div class="ls__text"><h2 class="ls__headline">${escapeHtml(headline)}</h2>${sub ? `<p class="ls__sub">${escapeHtml(sub)}</p>` : ""}</div>`;
}

export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "ghost" });
}
