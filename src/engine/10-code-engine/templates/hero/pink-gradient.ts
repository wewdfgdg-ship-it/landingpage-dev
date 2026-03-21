// ============================================================
// Hero Template: Pink Gradient (Dr.Melaxin 스타일)
// ChatGPT 원본 HTML 100% 유지 — 텍스트만 슬롯
// ============================================================

export const html = `
<section class="hero-bg flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="sphere left-[-30px] top-[120px] h-28 w-28 sm:h-36 sm:w-36"></div>
    <div class="sphere right-[40px] top-[68px] h-20 w-20 sm:h-24 sm:w-24"></div>
    <div class="sphere left-[6%] bottom-[180px] h-24 w-24 sm:h-28 sm:w-28"></div>
    <div class="sphere right-[6%] bottom-[220px] h-16 w-16 sm:h-20 sm:w-20"></div>
    <div class="sphere right-[-24px] top-[45%] h-28 w-28 sm:h-36 sm:w-36"></div>

    <div class="relative z-10 mx-auto w-full max-w-5xl text-center">
      <p class="text-[14px] font-medium tracking-[-0.02em] text-slate-600 sm:text-[16px]">
        {{subheadline}}
      </p>

      <h1 class="mt-4 text-[34px] font-black leading-[1.18] tracking-[-0.04em] text-slate-900 sm:text-[42px] lg:text-[56px]">
        {{headline}}
      </h1>

      <p class="mt-4 text-[15px] font-medium tracking-[-0.025em] text-slate-700 sm:text-[17px]">
        {{body}}
      </p>

      <p class="mt-3 text-[16px] font-bold tracking-[-0.025em] text-fuchsia-700 sm:text-[18px]">
        {{microCopy}}
      </p>

      <div class="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-12">
        <div class="glass-circle mx-auto flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full px-4 text-center sm:h-[170px] sm:w-[170px]">
          <span class="text-[28px] leading-none">✓</span>
          <p class="mt-3 text-[20px] font-bold leading-snug tracking-[-0.03em] text-rose-900">{{bullet.0}}</p>
        </div>
        <div class="glass-circle mx-auto flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full px-4 text-center sm:h-[170px] sm:w-[170px]">
          <span class="text-[28px] leading-none">✓</span>
          <p class="mt-3 text-[20px] font-bold leading-snug tracking-[-0.03em] text-rose-900">{{bullet.1}}</p>
        </div>
        <div class="glass-circle mx-auto flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full px-4 text-center sm:h-[170px] sm:w-[170px]">
          <span class="text-[28px] leading-none">✓</span>
          <p class="mt-3 text-[20px] font-bold leading-snug tracking-[-0.03em] text-rose-900">{{bullet.2}}</p>
        </div>
      </div>

      <div class="product-stage mt-10 sm:mt-12">
        {{#if imageUrl}}
        <img src="{{imageUrl}}" alt="{{headlineText}}" class="relative z-20 mx-auto max-h-[320px] object-contain drop-shadow-2xl" loading="lazy">
        {{/if imageUrl}}
      </div>

      <div class="footer-bar mx-auto mt-8 grid max-w-4xl grid-cols-1 overflow-hidden rounded-[28px] border border-white/40 sm:grid-cols-3">
        <div class="px-6 py-7 sm:px-5">
          <p class="text-[15px] font-medium leading-relaxed tracking-[-0.03em] text-slate-700 sm:text-[16px]">
            {{bullet.0}}
          </p>
        </div>
        <div class="border-t border-white/35 px-6 py-7 sm:border-l sm:border-t-0 sm:px-5">
          <p class="text-[15px] font-medium leading-relaxed tracking-[-0.03em] text-slate-700 sm:text-[16px]">
            {{bullet.1}}
          </p>
        </div>
        <div class="border-t border-white/35 px-6 py-7 sm:border-l sm:border-t-0 sm:px-5">
          <p class="text-[15px] font-medium leading-relaxed tracking-[-0.03em] text-slate-700 sm:text-[16px]">
            {{bullet.2}}
          </p>
        </div>
      </div>
    </div>
  </section>
`;

export const css = `
    .hero-bg {
      position: relative;
      overflow: hidden;
      min-height: 100vh;
      background:
        radial-gradient(circle at 50% 18%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.42) 22%, rgba(255,255,255,0) 52%),
        linear-gradient(180deg, #fdeef4 0%, #f6d8e5 48%, #efc3d8 100%);
    }

    .hero-bg::before,
    .hero-bg::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .hero-bg::before {
      background-image:
        radial-gradient(circle at 12% 18%, rgba(255,255,255,0.75) 0 1px, transparent 2px),
        radial-gradient(circle at 78% 15%, rgba(255,255,255,0.65) 0 1px, transparent 2px),
        radial-gradient(circle at 24% 58%, rgba(255,255,255,0.55) 0 1px, transparent 2px),
        radial-gradient(circle at 88% 62%, rgba(255,255,255,0.55) 0 1px, transparent 2px),
        radial-gradient(circle at 38% 34%, rgba(255,255,255,0.55) 0 1px, transparent 2px),
        radial-gradient(circle at 60% 42%, rgba(255,255,255,0.45) 0 1px, transparent 2px);
      background-size: 260px 260px, 300px 300px, 320px 320px, 360px 360px, 280px 280px, 340px 340px;
      opacity: 0.7;
      filter: blur(0.2px);
    }

    .hero-bg::after {
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.28), transparent 58%);
      mix-blend-mode: screen;
    }

    .sphere {
      position: absolute;
      border-radius: 9999px;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,214,230,0.8) 38%, rgba(241,169,198,0.52) 72%, rgba(241,169,198,0.18) 100%);
      box-shadow:
        inset -12px -18px 28px rgba(222, 118, 162, 0.15),
        inset 10px 10px 20px rgba(255,255,255,0.55),
        0 10px 35px rgba(214, 124, 158, 0.14);
      opacity: 0.72;
      filter: blur(0.15px);
    }

    .glass-circle {
      background: linear-gradient(180deg, rgba(255,255,255,0.36), rgba(255,255,255,0.18));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 2px dashed rgba(226, 153, 183, 0.68);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.75),
        0 12px 30px rgba(216, 133, 168, 0.12);
    }

    .product-stage {
      position: relative;
      width: min(520px, 90vw);
      height: 360px;
      margin: 0 auto;
    }

    .product-stage::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 26px;
      width: 74%;
      height: 42px;
      transform: translateX(-50%);
      background: radial-gradient(ellipse at center, rgba(170, 99, 132, 0.24), rgba(170, 99, 132, 0.06) 58%, transparent 74%);
      filter: blur(9px);
    }

    .footer-bar {
      background: linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0.25));
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.78),
        0 18px 45px rgba(203, 125, 162, 0.1);
    }
`;

export const dependencies = { tailwindCdn: true };
