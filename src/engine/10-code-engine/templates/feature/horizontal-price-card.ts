export const html = `
<section class="hpc-wrapper">
    <div class="hpc-container">
        
        <!-- 카드 전체 래퍼 -->
        <div class="hpc-card hd-animate-fade-in-up">
            
            <!-- 왼쪽: 텍스트 및 가격 영역 -->
            <div class="hpc-info-side">
                
                <!-- 상단 타이틀 배너 영역 -->
                {{#if microCopy}}
                <div class="hpc-top-banner">
                    {{{microCopy}}}
                </div>
                {{/if microCopy}}

                <div class="hpc-info-content">
                    <!-- 서브 배지 (e.g. BALANCEFUL, DIVE IN) -->
                    {{#if subheadline}}
                    <div class="hpc-series-badge">{{{subheadline}}}</div>
                    {{/if subheadline}}

                    <!-- 메인 상품명 -->
                    <h3 class="hpc-product-name">{{{headline}}}</h3>

                    <!-- 가격 영역 -->
                    <div class="hpc-price-box">
                        <div class="hpc-original-price">
                            <span class="hpc-strike">{{{bullet.0}}}</span>
                            <!-- 할인 화살표 데코 (CSS 혹은 SVG) -->
                            <svg class="hpc-price-arrow" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                        </div>
                        <div class="hpc-discount-wrap">
                            <strong class="hpc-final-price">{{{bullet.1}}}</strong>
                            <span class="hpc-discount-rate">{{{bullet.2}}}</span>
                        </div>
                    </div>

                    <!-- 하단 GIFT 안내 영역 -->
                    {{#if bullet.3}}
                    <div class="hpc-gift-area">
                        <strong>[GIFT]</strong>
                        <p>{{{bullet.3}}}</p>
                    </div>
                    {{/if bullet.3}}
                </div>
            </div>

            <!-- 오른쪽: 이미지 배경 영역 -->
            <div class="hpc-image-side" style="background-color: {{{bullet.4}}};">
                <!-- 메인 제품 이미지 -->
                <img src="{{imageUrl}}" alt="Main Product" class="hpc-main-img" />

                <!-- 둥근 원형의 추가 기프트 이미지 (우측 하단) -->
                {{#if bullet.5}}
                <div class="hpc-circle-gift">
                    <img src="{{bullet.5}}" alt="Gift Product" />
                    <div class="hpc-plus-icon">+</div>
                </div>
                {{/if bullet.5}}
            </div>

        </div>

    </div>
</section>
`;

export const css = `
.hpc-wrapper {
    position: relative;
    width: 100%;
    /* 배경은 약간 채도 낮은 배경색 혹은 화이트 */
    background-color: #f6f8fb; 
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
}

.hpc-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.hpc-card {
    display: flex;
    width: 100%;
    background-color: #fff;
    /* 카드를 둘러싸는 테두리가 있는 디자인 */
    border: 3px solid #7cb342; /* 커스텀하게 바꿀 수 있으나 임의의 브랜드 컬러. */
    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
}

/* 왼쪽 정보 영역 */
.hpc-info-side {
    width: 55%;
    display: flex;
    flex-direction: column;
}

.hpc-top-banner {
    width: 100%;
    background-color: #7cb342; /* 메인 테두리 컬러 맞춤 */
    color: #fff;
    font-size: 1.15rem;
    font-weight: 800;
    padding: 0.8rem 1.5rem;
    letter-spacing: -0.02em;
}

.hpc-info-content {
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
}

.hpc-series-badge {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    border: 1px solid #7cb342;
    border-radius: 20px;
    color: #7cb342;
    font-size: 0.95rem;
    font-weight: 800;
    align-self: flex-start;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
}

.hpc-product-name {
    font-size: 2rem;
    font-weight: 800;
    color: #111;
    line-height: 1.3;
    margin: 0 0 2.5rem 0;
    letter-spacing: -0.03em;
    word-break: keep-all;
}

/* 가격 박스 */
.hpc-price-box {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 3rem;
}

.hpc-original-price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.hpc-strike {
    font-size: 1.4rem;
    font-weight: 500;
    color: #aaa;
    text-decoration: line-through;
}

.hpc-price-arrow {
    width: 24px;
    height: 24px;
    fill: #aaa;
    transform: rotate(-90deg) scale(1.2); /* 우하단 가로 지향일 경우엔 그냥 사용, 레퍼런스는 살짝 꺾음 */
}

.hpc-discount-wrap {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.hpc-final-price {
    font-size: 2.8rem;
    font-weight: 900;
    color: #00334e; /* 다크 네이비 혹은 블랙 */
    letter-spacing: -0.05em;
    line-height: 1;
}

.hpc-discount-rate {
    background-color: #00334e;
    color: #fff;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 1.3rem;
    font-weight: 800;
}

/* 기프트 텍스트 영역 */
.hpc-gift-area {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}
.hpc-gift-area strong {
    font-size: 1.05rem;
    font-weight: 800;
    color: #111;
}
.hpc-gift-area p {
    font-size: 1.05rem;
    color: #444;
    font-weight: 400;
    margin: 0;
    line-height: 1.4;
    word-break: keep-all;
}

/* 오른쪽 배경 이미지 뷰 영역 */
.hpc-image-side {
    width: 45%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    /* 인라인 스타일로 바탕색 지정 */
    /* background-color: #e5f1d8; */
}

.hpc-main-img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지가 배경을 다 덮게끔 처리 (레퍼런스 동일) */
}

/* 좌하단 원형 기프트 사진 */
.hpc-circle-gift {
    position: absolute;
    bottom: -1.5rem;
    left: -2rem; /* 카드를 뚫고 나옴 */
    width: 140px;
    height: 140px;
    background-color: #fff;
    border-radius: 50%;
    /* 다크 네이비 테두리 */
    border: 3px solid #00334e;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    overflow: hidden;
}

.hpc-circle-gift img {
    width: 80%;
    height: 80%;
    object-fit: contain;
}

.hpc-plus-icon {
    position: absolute;
    top: 50%;
    left: -15px; /* 원 바깥 왼쪽 */
    transform: translateY(-50%);
    width: 26px;
    height: 26px;
    background-color: #00334e;
    color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 900;
    line-height: 1;
}


/* 애니메이션 */
.hd-animate-fade-in-up {
    animation: hdc-fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}
@keyframes hdc-fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

/* 모바일 적응 (반드시 세로형으로 변경) */
@media (max-width: 600px) {
    .hpc-wrapper { padding: 4rem 0; }
    
    .hpc-card {
        flex-direction: column;
    }
    
    .hpc-info-side { width: 100%; }
    .hpc-top-banner { font-size: 1rem; text-align: center; }
    .hpc-info-content { padding: 2rem 1.5rem; }
    
    .hpc-product-name { font-size: 1.6rem; margin-bottom: 2rem; }
    
    .hpc-discount-wrap { gap: 0.5rem; }
    .hpc-final-price { font-size: 2.3rem; }
    .hpc-discount-rate { font-size: 1.1rem; }
    
    .hpc-price-box { margin-bottom: 2rem; }
    
    .hpc-image-side { 
        width: 100%; 
        height: 250px; 
    }
    
    .hpc-circle-gift {
        width: 100px;
        height: 100px;
        left: 1rem;
        bottom: 1rem;
    }
    .hpc-plus-icon { display: none; /* 모바일에서는 플러스를 빼거나 안쪽으로 변경. 여기선 생략 */ }
}
`;
