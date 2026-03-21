# 섹션별 에이전트 아키텍처 설계서

> 26개 섹션 × 18개 업종 × 자동 학습 루프
> 각 에이전트가 1개 섹션만 미친듯이 잘 만든다.

---

## 핵심 원칙

```
1 에이전트 = 1 섹션 = 1 전문가
섹션 날카로우면 된다
무기가 날카로우면 많이 쏠수록 좋다
각 섹션이 독립적인 세일즈맨 — 소비자마다 먹히는 섹션이 다르다
```

---

## 전체 파이프라인

```
[전략 레이어] — 유지
① Product Intelligence    → 제품 분석
② Why Now                → 긴급성 분석
③ Conversion Strategy    → 섹션 구성 결정 (26개 중 몇 개, 순서)
④ Objection Killer       → 반론 데이터 추출

[섹션 레이어] — 신규 26개 병렬
③ 출력 → 선택된 섹션 에이전트들 동시 실행

[조립 레이어] — 유지
⑩ Code Engine            → 섹션 출력 합쳐서 HTML

[배포 레이어] — 유지
⑪ Deploy                 → 배포 + 추적 코드 삽입

[학습 레이어] — 확장
⑫ Learning Loop
├── Page Analytics        → 전체 전환율, 이탈률, 체류시간
└── Section Analytics     → 섹션별 성과 × 26개

[메타 레이어] — 유지
⑬ Tool Intelligence      → 전체 에이전트에 도구 공급

[흡수됨]
⑤ Psychological Copy     → 26개 에이전트 안으로
⑥ Trust Architecture     → 26개 에이전트 안으로
⑦ Attention Architecture → 26개 에이전트 안으로
⑧ Layout Intelligence    → 26개 에이전트 안으로
⑨ Visual Style           → 26개 에이전트 안으로
```

### 전체 흐름

```
①②③④ 전략
    ↓
[26개 섹션 에이전트 병렬] ←── 레퍼런스 DB (18업종 × 10~30장)
    ↓                     ←── 매번 4요소 비중 실시간 판단
⑩ 조립
    ↓
⑪ 배포
    ↓
⑫ Page + Section Analytics
    ↓
각 에이전트 피드백 ←── 날카로워지는 루프
```

---

## 에이전트 26개

```
agent/sections/
  01-header-banner/       헤더배너
  02-key-features/        핵심특징
  03-feature-detail-1/    특징1 상세
  04-feature-detail-2/    특징2 상세
  05-feature-detail-3/    특징3 상세
  06-specs/               상세스펙
  07-how-to-use/          사용법
  08-target-persona/      타겟고객
  09-before-after/        비포애프터
  10-lifestyle/           라이프스타일
  11-certification/       인증/수상
  12-faq/                 FAQ
  13-reviews/             리뷰
  14-shipping/            배송안내
  15-cta/                 CTA
  16-stats-numbers/       숫자로 보는 실적
  17-competitor-compare/  경쟁사 비교표
  18-brand-story/         브랜드 스토리
  19-package-contents/    패키지 구성
  20-photo-reviews/       포토리뷰
  21-sns-viral/           SNS 바이럴
  22-bundle-set/          번들/세트 구성
  23-limited-offer/       한정특가 배너
  24-refund-policy/       환불보장 정책
  25-customer-service/    고객센터 안내
  26-price-table/         가격표
```

### 각 에이전트 폴더 구조

```
agent/sections/{섹션명}/
  ├── agent.md          # 정체성, 역할, 먹히는 기준 (must_have / kill_signals)
  ├── memory.md         # 학습 누적, 업종별 성과
  ├── checklist.md      # 품질 체크리스트
  └── references/       # 18업종 × 10~30장
      ├── beauty/
      ├── food/
      ├── fashion/
      ├── electronics/
      ├── furniture/
      ├── kids/
      ├── pets/
      ├── sports/
      ├── saas/
      ├── education/
      ├── finance/
      ├── realestate/
      ├── travel/
      ├── clinic/
      ├── legal/
      ├── enterprise/
      ├── marketing/
      └── consulting/
```

---

## 각 에이전트가 하는 일

### 실행 시점

랜딩페이지 생성 요청마다 실행.

### 판단 과정

```
① 사용자정보, 제품/업종 확인
② 분석한 문구 확인 (①~④ 전략 레이어 출력)
③ 사진/텍스트/그래픽/애니메이션 비중 새로 결정
```

### 입출력

```
입력:
  - 제품 정보 (① Product Intelligence 출력)
  - 전략 지시 (③ Conversion Strategy 출력)
  - 반론 데이터 (④ Objection Killer 출력, 해당 시)

출력: 해당 섹션 1개 완성본
  - 카피 (기존 ⑤ 흡수)
  - 레이아웃 (기존 ⑧ 흡수)
  - 스타일 (기존 ⑨ 흡수)
  - 이미지 프롬프트
  - 사진/텍스트/그래픽/애니메이션 비중 판단
```

---

## 4요소 비중 — 매번 실시간 판단

```
모든 섹션 = 사진 + 텍스트 + 그래픽 + 애니메이션 (4개 전부 포함, 예외 없음)

비중은 고정이 아님. 랜딩페이지 생성 요청마다 에이전트가 제품/업종 보고 매번 새로 결정.

예) 뷰티 HEADER_BANNER → 사진 위주
예) SaaS HEADER_BANNER → 그래픽 위주
예) 식품 REVIEWS → 사진 위주 (포토리뷰)
예) SaaS REVIEWS → 텍스트 위주 (상세 후기)
```

---

## 레퍼런스 DB

```
26 섹션 × 18 업종 × 10~30장 = 4,680~14,040장
```

### 업종 18개

```
제품판매
 1. 뷰티/화장품
 2. 식품/건강식품
 3. 의류/패션
 4. 전자기기/가전
 5. 가구/인테리어
 6. 유아/키즈
 7. 반려동물
 8. 스포츠/아웃도어

서비스/디지털
 9. SaaS/소프트웨어
10. 교육/온라인강의
11. 금융/보험
12. 부동산
13. 여행/호텔
14. 병원/클리닉
15. 법률/세무

B2B
16. 기업솔루션
17. 마케팅/광고대행
18. 컨설팅
```

---

## 크롤러

```
자동 수집
  초기: 매일 1회
  안정화 후: 주 1회

플로우:
  → 갤러리 사이트 크롤링
  → 섹션 분할
  → 26개 타입 분류
  → 업종 분류
  → 해당 에이전트 references/에 저장
```

---

## ⑫ Section Analytics

### 공통 지표 (26개 전부)

| 지표 | 설명 |
|------|------|
| scroll_reach | 스크롤 도달률 (%) |
| dwell_time | 체류시간 (초) |
| bounce_from | 이 섹션에서 이탈률 (%) |

### 섹션별 고유 지표

| 섹션 | 고유 지표 |
|------|----------|
| HEADER_BANNER | ctr (클릭률) |
| KEY_FEATURES | feature_click (기능별 클릭) |
| BEFORE_AFTER | slider_interaction (슬라이더 조작률) |
| REVIEWS | read_more_rate (더보기 클릭률) |
| PHOTO_REVIEWS | image_tap_rate (이미지 탭률) |
| FAQ | open_rate (질문 오픈률) |
| CTA | click_rate, conversion_rate |
| COMPETITOR_COMPARE | compare_hover (항목별 호버) |
| LIMITED_OFFER | urgency_ctr (긴급성 반응) |
| PRICE_TABLE | plan_select_rate (플랜 선택률) |
| SNS_VIRAL | share_rate (공유 클릭률) |
| BUNDLE_SET | bundle_select_rate (세트 선택률) |

---

## 피드백 루프

```
⑫ Section Analytics
    ↓
각 에이전트 memory.md에 업종별 성과 누적
    ↓
다음 생성 시 성과 높은 패턴/비중 자동 반영
    ↓
시간 지날수록 각 섹션이 자동으로 날카로워짐

예)
  "뷰티 업종 REVIEWS: 얼굴 사진 있는 패턴이 CTR 3배 높았다"
  → 다음 뷰티 리뷰 생성 시 얼굴 사진 비중 자동 상향
```

---

## 날짜

- 설계 확정: 2026-03-09
