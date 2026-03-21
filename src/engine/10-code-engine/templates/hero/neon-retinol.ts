// ============================================================
// Hero Template: Neon Retinol (다크 네온 + 3D 포디움)
// ChatGPT 생성 → 슬롯 변환
// 네온 글로우, 3D 제품 거치대, CTA 버튼, 스크롤 유도
// ============================================================

export const html = `
<section class="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-6 bg-[#111]">
  <div class="absolute top-20 left-10 w-32 h-32 bg-[#e53935] rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>
  <div class="absolute bottom-40 right-10 w-40 h-40 bg-[#ffb300] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

  <div class="flex flex-col items-center text-center z-10 w-full mt-4">
    <div class="text-[44px] mb-4 drop-shadow-lg nr-float">🧴</div>
    <h1 class="text-[72px] md:text-[80px] font-black text-[#e53935] leading-none mb-3 tracking-tighter nr-neon">{{headline}}</h1>
    <h2 class="text-[42px] md:text-[54px] font-black leading-[1.2] tracking-tight text-white">{{subheadline}}</h2>
  </div>

  {{#if imageUrl}}
  <div class="relative w-full max-w-[300px] aspect-[4/5] flex flex-col items-center justify-end my-10 z-10">
    <img src="{{imageUrl}}" alt="{{headlineText}}" class="relative z-20 max-h-[280px] object-contain drop-shadow-2xl" loading="lazy">
    <div class="w-64 h-16 bg-gradient-to-b from-gray-800 to-black rounded-[50%] border-t border-gray-600 mt-2 z-10 shadow-[0_20px_50px_rgba(0,0,0,1)] flex items-center justify-center">
      <div class="w-48 h-8 bg-gradient-to-b from-gray-900 to-black rounded-[50%] border-t border-[#ffb300] opacity-50"></div>
    </div>
  </div>
  {{/if imageUrl}}

  <div class="flex flex-col items-center text-center z-10 w-full mb-4">
    <p class="text-[15px] text-white opacity-65 leading-[1.7] mb-8 font-normal tracking-wide">{{body}}</p>

    {{#if ctaText}}
    <a href="#cta" class="bg-[#e53935] hover:bg-red-700 text-white font-bold text-lg py-4 px-12 rounded-full mb-8 transition-all duration-300 shadow-[0_0_20px_rgba(229,57,53,0.4)] hover:shadow-[0_0_30px_rgba(229,57,53,0.7)] hover:scale-105 inline-block">{{ctaText}}</a>
    {{/if ctaText}}

    {{#if microCopy}}
    <p class="text-[11px] text-white opacity-30 mb-6">{{microCopy}}</p>
    {{/if microCopy}}
  </div>
</section>
`;

export const css = `
.nr-neon{text-shadow:0 0 15px rgba(229,57,53,0.6),0 0 30px rgba(229,57,53,0.4);}
@keyframes nr-f{0%{transform:translateY(0)}50%{transform:translateY(-10px)}100%{transform:translateY(0)}}
.nr-float{animation:nr-f 4s ease-in-out infinite;}
`;

export const dependencies = { tailwindCdn: true };
