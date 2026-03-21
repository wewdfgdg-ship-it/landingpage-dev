# 워크플로우 — Learning Loop Agent

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
    │
    └──▶ ① Product Intelligence (피드백 루프: WinningPattern)
```

## 이 에이전트의 위치

```
★ Phase 4 분석 — 학습 + 전환율 최적화 (AI ×1 + 규칙)

⑪ Deploy (DeployResult) + 트래킹 데이터
    │
    ▼
[★ ⑫ Learning Loop ──AI×1──→ LearningLoopOutput]
    │
    └──▶ ① Product Intelligence (WinningPattern 피드백)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| ⑪ Deploy | DeployResult | slug (페이지 식별), url (트래킹 대상) |
| 트래킹 시스템 | TrackingMetrics | pageViews, clicks, conversions, scrollDepth, sectionMetrics |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| ① Product Intelligence | winningPatterns[] | 향후 제품 분석 시 승리 패턴 반영 |

### 실행 조건

- **필수 입력**: projectId + TrackingMetrics가 non-null
- **최소 데이터**: pageViews ≥ 100 (통계적 의미를 위해)
- **트래킹 기간**: 최소 24시간 이상의 데이터
- **배포 완료**: ⑪ Deploy가 성공적으로 완료된 상태

### 실패 시 영향 범위

- **영향**: 자동 최적화 불가 — 페이지는 정상 작동, 학습만 안 됨
- **① 피드백 불가**: WinningPattern 축적 안 됨 → 향후 생성 개선 불가
- **복구 방안**: AI 진단 실패 → 규칙 기반 진단만으로 진행 → 부분 결과라도 반환

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 4 (분석) — 배포 후 비동기 실행, 5-15초 내 완료 목표

## 에러 처리 전략

```
에러 발생
    │
    ├── AI 진단 실패 → 규칙 기반 진단만으로 진행 (부분 결과)
    │
    ├── 메트릭 데이터 부족 → 경고 + 최소 진단만 (통계적 의미 낮음 표시)
    │
    ├── A/B 테스트 교란 변수 → 테스트 중단 + 사용자에게 보고
    │
    ├── 통계적 유의성 검증 실패 → "inconclusive" 반환 + 추가 데이터 수집 권장
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

**이 에이전트의 개발 Phase**: Phase 4 (분석) — ⑫는 트래킹 + A/B 테스트 엔진

## 실행 맵 (Execution Map)

```
Stage 1: 타입/구조 확인
   Read(types.ts) → TrackingMetrics, LearningLoopOutput 확인
   │
Stage 2: 규칙 기반 진단 구현
   Write/Edit(rules.ts) → evaluateThresholds (임계값 5종)
   │
Stage 3: AI 진단 프롬프트 작성
   Context7(Claude SDK) → Write(prompts.ts)
   → 한국어 시스템 프롬프트 + JSON prefill + DiagnosisType enum
   │
Stage 4: 핵심 함수 구현
   Write/Edit(index.ts) → runLearningLoop
   → 규칙 진단 → AI 진단 → 병합 → A/B 관리 → 패턴 추출
   │
Stage 5: 파이프라인 연결 + 통계 검증
   Edit(pipeline.ts) → ⑪ Deploy 이후 비동기 실행
   → checkStatisticalSignificance (p < 0.05)
   │
Stage 6: 검증 + 검수
   Bash(tsc, lint, build) → checklist.md → reviewer.md
```

## MCP 활성화 테이블

| 단계 | MCP 서버 | 용도 | 활성화 조건 |
|------|----------|------|------------|
| Stage 3 | Context7 | Claude SDK API 패턴 | AI 프롬프트 작성 시 |
| Stage 4 | Sequential | 복잡한 병합/오케스트레이션 로직 분석 | 복잡도 > 0.7 |
| Stage 5 | Sequential | p-value 통계 로직 검증 | 통계 계산 구현 시 |
| Stage 6 FAIL | Sequential | FAIL 원인 분석 + 수정 방향 추론 | loop.md 발동 시 |
| A/B 테스트 | Playwright | A/B 테스트 UI 검증 | E2E 테스트 시 |

## 현재 실행 상태 (자동 갱신)

- 마지막 실행: -
- 평균 실행 시간: -
- 성공률: -
- 자주 발생하는 에러: → memory.md 참조

## 업데이트 규칙

- 매 실행 후: "현재 실행 상태" 섹션 갱신
- memory.md에도 동기화
- DAG 변경 시 (pipeline.ts 수정): 즉시 반영
- 실행 맵 변경 시: MCP 활성화 테이블도 함께 갱신
