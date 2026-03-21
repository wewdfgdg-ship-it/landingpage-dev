// ============================================================
// Hero Template: Sleek Dark Event (에어팟/빙고 스타일)
// ChatGPT 생성 (매트리스 r3) → 슬롯 변환
// ============================================================

export const html = `
<section class="se-hero relative min-h-screen flex flex-col items-center justify-center text-center bg-[#232323] px-6 py-16 text-white overflow-hidden">
  <span class="se-p absolute w-3 h-0.5 bg-[#a3e635] rotate-[-45deg] opacity-80 top-[15%] left-[20%]"></span>
  <span class="se-p absolute w-3 h-0.5 bg-[#a3e635] rotate-[-45deg] opacity-80 top-[20%] right-[15%]"></span>
  <span class="se-p absolute w-3 h-0.5 bg-[#a3e635] rotate-[-45deg] opacity-80 top-[40%] right-[10%]"></span>
  <span class="se-p absolute w-3 h-0.5 bg-[#a3e635] rotate-[-45deg] opacity-80 bottom-[30%] left-[15%]"></span>

  <div class="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/[0.03] whitespace-nowrap tracking-wider z-0 select-none">BINGO</div>

  <p class="relative z-10 text-base font-bold text-white tracking-widest mb-6">{{subheadline}}</p>
  <h1 class="relative z-10 text-[clamp(32px,7vw,48px)] font-light leading-relaxed text-white mb-10">{{headline}}</h1>

  {{#if imageUrl}}
  <div class="relative z-10 w-full max-w-[400px] h-[300px] flex items-center justify-center mb-10">
    <img src="{{imageUrl}}" alt="{{headlineText}}" class="max-h-[250px] object-contain rounded-3xl shadow-[20px_20px_40px_rgba(0,0,0,0.4)] -rotate-[15deg] animate-[se-float_6s_ease-in-out_infinite]" loading="lazy">
  </div>
  {{/if imageUrl}}

  <p class="relative z-10 text-lg leading-relaxed font-medium">{{body}}</p>

  {{#if ctaText}}
  <a href="#cta" class="relative z-10 mt-6 inline-block rounded-full bg-[#a3e635] text-black px-10 py-4 text-base font-bold hover:bg-[#84cc16] transition">{{ctaText}}</a>
  {{/if ctaText}}

  {{#if microCopy}}
  <p class="relative z-10 mt-4 text-lg font-medium">{{microCopy}}</p>
  {{/if microCopy}}
</section>
`;

export const css = `
@keyframes se-float{0%,100%{transform:rotate(-15deg) translateY(0)}50%{transform:rotate(-15deg) translateY(-15px)}}
`;
export const dependencies = { tailwindCdn: true };
