export const html = `
<section class="tc-wrapper">
    <div class="tc-container">
        
        <!-- 콘텐츠 래퍼 (흰색 박스) -->
        <div class="tc-box hc-animate-fade-in-up">
            
            <div class="tc-header">
                {{#if imageUrl}}
                <div class="tc-icon">
                    {{{imageUrl}}}
                </div>
                {{/if imageUrl}}
                <div class="tc-title-wrap">
                    {{#if microCopy}}
                    <p class="tc-micro">{{{microCopy}}}</p>
                    {{/if microCopy}}
                    <h2 class="tc-headline">{{{headline}}}</h2>
                </div>
            </div>

            <ul class="tc-list">
                {{#if bullet.1}}
                <li class="tc-item">
                    <span class="tc-num">{{{bullet.0}}}</span>
                    <p class="tc-text">{{{bullet.1}}}</p>
                </li>
                {{/if bullet.1}}

                {{#if bullet.3}}
                <li class="tc-item">
                    <span class="tc-num">{{{bullet.2}}}</span>
                    <p class="tc-text">{{{bullet.3}}}</p>
                </li>
                {{/if bullet.3}}

                {{#if bullet.5}}
                <li class="tc-item">
                    <span class="tc-num">{{{bullet.4}}}</span>
                    <p class="tc-text">{{{bullet.5}}}</p>
                </li>
                {{/if bullet.5}}

                {{#if bullet.7}}
                <li class="tc-item">
                    <span class="tc-num">{{{bullet.6}}}</span>
                    <p class="tc-text">{{{bullet.7}}}</p>
                </li>
                {{/if bullet.7}}

                {{#if bullet.9}}
                <li class="tc-item">
                    <span class="tc-num">{{{bullet.8}}}</span>
                    <p class="tc-text">{{{bullet.9}}}</p>
                </li>
                {{/if bullet.9}}
            </ul>

        </div>

    </div>
</section>
`;

export const css = `
.tc-wrapper {
    position: relative;
    width: 100%;
    /* 레퍼런스 스타일의 강렬한 배경, 원한다면 변경 가능 */
    background: linear-gradient(135deg, #ff8c00 0%, #ff5e00 100%);
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
}

.tc-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 5%;
    z-index: 5;
}

.tc-box {
    background-color: #ffffff;
    width: 100%;
    padding: 4rem 3rem;
    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    /* 모서리 각진 디자인 (레퍼런스 동일) */
}

/* 상단 헤더 영역 (아이콘 + 작은제목 + 큰제목) */
.tc-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.tc-icon {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
}
.tc-icon svg {
    width: 100%;
    height: 100%;
    fill: #ff5e00; /* 오렌지색 번개 모양 등 호환 */
}

.tc-title-wrap {
    display: flex;
    flex-direction: column;
}

.tc-micro {
    font-size: 1.2rem;
    color: #444;
    font-weight: 500;
    margin: 0 0 0.3rem 0;
    letter-spacing: -0.02em;
}

.tc-headline {
    font-size: 2.2rem;
    font-weight: 800;
    color: #111;
    margin: 0;
    letter-spacing: -0.05em;
}

/* 체크리스트 영역 */
.tc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
}

.tc-item {
    display: flex;
    align-items: center;
    padding: 1.2rem 0;
    border-bottom: 1px solid #eaeaea;
}
.tc-item:last-child {
    border-bottom: none;
}

.tc-num {
    font-size: 1.8rem;
    font-weight: 800;
    color: #ffb17a; /* 연한 오렌지/골드 컬러 */
    margin-right: 1.5rem;
    width: 35px; /* 고정폭으로 숫자 정렬 */
    text-align: right;
    letter-spacing: -0.05em;
}

.tc-text {
    font-size: 1.3rem;
    font-weight: 500;
    color: #333;
    margin: 0;
    line-height: 1.5;
    letter-spacing: -0.03em;
}

/* 특정 단어 펜 라이너(형광펜) 하이라이트 효과 커스텀 유틸리티 */
.tc-highlight {
    position: relative;
    font-weight: 700;
    color: #ff5e00;
    z-index: 1;
}

.tc-highlight::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 100%;
    height: 40%;
    background-color: rgba(255, 94, 0, 0.15);
    z-index: -1;
    transition: height 0.2s ease;
}

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
    .tc-wrapper { padding: 4rem 0; }
    .tc-box { padding: 2.5rem 1.5rem; }
    .tc-header { flex-direction: column; align-items: flex-start; gap: 1rem; margin-bottom: 2rem;}
    .tc-icon { width: 45px; height: 45px; }
    .tc-micro { font-size: 1.1rem; }
    .tc-headline { font-size: 1.8rem; }
    
    .tc-num { font-size: 1.4rem; margin-right: 1rem; width: 25px;}
    .tc-text { font-size: 1.15rem; }
    .tc-item { padding: 1rem 0; }
}
`;
