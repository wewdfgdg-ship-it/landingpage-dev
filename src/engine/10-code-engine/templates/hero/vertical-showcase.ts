export const html = `
<main class="vs-container">
    <div class="vs-text-area hc-animate-fade-in-up">
        <p class="vs-subheadline">{{subheadline}}</p>
        <h1 class="vs-headline">{{headline}}</h1>
    </div>

    <!-- Badges Row -->
    <div class="vs-badges hc-animate-fade-in-up" style="animation-delay: 100ms;">
        {{#each bullets}}
        <div class="vs-badge">
            <div class="vs-badge-inner">
                <span>{{this}}</span>
            </div>
        </div>
        {{/each bullets}}
    </div>

    <!-- Product Showcase -->
    <div class="vs-product-area hc-animate-fade-in-up" style="animation-delay: 200ms;">
        <div class="vs-glow"></div>
        {{#if imageUrl}}
        <img src="{{imageUrl}}" class="vs-product-image" alt="Product" />
        {{/if imageUrl}}
    </div>

    <!-- Bottom Specs / Features -->
    <div class="vs-footer hc-animate-fade-in-up" style="animation-delay: 300ms;">
        <div class="vs-footer-item">{{body}}</div>
        <div class="vs-divider"></div>
        <div class="vs-footer-item">{{microCopy}}</div>
    </div>

    {{#if ctaText}}
    <div class="vs-cta-area hc-animate-fade-in-up" style="animation-delay: 400ms;">
        <a href="#cta" class="vs-cta-btn">{{ctaText}}</a>
    </div>
    {{/if ctaText}}
</main>
`;

export const css = `
.vs-container {
    width: 100%;
    background-color: var(--color-bg);
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4rem;
    padding-bottom: 3rem;
    position: relative;
    overflow: hidden;
    font-family: inherit;
}

.vs-text-area {
    text-align: center;
    width: 100%;
    padding: 0 1.5rem;
    margin-bottom: 2.5rem;
    position: relative;
    z-index: 10;
}

.vs-subheadline {
    font-size: 1.1rem;
    font-weight: 700;
    opacity: 0.85;
    margin-bottom: 0.75rem;
    white-space: pre-line;
    line-height: 1.4;
    letter-spacing: -0.02em;
}

.vs-headline {
    font-size: 2.5rem;
    font-weight: 900;
    line-height: 1.25;
    white-space: pre-line;
    color: var(--color-primary);
    /* 입체적 텍스트 (3D Effect) */
    text-shadow: 0px 4px 16px rgba(0,0,0,0.2); 
    letter-spacing: -0.05em;
    word-break: keep-all;
}

/* Inject 엔진이 헤드라인 분리 시 추가하는 클래스 초기화 */
.vs-headline .headline-sm { 
    display: block; 
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 0.2rem;
    color: var(--color-text);
}
.vs-headline .headline-lg { 
    display: block; 
    font-size: 3rem; 
    font-weight: 900;
    color: var(--color-primary);
}

.vs-badges {
    display: flex;
    justify-content: center;
    gap: 1.25rem;
    width: 100%;
    margin-bottom: 3rem;
    z-index: 10;
}

.vs-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 닥터멜락신 스타일 이중 테두리 뱃지 */
.vs-badge-inner {
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    background-color: var(--color-bg);
    border: 1px solid var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    position: relative;
}

.vs-badge-inner::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    border: 1px solid var(--color-primary);
    opacity: 0.3;
}

.vs-badge-inner span {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1.3;
    white-space: pre-line;
    z-index: 2;
    letter-spacing: -0.03em;
}

.vs-product-area {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
    z-index: 5;
}

.vs-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 90%;
    background-color: var(--color-primary);
    filter: blur(80px);
    opacity: 0.15;
    border-radius: 50%;
    z-index: -1;
}

/* 랜딩페이지처럼 갇힌 게 아니라 상세페이지(Detail)처럼 꽉 찬 비율 */
.vs-product-image {
    width: 100%;
    max-width: 480px; 
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15));
}

.vs-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 400px;
    padding: 1.5rem 1rem;
    border-top: 1px solid rgba(150, 150, 150, 0.2);
    margin-bottom: 2rem;
    z-index: 10;
}

.vs-footer-item {
    flex: 1;
    text-align: center;
    font-size: 0.95rem;
    font-weight: 700;
    white-space: pre-line;
    line-height: 1.4;
    color: var(--color-text);
    word-break: keep-all;
}

.vs-divider {
    width: 1px;
    height: 50px;
    background-color: rgba(150, 150, 150, 0.2);
    margin: 0 1rem;
}

.vs-cta-area {
    width: 100%;
    max-width: 400px;
    padding: 0 1.5rem;
    z-index: 20;
}

.vs-cta-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1.25rem;
    background-color: var(--color-primary);
    color: #ffffff !important;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 800;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
}

.vs-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.3);
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
