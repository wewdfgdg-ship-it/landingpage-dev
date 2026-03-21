# 워크플로우 — Trust Architecture Agent

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
★ 규칙 엔진 — 신뢰 요소 선정 및 배치

①③ 분석 결과
    │
    ▼
[★ ⑥ Trust Architecture ──규칙──→ TrustConfig]
    │
    └──▶ Cross-Engine Bridge (TrustConfig → Layout 반영)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| ① Product Intelligence | ProductBrief | resistanceMap (trust, price, alternative), decisionType |
| ③ Conversion Strategy | StrategyBlueprint | structure[] (배치 위치 결정용) |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| Cross-Engine Bridge | TrustConfig.trustElements | Trust → Layout 반영 (신뢰 배지 위치 어노테이션) |

### 실행 조건

- **필수 입력**: ProductBrief, StrategyBlueprint가 non-null
- **필수 필드**: brief.resistanceMap 존재, strategyBlueprint.structure[] 길이 ≥ 1

### 실패 시 영향 범위

- **영향**: Bridge의 Trust→Layout 반영 불가 (치명적이지 않음)
- **파이프라인 계속 진행 가능**: TrustConfig 없이도 다른 엔진은 동작 가능
- **복구 방안**: 기본 TrustConfig (빈 trustElements + trustScore 0) 반환

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 2 (생성) — 규칙 엔진, 즉시 완료 (<1초)

## 에러 처리 전략

```
에러 발생
    │
    ├── 입력 누락 → 기본 TrustConfig 반환 (빈 배열 + score 0)
    │
    ├── level 범위 초과 → 클램핑 (Math.min(6, Math.max(1, level)))
    │
    ├── sectionOrder 범위 초과 → structure[].length - 1 로 클램핑
    │
    └── 타입 에러 → 즉시 수정 (규칙 엔진이므로 결정론적)
```

## 개발 Phase 로드맵

| Phase | 기간 | 포함 엔진 |
|-------|------|----------|
| 0. 기반 | 1주 ✅ | 셋업, DB, 인증, 기본 UI |
| 1. MVP | 3주 | ①②③⑤ + BullMQ + SSE |
| 2. 디자인 | 2주 | ⑧⑨⑩ + 이미지 + HTML 내보내기 |
| 3. 에디터 | 2주 | ④⑥⑦⑪ + 에디터 UI + 섹션 재생성 |
| 4. 분석 | 2주 | ⑫ + 트래킹 + A/B |
| 5. 비즈니스 | 1주 | 결제, 사용량, 플랜 |

**이 에이전트의 개발 Phase**: Phase 3 (에디터) — ⑥는 에디터 Phase에서 구현

## 실행 맵 (구현 단계별)

```
Stage 1: types.ts
  → TrustLevel, TrustElement, TrustConfig 타입 정의
  │
Stage 2: index.ts
  → TRUST_TEMPLATES 6레벨 정의 (별도 rules.ts 없음)
  → findSectionOrder, selectRelevantElements 헬퍼
  → runTrustArchitecture 함수 구현
  → Lv6 조건부 활성 + trustScore 커버리지 산출
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

## 현재 실행 상태 (자동 갱신)

- 마지막 실행: -
- 평균 실행 시간: -
- 성공률: -
- 자주 발생하는 에러: → memory.md 참조

## 업데이트 규칙

- 매 실행 후: "현재 실행 상태" 섹션 갱신
- memory.md에도 동기화
- DAG 변경 시 (pipeline.ts 수정): 즉시 반영
