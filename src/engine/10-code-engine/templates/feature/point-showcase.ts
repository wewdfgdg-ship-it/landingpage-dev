export const html = `
<section class="ps-wrapper">
    <div class="ps-container">
        
        <!-- 중앙 집중형 헤더 -->
        <div class="ps-header hc-animate-fade-in-up">
            {{#if microCopy}}
            <div class="ps-badge">
                <span class="ps-badge-text">{{{microCopy}}}</span>
            </div>
            {{/if microCopy}}
            
            <h2 class="ps-headline">{{{headline}}}</h2>
            
            {{#if subheadline}}
            <p class="ps-subheadline">{{{subheadline}}}</p>
            {{/if subheadline}}
        </div>

        <!-- 메인 비주얼 & 콜아웃 뱃지 -->
        <div class="ps-visual-wrap hc-animate-fade-in-up" style="animation-delay: 200ms;">
            
            <!-- 백그라운드 효과 (원형 그라데이션 등) -->
            <div class="ps-visual-bg"></div>
            
            <!-- 공중에 떠있는 콜아웃(특장점 지시) 뱃지 (bullet 0~4) -->
            {{#if bullet.0}}
            <div class="ps-callout ps-callout-1">
                <div class="ps-callout-line"></div>
                <div class="ps-callout-box">{{{bullet.0}}}</div>
            </div>
            {{/if bullet.0}}

            {{#if bullet.1}}
            <div class="ps-callout ps-callout-2">
                <div class="ps-callout-line"></div>
                <div class="ps-callout-box">{{{bullet.1}}}</div>
            </div>
            {{/if bullet.1}}

            <!-- 핵심 제품/모델 이미지 -->
            <img src="{{imageUrl}}" alt="Feature Showcase" class="ps-main-img" />

        </div>

        <!-- 하단 추가 설명 (비포애프터나 논문결과 등 부가설명) -->
        {{#if body}}
        <div class="ps-footer-text hc-animate-fade-in-up" style="animation-delay: 300ms;">
            {{{body}}}
        </div>
        {{/if body}}

    </div>
</section>
`;

export const css = `
.ps-wrapper {
    position: relative;
    width: 100%;
    /* 살짝 핑크/파스텔 톤이 도는 화이트 베이스 (뷰티 특화) */
    background: linear-gradient(to bottom, #fffdfd 0%, #fdf8f9 100%);
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 7rem 0 6rem 0;
    overflow: hidden;
}

.ps-container {
    width: 100%;
    max-width: 1100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.ps-header {
    text-align: center;
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 상단 둥근 배지 (POINT 01, Point 2 등에 사용) */
.ps-badge {
    background-color: #e5e5ea;
    border-radius: 50px;
    padding: 0.4rem 1.2rem;
    margin-bottom: 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.5), 0 2px 5px rgba(0,0,0,0.05); /* 입체감 */
}

/* 배경 뒤에 은은한 핑크/그레이 그라데이션(원형)을 깔아서 제품이 돋보이게 함 */
.ps-badge-text {
    font-size: 0.95rem;
    font-weight: 700;
    color: #111;
    letter-spacing: 0.05em;
    font-family: 'Arial', sans-serif; /* 영어/숫자가 깔끔한 폰트 우선 */
    text-transform: uppercase;
}

.ps-headline {
    font-size: 3.2rem;
    font-weight: 800;
    color: #111;
    margin: 0 0 1.2rem 0;
    line-height: 1.3;
    letter-spacing: -0.04em;
    word-break: keep-all;
}

/* 텍스트 내 강조 컬러 (ex: 핑크색 글씨) */
.ps-hl-color {
    color: #ff3366; /* 강렬한 핫핑크/마젠타 */
}

.ps-subheadline {
    font-size: 1.2rem;
    font-weight: 500;
    color: #444;
    line-height: 1.6;
    margin: 0;
    letter-spacing: -0.02em;
}

/* 비주얼 및 지시선 (Callout) 컨테이너 */
.ps-visual-wrap {
    position: relative;
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    padding: 2rem;
}

.ps-visual-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    padding-bottom: 80%; /* 1:1 비율 원 */
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,235,240,0.8) 0%, rgba(255,255,255,0) 70%);
    z-index: 1;
}

.ps-main-img {
    position: relative;
    z-index: 5;
    width: 100%;
    max-width: 600px;
    height: auto;
    object-fit: contain;
    /* 누끼(배경투명) 이미지를 넣었을 때 입체감을 주는 은은한 그림자 */
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.08)); 
}

/* Callout (사진을 가리키는 점선+플로팅 뱃지) 공통 속성 */
.ps-callout {
    position: absolute;
    z-index: 10;
    display: flex;
    align-items: center;
    /* 마우스 호버 시 살짝 떠오름 */
    transition: transform 0.3s ease;
}

.ps-callout:hover {
    transform: translateY(-5px);
}

.ps-callout-box {
    background-color: #ff3366;
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
    padding: 0.6rem 1.2rem;
    border-radius: 50px;
    white-space: nowrap;
    box-shadow: 0 8px 15px rgba(255, 51, 102, 0.3);
}

.ps-callout-line {
    /* 공통 점선 베이스 */
    width: 0; height: 0;
    border: 1px dashed rgba(255, 51, 102, 0.6);
}

/* Callout 1 (왼쪽 상단에서 제품 중간을 찌름) */
.ps-callout-1 {
    top: 30%;
    left: -5%; /* 데스크탑에선 화면 좀 더 바깥으로 */
    flex-direction: row; /* 선이 오른쪽에 위치 */
    align-items: flex-end;
}
.ps-callout-1 .ps-callout-line {
    width: 80px; /* 가로선 */
    height: 60px; /* 세로로 꺾여 내려오는 느낌 */
    border-top: none; /* 하단과 우측 선으로 ㄱ자 또는 ㄴ자 모양 만듦 */
    border-right: none;
    border-left: 1px dashed #ff3366;
    border-bottom: 1px dashed #ff3366;
    margin-left: -20px; /* 박스 안쪽에서 시작하는 듯한 겹침 */
    margin-bottom: 15px;
}

/* Callout 2 (오른쪽 하단에서 제품 아래를 찌름) */
.ps-callout-2 {
    bottom: 25%;
    right: -5%;
    flex-direction: row-reverse; /* 선이 왼쪽에 위치 */
    align-items: flex-start;
}
.ps-callout-2 .ps-callout-line {
    width: 100px;
    height: 40px;
    border-bottom: none;
    border-left: none;
    border-top: 1px dashed #ff3366;
    border-right: 1px dashed #ff3366;
    margin-right: -20px;
    margin-top: 15px;
}

.ps-footer-text {
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: #222;
    margin-top: 2rem;
    line-height: 1.5;
}

.ps-footer-small {
    display: block;
    font-size: 0.8rem;
    font-weight: 400;
    color: #999;
    margin-top: 0.8rem;
}

/* 애니메이션 */
.hc-animate-fade-in-up {
    animation: hc-fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}
@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(40px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 900px) {
    /* 모바일/태블릿에선 뱃지가 사진에 너무 멀리 있지 않도록 조정 */
    .ps-callout-1 { left: 5%; top: 20%; flex-direction: column; }
    .ps-callout-1 .ps-callout-line { border-bottom: none; border-left: 1px dashed #ff3366; width: 0; height: 50px; margin: 0; margin-top: -10px; z-index:-1;}
    
    .ps-callout-2 { right: 5%; bottom: 15%; flex-direction: column-reverse; }
    .ps-callout-2 .ps-callout-line { border-top: none; border-right: none; border-left: 1px dashed #ff3366; width: 0; height: 50px; margin: 0; margin-bottom: -10px; z-index:-1;}
}

@media (max-width: 600px) {
    .ps-wrapper { padding: 5rem 0 4rem 0; }
    .ps-headline { font-size: 2.2rem; }
    .ps-subheadline { font-size: 1.05rem; word-break: keep-all;}
    .ps-callout-box { font-size: 0.8rem; padding: 0.5rem 1rem;}
}
`;
