# 도구 선택 — Product Intelligence Agent

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

### 주요 작업 시퀀스: Product Intelligence 엔진 구현

```
1. Read(src/engine/01-product-intelligence/types.ts)
   → 입출력 타입 구조 확인
   │
2. Context7(resolve: "@anthropic-ai/sdk" → get-library-docs: "streaming, messages")
   → Claude SDK 최신 API 패턴 확인 (메시지 생성, JSON 모드, 비용 추적)
   │
3. Write(src/engine/01-product-intelligence/prompts.ts)
   → 3개 AI 프롬프트 작성 (extractProductDNA, analyzeCustomer, buildResistanceMap)
   → 한국어 시스템 프롬프트 + JSON prefill
   │
4. Write(src/engine/01-product-intelligence/index.ts)
   → runProductIntelligence 함수 구현
   → 3 AI 호출 순차 실행 + 비용 합산 + confidenceScore 클램핑
   │
5. Bash("npx tsc --noEmit")
   → 타입 체크 (types.ts ↔ prompts.ts ↔ index.ts 호환)
   │
6. Bash("npm run build")
   → 빌드 검증
```

### 프롬프트 디버깅 시퀀스

```
1. Read(src/engine/01-product-intelligence/prompts.ts)
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
1. Read(src/engine/01-product-intelligence/types.ts)
   → ProductBrief 타입 확인
   │
2. Grep("ProductBrief" --type ts)
   → 후속 엔진에서 ProductBrief 사용처 전수 검색
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

### → mcp-registry.md 연결

> MCP가 필요한 작업일 때 mcp-registry.md의 우선순위와 활성화 조건을 참조한다.

| 작업 유형 (이 파일) | MCP 결정 (mcp-registry.md) | 활성화 기준 |
|--------------------|---------------------------|-------------|
| 엔진 구현 | Context7 (Claude SDK) | 외부 라이브러리 import 감지 |
| 프롬프트 디버깅 | Sequential (분석) | 복잡 디버깅, JSON 파싱 실패 |
| 타입 호환 검증 | Sequential (복잡 시) | 다파일 연관 에러 |
| API 라우트 | Context7 (Next.js) | 프레임워크 패턴 필요 |

### → skill-registry.md 연결

> 작업 유형이 결정되면 skill-registry.md의 스킬 조합 패턴을 참조한다.

| 작업 유형 (이 파일) | 스킬 조합 (skill-registry.md) |
|--------------------|------------------------------|
| 엔진 구현 | /design → /implement → /analyze → /test → /build |
| 프롬프트 디버깅 | /troubleshoot → /implement → /analyze → /build |
| 코드 품질 개선 | /analyze → /improve → /test → /build |
| 버그 수정 | /troubleshoot → /implement → /test → /build |

### 통합 선택 프로세스

```
작업 유형 결정 (이 파일: 의사결정 트리)
    │
    ├── 1차 도구 선택 (이 파일: 자동 매핑 테이블)
    │
    ├── MCP 필요? → mcp-registry.md 우선순위 참조
    │   ├── Sequential 우선 (분석/디버깅)
    │   └── Context7 우선 (라이브러리/프레임워크)
    │
    └── 스킬 조합? → skill-registry.md 패턴 참조
        └── 작업 유형별 스킬 시퀀스 실행
```

## 반성 기준

- 매 5작업마다: 선택 기록 리뷰 → 비효율 패턴 식별 → 트리 업데이트
- 도구 선택 정확도 < 70% → 의사결정 트리 재검토
- 새 작업 유형 등장 → 매핑 테이블에 추가
