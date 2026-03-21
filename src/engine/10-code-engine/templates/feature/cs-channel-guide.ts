export const html = `
<section class="cs-wrapper">
    <div class="cs-top-bg"></div>

    <div class="cs-container">
        
        <!-- 헤더 / 채널톡 안내문 -->
        <div class="cs-header hc-animate-fade-in-up">
            <h3 class="cs-micro">{{{microCopy}}}</h3>
            <h2 class="cs-headline">{{{headline}}}</h2>
            
            {{#if subheadline}}
            <p class="cs-subheadline">{{{subheadline}}}</p>
            {{/if subheadline}}

            <!-- 상담시간 안내 테두리 뱃지 -->
            {{#if bullet.0}}
            <div class="cs-time-badge">
                상담시간 : {{{bullet.0}}} (점심시간 : {{{bullet.1}}})
            </div>
            {{/if bullet.0}}
        </div>

        <!-- 이미지 영역 (스마트폰 목업 등) -->
        {{#if imageUrl}}
        <div class="cs-mockup-area hc-animate-fade-in-up" style="animation-delay: 200ms;">
            <img src="{{imageUrl}}" alt="CS Mockup" class="cs-mockup-img" />
            <!-- 플러스친구 ID 태그 -->
            {{#if bullet.2}}
            <div class="cs-id-tag">
                플러스친구 ID : <strong>{{{bullet.2}}}</strong>
            </div>
            {{/if bullet.2}}
        </div>
        {{/if imageUrl}}

        <!-- 안내 카드 리스트 -->
        <div class="cs-card-list">
            
            <!-- 첫번째 안내 카드 (어두운 배경) -->
            <div class="cs-card cs-card-dark hc-animate-fade-in-up" style="animation-delay: 300ms;">
                <div class="cs-card-title">
                    <svg viewBox="0 0 24 24" class="cs-icon"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    <h4>{{{bullet.3}}}</h4>
                </div>
                <div class="cs-card-body">
                    {{{bullet.4}}}
                </div>
            </div>

            <!-- 두번째 안내 카드 (밝은 배경) -->
            <div class="cs-card cs-card-light hc-animate-fade-in-up" style="animation-delay: 400ms;">
                <div class="cs-card-title">
                    <svg viewBox="0 0 24 24" class="cs-icon"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    <h4>{{{bullet.5}}}</h4>
                </div>
                <div class="cs-card-body">
                    {{{bullet.6}}}
                </div>
            </div>

        </div>

    </div>
</section>
`;

export const css = `
.cs-wrapper {
    position: relative;
    width: 100%;
    /* 배경은 노란색(위)에서 시작해 아래는 노란색 또는 밝은 회색으로 이어질 수 있으나 레퍼런스는 전체 노란색 베이스입니다 */
    background-color: #ffe812; /* 카카오톡 옐로우 */
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 6rem 0 8rem 0;
    overflow: hidden;
}

/* 상단 배경 데코 (원한다면 추가 가능) */
.cs-top-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 50%;
    background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
}

.cs-container {
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.cs-header {
    text-align: center;
    margin-bottom: 2rem;
    color: #111;
}

.cs-micro {
    font-size: 2.2rem;
    font-weight: 500;
    margin: 0;
    color: #222;
}

.cs-headline {
    font-size: 4rem;
    font-weight: 900;
    margin: 0.5rem 0 1.5rem 0;
    line-height: 1.1;
    letter-spacing: -0.05em;
    color: #111;
}

.cs-subheadline {
    font-size: 1.15rem;
    font-weight: 500;
    color: #333;
    margin: 0 0 1.5rem 0;
    word-break: keep-all;
}

/* 상담시간 테두리 배지 */
.cs-time-badge {
    display: inline-block;
    padding: 0.8rem 2rem;
    border: 1px solid #111;
    border-radius: 40px;
    font-size: 1.15rem;
    font-weight: 600;
    color: #111;
}

/* 폰 목업 또는 일러스트 영역 */
.cs-mockup-area {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin-bottom: -5rem; /* 아래쪽 카드에 걸치기 위해 음수 마진 */
    z-index: 10;
    display: flex;
    justify-content: center;
}

.cs-mockup-img {
    width: 100%;
    height: auto;
    object-fit: contain;
    /* 필드가 투명 PNG라고 가정. 아니어도 문제없으나 깔끔함 고려 */
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));
}

/* 폰 우측/좌측 떠있는 태그 뱃지 */
.cs-id-tag {
    position: absolute;
    bottom: 25%;
    right: -10%;
    background-color: #444; /* 다크그레이 */
    color: #fff;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-size: 1.1rem;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    /* 꼬리 (말풍선처럼) 필요 시 추가가능 */
}
.cs-id-tag strong {
    font-weight: 800;
}

/* 하안 안내 카드 리스트 영역 */
.cs-card-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    z-index: 5;
}

/* 공통 카드 스타일 */
.cs-card {
    width: 100%;
    padding: 4rem 3rem 3rem 3rem; /* 윗 여백 크게 줘서 이미지와 자연스럽게 겹침대비 */
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* 다크 카드 (위쪽) */
.cs-card-dark {
    background-color: #333333;
    color: #ffffff;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}
.cs-card-dark .cs-icon {
    fill: #ffffff;
    border-color: #ffffff;
}
.cs-card-dark .cs-card-body p { color: #dddddd; }

/* 라이트 카드 (아래쪽) */
.cs-card-light {
    background-color: #ffffff;
    color: #111111;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    /* 다크카드 아래에 위치해 padding-top 리셋 */
    padding-top: 3rem; 
}
.cs-card-light .cs-icon {
    fill: #111111;
    border-color: #111111;
}
.cs-card-light .cs-card-body p { color: #555555; }

/* 타이틀부 (원형 아이콘 + 텍스트) */
.cs-card-title {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.cs-icon {
    width: 44px;
    height: 44px;
    border: 2px solid;
    border-radius: 50%;
    padding: 8px;
}

.cs-card-title h4 {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0;
}

/* 본문 (줄바꿈/리스트 구조를 p태그나 html 스트링으로 처리) */
.cs-card-body {
    padding-left: 0.5rem; /* 아이콘보다 살짝 들어가게 */
}
.cs-card-body p {
    font-size: 1.05rem;
    line-height: 1.8;
    margin: 0;
    word-break: keep-all;
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
    .cs-wrapper { padding: 4rem 0; }
    .cs-micro { font-size: 1.6rem; }
    .cs-headline { font-size: 2.8rem; }
    .cs-subheadline { font-size: 0.95rem; }
    
    .cs-time-badge { font-size: 0.9rem; padding: 0.6rem 1.2rem; }
    
    .cs-mockup-area { max-width: 280px; margin-bottom: -3rem; }
    .cs-id-tag { 
        right: 0; bottom: 15%; 
        font-size: 0.9rem; padding: 0.5rem 1rem; 
    }
    
    .cs-card { padding: 3rem 1.5rem 2rem 1.5rem; }
    .cs-card-light { padding-top: 2rem; }
    
    .cs-card-title h4 { font-size: 1.3rem; }
    .cs-icon { width: 36px; height: 36px; padding: 6px; }
    .cs-card-body p { font-size: 0.9rem; }
}
`;
