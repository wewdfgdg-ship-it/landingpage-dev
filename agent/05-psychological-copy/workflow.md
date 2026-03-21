# 워크플로우 — Psychological Copy Agent

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
★ Phase 2 첫 번째 AI 엔진 — 카피 생성 → 후속 Bridge/이미지/코드의 콘텐츠 원천

①②③④ 분석 결과 종합
    │
    ▼
[★ ⑤ Psychological Copy ──AI×1(+retry)──→ CopyBlocks]
    │
    ├──▶ ⑥ Trust Architecture (CopyBlocks 참조, brief 경유)
    ├──▶ Cross-Engine Bridge (CopyBlocks.sections → enrichedCopy)
    ├──▶ Image Generation (sections[].copy → 이미지 프롬프트 참조)
    └──▶ ⑩ Code Engine (Bridge 경유 enrichedCopy)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| ① Product Intelligence | ProductBrief | productDNA (coreValue, USP, keyBenefits, emotionalHook), customerDesire, customerFear, resistanceMap |
| ② Why Now | UrgencyBrief | primaryType, urgencyElements (긴급성 유형 → scarcity-urgency 프레임) |
| ③ Conversion Strategy | StrategyBlueprint | structure[] (섹션 역할 목록), ctaPositions (CTA 배치) |
| ④ Objection Killer | ObjectionMap | activeObjections[] (반론 목록 → objection-reversal 프레임) |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| ⑥ Trust Architecture | brief (간접) | 신뢰 요소 설계 |
| Cross-Engine Bridge | CopyBlocks.sections | enrichedCopy 생성 (카피 + 레이아웃 통합) |
| Image Generation | sections[].copy | 이미지 프롬프트에 카피 내용 반영 |
| ⑩ Code Engine | enrichedCopy (Bridge 경유) | HTML 섹션에 카피 삽입 |

### 실행 조건

- **필수 입력**: ProductBrief, StrategyBlueprint가 non-null이어야 함
- **필수 필드**: strategyBlueprint.structure[] 길이 ≥ 1
- **권장 입력**: UrgencyBrief, ObjectionMap (없으면 해당 프레임 스킵)
- **industry**: tone-matrix.ts 9개 업종 중 하나 (미매칭 시 기본 톤 사용)

### 실패 시 영향 범위

- **영향**: ⑥ 블록, Cross-Engine Bridge 불가, Image Generation 불가 → ⑩⑪ 불가
- **파이프라인 Phase 2 이후 전면 중단**: CopyBlocks 없이는 Bridge, 이미지 생성, 코드 생성 불가
- **복구 방안**: 품질 게이트 재시도 (max 2) → 부분 결과라도 반환 + 경고 → 최후 수단으로 사용자에게 에스컬레이션

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 2 (생성) — 카피 생성 엔진, 30초 내 완료 목표 (재시도 포함 60초)

## 에러 처리 전략

```
에러 발생
    │
    ├── AI 호출 실패 → 재시도 (max 2, 지수 백오프)
    │                   └── 2회 실패 → 사용자에게 에스컬레이션
    │
    ├── 품질 게이트 실패 → buildRetryPrompt → 실패 섹션만 재생성 → mergeCopy → 재평가
    │                      └── 2회 재시도 후에도 실패 → 현재 결과로 진행 + 경고
    │
    ├── 이미지 생성 실패 → 해당 섹션 스킵 (placeholder)
    │
    └── DB/인프라 오류 → 즉시 중단 + 에러 보고
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

**이 에이전트의 개발 Phase**: Phase 1 (MVP) — ⑤는 MVP의 핵심 카피 생성 엔진

## 현재 실행 상태 (자동 갱신)

- 마지막 실행: -
- 평균 실행 시간: -
- 성공률: -
- 자주 발생하는 에러: → memory.md 참조

## 구현 단계별 실행 맵

| 단계 | 파일 | 도구 | 참조 | 검증 |
|------|------|------|------|------|
| 1단계 | types.ts | Write | engine-spec.md 타입 정의 | tsc --noEmit |
| 2단계 | frames.ts | Write | engine-spec.md 7가지 프레임 | tsc --noEmit |
| 3단계 | tone-matrix.ts | Write | engine-spec.md 9개 톤 | tsc --noEmit |
| 4단계 | quality-gate.ts | Write | engine-spec.md 품질 게이트 | tsc --noEmit |
| 5단계 | prompts.ts | Write | rules.md 프롬프트 규칙, Context7 (Claude SDK) | tsc --noEmit |
| 6단계 | index.ts | Write | engine-spec.md 함수 스펙, 호출 순서 | tsc --noEmit + build |
| 7단계 | pipeline.ts | Edit | workflow.md DAG 순서 | tsc --noEmit + build |
| 8단계 | 검증+검수 | Bash | checklist.md → reviewer.md | 전체 통과 |

### 단계별 MCP 활성화

| 단계 | MCP | 활성화 조건 |
|------|-----|-----------|
| 1단계 (types.ts) | — | 타입 정의만, MCP 불필요 |
| 2단계 (frames.ts) | — | 상수 정의, MCP 불필요 |
| 3단계 (tone-matrix.ts) | — | 상수 정의, MCP 불필요 |
| 4단계 (quality-gate.ts) | — | 규칙 로직, MCP 불필요 |
| 5단계 (prompts.ts) | --c7 (Claude SDK) | @anthropic-ai/sdk JSON 모드, 메시지 패턴 |
| 6단계 (index.ts) | --c7 (Claude SDK) | AI 호출 + 비용 추적 패턴 |
| 7단계 (pipeline.ts) | — | 단순 import + 순서 연결 |
| 8단계 (검증+검수) | --seq (FAIL 시) | 복잡한 디버깅 필요 시 |

## 업데이트 규칙

- 매 실행 후: "현재 실행 상태" 섹션 갱신
- memory.md에도 동기화
- DAG 변경 시 (pipeline.ts 수정): 즉시 반영
