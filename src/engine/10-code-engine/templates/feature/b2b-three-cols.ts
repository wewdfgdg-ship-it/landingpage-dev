export const html = `
<section class="btc-wrapper">
    <div class="btc-container">
        
        <!-- Header -->
        <div class="btc-header hc-animate-fade-in-up">
            <h2 class="btc-headline">{{{headline}}}</h2>
            
            {{#if subheadline}}
            <p class="btc-subheadline">{{{subheadline}}}</p>
            {{/if subheadline}}
        </div>

        <!-- 3-Column Grid -->
        <div class="btc-grid">
            
            <!-- Column 1 -->
            {{#if bullet.1}}
            <div class="btc-col hc-animate-fade-in-up" style="animation-delay: 100ms;">
                <div class="btc-img-box">
                    {{{bullet.0}}}
                </div>
                <h3 class="btc-title">{{{bullet.1}}}</h3>
                <p class="btc-desc">{{{bullet.2}}}</p>
            </div>
            {{/if bullet.1}}

            <!-- Column 2 -->
            {{#if bullet.4}}
            <div class="btc-col hc-animate-fade-in-up" style="animation-delay: 200ms;">
                <div class="btc-img-box">
                    {{{bullet.3}}}
                </div>
                <h3 class="btc-title">{{{bullet.4}}}</h3>
                <p class="btc-desc">{{{bullet.5}}}</p>
            </div>
            {{/if bullet.4}}

            <!-- Column 3 -->
            {{#if bullet.7}}
            <div class="btc-col hc-animate-fade-in-up" style="animation-delay: 300ms;">
                <div class="btc-img-box">
                    {{{bullet.6}}}
                </div>
                <h3 class="btc-title">{{{bullet.7}}}</h3>
                <p class="btc-desc">{{{bullet.8}}}</p>
            </div>
            {{/if bullet.7}}
            
        </div>
        
    </div>
</section>
`;

export const css = `
.btc-wrapper {
    position: relative;
    width: 100%;
    background-color: #f7f5f2; /* 살짝 웜톤 도는 밝은 베이지/그레이 배경 (트렌디한 SaaS/IT 느낌) */
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 6rem 0 8rem 0;
}

.btc-container {
    width: 100%;
    max-width: 1140px; /* 3열 그리드가 안정적으로 보이는 폭 */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.btc-header {
    text-align: center;
    margin-bottom: 4rem;
    max-width: 800px;
}

.btc-headline {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    letter-spacing: -0.03em;
    line-height: 1.3;
}

.btc-subheadline {
    font-size: 1.15rem;
    font-weight: 400;
    color: #555555;
    line-height: 1.6;
    margin: 0;
    letter-spacing: -0.02em;
    word-break: keep-all;
}

/* 텍스트 내 강조될 밑줄 링크 스타일 (옵션) */
.btc-link-text {
    color: #1a1a1a;
    text-decoration: underline;
    text-decoration-color: #b0b0b0;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
}

.btc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    width: 100%;
}

.btc-col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
}

/* 이미지 및 일러스트가 들어가는 옅은 박스 */
.btc-img-box {
    width: 100%;
    aspect-ratio: 1 / 1; /* 깔끔한 1:1 정방형 박스 구조 */
    background-color: #ededed; /* 레퍼런스 특유의 웜그레이 톤 이미지 배경 */
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    /* 모서리 없음 (각진 박스) */
    transition: transform 0.3s ease;
}

.btc-col:hover .btc-img-box {
    transform: translateY(-5px); /* 마우스 올렸을 때 살짝 들리기 */
}

/* 새로 추가: SVG 일러스트가 들어갈 때의 비율/정렬 */
.btc-img-box svg {
    width: 60%;
    height: 60%;
}

.btc-img {
    width: 80%;
    height: 80%;
    object-fit: contain; /* 외부 이미지가 들어올 경우를 대비한 렌더링 */
}

.btc-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #222222;
    margin: 0 0 0.8rem 0;
    letter-spacing: -0.03em;
}

.btc-desc {
    font-size: 0.95rem;
    font-weight: 400;
    color: #555555;
    line-height: 1.6;
    margin: 0;
    letter-spacing: -0.02em;
    word-break: keep-all;
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

@media (max-width: 900px) {
    .btc-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
}

@media (max-width: 600px) {
    .btc-wrapper { padding: 4rem 0 5rem 0; }
    .btc-headline { font-size: 2rem; }
    .btc-subheadline { font-size: 1rem; }
    .btc-grid { grid-template-columns: 1fr; gap: 3rem; }
    
    .btc-col { align-items: center; text-align: center; }
    .btc-img-box {
        width: 100%;
        max-width: 400px;
        aspect-ratio: 4 / 3; /* 모바일에서는 살짝 직사각형으로 */
    }
}
`;
