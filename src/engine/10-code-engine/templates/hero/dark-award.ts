// ============================================================
// Hero Template: Dark Award Premium (vie:serva 스타일)
// ChatGPT 생성 (업그레이드 버전) → 슬롯 변환
// gold gradient text, particles, glass badge, dramatic lighting
// ============================================================

export const html = `
<section class="relative min-h-screen flex items-center justify-center overflow-hidden text-center text-white">
  <div class="absolute inset-0 bg-gradient-to-b from-[#1a1410] via-[#120e0b] to-[#0d0a07]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,190,120,0.25),transparent_60%)]"></div>
  <div class="absolute inset-0 opacity-30 bg-[radial-gradient(#f5c27a33_1px,transparent_1px)] bg-[size:3px_3px]"></div>
  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-[radial-gradient(circle,rgba(255,210,140,0.8),transparent_70%)] blur-3xl"></div>

  <div class="relative max-w-3xl px-6 flex flex-col items-center gap-6">
    <p class="text-sm opacity-40 tracking-wide">{{subheadline}}</p>

    <h1 class="text-3xl md:text-5xl font-black leading-snug da-gold-text">{{headline}}</h1>

    <p class="text-xs opacity-30">{{body}}</p>

    <div class="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/20">
      <div class="w-9 h-9 bg-white text-black flex items-center justify-center font-bold rounded">N</div>
      <span class="text-sm font-semibold tracking-wide">네이버쇼핑</span>
    </div>

    {{#if bullets}}
    <div class="flex flex-col gap-10 mt-8">
      {{#each bullets}}
      <div class="flex flex-col items-center">
        <div class="text-3xl mb-2">🏆</div>
        <p class="text-xl md:text-2xl font-bold da-gold-text">{{this}}</p>
      </div>
      {{/each bullets}}
    </div>
    {{/if bullets}}

    {{#if imageUrl}}
    <div class="relative mt-16 flex flex-col items-center">
      <div class="absolute bottom-0 w-[500px] h-[160px] bg-[radial-gradient(circle,rgba(255,210,140,0.9),transparent_70%)] blur-2xl"></div>
      <img src="{{imageUrl}}" alt="{{headlineText}}" class="relative max-h-[280px] object-contain drop-shadow-2xl" loading="lazy">
    </div>
    {{/if imageUrl}}

    {{#if ctaText}}
    <a href="#cta" class="mt-6 inline-block rounded-full border border-[#d7a04c]/40 px-10 py-4 text-sm font-semibold tracking-widest uppercase da-gold-text transition hover:bg-[#d7a04c]/10">{{ctaText}}</a>
    {{/if ctaText}}
    {{#if microCopy}}<p class="text-xs opacity-30">{{microCopy}}</p>{{/if microCopy}}
  </div>
</section>
`;

export const css = `
.da-gold-text{background:linear-gradient(180deg,#ffe6b3,#d7a04c);-webkit-background-clip:text;color:transparent;}
`;

export const dependencies = {
  tailwindCdn: true,
};
