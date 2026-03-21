export const html = `
<section class="eg-wrapper">
    <!-- 배경 이미지 오버레이 플랫 -->
    <div class="eg-bg-overlay"></div>
    
    <div class="eg-container">
        <!-- Top Header -->
        <div class="eg-header hc-animate-fade-in-up">
            {{#if microCopy}}
            <div class="eg-step-number">{{{microCopy}}}</div>
            {{/if microCopy}}
            
            <h2 class="eg-headline">{{{headline}}}</h2>
            
            {{#if subheadline}}
            <div class="eg-subheadline">{{{subheadline}}}</div>
            {{/if subheadline}}
        </div>

        <!-- 2x2 White Card Grid -->
        <div class="eg-card-board hc-animate-fade-in-up" style="animation-delay: 200ms;">
            
            <!-- Item 1 -->
            <div class="eg-item eg-border-right eg-border-bottom">
                {{#if bullet.0}}
                <div class="eg-icon-wrap">{{{bullet.0}}}</div>
                {{/if bullet.0}}
                <div class="eg-text-wrap">{{{bullet.1}}}</div>
            </div>
            
            <!-- Item 2 -->
            <div class="eg-item eg-border-bottom">
                {{#if bullet.2}}
                <div class="eg-icon-wrap">{{{bullet.2}}}</div>
                {{/if bullet.2}}
                <div class="eg-text-wrap">{{{bullet.3}}}</div>
            </div>

            <!-- Item 3 -->
            <div class="eg-item eg-border-right">
                {{#if bullet.4}}
                <div class="eg-icon-wrap">{{{bullet.4}}}</div>
                {{/if bullet.4}}
                <div class="eg-text-wrap">{{{bullet.5}}}</div>
            </div>

            <!-- Item 4 -->
            <div class="eg-item">
                {{#if bullet.6}}
                <div class="eg-icon-wrap">{{{bullet.6}}}</div>
                {{/if bullet.6}}
                <div class="eg-text-wrap">{{{bullet.7}}}</div>
            </div>
            
        </div>
    </div>
</section>
`;

export const css = `
.eg-wrapper {
    position: relative;
    width: 100%;
    min-height: 900px;
    background-color: #5a554a; /* 기본 배경색 (이미지 로딩 전) */
    /* CSS 변수로 이미지 URL을 넘겨받아 배경으로 사용 (템플릿 엔진 외부에서 주입하거나 아래 기본값 사용) */
    background-image: var(--eg-bg-image, url('https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200'));
    background-size: cover;
    background-position: center;
    background-attachment: fixed; /* 패럴랙스 느낌의 고정 배경 */
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 6rem 0 8rem 0;
}

/* 어두운 틴트 오버레이 (사진을 살짝 어둡고 탁하게 눌러서 흰색 글씨/카드가 돋보이게) */
.eg-bg-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(40, 35, 30, 0.4); /* 따뜻한 웜그레이 톤의 반투명 오버레이 */
    z-index: 1;
}

.eg-container {
    width: 100%;
    max-width: 1280px;
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 5%;
}

.eg-header {
    text-align: center;
    margin-bottom: 3rem;
    color: #ffffff;
}

.eg-step-number {
    font-size: 1.4rem;
    font-weight: 800;
    margin-bottom: 0.2rem;
    letter-spacing: 0.05em;
}

.eg-headline {
    font-size: 3.8rem;
    font-weight: 900;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.eg-subheadline {
    font-size: 1.25rem;
    font-weight: 500;
    color: #eeeeee;
    letter-spacing: -0.02em;
}

/* 흰색 2x2 카드 보드 */
.eg-card-board {
    width: 100%;
    max-width: 700px; /* 카드가 너무 넓어지지 않게 고정 */
    background-color: rgba(255, 255, 255, 0.98); /* 거의 불투명한 화이트 (아주 살짝 뒤가 비치는 느낌) */
    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 테두리(보더)는 각 item에 개별 적용하여 안쪽 십자 선만 그리도록 세팅 */
}

.eg-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 4rem 2.5rem;
    text-align: center;
}

/* 십자선 (내부 경계선) 구현용 얇은 회색 테두리 */
.eg-border-right {
    border-right: 1px solid rgba(0,0,0,0.08);
}
.eg-border-bottom {
    border-bottom: 1px solid rgba(0,0,0,0.08);
}

.eg-icon-wrap {
    width: 70px;
    height: 70px;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* SVG 아이콘 얇게, 회색조로 설정 (레퍼런스 느낌) */
.eg-icon-wrap svg {
    max-width: 100%;
    max-height: 100%;
    stroke: #666;
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.eg-text-wrap {
    font-size: 0.95rem;
    font-weight: 400;
    color: #666666;
    line-height: 1.6;
    letter-spacing: -0.05em;
    word-break: keep-all;
}

/* 제목/강조 텍스트용 클래스 */
.eg-item-title {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: #333333;
    margin-bottom: 0.8rem;
    letter-spacing: -0.05em;
}

/* 본문 중 강조되는 단어의 연한 형광펜 효과 (선택사항) */
.eg-highlight {
    font-weight: 600;
    color: #222;
    box-shadow: inset 0 -8px 0 rgba(200,200,200,0.3);
}

.hc-animate-fade-in-up {
    animation: hc-fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}
@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(40px) }
    to { opacity: 1; transform: translateY(0) }
}

@media (max-width: 768px) {
    .eg-wrapper { padding: 4rem 0 5rem 0; min-height: auto; }
    .eg-step-number { font-size: 1.1rem; }
    .eg-headline { font-size: 2.8rem; }
    .eg-subheadline { font-size: 1.1rem; }
    
    .eg-card-board { 
        grid-template-columns: 1fr; /* 모바일에서는 1열로 변경 */
        max-width: 90%;
    }
    
    /* 모바일 1열일 때는 십자선 대신 밑줄만 남김 */
    .eg-border-right { border-right: none; }
    .eg-item:not(:last-child) { border-bottom: 1px solid rgba(0,0,0,0.08); }
    
    .eg-item { padding: 3rem 1.5rem; }
}
`;
