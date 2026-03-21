# 개발 순서 상세

## Phase 0: 기반 셋업 (1주)

### 0-1. 프로젝트 초기화
- Next.js 16 + TypeScript + Tailwind v4
- 폴더 구조 생성 (src/app, engine, components, lib, stores)
- CLAUDE.md 작성 (수정 규칙, import 규칙)
- ESLint, Prettier 설정

### 0-2. DB + ORM
- Prisma 스키마 (전체 모델 한번에)
  - User, Organization, Membership
  - Project, Section, PageVersion
  - ABTest, DailyAnalytics, SectionAnalytics
  - DiagnosisLog, WinningPattern, GeneratedImage
  - Subscription, Payment
- Supabase 연결
- prisma db push

### 0-3. 인증
- Google OAuth (NextAuth / Auth.js)
- 세션 관리
- Organization 자동 생성
- 미들웨어 (인증 가드)

### 0-4. 인프라 연결
- Upstash Redis 클라이언트 (lib/redis.ts)
- Cloudflare R2 클라이언트 (lib/r2.ts)
- BullMQ 큐 설정 (lib/queue.ts)
- AI 클라이언트 (lib/ai/claude.ts, gemini.ts)
- SSE 유틸 (lib/sse.ts)

### 0-5. 공용 UI
- shadcn/ui 기본 컴포넌트
- 레이아웃 (사이드바 + 헤더)
- 로딩/에러 상태
- 토스트/모달

---

## Phase 1: MVP 엔진 — 입력→전략→카피→미리보기 (3주)

### 1-1. 입력 위저드 UI (3일)
- Step 1: 기본 정보 폼 (제품명, 업종, 가격, 목표)
- Step 2: 이미지 업로드 (R2 presigned URL)
- Step 3: AI 심층 질문 (동적 폼)
- Step 4: 입력 품질 스코어링 (점수 표시)
- Project 생성 API
- Zustand store (wizard-store)

### 1-2. 엔진 ① Product Intelligence (3일)
- prompts.ts — Claude 프롬프트 3개
  - Phase A: 제품 DNA 추출
  - Phase B: 고객 심리 분석
  - Phase C: 시장 컨텍스트
- types.ts — ProductBrief 타입
- index.ts — 실행 로직 (AI 3회 호출)
- rules.ts — 입력 보강 규칙
- 출력: ProductBrief JSON → DB 저장

### 1-3. 엔진 ② Why Now (1일)
- 긴급성 5유형 분기 로직 (순수 IF/ELSE)
- types.ts — UrgencyBrief 타입
- index.ts — 자동 선택 + 복합 조합
- 출력: UrgencyBrief JSON

### 1-4. 엔진 ③ Conversion Strategy (2일)
- prompts.ts — 전략 유형 선택 프롬프트
- rules.ts — 업종별 최적 구조 매핑
  - SaaS + Free Trial
  - 이커머스 + Direct Sale
  - 교육 + Lead Gen
  - 범용 템플릿 3~4개
- index.ts — AI 1회 + 규칙 조합
- 섹션 수 결정 로직
- 섹션별 역할(HOOK/PAIN/SOLUTION/...) 배정
- 출력: StrategyBlueprint JSON (섹션 리스트)

### 1-5. 엔진 ⑤ Psychological Copy (3일)
- frames.ts — 섹션별 카피 프레임
  - HOOK: 질문형/충격형/공감형/결과형
  - PAIN: 나열형/스토리형/데이터형/감정형
  - SOLUTION: 대비형/발견형/약속형/증거형
  - CTA: 직접형/가치형/긴급형/안전형
- tone-matrix.ts — 업종×타겟 톤 매트릭스
- prompts.ts — 전체 섹션 카피 배치 생성 프롬프트
- quality-gate.ts — 80점 통과 + 재생성 (최대 3회)
- index.ts — AI 1회 배치 호출
- 출력: 섹션별 카피블록 7종 (headline~image_direction)

### 1-6. 파이프라인 오케스트레이터 (2일)
- pipeline.ts — ①→②→③→⑤ 순차 실행
- BullMQ generation 큐 연동
- SSE 진행률 전송
  - "제품 분석 중..." (①)
  - "전략 수립 중..." (③)
  - "카피 작성 중..." (⑤)
  - "완료"
- 에러 처리 + 재시도
- Worker 프로세스 (scripts/worker.ts)

### 1-7. 기본 미리보기 (2일)
- 프로젝트 상세 페이지 (/projects/[id])
- 생성 진행률 UI (SSE 연동)
- 섹션 리스트 미리보기 (카피만, 디자인 없음)
  - 역할 배지 (HOOK/PAIN/SOLUTION...)
  - 카피 내용 표시
  - 이미지 디렉션 표시
- 프로젝트 목록 페이지 (/projects)

---

## Phase 2: 디자인 레이어 — 레이아웃+스타일+이미지+코드 (2주)

### 2-1. 엔진 ⑧ Layout Intelligence (3일)
- patterns.ts — 42개 레이아웃 패턴 정의
  - Hero 8종
  - Feature 10종
  - Social Proof 6종
  - Pricing 4종
  - CTA 5종
  - FAQ 3종
  - 기타 6종
- scoring.ts — 자동 선택 점수 체계
  - Zone 적합성 (30%)
  - 모바일 친화도 (25%)
  - 의사결정유형 (20%)
  - 콘텐츠 양 (15%)
  - 시각적 다양성 (10%)
- index.ts — 섹션별 최적 패턴 선택
- 출력: 섹션별 layout_pattern 배정

### 2-2. 엔진 ⑨ Visual Style (2일)
- moods.ts — 10개 무드 프리셋 정의
- tokens.ts — 디자인 토큰 (컬러/타이포/스페이싱/곡률/그림자)
- color-extract.ts — 제품 이미지에서 브랜드 컬러 추출
- index.ts — 업종×포지셔닝→무드 자동 선택 + 토큰 생성
- 출력: StyleConfig JSON (토큰 세트)

### 2-3. 이미지 생성 파이프라인 (3일)
- Gemini Flash multimodal 연동
  - inline_data로 제품 이미지 전송
  - conversation_id로 시리즈 통일감
  - 768px 리사이즈 + JPEG 출력
  - 병렬 3개 동시 생성
- BullMQ image-generation 큐
- R2 업로드 + CDN URL
- 섹션별 image_direction → 이미지 프롬프트 변환
- 비용 최적화 (File API 재사용)

### 2-4. 엔진 ⑩ Code Engine (3일)
- templates/ — 섹션 컴포넌트 템플릿
  - HeroFullscreen.tsx
  - HeroSplit.tsx
  - FeatureGrid.tsx
  - TestimonialCarousel.tsx
  - PricingTable.tsx
  - FAQAccordion.tsx
  - CTABanner.tsx
  - ... (42패턴 → 우선 20개)
- compiler.ts — 섹션 조립기
  - 카피 + 이미지 + 레이아웃 + 스타일 → React 컴포넌트
  - 전체 페이지 조립
  - HTML 단독 파일 내보내기
- 반응형 처리 (모바일 퍼스트)
- Tailwind CSS 기반 스타일 적용

### 2-5. 파이프라인 확장 (1일)
- pipeline.ts 확장: ①→②→③→⑤→⑧→⑨→이미지→⑩
- SSE 진행률 추가
  - "레이아웃 설계 중..." (⑧)
  - "스타일 적용 중..." (⑨)
  - "이미지 생성 중... (3/10)" (이미지)
  - "페이지 빌드 중..." (⑩)
- 미리보기 업그레이드 (디자인 적용된 실제 페이지)

---

## Phase 3: 에디터 + 나머지 엔진 + 배포 (2주)

### 3-1. 엔진 ④ Objection Killer (1일)
- rules.ts — 저항별 파괴 전략 매핑 테이블
  - 가격 저항: 앵커링/분할/ROI/비교/번들
  - 신뢰 저항: 수치/로고/후기/보증/전문가
  - 필요성 저항: B/A/손실프레이밍/통계/공감
  - 복잡성 저항: 3-Step/영상/비교/지원
- index.ts — resistance_map level 3+ 자동 활성
- 출력: ObjectionMap (inject_at 위치 포함)

### 3-2. 엔진 ⑥ Trust Architecture (1일)
- rules.ts — 신뢰 6레벨 순서 규칙
  - Lv1 존재감 → Lv2 전문성 → Lv3 제3자 → Lv4 사회증명
  - Lv5 안전장치 (CTA 직전 고정)
  - Lv6 동료압력 (선택, 플로팅)
- index.ts — 섹션에 신뢰 요소 자동 배치
- 건너뛰기 방지 검증

### 3-3. 엔진 ⑦ Attention Architecture (1일)
- rules.ts — 4 Zone 배분 규칙
  - Zone 1 (0~600px): 비주얼 100%, 폼/가격 금지
  - Zone 2 (600~1800px): 비주얼 60% + 텍스트 40%
  - Zone 3 (1800~3000px): 텍스트 50% + 데이터 30%
  - Zone 4 (3000px~): CTA 70% + 안전장치 30%
- index.ts — 섹션→Zone 배정 + 주의력 리소스 계산
- 금지 규칙 검증 (Zone 1에 복잡 정보 등)

### 3-4. 파이프라인 완성 (1일)
- 전체 12엔진 파이프라인 연결
  - ①→②→③→④→⑤→⑥→⑦→⑧→⑨→이미지→⑩
- ④⑥⑦ 결과를 ⑤⑧⑩에 반영
  - Objection → 카피에 저항 파괴 문구 주입
  - Trust → 레이아웃에 신뢰 요소 배치
  - Attention → Zone별 레이아웃 보정
- 전체 품질 게이트 (최종 점수)

### 3-5. 에디터 UI (4일)
- 에디터 페이지 (/projects/[id]/editor)
- 좌측: 섹션 리스트 (드래그 순서 변경)
- 중앙: 실시간 미리보기 (iframe 또는 React 렌더)
- 우측: 편집 패널
  - 카피 수정 (headline, body, cta_text...)
  - 레이아웃 변경 (패턴 선택)
  - 스타일 조정 (무드, 컬러)
  - 이미지 교체 (재생성 / 업로드)
- 섹션 추가/삭제
- 섹션 재생성 API (개별 섹션만 AI 재실행)
- 저장 + 버전 관리

### 3-6. 엔진 ⑪ Deploy (2일)
- 자체 호스팅 (/p/[slug])
  - Edge Middleware (프로젝트 조회)
  - HTML 서빙 (CDN 캐시)
  - 트래킹 스크립트 주입 (<2KB)
- HTML 다운로드 (단독 파일)
- 코드 다운로드 (React ZIP)
- 커스텀 도메인 (CNAME 안내)
- 배포 ON/OFF API

---

## Phase 4: 분석 + 학습 루프 (2주)

### 4-1. 트래킹 스크립트 (2일)
- public/tracking.js (<2KB)
  - 페이지뷰
  - 스크롤 깊이 (10% 단위)
  - 섹션별 노출/체류시간
  - CTA 클릭
  - 전환 이벤트 (폼 제출, 구매 등)
  - 디바이스/유입원
- API: POST /api/track (이벤트 수집)
- Upstash Redis 버퍼 → 배치 DB 저장
- DailyAnalytics, SectionAnalytics 집계 크론

### 4-2. 분석 대시보드 (3일)
- 대시보드 페이지 (/projects/[id]/analytics)
- 전환율 추이 차트
- 섹션별 성과 히트맵
  - 노출률
  - 체류시간
  - 이탈률
  - CTA 클릭률
- 디바이스별/유입원별 분석
- 방문자 흐름 시각화
- 업종 평균 대비 비교

### 4-3. 엔진 ⑫ Learning Loop — 자동 진단 (2일)
- diagnosis.ts — 진단 로직
  - Hero 이탈 높음 → Hook 약함
  - 특정 섹션 이탈 → 설득 실패
  - CTA 도달+미클릭 → CTA 문제
  - 전체 고르게 이탈 → 구조 문제
  - 모바일만 저조 → 레이아웃 문제
- prescription.ts — 처방 (Level 1/2/3 판단)
- 크론: 매일 06:00 활성 프로젝트 스캔
  - 조건: 전환율 < 기준 AND 방문자 >= 100 AND 7일+
  - DiagnosisLog 기록
- 사용자 알림 (이메일/대시보드)

### 4-4. A/B 테스트 시스템 (3일)
- ab-test.ts — A/B 테스트 관리
  - 변형 생성 (Level 1: 카피/CTA, Level 2: 구조)
  - 트래픽 분배 (50/50, Edge Middleware)
  - 쿠키 기반 사용자 고정
  - 통계적 유의미성 판단
- 자동 판정 크론: 매일 09:00
  - 7일 데이터 비교
  - 승자 → 자동 교체 (Level 1) 또는 승인 요청 (Level 2~3)
  - 패자 → 롤백
- WinningPattern DB 기록
  - 업종×목표×패턴유형 분류
  - 다음 생성 시 ③ Strategy Engine 참조
- Level 3 재생성 권고 이메일 (30일 개선 없을 때)

---

## Phase 5: 비즈니스 (1주)

### 5-1. 결제 시스템 (3일)
- 플랜 정의 (Free/Pro/Business)
- 결제 연동 (PayApp 또는 Toss)
- 구독 관리 (생성/해지/변경)
- 웹훅 처리
- 사용량 추적 (월별 생성 횟수)

### 5-2. 사용량 제한 (1일)
- Free: 월 3회 생성, 워터마크
- Pro: 월 30회, 내보내기 전체
- Business: 월 100회, Learning Loop
- Rate Limit (Upstash)
- 쿼터 초과 UI

### 5-3. 랜딩/마케팅 페이지 (1일)
- 서비스 소개 페이지
- 가격 안내
- 가입 유도 CTA

### 5-4. 최종 검증 (1일)
- 전체 플로우 E2E 테스트
- 모바일 반응형 확인
- 성능 최적화 (Core Web Vitals)
- 보안 점검

---

## 총 일정: ~11주 (약 3개월)

```
Phase 0 (1주):  0-1 ~ 0-5  — 기반
Phase 1 (3주):  1-1 ~ 1-7  — MVP 엔진
Phase 2 (2주):  2-1 ~ 2-5  — 디자인 레이어
Phase 3 (2주):  3-1 ~ 3-6  — 에디터 + 나머지 엔진 + 배포
Phase 4 (2주):  4-1 ~ 4-4  — 분석 + 학습 루프
Phase 5 (1주):  5-1 ~ 5-4  — 비즈니스
```

## Ralph Loop 세션 단위

1세션 = 위 번호 1개 기준 (예: 0-1, 0-2, 1-1, ...)
