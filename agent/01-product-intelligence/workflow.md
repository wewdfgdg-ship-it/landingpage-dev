# 워크플로우 — Product Intelligence Agent

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
★ 파이프라인 최초 엔진 — 모든 후속 엔진의 데이터 원천

사용자 입력 (위저드 3단계: basicInfo, images, deepAnswers)
    │
    ▼
[★ ① Product Intelligence ──AI×3──→ ProductBrief]
    │
    ├──▶ ② Why Now (ProductBrief.productDNA, ProductBrief.marketContext)
    ├──▶ ③ Conversion Strategy (ProductBrief 전체)
    └──▶ ⑤ Psychological Copy (ProductBrief.customerDesire, customerFear, resistanceMap)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| 사용자 입력 (위저드) | ProductIntelligenceInput | basicInfo (제품명, 카테고리, 가격, 타겟, URL), images (제품 이미지 URL[]), deepAnswers (심층 질문 답변) |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| ② Why Now | productDNA, marketContext | 긴급성 유형 판단, 시즌/트렌드 매핑 |
| ③ Conversion Strategy | ProductBrief 전체 | 전환 전략 수립, 섹션 구조 설계, CTA 배치 |
| ⑤ Psychological Copy | customerDesire, customerFear, resistanceMap | 심리 카피 생성, 공포/욕구 기반 설득 |

### 실행 조건

- **필수 입력**: ProductIntelligenceInput가 non-null이어야 함
- **필수 필드**: basicInfo.productName, basicInfo.category가 비어있으면 실행 거부
- **images**: 최소 0개 (선택), 최대 10개
- **deepAnswers**: 최소 1개 이상 답변 존재

### 실패 시 영향 범위

- **영향**: ②③④⑤⑥⑦⑧⑨⑩⑪ **전부 블록** (파이프라인 첫 번째 엔진)
- **파이프라인 완전 중단**: ProductBrief 없이는 어떤 후속 엔진도 실행 불가
- **복구 방안**: AI 호출 실패 시 재시도 (max 2) → 부분 결과라도 confidenceScore와 함께 반환 → 최후 수단으로 사용자에게 에스컬레이션

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 1 (분석) — 파이프라인 최초, 15초 내 완료 목표

## 에러 처리 전략

```
에러 발생
    │
    ├── AI 호출 실패 → 재시도 (max 2, 지수 백오프)
    │                   └── 2회 실패 → 사용자에게 에스컬레이션
    │
    ├── 품질 게이트 실패 → 재생성 (max 2, 피드백 프롬프트)
    │                      └── 2회 실패 → 현재 결과로 진행 + 경고
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

**이 에이전트의 개발 Phase**: Phase 1 (MVP) — ①은 MVP의 첫 번째 엔진

## 구현 단계별 실행 맵

> agent.md 자동 실행 사이클의 "1. 작업 결정" 단계에서 이 섹션을 참조한다.

### 단계 1: 타입 정의 (types.ts)

| 항목 | 값 |
|------|---|
| **파일** | `src/engine/01-product-intelligence/types.ts` |
| **도구** | Read → Write (신규) 또는 Edit (수정) → Bash(`npx tsc --noEmit`) |
| **스킬** | `/implement --type service` |
| **MCP** | 없음 |
| **검증** | engine-spec.md 입출력 타입과 1:1 일치 확인 |
| **완료 조건** | tsc 에러 0, ProductIntelligenceInput + ProductBrief export 존재 |

### 단계 2: 프롬프트 작성 (prompts.ts)

| 항목 | 값 |
|------|---|
| **파일** | `src/engine/01-product-intelligence/prompts.ts` |
| **도구** | Read(types.ts) → Context7(`@anthropic-ai/sdk`: JSON 모드, 비용 추적) → Write(prompts.ts) |
| **스킬** | `/implement` → `/analyze` (프롬프트 품질 검증) |
| **MCP** | `--c7` (Claude SDK 패턴), `--seq` (프롬프트 구조 분석) |
| **규칙** | rules.md — 한국어 시스템 프롬프트, JSON prefill 필수 |
| **검증** | 3개 함수 존재 (extractProductDNA, analyzeCustomer, buildResistanceMap) |
| **완료 조건** | tsc 에러 0, 각 함수가 system+user+prefill 메시지 반환 |

### 단계 3: 엔진 핵심 로직 (index.ts)

| 항목 | 값 |
|------|---|
| **파일** | `src/engine/01-product-intelligence/index.ts` |
| **도구** | Read(types.ts, prompts.ts) → Write(index.ts) → Bash(`npx tsc --noEmit`) |
| **스킬** | `/implement --type service` |
| **MCP** | `--c7` (Claude SDK 호출 패턴) |
| **규칙** | rules.md — 비용 개별 추적 + 합산, confidenceScore 클램핑 0~100, resistanceMap level 클램핑 1~5 |
| **검증** | `runProductIntelligence` 함수 export, 3 AI 순차 호출, 비용 합산, 클램핑 로직 |
| **완료 조건** | tsc + lint + build 전부 통과 |

### 단계 4: 파이프라인 연결 (pipeline.ts)

| 항목 | 값 |
|------|---|
| **파일** | `src/engine/pipeline.ts` |
| **도구** | Read(pipeline.ts) → Edit(import 추가 + 실행 순서 삽입) → Bash(`npm run build`) |
| **스킬** | `/implement` |
| **MCP** | 없음 |
| **검증** | checklist.md — 파이프라인 연결 섹션 전항목 |
| **완료 조건** | import 존재, 실행 순서 ① 최초, progress 콜백 연결, 비용 추적 연결 |

### 단계 5: 검증 + 검수 사이클

| 항목 | 값 |
|------|---|
| **실행** | agent.md 자동 실행 사이클 4~5단계 |
| **도구** | Bash(`npx tsc --noEmit` → `npm run lint` → `npm run build`) |
| **스킬** | `/build` (빌드 검증), `/analyze` (품질 분석) |
| **핸드오프** | checklist.md → `HANDOFF_TO_REVIEWER` → reviewer.md |
| **실패 시** | loop.md 발동 (최대 3회) |

### 단계 간 의존관계

```
단계 1 (types.ts) ─── 독립, 최우선
    │
    ▼
단계 2 (prompts.ts) ── types.ts 의존
    │
    ▼
단계 3 (index.ts) ─── types.ts + prompts.ts 의존
    │
    ▼
단계 4 (pipeline.ts) ─ index.ts 의존
    │
    ▼
단계 5 (검증+검수) ── 전체 의존
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
