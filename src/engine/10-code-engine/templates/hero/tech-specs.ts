// ============================================================
// Hero Template: Tech Specs (블랙&골드, 치수 다이어그램)
// ChatGPT 생성 (매트리스 r4) → 슬롯 변환
// ============================================================

export const html = `
<section class="ts-hero relative min-h-screen flex flex-col bg-[#050505] px-6 pt-20 pb-16 text-white overflow-hidden">
  <div class="max-w-[600px] w-full mx-auto flex flex-col h-full">

    <p class="border-l-2 border-white pl-3 text-[15px] font-semibold mb-6 tracking-wider">{{subheadline}}</p>
    <h1 class="text-[clamp(36px,8vw,52px)] font-light leading-tight text-white mb-16">{{headline}}</h1>

    {{#if bullets}}
    <div class="flex-1 flex flex-col items-center justify-center relative mb-16">
      <div class="ts-dim w-[280px] h-[180px] bg-[#1a1a1a] border-2 border-[#333] rounded-xl relative flex items-center justify-center">
        <div class="absolute -top-10 left-0 w-full h-5 border-l border-r border-[#666]">
          <div class="absolute top-2.5 left-0 w-full h-px bg-[#666]"></div>
          <span class="absolute -top-3 left-1/2 -translate-x-1/2 text-lg text-[#999] font-bold px-2 bg-[#050505]">{{bullet.0}}</span>
        </div>
        <div class="absolute -right-10 top-0 h-full w-5 border-t border-b border-[#666]">
          <div class="absolute right-2.5 top-0 h-full w-px bg-[#666]"></div>
          <span class="absolute top-1/2 -right-2 -translate-y-1/2 rotate-90 text-lg text-[#999] font-bold px-2 bg-[#050505] whitespace-nowrap">{{bullet.1}}</span>
        </div>
        <span class="text-2xl font-extrabold text-[#555]">{{bullet.2}}</span>
      </div>
    </div>
    {{/if bullets}}

    <div class="text-center">
      <p class="text-2xl font-light text-[#ccc] mb-5">{{body}}</p>
      <p class="text-base text-[#888] leading-relaxed">{{microCopy}}</p>
    </div>

    {{#if ctaText}}
    <div class="text-center mt-8">
      <a href="#cta" class="inline-block border border-[#d4af37] rounded-full px-10 py-4 text-sm font-semibold tracking-widest uppercase ts-gold-text hover:bg-[#d4af37]/10 transition">{{ctaText}}</a>
    </div>
    {{/if ctaText}}

    {{#if imageUrl}}
    <div class="mt-12 flex justify-center">
      <img src="{{imageUrl}}" alt="{{headlineText}}" class="max-h-[250px] object-contain drop-shadow-2xl" loading="lazy">
    </div>
    {{/if imageUrl}}
  </div>
</section>
`;

export const css = `
.ts-gold-text{background:linear-gradient(170deg,#fff7d6 0%,#ffd485 20%,#e5a43b 50%,#996317 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
`;
export const dependencies = { tailwindCdn: true };
