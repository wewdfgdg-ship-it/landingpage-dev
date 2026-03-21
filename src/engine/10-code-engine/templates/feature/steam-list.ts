export const html = `
<section class="sf-wrapper">
    <div class="sf-container">
        <!-- Header -->
        <div class="sf-header hc-animate-fade-in-up">
            {{#if subheadline}}
            <div class="sf-subheadline">{{{subheadline}}}</div>
            {{/if subheadline}}
            
            <h2 class="sf-headline">{{{headline}}}</h2>
        </div>

        <!-- Vertical Feature List -->
        <div class="sf-list">
            
            <!-- Item 1 -->
            {{#if bullet.1}}
            <div class="sf-card hc-animate-fade-in-up" style="animation-delay: 100ms;">
                <div class="sf-icon">{{{bullet.0}}}</div>
                <div class="sf-text">{{{bullet.1}}}</div>
            </div>
            {{/if bullet.1}}

            <!-- Item 2 -->
            {{#if bullet.3}}
            <div class="sf-card hc-animate-fade-in-up" style="animation-delay: 150ms;">
                <div class="sf-icon">{{{bullet.2}}}</div>
                <div class="sf-text">{{{bullet.3}}}</div>
            </div>
            {{/if bullet.3}}

            <!-- Item 3 -->
            {{#if bullet.5}}
            <div class="sf-card hc-animate-fade-in-up" style="animation-delay: 200ms;">
                <div class="sf-icon">{{{bullet.4}}}</div>
                <div class="sf-text">{{{bullet.5}}}</div>
            </div>
            {{/if bullet.5}}

            <!-- Item 4 -->
            {{#if bullet.7}}
            <div class="sf-card hc-animate-fade-in-up" style="animation-delay: 250ms;">
                <div class="sf-icon">{{{bullet.6}}}</div>
                <div class="sf-text">{{{bullet.7}}}</div>
            </div>
            {{/if bullet.7}}

            <!-- Item 5 -->
            {{#if bullet.9}}
            <div class="sf-card hc-animate-fade-in-up" style="animation-delay: 300ms;">
                <div class="sf-icon">{{{bullet.8}}}</div>
                <div class="sf-text">{{{bullet.9}}}</div>
            </div>
            {{/if bullet.9}}

            <!-- Item 6 -->
            {{#if bullet.11}}
            <div class="sf-card hc-animate-fade-in-up" style="animation-delay: 350ms;">
                <div class="sf-icon">{{{bullet.10}}}</div>
                <div class="sf-text">{{{bullet.11}}}</div>
            </div>
            {{/if bullet.11}}
            
            <!-- Item 6 (using some other slots if needed, or we just rely on template engine loop for more. But template engine limits to bullet.0~9. We'll support 5 items via bullets, or we can add extra if we update the template engine. Let's assume up to 5 is fine using bullets, but we can do 6 if we use body/cta for data, but let's just stick to 5 or modify engine. Actually, let's keep it strictly bullet.0 ~ bullet.9 for 5 items. We will display 5 items in the clone.) -->
            
        </div>
    </div>
</section>
`;

export const css = `
.sf-wrapper {
    position: relative;
    width: 100%;
    background-color: #3b68c9; /* 청량하고 신뢰감 있는 블루 배경 */
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    overflow: hidden;
    padding: 5rem 0 6rem 0;
}

.sf-container {
    width: 100%;
    max-width: 600px; /* 리스트형 핵심특징은 시선이 퍼지지 않게 좁은 폭을 유지 */
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.sf-header {
    text-align: center;
    margin-bottom: 2.5rem;
    width: 100%;
}

.sf-subheadline {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1f376a; /* 짙은 네이비 톤으로 서브타이틀 구성 (투명도 느낌) */
    margin-bottom: 0.3rem;
    letter-spacing: -0.04em;
}

.sf-headline {
    font-size: 2.8rem;
    font-weight: 850;
    color: #ffffff; /* 하얀색 포인트 메인 타이틀 */
    margin: 0;
    letter-spacing: -0.05em;
    line-height: 1.2;
}

.sf-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.8rem; /* 카드 사이의 좁은 간격 */
}

.sf-card {
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px; /* 둥근 알약 같은 느낌의 화이트 둥근 사각형 */
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sf-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.sf-icon {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    margin-right: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sf-icon svg {
    width: 100%;
    height: 100%;
    stroke: #555555; /* 회색조 아이콘 라인 */
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.sf-text {
    flex-grow: 1;
    font-size: 1.3rem;
    font-weight: 700;
    color: #222222;
    line-height: 1.35;
    letter-spacing: -0.05em;
    word-break: keep-all;
}

.hc-animate-fade-in-up {
    animation: hc-fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
}
@keyframes hc-fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
    .sf-wrapper { padding: 4rem 0 5rem 0; }
    .sf-subheadline { font-size: 1.1rem; }
    .sf-headline { font-size: 2.2rem; }
    .sf-card { padding: 1rem 1.2rem; border-radius: 10px; }
    .sf-icon { width: 45px; height: 45px; margin-right: 1rem; }
    .sf-text { font-size: 1.1rem; }
}
`;
