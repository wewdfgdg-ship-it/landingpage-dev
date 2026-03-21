// ============================================================
// Hero Template: Award Light (밝은 배경, 수상배지, 클린)
// ChatGPT 생성 (매트리스 r1) → 슬롯 변환
// ============================================================

export const html = `
<section class="al-hero relative min-h-screen flex flex-col items-center text-center bg-[#f6f6f6] px-6 pt-20 pb-0 text-[#111] overflow-hidden">
  <p class="text-lg sm:text-2xl font-bold text-[#333] mb-3">{{subheadline}}</p>
  <h1 class="text-4xl sm:text-6xl font-black leading-tight mb-10 text-[#111] tracking-tight">{{headline}}</h1>

  {{#if bullets}}
  <div class="flex gap-5 justify-center flex-wrap mb-10">
    {{#each bullets}}
    <div class="al-awd w-[110px] h-[110px] rounded-full bg-white border-2 border-[#ddd] flex flex-col items-center justify-center shadow-lg">
      <span class="text-[10px] font-extrabold text-[#555] uppercase mb-1">AWARD</span>
      <span class="text-3xl font-black text-[#111] leading-none">{{this}}</span>
    </div>
    {{/each bullets}}
  </div>
  {{/if bullets}}

  <p class="text-lg font-bold leading-relaxed text-[#444] mb-12">{{body}}</p>

  {{#if ctaText}}
  <a href="#cta" class="inline-block rounded-full bg-[#111] text-white px-10 py-4 text-base font-bold mb-8 hover:bg-[#333] transition">{{ctaText}}</a>
  {{/if ctaText}}

  {{#if imageUrl}}
  <div class="flex-1 flex items-end max-w-[500px] w-full">
    <img src="{{imageUrl}}" alt="{{headlineText}}" class="w-full rounded-t-3xl object-cover shadow-xl" loading="lazy">
  </div>
  {{/if imageUrl}}
</section>
`;

export const css = ``;
export const dependencies = { tailwindCdn: true };
