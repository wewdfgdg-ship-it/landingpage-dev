# 워크플로우 — Why Now Agent

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
★ Phase 1 두 번째 엔진 — ①의 결과를 받아 긴급성을 분석하고 ③에 전달

① Product Intelligence ──AI×3──→ ProductBrief
    │
    ▼
[★ ② Why Now ──────규칙────→ UrgencyBrief]
    │
    ▼
③ Conversion Strategy (ProductBrief + UrgencyBrief)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| ① Product Intelligence | ProductBrief | productDNA (핵심 가치, USP), marketContext (시즌성, 트렌드), resistanceMap (저항 수준), decisionType (의사결정 유형) |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| ③ Conversion Strategy | UrgencyBrief 전체 | 전환 전략 수립 시 긴급성 반영, CTA 배치 최적화 |

### 실행 조건

- **필수 입력**: ProductBrief가 non-null이어야 함
- **필수 필드**: brief.marketContext, brief.resistanceMap가 존재해야 함
- **industry**: non-null, non-empty string
- **priceRange**: non-null, non-empty string

### 실패 시 영향 범위

- **영향**: ③ 일부 영향 (urgency 정보 없이도 ③ 진행 가능)
- **파이프라인 비차단**: UrgencyBrief 없이도 ③은 기본 전략으로 진행 가능
- **복구 방안**: 규칙 매핑 실패 시 기본값(social_proof, ctaUrgencyLevel=3) 반환 → ③에 경고 전달

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 1 (분석) — ① 직후 실행, <1초 내 완료 목표 (규칙 엔진)

## 에러 처리 전략

```
에러 발생
    │
    ├── 규칙 매핑 실패 (예상치 못한 industry) → 기본값 반환 + 경고
    │
    ├── 입력 필드 누락 → 기본값으로 대체 + 경고 로그
    │
    ├── 타입 불일치 → 즉시 중단 + 에러 보고
    │
    └── 범위 초과 값 → 클램핑 적용 + 경고
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

**이 에이전트의 개발 Phase**: Phase 1 (MVP) — ②는 ① 직후 실행되는 규칙 엔진

## 구현 단계별 실행 맵

> 이 에이전트가 ② Why Now 엔진을 구현할 때 따르는 단계별 실행 가이드.

### 1단계: types.ts — 타입 정의
| 항목 | 값 |
|------|---|
| **파일** | `src/engine/02-why-now/types.ts` |
| **도구** | Read(01 types.ts) → Write(types.ts) |
| **스킬** | /implement |
| **MCP** | 없음 (규칙 엔진) |
| **rules.md** | TypeScript strict, 명시적 반환 타입 |
| **검증** | `npx tsc --noEmit` |
| **완료 기준** | UrgencyBrief, UrgencyType, UrgencyElement, UrgencyPlacement 타입 정의 완료 |

### 2단계: rules.ts — 규칙 매핑 테이블
| 항목 | 값 |
|------|---|
| **파일** | `src/engine/02-why-now/rules.ts` |
| **도구** | Write(rules.ts) |
| **스킬** | /implement |
| **MCP** | 없음 |
| **rules.md** | 순수 함수, 상수 관리, 기본값 fallback |
| **검증** | `npx tsc --noEmit` |
| **완료 기준** | URGENCY_TYPES 상수, industry→urgencyType 매핑, priceRange→intensity 매핑, 기본값 fallback 정의 |

### 3단계: index.ts — runWhyNow 함수 구현
| 항목 | 값 |
|------|---|
| **파일** | `src/engine/02-why-now/index.ts` |
| **도구** | Write(index.ts) → Bash(tsc) |
| **스킬** | /implement → /test |
| **MCP** | --seq (복잡한 매핑 로직 시) |
| **rules.md** | 순수 함수, 클램핑 로직, 빈 배열 금지 |
| **검증** | `npx tsc --noEmit` + `npm run lint` |
| **완료 기준** | determineUrgencyType→buildUrgencyElements→calculateCtaUrgencyLevel→determinePlacement 4단계 순차 호출 |

### 4단계: pipeline.ts — 파이프라인 연결
| 항목 | 값 |
|------|---|
| **파일** | `src/engine/pipeline.ts` |
| **도구** | Read(pipeline.ts) → Edit |
| **스킬** | /implement |
| **MCP** | 없음 |
| **rules.md** | import 절대경로 (@/), 비용 ₩0 고정 |
| **검증** | `npx tsc --noEmit` + `npm run build` |
| **완료 기준** | runWhyNow import + 실행 순서(① 직후) + progress 콜백 + 에러 핸들링(기본값 반환) |

### 5단계: 검증 + 검수
| 항목 | 값 |
|------|---|
| **파일** | checklist.md → reviewer.md |
| **도구** | Bash(tsc + lint + build) |
| **스킬** | /test → /analyze |
| **MCP** | --seq (FAIL 시 원인 분석) |
| **검증** | checklist.md 전 항목 통과 |
| **완료 기준** | reviewer.md PASS/WARN → memory.md 기록 → output-format.md 출력 |

### 의존관계 DAG

```
1단계 (types.ts)
    │
    ▼
2단계 (rules.ts) ← types.ts의 UrgencyType, UrgencyElement 참조
    │
    ▼
3단계 (index.ts) ← types.ts + rules.ts 참조
    │
    ▼
4단계 (pipeline.ts) ← index.ts의 runWhyNow 참조
    │
    ▼
5단계 (검증+검수) ← 전체 빌드 성공 필요
```

## 현재 실행 상태 (자동 갱신)

- 마지막 실행: -
- 평균 실행 시간: -
- 성공률: -
- 자주 발생하는 에러: → memory.md 참조

## 업데이트 규칙

- 매 실행 후: "현재 실행 상태" 섹션 갱신
- memory.md에도 동기화
- DAG 변경 시 (pipeline.ts 수정): 즉시 반영
