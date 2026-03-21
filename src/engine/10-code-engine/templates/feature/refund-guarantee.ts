export const html = `
<section class="rg-wrapper">
    <!-- 상단 헤더 배너 형태 (아래로 뾰족한 화살표) -->
    <div class="rg-top-banner">
        <h2 class="rg-top-text">{{{microCopy}}}</h2>
        <div class="rg-arrow-down"></div>
    </div>

    <div class="rg-container">
        
        <!-- 중앙 엠블럼/타이포그래피 아트 영역 -->
        <div class="rg-emblem-area hc-animate-fade-in-up">
            
            <!-- 되돌아가는 화살표 원형 -->
            <div class="rg-circle-arrow">
                <svg viewBox="0 0 100 100" class="rg-svg-arrow">
                    <path d="M50 5 A45 45 0 1 1 5 50" fill="none" stroke="#689bf9" stroke-width="3" stroke-linecap="round" />
                    <polygon points="5,50 0,40 10,40" fill="#689bf9" />
                </svg>
            </div>

            <!-- 중앙 거대 텍스트 -->
            <div class="rg-center-content">
                <div class="rg-huge-number">
                    {{{headline}}}
                </div>
                <h3 class="rg-emblem-label">{{{subheadline}}}</h3>
            </div>

            <!-- 데코레이션 이미지 (돈주머니, 코인 등. 이미지URL이 있으면 사용, 없으면 CSS 장식) -->
            {{#if imageUrl}}
            <img src="{{imageUrl}}" alt="Refund Guarantee" class="rg-deco-img" />
            {{/if imageUrl}}

            <!-- 플로팅 코인 장식들 -->
            <div class="rg-coin rg-coin-1"></div>
            <div class="rg-coin rg-coin-2"></div>
            <div class="rg-coin rg-coin-3"></div>

        </div>

        <!-- 하단 본문 내용 -->
        <div class="rg-body-area hc-animate-fade-in-up" style="animation-delay: 200ms;">
            {{#if bullet.0}}
            <p class="rg-desc">{{{bullet.0}}}</p>
            {{/if bullet.0}}
            
            {{#if body}}
            <div class="rg-body-text">
                {{{body}}}
            </div>
            {{/if body}}
        </div>

    </div>
</section>
`;

export const css = `
.rg-wrapper {
    position: relative;
    width: 100%;
    background-color: #ffffff;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 8rem;
    overflow: hidden;
}

/* 상단 블루 헤더 배너 */
.rg-top-banner {
    width: 100%;
    background-color: #3b76f6; /* 레퍼런스의 메인 블루 */
    text-align: center;
    padding: 3.5rem 1rem;
    position: relative;
    z-index: 10;
}

.rg-top-text {
    font-size: 2.8rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    line-height: 1.3;
    letter-spacing: -0.05em;
    word-break: keep-all;
}

/* 아래로 뾰족한 화살표 */
.rg-arrow-down {
    position: absolute;
    bottom: -30px; /* 화살표 높이만큼 아래로 */
    left: 50%;
    transform: translateX(-50%);
    width: 0; 
    height: 0; 
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-top: 30px solid #3b76f6;
}

.rg-container {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
    margin-top: 5rem;
}

/* 엠블럼 영역 */
.rg-emblem-area {
    position: relative;
    width: 100%;
    max-width: 400px;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 4rem;
}

/* SVG 원형 화살표 */
.rg-circle-arrow {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
}
.rg-svg-arrow {
    width: 100%; height: 100%;
    transform: rotate(45deg); /* 회전시켜 모양 맞춤 */
}

/* 중앙 텍스트 */
.rg-center-content {
    text-align: center;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: -10%;
}

.rg-huge-number {
    font-size: 8rem;
    font-weight: 900;
    color: #3b76f6;
    line-height: 1;
    letter-spacing: -0.05em;
    /* 약간의 그림자 추가 */
    text-shadow: 2px 2px 0 #d9e6ff, -2px -2px 0 #d9e6ff, 2px -2px 0 #d9e6ff, -2px 2px 0 #d9e6ff, 5px 5px 15px rgba(59,118,246,0.3);
}

.rg-emblem-label {
    font-size: 2rem;
    font-weight: 800;
    color: #3b76f6;
    margin: 0;
    letter-spacing: -0.05em;
}

/* 우측 하단 3D 이미지 데코레이션 */
.rg-deco-img {
    position: absolute;
    bottom: -10%;
    right: -15%;
    width: 60%;
    max-width: 250px;
    z-index: 15;
    /* 떠다니는 애니메이션 */
    animation: rg-float 3s ease-in-out infinite alternate;
}

/* 플로팅 코인 효과 (CSS만으로 구현) */
.rg-coin {
    position: absolute;
    width: 40px; height: 40px;
    background: radial-gradient(circle, #ffe175 0%, #dfa521 100%);
    border-radius: 50%;
    box-shadow: inset -2px -4px 6px rgba(0,0,0,0.2), 0 5px 10px rgba(0,0,0,0.1);
    z-index: 14;
    border: 2px solid #ffeba1;
}
.rg-coin::after {
    content: '₩';
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    color: #c98e0e; font-weight: bold; font-size: 1.2rem;
}
.rg-coin-1 { top: 10%; left: -5%; animation: rg-spin-float 4s linear infinite; }
.rg-coin-2 { top: -5%; right: 10%; width: 50px; height: 50px; animation: rg-spin-float 5s linear infinite reverse; }
.rg-coin-3 { bottom: 20%; left: -15%; animation: rg-spin-float 3.5s linear infinite; }

@keyframes rg-float {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-15px); }
}

@keyframes rg-spin-float {
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(180deg); }
    100% { transform: translateY(0) rotate(360deg); }
}

/* 하단 텍스트 영역 */
.rg-body-area {
    text-align: center;
    width: 100%;
}

.rg-desc {
    font-size: 1.2rem;
    color: #888;
    margin: 0 0 1rem 0;
    font-weight: 500;
}

.rg-body-text {
    font-size: 2.2rem;
    font-weight: 800;
    color: #222;
    line-height: 1.4;
    margin: 0;
    word-break: keep-all;
}

/* 강조 텍스트 커스텀 - 파란색 하이라이트 배경 (레퍼런스 스타일) */
.rg-body-text strong {
    background-color: #3b76f6;
    color: #fff;
    padding: 0 0.5rem;
    display: inline-block;
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
    .rg-top-banner { padding: 2.5rem 1rem; }
    .rg-top-text { font-size: 2rem; }
    
    .rg-arrow-down {
        border-left: 25px solid transparent;
        border-right: 25px solid transparent;
        border-top: 20px solid #3b76f6;
        bottom: -20px;
    }
    
    .rg-emblem-area { max-width: 250px; margin-bottom: 3rem; margin-top: 2rem;}
    .rg-huge-number { font-size: 5.5rem; }
    .rg-emblem-label { font-size: 1.5rem; }
    
    .rg-deco-img { width: 70%; right: -25%; }
    .rg-coin-1, .rg-coin-2, .rg-coin-3 { transform: scale(0.7); }
    
    .rg-desc { font-size: 1rem; }
    .rg-body-text { font-size: 1.6rem; }
}
`;
