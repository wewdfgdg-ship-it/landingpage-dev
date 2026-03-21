# 워크플로우 — Deploy Agent

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
★ Phase 4 빌드 — 배포 (규칙 엔진)

⑩ Code Engine (GeneratedPage)
    │
    ▼
[★ ⑪ Deploy ──규칙──→ DeployResult (slug, url, deployedAt)]
    │
    └──▶ ⑫ Learning Loop (배포 후 트래킹 시작)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| 파이프라인 | projectId | 프로젝트 ID (DB 조회에 사용) |
| 파이프라인 | orgId | 조직 ID (소유권 검증에 사용) |

> ⑩ Code Engine의 generatedHtml은 파이프라인에서 DB에 저장 후, 이 엔진에서 DB 조회로 존재 확인만 함.

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| ⑫ Learning Loop | slug, url | 배포된 페이지 식별 + 트래킹 URL |

### 실행 조건

- **필수 입력**: DeployInput (projectId + orgId)
- **DB 사전 조건**: project.status === 'GENERATED', project.generatedHtml 존재
- **외부 의존**: DB 연결 활성 (Prisma client)

### 실패 시 영향 범위

- **영향**: 페이지 **미배포** — 사용자에게 직접 영향 (결과물을 볼 수 없음)
- **⑫ 블록**: Learning Loop 트래킹 시작 불가
- **복구 방안**: DB 업데이트 실패 → 에러 throw → 사용자에게 에스컬레이션

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 4 (빌드) — 규칙 엔진, <1초 완료 목표 (DB 상태 전환만)

## 에러 처리 전략

```
에러 발생
    │
    ├── 프로젝트 미존재 → throw '프로젝트를 찾을 수 없습니다'
    │
    ├── status ≠ GENERATED → throw '생성 완료 상태에서만 배포할 수 있습니다'
    │
    ├── generatedHtml 없음 → throw '생성된 HTML이 없습니다'
    │
    └── DB 업데이트 실패 → Prisma 에러 전파 → 사용자에게 에스컬레이션
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

**이 에이전트의 개발 Phase**: Phase 3 (에디터) — ⑪은 배포 엔진

## 실행 맵 (Execution Map)

```
Stage 1: 타입/구조 확인
   Read(types.ts) → DeployResult, DeployConfig 타입 확인
   Read(index.ts) → DeployInput, runDeploy, undeploy 확인

Stage 2: DB 연동 확인
   Read(prisma/schema.prisma) → Project 모델 필드 확인 (slug, status, isDeployed, deployedAt, generatedHtml)

Stage 3: 사전 검증 + 상태 전환 구현
   Edit(index.ts) → findFirst 조건, status/generatedHtml 검증, DB update 로직

Stage 4: 파이프라인 연결
   Edit(src/engine/pipeline.ts) → import + 실행 순서 + emitProgress

Stage 5: 검증 + 검수
   Bash("npx tsc --noEmit") → 타입 체크
   Bash("npm run lint") → 린트
   Bash("npm run build") → 빌드
   → checklist.md 실행 → [HANDOFF_TO_REVIEWER] 생성
   → reviewer.md 검수 → [REVIEW_RESULT] 생성
   → FAIL 시 loop.md 발동
```

### MCP 활성화 기준

| Stage | MCP | 조건 |
|-------|-----|------|
| 1~2 | - | 내부 코드만 |
| 3 | --c7 (선택) | Prisma 문서 참조 시 |
| 4 | - | 내부 코드만 |
| 5 | --seq (FAIL 시만) | 복잡한 에러 분석 필요 시 |

## 현재 실행 상태 (자동 갱신)

- 마지막 실행: -
- 평균 실행 시간: -
- 성공률: -
- 자주 발생하는 에러: → memory.md 참조

## 업데이트 규칙

- 매 실행 후: "현재 실행 상태" 섹션 갱신
- memory.md에도 동기화
- DAG 변경 시 (pipeline.ts 수정): 즉시 반영
- 실행 맵 변경 시: Stage/MCP 테이블 업데이트
