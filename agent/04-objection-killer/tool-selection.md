# 도구 선택 — Objection Killer Agent

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

### 주요 작업 시퀀스: Objection Killer 엔진 구현

```
1. Read(src/engine/01-product-intelligence/types.ts)
   → ProductBrief.resistanceMap 타입 구조 확인
   │
2. Read(src/engine/03-conversion-strategy/types.ts)
   → StrategyBlueprint.structure[] 타입 구조 확인
   │
3. Write(src/engine/04-objection-killer/types.ts)
   → ObjectionMap, ActiveObjection, ObjectionType 등 타입 정의
   │
4. Write(src/engine/04-objection-killer/rules.ts)
   → 반론 매핑 규칙, 대응 전략 템플릿, injectAt 매핑 로직
   → 상수 정의 (OBJECTION_TYPES, LEVEL_THRESHOLD 등)
   │
5. Write(src/engine/04-objection-killer/index.ts)
   → runObjectionKiller 순수 함수 구현
   → 3단계 순차 호출 (identify → generate → inject)
   │
6. Bash("npx tsc --noEmit")
   → 타입 체크 (types.ts ↔ rules.ts ↔ index.ts 호환)
   │
7. Bash("npm run build")
   → 빌드 검증
```

### 규칙 디버깅 시퀀스

```
1. Read(src/engine/04-objection-killer/rules.ts)
   → 현재 규칙 매핑 확인
   │
2. Read(src/engine/04-objection-killer/index.ts)
   → 규칙 적용 로직 확인
   │
3. Edit(rules.ts, old_rule, new_rule)
   → 규칙 수정 (매핑 추가/변경, 전략 템플릿 수정)
   │
4. Bash("npx tsc --noEmit")
   → 타입 호환 재확인
```

### 타입 호환성 검증 시퀀스

```
1. Read(src/engine/04-objection-killer/types.ts)
   → ObjectionMap 타입 확인
   │
2. Grep("ObjectionMap" --type ts)
   → Bridge 및 후속 엔진에서 ObjectionMap 사용처 전수 검색
   │
3. Read(각 사용처 파일)
   → 타입 매핑 호환성 확인
   │
4. [불일치 발견 시] Edit(types.ts) 또는 에스컬레이션
```

## 작업 유형별 자동 매핑

| 작업 | 1차 도구 | 2차 도구 | MCP |
|------|----------|----------|-----|
| 엔진 구현 | Write/Edit | Bash(tsc) | - (규칙 엔진) |
| 규칙 작성 | Read(types.ts) → Write(rules.ts) | Bash(tsc) | - |
| 규칙 디버깅 | Read(rules.ts) → Edit | Bash(tsc) | --seq (복잡 시) |
| 타입 호환 검증 | Grep → Read | Edit | --seq (복잡 시) |
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
| 규칙 디버깅 (복잡) | Sequential | 다중 매핑 오류, injectAt 반복 실패 |
| API 라우트 구현 | Context7 | Next.js Route Handler 패턴 필요 시 |

### ← skill-registry.md 스킬 조합

| 이 파일의 작업 유형 | skill-registry.md 스킬 조합 |
|-------------------|--------------------------|
| 엔진 구현 | /implement → /test → /analyze → /build |
| 매핑 디버깅 | /troubleshoot → /implement → /test → /build |
| 코드 개선 | /analyze → /improve → /test → /build |
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
