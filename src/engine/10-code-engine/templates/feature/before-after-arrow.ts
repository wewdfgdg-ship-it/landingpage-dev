export const html = `
<section class="ba-wrapper">
    <div class="ba-container">
        
        <!-- 상단 헤더 텍스트 (문제 제기) -->
        <div class="ba-header hc-animate-fade-in-up">
            {{#if subheadline}}
            <p class="ba-subheadline">{{{subheadline}}}</p>
            {{/if subheadline}}
            
            <h2 class="ba-headline">{{{headline}}}</h2>
        </div>

        <!-- Before & After 이미지 비교 영역 -->
        <!-- bullet.0: Before 이미지, bullet.1: After 이미지 -->
        {{#if bullet.1}}
        <div class="ba-compare-box hc-animate-fade-in-up" style="animation-delay: 150ms;">
            
            <!-- 왼쪽: Before -->
            <div class="ba-img-wrapper">
                <img src="{{bullet.0}}" alt="Before" class="ba-img" />
            </div>

            <!-- 중앙: Arrow 오버레이 -->
            <div class="ba-arrow">
                <svg viewBox="0 0 100 100" fill="none">
                    <path d="M10 40 L60 40 L60 20 L90 50 L60 80 L60 60 L10 60 Z" fill="#ff4d79"/>
                </svg>
            </div>

            <!-- 오른쪽: After -->
            <div class="ba-img-wrapper">
                <img src="{{bullet.1}}" alt="After" class="ba-img" />
            </div>

        </div>
        {{/if bullet.1}}

        <!-- 하단 추가 설명 텍스트 -->
        {{#if body}}
        <div class="ba-footer-text hc-animate-fade-in-up" style="animation-delay: 300ms;">
            {{{body}}}
        </div>
        {{/if body}}

    </div>
</section>
`;

export const css = `
.ba-wrapper {
    position: relative;
    width: 100%;
    background-color: #faf5f5; /* 아주 연한 핑크베이지 배경 (뷰티 특화) */
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 6rem 0;
    overflow: hidden;
}

.ba-container {
    width: 100%;
    max-width: 700px; /* 비교 이미지가 너무 거대해지는 것을 방지 */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.ba-header {
    text-align: center;
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.ba-subheadline {
    font-size: 1.6rem;
    font-weight: 500;
    color: #444;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.03em;
}

.ba-headline {
    font-size: 2.2rem;
    font-weight: 800;
    color: #111;
    margin: 0;
    letter-spacing: -0.05em;
    line-height: 1.4;
    word-break: keep-all;
}

/* 텍스트 내 강조 컬러 (ex: 핑크색 글씨 or 형광펜 블록) */
.ba-hl-box {
    background-color: #ff4d79; /* 강렬한 핑크/마젠타 */
    color: #fff;
    padding: 0 0.4rem;
    display: inline-block;
}

/* Before & After 이미지 컨테이너 */
.ba-compare-box {
    display: flex;
    width: 100%;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.08); /* 그림자로 덩어리감 줌 */
    margin-bottom: 3rem;
}

.ba-img-wrapper {
    flex: 1;
    position: relative;
    /* aspect-ratio를 부여하여 두 이미지가 정방형 혹은 특정 비율로 맞춰지도록 유도할 수도 있음 */
    aspect-ratio: 1 / 1; 
    overflow: hidden;
    background-color: #eee;
}

.ba-img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지가 영역을 가득 채움 */
    display: block;
}

/* 두 이미지 사이에 걸쳐있는 핑크색 화살표 */
.ba-arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    z-index: 10;
    /* 화살표 자체에 살짝 흰 테두리를 줘서 스킨톤에서 분리되게 (가독성 향상) */
    filter: drop-shadow(0 0 5px rgba(255,255,255,0.8));
    animation: ba-pulse 2s infinite;
}

@keyframes ba-pulse {
    0% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-45%, -50%) scale(1.05); } /* 화살표가 살짝 앞으로 나가는 느낌 */
    100% { transform: translate(-50%, -50%) scale(1); }
}

.ba-footer-text {
    text-align: center;
    font-size: 1.6rem;
    font-weight: 700;
    color: #333;
    line-height: 1.5;
    letter-spacing: -0.04em;
}

.ba-footer-hl {
    color: #ff4d79; /* 하단 핑크 글씨 강조 */
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

@media (max-width: 600px) {
    .ba-wrapper { padding: 4rem 0; }
    .ba-subheadline { font-size: 1.2rem; }
    .ba-headline { font-size: 1.7rem; }
    
    .ba-arrow { width: 45px; height: 45px; }
    .ba-footer-text { font-size: 1.3rem; }
}
`;
