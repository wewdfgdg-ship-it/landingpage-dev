export const html = `
<section class="qa-wrapper">
    <div class="qa-container">
        
        <!-- FAQ 헤더 -->
        <div class="qa-header hc-animate-fade-in-up">
            <p class="qa-micro">FAQ</p>
            <h2 class="qa-headline">{{{headline}}}</h2>
        </div>

        <!-- FAQ 리스트 -->
        <div class="qa-list">
            
            {{#if bullet.1}}
            <div class="qa-item hc-animate-fade-in-up" style="animation-delay: 100ms;">
                <div class="qa-q-box">
                    <span class="qa-badge qa-badge-q">Q.</span>
                    <h3 class="qa-q-text">{{{bullet.0}}}</h3>
                </div>
                <div class="qa-a-box">
                    <span class="qa-badge qa-badge-a">A.</span>
                    <div class="qa-a-text">
                        {{{bullet.1}}}
                    </div>
                </div>
            </div>
            {{/if bullet.1}}

            {{#if bullet.3}}
            <div class="qa-item hc-animate-fade-in-up" style="animation-delay: 200ms;">
                <div class="qa-q-box">
                    <span class="qa-badge qa-badge-q">Q.</span>
                    <h3 class="qa-q-text">{{{bullet.2}}}</h3>
                </div>
                <div class="qa-a-box">
                    <span class="qa-badge qa-badge-a">A.</span>
                    <div class="qa-a-text">
                        {{{bullet.3}}}
                    </div>
                </div>
            </div>
            {{/if bullet.3}}

            {{#if bullet.5}}
            <div class="qa-item hc-animate-fade-in-up" style="animation-delay: 300ms;">
                <div class="qa-q-box">
                    <span class="qa-badge qa-badge-q">Q.</span>
                    <h3 class="qa-q-text">{{{bullet.4}}}</h3>
                </div>
                <div class="qa-a-box">
                    <span class="qa-badge qa-badge-a">A.</span>
                    <div class="qa-a-text">
                        {{{bullet.5}}}
                    </div>
                </div>
            </div>
            {{/if bullet.5}}

            {{#if bullet.7}}
            <div class="qa-item hc-animate-fade-in-up" style="animation-delay: 400ms;">
                <div class="qa-q-box">
                    <span class="qa-badge qa-badge-q">Q.</span>
                    <h3 class="qa-q-text">{{{bullet.6}}}</h3>
                </div>
                <div class="qa-a-box">
                    <span class="qa-badge qa-badge-a">A.</span>
                    <div class="qa-a-text">
                        {{{bullet.7}}}
                    </div>
                </div>
            </div>
            {{/if bullet.7}}

        </div>

    </div>
</section>
`;

export const css = `
.qa-wrapper {
    position: relative;
    width: 100%;
    /* 벽지같은 연한 회색 질감 배경 (컬러로 대체) */
    background-color: #f6f6f6;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
}

.qa-container {
    width: 100%;
    max-width: 800px; /* FAQ 텍스트를 읽기 편하도록 폭 제한 */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.qa-header {
    text-align: center;
    margin-bottom: 4rem;
}

.qa-micro {
    font-size: 5rem;
    font-weight: 900;
    color: #e5e5e5; /* 배경에 묻히는 워터마크 느낌 */
    margin: 0 0 -2rem 0;
    letter-spacing: 0.05em;
    user-select: none;
}

.qa-headline {
    font-size: 3rem;
    font-weight: 800;
    color: #111;
    margin: 0;
    letter-spacing: -0.05em;
    position: relative;
    z-index: 2;
    /* 초록색 언더라인/그라데이션 강조 (레퍼런스 참고) */
}
/* 텍스트의 밑부분만 초록색으로 칠해주는 효과 */
.qa-headline::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 120%;
    height: 12px;
    background: linear-gradient(90deg, rgba(82,196,26,0), rgba(82,196,26,0.6), rgba(82,196,26,0));
    z-index: -1;
}

/* FAQ 리스트 영역 */
.qa-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* 개별 FAQ 카드 (레퍼런스의 블랙 상단부, 화이트 하단부) */
.qa-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    overflow: hidden;
    /* 카드가 바닥에서 떠있는 듯한 그림자 */
    box-shadow: 0 15px 35px rgba(0,0,0,0.06);
}

/* 질문(Q) 박스 (검은색 바탕) */
.qa-q-box {
    background-color: #191919;
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* 답변(A) 박스 (흰색 바탕) */
.qa-a-box {
    background-color: #ffffff;
    padding: 2rem 2rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

/* Q/A 뱃지 공통 */
.qa-badge {
    font-size: 1.8rem;
    font-weight: 900;
    font-style: italic;
    flex-shrink: 0;
}

.qa-badge-q {
    color: #52c41a; /* 네온그린/초록색 */
}

.qa-badge-a {
    color: #111; /* 강렬한 블랙 */
}

.qa-q-text {
    font-size: 1.3rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.03em;
    line-height: 1.4;
}

.qa-a-text {
    font-size: 1.15rem;
    font-weight: 500; /* 본문 기본보다 살짝 두껍게 가독성 확보 */
    color: #555;
    margin: 0;
    line-height: 1.6;
    letter-spacing: -0.02em;
}

/* A 텍스트 내 강조 태그 */
.qa-a-text strong {
    font-weight: 800;
    color: #222;
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
    .qa-wrapper { padding: 4rem 0; }
    .qa-micro { font-size: 3.5rem; margin-bottom: -1.2rem; }
    .qa-headline { font-size: 2.2rem; }
    
    .qa-q-box { padding: 1.2rem 1.5rem; gap: 0.8rem; }
    .qa-a-box { padding: 1.5rem 1.5rem; gap: 0.8rem; }
    
    .qa-badge { font-size: 1.5rem; }
    .qa-q-text { font-size: 1.15rem; }
    .qa-a-text { font-size: 1.05rem; line-height: 1.5; }
}
`;
