# 도구 선택 — Learning Loop Agent

## 기본 의사결정 트리

### 파일 찾기
```
파일명/경로 알고 있음?
├── YES → Glob("패턴")
└── NO
    ├── 파일명 일부 알고 있음 → Glob("**/*키워드*")
    └── 전혀 모름 → Agent(Explore) 서브에이전트
```

### 코드 검색
```
무엇을 찾는가?
├── 특정 문자열/패턴 → Grep(pattern)
├── 특정 함수/클래스 정의 → Grep("function|class 이름")
├── 파일 내 특정 위치 → Read(file, offset, limit)
└── 맥락적 탐색 (구조 파악) → Agent(Explore)
```

### 코드 수정
```
변경 범위?
├── 파일 일부 (1~50줄) → Edit(old_string, new_string)
├── 파일 전체 재작성 → Write (Read 먼저!)
├── 여러 파일 동시 변경
│   ├── 독립적 변경 → 병렬 Edit
│   └── 의존적 변경 → 순차 Edit
└── 새 파일 생성 → Write
```

### 분석/추론
```
분석 깊이?
├── 단순 (1파일) → Read + 직접 판단
├── 중간 (다파일) → Grep + Read 조합
├── 복잡 (시스템) → Sequential MCP (--seq)
└── 매우 복잡 (설계) → Sequential + Context7 (--seq --c7)
```

### 라이브러리/프레임워크
```
외부 라이브러리 사용?
├── YES → Context7 MCP (--c7)
│         resolve-library-id → get-library-docs → 구현
└── NO → 프로젝트 내부 코드 직접 참조
```

### 테스트
```
테스트 유형?
├── 타입 체크 → Bash("npx tsc --noEmit")
├── 린트 → Bash("npm run lint")
├── 빌드 → Bash("npm run build")
├── E2E → Playwright MCP 또는 Bash("npm run test:e2e")
└── 수동 확인 → Bash("npm run dev")
```

## 엔진 특화 도구 조합

### 주요 작업 시퀀스: Learning Loop 엔진 구현

```
1. Read(src/engine/12-learning-loop/types.ts)
   → 입출력 타입 구조 확인 (TrackingMetrics, LearningLoopOutput, Diagnosis, Prescription, ABTest)
   │
2. Context7(resolve: "@anthropic-ai/sdk" → get-library-docs: "messages, JSON mode")
   → Claude SDK 최신 API 패턴 확인
   │
3. Write(src/engine/12-learning-loop/prompts.ts)
   → AI 프롬프트 작성 (diagnoseMetrics)
   → 한국어 시스템 프롬프트 + JSON prefill
   │
4. Write(src/engine/12-learning-loop/rules.ts)
   → 규칙 기반 진단 (evaluateThresholds, manageABTest, checkStatisticalSignificance)
   │
5. Write(src/engine/12-learning-loop/index.ts)
   → runLearningLoop 함수 구현
   → 규칙 진단 + AI 진단 병합 + A/B 관리 + 패턴 추출
   │
6. Bash("npx tsc --noEmit")
   → 타입 체크
   │
7. Bash("npm run build")
   → 빌드 검증
```

### 진단 임계값 조정 시퀀스

```
1. Read(src/engine/12-learning-loop/rules.ts)
   → 현재 임계값 확인
   │
2. Sequential MCP (--seq)
   → 임계값 합리성 분석 (실제 메트릭 데이터 기반)
   │
3. Edit(rules.ts, old_threshold, new_threshold)
   → 임계값 조정
   │
4. Bash("npx tsc --noEmit")
   → 타입 호환 재확인
```

### A/B 테스트 통계 검증 시퀀스

```
1. Read(src/engine/12-learning-loop/rules.ts)
   → 통계 검증 로직 확인 (checkStatisticalSignificance)
   │
2. Sequential MCP (--seq)
   → p-value 계산 로직 정확성 검증
   │
3. Context7 (통계 관련 문서)
   → 카이제곱/z-검정 패턴 확인
   │
4. [수정 필요 시] Edit(rules.ts)
   → 통계 로직 수정
```

### AI 프롬프트 디버깅 시퀀스

```
1. Read(src/engine/12-learning-loop/prompts.ts)
   → 현재 프롬프트 내용 확인
   │
2. Sequential MCP (--seq)
   → AI 응답 실패 원인 분석
   │
3. Edit(prompts.ts, old_prompt, new_prompt)
   → 프롬프트 수정
   │
4. Bash("npx tsc --noEmit")
   → 타입 호환 재확인
```

## 작업 유형별 자동 매핑

| 작업 | 1차 도구 | 2차 도구 | MCP |
|------|----------|----------|-----|
| 진단 로직 구현 | Write/Edit(rules.ts) | Bash(tsc) | --seq (분석) |
| AI 프롬프트 작성 | Read(types.ts) → Write(prompts.ts) | Bash(tsc) | --c7 (Claude SDK) |
| A/B 테스트 구현 | Write/Edit(rules.ts) | Bash(tsc) | --seq (통계) |
| 임계값 조정 | Read(rules.ts) → Edit | Bash(tsc) | --seq (분석) |
| 통계 검증 | Read(rules.ts) | Sequential | --seq --c7 |
| 메트릭 분석 | Read + Grep | Sequential | --seq |
| 버그 수정 | Grep → Read → Edit | Bash(tsc) | --seq (복잡 시) |
| 리팩토링 | Read → Edit | Bash(tsc+lint) | --seq |

## Fallback 체인

| 1차 시도 | 실패 시 | 최종 대안 |
|----------|---------|----------|
| Sequential (분석) | 직접 추론 | 사용자에게 질문 |
| Context7 (문서) | WebSearch | 직접 구현 |
| Playwright (검증) | Bash(curl) | 수동 확인 요청 |
| Magic (UI) | Context7 + 직접 구현 | 기본 HTML |
| Agent(Explore) | Glob + Grep 직접 | 사용자에게 경로 질문 |

## 선택 기록 (자동 누적)

| 날짜 | 작업 유형 | 선택한 조합 | 결과 | 소요 시간 |
|------|----------|------------|------|----------|
| - | - | - | - | - |

## 학습된 패턴 (기록에서 자동 추출)

> 같은 작업 유형에서 3회 연속 같은 도구 조합 성공 시 승격

| 패턴 | 도구 조합 | 성공률 | 등록일 |
|------|----------|--------|--------|
| - | - | - | - |

## 회피 패턴

> 3회 이상 실패한 조합

| 패턴 | 실패한 조합 | 실패 이유 | 등록일 |
|------|------------|----------|--------|
| - | - | - | - |

## 통합 참조: mcp-registry.md 매핑

| MCP 서버 | 이 에이전트에서의 용도 | 활성화 조건 |
|----------|---------------------|------------|
| Context7 | Claude SDK 패턴, 통계 라이브러리 문서 | AI 프롬프트 작성, 통계 구현 |
| Sequential | 진단 로직 분석, 통계 검증, FAIL 원인 분석 | 복잡도 > 0.7, loop.md 발동 |
| Playwright | A/B 테스트 UI 검증, 트래킹 E2E 테스트 | E2E 테스트 시 |
| Magic | 트래킹 대시보드 UI 생성 | 대시보드 구현 시 |

## 통합 참조: skill-registry.md 조합

| 작업 시나리오 | 스킬 + 도구 조합 | 예상 효과 |
|-------------|----------------|----------|
| 진단 로직 구현 | Write(rules.ts) + Sequential(분석) | 임계값 정확도 향상 |
| AI 프롬프트 디버깅 | Read(prompts.ts) + Sequential(원인) + Edit | JSON 파싱 성공률 향상 |
| A/B 통계 검증 | Read(rules.ts) + Context7(통계) + Sequential | p-value 로직 정확성 |
| 파이프라인 연결 | Grep(pipeline.ts) + Edit + Bash(tsc) | ⑪→⑫ 연결 검증 |
| 비용 최적화 | Read(index.ts) + Sequential(분석) + Edit | ₩500 이하 달성 |

## 통합 참조: memory.md 효율 로그

> 도구 효율 로그 갱신 트리거

| 이벤트 | 기록 대상 | memory.md 섹션 |
|--------|----------|---------------|
| 진단 로직 구현 성공 | Write(rules.ts) 조합 | 도구 효율 로그 |
| AI 프롬프트 수정 성공 | Edit(prompts.ts) + Sequential | 도구 효율 로그 |
| A/B 통계 검증 완료 | Sequential + Context7 | 도구 효율 로그 |
| loop.md 1회 해결 | 사용된 도구 전체 | 에러 패턴 요약 |
| FAIL→수정→PASS | 수정 경로 전체 | 학습 패턴 |

## 업데이트 규칙

- 매 도구 사용 후: 선택 기록에 추가
- 같은 조합 3회 연속 성공 → "학습된 패턴"에 승격
- 같은 조합 3회 이상 실패 → "회피 패턴"에 등록
- 새 도구/MCP 발견 시 → 기본 의사결정 트리에 분기 추가
- 엔진 특화 도구 조합: 작업 중 발견된 최적 시퀀스로 갱신
- mcp-registry/skill-registry 변경 시: 통합 참조 섹션 동기화

## 반성 기준

- 매 5작업마다: 선택 기록 리뷰 → 비효율 패턴 식별 → 트리 업데이트
- 도구 선택 정확도 < 70% → 의사결정 트리 재검토
- 새 작업 유형 등장 → 매핑 테이블에 추가
