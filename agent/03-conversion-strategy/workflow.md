# 워크플로우 — Conversion Strategy Agent

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
★ Phase 1 핵심 전략 엔진 — ①②의 결과를 종합하여 페이지 구조를 설계

① Product Intelligence ──AI×3──→ ProductBrief
    │
    ▼
② Why Now ──────규칙────→ UrgencyBrief
    │
    ▼
[★ ③ Conversion Strategy ──AI×1──→ StrategyBlueprint]
    │
    ├──▶ ④ Objection Killer (StrategyBlueprint 전체)
    ├──▶ ⑤ Psychological Copy (structure[], strategyType)
    ├──▶ ⑦ Attention Architecture (structure[], ctaPositions)
    ├──▶ ⑧ Layout Intelligence (structure[])
    └──▶ ⑨ Visual Style (strategyType, ctaUrgencyLevel → 무드 보정)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| ① Product Intelligence | ProductBrief | productDNA (핵심 가치, USP), customerDesire (욕구), customerFear (공포), resistanceMap (저항 수준), decisionType (의사결정 유형), marketContext (시장 맥락) |
| ② Why Now | UrgencyBrief | primaryType (긴급성 유형), urgencyElements (긴급성 요소들), ctaUrgencyLevel (CTA 긴급도) |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| ④ Objection Killer | StrategyBlueprint 전체 | 섹션별 반론 매핑, 반론 주입 위치 결정 |
| ⑤ Psychological Copy | structure[], strategyType | 섹션별 카피 생성, 전략 유형에 맞는 톤 결정 |
| ⑦ Attention Architecture | structure[], ctaPositions | 주의 집중 영역 설계, CTA 강조 패턴 |
| ⑧ Layout Intelligence | structure[] | 섹션별 레이아웃 패턴 선택 |
| ⑨ Visual Style | strategyType, ctaUrgencyLevel | 전략 유형→무드 보정, 긴급도→색상 강도 |

### 실행 조건

- **필수 입력**: ProductBrief가 non-null이어야 함
- **필수 필드**: brief.productDNA, brief.decisionType 존재
- **UrgencyBrief**: non-null 권장이나, null이어도 기본 전략으로 진행 가능
- **pageGoal**: non-null, non-empty string
- **industry**: non-null, non-empty string

### 실패 시 영향 범위

- **영향**: ④⑦⑧ 직접 블록, ⑤ 간접 영향, ⑨ 무드 보정 불가 (비차단)
- **복구 방안**: AI 호출 실패 시 재시도 (max 2) → 규칙 기반 기본 구조 생성 → 최후 수단으로 사용자에게 에스컬레이션

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 1 (분석) — ②직후, 5-10초 내 완료 목표

## 에러 처리 전략

```
에러 발생
    │
    ├── AI 호출 실패 → 재시도 (max 2, 지수 백오프)
    │                   └── 2회 실패 → 규칙 기반 기본 구조 생성 + 경고
    │
    ├── 품질 게이트 실패 → 재생성 (max 2, 피드백 프롬프트)
    │                      └── 2회 실패 → 현재 결과로 진행 + 경고
    │
    ├── JSON 파싱 실패 → 재시도 (프롬프트 강화)
    │                    └── 2회 실패 → 규칙 기반 fallback
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

**이 에이전트의 개발 Phase**: Phase 1 (MVP) — ③은 MVP의 핵심 전략 엔진

## 구현 단계별 실행 맵

```
1단계 types.ts ── 타입 정의
    ├── 작업: StrategyBlueprint, StrategyType, SectionStructure, SectionRole 정의
    ├── 도구: Write(types.ts) → Bash("npx tsc --noEmit")
    ├── 참조: engine-spec.md 입출력 타입
    ├── 검증: tsc 에러 0
    └── 다음: 2단계

2단계 rules.ts ── 규칙 로직
    ├── 작업: determineStrategyType(), calculateMetrics() 구현
    ├── 도구: Write(rules.ts) → Bash("npx tsc --noEmit")
    ├── 참조: rules.md 전략 유형 결정 규칙
    ├── 검증: tsc 에러 0 + strategyType 5가지 매핑 완전성
    └── 다음: 3단계

3단계 prompts.ts ── AI 프롬프트
    ├── 작업: generateStructure() AI 프롬프트 (한국어 시스템 프롬프트 + JSON prefill)
    ├── 도구: Write(prompts.ts) → Context7(Claude SDK)
    ├── 참조: rules.md prompts.ts 규칙
    ├── 검증: tsc 에러 0 + 프롬프트에 StrategyType 5가지 + SectionRole 7가지 명시
    └── 다음: 4단계

4단계 index.ts ── 실행 함수
    ├── 작업: runConversionStrategy() 구현 (determineStrategyType→generateStructure→calculateMetrics)
    ├── 도구: Write(index.ts) → Bash("npx tsc --noEmit") → Bash("npm run build")
    ├── 참조: engine-spec.md 호출 순서, workflow.md DAG
    ├── 검증: tsc + build + 재시도 로직 + 비용 추적
    └── 다음: 5단계

5단계 pipeline.ts ── 파이프라인 연결
    ├── 작업: pipeline.ts에 import + 실행 순서 배치 (②직후)
    ├── 도구: Read(pipeline.ts) → Edit → Bash("npm run build")
    ├── 참조: workflow.md DAG (①→②→③→④⑤⑦⑧)
    ├── 검증: build 성공 + progress 콜백 + 비용 합산
    └── 다음: 6단계

6단계 검증+검수 ── checklist.md → reviewer.md
    ├── 작업: 전체 체크리스트 실행 + 검수
    ├── 도구: checklist.md 자동 실행 → [HANDOFF_TO_REVIEWER] → reviewer.md
    ├── 참조: checklist.md, reviewer.md
    ├── 검증: PASS/WARN → 완료 | FAIL → loop.md
    └── 완료: memory.md CHECKPOINT 갱신
```

### 단계별 MCP 활성화

| 단계 | MCP | 활성화 조건 |
|------|-----|------------|
| 1단계 (types.ts) | — | 규칙만, MCP 불필요 |
| 2단계 (rules.ts) | — | 규칙만, MCP 불필요 |
| 3단계 (prompts.ts) | Context7 | Claude AI SDK 패턴 필요 시 |
| 4단계 (index.ts) | Sequential (선택) | 복잡한 에러 분석 필요 시 |
| 5단계 (pipeline.ts) | — | 단순 연결 |
| 6단계 (검증) | Sequential | FAIL 시 원인 분석 |

## 현재 실행 상태 (자동 갱신)

- 마지막 실행: -
- 평균 실행 시간: -
- 성공률: -
- 자주 발생하는 에러: → memory.md 참조

## 업데이트 규칙

- 매 실행 후: "현재 실행 상태" 섹션 갱신
- memory.md에도 동기화
- DAG 변경 시 (pipeline.ts 수정): 즉시 반영
