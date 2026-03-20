# 자율 주행 마케팅 엔진 — 프로젝트 정독 문서

## 1. 프로젝트 개요

**제품 정보 입력 → AI 12엔진 파이프라인 → 랜딩페이지 자동 생성 + 전환율 자동 최적화**

사용자가 제품 정보(이름, 업종, 가격대, 타겟 등)를 입력하면, 12개의 AI+규칙 엔진이 순차 실행되어 전환율 최적화된 랜딩페이지 HTML을 자동 생성한다. 배포 후에는 학습 루프(Engine 12)가 트래킹 데이터를 분석하고, 진단→처방→A/B 테스트→승리 패턴 기록까지 자동 수행한다.

### 기술 스택
| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript (strict mode) |
| 스타일 | Tailwind CSS v4 |
| 상태관리 | Zustand 5 |
| DB | PostgreSQL + Prisma 7 |
| 캐시 | Upstash Redis |
| AI | Anthropic Claude Sonnet 4 + Google Gemini 2.0 Flash |
| 결제 | PayApp (한국 PG) |
| 스토리지 | Cloudflare R2 (S3 호환) |
| 배포 | Vercel (커스텀 도메인 지원) |
| 큐 | BullMQ + IORedis |
| 이메일 | Resend API |
| 모니터링 | Sentry |
| E2E 테스트 | Playwright |

---

## 2. 디렉토리 구조

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 공개 마케팅 랜딩페이지
│   ├── login/page.tsx            # Google OAuth 로그인
│   ├── p/[slug]/page.tsx         # 배포된 랜딩페이지 (공개)
│   ├── (dashboard)/              # 인증 필요 대시보드
│   │   ├── layout.tsx            # 사이드바 + 헤더 레이아웃
│   │   ├── projects/             # 프로젝트 목록/상세/에디터
│   │   ├── billing/              # 결제/구독 관리
│   │   ├── settings/             # 설정
│   │   └── admin/                # 관리자 대시보드
│   └── api/                      # API 라우트
│       ├── projects/             # CRUD + generate + deploy + export
│       ├── billing/              # 결제 + 웹훅 + 트라이얼
│       ├── admin/                # 관리자 API
│       ├── wizard/questions/     # AI 심화 질문 생성
│       ├── upload/               # R2 업로드 URL 발급
│       ├── track/                # 트래킹 이벤트 수집
│       └── cron/                 # 구독만료/일일진단/사용량 알림
├── engine/                       # 12엔진 파이프라인
│   ├── pipeline.ts               # 오케스트레이터
│   ├── cross-engine-bridge.ts    # 엔진 간 교차 반영
│   ├── 01-product-intelligence/  # ① 제품 분석 (AI)
│   ├── 02-why-now/               # ② 긴급성 분석 (규칙)
│   ├── 03-conversion-strategy/   # ③ 전환 전략 (AI+규칙)
│   ├── 04-objection-killer/      # ④ 반론 방어 (규칙)
│   ├── 05-psychological-copy/    # ⑤ 설득 카피 (AI+품질게이트)
│   ├── 06-trust-architecture/    # ⑥ 신뢰 구조 (규칙)
│   ├── 07-attention-architecture/# ⑦ 주목도 설계 (규칙)
│   ├── 08-layout-intelligence/   # ⑧ 레이아웃 (규칙+42패턴)
│   ├── 09-visual-style/          # ⑨ 비주얼 스타일 (규칙+10프리셋)
│   ├── 10-code-engine/           # ⑩ HTML 코드 생성 (규칙)
│   ├── 11-deploy/                # ⑪ 배포 (DB)
│   ├── 12-learning-loop/         # ⑫ 자율 학습 (분석+진단+A/B)
│   └── image-generation/         # 이미지 생성 (Gemini)
├── lib/                          # 공통 라이브러리
│   ├── ai/                       # AI 클라이언트 (Claude, Gemini)
│   ├── auth.ts, auth.config.ts   # NextAuth (Google OAuth)
│   ├── db.ts                     # Prisma 싱글턴
│   ├── redis.ts                  # Upstash Redis
│   ├── billing.ts                # 플랜/쿼터/사용량
│   ├── credit.ts                 # 크레딧 시스템
│   ├── coupon.ts                 # 쿠폰 검증/적용
│   ├── payapp.ts                 # PayApp 결제 게이트웨이
│   ├── email.ts                  # Resend 이메일
│   ├── queue.ts                  # BullMQ 큐 (6종)
│   ├── r2.ts                     # Cloudflare R2 스토리지
│   ├── sse.ts                    # Server-Sent Events
│   ├── vercel.ts                 # 커스텀 도메인 (Vercel API)
│   └── utils.ts                  # cn() (Tailwind 클래스 병합)
├── stores/                       # Zustand 스토어
│   ├── wizard-store.ts           # 프로젝트 생성 위저드 상태
│   ├── editor-store.ts           # 에디터 상태
│   ├── project-store.ts          # (플레이스홀더)
│   └── ui-store.ts               # (플레이스홀더)
├── components/                   # 리액트 컴포넌트
│   ├── ui/                       # shadcn/UI 기반 공통 컴포넌트
│   ├── wizard/                   # 위저드 4단계 컴포넌트
│   ├── editor/                   # 에디터 3패널 컴포넌트
│   ├── analytics/                # 분석 대시보드 컴포넌트
│   ├── export/                   # 내보내기 패널
│   └── providers.tsx             # SessionProvider + Toaster
└── middleware.ts                  # 인증 미들웨어
prisma/
└── schema.prisma                 # DB 스키마 (18 모델)
```

---

## 3. 12엔진 파이프라인 상세

### 실행 흐름

```
사용자 입력 (제품정보+이미지+심화답변)
   │
   ▼
① Product Intelligence (AI×3) ─→ ProductBrief
   │    - Phase A: 제품 DNA (핵심가치, USP, 포지셔닝)
   │    - Phase B: 고객심리 (표면→진짜→숨은 욕구, 공포, 저항 5단계)
   │    - Phase C: 시장 맥락 (경쟁도, 구매주기, 의사결정 시간)
   │
   ▼
② Why Now (규칙) ─→ UrgencyBrief
   │    - 긴급성 유형: time/quantity/situational/emotional/price_anchor
   │    - 업종+가격+공포 수준에 따라 자동 결정
   │
   ▼
③ Conversion Strategy (AI×1+규칙) ─→ StrategyBlueprint
   │    - 전략 유형: direct_sale/lead_gen/free_trial/content_hook/event
   │    - 섹션 수: 5~16개 (의사결정 시간+가격 저항에 따라 가변)
   │    - AI가 섹션 구조 생성 (역할: HOOK→PAIN→SOLUTION→PROOF→OBJECTION→URGENCY→CTA)
   │
   ▼
④ Objection Killer (규칙) ─→ ObjectionMap
   │    - 저항 Lv3 이상만 활성화
   │    - 전략: daily_split, roi_calculator, guarantee_badge, three_step_guide 등
   │    - 주입 위치 자동 결정
   │
   ▼
⑤ Psychological Copy (AI×1~3+품질게이트) ─→ CopyBlocks
   │    - Claude가 전체 섹션 카피 생성
   │    - 품질 게이트: 프레임 점수(60%)+톤 점수(40%) → 80점 미만 재생성 (최대 2회)
   │    - 업종별 톤 매트릭스 적용 (SaaS=간결+데이터, 뷰티=감성, 건강=전문+신뢰...)
   │
   ▼
⑥ Trust Architecture (규칙) ─→ TrustConfig
   │    - 6단계 신뢰: 존재감→전문성→제3자검증→사회증명→안전장치→동료압력
   │    - 각 레벨을 적절한 섹션에 배치
   │
   ▼
⑦ Attention Architecture (규칙) ─→ AttentionConfig
   │    - 훅 유형: visual/question/result/social (의사결정유형별)
   │    - 시선 패턴: F/Z/center_focus (업종별)
   │    - 4개 Zone: first_view → interest → desire → action
   │
   ▼
⑧ Layout Intelligence (규칙+42패턴) ─→ LayoutConfig
   │    - 42개 레이아웃 패턴 라이브러리 (hero 8, feature 10, proof 6, pricing 4, CTA 5, FAQ 3, misc 6)
   │    - 점수제 매칭: Zone적합(30%)+모바일(25%)+의사결정유형(20%)+콘텐츠양(15%)+다양성(10%)
   │
   ▼
⑨ Visual Style (규칙+10프리셋) ─→ StyleConfig
   │    - 10개 무드: luxury, clean, tech, natural, fun, professional, startup, premium, bold, minimal
   │    - 디자인 토큰: 색상, 타이포그래피, 간격, 라운드, 그림자
   │
   ▼
   ╔══════════════════════════════════════╗
   ║  Cross-Engine Bridge (교차 반영)      ║
   ║  ① Objection→Copy: 저항파괴 카피 주입 ║
   ║  ② Trust→Layout: 신뢰 배치 반영       ║
   ║  ③ Attention→Zone: Zone 어노테이션    ║
   ╚══════════════════════════════════════╝
   │
   ▼
⑩ Image Generation (Gemini×N) ─→ 이미지 CDN URL 주입
   │    - 이미지 필요 패턴 자동 식별
   │    - Gemini로 생성 → R2 업로드 → CDN URL → CopyBlocks에 주입
   │    - 최대 3개 동시 생성
   │
   ▼
⑪ Code Engine (규칙) ─→ GeneratedPage (완전한 반응형 HTML)
   │    - 글로벌 CSS + 섹션별 HTML 렌더링 + 폰트 + Zone data 속성 주입
   │    - Sticky CTA 바, 트래킹 스크립트 포함
   │    - 모바일 반응형 (768px 브레이크포인트)
   │
   ▼
⑫ 결과 저장 → DB (Project 테이블에 모든 엔진 출력 JSON 저장)
```

### AI 호출 요약

| 엔진 | AI 모델 | 호출 수 | 용도 |
|------|--------|---------|------|
| ① Product Intelligence | Claude Sonnet 4 | 3회 | 제품 DNA + 고객심리 + 시장분석 |
| ③ Conversion Strategy | Claude Sonnet 4 | 1회 | 섹션 구조 생성 |
| ⑤ Psychological Copy | Claude Sonnet 4 | 1~3회 | 전체 카피 + 품질 재생성 |
| Image Generation | Gemini 2.0 Flash | N회 | 섹션별 이미지 생성 |

나머지 8개 엔진은 모두 **규칙 기반** (AI 호출 없음).

---

## 4. 데이터베이스 스키마 (18 모델)

### 핵심 모델 관계도

```
User ──┬── Account (OAuth)
       ├── Session
       └── Membership ──── Organization ──┬── Project ──┬── Section
                                          │             ├── PageVersion
                                          │             ├── ABTest
                                          │             ├── DailyAnalytics
                                          │             ├── DiagnosisLog
                                          │             └── GeneratedImage
                                          ├── Subscription
                                          ├── Payment
                                          ├── CouponRedemption
                                          └── CreditBalance ── CreditTransaction
```

### 주요 모델 설명

| 모델 | 역할 |
|------|------|
| **User** | Google OAuth 사용자 (이메일, 이름, isAdmin) |
| **Organization** | 워크스페이스 (플랜, 쿼터) — 가입 시 자동 생성 |
| **Membership** | User↔Org 연결 (OWNER/ADMIN/MEMBER) |
| **Project** | 랜딩페이지 프로젝트 — 모든 엔진 출력을 Json 필드로 저장 |
| **Section** | 프로젝트의 개별 섹션 (카피, 레이아웃, 이미지, 신뢰/저항 메타) |
| **PageVersion** | A/B 테스트용 버전 (HTML, 트래픽 가중치, 전환율) |
| **ABTest** | A/B 테스트 (control↔variant, 통계적 유의도) |
| **DailyAnalytics** | 일별 트래픽/전환/참여도/유입원/디바이스 |
| **SectionAnalytics** | 섹션별 노출/체류/이탈/CTA클릭 |
| **DiagnosisLog** | AI 진단 결과 (유형, 심각도, 처방, 적용 결과) |
| **WinningPattern** | A/B 테스트 승리 패턴 (업종+목표별 축적) |
| **Subscription** | 구독 (ACTIVE/PAST_DUE/GRACE_PERIOD/CANCELLED, 트라이얼) |
| **Payment** | 결제 기록 (PayApp, 원화) |
| **Coupon** | 할인 쿠폰 (퍼센트/정액, 플랜 제한, 기간/횟수 제한) |
| **CreditBalance** | 크레딧 잔액 (충전/차감/환불) |
| **GeneratedImage** | Gemini 생성 이미지 (R2 키, CDN URL, 프롬프트, 비용) |

### 프로젝트 상태 흐름

```
DRAFT → GENERATING → GENERATED → EDITING → DEPLOYED → ARCHIVED
```

---

## 5. 사용자 플로우

### 5-1. 프로젝트 생성 위저드 (4단계)

1. **기본 정보** — 제품명, 업종(10종), 가격대, 페이지 목표(6종), 타겟, 경쟁사 URL
2. **이미지 업로드** — 최대 5장 (R2 presigned URL로 업로드)
3. **심화 질문** — Claude가 생성한 5개 질문에 답변 (최소 10자)
4. **품질 점수** — 입력 품질 0~100 (기본정보 30점 + 이미지 20점 + 심화답변 50점)
   - 30점 이상이면 프로젝트 생성 가능
   - POST `/api/projects` → 프로젝트 생성 → 상세 페이지 이동

### 5-2. AI 생성

- 프로젝트 상세에서 "AI 분석 시작" 클릭
- SSE 스트림으로 12단계 진행률 실시간 표시
- 각 단계별 emoji + 상태(start/done) + 퍼센트 표시
- 완료 시 미리보기/에디터/배포 접근 가능

### 5-3. 에디터

- **3패널 구성**: 섹션 목록(좌) | 실시간 미리보기(중) | 카피/레이아웃 편집(우)
- 섹션 순서 변경, 삭제, 카피 수정, 레이아웃 패턴 변경
- 저장 시 Code Engine 재실행 → HTML 재생성

### 5-4. 배포 & 분석

- `/p/{slug}` 경로로 배포 (iframe 렌더링)
- 트래킹 스크립트 자동 삽입 (scroll, section_view, cta_click, conversion 등)
- Engine 12 Learning Loop: 일일 진단 → 처방 → A/B 테스트 자동 생성
- 95% 신뢰도 도달 시 자동으로 승자 선정 → 트래픽 전환

### 5-5. 내보내기

- **HTML 파일**: 트래킹 제거 후 단일 파일 다운로드
- **React ZIP**: Next.js 프로젝트 구조로 변환 (pkg.json, tsconfig, layout, page, section 컴포넌트)
- **커스텀 도메인**: Vercel API로 도메인 등록 + DNS 검증 + SSL

---

## 6. 결제 시스템

### 플랜 구조

| 플랜 | 가격 | 프로젝트 | 월 생성 | 배포 | 주요 기능 |
|------|------|---------|---------|------|----------|
| FREE | 0원 | 3개 | 5회 | 1개 | 기본 내보내기, 분석 |
| PRO | 29,000원/월 | 20개 | 50회 | 5개 | 커스텀 도메인, A/B 테스트 |
| BUSINESS | 79,000원/월 | 100개 | 무제한 | 무제한 | 전체 기능 |

### 크레딧 시스템

- 트라이얼 시 5크레딧 보너스
- 생성/재생성/이미지 생성 시 차감
- 구매/프로모션/관리자 수동 충전 가능

### 구독 생명주기

```
ACTIVE → (미갱신) → PAST_DUE → (7일) → GRACE_PERIOD → (14일) → CANCELLED → FREE
                 → (취소 요청) → cancelAtPeriodEnd → 기간 종료 시 CANCELLED
```

Cron Job (`/api/cron/subscription-expire`)이 매일 상태 전환 + 이메일 발송 처리.

---

## 7. 인증 & 권한

- **Google OAuth** (NextAuth v5 beta)
- **미들웨어**: 공개 경로(`/`, `/login`, `/p/`, `/api/track`, `/pricing`) 외 모든 경로 인증 필수
- **조직 기반**: 가입 시 자동 Organization 생성, 사용자는 OWNER로 설정
- **관리자**: `User.isAdmin = true` → 관리자 API 접근 가능

---

## 8. 핵심 라이브러리

### AI 클라이언트

- **Claude** (`lib/ai/claude.ts`): `askClaude<T>(system, user)` → JSON 응답 파싱, 비용 추적 (input $3/1M, output $15/1M)
- **Gemini** (`lib/ai/gemini.ts`): `generateImage(prompt, ref?)` → Buffer + MIME, 비용 $0.04/장

### 인프라

- **BullMQ**: 6개 큐 (generation, regeneration, imageGeneration, diagnosis, abTest, analytics)
- **R2**: presigned 업로드(10분), 다운로드(2시간), CDN URL
- **SSE**: 장시간 작업 실시간 스트리밍 (30초 하트비트)
- **Vercel API**: 커스텀 도메인 등록/제거/DNS 검증/SSL 상태

---

## 9. 아키텍처 핵심 원칙

1. **순차 파이프라인**: 각 엔진의 출력이 다음 엔진의 입력으로 흘러감
2. **AI+규칙 하이브리드**: 전략적 결정은 AI(Claude), 전술적 실행은 규칙 기반
3. **품질 게이트**: 카피 엔진이 80점 미만 섹션을 자동 재생성 (최대 2회)
4. **비용 추적**: 파이프라인 전체에서 AI 호출 비용 누적
5. **Cross-Engine Bridge**: Objection→Copy, Trust→Layout, Attention→Zone 교차 반영
6. **심리학 프레임워크**: PAIN→SOLUTION→PROOF→OBJECTION→URGENCY→CTA 구조
7. **업종 인식**: 모든 엔진이 업종 카테고리에 맞게 출력 조정
8. **모바일 퍼스트**: 레이아웃 패턴이 모바일 응답성으로 점수화
9. **자율 학습**: Engine 12가 문제 진단 → A/B 테스트 → 승리 패턴 축적
10. **폐쇄 루프**: Engine 12 트래킹 스크립트가 Engine 10 HTML에 주입되어 완전한 피드백 루프 형성
