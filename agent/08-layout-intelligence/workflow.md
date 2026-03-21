# 워크플로우 — Layout Intelligence Agent

## 12엔진 파이프라인 DAG

```
사용자 입력 (위저드 3단계)
    │
    ▼
① Product Intelligence ──AI×3──→ ProductBrief
    │
    ├──▶ ② Why Now ──────규칙────→ UrgencyBrief
    │       │
    │       ▼
    ├──▶ ③ Conversion Strategy ──AI×1──→ StrategyBlueprint
    │       │
    │       ├──▶ ④ Objection Killer ──규칙──→ ObjectionMap
    │       ├──▶ ⑦ Attention Architecture ──규칙──→ AttentionConfig
    │       │       │
    │       │       ▼
    │       ├──▶ ⑧ Layout Intelligence ──규칙──→ LayoutConfig
    │       └──▶ ⑨ Visual Style (strategyType → 무드 보정)
    │
    ▼
⑤ Psychological Copy ──AI×1(+retry)──→ CopyBlocks
    │
    ├──▶ ⑥ Trust Architecture ──규칙──→ TrustConfig
    │
    ▼
Cross-Engine Bridge ──규칙──→ enrichedCopy + enrichedLayout + zoneAnnotations
    │
    ▼
⑨ Visual Style ──규칙──→ StyleConfig  (①+③ → 무드+토큰)
    │
    ▼
Image Generation ──Gemini×N(병렬3)──→ ImageGenerationOutput
    │
    ▼
⑩ Code Engine ──규칙──→ GeneratedPage (fullHtml)
    │
    ▼
⑪ Deploy ──규칙──→ DeployResult
    │
    ▼
⑫ Learning Loop ──AI×1──→ Diagnosis + Prescription + A/B
```

## 이 에이전트의 위치

```
★ 규칙 엔진 — 섹션별 레이아웃 패턴 매핑

①③⑦ 분석 결과
    │
    ▼
[★ ⑧ Layout Intelligence ──규칙──→ LayoutConfig]
    │
    ├──▶ Cross-Engine Bridge (LayoutConfig → enrichedLayout)
    └──▶ ⑩ Code Engine (Bridge 경유 → 패턴별 렌더링)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| ① Product Intelligence | ProductBrief | decisionType, industry 추론 |
| ③ Conversion Strategy | StrategyBlueprint | structure[] (섹션 역할 목록) |
| ⑦ Attention Architecture | AttentionConfig | 파라미터로 전달되나 현재 미사용 (`_attention`) |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| Cross-Engine Bridge | LayoutConfig.sections | enrichedLayout 생성 |
| ⑩ Code Engine | sections[].selectedPattern | 패턴별 HTML 렌더링 |

### 실행 조건

- **필수 입력**: StrategyBlueprint가 non-null
- **필수 필드**: strategyBlueprint.structure[] 길이 ≥ 1
- **권장 입력**: AttentionConfig (없으면 기본 Zone 배분)

### 실패 시 영향 범위

- **영향**: Bridge enrichedLayout 불가, ⑩ 패턴 매핑 불가
- **복구 방안**: 기본 패턴 매핑 (섹션 역할별 기본 패턴) 반환

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 2 (생성) — 규칙 엔진, 즉시 완료 (<1초)

## 실행 맵 (구현 단계별)

```
Stage 1: types.ts
  → 입출력 타입 정의 (LayoutCategory, LayoutPattern, SectionLayout, LayoutConfig)
  │
Stage 2: index.ts
  → PATTERNS[] 42개 패턴 정의 (inline)
  → ROLE_CATEGORY_MAP, scorePattern, getZoneForOrder
  → runLayoutIntelligence 함수 구현
  → 패턴 매핑 + diversityScore + mobileReadyScore 산출
  │
Stage 3: pipeline.ts 연결
  → src/engine/pipeline.ts에 import + 실행 순서 등록
  │
Stage 4: 검증 + 검수
  → tsc → lint → build → checklist.md → reviewer.md
```

## MCP 활성화 테이블

| Stage | MCP | 사유 |
|-------|-----|------|
| 1~3 | 없음 | 규칙 엔진, 외부 라이브러리 불필요 |
| 4 | --seq (FAIL 시만) | 복잡한 디버깅 필요 시 Sequential 활성화 |

## 개발 Phase 로드맵

**이 에이전트의 개발 Phase**: Phase 2 (디자인) — ⑧는 디자인 Phase에서 구현

## 현재 실행 상태 (자동 갱신)

- 마지막 실행: -
- 평균 실행 시간: -
- 성공률: -

## 업데이트 규칙

- 매 실행 후: "현재 실행 상태" 섹션 갱신
- DAG 변경 시 (pipeline.ts 수정): 즉시 반영
