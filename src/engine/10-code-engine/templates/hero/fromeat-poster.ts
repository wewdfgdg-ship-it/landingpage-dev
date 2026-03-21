export const html = `
<main class="fe-wrapper">
    <!-- 노이즈 질감 오버레이 -->
    <div class="fe-noise"></div>
    
    <div class="fe-container">
        
        <!-- Top Nav -->
        {{#if microCopy}}
        <div class="fe-topbar hc-animate-fade-in-up">
            {{{microCopy}}}
        </div>
        {{/if microCopy}}

        <!-- Product Image -->
        <div class="fe-image-area hc-animate-fade-in-up" style="animation-delay: 150ms;">
             {{#if imageUrl}}
             <img src="{{imageUrl}}" class="fe-product-img" alt="Product" />
             {{/if imageUrl}}
        </div>

        <!-- Right side Stats -->
        <div class="fe-stats-area hc-animate-fade-in-up" style="animation-delay: 300ms;">
            {{#if bullet.0}}
            <div class="fe-stat-item">
                <div class="fe-stat-label">{{{bullet.0}}}</div>
                <div class="fe-stat-value">{{{bullet.1}}}</div>
            </div>
            {{/if bullet.0}}
            
            {{#if bullet.2}}
            <div class="fe-stat-divider"></div>
            <div class="fe-stat-item">
                <div class="fe-stat-label">{{{bullet.2}}}</div>
                <div class="fe-stat-value">{{{bullet.3}}}</div>
            </div>
            {{/if bullet.2}}
            
            {{#if bullet.4}}
            <div class="fe-stat-divider"></div>
            <div class="fe-stat-item">
                <div class="fe-stat-label">{{{bullet.4}}}</div>
                <div class="fe-stat-value">{{{bullet.5}}}</div>
            </div>
            {{/if bullet.4}}
        </div>

        <!-- Bottom right titles -->
        <div class="fe-bottom-area hc-animate-fade-in-up" style="animation-delay: 450ms;">
             {{#if headline}}
             <div class="fe-main-title">{{{headline}}}</div>
             {{/if headline}}
             
             <div class="fe-btm-divider"></div>
             
             {{#if body}}
             <div class="fe-sub-title">{{{body}}}</div>
             {{/if body}}
        </div>
        
    </div>
</main>
`;

export const css = `
.fe-wrapper {
    position: relative;
    width: 100%;
    /* 데스크탑에서 시원하게 보이도록 최소 높이 설정 */
    min-height: 800px;
    background: linear-gradient(180deg, #b07de2 0%, #9057cc 100%);
    color: #ffffff;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    overflow: hidden;
}

/* 텍스처 노이즈 만들기 */
.fe-noise {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    /* 아주 고운 노이즈 필터 배경 */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.15;
    pointer-events: none;
    z-index: 1;
    mix-blend-mode: overlay;
}

.fe-container {
    width: 100%;
    max-width: 1000px; /* 양옆 비율이 안정적인 가로폭 */
    position: relative;
    z-index: 5;
    padding: 2.5rem 5%;
}

.fe-topbar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.fe-image-area {
    position: absolute;
    left: -5%;
    bottom: -5%; /* 제품이 밑에서부터 올라오는 느낌 */
    width: 60%;
    height: 85%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 2; /* 텍스트 아래로 가도록 z-index 설정 */
}

.fe-product-img {
    height: 100%;
    max-height: 700px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 30px 40px rgba(0,0,0,0.5));
}

.fe-stats-area {
    position: absolute;
    top: 15%;
    right: 5%;
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* 오른쪽 정렬 */
    text-align: right;
    z-index: 10; /* 이미지보다 위로 오도록 */
}

.fe-stat-item {
    margin-bottom: 0.5rem;
}

.fe-stat-label {
    font-size: 1.4rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: -0.02em;
    margin-bottom: -0.3rem; /* 수치와 간격 좁히기 */
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.fe-stat-value {
    font-size: 4.5rem;
    font-weight: 900;
    line-height: 1.1;
    color: #ffffff;
    letter-spacing: -0.02em;
    text-shadow: 2px 2px 5px rgba(0,0,0,0.3);
}

.fe-stat-unit {
    font-size: 2.5rem;
    font-weight: 700;
    vertical-align: baseline;
    margin-left: -5px;
}

.fe-stat-divider {
    width: 150px;
    height: 1px;
    border-bottom: 2px dotted rgba(255,255,255,0.4);
    margin: 1.5rem 0;
}

.fe-bottom-area {
    position: absolute;
    bottom: 12%;
    right: 5%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    z-index: 10; /* 이미지보다 위로 오도록 */
}

.fe-main-title {
    font-size: 2.8rem;
    font-weight: 950;
    color: #ffffff;
    letter-spacing: -0.05em;
    line-height: 1.25;
    white-space: pre-line;
    text-shadow: 0 4px 15px rgba(0,0,0,0.4);
}

.fe-btm-divider {
    width: 250px;
    height: 1px;
    border-bottom: 2px dotted rgba(255,255,255,0.5);
    margin: 1rem 0;
}

.fe-sub-title {
    font-size: 2rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.04em;
    line-height: 1.3;
    white-space: pre-line;
    text-shadow: 0 4px 10px rgba(0,0,0,0.3);
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

/* 모바일 분기처리 */
@media (max-width: 768px) {
    .fe-wrapper { min-height: 900px; }
    .fe-image-area {
        left: -10%;
        bottom: 0%;
        width: 120%;
        height: 60%;
        opacity: 0.8; /* 텍스트 가독성을 위해 살짝 낮춤 */
    }
    .fe-stats-area { top: 12%; right: 8%; }
    .fe-stat-label { font-size: 1.2rem; }
    .fe-stat-value { font-size: 3.5rem; }
    .fe-stat-unit { font-size: 2rem; }
    
    .fe-bottom-area { bottom: 5%; right: 8%; }
    .fe-main-title { font-size: 2.2rem; }
    .fe-sub-title { font-size: 1.6rem; }
    .fe-stat-divider { margin: 1rem 0; width: 100px; }
    .fe-btm-divider { margin: 0.8rem 0; width: 200px; }
}
`;
