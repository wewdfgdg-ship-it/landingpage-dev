# 워크플로우 — Attention Architecture Agent

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
★ 규칙 엔진 — 시선 흐름 + Zone 설계

①③ 분석 결과 + industry
    │
    ▼
[★ ⑦ Attention Architecture ──규칙──→ AttentionConfig]
    │
    ├──▶ ⑧ Layout Intelligence (AttentionConfig → 레이아웃 최적화)
    └──▶ Cross-Engine Bridge (zones → Zone 어노테이션)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| ① Product Intelligence | ProductBrief | decisionType, resistanceMap (urgency, price) |
| ③ Conversion Strategy | StrategyBlueprint | totalSections (Zone 픽셀 경계 계산 기준) |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| ⑧ Layout Intelligence | AttentionConfig (zones, gazePattern) | Zone별 레이아웃 패턴 최적화 |
| Cross-Engine Bridge | AttentionConfig.zones | Zone 어노테이션 (섹션별 주의력 정보) |

### 실행 조건

- **필수 입력**: ProductBrief, StrategyBlueprint가 non-null
- **필수 필드**: brief.decisionType 존재, strategyBlueprint.structure[] 길이 ≥ 1

### 실패 시 영향 범위

- **영향**: ⑧ 레이아웃 최적화 제한, Bridge Zone 어노테이션 불가
- **파이프라인 계속 진행 가능**: 기본 AttentionConfig로 대체 가능
- **복구 방안**: 기본 4 Zone (균등 픽셀 배분) + 기본 hookType (visual_hook) 반환

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
    ├── 입력 누락 → 기본 AttentionConfig 반환 (균등 4 Zone)
    │
    ├── pixelRange 겹침 → 순차 재계산
    │
    ├── hookType/gazePattern 무효값 → 기본값 반환 (visual_hook / z_pattern)
    │
    └── 타입 에러 → 즉시 수정
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

**이 에이전트의 개발 Phase**: Phase 3 (에디터) — ⑦는 에디터 Phase에서 구현

## 실행 맵 (구현 단계별)

```
Stage 1: types.ts
  → 입출력 타입 정의 (ZoneType, HookType, GazePattern, ZoneConfig, AttentionConfig)
  │
Stage 2: index.ts
  → selectHookType, GAZE_MAP, buildZones, runAttentionArchitecture 구현
  → 4 Zone 생성 + 픽셀 경계 계산 (별도 rules.ts 없음)
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
