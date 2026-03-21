export const html = `
<section class="sp-wrapper">
    <div class="sp-container">
        
        <!-- 헤더: 신뢰감을 주는 타이틀 영역 -->
        <div class="sp-header hc-animate-fade-in-up">
            <h2 class="sp-headline">{{{headline}}}</h2>
            {{#if body}}
            <div class="sp-subtext">{{{body}}}</div>
            {{/if body}}
        </div>

        <!-- 중앙 이미지와 양옆 스탯 -->
        <div class="sp-visual-section">
            
            <div class="sp-image-box hc-animate-fade-in-up" style="animation-delay: 200ms;">
                <img src="{{imageUrl}}" alt="Proof Image" class="sp-main-img" />
            </div>

            <!-- 스탯 레이블들: bullet.0 ~ bullet.7 사용 (총 4개, 각각 라벨+결과치) -->
            {{#if bullet.1}}
            <div class="sp-stat sp-stat-top-left hc-animate-fade-in-up" style="animation-delay: 300ms;">
                <p class="sp-stat-label">{{{bullet.0}}}</p>
                <p class="sp-stat-value">{{{bullet.1}}}</p>
            </div>
            {{/if bullet.1}}

            {{#if bullet.3}}
            <div class="sp-stat sp-stat-bottom-left hc-animate-fade-in-up" style="animation-delay: 400ms;">
                <p class="sp-stat-label">{{{bullet.2}}}</p>
                <p class="sp-stat-value">{{{bullet.3}}}</p>
            </div>
            {{/if bullet.3}}

            {{#if bullet.5}}
            <div class="sp-stat sp-stat-top-right hc-animate-fade-in-up" style="animation-delay: 500ms;">
                <p class="sp-stat-label">{{{bullet.4}}}</p>
                <p class="sp-stat-value">{{{bullet.5}}}</p>
            </div>
            {{/if bullet.5}}

            {{#if bullet.7}}
            <div class="sp-stat sp-stat-bottom-right hc-animate-fade-in-up" style="animation-delay: 600ms;">
                <p class="sp-stat-label">{{{bullet.6}}}</p>
                <p class="sp-stat-value">{{{bullet.7}}}</p>
            </div>
            {{/if bullet.7}}

        </div>

    </div>
</section>
`;

export const css = `
.sp-wrapper {
    position: relative;
    width: 100%;
    /* 깔끔하고 전문적인 흰색~아주 연한 푸른빛 배경 */
    background: linear-gradient(to bottom, #fcfcfd 0%, #f4f5f8 100%);
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
}

.sp-container {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.sp-header {
    text-align: center;
    margin-bottom: 4rem;
}

.sp-headline {
    font-size: 3.5rem;
    font-weight: 800;
    color: #111;
    margin: 0 0 1rem 0;
    line-height: 1.3;
    letter-spacing: -0.05em;
    word-break: keep-all;
}

/* 텍스트 내 강조 컬러 (ex: 민트그린/에메랄드색) */
.sp-hl-color {
    color: #2dbfa4; /* 레퍼런스(콜라겐) 특유의 상쾌하고 신뢰감 주는 에메랄드 그린 */
}

/* 하단의 작은 안내 문구들 (*원료적 특성에 한함 등) */
.sp-subtext {
    font-size: 0.95rem;
    font-weight: 400;
    color: #888;
    line-height: 1.6;
    letter-spacing: -0.02em;
    margin-top: 1.5rem;
}

/* 비주얼과 스탯이 감싸고 있는 래퍼 */
.sp-visual-section {
    position: relative;
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sp-image-box {
    position: relative;
    width: 70%;
    max-width: 500px;
    z-index: 10; /* 스탯 텍스트보다 살짝 안쪽에 위치, 혹은 같게 */
}

.sp-main-img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
    /* 모델 사진이 배경과 스무스하게 섞이거나 깔끔하게 보이도록 조치 */
}

/* 스탯 공통 디자인 */
.sp-stat {
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 20;
    text-align: center;
}

.sp-stat-label {
    font-size: 1.2rem;
    font-weight: 700;
    color: #222;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.03em;
    word-break: keep-all;
}

.sp-stat-value {
    font-size: 3rem;
    font-weight: 900;
    color: #2dbfa4; /* 강조색 통일 */
    margin: 0;
    letter-spacing: -0.05em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
}

/* 화살표 아이콘 커스텀용 */
.sp-stat-value svg {
    width: 28px;
    height: 28px;
    fill: #2dbfa4;
}

/* 위치 조정 (데스크탑 기준) */
.sp-stat-top-left {
    top: 25%;
    left: -10%;
    text-align: right;
    align-items: flex-end;
}
.sp-stat-bottom-left {
    bottom: 25%;
    left: -5%;
    text-align: right;
    align-items: flex-end;
}
.sp-stat-top-right {
    top: 25%;
    right: -10%;
    text-align: left;
    align-items: flex-start;
}
.sp-stat-bottom-right {
    bottom: 25%;
    right: -5%;
    text-align: left;
    align-items: flex-start;
}

/* 애니메이션 */
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
    .sp-stat-top-left { left: 0; }
    .sp-stat-top-right { right: 0; }
    .sp-stat-bottom-left { bottom: 15%; left: 0%; }
    .sp-stat-bottom-right { bottom: 15%; right: 0%; }
    .sp-stat-label { font-size: 1.1rem; }
    .sp-stat-value { font-size: 2.3rem; }
    .sp-stat-value svg { width: 22px; height: 22px; }
}

@media (max-width: 600px) {
    .sp-wrapper { padding: 5rem 0; }
    .sp-headline { font-size: 2.3rem; }
    .sp-subtext { font-size: 0.8rem; }
    
    .sp-visual-section { flex-direction: column; }
    .sp-image-box { width: 100%; margin-bottom: 2rem; }
    
    /* 모바일에서는 스탯들을 사진 위 공중에 띄우지 않고 아래로 2x2 그리드로 깔끔하게 정리 */
    .sp-stat { position: static; text-align: center !important; align-items: center !important; margin-bottom: 2rem; }
    
    .sp-visual-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 
            "img img"
            "t-left t-right"
            "b-left b-right";
        gap: 1rem;
    }
    
    .sp-image-box { grid-area: img; }
    .sp-stat-top-left { grid-area: t-left; }
    .sp-stat-top-right { grid-area: t-right; }
    .sp-stat-bottom-left { grid-area: b-left; margin-bottom:0;}
    .sp-stat-bottom-right { grid-area: b-right; margin-bottom:0;}
    
    .sp-stat-label { font-size: 1rem; }
    .sp-stat-value { font-size: 2rem; }
}
`;
