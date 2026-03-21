// ============================================================
// Hero Template: Event Promo (케이뱅크 iPhone 스타일)
// ChatGPT 생성 → 슬롯 변환
// V자 하이라이트 배경, 빨간 강조, 말풍선 뱃지
// ============================================================

export const html = `
<div class="ep-container relative w-full max-w-[500px] mx-auto bg-[#f1f2f4] overflow-hidden min-h-[900px] shadow-xl">
  <div class="ep-tri-top"></div>
  <div class="ep-tri-bot"></div>

  <div class="ep-content relative z-10 flex flex-col h-full justify-between py-10">

    <div class="w-full px-8 flex flex-col items-center text-center">
      <div class="border-y border-[#a3a3a3] py-[2px] px-2 text-[#757575] font-bold text-[14px] tracking-[0.05em] mb-4 inline-block">EVENT</div>
      <p class="text-[#757575] font-medium text-[18px] tracking-[-0.03em] mb-10">{{subheadline}}</p>

      <h1 class="text-[52px] font-black tracking-[-0.05em] leading-[1.1] mb-2 text-[#4a4a4a]">
        <span class="text-[#df4f4b]">{{headline}}</span>
      </h1>

      <p class="text-[17px] text-[#757575] font-bold tracking-widest">{{microCopy}}</p>
    </div>

    {{#if imageUrl}}
    <div class="ep-phone-area relative w-full h-[380px] flex justify-center items-center my-5">
      <img src="{{imageUrl}}" alt="{{headlineText}}" class="relative z-20 max-h-[340px] object-contain drop-shadow-2xl" loading="lazy">
      {{#if bullets}}
      <div class="ep-bubble absolute top-[-15px] right-[calc(50%-120px)] z-30">
        <span class="text-[15px] font-bold tracking-tight mb-[-6px]">{{bullet.0}}</span>
      </div>
      {{/if bullets}}
    </div>
    {{/if imageUrl}}

    <div class="w-full px-8 text-center flex flex-col items-center z-10">
      <p class="text-[20px] text-[#4a4a4a] font-medium tracking-tight mb-3">{{body}}</p>
      {{#if bullets}}
      <p class="text-[#df4f4b] font-medium text-[16px] tracking-tight mb-[2px]">{{bullet.1}}</p>
      <p class="text-[#df4f4b] font-medium text-[16px] tracking-tight">{{bullet.2}}</p>
      {{/if bullets}}
    </div>

    {{#if ctaText}}
    <div class="text-center mt-6">
      <a href="#cta" class="inline-block bg-[#df4f4b] text-white font-bold text-lg py-4 px-12 rounded-full shadow-[0_0_20px_rgba(219,75,75,0.4)] hover:bg-[#c62828] transition">{{ctaText}}</a>
    </div>
    {{/if ctaText}}

  </div>
</div>
`;

export const css = `
.ep-container{position:relative;}
.ep-tri-top{position:absolute;top:0;left:0;right:0;height:50%;background:#fff;clip-path:polygon(0 0,100% 0,50% 100%);z-index:0;}
.ep-tri-bot{position:absolute;bottom:0;left:0;right:0;height:50%;background:#fff;clip-path:polygon(50% 0,100% 100%,0 100%);z-index:0;}
.ep-bubble{width:95px;height:95px;background:#df4f4b;border-radius:50%;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 15px 25px rgba(219,75,75,0.4);}
.ep-bubble::after{content:'';position:absolute;bottom:-6px;left:18px;width:0;height:0;border-left:20px solid transparent;border-right:5px solid transparent;border-top:25px solid #df4f4b;transform:rotate(35deg);}
`;

export const dependencies = { tailwindCdn: true };
