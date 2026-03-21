export const html = `
<section class="ipr-wrapper">
    <div class="ipr-container">
        
        <!-- 탑 헤더: 이벤트 제목 등 -->
        <div class="ipr-header hc-animate-fade-in-up">
            {{#if microCopy}}
            <p class="ipr-micro">{{{microCopy}}}</p>
            {{/if microCopy}}
            
            <h2 class="ipr-headline">{{{headline}}}</h2>
            
            {{#if subheadline}}
            <p class="ipr-subheadline">{{{subheadline}}}</p>
            {{/if subheadline}}
        </div>

        <!-- 인스타그램 스타일 포토 뷰어 -->
        <div class="ipr-photo-box hc-animate-fade-in-up" style="animation-delay: 200ms;">
            
            <!-- 포토 (Square) -->
            <div class="ipr-image-area">
                <img src="{{imageUrl}}" alt="Photo Review" class="ipr-img" />
                
                <!-- 이미지 위 둥둥 뜨는 말풍선들 (옵션) -->
                {{#if bullet.0}}
                <div class="ipr-tooltip ipr-tooltip-left">
                    <p>{{{bullet.0}}}</p>
                    <div class="ipr-tail ipr-tail-right"></div>
                </div>
                {{/if bullet.0}}

                {{#if bullet.1}}
                <div class="ipr-tooltip ipr-tooltip-right">
                    <p>{{{bullet.1}}}</p>
                    <div class="ipr-tail ipr-tail-left"></div>
                </div>
                {{/if bullet.1}}
                
            </div>

            <!-- 인스타그램 하단 액션바 (좋아요, 댓글, 공유, 북마크) -->
            <div class="ipr-action-bar">
                <div class="ipr-actions-left">
                    <svg viewBox="0 0 24 24" class="ipr-icon ipr-icon-heart"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <svg viewBox="0 0 24 24" class="ipr-icon"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                    <svg viewBox="0 0 24 24" class="ipr-icon"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </div>
                <div class="ipr-actions-right">
                    <svg viewBox="0 0 24 24" class="ipr-icon"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                </div>
            </div>

            <!-- 인스타그램 텍스트 내용부 (본문 복사용) -->
            {{#if body}}
            <div class="ipr-content-text">
                <span class="ipr-username">brand_official</span> <!-- 임의의 공식 계정명 -->
                <span class="ipr-desc">{{{body}}}</span>
            </div>
            {{/if body}}

        </div>

    </div>
</section>
`;

export const css = `
.ipr-wrapper {
    position: relative;
    width: 100%;
    /* 레퍼런스들의 깨끗한 라이트브라운/민트 등 연한 배경 */
    background-color: #f1ebd8; 
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    padding: 8rem 0;
    overflow: hidden;
}

.ipr-container {
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 5;
    padding: 0 5%;
}

.ipr-header {
    text-align: center;
    margin-bottom: 3rem;
    color: #111; /* 배경이 밝은 계열이므로 다크 텍스트 */
}

.ipr-micro {
    font-size: 1.15rem;
    font-weight: 500;
    margin: 0 0 1rem 0;
    letter-spacing: -0.02em;
    color: #666;
}

.ipr-headline {
    font-size: 3rem;
    font-weight: 900;
    margin: 0;
    line-height: 1.25;
    letter-spacing: -0.05em;
    color: #111;
}

.ipr-subheadline {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 1rem 0 0 0;
    color: #444;
}

/* 인스타그램 형태의 포토 액자 박스 */
.ipr-photo-box {
    width: 100%;
    max-width: 500px;
    background-color: #fff;
    padding: 1.5rem;
    padding-bottom: 2rem;
    border-radius: 6px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.ipr-image-area {
    width: 100%;
    /* 1:1 비율을 위해 padding-bottom 트릭 혹은 aspect-ratio 사용. 최신 트렌드를 위해 aspect-ratio */
    aspect-ratio: 1 / 1;
    position: relative;
    overflow: hidden;
    background-color: #f8f8f8; /* 사진 로딩전 배경 */
}

.ipr-img {
    width: 100%;
    height: 100%;
    object-fit: contain; /* 사진 잘리는걸 원치않으면 cover 대신 contain 또는 cover 선택 (대부분 정사각형 맞춤 cover) */
    background-color: #e5e5e5;
}

/* 이미지 위로 뜨는 말풍선 */
.ipr-tooltip {
    position: absolute;
    background-color: #111;
    color: #fff;
    padding: 0.8rem 1.2rem;
    border-radius: 30px;
    font-size: 1.05rem;
    font-weight: 600;
    box-shadow: 0 8px 15px rgba(0,0,0,0.2);
    display: block;
    z-index: 10;
    line-height: 1.3;
}
.ipr-tooltip p { margin: 0; }

.ipr-tail {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #111;
    transform: rotate(45deg);
}

/* 왼쪽 툴팁 설정 */
.ipr-tooltip-left {
    top: 30%;
    left: 10%;
    animation: ipr-float 3s ease-in-out infinite alternate;
}
.ipr-tooltip-left .ipr-tail-right {
    top: 50%;
    right: -6px;
    margin-top: -6px;
}

/* 오른쪽 툴팁 설정 (좀 더 아래에 위치) */
.ipr-tooltip-right {
    bottom: 20%;
    right: 5%;
    animation: ipr-float 3.5s ease-in-out infinite alternate;
    animation-delay: -1.5s;
}
.ipr-tooltip-right .ipr-tail-left {
    top: 50%;
    left: -6px;
    margin-top: -6px;
}

@keyframes ipr-float {
    from { transform: translateY(0px); }
    to { transform: translateY(-8px); }
}

/* 하단 아이콘 (좋아요 등) */
.ipr-action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 0 0.8rem 0;
}

.ipr-actions-left {
    display: flex;
    gap: 1.2rem;
}

.ipr-icon {
    width: 28px;
    height: 28px;
    fill: #111; /* 빈 아이콘의 경우 stroke로 처리하거나 fill로 처리. 여기선 단순화. 하트 빼곤 outline이 좋으나 디자인 편의상 fill 블랙 */
}
/* 하트 아이콘은 빨간색으로 포인트 처리 */
.ipr-icon-heart {
    fill: #ff2d55;
}

/* 설명 텍스트 영역 */
.ipr-content-text {
    width: 100%;
    margin-top: 0.5rem;
}

.ipr-username {
    font-weight: 800;
    color: #111;
    font-size: 1.05rem;
    margin-right: 0.5rem;
}

.ipr-desc {
    font-size: 1.05rem;
    font-weight: 400;
    color: #333;
    line-height: 1.6;
    word-break: break-all;
}

/* 설명창안에 해시태그 파란색 강조 처리되도록 사용할수있음 (HTML내 <span> 태그 등으로 조작) */

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
    .ipr-wrapper { padding: 4rem 0; }
    .ipr-headline { font-size: 2.3rem; }
    .ipr-subheadline { font-size: 1.1rem; }
    .ipr-tooltip { font-size: 0.9rem; padding: 0.6rem 1rem; }
    
    .ipr-photo-box { padding: 1rem; padding-bottom: 1.5rem; }
    .ipr-icon { width: 24px; height: 24px; }
    
    .ipr-desc { font-size: 0.95rem; }
    .ipr-username { font-size: 0.95rem; }
}
`;
