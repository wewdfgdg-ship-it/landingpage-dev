// ============================================================
// Hero Template: Dark Luxury Pro (하이엔드 프리미엄)
// ChatGPT 생성 → 슬롯 변환
// gold gradient text, SVG laurel wreaths, particle system,
// sweep lighting, glass badge, reveal animations
// ============================================================

export const html = `
<svg width="0" height="0" class="absolute">
  <defs>
    <linearGradient id="goldGradLux" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff7d6" />
      <stop offset="40%" stop-color="#ffd485" />
      <stop offset="80%" stop-color="#e5a43b" />
      <stop offset="100%" stop-color="#996317" />
    </linearGradient>
  </defs>
</svg>

<section class="dlp-hero relative min-h-[120vh] flex items-center justify-center overflow-hidden text-center text-white bg-black w-full">
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2a1910_0%,#0f0a07_50%,#000000_100%)]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,212,133,0.1),transparent_50%)]"></div>
  <div class="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(255,212,133,0.15),transparent_60%)] blur-[80px] pointer-events-none"></div>
  <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#e5a43b33_1px,transparent_1px)] bg-[size:6px_6px]"></div>

  <div class="gold-particle-sm left-[10%] animate-[floatParticle_12s_infinite_linear]" style="animation-delay:0s;"></div>
  <div class="gold-particle-sm left-[30%] animate-[floatParticle_15s_infinite_linear]" style="animation-delay:3s;"></div>
  <div class="gold-particle-sm left-[60%] animate-[floatParticle_10s_infinite_linear]" style="animation-delay:5s;"></div>
  <div class="gold-particle-sm left-[85%] animate-[floatParticle_14s_infinite_linear]" style="animation-delay:1s;"></div>
  <div class="gold-particle-md left-[20%] animate-[floatParticle_9s_infinite_linear,twinkle_3s_infinite_ease-in-out]" style="animation-delay:2s;"></div>
  <div class="gold-particle-md left-[45%] animate-[floatParticle_11s_infinite_linear,twinkle_4s_infinite_ease-in-out]" style="animation-delay:8s;"></div>
  <div class="gold-particle-md left-[75%] animate-[floatParticle_8s_infinite_linear,twinkle_2s_infinite_ease-in-out]" style="animation-delay:4s;"></div>

  <div class="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] bg-[radial-gradient(ellipse,rgba(229,164,59,0.25)_0%,rgba(153,99,23,0.1)_40%,transparent_70%)] blur-[100px] pointer-events-none mix-blend-screen z-0"></div>

  <div class="relative z-10 w-full max-w-[1400px] px-4 sm:px-8 mt-16 sm:mt-24 mb-32 flex flex-col justify-between h-full">
    <div class="flex flex-col items-center gap-6 sm:gap-10">

      <div class="reveal-lux-1 flex items-center gap-4">
        <div class="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-[#e5a43b] to-transparent"></div>
        <p class="font-serif-luxury text-[13px] sm:text-[16px] text-[#ffd485] tracking-[0.2em] font-medium uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{{subheadline}}</p>
        <div class="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-[#e5a43b] to-transparent"></div>
      </div>

      <h1 class="reveal-lux-2 font-serif-luxury text-[48px] sm:text-[72px] lg:text-[100px] font-black leading-[1.05] tracking-[-0.03em] gold-text">{{headline}}</h1>

      <p class="reveal-lux-2 text-[15px] sm:text-[18px] text-white/50 tracking-widest max-w-2xl font-light mt-2 leading-relaxed">{{body}}</p>

      <div class="reveal-lux-3 glass-badge-luxury flex items-center gap-3 sm:gap-4 px-6 py-3 rounded-full mt-4">
        <div class="w-8 h-8 rounded-full bg-[#03c75a] text-white flex items-center justify-center font-bold font-sans shadow-[0_0_15px_rgba(3,199,90,0.5)]">N</div>
        <span class="text-[14px] sm:text-[16px] font-medium tracking-wide text-[#fdfdfd]">{{microCopy}}</span>
        <div class="w-1.5 h-1.5 rounded-full bg-[#e5a43b] ml-1 shadow-[0_0_8px_#e5a43b]"></div>
      </div>
    </div>

    <div class="relative w-full mt-24 sm:mt-32 flex flex-col items-center">

      <div class="reveal-lux-5 relative w-full max-w-[900px] aspect-[21/9] sm:aspect-[16/6] bg-gradient-to-b from-[#1a110a] to-[#0a0604] rounded-[40px] flex items-center justify-center group cursor-pointer shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] transition-transform duration-700 hover:scale-[1.03] z-10 overflow-hidden">
        <div class="golden-edge"></div>
        <div class="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse,rgba(229,164,59,0.3)_0%,transparent_70%)] blur-2xl transition-opacity duration-700 group-hover:opacity-100 opacity-40"></div>
        {{#if imageUrl}}
        <img src="{{imageUrl}}" alt="{{headlineText}}" class="relative z-20 max-h-[200px] object-contain drop-shadow-2xl" loading="lazy">
        {{/if imageUrl}}
        <div class="sweep-light opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-30 pointer-events-none"></div>
      </div>

      {{#if bullets}}
      <div class="reveal-lux-4 absolute top-[-60px] sm:top-[-40px] w-full max-w-[1100px] flex justify-between px-4 sm:px-0 z-20 pointer-events-none">
        <div class="flex flex-col items-center animate-[floatingGentle_6s_infinite_ease-in-out]">
          <div class="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] mb-3 flex items-center justify-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            <svg viewBox="0 0 100 100" fill="none" class="w-full h-full">
              <circle cx="50" cy="50" r="48" stroke="url(#goldGradLux)" stroke-width="0.5" stroke-opacity="0.3" fill="rgba(20,10,5,0.6)" />
              <path d="M50 15 L85 25 L80 60 C75 80 50 95 50 95 C50 95 25 80 20 60 L15 25 Z" stroke="url(#goldGradLux)" stroke-width="1.5" stroke-dasharray="2 2" fill="none"/>
              <path d="M55 85 C65 75 75 60 75 40 Q75 35 65 30 Q70 45 60 55" stroke="url(#goldGradLux)" stroke-width="2" stroke-linecap="round"/>
              <path d="M45 85 C35 75 25 60 25 40 Q25 35 35 30 Q30 45 40 55" stroke="url(#goldGradLux)" stroke-width="2" stroke-linecap="round"/>
              <path d="M50 40 L53 48 L61 48 L55 53 L57 61 L50 56 L43 61 L45 53 L39 48 L47 48 Z" fill="url(#goldGradLux)"/>
            </svg>
          </div>
          <div class="bg-black/40 backdrop-blur-md border border-[#e5a43b]/20 px-4 py-2 rounded-full">
            <p class="text-[12px] sm:text-[14px] text-white/80 font-serif-luxury tracking-widest text-center">{{bullet.0}}</p>
          </div>
        </div>

        <div class="flex flex-col items-center animate-[floatingGentle_7s_infinite_ease-in-out]" style="animation-delay:1s;">
          <div class="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] mb-3 flex items-center justify-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            <svg viewBox="0 0 100 100" fill="none" class="w-full h-full">
              <circle cx="50" cy="50" r="48" stroke="url(#goldGradLux)" stroke-width="0.5" stroke-opacity="0.3" fill="rgba(20,10,5,0.6)" />
              <path d="M20 65 L25 35 L40 50 L50 25 L60 50 L75 35 L80 65 Z" stroke="url(#goldGradLux)" stroke-width="2" stroke-linejoin="round" fill="rgba(229,164,59,0.1)"/>
              <line x1="25" y1="75" x2="75" y2="75" stroke="url(#goldGradLux)" stroke-width="3" stroke-linecap="round"/>
              <circle cx="25" cy="30" r="3" fill="url(#goldGradLux)"/>
              <circle cx="50" cy="20" r="4" fill="url(#goldGradLux)"/>
              <circle cx="75" cy="30" r="3" fill="url(#goldGradLux)"/>
            </svg>
          </div>
          <div class="bg-black/40 backdrop-blur-md border border-[#e5a43b]/20 px-4 py-2 rounded-full">
            <p class="text-[12px] sm:text-[14px] text-white/80 font-serif-luxury tracking-widest text-center">{{bullet.1}}</p>
          </div>
        </div>
      </div>
      {{/if bullets}}

    </div>
  </div>
</section>
`;

export const css = `
.font-serif-luxury{font-family:"Noto Serif KR",serif;}
.gold-text{background:linear-gradient(170deg,#fff7d6 0%,#ffd485 20%,#e5a43b 50%,#996317 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0px 4px 20px rgba(229,164,59,0.4);}
@keyframes floatParticle{0%{transform:translateY(100vh) scale(0) rotate(0deg);opacity:0;}20%{opacity:1;}60%{opacity:0.8;}100%{transform:translateY(-200px) scale(1.5) rotate(180deg);opacity:0;}}
@keyframes twinkle{0%,100%{opacity:0.2;transform:scale(0.8);}50%{opacity:1;transform:scale(1.2);box-shadow:0 0 15px #ffd485,0 0 30px #e5a43b;}}
@keyframes floatingGentle{0%,100%{transform:translateY(0);}50%{transform:translateY(-15px);}}
@keyframes sweep{0%{transform:translateX(-150%) skewX(-20deg);}100%{transform:translateX(200%) skewX(-20deg);}}
@keyframes fadeUpLuxury{0%{opacity:0;transform:translateY(50px) scale(0.98);filter:blur(4px);}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0);}}
.gold-particle-sm{position:absolute;width:3px;height:3px;border-radius:50%;background:#f5c27a;box-shadow:0 0 5px #f5c27a;bottom:-50px;pointer-events:none;}
.gold-particle-md{position:absolute;width:6px;height:6px;border-radius:50%;background:#ffe199;box-shadow:0 0 15px #ffe199;bottom:-50px;pointer-events:none;}
.glass-badge-luxury{background:linear-gradient(135deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.01) 100%);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,230,179,0.2);box-shadow:inset 0 1px 1px rgba(255,255,255,0.1),0 15px 30px rgba(0,0,0,0.5);}
.sweep-light::after{content:"";position:absolute;top:0;left:0;width:30%;height:100%;background:linear-gradient(to right,transparent,rgba(255,212,133,0.6),transparent);transform:translateX(-150%) skewX(-20deg);animation:sweep 3s cubic-bezier(0.4,0,0.2,1) infinite;mix-blend-mode:color-dodge;}
.golden-edge{position:absolute;inset:0;pointer-events:none;border:1px solid transparent;border-radius:inherit;background:linear-gradient(180deg,rgba(255,212,133,0.5) 0%,transparent 40%,transparent 60%,rgba(229,164,59,0.3) 100%) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;}
.reveal-lux-1{animation:fadeUpLuxury 1.2s cubic-bezier(0.2,0.8,0.2,1) forwards;opacity:0;animation-delay:0.1s;}
.reveal-lux-2{animation:fadeUpLuxury 1.2s cubic-bezier(0.2,0.8,0.2,1) forwards;opacity:0;animation-delay:0.3s;}
.reveal-lux-3{animation:fadeUpLuxury 1.2s cubic-bezier(0.2,0.8,0.2,1) forwards;opacity:0;animation-delay:0.5s;}
.reveal-lux-4{animation:fadeUpLuxury 1.2s cubic-bezier(0.2,0.8,0.2,1) forwards;opacity:0;animation-delay:0.7s;}
.reveal-lux-5{animation:fadeUpLuxury 1.5s cubic-bezier(0.2,0.8,0.2,1) forwards;opacity:0;animation-delay:0.9s;}
`;

export const dependencies = {
  tailwindCdn: true,
  fonts: ['Noto Serif KR'],
};
