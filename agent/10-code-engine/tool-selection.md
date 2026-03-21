# 도구 선택 — Code Engine Agent

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

### 주요 작업 시퀀스: Code Engine 렌더러 구현

```
1. Read(src/engine/10-code-engine/types.ts)
   → 입출력 타입 구조 확인 (GeneratedPage, CopyBlocks, LayoutConfig, StyleConfig)
   │
2. Read(src/engine/10-code-engine/renderers.ts)
   → 기존 렌더러 패턴 구조 확인
   │
3. Magic MCP (--magic)
   → UI 패턴 참조 (HTML 구조, 반응형 레이아웃, 접근성)
   │
4. Write/Edit(src/engine/10-code-engine/renderers.ts)
   → 새 렌더러 함수 추가 + renderByPatternId 매핑 업데이트
   → esc() 적용, data-* 속성 주입, CSS 변수 참조
   │
5. Write/Edit(src/engine/10-code-engine/index.ts)
   → runCodeEngine 함수 구현/수정
   → 섹션 순회 → renderByPatternId 호출 → fullHtml 조립
   │
6. Bash("npx tsc --noEmit")
   → 타입 체크
   │
7. Bash("npm run build")
   → 빌드 검증
```

### XSS 이스케이프 검증 시퀀스

```
1. Grep("esc(" --path src/engine/10-code-engine/)
   → esc() 사용처 전수 검색
   │
2. Grep("innerHTML|\.html\s*=" --path src/engine/10-code-engine/)
   → innerHTML 직접 사용 감지
   │
3. Read(renderers.ts — 사용자 데이터 삽입 부분)
   → esc() 적용 여부 확인
   │
4. [누락 발견 시] Edit(renderers.ts, raw_string, esc(raw_string))
   → esc() 래핑 추가
```

### 반응형 CSS 검증 시퀀스

```
1. Read(src/engine/10-code-engine/index.ts)
   → globalCss 생성 로직 확인
   │
2. Grep("@media" --path src/engine/10-code-engine/)
   → 미디어 쿼리 존재 확인
   │
3. Grep("var(--" --path src/engine/10-code-engine/)
   → CSS 변수 참조 확인
   │
4. [누락 시] Edit → 미디어 쿼리/CSS 변수 추가
```

## 작업 유형별 자동 매핑

| 작업 | 1차 도구 | 2차 도구 | MCP |
|------|----------|----------|-----|
| 렌더러 구현 | Write/Edit(renderers.ts) | Bash(tsc) | --magic (UI 패턴) |
| HTML 검증 | Read(output HTML) | Grep(태그 패턴) | --play (시각) |
| XSS 검증 | Grep("esc(") + Read | Edit | - |
| CSS 변수 매핑 | Read(index.ts) | Grep("var(--") | --c7 (CSS) |
| 렌더러 패턴 추가 | Read → Write(renderers.ts) | Bash(tsc) | --magic |
| Zone 어노테이션 | Read → Edit(renderers.ts) | Grep("data-") | - |
| 버그 수정 | Grep → Read → Edit | Bash(tsc) | --play (재현) |
| 리팩토링 | Read → Edit | Bash(tsc+lint) | - |

## Fallback 체인

| 1차 시도 | 실패 시 | 최종 대안 |
|----------|---------|----------|
| Magic (UI 패턴) | Context7 + 직접 구현 | 기본 HTML |
| Context7 (문서) | WebSearch | 직접 구현 |
| Playwright (시각) | Bash(test:e2e) | 수동 확인 요청 |
| Sequential (분석) | 직접 추론 | 사용자에게 질문 |
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

## 통합 참조

### mcp-registry.md 매핑

| MCP 서버 | 이 엔진 용도 | 활성화 조건 |
|----------|-------------|-----------|
| Magic | UI 패턴 참조 (렌더러 HTML 구조, 반응형 레이아웃) | 렌더러 구현/수정 시 |
| Sequential | 복잡한 에러 분석, 렌더러 구조 설계 | FAIL 루프 진입 시 |
| Context7 | CSS/반응형 패턴, 프레임워크 문서 | CSS 변수/미디어 쿼리 작업 시 |
| Playwright | 생성된 HTML 시각 검증 | HTML 출력 검증 시 (선택) |

### skill-registry.md 조합

| 스킬 조합 | 용도 | 도구 시퀀스 |
|----------|------|-----------|
| 렌더러 구현 | 새 patternId 렌더러 추가 | Read(types.ts) → Read(renderers.ts) → Magic → Write/Edit |
| XSS 검증 | esc() 전수 검증 + 누락 수정 | Grep("esc(") → Grep("innerHTML") → Read → Edit |
| CSS 변수 매핑 | DesignTokens → :root 변수 검증 | Read(index.ts) → Grep("var(--") → Edit |
| 파이프라인 연결 | pipeline.ts 통합 | Read(pipeline.ts) → Edit → Bash(tsc) |

### memory.md 효율 로그 이벤트

| 이벤트 | 기록 대상 | 트리거 |
|--------|----------|--------|
| 도구 조합 성공 | 학습 패턴 테이블 | 같은 조합 3회 연속 성공 |
| 도구 조합 실패 | 회피 패턴 테이블 | 같은 조합 3회 이상 실패 |
| MCP 효율 측정 | MCP/스킬 업그레이드 이력 | MCP 사용 후 |
| 반성 기준 도달 | 의사결정 트리 재검토 | 매 5작업 또는 정확도 <70% |

## 업데이트 규칙

- 매 도구 사용 후: 선택 기록에 추가
- 같은 조합 3회 연속 성공 → "학습된 패턴"에 승격
- 같은 조합 3회 이상 실패 → "회피 패턴"에 등록
- 새 도구/MCP 발견 시 → 기본 의사결정 트리에 분기 추가
- 엔진 특화 도구 조합: 작업 중 발견된 최적 시퀀스로 갱신

## 반성 기준

- 매 5작업마다: 선택 기록 리뷰 → 비효율 패턴 식별 → 트리 업데이트
- 도구 선택 정확도 < 70% → 의사결정 트리 재검토
- 새 작업 유형 등장 → 매핑 테이블에 추가
