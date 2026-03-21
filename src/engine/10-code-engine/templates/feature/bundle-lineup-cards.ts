export const html = `
<section class="blc-wrapper">
    <div class="blc-container">
        
        <!-- 상단 타이틀 영역 -->
        <div class="blc-header hc-animate-fade-in-up">
            <!-- 가장 상단 배지 형태 (공식몰에서도 만나보세요) -->
            {{#if microCopy}}
            <div class="blc-top-badge">{{{microCopy}}}</div>
            {{/if microCopy}}
            
            <h2 class="blc-headline">{{{headline}}}</h2>
        </div>

        <!-- 번들/세트 카드 리스트 -->
        <div class="blc-card-list">
            
            <!-- 첫번째 카드 -->
            <div class="blc-card hc-animate-fade-in-up" style="animation-delay: 100ms;">
                <div class="blc-img-box">
                    <img src="{{imageUrl}}" alt="Product 1" />
                </div>
                <div class="blc-info-box">
                    <span class="blc-tag">{{{bullet.0}}}</span>
                    <p class="blc-desc">{{{bullet.1}}}</p>
                    <h3 class="blc-title">{{{bullet.2}}}</h3>
                    <div class="blc-price-wrap">
                        <div class="blc-price-text">
                            <span class="blc-original">
                                <span class="blc-label">정상가</span>
                                <span class="blc-strike">{{{bullet.3}}}</span>
                            </span>
                            <span class="blc-discount">
                                <span class="blc-label blc-label-point">할인가</span>
                                <strong>{{{bullet.4}}}</strong>
                            </span>
                        </div>
                        <div class="blc-percent">
                            {{{bullet.5}}}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 두번째 카드 (옵션) -->
            {{#if bullet.6}}
            <div class="blc-card hc-animate-fade-in-up" style="animation-delay: 200ms;">
                <div class="blc-img-box">
                    <img src="{{bullet.12}}" alt="Product 2" /> <!-- option 이미지로 활용 -->
                </div>
                <div class="blc-info-box">
                    <span class="blc-tag">{{{bullet.6}}}</span>
                    <p class="blc-desc">{{{bullet.7}}}</p>
                    <h3 class="blc-title">{{{bullet.8}}}</h3>
                    <div class="blc-price-wrap">
                        <div class="blc-price-text">
                            <span class="blc-original">
                                <span class="blc-label">정상가</span>
                                <span class="blc-strike">{{{bullet.9}}}</span>
                            </span>
                            <span class="blc-discount">
                                <span class="blc-label blc-label-point">할인가</span>
                                <strong>{{{bullet.10}}}</strong>
                            </span>
                        </div>
                        <div class="blc-percent">
                            {{{bullet.11}}}
                        </div>
                    </div>
                </div>
            </div>
            {{/if bullet.6}}

        </div>

    </div>
</section>
`;

export const css = `
.blc-wrapper {
    position: relative;
    width: 100%;
    /* 레퍼런스 스타일: 은은한 살구/피치톤 그라데이션 베이스 */
    background: linear-gradient(135deg, #fffcfb 0%, #fff0e8 100%);
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
}

.blc-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.blc-header {
    text-align: center;
    margin-bottom: 3.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 상단 둥근 배지 ("공식몰에서도 만나보세요!") */
.blc-top-badge {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    border: 1px solid #ffbcb2;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #ff7f6b;
    margin-bottom: 2rem;
    background-color: #fff;
}

.blc-headline {
    font-size: 3.5rem;
    font-weight: 900;
    color: #ff8c7a; /* 메인 피치/오렌지 포인트 컬러 */
    margin: 0;
    letter-spacing: -0.05em;
    word-break: keep-all;
    /* 약간의 그라데이션 텍스트 처리 */
    background: linear-gradient(to right, #ff8c7a, #f7bda2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.blc-card-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* 가로형 카드 디자인 */
.blc-card {
    width: 100%;
    background-color: #fff;
    border: 2px solid #ffdec8;
    border-radius: 12px;
    display: flex;
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(0,0,0,0.03);
    transition: transform 0.2s;
}

.blc-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.06);
}

/* 왼쪽 이미지 영역 */
.blc-img-box {
    width: 35%;
    min-width: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background-color: #fafafa;
}
.blc-img-box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* 오른쪽 정보 영역 */
.blc-info-box {
    width: 65%;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* "6 COLORS" 등 컬러/태그 배지 */
.blc-tag {
    display: inline-block;
    padding: 0.3rem 1rem;
    border: 1px solid #ff8c7a;
    border-radius: 20px;
    color: #ff8c7a;
    font-size: 0.95rem;
    font-weight: 800;
    align-self: flex-start;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
}

.blc-desc {
    font-size: 1.05rem;
    color: #888;
    margin: 0 0 0.5rem 0;
    font-weight: 500;
    word-break: keep-all;
}

.blc-title {
    font-size: 2rem;
    font-weight: 800;
    color: #222;
    margin: 0 0 2rem 0;
    letter-spacing: -0.03em;
}

/* 가격 정보 래퍼 */
.blc-price-wrap {
    display: flex;
    align-items: flex-end;
    gap: 1.5rem;
}

.blc-price-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* "정상가 / 할인가" 라벨 공통 */
.blc-label {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    background-color: #ddd;
    color: #fff;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    margin-right: 0.5rem;
}
.blc-label-point {
    background-color: #ffb8a7;
}

.blc-original {
    display: flex;
    align-items: center;
}
.blc-strike {
    font-size: 1.25rem;
    color: #aaa;
    text-decoration: line-through;
    font-weight: 500;
}

.blc-discount {
    display: flex;
    align-items: center;
}
.blc-discount strong {
    font-size: 2.2rem;
    font-weight: 800;
    color: #ff5733; /* 핵심 강조 컬러 */
    line-height: 1;
}

/* 동그란 할인율 뱃지 */
.blc-percent {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #ff9b50 0%, #ff5733 100%);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 1.8rem;
    font-weight: 900;
    letter-spacing: -0.05em;
    box-shadow: 0 8px 15px rgba(255,100,50,0.4);
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
    .blc-wrapper { padding: 4rem 0; }
    .blc-headline { font-size: 2.4rem; }
    .blc-top-badge { font-size: 0.95rem; }
    
    .blc-card {
        flex-direction: column;
    }
    .blc-img-box {
        width: 100%;
        height: 200px;
        padding: 2rem;
        background-color: #fff;
        border-bottom: 1px solid #f0f0f0;
    }
    .blc-info-box {
        width: 100%;
        padding: 1.5rem;
    }
    
    .blc-title { font-size: 1.6rem; margin-bottom: 1.5rem; }
    
    .blc-price-wrap { align-items: center; }
    .blc-discount strong { font-size: 1.8rem; }
    .blc-percent { width: 60px; height: 60px; font-size: 1.5rem; }
}
`;
