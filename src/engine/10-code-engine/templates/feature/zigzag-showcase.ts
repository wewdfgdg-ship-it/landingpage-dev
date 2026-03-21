export const html = `
<section class="zz-wrapper">
    <div class="zz-top-line"></div>
    <div class="zz-container">
        
        <!-- Header -->
        <div class="zz-header hc-animate-fade-in-up">
            {{#if subheadline}}
            <div class="zz-subheadline">{{{subheadline}}}</div>
            {{/if subheadline}}
            
            <h2 class="zz-headline">{{{headline}}}</h2>
        </div>

        <!-- Zigzag Features -->
        <div class="zz-list">
            
            <!-- Item 1 (Image Right) -->
            {{#if bullet.1}}
            <div class="zz-row zz-row-right hc-animate-fade-in-up" style="animation-delay: 100ms;">
                <div class="zz-text-col">
                    <div class="zz-bg-text">{{{bullet.0}}}</div>
                    <h3 class="zz-title">{{{bullet.1}}}</h3>
                    <p class="zz-desc">{{{bullet.2}}}</p>
                </div>
                <div class="zz-img-col">
                    <div class="zz-img-bg zz-bg-mint-light"></div>
                    <img src="{{{bullet.3}}}" alt="Feature 1" class="zz-img" />
                </div>
            </div>
            {{/if bullet.1}}

            <!-- Item 2 (Image Left / Text Right) -->
            {{#if bullet.5}}
            <div class="zz-row zz-row-left hc-animate-fade-in-up" style="animation-delay: 200ms;">
                <div class="zz-img-col">
                    <div class="zz-img-bg zz-bg-pink-light"></div>
                    <img src="{{{bullet.7}}}" alt="Feature 2" class="zz-img" />
                </div>
                <div class="zz-text-col">
                    <div class="zz-bg-text">{{{bullet.4}}}</div>
                    <h3 class="zz-title">{{{bullet.5}}}</h3>
                    <p class="zz-desc">{{{bullet.6}}}</p>
                </div>
            </div>
            {{/if bullet.5}}

            <!-- Item 3 (Image Right) -->
            {{#if bullet.9}}
            <div class="zz-row zz-row-right hc-animate-fade-in-up" style="animation-delay: 300ms;">
                <div class="zz-text-col">
                    <div class="zz-bg-text">{{{bullet.8}}}</div>
                    <h3 class="zz-title">{{{bullet.9}}}</h3>
                    <p class="zz-desc">{{{bullet.10}}}</p>
                </div>
                <div class="zz-img-col">
                    <div class="zz-img-bg zz-bg-blue-light"></div>
                    <img src="{{{bullet.11}}}" alt="Feature 3" class="zz-img" />
                </div>
            </div>
            {{/if bullet.9}}

        </div>
    </div>
</section>
`;

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600;1,700&display=swap');

.zz-wrapper {
    position: relative;
    width: 100%;
    background-color: #ffffff;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    overflow: hidden;
    padding: 0 0 6rem 0;
}

/* 상단 연결선 (레퍼런스 위에 있는 세로 선) */
.zz-top-line {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 60px;
    background-color: #333333;
}

.zz-container {
    width: 100%;
    max-width: 1000px; /* 지그재그가 너무 늘어지지 않게 고정 */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 100px 5% 0 5%;
}

.zz-header {
    text-align: center;
    margin-bottom: 5rem;
    width: 100%;
}

.zz-subheadline {
    font-size: 1.4rem;
    font-weight: 400;
    color: #111111;
    margin-bottom: 0.8rem;
    letter-spacing: -0.05em;
}

.zz-headline {
    font-size: 3rem;
    font-weight: 800;
    color: #000000;
    margin: 0;
    letter-spacing: -0.03em;
    line-height: 1.2;
}

/* 폰트 강조 효과 (Playfair Display, 이탤릭체) */
.zz-hl-eng {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-weight: 700;
    font-size: 3.5rem;
    margin-left: 0.5rem;
    display: inline-block;
    vertical-align: bottom;
}

.zz-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4rem;
}

.zz-row {
    display: flex;
    align-items: stretch;
    width: 100%;
    position: relative;
    min-height: 280px;
}

.zz-row-right { flex-direction: row; }
.zz-row-left { flex-direction: row; } /* 데스크탑에선 명시적 순서(Flex)나 HTML 구조로 좌우 배치 */

.zz-text-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    padding: 2rem;
    z-index: 10;
}

/* 텍스트 뒤에 깔리는 거대한 연한 영문 (Ash white, Baby pink 등) */
.zz-bg-text {
    position: absolute;
    top: -10px;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-weight: 700;
    font-size: 5rem;
    color: rgba(0, 0, 0, 0.04);
    white-space: nowrap;
    z-index: -1;
    letter-spacing: -0.02em;
}

/* 왼쪽 텍스트면 텍스트 왼쪽 정렬, 배경 텍스트는 좌측 끝. */
.zz-row-right .zz-text-col, .zz-row-right .zz-bg-text { text-align: left; left: 0; }
/* 오른쪽 텍스트면 텍스트 왼쪽 정렬(또는 상황따라), 배경 텍스트 위치 조절 */
.zz-row-left .zz-text-col { text-align: left; padding-left: 3rem; }
.zz-row-left .zz-bg-text { left: 3rem; }


.zz-title {
    font-size: 1.8rem;
    font-weight: 800;
    color: #222222;
    margin-bottom: 1.2rem;
    letter-spacing: -0.03em;
}

.zz-desc {
    font-size: 1.15rem;
    font-weight: 400;
    color: #444444;
    line-height: 1.6;
    letter-spacing: -0.04em;
    word-break: keep-all;
}

/* 이미지가 들어가는 반원형 배경 구역 */
.zz-img-col {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.zz-img-bg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 120%; /* 영역 밖으로 벗어나게 */
    height: 100%;
    border-radius: 500px; /* 거대한 타원/반원 효과 */
    z-index: 1;
}

/* 방향에 따라 늘어나는 방향 고정 */
.zz-row-right .zz-img-bg { right: -50px; }
.zz-row-left .zz-img-bg { left: -50px; }

/* 컬러스왑 배경 */
.zz-bg-mint-light { background-color: #e5f1f1; }
.zz-bg-pink-light { background-color: #fce8eb; }
.zz-bg-blue-light { background-color: #e2f1f2; }

.zz-img {
    position: relative;
    z-index: 5;
    width: 90%;
    max-width: 400px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(15px 15px 25px rgba(0,0,0,0.15));
    transform: translateY(10px) translateX(-10px); /* 약간의 여백 띄우기 용도 */
}

/* 왼쪽 이미지 일 때 반대쪽으로 그림자가 지는 자연스러움 (옵션) */
.zz-row-left .zz-img { transform: translateY(10px) translateX(10px); }

.hc-animate-fade-in-up {
    animation: hc-fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}
@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(40px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 768px) {
    .zz-wrapper { padding-bottom: 4rem; }
    .zz-container { padding-top: 60px; }
    .zz-subheadline { font-size: 1.1rem; }
    .zz-headline { font-size: 2.2rem; }
    .zz-hl-eng { font-size: 2.5rem; }
    
    .zz-list { gap: 3rem; }
    
    /* 모바일에서는 모두 위아래 배치 (이미지가 위, 텍스트가 아래) */
    .zz-row { flex-direction: column !important; min-height: auto; text-align: center; }
    
    .zz-img-col { height: 250px; margin-bottom: 2rem; }
    .zz-img-bg { 
        width: 150vw; /* 모바일에서 좌우 가득차는 타원 */
        height: 100%; 
        left: 50% !important; 
        right: auto !important;
        transform: translate(-50%, -50%); 
    }
    .zz-img { width: 80%; transform: none !important; }
    
    .zz-text-col { padding: 0 1rem; text-align: center !important; }
    .zz-bg-text { 
        font-size: 3.5rem; 
        left: 50% !important; 
        transform: translateX(-50%); 
        top: -30px; 
    }
}
`;
