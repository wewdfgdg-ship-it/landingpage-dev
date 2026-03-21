export const html = `
<section class="how-to-wrapper">
    <div class="how-to-container">
        
        <!-- 헤더 영역 -->
        <div class="how-to-header hc-animate-fade-in-up">
            {{#if microCopy}}
            <p class="how-to-micro">{{{microCopy}}}</p>
            {{/if microCopy}}
            
            <h2 class="how-to-headline">{{{headline}}}</h2>
            
        <!-- 스텝(사용법) 리스트 -->
        <div class="how-to-list">
            
            <!-- Step 1 -->
            {{#if bullet.1}}
            <div class="how-to-item hc-animate-fade-in-up" style="animation-delay: 100ms;">
                <div class="how-to-img-box">
                    <img src="{{bullet.0}}" alt="Step 1 Image" class="how-to-img" />
                </div>
                <div class="how-to-text-box">
                    <h3 class="how-to-title">{{{bullet.1}}}</h3>
                    <div class="how-to-desc">{{{bullet.2}}}</div>
                </div>
            </div>
            {{/if bullet.1}}

            <!-- Step 2 -->
            {{#if bullet.4}}
            <div class="how-to-item hc-animate-fade-in-up" style="animation-delay: 200ms;">
                <div class="how-to-img-box">
                    <img src="{{bullet.3}}" alt="Step 2 Image" class="how-to-img" />
                </div>
                <div class="how-to-text-box">
                    <h3 class="how-to-title">{{{bullet.4}}}</h3>
                    <div class="how-to-desc">{{{bullet.5}}}</div>
                </div>
            </div>
            {{/if bullet.4}}

            <!-- Step 3 -->
            {{#if bullet.7}}
            <div class="how-to-item hc-animate-fade-in-up" style="animation-delay: 300ms;">
                <div class="how-to-img-box">
                    <img src="{{bullet.6}}" alt="Step 3 Image" class="how-to-img" />
                </div>
                <div class="how-to-text-box">
                    <h3 class="how-to-title">{{{bullet.7}}}</h3>
                    <div class="how-to-desc">{{{bullet.8}}}</div>
                </div>
            </div>
            {{/if bullet.7}}
            
            <!-- Step 4 -->
            {{#if bullet.10}}
            <div class="how-to-item hc-animate-fade-in-up" style="animation-delay: 400ms;">
                <div class="how-to-img-box">
                    <img src="{{bullet.9}}" alt="Step 4 Image" class="how-to-img" />
                </div>
                <div class="how-to-text-box">
                    <h3 class="how-to-title">{{{bullet.10}}}</h3>
                    <div class="how-to-desc">{{{bullet.11}}}</div>
                </div>
            </div>
            {{/if bullet.10}}

        </div>

    </div>
</section>
`;

export const css = `
.how-to-wrapper {
    position: relative;
    width: 100%;
    /* 레퍼런스와 비슷한 은은한 베이지 질감 배경색 */
    background-color: #f7f6f1;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 6rem 0;
    overflow: hidden;
}

/* 추가적인 노이즈/질감을 위해 가상요소 사용도 가능하지만, 심플하게 처리 */

.how-to-container {
    width: 100%;
    max-width: 900px; /* 세로형 리스트라 폭이 너무 넓지 않게 */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.how-to-header {
    text-align: center;
    margin-bottom: 4rem;
}

.how-to-micro {
    font-size: 1.8rem;
    font-weight: 500;
    color: #444;
    margin: 0 0 0.5rem 0;
}

.how-to-headline {
    font-size: 3.5rem;
    font-weight: 800;
    color: #111;
    margin: 0;
    letter-spacing: -0.04em;
    /* 씨리얼 레퍼런스의 특징적인 두꺼운 블랙 텍스트 */
}

/* 스텝 리스트 묶음 */
.how-to-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 3rem; /* 아이템 간 간격 넓게 */
}

/* 스텝 1개의 레이아웃 (좌:둥근이미지 우:텍스트) */
.how-to-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
}

/* 왼쪽 원형 이미지 박스 (씨리얼 그릇) */
.how-to-img-box {
    flex-shrink: 0;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    /* 배경이 투명한 누끼 이미지일 경우 살짝 그림자 추가하면 사실감 부여 */
    filter: drop-shadow(0 15px 25px rgba(0,0,0,0.1));
    overflow: hidden;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
}

.how-to-img {
    width: 100%;
    height: 100%;
    object-fit: contain; /* 그릇 전체가 보이도록 */
}

/* 오른쪽 텍스트 영역 */
.how-to-text-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.8rem; /* 문장 사이의 디테일한 간격 조절 */
}

/* 레퍼런스의 갈색 톤 폰트, "1회분 xx = 약 xxxkcal" 구조 */
.how-to-title {
    font-size: 1.4rem;
    font-weight: 500;
    color: #8c7866; /* 씨리얼 디자인 특유의 따뜻한 갈색 톤 */
    margin: 0;
    line-height: 1.4;
    letter-spacing: -0.03em;
}

/* 칼로리 등 조금 큰 글씨 */
.how-to-desc {
    font-size: 1.5rem;
    font-weight: 500;
    color: #b09176;
    line-height: 1.5;
}

/* 안에 HTML 태그로 특별히 강조될 경우 (ex: strong 태그 쓰인 곳 굵고 큰 진갈색) */
.how-to-desc strong {
    font-size: 2.2rem;
    font-weight: 800;
    color: #8f6a4a; /* 큰 메인 강조색 */
    display: inline-block;
    margin-top: 0.5rem;
}

/* 애니메이션 */
.hc-animate-fade-in-up {
    animation: hc-fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}
@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

/* 모바일 분기 반응형 */
@media (max-width: 768px) {
    .how-to-micro { font-size: 1.3rem; }
    .how-to-headline { font-size: 2.5rem; }
    
    .how-to-list { gap: 4rem; }
    .how-to-item { flex-direction: column; text-align: center; gap: 1.5rem; }
    
    .how-to-img-box { width: 200px; height: 200px; }
    .how-to-title { font-size: 1.25rem; }
    .how-to-desc { font-size: 1.3rem; }
    .how-to-desc strong { font-size: 1.8rem; }
}
`;
