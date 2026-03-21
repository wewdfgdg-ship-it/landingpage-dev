export const html = `
<main class="relative z-10 flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-32 w-full max-w-7xl mx-auto hero-high-converting">
    
    <!-- Decorative Background Orbs for Visual Polish -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
        <div class="absolute top-[20%] left-[30%] w-[600px] h-[600px] rounded-full bg-[var(--color-primary)]/20 blur-[120px] mix-blend-screen animate-blob"></div>
        <div class="absolute top-[40%] right-[20%] w-[500px] h-[500px] rounded-full bg-[var(--color-accent,purple)]/15 blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
    </div>

    <!-- 1. Trust Badge (Social Proof) -->
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10 hc-animate-fade-in-up shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/10 transition-colors cursor-default">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-primary)]"></span>
        </span>
        <span class="text-sm font-medium text-white/80 tracking-wide">최근 24시간 동안 <span class="text-white font-bold ml-1">142명</span>이 경험했습니다</span>
    </div>

    <!-- 2. Main Title (Pain Hook + Benefit) -->
    <div class="text-center max-w-[54rem] mx-auto space-y-8 hc-animate-fade-in-up hc-animation-delay-100">
        <h1 class="text-5xl sm:text-6xl md:text-[5rem] font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-sm">
            {{headline}}
        </h1>
        
        <!-- 3. Sub Copy (Specific explanation) -->
        <p class="text-xl sm:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            {{subheadline}}
            <span class="block mt-3 text-lg sm:text-xl text-white/40">{{body}}</span>
        </p>
    </div>

    <!-- 4. Glowing CTA / Primary actions -->
    <div class="mt-14 flex flex-col sm:flex-row gap-5 items-center justify-center hc-animate-fade-in-up hc-animation-delay-200 z-20">
        <!-- Primary Button with severe glow effect -->
        <div class="relative group cursor-pointer w-full sm:w-auto">
            <div class="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent,purple)] rounded-full blur-lg opacity-60 group-hover:opacity-100 group-hover:duration-200 transition duration-1000 group-hover:blur-xl"></div>
            <a href="#cta" class="relative w-full sm:w-auto px-10 py-5 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dark,var(--color-primary))] ring-1 ring-white/20 hover:ring-white/50 rounded-full text-white font-bold text-xl shadow-2xl transform transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden">
                <span class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span class="relative">{{ctaText}}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="relative h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
        </div>
    </div>

    <!-- 5. Objection Killer (Removing Friction) -->
    {{#if microCopy}}
    <div class="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-white/40 font-medium hc-animate-fade-in-up hc-animation-delay-300">
        <div class="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
            <svg class="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{microCopy}}
        </div>
    </div>
    {{/if microCopy}}

    <!-- Visual Hero Product / UI Mockup Shell -->
    <div class="mt-24 w-full max-w-5xl relative hc-animate-float perspective-1000">
        <!-- Floating Elements for depth (Moved outside mockup for better 3D pop) -->
        <div class="absolute -left-16 top-1/4 p-5 rounded-2xl hc-glass border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl hc-animate-float-delayed hidden lg:flex items-center gap-4 z-20 group hover:-translate-y-2 transition-transform">
            <div class="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center ring-1 ring-[var(--color-primary)]/50 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <div>
                <div class="text-xs text-white/50 tracking-wider uppercase mb-1">고객 만족도</div>
                <div class="text-xl font-bold text-white leading-none">4.9<span class="text-white/40 text-sm">/5.0</span></div>
            </div>
        </div>
        
        <div class="absolute -right-12 bottom-1/4 p-5 rounded-2xl hc-glass border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl hc-animate-float hidden lg:flex items-center gap-4 z-20 group hover:-translate-y-2 transition-transform">
            <div class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center ring-1 ring-blue-500/50 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
                <div class="text-xs text-white/50 tracking-wider uppercase mb-1">즉각적 효과</div>
                <div class="text-xl font-bold text-white leading-none">확인 완료</div>
            </div>
        </div>

        <!-- Decorative shadow under mockup -->
        <div class="absolute -inset-[2px] bg-gradient-to-b from-[var(--color-primary)]/30 to-transparent rounded-3xl z-0 blur-md opacity-50"></div>
        
        <!-- Main Mockup Container with tilt effect -->
        <div class="relative w-full aspect-video rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-700 hover:rotate-x-2">
            
            <!-- Browser Header Mockup -->
            <div class="h-12 border-b border-white/5 bg-white/5 flex items-center px-6 gap-2 w-full">
                <div class="flex gap-2">
                    <div class="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                    <div class="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                    <div class="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                </div>
                <!-- URL Bar Mockup -->
                <div class="mx-auto w-1/2 h-6 bg-black/40 rounded-md border border-white/5 flex items-center justify-center">
                   <div class="w-1/3 h-1.5 rounded-full bg-white/10"></div>
                </div>
            </div>

            <!-- Mockup Content Area -->
            {{#if imageUrl}}
            <div class="w-full h-full bg-cover bg-center transform transition-transform duration-1000 hover:scale-105" style="background-image: url('{{imageUrl}}')"></div>
            {{else}}
            <!-- HIGH-END CSS ART PLACEHOLDER -->
            <div class="flex-grow w-full h-full relative bg-[#050505] overflow-hidden flex items-center justify-center">
                <!-- Abstract glowing mesh -->
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-primary)_0%,transparent_50%)] opacity-20 blur-2xl"></div>
                <!-- 3D geometric shapes -->
                <div class="relative w-64 h-64 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                    <div class="absolute w-48 h-48 border border-white/20 rounded-full border-t-[var(--color-primary)]"></div>
                    <div class="absolute w-32 h-32 border border-white/30 rounded-full border-b-[var(--color-primary)] animate-spin-slow-reverse"></div>
                </div>
                
                <!-- Central glass pill -->
                <div class="absolute z-10 px-8 py-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent,purple)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30 border border-white/20">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                    <div class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">{{headlineText}} 프로젝트</div>
                    <div class="text-white/40 text-sm">실제 이미지가 여기에 매핑됩니다</div>
                </div>
                
                <!-- Overlay Grid lines -->
                <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
            </div>
            {{/if}}
        </div>
    </div>
</main>
\`;

export const css = \`
.hero-high-converting {
    position: relative;
    overflow: visible; /* Allows glowing orbs to bleed out gracefully */
}

/* Base Body settings adjustment if needed */
.perspective-1000 {
    perspective: 1000px;
}
.rotate-x-2 {
    transform: rotateX(2deg);
}

/* Background grid effect */
.hero-high-converting::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-size: 60px 60px;
    background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
}

.hc-glass {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
}

/* Custom animations prefixed with hc- to avoid conflicts */
.hc-animate-fade-in-up {
    animation: hc-fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}
.hc-animation-delay-100 { animation-delay: 100ms; }
.hc-animation-delay-200 { animation-delay: 200ms; }
.hc-animation-delay-300 { animation-delay: 300ms; }

.hc-animate-float {
    animation: hc-float 8s ease-in-out infinite;
}
.hc-animate-float-delayed {
    animation: hc-float 8s ease-in-out infinite;
    animation-delay: 4s;
}

.animate-blob {
    animation: blob 10s infinite alternate;
}
.animation-delay-2000 {
    animation-delay: 2s;
}
.animate-spin-slow {
    animation: spin 20s linear infinite;
}
.animate-spin-slow-reverse {
    animation: spin 15s linear infinite reverse;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
}

@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(4px); }
    to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@keyframes hc-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}
`;

