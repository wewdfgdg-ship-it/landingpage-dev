export const html = `
<section class="tc-wrapper">
    <div class="tc-container">
        
        <!-- 상단 헤더 텍스트 디자인 (0원 등 파도치는 듯한 배치) -->
        <div class="tc-header hc-animate-fade-in-up">
            <h2 class="tc-headline">
                {{#if headline}}{{{headline}}}{{/if headline}}
            </h2>
            {{#if microCopy}}
            <div class="tc-date-badge">{{{microCopy}}}</div>
            {{/if microCopy}}
        </div>

        <!-- 메인 CTA 안내 텍스트 -->
        <div class="tc-body-area hc-animate-fade-in-up" style="animation-delay: 200ms;">
            {{#if subheadline}}
            <h3 class="tc-subheadline">{{{subheadline}}}</h3>
            {{/if subheadline}}
            
            {{#if body}}
            <p class="tc-body-text">{{{body}}}</p>
            {{/if body}}
        </div>

        <!-- 티켓 형태의 쿠폰 카드 & 다운로드 버튼 -->
        <div class="tc-ticket-box hc-animate-fade-in-up" style="animation-delay: 300ms;">
            
            <div class="tc-ticket">
                <!-- 티켓 왼쪽 (내용) -->
                <div class="tc-ticket-content">
                    <p class="tc-ticket-head">{{{bullet.0}}}</p> <!-- ex: 등록회원 누.구.나. -->
                    <h4 class="tc-ticket-title">{{{bullet.1}}}</h4> <!-- ex: 0원 쿠폰 -->
                    <p class="tc-ticket-sub">{{{bullet.2}}}</p> <!-- ex: TRO COUPON -->
                </div>
                <!-- 티켓 오른쪽 절취선 영역 느낌 -->
                <div class="tc-ticket-divider"></div>
            </div>

            <!-- 동그란 다운로드/행동 유도 버튼 -->
            <button class="tc-action-btn">
                <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                <span>{{{ctaText}}}</span>
            </button>

        </div>

    </div>
</section>
`;

export const css = `
.tc-wrapper {
    position: relative;
    width: 100%;
    /* 레퍼런스의 청량한 민트/하늘색 배경 */
    background-color: #00cae8;
    background-image: radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 40%);
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
}

.tc-container {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.tc-header {
    text-align: center;
    margin-bottom: 4rem;
    position: relative;
}

/* 레퍼런스 특유의 들쭉날쭉한 텍스트 배치를 약간 흉내내는 스타일링. 폰트 자체의 스타일로 커버 */
.tc-headline {
    font-size: 4rem;
    font-weight: 900;
    color: #111;
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.05em;
    word-break: keep-all;
    text-shadow: 2px 2px 0px rgba(0,0,0,0.1); /* 약간의 강렬함 추가 */
}

/* 날짜나 기한을 알려주는 노란색 뱃지 */
.tc-date-badge {
    display: inline-block;
    background-color: #ffcc00; /* 옐로우 */
    color: #111;
    font-size: 1.2rem;
    font-weight: 800;
    padding: 0.4rem 1.5rem;
    border-radius: 30px;
    margin-top: 1.5rem;
}

.tc-body-area {
    width: 100%;
    text-align: center;
    margin-bottom: 2rem;
    border-top: 2px solid #111;
    padding-top: 2rem;
}

/* 서브 타이틀 (ex: 아묻따 0원! promotion) */
.tc-subheadline {
    font-size: 2.2rem;
    font-weight: 900;
    color: #111;
    margin: 0 0 1rem 0;
}

.tc-body-text {
    font-size: 1.3rem;
    font-weight: 500;
    color: #111;
    line-height: 1.5;
    margin: 0;
    word-break: keep-all;
}

/* 티켓 쿠폰 영역 (컨테이너) */
.tc-ticket-box {
    position: relative;
    width: 100%;
    max-width: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
}

/* 블랙 티켓 디자인 */
.tc-ticket {
    background-color: #111;
    width: 100%;
    height: 180px;
    border-radius: 16px;
    position: relative;
    display: flex;
    overflow: hidden;
    box-shadow: 0 20px 30px rgba(0,0,0,0.15);
}

/* 티켓 가장자리에 펀칭구멍 효과 (옵션) */
.tc-ticket::before, .tc-ticket::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    background-color: #00cae8; /* 배경색과 맞춰 구멍뚫린 효과 */
    border-radius: 50%;
    z-index: 1;
}
.tc-ticket::before { left: -15px; }
.tc-ticket::after { right: -15px; }

.tc-ticket-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #00cae8; /* 텍스트는 배경의 민트색 활용 */
    padding: 0 2rem;
    z-index: 2;
}

.tc-ticket-head {
    font-size: 0.9rem;
    font-weight: 700;
    color: #00cae8;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.1em;
}

.tc-ticket-title {
    font-size: 3.5rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.05em;
    color: #00cae8;
}

.tc-ticket-sub {
    font-size: 1rem;
    font-weight: 700;
    color: #666;
    margin: 0.5rem 0 0 0;
    letter-spacing: 0.05em;
}

/* 절취선 점선 굵게 */
.tc-ticket-divider {
    width: 2px;
    height: 80%;
    margin: auto 0;
    border-left: 3px dotted #444;
    margin-right: 60px; /* 버튼이 올라갈 공간 마련 */
}

/* 동그란 노란색 다운로드 버튼 */
.tc-action-btn {
    position: absolute;
    right: -20px; /* 티켓 오른쪽 바깥으로 살짝 튀어나오게 배치 */
    top: 50%;
    transform: translateY(-50%);
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #ffea00 0%, #ffaa00 100%);
    border: none;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 10px 20px rgba(255,170,0,0.4);
    cursor: pointer;
    z-index: 10;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tc-action-btn:hover {
    transform: translateY(-50%) scale(1.1);
}

.tc-action-btn svg {
    width: 32px;
    height: 32px;
    fill: #111;
    margin-bottom: 0.3rem;
}

.tc-action-btn span {
    font-size: 0.9rem;
    font-weight: 800;
    color: #111;
    letter-spacing: -0.02em;
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
    .tc-wrapper { padding: 4rem 0; }
    .tc-headline { font-size: 2.8rem; }
    .tc-subheadline { font-size: 1.6rem; }
    .tc-body-text { font-size: 1.1rem; }
    
    .tc-ticket { height: 140px; }
    .tc-ticket-title { font-size: 2.5rem; }
    
    .tc-action-btn {
        width: 80px; height: 80px;
        right: -10px;
    }
    .tc-action-btn svg { width: 24px; height: 24px; }
    .tc-action-btn span { font-size: 0.8rem; }
}
`;
