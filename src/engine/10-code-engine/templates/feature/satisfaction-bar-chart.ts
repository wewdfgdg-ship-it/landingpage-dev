export const html = `
<section class="stf-wrapper">
    <div class="stf-container">
        
        <!-- 헤더 영역 -->
        <div class="stf-header hc-animate-fade-in-up">
            <p class="stf-micro">{{{microCopy}}}</p>
            <h2 class="stf-headline">{{{headline}}}</h2>
            
            {{#if subheadline}}
            <div class="stf-badge">{{{subheadline}}}</div>
            {{/if subheadline}}
        </div>

        <!-- 설문 결과 바 차트 리스트 -->
        <div class="stf-chart-box">
            
            <!-- 항목 1 -->
            {{#if bullet.1}}
            <div class="stf-bar-row hc-animate-fade-in-up" style="animation-delay: 100ms;">
                <div class="stf-bar-bg">
                    <!-- width 인라인 스타일로 동적 차트 길이 조절 (bullet.2 백분율 사용) -->
                    <div class="stf-bar-fill" style="width: {{{bullet.2}}}%;"></div>
                </div>
                <!-- 텍스트/결과가 바 위에 떠있게 -->
                <div class="stf-bar-content">
                    <p class="stf-question">{{{bullet.0}}}</p>
                    <p class="stf-percent">{{{bullet.1}}}</p>
                </div>
            </div>
            {{/if bullet.1}}

            <!-- 항목 2 -->
            {{#if bullet.4}}
            <div class="stf-bar-row hc-animate-fade-in-up" style="animation-delay: 200ms;">
                <div class="stf-bar-bg">
                    <div class="stf-bar-fill" style="width: {{{bullet.5}}}%;"></div>
                </div>
                <div class="stf-bar-content">
                    <p class="stf-question">{{{bullet.3}}}</p>
                    <p class="stf-percent">{{{bullet.4}}}</p>
                </div>
            </div>
            {{/if bullet.4}}

            <!-- 항목 3 -->
            {{#if bullet.7}}
            <div class="stf-bar-row hc-animate-fade-in-up" style="animation-delay: 300ms;">
                <div class="stf-bar-bg">
                    <div class="stf-bar-fill" style="width: {{{bullet.8}}}%;"></div>
                </div>
                <div class="stf-bar-content">
                    <p class="stf-question">{{{bullet.6}}}</p>
                    <p class="stf-percent">{{{bullet.7}}}</p>
                </div>
            </div>
            {{/if bullet.7}}

            <!-- 항목 4 -->
            {{#if bullet.10}}
            <div class="stf-bar-row hc-animate-fade-in-up" style="animation-delay: 400ms;">
                <div class="stf-bar-bg">
                    <div class="stf-bar-fill" style="width: {{{bullet.11}}}%;"></div>
                </div>
                <div class="stf-bar-content">
                    <p class="stf-question">{{{bullet.9}}}</p>
                    <p class="stf-percent">{{{bullet.10}}}</p>
                </div>
            </div>
            {{/if bullet.10}}

        </div>

    </div>
</section>
`;

export const css = `
.stf-wrapper {
    position: relative;
    width: 100%;
    /* 레퍼런스의 부드러운 화이트~라이트그레이 톤 (여기는 아주 연한 베이지그레이 느낌) */
    background-color: #f7f7f7;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
}

.stf-container {
    width: 100%;
    max-width: 800px; /* 차트의 폭 제한 */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.stf-header {
    text-align: center;
    margin-bottom: 3.5rem;
}

.stf-micro {
    font-size: 1.4rem;
    font-weight: 500;
    color: #444;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.03em;
}

.stf-headline {
    font-size: 2.8rem;
    font-weight: 900;
    color: #111;
    margin: 0;
    letter-spacing: -0.05em;
    word-break: keep-all;
    line-height: 1.2;
}

/* "사용자 만족도 평가" 텍스트박스 배지 형 */
.stf-badge {
    display: inline-block;
    padding: 0.8rem 2rem;
    background-color: #fff;
    color: #111;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    margin-top: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.stf-chart-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.stf-bar-row {
    position: relative;
    width: 100%;
    height: 70px;
    background-color: transparent;
}

/* 차트 배경 및 채워지는 영역 */
.stf-bar-bg {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff; /* 빈 공간은 하얗게 */
    border: 1px solid #e0e0e0;
    display: flex;
}

.stf-bar-fill {
    height: 100%;
    background-color: #0c336b; /* 네이비 블루 (레퍼런스 컬러) */
    /* 애니메이션 효과로 왼쪽에서 오른쪽으로 채워지기 */
    transform-origin: left;
    animation: stf-bar-grow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes stf-bar-grow {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
}

/* 차트 위의 텍스트 내용물 */
.stf-bar-content {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    z-index: 2;
    pointer-events: none; /* 클릭 방해 금지 */
}

/* 질문(왼쪽) */
.stf-question {
    font-size: 1.2rem;
    font-weight: 500;
    color: #fff; /* 짙은 배경 위에선 흰색이 기본 */
    margin: 0;
    /* 만약 bar-fill의 너비가 너무 좁아서 글자가 튀어나갈 경우 문제가 되지만, 주로 90% 이상 차트이므로 흰색 고정 허용 (믹스블렌드모드 대안 가능) */
    mix-blend-mode: difference; 
    /* difference를 쓰면 배경색에 따라 텍스트 컬러 반전 (네이비->연한색, 화이트->짙은색). 호환성 좋음 */
}

/* 백분율 수치(오른쪽) */
.stf-percent {
    font-size: 2.5rem;
    font-weight: 300; /* 레퍼런스처럼 얇고 세련된 폰트웨이트 */
    color: #fff;
    margin: 0;
    mix-blend-mode: difference;
    font-family: -apple-system, sans-serif;
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

@media (max-width: 600px) {
    .stf-wrapper { padding: 4rem 0; }
    .stf-headline { font-size: 2.2rem; }
    .stf-micro { font-size: 1.1rem; }
    
    .stf-bar-row { height: 60px; }
    .stf-question { font-size: 1.05rem; }
    .stf-percent { font-size: 1.8rem; }
}
`;
