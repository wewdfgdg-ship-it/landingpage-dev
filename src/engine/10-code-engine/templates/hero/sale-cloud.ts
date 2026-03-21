// ============================================================
// Hero Template: Sale Cloud (스카이블루, 3D 세일, 하단 카드)
// ChatGPT 생성 (매트리스 r5) → 슬롯 변환
// ============================================================

export const html = `
<section class="sc-hero relative min-h-screen flex flex-col items-center text-center bg-gradient-to-b from-[#dbeafe] via-[#f0f9ff] to-white px-6 pt-10 pb-0 text-[#111] overflow-hidden">

  <p class="self-end text-sm text-[#555] font-semibold mb-5 relative z-10">{{microCopy}}</p>
  <p class="text-[28px] font-black text-[#16a34a] tracking-wider mb-3 relative z-10 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">{{subheadline}}</p>

  <div class="w-full max-w-[400px] px-5 py-10 bg-white/40 border border-white/80 rounded-3xl backdrop-blur-lg shadow-[0_20px_40px_rgba(0,150,50,0.1),inset_0_0_20px_rgba(255,255,255,0.8)] relative z-10 mb-10">
    <h1 class="text-[clamp(56px,14vw,80px)] font-black leading-[0.95] text-[#22c55e] tracking-tight drop-shadow-[2px_4px_6px_rgba(0,0,0,0.1)]">{{headline}}</h1>
  </div>

  {{#if imageUrl}}
  <div class="flex-1 relative w-full max-w-[500px] flex items-end justify-center z-10 mb-8">
    <div class="absolute bottom-0 w-[80%] h-10 bg-gradient-to-b from-[#bbf7d0] to-[#86efac] rounded-[50%/20px] shadow-lg"></div>
    <img src="{{imageUrl}}" alt="{{headlineText}}" class="relative z-10 max-h-[300px] object-contain mb-5 drop-shadow-xl" loading="lazy">
  </div>
  {{/if imageUrl}}

  {{#if bullets}}
  <div class="w-full grid grid-cols-3 gap-2.5 pb-8 relative z-10">
    {{#each bullets}}
    <div class="bg-white border-t-4 border-[#bbf7d0] shadow-md px-2.5 py-4 rounded-xl">
      <p class="text-lg sm:text-xl text-[#16a34a] font-black">{{this}}</p>
    </div>
    {{/each bullets}}
  </div>
  {{/if bullets}}
</section>
`;

export const css = ``;
export const dependencies = { tailwindCdn: true };
