export const html = `
<main class="dp-wrapper">
    <!-- Huge background text -->
    <div class="dp-bg-text" aria-hidden="true">{{headline}}</div>
    
    <!-- Glowing background burst -->
    <div class="dp-burst"></div>

    <div class="dp-container">
        
        <!-- Header Text (Skewed & Heavy) -->
        <div class="dp-header hc-animate-fade-in-up">
            <div class="dp-subheadline">{{subheadline}}</div>
            <h1 class="dp-headline">{{headline}}</h1>
        </div>

        <!-- Central Product Showcase -->
        <div class="dp-product-showcase hc-animate-fade-in-up" style="animation-delay: 150ms;">
            {{#if imageUrl}}
            <img src="{{imageUrl}}" alt="Product Image" class="dp-product-img" />
            {{/if imageUrl}}
            
            {{#if microCopy}}
            <!-- Floating Badge like '1day 1 shot' or 'NEW' -->
            <div class="dp-floating-badge">
                <div class="dp-badge-text">{{microCopy}}</div>
            </div>
            {{/if microCopy}}
        </div>

        <!-- Information / Bullets -->
        {{#if bullets}}
        <div class="dp-features-grid hc-animate-fade-in-up" style="animation-delay: 300ms;">
            {{#each bullets}}
            <div class="dp-feature-item">
                <span class="dp-feature-dot"></span>
                <span class="dp-feature-text">{{this}}</span>
            </div>
            {{/each bullets}}
        </div>
        {{/if bullets}}

        <!-- Bottom CTA -->
        {{#if ctaText}}
        <div class="dp-cta-wrapper hc-animate-fade-in-up" style="animation-delay: 450ms;">
            <a href="#cta" class="dp-cta-button">
                <span>{{ctaText}}</span>
            </a>
            {{#if body}}
            <div class="dp-cta-subtext">{{body}}</div>
            {{/if body}}
        </div>
        {{/if ctaText}}
    </div>
</main>
`;

export const css = `
.dp-wrapper {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-color: var(--color-bg);
    color: var(--color-text);
    overflow: hidden;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
}

/* Repeated Background watermarks like 'IT'S NEW' or 'ZERO' */
.dp-bg-text {
    position: absolute;
    top: -10%;
    left: -20%;
    width: 140%;
    font-size: 20rem;
    font-weight: 900;
    line-height: 0.8;
    color: var(--color-primary);
    opacity: 0.05;
    text-transform: uppercase;
    white-space: pre-wrap;
    word-break: break-all;
    transform: rotate(-10deg);
    z-index: 0;
    pointer-events: none;
}

.dp-burst {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150vw;
    height: 150vw;
    background: radial-gradient(circle at center, var(--color-primary) 0%, transparent 60%);
    transform: translate(-50%, -50%);
    opacity: 0.25;
    z-index: 0;
    pointer-events: none;
}

.dp-container {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 480px; /* Mobile ad poster feel */
    padding: 4rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.dp-header {
    text-align: center;
    transform: skewY(-5deg); /* Skewed text like MyFit / Sprite */
    margin-bottom: 2rem;
    width: 100%;
}

.dp-subheadline {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: #ffffff;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
    white-space: pre-line;
    line-height: 1.3;
    letter-spacing: -0.02em;
}

.dp-headline {
    font-size: 3.5rem;
    font-weight: 950;
    line-height: 1.05;
    color: var(--color-primary);
    white-space: pre-line;
    /* 3D Extrusion effect */
    text-shadow: 
        1px 1px 0 #fff,
        2px 2px 0 #fff,
        3px 3px 0 #fff,
        4px 4px 15px rgba(0,0,0,0.5);
    letter-spacing: -0.05em;
    word-break: keep-all;
}

.dp-headline .headline-sm, 
.dp-headline .headline-lg {
    display: block;
    color: inherit;
}

.dp-product-showcase {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3rem 0;
    z-index: 20;
}

.dp-product-img {
    width: 75%;
    max-width: 280px;
    object-fit: contain;
    filter: drop-shadow(0 30px 40px rgba(0,0,0,0.5));
    transform: scale(1.05); /* Pop out effect */
    z-index: 2;
}

/* The floating sticker/badge (e.g. 1DAY 1SHOT) */
.dp-floating-badge {
    position: absolute;
    bottom: -5%;
    right: 0%;
    background-color: #000; /* High contrast black/yellow typically */
    color: #fff;
    padding: 0.75rem 1.25rem;
    transform: rotate(-10deg);
    z-index: 3;
    box-shadow: 6px 6px 0 var(--color-primary);
}

.dp-badge-text {
    font-size: 1.75rem;
    font-weight: 900;
    line-height: 1.05;
    text-transform: uppercase;
    white-space: pre-line;
    text-align: center;
    letter-spacing: -0.03em;
}

.dp-features-grid {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    justify-content: center;
}

.dp-feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    font-weight: 700;
    color: #fff;
}

.dp-feature-dot {
    width: 6px;
    height: 6px;
    background-color: var(--color-primary);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--color-primary);
}

.dp-cta-wrapper {
    width: 100%;
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.dp-cta-button {
    display: block;
    width: 100%;
    padding: 1.25rem;
    text-align: center;
    background: var(--color-primary);
    color: #fff !important;
    font-size: 1.75rem;
    font-weight: 900;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 100px;
    /* Skew button to match design */
    transform: skewX(-10deg);
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    border: 2px solid rgba(255,255,255,0.2);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dp-cta-button span {
    display: inline-block;
    transform: skewX(10deg); /* un-skew text */
}

.dp-cta-button:hover {
    transform: skewX(-10deg) translateY(-4px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.5);
    background: #fff;
    color: var(--color-primary) !important;
    border-color: var(--color-primary);
}

.dp-cta-subtext {
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
    opacity: 0.8;
    text-align: center;
    white-space: pre-line;
}

.hc-animate-fade-in-up {
    animation: hc-fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
}
@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
`;
