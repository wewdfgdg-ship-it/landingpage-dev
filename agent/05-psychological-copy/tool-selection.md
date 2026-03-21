# 도구 선택 — Psychological Copy Agent

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

### 주요 작업 시퀀스: Psychological Copy 엔진 구현

```
1. Read(src/engine/05-psychological-copy/types.ts)
   → 입출력 타입 구조 확인
   │
2. Context7(resolve: "@anthropic-ai/sdk" → get-library-docs: "messages, json mode")
   → Claude SDK 최신 API 패턴 확인
   │
3. Write(src/engine/05-psychological-copy/frames.ts)
   → 7가지 설득 프레임 정의
   │
4. Write(src/engine/05-psychological-copy/tone-matrix.ts)
   → 9개 업종별 톤 정의
   │
5. Write(src/engine/05-psychological-copy/quality-gate.ts)
   → 품질 게이트 (THRESHOLD=80, MAX_RETRIES=2)
   │
6. Write(src/engine/05-psychological-copy/prompts.ts)
   → generateCopy + buildRetryPrompt 프롬프트 작성
   → 한국어 시스템 프롬프트 + JSON prefill
   │
7. Write(src/engine/05-psychological-copy/index.ts)
   → runPsychologicalCopy 함수 구현
   → AI 호출 + 품질 게이트 + 재시도 로직 + 비용 합산
   │
8. Bash("npx tsc --noEmit")
   → 타입 체크
   │
9. Bash("npm run build")
   → 빌드 검증
```

### 품질 게이트 디버깅 시퀀스

```
1. Read(src/engine/05-psychological-copy/quality-gate.ts)
   → 현재 품질 게이트 로직 확인
   │
2. Sequential MCP (--seq)
   → 품질 게이트 FAIL 원인 분석 (어떤 섹션, 어떤 점수가 낮은지)
   │
3. Edit(quality-gate.ts 또는 prompts.ts)
   → 점수 계산 로직 수정 또는 프롬프트 개선
   │
4. Bash("npx tsc --noEmit")
   → 타입 호환 재확인
```

### 프롬프트 디버깅 시퀀스

```
1. Read(src/engine/05-psychological-copy/prompts.ts)
   → 현재 프롬프트 내용 확인
   │
2. Sequential MCP (--seq)
   → AI 응답 실패 원인 분석 (JSON 파싱 에러, 필드 누락 등)
   │
3. Edit(prompts.ts, old_prompt, new_prompt)
   → 프롬프트 수정 (JSON 스키마 명확화, 예시 추가 등)
   │
4. Bash("npx tsc --noEmit")
   → 타입 호환 재확인
```

### 타입 호환성 검증 시퀀스

```
1. Read(src/engine/05-psychological-copy/types.ts)
   → CopyBlocks 타입 확인
   │
2. Grep("CopyBlocks" --type ts)
   → 후속 엔진에서 CopyBlocks 사용처 전수 검색
   │
3. Read(각 사용처 파일)
   → 타입 매핑 호환성 확인
   │
4. [불일치 발견 시] Edit(types.ts) 또는 에스컬레이션
```

## 작업 유형별 자동 매핑

| 작업 | 1차 도구 | 2차 도구 | MCP |
|------|----------|----------|-----|
| 엔진 구현 | Write/Edit | Bash(tsc) | --c7 (AI SDK) |
| 프롬프트 작성 | Read(types.ts) → Write(prompts.ts) | Bash(tsc) | --c7 (Claude SDK) |
| AI 호출 디버깅 | Read(prompts.ts) → Edit | Bash(tsc) | --seq (분석) |
| 타입 호환 검증 | Grep → Read | Edit | --seq (복잡 시) |
| 비용 계산 검증 | Read(index.ts) | 직접 계산 | - |
| 품질 게이트 검증 | Read(quality-gate.ts) | Edit | --seq (분석) |
| 프레임/톤 수정 | Read(frames.ts/tone-matrix.ts) → Edit | Bash(tsc) | - |
| API 라우트 | Write/Edit | Bash(tsc) | --c7 (Next.js) |
| 버그 수정 | Grep → Read → Edit | Bash(tsc) | --seq (복잡 시) |
| 리팩토링 | Read → Edit | Bash(tsc+lint) | --seq |

## Fallback 체인

| 1차 시도 | 실패 시 | 최종 대안 |
|----------|---------|----------|
| Context7 (문서) | WebSearch | 직접 구현 |
| Sequential (분석) | 직접 추론 | 사용자에게 질문 |
| Magic (UI) | Context7 + 직접 구현 | 기본 HTML |
| Playwright (E2E) | Bash(test:e2e) | 수동 확인 요청 |
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

## 업데이트 규칙

- 매 도구 사용 후: 선택 기록에 추가
- 같은 조합 3회 연속 성공 → "학습된 패턴"에 승격
- 같은 조합 3회 이상 실패 → "회피 패턴"에 등록
- 새 도구/MCP 발견 시 → 기본 의사결정 트리에 분기 추가
- 엔진 특화 도구 조합: 작업 중 발견된 최적 시퀀스로 갱신

## 연동 참조

### ← mcp-registry.md 호출 매핑

| 이 파일의 작업 | mcp-registry.md MCP | 활성화 조건 |
|---------------|-------------------|-----------|
| 프롬프트 작성/디버깅 | Context7 | Claude SDK API 패턴 필요 시 |
| 품질 게이트 FAIL 분석 | Sequential | 다중 섹션 점수 분석 필요 시 |
| AI 호출 디버깅 | Sequential | JSON 파싱 에러, 재시도 로직 분석 |
| 전체 카피 일관성 분석 | Sequential + Context7 | 프레임/톤 시스템 재설계 시 |

### ← skill-registry.md 스킬 조합

| 이 파일의 작업 유형 | skill-registry.md 스킬 조합 |
|-------------------|--------------------------|
| 엔진 구현 | /design → /implement → /analyze → /test → /build |
| 카피 품질 개선 | /analyze → /improve → /test → /build |
| AI 프롬프트 디버깅 | /troubleshoot → /implement → /analyze → /build |
| 버그 수정 | /troubleshoot → /implement → /test → /build |

### → memory.md 효율 로그 연동

| 이벤트 | memory.md 갱신 대상 |
|--------|-------------------|
| 도구 조합 성공 | LEARNINGS 도구 효율 로그 |
| 새 패턴 승격 (3회 연속 성공) | LEARNINGS 도구 효율 로그 |
| 회피 패턴 등록 (3회 실패) | MISTAKES |

## 반성 기준

- 매 5작업마다: 선택 기록 리뷰 → 비효율 패턴 식별 → 트리 업데이트
- 도구 선택 정확도 < 70% → 의사결정 트리 재검토
- 새 작업 유형 등장 → 매핑 테이블에 추가
