export const html = `
<section class="bs-wrapper">
    <div class="bs-container">
        
        <!-- 브랜드 핵심 콘셉트명 및 서브타이틀 -->
        <div class="bs-header hc-animate-fade-in-up">
            <h2 class="bs-title">{{{headline}}}</h2>
            {{#if subheadline}}
            <p class="bs-subtitle">{{{subheadline}}}</p>
            {{/if subheadline}}
        </div>

        <!-- 중앙 비주얼 (로고나 제품) & 떠다니는 태그들 -->
        <div class="bs-visual-area hc-animate-fade-in-up" style="animation-delay: 200ms;">
            
            <div class="bs-center-item">
                <img src="{{imageUrl}}" alt="Brand Logo or Core Item" class="bs-center-img" />
            </div>

            <!-- 스킬/태그 칩스들 -->
            {{#if bullet.0}}
            <div class="bs-chip bs-chip-1" style="animation-delay: 300ms;">
                {{{bullet.0}}}
            </div>
            {{/if bullet.0}}

            {{#if bullet.1}}
            <div class="bs-chip bs-chip-2" style="animation-delay: 400ms;">
                {{{bullet.1}}}
            </div>
            {{/if bullet.1}}

            {{#if bullet.2}}
            <div class="bs-chip bs-chip-3" style="animation-delay: 500ms;">
                {{{bullet.2}}}
            </div>
            {{/if bullet.2}}

            {{#if bullet.3}}
            <div class="bs-chip bs-chip-4" style="animation-delay: 600ms;">
                {{{bullet.3}}}
            </div>
            {{/if bullet.3}}

            {{#if bullet.4}}
            <div class="bs-chip bs-chip-5" style="animation-delay: 700ms;">
                {{{bullet.4}}}
            </div>
            {{/if bullet.4}}
            
        </div>

        <!-- 브랜드/핵심 기능 스토리텔링 텍스트 영역 -->
        {{#if body}}
        <div class="bs-story-area hc-animate-fade-in-up" style="animation-delay: 400ms;">
            <h3 class="bs-story-title">{{{microCopy}}}</h3>
            <div class="bs-story-text">
                {{{body}}}
            </div>
        </div>
        {{/if body}}

    </div>
</section>
`;

export const css = `
.bs-wrapper {
    position: relative;
    width: 100%;
    /* 레퍼런스의 깊이감 있는 블랙/다크그레이 배경 */
    background: linear-gradient(180deg, #18181a 0%, #111111 100%);
    color: #ffffff;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
    min-height: 800px;
}

.bs-container {
    width: 100%;
    max-width: 900px; /* 레퍼런스처럼 넓고 여유있는 공간감 */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.bs-header {
    text-align: center;
    margin-bottom: 5rem;
}

.bs-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 0 0 1rem 0;
    letter-spacing: -0.03em;
}

.bs-subtitle {
    font-size: 1.3rem;
    font-weight: 400;
    color: #a0a0a0; /* 연한 회색 */
    margin: 0;
    letter-spacing: -0.02em;
}

/* 중앙 비주얼 영역 (중심 원형 아이템과 스파크/칩들) */
.bs-visual-area {
    position: relative;
    width: 100%;
    max-width: 600px;
    height: 400px;
    margin-bottom: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.bs-center-item {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    /* 레퍼런스의 메탈릭/글래스 질감을 위한 약간의 효과 */
    background: rgba(40,40,40,0.5);
    box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    backdrop-filter: blur(10px);
}

.bs-center-img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
}

/* 플로팅 칩스 공통 */
.bs-chip {
    position: absolute;
    background: rgba(30, 30, 30, 0.8);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 500;
    color: #eaeaea;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    z-index: 5;
    white-space: nowrap;
    animation: bs-float 4s ease-in-out infinite alternate;
}

@keyframes bs-float {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-10px); }
}

/* 칩스 아이콘(SVG 등) 포함 시 색상 정렬용 */
.bs-chip img, .bs-chip svg {
    width: 24px;
    height: 24px;
}

/* 위치 지정 */
.bs-chip-1 { top: 10%; right: 10%; animation-delay: 0s; }
.bs-chip-2 { top: 30%; left: 5%; animation-delay: -1s; }
.bs-chip-3 { top: 50%; left: -5%; animation-delay: -2s; }
.bs-chip-4 { bottom: 20%; left: 10%; animation-delay: -3s; }
.bs-chip-5 { bottom: 5%; right: 15%; animation-delay: -4s; }


/* 브랜드 스토리 텍스트 영역 */
.bs-story-area {
    width: 100%;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.1);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 4rem 0;
}

.bs-story-title {
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0 0 2rem 0;
    letter-spacing: -0.04em;
}

.bs-story-text {
    font-size: 1.3rem;
    font-weight: 400;
    color: #cccccc;
    line-height: 1.8;
    margin: 0;
    letter-spacing: -0.02em;
    word-break: keep-all;
}

/* 텍스트 내 강조 태그 */
.bs-story-text strong, .bs-story-text b {
    color: #ffffff;
    font-weight: 700;
}

/* 애니메이션 */
.hc-animate-fade-in-up {
    animation: hc-fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}
@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
    .bs-wrapper { padding: 4rem 0; min-height: 500px; }
    .bs-title { font-size: 2.5rem; }
    .bs-subtitle { font-size: 1.1rem; }
    
    .bs-visual-area { height: 350px; margin-bottom: 3rem; }
    .bs-center-item { width: 140px; height: 140px; }
    
    .bs-chip { padding: 0.6rem 1.2rem; font-size: 0.95rem; }
    .bs-chip-1 { top: 5%; right: 5%; }
    .bs-chip-2 { top: 25%; left: 0%; }
    .bs-chip-3 { top: 55%; left: -5%; }
    .bs-chip-4 { bottom: 15%; left: 5%; }
    .bs-chip-5 { bottom: 0%; right: 10%; }
    
    .bs-story-area { padding: 3rem 0; }
    .bs-story-title { font-size: 1.8rem; margin-bottom: 1.5rem; }
    .bs-story-text { font-size: 1.1rem; line-height: 1.6; }
}

@media (max-width: 480px) {
    /* 모바일에서는 칩이 너무 많으면 복잡하므로 일부 숨기거나 크기 조절 */
    .bs-chip-2 { display: none; }
    .bs-chip-4 { display: none; }
    .bs-chip-1 { top: 10%; right: -5%; }
    .bs-chip-3 { top: 40%; left: -10%; }
    .bs-chip-5 { bottom: 10%; right: -5%; }
}
`;
