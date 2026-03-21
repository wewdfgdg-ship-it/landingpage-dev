# 도구 선택 판단 로직

## 의사결정 트리

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
├── 단순 (1파일, 명확한 이슈) → Read + 직접 판단
├── 중간 (다파일, 패턴 분석) → Grep + Read 조합
├── 복잡 (시스템 전체, 아키텍처) → Sequential MCP (--seq)
└── 매우 복잡 (설계 결정) → Sequential + Context7 (--seq --c7)
```

### 라이브러리/프레임워크 관련
```
외부 라이브러리 사용?
├── YES → Context7 MCP (--c7)
│         resolve-library-id → get-library-docs → 구현
└── NO → 프로젝트 내부 코드 직접 참조
```

### UI 컴포넌트
```
UI 작업?
├── 새 컴포넌트 생성 → Magic MCP (--magic) + Context7
├── 기존 컴포넌트 수정 → Read → Edit
└── 디자인 시스템 작업 → Magic + 프로젝트 패턴 참조
```

### 테스트
```
테스트 유형?
├── 타입 체크 → Bash("npx tsc --noEmit")
├── 린트 → Bash("npm run lint")
├── 빌드 → Bash("npm run build")
├── E2E → Playwright MCP (--play) 또는 Bash("npm run test:e2e")
└── 수동 확인 → Bash("npm run dev") + 브라우저
```

## 작업 유형별 자동 매핑

| 작업 | 1차 도구 | 2차 도구 | MCP |
|------|----------|----------|-----|
| 엔진 구현 | Write/Edit | Bash(tsc) | --c7 (AI SDK) |
| API 라우트 | Write/Edit | Bash(tsc) | --c7 (Next.js) |
| UI 컴포넌트 | Write/Edit | Bash(build) | --magic |
| 버그 수정 | Grep → Read → Edit | Bash(tsc) | --seq (복잡 시) |
| 리팩토링 | Read → Edit | Bash(tsc+lint) | --seq |
| 성능 최적화 | Read → Agent(Explore) | Edit | --seq --play |
| DB 스키마 | Edit(prisma) | Bash(db push) | - |
| 문서 작성 | Write | - | --c7 |
| 디버깅 | Grep → Read | Bash(dev) | --seq |
| 코드 리뷰 | Read → Grep | - | --seq |

## 복합 도구 조합 패턴

### 신규 엔진 구현
```
1. Agent(Explore) — 관련 엔진 구조 파악
2. Read — 이전 엔진 types.ts 확인 (입력 타입)
3. Write — types.ts 생성
4. Write — index.ts 생성
5. Edit — pipeline.ts에 연결
6. Bash — npx tsc --noEmit (타입 체크)
7. Bash — npm run build (빌드 확인)
```

### 버그 수정
```
1. Grep — 에러 관련 키워드 검색
2. Read — 관련 파일 읽기
3. (복잡 시) Sequential MCP — 원인 분석
4. Edit — 수정
5. Bash — npx tsc --noEmit
6. Bash — npm run build
```

### API 엔드포인트 추가
```
1. Read — 기존 API 라우트 패턴 확인
2. Context7 MCP — Next.js API 패턴 확인
3. Write — route.ts 생성
4. Bash — npx tsc --noEmit
5. Bash — npm run build
```

## Fallback 체인

| 1차 시도 | 실패 시 | 최종 대안 |
|----------|---------|----------|
| Context7 (문서) | WebSearch | 직접 구현 |
| Sequential (분석) | 직접 추론 | 사용자에게 질문 |
| Magic (UI) | Context7 + 직접 구현 | 기본 HTML |
| Playwright (E2E) | Bash(test:e2e) | 수동 확인 요청 |
| Agent(Explore) | Glob + Grep 직접 | 사용자에게 경로 질문 |
