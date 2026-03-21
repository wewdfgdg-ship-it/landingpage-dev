# 워크플로우 — Objection Killer Agent

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
    │                                    (품질 게이트: ≥80점, max 2 retry)
    │                                    (★ 2회 실패 시 최소 카피 모드)
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
★ Phase 1 마지막 엔진 — ①③의 결과로 반론을 분석하고 Bridge를 통해 Copy에 주입

① Product Intelligence ──AI×3──→ ProductBrief
    │
    ▼
③ Conversion Strategy ──AI×1──→ StrategyBlueprint
    │
    ▼
[★ ④ Objection Killer ──규칙──→ ObjectionMap]
    │
    ▼
Cross-Engine Bridge (→ ⑤ Psychological Copy에 반론 가이드 주입)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| ① Product Intelligence | ProductBrief | resistanceMap (저항 수준 5개), productDNA (핵심 가치, USP), customerDesire (욕구) |
| ③ Conversion Strategy | StrategyBlueprint | structure[] (섹션 구조), totalSections (총 섹션 수) |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| Cross-Engine Bridge | ObjectionMap 전체 | 반론 대응 전략을 Copy 섹션에 주입, 반론 처리 가이드 매핑 |

### 실행 조건

- **필수 입력**: ProductBrief가 non-null이어야 함
- **필수 필드**: brief.resistanceMap 존재
- **StrategyBlueprint**: non-null이어야 함 (structure[] 필요)
- **structure[]**: non-empty 배열

### 실패 시 영향 범위

- **영향**: Bridge의 Objection→Copy 주입 불가 (치명적이지 않음)
- **파이프라인 비차단**: Copy는 ObjectionMap 없이도 진행 가능 (반론 처리 섹션만 약해짐)
- **복구 방안**: 규칙 매핑 실패 시 빈 ObjectionMap 반환 → Bridge에 경고 전달

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 1 (분석) — ③ 직후 실행, <1초 내 완료 목표 (규칙 엔진)

## 에러 처리 전략

```
에러 발생
    │
    ├── 규칙 매핑 실패 (예상치 못한 type) → 해당 반론 스킵 + 경고
    │
    ├── 입력 필드 누락 (resistanceMap 키 없음) → 해당 반론 스킵 + 경고
    │
    ├── injectAt 매핑 실패 (structure에 적합한 섹션 없음) → 가장 가까운 섹션 사용
    │
    ├── 타입 불일치 → 즉시 중단 + 에러 보고
    │
    └── 전체 실패 시 → 빈 ObjectionMap 반환 + 경고 (파이프라인 비차단)
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

**이 에이전트의 개발 Phase**: Phase 3 (에디터) — ④는 에디터 Phase에 포함되나, Phase 1 파이프라인과 연결

## 현재 실행 상태 (자동 갱신)

- 마지막 실행: -
- 평균 실행 시간: -
- 성공률: -
- 자주 발생하는 에러: → memory.md 참조

## 구현 단계별 실행 맵

| 단계 | 파일 | 도구 | 참조 | 검증 |
|------|------|------|------|------|
| 1단계 | types.ts | Write | engine-spec.md 타입 정의 | tsc --noEmit |
| 2단계 | rules.ts | Write | rules.md 엔진 특화 규칙 | tsc --noEmit |
| 3단계 | index.ts | Write | engine-spec.md 함수 스펙 | tsc --noEmit + build |
| 4단계 | pipeline.ts | Edit | workflow.md DAG 순서 | tsc --noEmit + build |
| 5단계 | 검증+검수 | Bash | checklist.md → reviewer.md | 전체 통과 |

### 단계별 MCP 활성화

| 단계 | MCP | 활성화 조건 |
|------|-----|-----------|
| 1단계 (types.ts) | — | 규칙 엔진, MCP 불필요 |
| 2단계 (rules.ts) | — | 규칙 엔진, MCP 불필요 |
| 3단계 (index.ts) | --seq (선택) | 복잡한 매핑 로직 분석 시 |
| 4단계 (pipeline.ts) | — | 단순 import + 순서 연결 |
| 5단계 (검증+검수) | --seq (FAIL 시) | 복잡한 디버깅 필요 시 |

## 업데이트 규칙

- 매 실행 후: "현재 실행 상태" 섹션 갱신
- memory.md에도 동기화
- DAG 변경 시 (pipeline.ts 수정): 즉시 반영
