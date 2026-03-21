export const html = `
<main class="ce-wrapper">
    <div class="ce-container">
        
        <!-- Header Section -->
        <div class="ce-header hc-animate-fade-in-up">
            {{#if subheadline}}
            <div class="ce-subheadline">{{{subheadline}}}</div>
            {{/if subheadline}}
            
            <h1 class="ce-headline">{{{headline}}}</h1>
            
            {{#if body}}
            <div class="ce-disclaimer">{{{body}}}</div>
            {{/if body}}
        </div>

        <!-- Center Image and Orbiting Stats -->
        <div class="ce-showcase hc-animate-fade-in-up" style="animation-delay: 200ms;">
            
            <!-- Central Image -->
            {{#if imageUrl}}
            <img src="{{imageUrl}}" class="ce-subject-img" alt="Subject Focus" />
            {{/if imageUrl}}

            <!-- Four Stats Points -->
            <div class="ce-stats-grid">
                
                <!-- Stat Top Left -->
                {{#if bullet.0}}
                <div class="ce-stat ce-stat-tl">
                    <div class="ce-stat-desc">{{{bullet.0}}}</div>
                    <div class="ce-stat-val">{{{bullet.1}}} <span class="ce-arrow">⭡</span></div>
                </div>
                {{/if bullet.0}}

                <!-- Stat Bottom Left -->
                {{#if bullet.2}}
                <div class="ce-stat ce-stat-bl">
                    <div class="ce-stat-desc">{{{bullet.2}}}</div>
                    <div class="ce-stat-val">{{{bullet.3}}} <span class="ce-arrow">⭡</span></div>
                </div>
                {{/if bullet.2}}

                <!-- Stat Top Right -->
                {{#if bullet.4}}
                <div class="ce-stat ce-stat-tr">
                    <div class="ce-stat-desc">{{{bullet.4}}}</div>
                    <div class="ce-stat-val">{{{bullet.5}}} <span class="ce-arrow">⭡</span></div>
                </div>
                {{/if bullet.4}}

                <!-- Stat Bottom Right -->
                {{#if bullet.6}}
                <div class="ce-stat ce-stat-br">
                    <div class="ce-stat-desc">{{{bullet.6}}}</div>
                    <div class="ce-stat-val">{{{bullet.7}}} <span class="ce-arrow">⭡</span></div>
                </div>
                {{/if bullet.6}}
                
            </div>
            
        </div>

        <!-- Optional CTA -->
        {{#if ctaText}}
        <div class="ce-cta-area hc-animate-fade-in-up" style="animation-delay: 400ms;">
            <a href="#cta" class="ce-btn">{{ctaText}}</a>
        </div>
        {{/if ctaText}}

    </div>
</main>
`;

export const css = `
.ce-wrapper {
    position: relative;
    width: 100%;
    min-height: 800px;
    background-color: #fcfcfd;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    overflow: hidden;
}

.ce-container {
    width: 100%;
    max-width: 1280px; /* 데스크탑 와이드 기준 */
    padding: 4rem 5% 5rem 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.ce-header {
    text-align: center;
    margin-bottom: 3rem;
    z-index: 10;
    width: 100%;
}

.ce-subheadline {
    font-size: 2.5rem;
    font-weight: 500;
    color: #111111;
    letter-spacing: -0.04em;
    margin-bottom: 0.2rem;
}

.ce-headline {
    font-size: 3.8rem;
    font-weight: 800;
    color: #3bb291; /* 민트/청록색 포인트 */
    letter-spacing: -0.05em;
    margin: 0 0 1rem 0;
    line-height: 1.2;
}

.ce-disclaimer {
    font-size: 0.85rem;
    font-weight: 400;
    color: #888888;
    line-height: 1.5;
    white-space: pre-line;
    letter-spacing: -0.02em;
}

.ce-showcase {
    position: relative;
    width: 100%;
    max-width: 900px;
    height: 600px; /* 얼굴 이미지가 들어갈 충분한 높이 */
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.ce-subject-img {
    height: 100%;
    max-height: 600px;
    width: auto;
    object-fit: contain;
    position: relative;
    z-index: 2;
    /* 얼굴 누끼 느낌 강조 */
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.05));
    transform: translateY(10px);
}

.ce-stats-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 5;
    pointer-events: none;
}

.ce-stat {
    position: absolute;
    display: flex;
    flex-direction: column;
}

.ce-stat-desc {
    font-size: 1.15rem;
    font-weight: 700;
    color: #222222;
    margin-bottom: 0.2rem;
    letter-spacing: -0.03em;
}

.ce-stat-val {
    font-size: 3.2rem;
    font-weight: 900;
    color: #3bb291;
    letter-spacing: -0.02em;
    line-height: 1;
    display: flex;
    align-items: baseline;
    gap: 0.2rem;
}

/* 윗화살표 */
.ce-arrow {
    font-size: 2.2rem;
    font-weight: 900;
    color: #3bb291;
}

/* 위치 조정 (데스크탑 와이드 기준 중앙 얼굴 기준 좌우 배치) */
.ce-stat-tl {
    top: 40%;
    left: 2%;
    align-items: center;
    text-align: center;
}

.ce-stat-bl {
    bottom: 5%;
    left: 5%;
    align-items: center;
    text-align: center;
}

.ce-stat-tr {
    top: 35%;
    right: 2%;
    align-items: center;
    text-align: center;
}

.ce-stat-br {
    bottom: 5%;
    right: 5%;
    align-items: center;
    text-align: center;
}


/* Add CTA area */
.ce-cta-area {
    margin-top: 4rem;
    width: 100%;
    max-width: 400px;
    z-index: 10;
}
.ce-btn {
    display: block;
    width: 100%;
    text-align: center;
    background-color: #3bb291;
    color: #fff;
    padding: 1.2rem;
    font-size: 1.4rem;
    font-weight: 700;
    border-radius: 50px;
    text-decoration: none;
    box-shadow: 0 10px 20px rgba(59, 178, 145, 0.2);
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
    .ce-subheadline { font-size: 1.6rem; }
    .ce-headline { font-size: 2.2rem; margin-bottom: 0.5rem; }
    .ce-showcase { height: 400px; }
    .ce-subject-img { height: 380px; }
    
    .ce-stat-desc { font-size: 0.9rem; }
    .ce-stat-val { font-size: 2rem; }
    .ce-arrow { font-size: 1.5rem; }
    
    .ce-stat-tl { top: 25%; left: -2%; }
    .ce-stat-bl { bottom: 20%; left: -5%; }
    .ce-stat-tr { top: 20%; right: -2%; }
    .ce-stat-br { bottom: 15%; right: -5%; }
    
    .ce-disclaimer { font-size: 0.7rem; }
}
`;
