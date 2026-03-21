export const html = `
<section class="dg-wrapper">
    <div class="dg-container">
        
        <!-- 상단 대형 메인 비주얼 영역 (비디오 또는 대형 이미지) -->
        <div class="dg-hero-box hc-animate-fade-in-up">
            <div class="dg-hero-gradient"></div>
            <!-- 큰 텍스트 또는 이미지/비디오 컨텐츠가 들어갈 수 있는 공간 -->
            <div class="dg-hero-content">
                {{#if headline}}
                <h2 class="dg-hero-title">{{{headline}}}</h2>
                {{/if headline}}
                {{#if subheadline}}
                <p class="dg-hero-subtitle">{{{subheadline}}}</p>
                {{/if subheadline}}
            </div>
            {{#if imageUrl}}
            <img src="{{imageUrl}}" alt="Main Feature" class="dg-hero-img" />
            {{/if imageUrl}}
        </div>

        <!-- 하단 3열 Dark Glow Features -->
        <div class="dg-grid">
            
            <!-- Item 1 -->
            {{#if bullet.1}}
            <div class="dg-col hc-animate-fade-in-up" style="animation-delay: 100ms;">
                <div class="dg-icon-box">
                    <div class="dg-icon-glow dg-glow-blue"></div>
                    <div class="dg-icon-bg">
                        {{{bullet.0}}}
                    </div>
                </div>
                <h3 class="dg-title">{{{bullet.1}}}</h3>
                <p class="dg-desc">{{{bullet.2}}}</p>
            </div>
            {{/if bullet.1}}

            <!-- Item 2 -->
            {{#if bullet.4}}
            <div class="dg-col hc-animate-fade-in-up" style="animation-delay: 200ms;">
                <div class="dg-icon-box">
                    <div class="dg-icon-glow dg-glow-cyan"></div>
                    <div class="dg-icon-bg">
                        {{{bullet.3}}}
                    </div>
                </div>
                <h3 class="dg-title">{{{bullet.4}}}</h3>
                <p class="dg-desc">{{{bullet.5}}}</p>
            </div>
            {{/if bullet.4}}

            <!-- Item 3 -->
            {{#if bullet.7}}
            <div class="dg-col hc-animate-fade-in-up" style="animation-delay: 300ms;">
                <div class="dg-icon-box">
                    <div class="dg-icon-glow dg-glow-purple"></div>
                    <div class="dg-icon-bg">
                        {{{bullet.6}}}
                    </div>
                </div>
                <h3 class="dg-title">{{{bullet.7}}}</h3>
                <p class="dg-desc">{{{bullet.8}}}</p>
            </div>
            {{/if bullet.7}}

        </div>

        {{#if body}}
        <div class="dg-footer-asterisk hc-animate-fade-in-up" style="animation-delay: 400ms;">
            {{{body}}}
        </div>
        {{/if body}}
        
    </div>
</section>
`;

export const css = `
.dg-wrapper {
    position: relative;
    width: 100%;
    background-color: #0b0c10; /* 극도로 어두운 네이비/블랙 배경 (Zoom 참조) */
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 6rem 0 8rem 0;
    overflow: hidden;
    color: #ffffff;
}

.dg-container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

/* 상단 메인 히어로 박스 */
.dg-hero-box {
    width: 100%;
    background: linear-gradient(180deg, rgba(20,22,30,1) 0%, rgba(10,12,18,1) 100%);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    margin-bottom: 5rem;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
}

/* 내부를 밝히는 네온 그라데이션 빛 */
.dg-hero-gradient {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 150%;
    background: radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%);
    pointer-events: none;
}

.dg-hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
    padding: 4rem 2rem;
}

.dg-hero-title {
    font-size: 5.5rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    margin: 0 0 1rem 0;
    /* 흰색에서 살짝 투명해지는 그라데이션 텍스트 */
    background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.dg-hero-subtitle {
    font-size: 1.25rem;
    font-weight: 400;
    color: #a0aab2;
    margin: 0;
    letter-spacing: -0.01em;
}

.dg-hero-img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
    position: relative;
    z-index: 5;
    opacity: 0.8;
}

/* 3열 그리드 */
.dg-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4rem;
    width: 100%;
}

.dg-col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

/* 아이콘 박스와 빛 번짐(Glow) 효과 */
.dg-icon-box {
    position: relative;
    width: 64px;
    height: 64px;
    margin-bottom: 2rem;
    border-radius: 16px;
}

.dg-icon-bg {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    backdrop-filter: blur(10px);
}

.dg-icon-bg svg {
    width: 32px;
    height: 32px;
    fill: none;
    stroke: #ffffff;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* 백그라운드 글로우 */
.dg-icon-glow {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 120%; height: 120%;
    border-radius: 50%;
    filter: blur(20px);
    z-index: 1;
    opacity: 0.5;
    transition: opacity 0.3s ease;
}

.dg-col:hover .dg-icon-glow {
    opacity: 0.8;
}

.dg-glow-blue { background-color: #3b82f6; }
.dg-glow-cyan { background-color: #06b6d4; }
.dg-glow-purple { background-color: #8b5cf6; }

.dg-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    line-height: 1.3;
    letter-spacing: -0.03em;
    color: #ffffff;
}

.dg-desc {
    font-size: 1rem;
    font-weight: 400;
    color: #94a3b8;
    line-height: 1.6;
    margin: 0;
    word-break: keep-all;
}

/* 우측 상단이나 하단에 작게 들어가는 참고 문구 */
.dg-footer-asterisk {
    width: 100%;
    font-size: 0.85rem;
    color: #64748b;
    text-align: right;
    margin-top: 3rem;
    font-style: italic;
}

.hc-animate-fade-in-up {
    animation: hc-fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}
@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
    .dg-grid { grid-template-columns: repeat(2, 1fr); gap: 3rem; }
    .dg-hero-title { font-size: 4rem; }
}

@media (max-width: 600px) {
    .dg-wrapper { padding: 4rem 0 5rem 0; }
    .dg-hero-title { font-size: 2.8rem; }
    .dg-hero-box { min-height: 250px; margin-bottom: 3rem; }
    
    .dg-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .dg-footer-asterisk { text-align: center; }
}
`;
