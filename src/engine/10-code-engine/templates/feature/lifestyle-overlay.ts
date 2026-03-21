export const html = `
<section class="ls-wrapper" style="background-image: url('{{imageUrl}}');">
    <!-- 모바일을 위한, 또는 텍스트 가독성을 위한 그라데이션 오버레이 적용 -->
    <div class="ls-overlay"></div>
    
    <div class="ls-container hc-animate-fade-in-up">
        <div class="ls-content">
            {{#if microCopy}}
            <p class="ls-micro">{{{microCopy}}}</p>
            {{/if microCopy}}
            
            <h2 class="ls-headline">{{{headline}}}</h2>
            
            {{#if subheadline}}
            <p class="ls-subheadline">{{{subheadline}}}</p>
            {{/if subheadline}}

            <!-- 추가적인 작은 스펙이나 키워드들 (bullet 0~4) -->
            <div class="ls-keywords">
            {{#if bullet.0}}<span class="ls-keyword">{{{bullet.0}}}</span>{{/if bullet.0}}
            {{#if bullet.1}}<span class="ls-keyword">{{{bullet.1}}}</span>{{/if bullet.1}}
            {{#if bullet.2}}<span class="ls-keyword">{{{bullet.2}}}</span>{{/if bullet.2}}
            {{#if bullet.3}}<span class="ls-keyword">{{{bullet.3}}}</span>{{/if bullet.3}}
            </div>
        </div>
    </div>
</section>
`;

export const css = `
.ls-wrapper {
    position: relative;
    width: 100%;
    /* 높이를 시원하게 뽑아줌 */
    min-height: 850px; 
    background-size: cover;
    background-position: center bottom; /* 하단 위주로 배치될 경우 */
    background-repeat: no-repeat;
    font-family: "Pretendard", -apple-system, sans-serif;
    display: flex;
    align-items: flex-start; /* 텍스트가 위쪽에 배치됨 */
    padding-top: 8rem; /* 위쪽 여백 */
    overflow: hidden;
}

/* 텍스트 가독성을 위한 오버레이 (위->아래 그라데이션) */
.ls-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    /* 상단은 살짝 검게, 하단은 투명하게 */
    background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%);
    z-index: 1;
}

.ls-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 5%;
    position: relative;
    z-index: 5;
    /* 텍스트 왼쪽 정렬 */
    display: flex;
    justify-content: flex-start;
}

.ls-content {
    max-width: 600px;
    color: #ffffff;
}

.ls-micro {
    font-size: 1.4rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 1rem 0;
}

.ls-headline {
    font-size: 4rem;
    font-weight: 800;
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
    letter-spacing: -0.02em;
    text-shadow: 0 4px 10px rgba(0,0,0,0.3); /* 밝은 배경 방지 */
}

.ls-subheadline {
    font-size: 1.8rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.5;
    margin: 0 0 2.5rem 0;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* 추가 키워드 영역 (ex: USB-C*3) */
.ls-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.ls-keyword {
    font-size: 1.4rem;
    font-weight: 700;
    color: #ffffff;
    text-transform: uppercase;
    text-shadow: 0 2px 6px rgba(0,0,0,0.4);
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

@media (max-width: 900px) {
    .ls-wrapper { min-height: 700px; padding-top: 6rem; background-position: center; }
    .ls-headline { font-size: 3.2rem; }
    .ls-subheadline { font-size: 1.5rem; }
}

@media (max-width: 600px) {
    /* 모바일에서는 사진이 배경에 가려질 수 있으므로, 텍스트 뒤에 짙은 오버레이 필수 */
    .ls-overlay { background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%); }
    .ls-wrapper { min-height: 600px; padding-top: 4rem; text-align: center; } /* 모바일 중앙정렬 변경 시도해도 됨 */
    .ls-container { justify-content: center; text-align: center; }
    .ls-keywords { justify-content: center; gap: 1rem; }
    
    .ls-headline { font-size: 2.6rem; }
    .ls-subheadline { font-size: 1.25rem; }
    .ls-keyword { font-size: 1.1rem; }
}
`;
