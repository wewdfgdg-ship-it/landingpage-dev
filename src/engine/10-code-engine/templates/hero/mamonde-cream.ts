export const html = `
<main class="mc-wrapper">
    <div class="mc-container">
        
        <!-- Header Section -->
        <div class="mc-header hc-animate-fade-in-up">
            {{#if microCopy}}
            <div class="mc-badge-wrap">
                <span class="mc-badge">{{{microCopy}}}</span>
            </div>
            {{/if microCopy}}
            
            <h1 class="mc-headline">{{{headline}}}</h1>
            
            {{#if subheadline}}
            <div class="mc-subheadline">{{{subheadline}}}</div>
            {{/if subheadline}}
        </div>

        <!-- Central Product Showcase -->
        <div class="mc-showcase hc-animate-fade-in-up" style="animation-delay: 200ms;">
            
            <!-- Orbit rings with clovers -->
            <div class="mc-orbit mc-orbit-1">
                <span class="mc-clover" style="top: 15%; left: -6px;">✤</span>
                <span class="mc-clover" style="top: 75%; right: -6px;">✤</span>
            </div>
            <div class="mc-orbit mc-orbit-2">
                <span class="mc-clover" style="top: -6px; left: 45%;">✤</span>
            </div>

            <!-- Product Image -->
            {{#if imageUrl}}
            <img src="{{imageUrl}}" class="mc-product-img" alt="Product" />
            {{/if imageUrl}}

            <!-- Features -->
            <div class="mc-features">
                {{#if bullet.0}}
                <div class="mc-feat mc-feat-left mc-feat-top">
                    {{{bullet.0}}}
                </div>
                {{/if bullet.0}}

                {{#if bullet.1}}
                <div class="mc-feat mc-feat-right mc-feat-mid">
                    {{{bullet.1}}}
                </div>
                {{/if bullet.1}}

                {{#if bullet.2}}
                <div class="mc-feat mc-feat-left mc-feat-bot">
                    {{{bullet.2}}}
                </div>
                {{/if bullet.2}}
            </div>
        </div>

        <!-- CTA if exists -->
        {{#if ctaText}}
        <div class="mc-cta-area hc-animate-fade-in-up" style="animation-delay: 400ms;">
            <a href="#cta" class="mc-btn">{{ctaText}}</a>
        </div>
        {{/if ctaText}}

    </div>
</main>
`;

export const css = `
.mc-wrapper {
    position: relative;
    width: 100%;
    min-height: 100vh;
    /* Soft cyan to pink gradient identical to reference */
    background: linear-gradient(180deg, #dcf8ff 0%, #ffe3f9 100%);
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    overflow: hidden;
}

.mc-container {
    width: 100%;
    max-width: 1280px; /* 데스크탑 와이드 기준 */
    padding: 3rem 5% 5rem 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.mc-header {
    text-align: center;
    margin-bottom: 3.5rem;
    z-index: 10;
}

.mc-badge-wrap {
    margin-bottom: 0.75rem;
}

.mc-badge {
    display: inline-block;
    background-color: #111111;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 800;
    padding: 0.2rem 0.6rem;
    letter-spacing: 0.05em;
}

.mc-headline {
    font-size: 2.5rem;
    font-weight: 800;
    color: #222222;
    letter-spacing: -0.04em;
    margin-bottom: 0.5rem;
    line-height: 1.25;
}

.mc-subheadline {
    font-size: 1.3rem;
    font-weight: 500;
    color: #444444;
    letter-spacing: -0.01em;
}

.mc-showcase {
    position: relative;
    width: 100%;
    max-width: 650px; /* 너무 넓게 퍼지지 않도록 폭 고정 */
    height: 550px; /* 제품과 텍스트가 배치될 충분한 높이 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.mc-product-img {
    height: 380px; /* 화장품 용기 크기 */
    width: auto;
    object-fit: contain;
    position: relative;
    z-index: 5;
    /* 은은한 제품 그림자 */
    filter: drop-shadow(0 20px 25px rgba(220,100,180,0.15)) drop-shadow(15px 15px 5px rgba(0,0,0,0.05));
}

/* 타원형 궤도 그리기 (오르빗) */
.mc-orbit {
    position: absolute;
    border: 1px solid rgba(0,0,0,0.7);
    border-radius: 50%;
    z-index: 2;
    pointer-events: none;
}

.mc-orbit-1 {
    width: 360px;
    height: 200px;
    top: 15%;
    left: 45%;
    transform: translateX(-50%) rotate(15deg);
}

.mc-orbit-2 {
    width: 400px;
    height: 260px;
    bottom: 2%;
    left: 55%;
    transform: translateX(-50%) rotate(-10deg);
}

.mc-clover {
    position: absolute;
    font-size: 1.2rem;
    line-height: 1;
    color: #111;
    background-color: transparent;
    text-shadow: 0 0 5px rgba(255,255,255,0.8);
}

.mc-features {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    pointer-events: none;
}

.mc-feat {
    position: absolute;
    display: flex;
    flex-direction: column;
}

/* 위치 조정 (데스크탑 와이드 기준 중앙 배치에서 뻗어나가는 형태) */
.mc-feat-left {
    align-items: flex-start;
    text-align: left;
    left: 0%;
}

.mc-feat-right {
    align-items: flex-end;
    text-align: right;
    right: 0%;
}

.mc-feat-top { top: 15%; }
.mc-feat-mid { top: 50%; transform: translateY(-50%); }
.mc-feat-bot { bottom: 10%; }


/* 템플릿 전용 커스텀 카피 스타일 (Cyan 배경 + 텍스트) */
.mc-hl-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.5rem;
}
.mc-feat-left .mc-hl-wrap { align-items: flex-start; }
.mc-feat-right .mc-hl-wrap { align-items: flex-end; }

.mc-highlight {
    background-color: #61f8f8; /* 형광 Cyan 색상 */
    color: #111111;
    font-size: 1.35rem;
    font-weight: 850;
    padding: 0.15rem 0.4rem;
    display: inline-block;
}

.mc-desc {
    font-size: 1.05rem;
    font-weight: 500;
    color: #333333;
    line-height: 1.4;
    letter-spacing: -0.03em;
}

/* Add CTA area */
.mc-cta-area {
    margin-top: 4rem;
    width: 100%;
    max-width: 400px;
}
.mc-btn {
    display: block;
    width: 100%;
    text-align: center;
    background-color: #ff529c;
    color: #fff;
    padding: 1.25rem;
    font-size: 1.3rem;
    font-weight: 800;
    border-radius: 8px;
    text-decoration: none;
    box-shadow: 0 10px 20px rgba(255, 82, 156, 0.3);
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

/* 모바일 분기처리 (자연스럽게 줄어들게) */
@media (max-width: 768px) {
    .mc-headline { font-size: 1.8rem; }
    .mc-subheadline { font-size: 1rem; }
    .mc-showcase { height: 450px; }
    .mc-product-img { height: 280px; }
    .mc-highlight { font-size: 1.1rem; }
    .mc-desc { font-size: 0.9rem; }
    .mc-orbit-1 { width: 280px; height: 160px; }
    .mc-orbit-2 { width: 300px; height: 180px; }
    
    .mc-feat-left { left: 5%; }
    .mc-feat-right { right: 5%; }
}
`;
