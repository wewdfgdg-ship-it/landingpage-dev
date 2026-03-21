export const html = `
<section class="relative z-10 py-24 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto feat-high-converting">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-20 hc-animate-fade-in-up">
        <h2 class="text-sm font-bold tracking-widest text-[var(--color-primary)] uppercase mb-3">{{subheadline}}</h2>
        <h3 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">{{headline}}</h3>
        <p class="text-lg text-gray-400 leading-relaxed font-light">{{body}}</p>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10 pb-8">
        {{#each bullets}}
        <div class="group relative hc-glass p-8 rounded-3xl border border-white/5 hover:border-[var(--color-primary)]/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden hover:shadow-2xl hover:shadow-[var(--color-primary)]/20 hc-animate-fade-in-up">
            <!-- Glow effect behind card -->
            <div class="absolute -inset-0.5 bg-gradient-to-b from-[var(--color-primary)]/0 to-[var(--color-primary)]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
            
            <div class="relative z-10">
                <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <!-- Splitting Title and Description if bullet contains a colon -->
                <!-- We will rely on text length or just show it bold -->
                <h4 class="text-xl font-bold mb-3 text-white leading-snug">{{this}}</h4>
                <div class="w-12 h-1 bg-[var(--color-primary)]/30 rounded-full mb-4 group-hover:w-full group-hover:bg-[var(--color-primary)] transition-all duration-500"></div>
            </div>
            
            <!-- Graphic Element at bottom of card -->
            <div class="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <span class="text-xs font-semibold text-[var(--color-primary-light)] uppercase tracking-wider">Discover More</span>
                <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                    <svg class="w-4 h-4 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </div>
        </div>
        {{/each bullets}}
    </div>
    
    <!-- CTA Area if exists -->
    {{#if ctaText}}
    <div class="mt-16 text-center hc-animate-fade-in-up" style="animation-delay: 200ms;">
        <a href="#cta" class="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--color-primary)]/50 rounded-full text-white font-semibold transition-all hover:scale-105 backdrop-blur-md shadow-lg shadow-black/50">
            {{ctaText}}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </a>
    </div>
    {{/if ctaText}}
</section>
`;

export const css = `
.feat-high-converting {
    background-color: var(--color-bg);
    color: var(--color-text);
    position: relative;
    overflow: hidden;
}

/* Subtle background glowing orb */
.feat-high-converting::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 80vh;
    max-width: 800px;
    max-height: 800px;
    background: radial-gradient(circle, var(--color-primary) 0%, transparent 60%);
    opacity: 0.05;
    pointer-events: none;
    z-index: 0;
    border-radius: 50%;
    filter: blur(80px);
}

.hc-glass {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
}

.hc-animate-fade-in-up {
    animation: hc-fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
}

.group:nth-child(2) { animation-delay: 100ms; }
.group:nth-child(3) { animation-delay: 200ms; }
.group:nth-child(4) { animation-delay: 300ms; }
.group:nth-child(5) { animation-delay: 400ms; }
.group:nth-child(6) { animation-delay: 500ms; }

@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
`;
