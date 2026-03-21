import { renderGlobalCtaGroup } from "../common-tokens/cta";
import type { GiftItem, PricingBenefit, PricingPlan } from "./types";

export function escapeHtml(value: string = ""): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function renderSectionHeader(params: { eyebrow?: string; headline: string; subheadline?: string }): string {
  return `
    <header class="pc__header">
      ${params.eyebrow ? `<p class="pc__eyebrow">${escapeHtml(params.eyebrow)}</p>` : ""}
      <h2 class="pc__headline">${escapeHtml(params.headline)}</h2>
      ${params.subheadline ? `<p class="pc__sub">${escapeHtml(params.subheadline)}</p>` : ""}
    </header>`;
}

export function renderDiscountBadge(discount?: string): string {
  if (!discount) return "";
  return `<span class="pc__discount">${escapeHtml(discount)} OFF</span>`;
}

export function renderPriceBlock(original?: string, sale?: string): string {
  if (!sale) return "";
  return `
    <div class="pc__price">
      ${original ? `<span class="pc__price-original">${escapeHtml(original)}</span>` : ""}
      <span class="pc__price-sale">${escapeHtml(sale)}</span>
    </div>`;
}

export function renderBenefitList(benefits: PricingBenefit[]): string {
  if (!benefits.length) return "";
  return `<ul class="pc__benefits">${benefits.map((b) => `<li class="pc__benefit">${b.icon ? `<span class="pc__benefit-icon">${escapeHtml(b.icon)}</span>` : `<span class="pc__benefit-check">✓</span>`}<span>${escapeHtml(b.text)}</span></li>`).join("")}</ul>`;
}

export function renderPlanCard(plan: PricingPlan): string {
  return `
    <article class="pc__plan${plan.recommended ? " pc__plan--rec" : ""}">
      ${plan.badge ? `<span class="pc__plan-badge">${escapeHtml(plan.badge)}</span>` : ""}
      <h3 class="pc__plan-name">${escapeHtml(plan.name)}</h3>
      <div class="pc__plan-price">
        ${plan.originalPrice ? `<span class="pc__price-original">${escapeHtml(plan.originalPrice)}</span>` : ""}
        <span class="pc__price-sale">${escapeHtml(plan.price)}</span>
        ${plan.period ? `<span class="pc__plan-period">${escapeHtml(plan.period)}</span>` : ""}
      </div>
      ${renderBenefitList(plan.benefits)}
      <a class="pc__plan-btn${plan.recommended ? " pc__plan-btn--rec" : ""}" href="#">${escapeHtml(plan.ctaText || "선택하기")}</a>
    </article>`;
}

export function renderGiftCalc(gifts: GiftItem[], original?: string, sale?: string): string {
  if (!gifts.length) return "";
  return `
    <div class="pc__calc">
      ${original ? `<div class="pc__calc-row"><span>정가</span><span>${escapeHtml(original)}</span></div>` : ""}
      ${gifts.map((g) => `<div class="pc__calc-row pc__calc-gift"><span>+ ${escapeHtml(g.name)}</span>${g.value ? `<span>+${escapeHtml(g.value)}</span>` : ""}</div>`).join("")}
      ${sale ? `<div class="pc__calc-row pc__calc-total"><span>실질가</span><span>${escapeHtml(sale)}</span></div>` : ""}
    </div>`;
}

export function renderCta(cta?: { text: string; href?: string }): string {
  if (!cta?.text) return "";
  return renderGlobalCtaGroup({ text: cta.text, href: cta.href || "#", variant: "primary" });
}

export function renderMicro(text?: string): string {
  if (!text) return "";
  return `<p class="pc__micro">${escapeHtml(text)}</p>`;
}
