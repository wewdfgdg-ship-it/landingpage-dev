# 자율 주행 마케팅 엔진 — 전체 아키텍처

> **"스스로 판매를 최적화하는 AI 마케터"**
> 단순히 페이지를 그려주는 도구가 아니라, 스스로 가설을 세우고 실험하며 판매를 성사시키는 **Growth Hacker in a Box**

---

## 제품 한 줄 정의

제품 정보를 넣으면, AI가 판매 전략을 설계하고, 랜딩페이지를 만들고, 전환율을 모니터링하고, 스스로 개선한다.

### 두 가지 핵심 목표

```
목표 1. 첫 생성물의 퀄리티를 최상으로
  └── 12엔진이 전략→설득→카피→디자인을 한번에 판단
  └── "처음부터 85점짜리"를 만드는 것이 기본

목표 2. 자동 개선으로 완성도를 계속 높이기
  └── 전환율 모니터링 → 진단 → 재생성 → 반복
  └── 85점 → 90점 → 95점으로 점진적 진화
```

**사용자가 하는 일**: 입력 한 번 + 승인 몇 번
**AI가 하는 일**: 전략 → 설계 → 생성 → 배포 → 모니터링 → 진단 → 재생성 → 반복

---

## 핵심 포지셔닝

| 구분 | 일반 자동 구축 솔루션 | 이 시스템 |
|------|----------------------|-----------|
| 정체성 | AI 랜딩페이지 빌더 | AI 마케팅 브레인 |
| 운영 방식 | 사용자가 수동 수정 | 데이터 보고 엔진이 스스로 수정 |
| 최적화 단위 | 전체 페이지 변경만 | 미세 최적화(섹션/카피/CTA) ~ 전체 재생성까지, 전환율 데이터가 레벨을 자동 판단 |
| 학습 능력 | 누적 데이터 없음 | 전환율 모니터링 + 자동 최적화 반복 → 운영할수록 판매율 상승 |
| 핵심 차별화 | 템플릿 + AI 카피 | 전략→구조→콘텐츠→디자인 전 과정 AI 판단 |

### 최적화 3단계 (상황에 따라 자동 선택)

```
Level 1. 미세 최적화 (자동)
├── 카피 한 줄 교체, CTA 버튼 텍스트/색상 변경
├── 특정 섹션 이미지 교체
├── 위험도 낮음 → A/B 테스트 후 자동 적용
└── 예: "지금 시작하기" → "무료로 체험하기"

Level 2. 구조 최적화 (자동 + A/B)
├── 섹션 순서 변경, 레이아웃 패턴 교체
├── 섹션 추가/삭제
├── 위험도 중간 → A/B 테스트 필수
└── 예: Proof 섹션을 Solution 직후로 이동

Level 3. 전체 재생성 (사용자 승인)
├── 전략부터 다시 설계, 완전히 새로운 페이지
├── 기존 데이터 + WinningPattern 반영하여 더 나은 버전
├── 위험도 높음 → 사용자 확인 후 A/B 테스트
└── 예: 30일간 개선 없을 때 전면 리뉴얼
```

---

## 전체 파이프라인

```
User Input (구조화된 입력 설계)
         │
    ① Product Intelligence Engine     ← 병목. 여기서 결정됨
         │
    ② Why Now Engine                  ← 긴급성 자동 설계
         │
    ③ Conversion Strategy Engine      ← 판매 전략 + 페이지 구조
         │
    ④ Objection Killer Engine         ← 구매 저항 파괴
         │
    ⑤ Psychological Copy Engine       ← 심리 기반 카피
         │
    ⑥ Trust Architecture Engine       ← 신뢰 구조 설계
         │
    ⑦ Attention Architecture Engine   ← 주의력/시선/스크롤
         │
    ⑧ Layout Intelligence Engine      ← 레이아웃 패턴 조합
         │
    ⑨ Visual Style Engine             ← 스타일/이미지/톤
         │
    ⑩ Code Engine                     ← HTML/React 생성
         │
    ⑪ Deploy Engine                   ← 배포/호스팅
         │
    ⑫ Learning Loop Engine            ← 전환율 데이터 → 엔진 피드백
         │
         └──→ ①로 돌아감 (다음 생성물이 더 좋아짐)
```

---

## 시스템 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│                    사용자 인터페이스                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ 입력 위저드 │  │  에디터   │  │ 대시보드  │  │ 설정    │ │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └────┬────┘ │
└────────┼─────────────┼─────────────┼────────────┼──────┘
         │             │             │            │
┌────────▼─────────────▼─────────────▼────────────▼──────┐
│                    API Gateway (Next.js)                 │
│          인증 / Rate Limit / 라우팅 / SSE               │
└────────┬────────────────────────────────────────┬──────┘
         │                                        │
┌────────▼──────────────────┐  ┌──────────────────▼──────┐
│     생성 파이프라인         │  │     운영 파이프라인       │
│                            │  │                          │
│  ① Product Intelligence   │  │  ⑫ Learning Loop         │
│  ② Why Now                │  │     ├── 데이터 수집       │
│  ③ Conversion Strategy    │  │     ├── 자동 진단         │
│  ④ Objection Killer       │  │     ├── A/B 테스트        │
│  ⑤ Psychological Copy     │  │     └── 자동 교체         │
│  ⑥ Trust Architecture     │  │                          │
│  ⑦ Attention Architecture │  │  ⑪ Deploy                │
│  ⑧ Layout Intelligence    │  │     ├── 자체 호스팅       │
│  ⑨ Visual Style           │  │     ├── Edge 서빙         │
│  ⑩ Code Engine            │  │     └── 내보내기          │
│                            │  │                          │
└────────┬──────────────────┘  └──────────────────┬──────┘
         │                                        │
┌────────▼────────────────────────────────────────▼──────┐
│                    인프라 레이어                         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│  │Supabase│ │Upstash │ │  R2    │ │ Vercel │ │Gemini│ │
│  │  (DB)  │ │(Redis) │ │(파일)  │ │(배포)  │ │ (AI) │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └──────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 기술 스택

```
프론트엔드
├── Next.js 16 (App Router)
├── TypeScript
├── Tailwind CSS v4
├── Zustand 5 (상태관리)
├── Framer Motion (애니메이션)
└── React Server Components (에디터/대시보드)

백엔드
├── Next.js API Routes (메인 API)
├── BullMQ (비동기 작업 큐)
├── SSE (실시간 진행률)
└── Edge Functions (A/B 서빙, 배포 페이지)

AI
├── Claude Sonnet (전략/카피/분석 엔진)
├── Gemini Flash (이미지 생성)
└── 자체 규칙 엔진 (Strategy/Framework 판단)

인프라
├── Vercel (App + Edge + Cron)
├── Supabase (PostgreSQL)
├── Upstash (Redis: Queue + Cache + PubSub)
├── Cloudflare R2 (이미지/내보내기 파일)
├── Railway (Worker: BullMQ 처리)
└── Resend (이메일 알림)
```

---

## 엔진 상세 설계

### ⓪ Input Design (입력 설계)

> "입력이 얕으면 전부 얕다" — 입력 설계 자체가 엔진

#### 입력 수집 3단계

**Step 1. 기본 정보 (필수, 30초)**
- 제품/서비스명
- 업종 카테고리 (드롭다운)
- 가격대
- 랜딩페이지 목표 (구매/가입/문의/다운로드)
- 제품 이미지 업로드 (1~5장)

**Step 2. AI 심층 질문 (자동 생성, 2~3분)**
- "이 제품의 고객은 주로 어떤 문제를 겪고 있나요?"
- "경쟁 제품 대비 가장 다른 점은?"
- "기존 고객이 가장 많이 하는 칭찬은?"
- "구매를 망설이는 고객의 가장 큰 이유는?"
- "지금 구매해야 하는 특별한 이유가 있나요?"
- (업종별 동적 질문 3~5개 추가)

**Step 3. 자동 보강 (AI가 추론)**
- 업종 데이터베이스에서 일반적 고객 페인포인트 매칭
- 가격대 기반 구매 저항 유형 추론
- 경쟁사 일반 패턴 자동 분석
- 빈 필드 AI 추론으로 채우기 (확신도 표시)

#### 입력 품질 스코어링

```
입력 깊이 점수 (0~100)
├── 기본 정보만: 30점 → 기본 랜딩 생성 가능
├── + AI 질문 답변: 60점 → 중급 랜딩 생성
├── + 이미지 + 상세 답변: 80점 → 고급 랜딩 생성
└── + 경쟁사 URL + 리뷰 데이터: 95점 → 최고급 랜딩 생성

점수 60 미만 → "더 좋은 결과를 위해 추가 정보를 입력하세요" 안내
```

#### 업종별 동적 질문 예시

```
SaaS:
  - "무료 체험 기간이 있나요?"
  - "주요 연동 서비스는?"
  - "고객의 현재 대안은? (엑셀, 수작업 등)"

식품:
  - "원산지/인증은?"
  - "맛/식감의 특징은?"
  - "재구매율은?"

교육:
  - "수강 후 기대 결과는?"
  - "강사/기관의 자격/경력은?"
  - "수강생 후기 중 가장 많은 키워드는?"
```

---

### ① Product Intelligence Engine (제품 지능 엔진)

> 병목. 이 엔진의 출력 품질이 나머지 전체를 결정

**입력**: Step 1~3의 구조화된 데이터

#### Phase A. 제품 DNA 추출
- **핵심 가치 (Core Value)**: 이 제품이 존재하는 이유 1문장
- **USP (Unique Selling Point)**: 경쟁사 대비 유일한 차별점
- **카테고리 포지셔닝**: 시장 내 위치 (프리미엄/가성비/혁신/전통)
- **가치 계층**: 기능적 가치 → 감정적 가치 → 사회적 가치

#### Phase B. 고객 심리 분석

**고객 욕망 (Desire)**
- 표면 욕망: "이 제품을 사고 싶다"
- 진짜 욕망: "이 제품으로 얻고 싶은 상태"
- 숨은 욕망: "남들에게 보이고 싶은 나"

**고객 공포 (Fear)**
- 문제 공포: "이걸 안 사면 계속 겪을 고통"
- 기회 공포: "지금 안 사면 놓칠 것"
- 사회 공포: "나만 뒤처지는 것"

**구매 저항 (Resistance)**
- 가격 저항: "비싸다" → 저항 강도 1~5
- 신뢰 저항: "이거 진짜야?" → 저항 강도 1~5
- 필요성 저항: "나한테 필요한가?" → 저항 강도 1~5
- 긴급성 저항: "나중에 사지 뭐" → 저항 강도 1~5
- 복잡성 저항: "사용법이 어려울 것 같은데" → 저항 강도 1~5

**의사결정 유형**
- 충동형 (감정 우선) → 비주얼 + 사회증명 강화
- 분석형 (데이터 우선) → 스펙 + 비교표 강화
- 신중형 (안전 우선) → 보증 + FAQ 강화
- 추종형 (트렌드 우선) → 인플루언서 + SNS 강화

#### Phase C. 시장 컨텍스트
- 경쟁 강도: 레드오션/블루오션/니치
- 가격 감수성: 높음/중간/낮음
- 구매 주기: 일회성/반복/구독
- 의사결정 소요시간: 즉시/1일/1주/1달+
- 주요 구매 채널: 온라인 직접/비교 후/추천 후

#### 출력 (Product Brief)

```json
{
  "core_value": "1문장 핵심 가치",
  "usp": "차별점 1~3개",
  "positioning": "프리미엄|가성비|혁신|전통",
  "customer_desire": { "surface": "", "real": "", "hidden": "" },
  "customer_fear": { "problem": "", "opportunity": "", "social": "" },
  "resistance_map": {
    "price": { "level": 4, "reason": "" },
    "trust": { "level": 3, "reason": "" },
    "need": { "level": 2, "reason": "" },
    "urgency": { "level": 5, "reason": "" },
    "complexity": { "level": 1, "reason": "" }
  },
  "decision_type": "분석형",
  "market_context": { ... },
  "confidence_score": 78
}
```

---

### ② Why Now Engine (긴급성 엔진)

> "왜 지금 사야 하는가" — 이게 없으면 CTA가 죽는다

**입력**: Product Brief (①의 출력)

#### 긴급성 유형 5가지

| 유형 | 적합 상황 | 표현 예시 | 강도 |
|------|----------|----------|------|
| 시간 기반 | 프로모션, 시즌, 이벤트 | "3일 남음", "오늘 자정까지" | ★★★★★ |
| 수량 기반 | 한정판, 재고 소진, 선착순 | "남은 수량 12개", "100명 한정" | ★★★★☆ |
| 상황 기반 | 문제 해결형, B2B, 건강 | "매일 N원을 잃고 있습니다" | ★★★☆☆ |
| 감정 기반 | 자기계발, 라이프스타일 | "올해는 다를 수 있습니다" | ★★☆☆☆ |
| 가격 기반 | 고가 제품, 구독, SaaS | "월 커피 2잔 값", "연간 절약 120만원" | ★★★★☆ |

#### 자동 선택 로직

```
IF 프로모션/이벤트 정보 있음 → 시간 기반 (1순위)
ELIF 한정 수량 정보 있음 → 수량 기반
ELIF 제품이 문제 해결형 → 상황 기반
ELIF 가격대 높음 (>10만원) → 가격 기반
ELIF 라이프스타일/자기계발 → 감정 기반
ELSE → 상황 기반 (디폴트)

* 복합 사용 가능: 시간 + 수량, 상황 + 감정 등
* urgency_resistance가 5인 경우 → 2개 유형 복합 적용
```

#### 출력 (Urgency Brief)

```json
{
  "primary_type": "situational",
  "secondary_type": "price_anchor",
  "urgency_elements": [
    { "type": "loss_calculator", "message": "매일 2시간을 낭비하고 있습니다" },
    { "type": "price_comparison", "message": "월 9,900원 = 하루 330원" }
  ],
  "cta_urgency_level": 4,
  "placement": ["mid_page", "final_cta", "sticky_bar"]
}
```

---

### ③ Conversion Strategy Engine (전환 전략 엔진)

> 가장 강력한 엔진. 페이지 전체 구조를 결정

**입력**: Product Brief + Urgency Brief

#### Phase A. 전략 유형 선택

| 전략 | 목표 | 적합 |
|------|------|------|
| Direct Sale | 즉시 구매 유도 | 이커머스, 단품 |
| Lead Generation | 정보 수집 | B2B, 고가 |
| Free Trial | 체험 유도 | SaaS, 서비스 |
| Content Hook | 콘텐츠로 유입 | 교육, 미디어 |
| Event Registration | 참가 신청 | 웨비나, 오프라인 |

#### Phase B. 업종별 최적 구조

**SaaS + Free Trial + 분석형**
```
Hero (문제 제기)
→ Problem (고객 고통 구체화)
→ Solution (제품 소개)
→ How It Works (3단계)
→ Features (핵심 기능 3~5개)
→ Social Proof (고객사 로고 + 후기)
→ Pricing (요금제 비교)
→ FAQ
→ Final CTA
```

**이커머스 + Direct Sale + 충동형**
```
Hero (제품 비주얼 임팩트)
→ Benefit (감정적 가치)
→ Product Detail (스펙)
→ Before/After
→ Reviews (별점 + 포토 리뷰)
→ Urgency (한정 수량/기간)
→ Offer (번들/할인)
→ CTA
```

**교육 + Lead Gen + 신중형**
```
Hero (결과 약속)
→ Pain (현재 상태의 문제)
→ Authority (강사 자격/경력)
→ Curriculum (커리큘럼 미리보기)
→ Testimonials (수강생 변화)
→ Guarantee (환불 보증)
→ FAQ
→ CTA (무료 상담/체험)
```

#### Phase C. 섹션 수 결정

```
의사결정 소요시간 짧음 → 5~7 섹션 (임팩트 집중)
의사결정 소요시간 중간 → 8~12 섹션 (균형)
의사결정 소요시간 김  → 12~16 섹션 (상세 설득)
가격대 높음 → 섹션 수 +2~3 (신뢰 보강)
```

#### Phase D. 섹션별 역할 배정

| 역할 | 의미 | 수량 |
|------|------|------|
| HOOK | 시선 잡기 | 1개 (최상단) |
| PAIN | 문제 인식 | 1~2개 |
| SOLUTION | 해결책 제시 | 1~2개 |
| PROOF | 증거/신뢰 | 2~3개 |
| OBJECTION | 저항 해소 | 1~2개 |
| URGENCY | 긴급성 | 1개 |
| CTA | 행동 촉구 | 1~2개 |

#### 출력 (Strategy Blueprint)

```json
{
  "strategy_type": "direct_sale",
  "total_sections": 10,
  "structure": [
    { "order": 1, "role": "HOOK", "section_type": "hero_visual", "purpose": "제품 임팩트" },
    { "order": 2, "role": "PAIN", "section_type": "pain_point", "purpose": "고객 고통 구체화" },
    { "order": 3, "role": "SOLUTION", "section_type": "benefit_highlight", "purpose": "감정적 가치" }
  ],
  "cta_positions": [5, 8, 10],
  "estimated_scroll_depth": "2400px",
  "target_read_time": "3분"
}
```

---

### ④ Objection Killer Engine (구매 저항 파괴 엔진)

> 전환 안 되는 이유의 80%를 자동으로 찾아서 부순다

**입력**: Product Brief (resistance_map) + Strategy Blueprint

#### 저항별 파괴 전략

**가격 저항 (level 3~5일 때 활성)**
- 앵커링: 원래 가격 대비 할인 강조
- 분할: "하루 330원" 같은 일일 단가 환산
- ROI: "이 제품으로 절약되는 비용/시간"
- 비교: "카페 라떼 2잔 값으로..."
- 번들: "같이 사면 N% 추가 할인"
- 배치: Pricing 섹션 직전 또는 내부

**신뢰 저항 (level 3~5일 때 활성)**
- 수치: "N만명이 선택", "평점 4.8"
- 로고: 고객사/언론/인증 로고 바
- 후기: 실사용 리뷰 (포토/영상 우선)
- 보증: "30일 무조건 환불"
- 전문가: 추천/인증/특허
- 배치: Solution 직후 (의심 시점)

**필요성 저항 (level 3~5일 때 활성)**
- Before/After: 사용 전후 비교
- 손실 프레이밍: "안 쓰면 계속 이렇습니다"
- 통계: "N%의 사람들이 이 문제를 겪고 있습니다"
- 공감 스토리: 대상 고객의 일상 묘사
- 배치: Pain 섹션 강화

**복잡성 저항 (level 3~5일 때 활성)**
- 3-Step: "설치 → 설정 → 사용, 끝"
- 영상: 30초 데모 영상
- 비교: "기존 방식 vs 우리 방식"
- 지원: "전담 매니저가 도와드립니다"
- 배치: How It Works 섹션

#### 출력 (Objection Map)

```json
{
  "active_objections": [
    {
      "type": "price",
      "level": 4,
      "strategies": ["daily_split", "roi_calculator", "anchor_pricing"],
      "inject_at": ["section_7_pricing"],
      "copy_direction": "하루 330원으로 매일 2시간을 돌려받으세요"
    },
    {
      "type": "trust",
      "level": 3,
      "strategies": ["review_highlight", "guarantee_badge", "logo_bar"],
      "inject_at": ["section_4_after_solution", "section_9_before_cta"],
      "copy_direction": "4,823명이 먼저 경험했습니다"
    }
  ]
}
```

---

### ⑤ Psychological Copy Engine (심리 카피 엔진)

> 일반 AI 카피 ≠ 설득 카피. 세일즈 심리 구조를 내장

**입력**: Product Brief + Strategy Blueprint + Objection Map + Urgency Brief

#### 섹션별 카피 프레임

**HOOK 섹션**
- 질문형: "아직도 N하고 계신가요?"
- 충격형: "N의 N%가 모르는 사실"
- 공감형: "N할 때마다 이런 생각 드시죠"
- 결과형: "N일 만에 N을 달성한 비결"
- 선택: 의사결정유형 + 업종 기반

**PAIN 섹션**
- 나열형: "이런 경험 있으신가요?" + 체크리스트
- 스토리형: 고객 시나리오 묘사
- 데이터형: "N%가 이 문제로 고통받고 있습니다"
- 감정형: 감정 단어 집중 (답답한, 지친, 포기하고 싶은)
- 선택: customer_fear 유형 기반

**SOLUTION 섹션**
- 대비형: "문제 → 하지만 → 해결"
- 발견형: "드디어 → 해결책을 찾았습니다"
- 약속형: "N일 안에 N을 보장합니다"
- 증거형: "이미 N명이 경험한 변화"
- 선택: USP 강도 + 시장 경쟁도 기반

**CTA 섹션**
- 직접형: "지금 시작하기"
- 가치형: "N을 경험해보세요"
- 긴급형: "오늘만 N% 할인"
- 안전형: "무료로 시작하기 (카드 불필요)"
- 선택: urgency_type + resistance_level 기반

#### 카피 블록 (섹션별 생성 단위)

- headline: 1줄 (최대 15자, 임팩트)
- subheadline: 1~2줄 (보조 설명)
- body: 2~4줄 (상세 내용)
- bullet_points: 3~5개 (핵심 포인트)
- cta_text: 1줄 (버튼 텍스트)
- micro_copy: 1줄 (버튼 하단 보조, "30일 무료 체험")
- image_direction: 1줄 (이미지 생성용 지시)

#### 카피 품질 게이트

| 항목 | 배점 | 기준 |
|------|------|------|
| 구체성 | 20점 | 숫자/사례 포함 여부 |
| 감정 연결 | 20점 | 고객 감정을 건드리는가 |
| 명확성 | 20점 | 한 번에 이해되는가 |
| 행동 유도 | 20점 | 다음 행동이 명확한가 |
| 차별성 | 20점 | 경쟁사와 다른 표현인가 |

- 80점 미만 → 자동 재생성 (최대 3회)
- 60점 미만 → 프레임 교체 후 재생성

#### 톤 매트릭스

```
업종별 기본 톤:
├── SaaS/테크: 명확, 간결, 데이터 중심
├── 뷰티/패션: 감성적, 비주얼 중심, 트렌디
├── 건강/식품: 신뢰감, 전문성, 안전
├── 교육: 동기부여, 구체적 결과, 권위
├── 금융: 보수적, 신뢰, 수치 중심
├── 라이프스타일: 감정적, 스토리텔링, 공감
└── B2B: 전문적, ROI 중심, 논리적

타겟별 톤 보정:
├── 20대: 캐주얼 +30%, 이모지 허용
├── 30~40대: 균형, 가성비 강조
├── 50대+: 격식 +20%, 안전 강조
├── 전문가: 전문용어 허용, 간결
└── 초보자: 쉬운 말, 비유 활용

오버라이드 우선순위: 브랜드톤 > 구분톤 > 타겟톤 > 업종톤
```

---

### ⑥ Trust Architecture Engine (신뢰 구조 엔진)

> 신뢰를 무작위로 뿌리면 효과 없음. 레벨 순서대로 쌓아야 한다

#### 신뢰 6레벨

| 레벨 | 이름 | 고객 심리 | 요소 | 배치 |
|------|------|----------|------|------|
| Lv1 | 존재감 | "이 브랜드 실재하는구나" | 로고, 프로 디자인, 도메인 | Hero (최상단) |
| Lv2 | 전문성 | "이 분야를 아는구나" | 상세 스펙, 기술 설명 | Solution/Feature |
| Lv3 | 제3자 검증 | "다른 사람도 인정하는구나" | 인증, 특허, 수상, 미디어 | Solution 직후 |
| Lv4 | 사회 증명 | "많은 사람이 쓰는구나" | 리뷰, 판매량, 고객사 로고 | 페이지 중단 |
| Lv5 | 안전장치 | "실패해도 괜찮겠구나" | 환불, AS, FAQ, 고객센터 | CTA 직전 |
| Lv6 | 동료 압력 | "다른 사람도 지금 보고 있구나" | "지금 N명 보는 중" | 플로팅 |

**배치 규칙**:
- 반드시 Lv1 → Lv2 → Lv3 → Lv4 순서 유지 (위에서 아래로)
- Lv5는 CTA 직전 고정
- Lv6는 선택적 (플로팅, 최대 1개)
- 신뢰 요소를 건너뛰면 안 됨

---

### ⑦ Attention Architecture Engine (주의력 설계 엔진)

> Layout이 "어떻게 보여줄지"라면, 이건 "언제 뭘 보여줄지"

#### 4개 Zone 설계

**Zone 1: First View (0~600px) — 3초 승부**
- 목표: 이탈 방지, 스크롤 유도
- Hook 유형 선택:
  - Visual Hook → 충동형 고객
  - Question Hook → 분석형 고객
  - Result Hook → 신중형 고객
  - Social Hook → 추종형 고객
- 시선 동선:
  - F패턴: 텍스트 중심 (SaaS, B2B)
  - Z패턴: 비주얼+텍스트 (이커머스)
  - 중앙집중: 단일 메시지 (브랜드, 이벤트)
- 금지: 이 구간에 폼/가격/복잡한 정보 배치

**Zone 2: Interest (600~1800px) — 관심 확장**
- 정보 밀도: 중간 (텍스트 + 비주얼 교차)
- 인터랙션: fade in, 아이콘 순차 등장, 카운터 애니메이션
- 이탈 방지: 강조 인용구, 미니 CTA
- 리듬: 밀 → 소 → 밀

**Zone 3: Desire (1800~3000px) — 욕구 자극**
- 정보 밀도: 높음 (데이터 + 증거 집중)
- 인터랙션: Before/After 슬라이더, 리뷰 캐러셀, 탭/아코디언, 비디오
- 중간 CTA: 1~2개
- 리듬: 증거 → 감정 → 증거 → 감정

**Zone 4: Action (3000px~끝) — 행동 촉구**
- 정보 밀도: 낮음 (깔끔, 집중)
- 필수: 최종 가치 요약 + 보증 + 메인 CTA + FAQ
- 이탈 방지: Sticky CTA 바, Exit Intent 팝업
- 금지: 새로운 정보 추가

#### 주의력 리소스 배분

```
Zone 1 (First View): 시각적 임팩트 100% — 텍스트 최소화
Zone 2 (Interest):   비주얼 60% + 텍스트 40%
Zone 3 (Desire):     텍스트 50% + 데이터 30% + 비주얼 20%
Zone 4 (Action):     CTA 70% + 안전장치 30%
```

---

### ⑧ Layout Intelligence Engine (레이아웃 지능 엔진)

> 섹션 타입 × 역할 × Zone → 최적 레이아웃 패턴 자동 선택

#### 레이아웃 패턴 라이브러리 (~42개)

| 카테고리 | 패턴 수 | 주요 패턴 |
|---------|---------|----------|
| Hero | 8 | 풀스크린+센터, 좌카피+우이미지, 영상배경, 그라디언트, 스플릿, 제품중심, 미니멀타이포, 카드형 |
| Feature/Benefit | 10 | 3컬럼그리드, 지그재그, 탭, 아코디언, 카드그리드, 아이콘리스트, 대형이미지+불릿, 번호스텝, 인포그래픽, 비교표 |
| Social Proof | 6 | 리뷰캐러셀, 테스티모니얼카드, 로고바, 별점+텍스트, SNS그리드, 숫자카운터 |
| Pricing | 4 | 3컬럼비교, 단일카드, 월간/연간토글, 기능매트릭스 |
| CTA | 5 | 센터정렬, 좌카피+우버튼, 풀폭배너, 스티키바, 팝업 |
| FAQ | 3 | 아코디언, 2컬럼Q&A, 검색형 |
| 기타 | 6 | Before/After, 타임라인, 프로세스플로우, 팀소개, 뉴스레터, 푸터 |

#### 자동 선택 점수 체계

```
점수 요소:
├── Zone 적합성 (30%)
├── 모바일 친화도 (25%)
├── 의사결정유형 매칭 (20%)
├── 콘텐츠 양 적합 (15%)
└── 이전 패턴과의 시각적 다양성 (10%) ← 연속 같은 패턴 방지
```

---

### ⑨ Visual Style Engine (비주얼 스타일 엔진)

#### 무드 프리셋 10종

| 프리셋 | 특징 |
|--------|------|
| Luxury | 다크+골드, 세리프, 넓은 여백, 고급 질감 |
| Clean | 화이트+블루, 산세리프, 미니멀, 그리드 정돈 |
| Tech | 다크+네온, 모노스페이스, 그라디언트, 기하학 |
| Natural | 어스톤, 라운드, 유기적 형태, 텍스처 |
| Fun/Pop | 비비드, 볼드 타이포, 일러스트, 동적 |
| Professional | 네이비+그레이, 클래식, 정돈된 그리드 |
| Startup | 밝은+퍼플, 현대적, 일러스트, 친근 |
| Premium | 딥블루+화이트, 고급 사진, 큰 여백 |
| Bold | 강렬한 대비, 큰 타이포, 블록 컬러 |
| Minimal | 흑백+액센트 1색, 극도의 여백, 타이포 중심 |

#### 자동 선택 로직

```
SaaS + 혁신 + 30대     → Tech 또는 Startup
화장품 + 프리미엄 + 여성 → Luxury 또는 Clean
식품 + 가성비 + 전연령   → Natural 또는 Fun
금융 + 전통 + 40대+     → Professional
```

#### 디자인 토큰

```
컬러:    primary, secondary, accent, bg, surface, text (12종)
타이포:  display, h1~h4, body, small, caption, button (9 스케일)
스페이싱: xs(4), sm(8), md(16), lg(24), xl(32), 2xl(48)
곡률:    none(0), sm(4), md(8), lg(12), xl(16), full(999)
그림자:  none, sm, md, lg, xl, inner
```

#### 브랜드 컬러 자동 추출

```
로고 이미지 업로드
    → 주요 컬러 3~5개 추출
    → Primary / Secondary / Accent 자동 배정
    → 무드 프리셋과 병합
    → 대비율 WCAG AA 자동 검증
    → 다크모드 팔레트 자동 생성
```

#### 이미지 생성

```
Gemini Flash multimodal:
├── conversation_id: 시리즈 통일감
├── inline_data: 유저 제품 이미지 (리사이즈 768px)
├── 스타일: 선택된 무드 프리셋 반영
├── JPEG 출력 (비용 최적화)
└── 동시 처리: 최대 3개 병렬
```

---

### ⑩ Code Engine (코드 생성 엔진)

#### 출력 포맷

**React 컴포넌트 (기본)**
- Next.js App Router 호환
- TypeScript + Tailwind CSS
- Framer Motion (애니메이션)
- 반응형 (모바일 퍼스트)
- 섹션별 독립 컴포넌트

**HTML 단독 파일 (내보내기용)**
- CSS 인라인
- JavaScript 최소화
- 이미지 CDN 링크
- 단일 파일로 어디서든 실행
- 최적화: gzip 기준 500KB 이하

---

### ⑪ Deploy Engine (배포 엔진)

#### 배포 옵션

| 옵션 | 설명 | 플랜 |
|------|------|------|
| 자체 호스팅 | subdomain.서비스명.com | Free+ |
| HTML 다운로드 | 단독 실행 파일 | Free+ |
| 코드 다운로드 | React 프로젝트 ZIP | Pro+ |
| 이미지 내보내기 | PNG/PDF (서버사이드 렌더링) | Pro+ |
| 커스텀 도메인 | CNAME 설정 | Business |

#### 배포 페이지 서빙 구조

```
사용자 방문
    │
    ▼
Vercel Edge Middleware
    ├── 프로젝트 조회 (Edge Config 캐시)
    ├── A/B 테스트 분기 (쿠키 기반)
    ├── HTML 서빙 (미리 빌드, CDN 캐시)
    └── 트래킹 스크립트 주입 (<2KB)
        ├── 스크롤 깊이 이벤트
        ├── 섹션별 노출/체류시간
        ├── CTA 클릭
        └── 전환 이벤트
```

---

### ⑫ Learning Loop Engine (학습 루프 엔진)

> 장기 해자. 처음엔 데이터 수집만, 점진적으로 자동화

#### 3단계 진화

**Phase 1: 데이터 수집 (Day 1부터)**

수집 데이터:
- 생성 메타데이터: 업종, 전략, 섹션 구성, 카피 프레임, 레이아웃
- 사용자 행동 (에디터): 삭제한 섹션, 수정한 카피, 변경한 레이아웃, 순서 변경
- 배포 후 성과: 방문자, 스크롤 깊이, 이탈 지점, CTA 클릭률, 전환율, 체류시간

**Phase 2: 자동 진단 (데이터 축적 후)**

```
매일 06:00 — 활성 프로젝트 스캔

판단 조건:
├── 전환율 < 업종별 기준 AND 방문자 >= 100 AND 배포 >= 7일
└── 전환율 지난주 대비 30%+ 하락 AND 방문자 수 유지

진단:
├── Hero 이탈 높음 → Hook이 약함
├── 특정 섹션 급격한 이탈 → 그 섹션 설득 실패
├── CTA 도달하는데 클릭 없음 → CTA 문제
├── 전체적으로 고르게 이탈 → 구조 자체 문제
├── 체류시간 짧은 섹션 → 카피 안 읽힘
└── 모바일에서만 전환 낮음 → 레이아웃 문제
```

**Phase 3: 자동 교체**

| 레벨 | 범위 | 자동화 | 위험도 |
|------|------|--------|--------|
| Level 1 | 카피/CTA/이미지 교체 | 완전 자동 | 낮음 |
| Level 2 | 섹션 순서/레이아웃 변경 | A/B 테스트로 자동 | 중간 |
| Level 3 | 전체 재생성 | 사용자 승인 필요 | 높음 |

#### 자동 교체 플로우

```
진단 결과
    │
    ├── Level 1 → 해당 부분만 재생성 → A/B 테스트 자동 시작
    │                                    ├── 7일 비교
    │                                    ├── 새 버전 나음 → 자동 교체
    │                                    ├── 비슷함 → 유지
    │                                    └── 기존 나음 → 롤백
    │
    ├── Level 2 → 구조 변경 → A/B 테스트 → 자동 판정
    │
    └── Level 3 → 사용자에게 이메일 알림 → 승인 후 재생성
```

#### 승리 패턴 축적

```
A/B 테스트 승자 확정 시:
    → WinningPattern DB에 기록
    → 업종 × 목표 × 패턴유형별 분류
    → 다음 프로젝트 생성 시 Strategy Engine이 참조
    → 운영할수록 엔진이 똑똑해짐
```

#### 자동 전환 판단 기준

```
업종별 전환율 기준선:

업종              평균    좋음    나쁨 (자동진단 트리거)
────────────────────────────────────────
SaaS 가입         3~5%    7%+    2% 미만
이커머스 구매      1~3%    5%+    0.5% 미만
리드 수집 (B2B)   5~10%   15%+   3% 미만
앱 다운로드       10~15%  20%+   5% 미만
뉴스레터 구독     5~10%   15%+   3% 미만
웨비나 등록       15~25%  30%+   10% 미만

자동 재생성 권고 조건:
├── 전환율이 업종 평균의 50% 미만
├── AND 30일 이상 개선 없음
└── → Level 3 자동 재생성 권고 이메일
```

---

## 엔진별 AI vs 규칙 구분

| 엔진 | AI 호출 | 규칙 엔진 | 이유 |
|------|---------|----------|------|
| ① Product Intelligence | 3회 | - | 추론 필요 (고객 심리) |
| ② Why Now | - | O | 분기 로직 (IF/ELSE) |
| ③ Conversion Strategy | 1회 | O | AI 전략 + 규칙 구조화 |
| ④ Objection Killer | - | O | 매핑 테이블 기반 |
| ⑤ Psychological Copy | 1회 | O | AI 카피 + 규칙 프레임 |
| ⑥ Trust Architecture | - | O | 레벨 순서 (고정 로직) |
| ⑦ Attention Architecture | - | O | Zone 배분 (고정 로직) |
| ⑧ Layout Intelligence | - | O | 점수 매칭 (계산) |
| ⑨ Visual Style | 0~1회 | O | 컬러 추출만 AI |
| ⑩ Code Engine | - | O | 템플릿 조립 (순수 코드) |
| ⑪ Deploy | - | O | 배포 로직 (순수 코드) |
| ⑫ Learning Loop | 1회 | O | AI 진단 + 규칙 판단 |

**총 AI 호출: 5~6회/생성**
**비용 예상: $0.15~0.30 (카피) + $0.50~1.50 (이미지) = $0.65~1.80/생성**

---

## 생성 파이프라인 타이밍

```
Phase 1 (분석):    15~30초   — AI 3회 + 규칙 엔진 (①②③④)
Phase 2 (생성):    30~60초   — AI 1회 배치 + 규칙 엔진 (⑤⑥⑦⑧⑨)
Phase 3 (이미지):  30~90초   — Gemini × 섹션 수 (병렬 3개)
Phase 4 (빌드):    5~10초    — 순수 코드 조립 (⑩)

총: 80~190초 (1분 20초 ~ 3분 10초)
```

---

## DB 스키마

### 핵심 모델

```
User             — 사용자 (email, name, plan)
Organization     — 조직 (plan, quotaUsed, quotaLimit)
Project          — 프로젝트/랜딩페이지 (inputData, 각 엔진 출력 JSON)
Section          — 개별 섹션 (order, role, type, layout, 카피, 이미지, 성과)
PageVersion      — 페이지 버전 (htmlContent, 성과 데이터, trafficWeight)
ABTest           — A/B 테스트 (control/variant, 결과)
DailyAnalytics   — 일별 분석 (방문자, 전환율, 유입원, 디바이스)
SectionAnalytics — 섹션별 성과 (노출, 체류, 이탈, CTA클릭)
DiagnosisLog     — 자동 진단 기록 (진단, 처방, 결과)
WinningPattern   — 승리 패턴 (업종별 최적 패턴 축적)
GeneratedImage   — 생성 이미지 (R2 키, 프롬프트, 비용)
Subscription     — 구독 (plan, status, period)
Payment          — 결제 (amount, provider, status)
```

---

## API 설계

```
인증:       POST /api/auth/login|register|logout, GET /api/auth/me
프로젝트:   CRUD /api/projects, POST generate|regenerate
섹션:       GET|PATCH /api/projects/:id/sections, POST reorder|add, DELETE
배포:       POST|DELETE /api/projects/:id/deploy, POST export/html|image
버전/AB:    GET versions, POST ab-test, POST conclude
분석:       GET analytics, analytics/sections|sources|devices, diagnosis
학습:       GET patterns, patterns/recommendations
결제:       GET plans, POST subscribe|cancel, GET usage, POST webhook
```

---

## Worker 구조

| Queue | 역할 | 동시 처리 | 타임아웃 | 스케줄 |
|-------|------|----------|---------|--------|
| generation | 메인 생성 | 2 | 5분 | 요청 시 |
| regeneration | 부분 재생성 | 3 | 2분 | 요청 시 |
| image-generation | 이미지 | 3 | 60초 | 요청 시 |
| diagnosis | 자동 진단 | 1 | 30초 | 매일 06:00 |
| ab-test | A/B 판정 | 1 | 30초 | 매일 09:00 |
| analytics-aggregate | 분석 집계 | 1 | - | 매일 00:00 |

---

## 프로젝트 폴더 구조

```
landingpage/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # 인증
│   │   ├── (dashboard)/              # 대시보드
│   │   │   ├── projects/             # 프로젝트 목록
│   │   │   ├── projects/[id]/        # 상세
│   │   │   ├── projects/[id]/editor/ # 에디터
│   │   │   ├── projects/[id]/analytics/ # 분석
│   │   │   ├── settings/
│   │   │   └── billing/
│   │   ├── api/                      # API Routes
│   │   └── p/[slug]/                 # 배포 페이지 (Edge)
│   │
│   ├── engine/                       # 12개 엔진 코어
│   │   ├── 01-product-intelligence/
│   │   │   ├── index.ts
│   │   │   ├── prompts.ts
│   │   │   ├── types.ts
│   │   │   └── rules.ts
│   │   ├── 02-why-now/
│   │   ├── 03-conversion-strategy/
│   │   ├── 04-objection-killer/
│   │   ├── 05-psychological-copy/
│   │   │   ├── index.ts
│   │   │   ├── prompts.ts
│   │   │   ├── frames.ts
│   │   │   ├── tone-matrix.ts
│   │   │   └── quality-gate.ts
│   │   ├── 06-trust-architecture/
│   │   ├── 07-attention-architecture/
│   │   ├── 08-layout-intelligence/
│   │   │   ├── patterns.ts           # 42개 패턴
│   │   │   └── scoring.ts
│   │   ├── 09-visual-style/
│   │   │   ├── moods.ts              # 10개 무드
│   │   │   ├── tokens.ts
│   │   │   └── color-extract.ts
│   │   ├── 10-code-engine/
│   │   │   ├── compiler.ts
│   │   │   └── templates/            # 섹션 컴포넌트
│   │   ├── 11-deploy/
│   │   ├── 12-learning-loop/
│   │   │   ├── diagnosis.ts
│   │   │   ├── prescription.ts
│   │   │   └── ab-test.ts
│   │   ├── pipeline.ts               # 오케스트레이터
│   │   └── types.ts
│   │
│   ├── components/                   # UI
│   │   ├── ui/
│   │   ├── wizard/
│   │   ├── editor/
│   │   ├── dashboard/
│   │   └── analytics/
│   │
│   ├── lib/                          # 유틸
│   │   ├── ai/ (claude.ts, gemini.ts)
│   │   ├── db.ts, redis.ts, r2.ts
│   │   ├── auth.ts, queue.ts
│   │   └── analytics.ts
│   │
│   └── stores/                       # Zustand
│
├── prisma/schema.prisma
├── scripts/worker.ts                 # BullMQ Worker
├── public/tracking.js                # 트래킹 스크립트
└── docs/
```

---

## 비용 구조

```
생성 1회당: $0.65~1.80

월간 인프라 (100 프로젝트 기준):
├── Vercel Pro: $20
├── Supabase Pro: $25
├── Upstash: $10~30
├── R2: $5~15
├── Railway: $5~20
└── 총: $65~110/월

과금 모델:
├── Free: 월 3회 생성, 워터마크
├── Pro $29/월: 월 30회 + 내보내기 전체
├── Business $79/월: 월 100회 + 자동최적화 (Learning Loop)
└── 진짜 수익 = Business (자동최적화 = "성과를 팔기")
```

---

## 개발 로드맵

```
Phase 0 (1주) — 기반
├── 프로젝트 셋업, DB 스키마, 인증, 기본 UI

Phase 1 (3주) — MVP 엔진 (P0)
├── 입력 위저드
├── ①②③⑤ 엔진
├── BullMQ + SSE
├── 기본 미리보기

Phase 2 (2주) — 디자인 레이어
├── ⑧⑨⑩ 엔진 (20패턴, 5무드)
├── 이미지 파이프라인
├── HTML 내보내기

Phase 3 (2주) — 에디터 + 나머지 엔진
├── 에디터 UI
├── ④⑥⑦ 엔진
├── 섹션 재생성
├── ⑪ 자체 호스팅

Phase 4 (2주) — 분석 + 학습
├── 트래킹, 대시보드
├── ⑫ 자동 진단 + A/B
├── WinningPattern

Phase 5 (1주) — 비즈니스
├── 결제, 사용량, 플랜

총: ~11주 (약 3개월)
```

---

## 핵심 원칙

1. **입력 깊이 = 출력 깊이** — Product Intelligence가 병목
2. **전략이 먼저, 디자인은 나중** — 85점짜리 페이지가 먼저
3. **자동화는 품질 위에 얹는 것** — Level 1부터 점진적으로
4. **데이터는 Day 1부터 수집** — Learning Loop 구조는 처음부터
5. **AI builder가 아니라 AI marketing brain** — 판매 전략을 파는 것
