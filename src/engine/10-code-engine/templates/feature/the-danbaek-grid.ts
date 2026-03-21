export const html = `
<section class="td-wrapper">
    <div class="td-container">
        <!-- Header -->
        <div class="td-header hc-animate-fade-in-up">
            {{#if microCopy}}
            <div class="td-brand">{{{microCopy}}}</div>
            {{/if microCopy}}
            
            <h2 class="td-headline">{{{headline}}}</h2>
        </div>

        <!-- Grid Board -->
        <div class="td-board hc-animate-fade-in-up" style="animation-delay: 200ms;">
            <div class="td-grid">
                
                <!-- Item 1 -->
                <div class="td-item">
                    {{#if bullet.0}}
                    <div class="td-icon-wrap">{{{bullet.0}}}</div>
                    {{/if bullet.0}}
                    <div class="td-text-wrap">{{{bullet.1}}}</div>
                </div>
                
                <!-- Item 2 -->
                <div class="td-item">
                    {{#if bullet.2}}
                    <div class="td-icon-wrap">{{{bullet.2}}}</div>
                    {{/if bullet.2}}
                    <div class="td-text-wrap">{{{bullet.3}}}</div>
                </div>

                <!-- Item 3 -->
                <div class="td-item">
                    {{#if bullet.4}}
                    <div class="td-icon-wrap">{{{bullet.4}}}</div>
                    {{/if bullet.4}}
                    <div class="td-text-wrap">{{{bullet.5}}}</div>
                </div>

                <!-- Item 4 -->
                <div class="td-item">
                    {{#if bullet.6}}
                    <div class="td-icon-wrap">{{{bullet.6}}}</div>
                    {{/if bullet.6}}
                    <div class="td-text-wrap">{{{bullet.7}}}</div>
                </div>
                
            </div>
        </div>

        <!-- Bottom Decoration Image -->
        {{#if imageUrl}}
        <img src="{{imageUrl}}" class="td-deco-img" alt="Decoration" />
        {{/if imageUrl}}
        
    </div>
</section>
`;

export const css = `
.td-wrapper {
    position: relative;
    width: 100%;
    background-color: #f7eed8; /* 약간 더 노란기운의 베이지 */
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    overflow: hidden;
    padding: 6rem 0 8rem 0; /* 본문 섹션답게 화면 안에 쏙 들어오는 패딩 */
}

/* 앰버/베이지 배경 오버레이 (상단이 밝음) */
.td-wrapper::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
}

.td-container {
    width: 100%;
    max-width: 1280px; /* 데스크탑 와이드 */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
}

.td-header {
    text-align: center;
    margin-bottom: 3rem;
    z-index: 10;
}

.td-brand {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.8rem;
    font-weight: 800;
    color: #403028; /* 아주 짙은 브라운 */
    margin-bottom: 1rem;
    letter-spacing: -0.04em;
}

.td-brand svg {
    width: 36px;
    height: 36px;
    margin-top: 2px;
}

.td-headline {
    font-size: 3rem;
    font-weight: 850;
    color: #403028;
    line-height: 1.4;
    letter-spacing: -0.03em;
    margin: 0;
}

/* '물론' 파란색 하이라이트 공통 유틸리티 */
.td-hl-blue {
    color: #1793d1; /* 레퍼런스의 청량한 블루 */
    position: relative;
    display: inline-block;
    padding-bottom: 3px;
}
.td-hl-blue::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #1793d1;
}

/* 글자 위에 찍히는 강조 점 (Dot) */
.td-dot {
    position: relative;
}
.td-dot::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background-color: #1793d1;
    border-radius: 50%;
}

/* 2x2 흰색 그리드 보드 */
.td-board {
    width: 90%;
    max-width: 760px; /* 원본 레퍼런스 가로비율 유지 */
    background-color: #ffffff;
    box-shadow: 0 10px 40px rgba(64, 48, 40, 0.05);
    position: relative;
    z-index: 10;
    /* 내부 여백과 경계선을 한 번에 그리는 트릭 */
    padding: 10px;
}

.td-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: #dddddd; /* 이것이 경계선(Cross Line) 색상이 됨 */
    gap: 1px; /* 아이템 사이 1px의 틈을 만들면 경계선이 생김 */
    border: 15px solid #ffffff; /* 흰색 보드 가장자리 여백 */
}

.td-item {
    background-color: #ffffff;
    padding: 4rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    text-align: center;
}

.td-icon-wrap {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    /* 일관된 아이콘 크기 제어 */
    width: 90px;
    height: 90px;
}
.td-icon-wrap svg {
    max-width: 100%;
    max-height: 100%;
}

.td-text-wrap {
    font-size: 1.05rem;
    font-weight: 500;
    color: #444;
    line-height: 1.5;
    letter-spacing: -0.04em;
    word-break: keep-all;
}

/* 텍스트 스타일링 클래스들 (Copy에서 주입됨) */
.td-strong {
    display: block;
    font-size: 1.35rem;
    font-weight: 900;
    color: #222;
    margin: 0.6rem 0;
    line-height: 1.35;
}

.td-small {
    display: block;
    font-size: 0.95rem;
    font-weight: 500;
    color: #888;
    margin-top: 0.3rem;
}

.td-list {
    display: block;
    font-size: 0.95rem;
    font-weight: 500;
    color: #555;
    text-align: center;
    margin-top: 1rem;
    line-height: 1.6;
}

/* 우측 하단 꾸밈 이미지 */
.td-deco-img {
    position: absolute;
    right: 5%;
    bottom: -150px;
    width: 450px;
    object-fit: contain;
    z-index: 15;
    pointer-events: none;
    filter: drop-shadow(0 20px 25px rgba(0,0,0,0.15));
}

@media (max-width: 768px) {
    .td-wrapper { padding: 4rem 0 5rem 0; }
    .td-headline { font-size: 2rem; }
    .td-brand { font-size: 1.5rem; margin-bottom: 1rem; }
    
    .td-board { padding: 5px; }
    .td-grid { grid-template-columns: 1fr; border-width: 5px; }
    .td-item { padding: 3rem 1.5rem; }
    
    .td-deco-img {
        width: 250px;
        right: -20px;
        bottom: -50px;
        opacity: 0.8;
    }
}
`;
