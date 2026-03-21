// ============================================================
// Hero Template: Dark Bold Red (다크, 빨간 볼드, 우동 스타일)
// ChatGPT 생성 (매트리스 r2) → 슬롯 변환
// ============================================================

export const html = `
<section class="dbr-hero relative min-h-screen flex flex-col items-center text-center px-6 pt-[72px] pb-0 text-white overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#2a2a2a,#111)]"></div>

  <div class="relative z-10 w-16 h-16 border-2 border-white rounded-xl flex items-center justify-center text-2xl font-black mb-6">{{bullet.0}}</div>

  <h1 class="relative z-10 text-[clamp(40px,9vw,64px)] font-black leading-none text-[#e53935] mb-3 tracking-tight">{{headline}}</h1>
  <p class="relative z-10 text-[clamp(30px,7vw,52px)] font-black leading-tight text-white mb-10">{{subheadline}}</p>

  <p class="relative z-10 text-lg leading-relaxed text-[#ddd] font-normal mb-16 max-w-[400px]">{{body}}</p>

  {{#if ctaText}}
  <a href="#cta" class="relative z-10 inline-block rounded-full bg-[#e53935] text-white px-10 py-4 text-base font-bold mb-8 hover:bg-[#c62828] transition">{{ctaText}}</a>
  {{/if ctaText}}

  {{#if imageUrl}}
  <div class="relative z-10 flex-1 w-full max-w-[600px] flex items-end">
    <img src="{{imageUrl}}" alt="{{headlineText}}" class="w-full rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] object-cover" loading="lazy">
  </div>
  {{/if imageUrl}}

  {{#if microCopy}}<p class="relative z-10 text-xs text-white/30 mt-4 pb-6">{{microCopy}}</p>{{/if microCopy}}
</section>
`;

export const css = ``;
export const dependencies = { tailwindCdn: true };
