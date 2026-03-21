# 섹션 에이전트 인터페이스 설계서

> 3개 연결부: ③→26개 분배, 26개→⑩ 합류, ⑫→26개 피드백
> 설계 확정: 2026-03-09

---

## 전체 데이터 흐름

```
①②④
  ↓
③ section_dispatch (섹션 리스트 + 순서 + 섹션별 전략 지시)
  ↓
[S-01] [S-02] [S-13] [S-15] ... (병렬 실행)
  ↓      ↓      ↓      ↓
section_output (통일 포맷: copy + layout + style + image_prompt + element_weight)
  ↓
⑩ code_engine_input (sections[] 배열로 합체)
  ↓
⑪ Deploy (추적 코드 삽입)
  ↓
⑫ section_analytics (섹션별 성과 수집)
  ↓
feedback_to_agent (각 에이전트 memory.md에 저장)
```

---

## 1. ③ → 26개 섹션 에이전트 (분배 인터페이스)

③ Conversion Strategy가 내보내는 출력.

```yaml
section_dispatch:
  selected_sections:        # 이번 페이지에 사용할 섹션 리스트
    - HEADER_BANNER
    - KEY_FEATURES
    - FEATURE_DETAIL_1
    - REVIEWS
    - CTA
    - ...

  section_order:            # 순서
    1: HEADER_BANNER
    2: KEY_FEATURES
    3: FEATURE_DETAIL_1
    ...

  section_briefs:           # 각 섹션 에이전트에 전달할 지시
    HEADER_BANNER:
      strategy_hint: "가격 대비 성능 강조, 충동구매 유도"
      tone: "강렬하고 직관적"
      target_emotion: "즉시 필요성 체감"

    REVIEWS:
      strategy_hint: "30대 여성 타겟, 피부 변화 강조"
      tone: "진정성 있게"
      target_emotion: "나도 이렇게 될 수 있다"

    # ... × 선택된 섹션 수
```

### 각 섹션 에이전트가 받는 입력

```yaml
section_agent_input:
  product_info: "① Product Intelligence 출력"
  strategy: "③ section_briefs에서 자기 섹션 지시"
  objection_data: "④ Objection Killer 출력 (해당 시)"
  order: "③ section_order에서 자기 순서"
  references: "references/{업종}/ 레퍼런스 이미지"
```

---

## 2. 26개 섹션 에이전트 → ⑩ Code Engine (합류 인터페이스)

### 각 섹션 에이전트가 내보내는 출력 (통일 포맷)

```yaml
section_output:
  section_key: "HEADER_BANNER"
  order: 1                    # ③이 정한 순서

  copy:
    headline: "3초 만에 피부가 달라집니다"
    subheadline: "임상시험 완료, 92% 만족"
    body: "..."
    cta_text: "지금 시작하기"

  layout:
    type: "hero_split"        # 레이아웃 패턴
    structure:
      - element: "image"
        position: "left"
        width: "50%"
      - element: "text_block"
        position: "right"
        width: "50%"

  style:
    background: "#0a0a0a"
    text_color: "#ffffff"
    accent_color: "#4ade80"
    font_size:
      headline: "text-4xl"
      body: "text-base"
    spacing: "py-20"

  image_prompt: "깨끗한 피부의 30대 여성, 미니멀 배경..."

  element_weight:
    photo: 70
    text: 50
    graphic: 30
    animation: 20
```

### ⑩ Code Engine이 받는 합체 입력

```yaml
code_engine_input:
  page_meta:
    product: "① Product Intelligence 출력"
    strategy: "③ Conversion Strategy 출력"

  sections:                 # 26개 에이전트 출력 합체 (순서대로)
    - section_key: "HEADER_BANNER"
      order: 1
      copy: { ... }
      layout: { ... }
      style: { ... }
      image_prompt: "..."
      element_weight: { photo: 70, text: 50, graphic: 30, animation: 20 }

    - section_key: "KEY_FEATURES"
      order: 2
      copy: { ... }
      layout: { ... }
      style: { ... }
      image_prompt: "..."
      element_weight: { photo: 40, text: 60, graphic: 70, animation: 30 }

    - section_key: "REVIEWS"
      order: 3
      copy: { ... }
      layout: { ... }
      style: { ... }
      image_prompt: "..."
      element_weight: { photo: 80, text: 40, graphic: 10, animation: 5 }

    # ... × 선택된 섹션 수
```

---

## 3. ⑫ → 26개 섹션 에이전트 (피드백 인터페이스)

### ⑫ Section Analytics가 수집하는 데이터

```yaml
section_analytics:
  page_id: "page_abc123"
  deployed_at: "2026-03-09"
  product_industry: "beauty"

  page_metrics:
    total_conversion: 2.3%
    total_bounce: 45%
    avg_session: 128s

  section_metrics:
    HEADER_BANNER:
      scroll_reach: 100%
      dwell_time: 3.2s
      bounce_from: 12%
      ctr: 8.5%

    KEY_FEATURES:
      scroll_reach: 88%
      dwell_time: 5.4s
      bounce_from: 8%
      feature_click: 34%

    REVIEWS:
      scroll_reach: 62%
      dwell_time: 8.1s
      bounce_from: 5%
      read_more_rate: 23%

    CTA:
      scroll_reach: 45%
      dwell_time: 2.1s
      bounce_from: 8%
      click_rate: 7.3%
      conversion_rate: 3.1%
```

### 공통 지표 (26개 섹션 전부)

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

### ⑫ → 섹션 에이전트 피드백 포맷

```yaml
feedback_to_agent:
  target: "S-13"              # 13-reviews 에이전트
  section_key: "REVIEWS"
  industry: "beauty"

  performance:
    scroll_reach: 62%
    dwell_time: 8.1s
    read_more_rate: 23%

  context:
    pattern_used: "review_photo_card"
    element_weight: { photo: 80, text: 40, graphic: 10, animation: 5 }

  verdict: "above_average"    # 동일 업종 평균 대비

  learning_hint: "뷰티 업종 포토+얼굴 패턴이 체류시간 2배"
```

### 에이전트 memory.md 저장 형식

피드백 수신 시 각 에이전트가 memory.md에 누적:

```markdown
## 업종별 성과

| 업종 | 생성 수 | 평균 도달률 | 평균 체류시간 | 고유지표 | 학습 |
|------|--------|-----------|-------------|---------|------|
| beauty | 12 | 62% | 8.1s | read_more 23% | 포토+얼굴 패턴 체류시간 2배 |
| saas | 8 | 55% | 5.2s | read_more 15% | 텍스트 위주 리뷰가 SaaS에서 효과적 |

## 패턴 학습

| 날짜 | 업종 | 패턴 | 성과 | 학습 |
|------|------|------|------|------|
| 2026-03-09 | beauty | review_photo_card | above_average | 포토+얼굴 체류시간 2배 |
```

---

## 날짜

- 인터페이스 설계 확정: 2026-03-09
