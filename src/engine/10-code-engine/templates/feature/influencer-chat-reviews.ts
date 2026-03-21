export const html = `
<section class="icr-wrapper">
    <div class="icr-container">
        
        <!-- 헤더 / 타이틀 영역 -->
        <div class="icr-header hc-animate-fade-in-up">
            <h3 class="icr-micro">{{{microCopy}}}</h3>
            <h2 class="icr-headline">{{{headline}}}</h2>
            
            <!-- 우측 상단이나 특수 배지 (BEST 등) -->
            {{#if subheadline}}
            <div class="icr-badge">{{{subheadline}}}</div>
            {{/if subheadline}}
        </div>

        <!-- 말풍선 리뷰 리스트 영역 -->
        <div class="icr-chat-area hc-animate-fade-in-up" style="animation-delay: 200ms;">
            
            <!-- 왼쪽 리뷰 -->
            {{#if bullet.0}}
            <div class="icr-chat-row icr-left">
                <div class="icr-profile">
                    <!-- bullet.0: 아바타 이미지 src -->
                    <img src="{{bullet.0}}" alt="profile1" />
                    <!-- bullet.1: 유튜버/인플루언서 이름 -->
                    <span class="icr-name">{{{bullet.1}}}</span>
                </div>
                <div class="icr-bubble">
                    <!-- bullet.2: 내용 -->
                    <p>{{{bullet.2}}}</p>
                </div>
            </div>
            {{/if bullet.0}}

            <!-- 오른쪽 리뷰 -->
            {{#if bullet.3}}
            <div class="icr-chat-row icr-right" style="animation-delay: 300ms;">
                <div class="icr-bubble">
                    <p>{{{bullet.5}}}</p>
                </div>
                <div class="icr-profile">
                    <img src="{{bullet.3}}" alt="profile2" />
                    <span class="icr-name">{{{bullet.4}}}</span>
                </div>
            </div>
            {{/if bullet.3}}

            <!-- 왼쪽 리뷰 2 -->
            {{#if bullet.6}}
            <div class="icr-chat-row icr-left" style="animation-delay: 400ms;">
                <div class="icr-profile">
                    <img src="{{bullet.6}}" alt="profile3" />
                    <span class="icr-name">{{{bullet.7}}}</span>
                </div>
                <div class="icr-bubble">
                    <p>{{{bullet.8}}}</p>
                </div>
            </div>
            {{/if bullet.6}}

            <!-- 오른쪽 리뷰 2 -->
            {{#if bullet.9}}
            <div class="icr-chat-row icr-right" style="animation-delay: 500ms;">
                <div class="icr-bubble">
                    <p>{{{bullet.11}}}</p>
                </div>
                <div class="icr-profile">
                    <img src="{{bullet.9}}" alt="profile4" />
                    <span class="icr-name">{{{bullet.10}}}</span>
                </div>
            </div>
            {{/if bullet.9}}

        </div>

        <!-- 하단 인플루언서 명단 나열부 -->
        {{#if body}}
        <div class="icr-footer-list hc-animate-fade-in-up" style="animation-delay: 600ms;">
            {{{body}}}
        </div>
        {{/if body}}

    </div>
</section>
`;

export const css = `
.icr-wrapper {
    position: relative;
    width: 100%;
    background-color: #ededed; /* 레퍼런스의 회색빛 질감 톤. 깔끔하게 단색 처리 혹은 그라디언트 */
    background-image: linear-gradient(to bottom, #d9dcde 0%, #ededed 30%, #ededed 100%);
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
}

.icr-container {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.icr-header {
    text-align: left;
    width: 100%;
    position: relative;
    margin-bottom: 4rem;
    padding-left: 2rem;
}

.icr-micro {
    font-size: 2.2rem;
    font-weight: 500;
    color: #444;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.04em;
}

.icr-headline {
    font-size: 4rem;
    font-weight: 900;
    color: #333;
    margin: 0;
    letter-spacing: -0.05em;
    line-height: 1.1;
}

/* 베스트 딱지 뱃지 처리 (오른쪽 상단 위치) */
.icr-badge {
    position: absolute;
    top: -20px;
    right: 20px;
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, #ffe175 0%, #dfa521 100%);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1.8rem;
    font-weight: 900;
    color: #442800;
    box-shadow: 0 10px 20px rgba(0,0,0,0.15), inset 0 0 0 8px rgba(255,255,255,0.3);
    line-height: 1.2;
    transform: rotate(10deg);
}

/* 말풍선 목록 영역 */
.icr-chat-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    margin-bottom: 5rem;
}

/* 말풍선 공통/가로 배치 형태 */
.icr-chat-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
}

/* 왼쪽에 프로필, 오른쪽에 말풍선 */
.icr-left {
    justify-content: flex-start;
}
/* 오른쪽에 프로필, 왼쪽에 말풍선 */
.icr-right {
    justify-content: flex-end;
}

.icr-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    flex-shrink: 0;
}

.icr-profile img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border: 3px solid #fff;
    margin-bottom: 0.5rem;
}

.icr-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: #333;
    text-align: center;
    word-break: keep-all;
}

/* 말풍선 본체 */
.icr-bubble {
    background-color: #ffffff;
    padding: 1.2rem 2rem;
    border-radius: 30px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    position: relative;
    max-width: 85%;
}

.icr-bubble p {
    font-size: 1.15rem;
    font-weight: 500;
    color: #222;
    line-height: 1.6;
    margin: 0;
    word-break: keep-all;
}
.icr-bubble p strong {
    color: #111;
    font-weight: 800;
}

/* 말풍선 꼬리 (왼쪽) */
.icr-left .icr-bubble::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -10px;
    transform: translateY(-50%);
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 15px solid #ffffff;
}

/* 말풍선 꼬리 (오른쪽) */
.icr-right .icr-bubble::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    transform: translateY(-50%);
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 15px solid #ffffff;
}

/* 하단 명단 나열부 */
.icr-footer-list {
    text-align: center;
    width: 100%;
}

/* 하단의 여러 플랫폼/명단 타이포그래피 (body 복제로 통제) */
.icr-footer-list h4 {
    font-size: 1.8rem;
    font-family: serif; /* 레퍼런스의 YouTube 로고 흉내나 돋보임 */
    font-weight: 800;
    color: #000;
    margin: 2rem 0 1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}
.icr-footer-list p {
    font-size: 1.05rem;
    color: #444;
    line-height: 1.6;
    margin: 0;
    word-break: keep-all;
    padding: 0 1rem;
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
    .icr-wrapper { padding: 4rem 0; }
    .icr-header { padding-left: 0; text-align: center; }
    .icr-micro { font-size: 1.4rem; }
    .icr-headline { font-size: 2.5rem; }
    
    .icr-badge {
        width: 100px; height: 100px;
        font-size: 1.3rem;
        top: -60px; right: 10px;
    }
    
    .icr-chat-row { gap: 0.8rem; }
    .icr-bubble { padding: 1rem 1.2rem; border-radius: 20px; }
    .icr-bubble p { font-size: 0.95rem; }
    .icr-profile { width: 60px; }
    .icr-profile img { width: 50px; height: 50px; }
    .icr-name { font-size: 0.8rem; }
    
    .icr-footer-list h4 { font-size: 1.4rem; }
    .icr-footer-list p { font-size: 0.85rem; }
}
`;
