# MCP 레지스트리 — Conversion Strategy Agent

## 이 에이전트의 MCP 우선순위

| 순위 | MCP 서버 | 용도 | 사용 빈도 |
|------|----------|------|----------|
| 1 | **Sequential** | 전략 분석, 프롬프트 디버깅, 섹션 구조 최적화 추론 | 높음 |
| 2 | **Context7** | Claude AI SDK 문서, Next.js API 패턴 | 중간 |
| 3 | Magic | UI 관련 작업 거의 없음 (전략 엔진) | 낮음 |
| 4 | Playwright | E2E 테스트 거의 없음 (전략 분석 엔진) | 낮음 |

## Context7 — 라이브러리 문서 + 패턴

### 용도
외부 라이브러리 공식 문서, 프레임워크 패턴, 코드 예시 조회

### 활성화 조건
- import/require/from 문에서 외부 라이브러리 감지
- 프레임워크 관련 질문 (Next.js, React, Prisma, Tailwind 등)
- `--c7` 또는 `--context7` 플래그

### 워크플로우
```
1. resolve-library-id — 라이브러리 이름으로 ID 검색
2. get-library-docs — 특정 주제의 문서 조회
3. 패턴 추출 → 구현에 적용
```

### 이 프로젝트 주요 라이브러리
- Next.js 16 App Router | Prisma 7 | Zustand 5
- Tailwind CSS v4 | BullMQ | @anthropic-ai/sdk | @google/genai

### 이 에이전트의 주요 Context7 조회 대상
- **@anthropic-ai/sdk**: 메시지 생성, JSON 모드, 비용 추적 (usage.input_tokens, usage.output_tokens)
- **Next.js 16**: Route Handlers (POST), Server Actions, 에러 핸들링

### 에러 복구
- 라이브러리 못 찾음 → WebSearch → 직접 구현
- 타임아웃 → 캐시 지식 사용 → 제한 사항 기록
- 버전 불일치 → 호환 버전 탐색

---

## Sequential — 복잡한 분석 + 다단계 추론

### 용도
복잡한 디버깅, 시스템 설계, 아키텍처 리뷰, 다단계 문제 해결

### 활성화 조건
- 복잡한 디버깅 (다중 파일 연관 에러)
- 시스템 설계/아키텍처 결정
- `--think` / `--think-hard` / `--ultrathink`
- `--seq` 또는 `--sequential`

### 이 에이전트의 주요 Sequential 사용 패턴
- **전략 분석**: decisionType + pageGoal + industry 조합에서 최적 전략 유형 추론
- **섹션 구조 최적화**: structure[] 배열의 순서와 역할 배치가 전환율에 미치는 영향 분석
- **프롬프트 품질 분석**: AI 응답의 structure 배열 완전성, JSON 파싱 실패 원인 분석
- **타입 호환 이슈**: ProductBrief + UrgencyBrief → StrategyBlueprint 변환 과정 분석

### 사고 깊이
| 플래그 | 토큰 | 용도 |
|--------|------|------|
| `--think` | ~4K | 단일 프롬프트 디버깅, 전략 유형 결정 로직 분석 |
| `--think-hard` | ~10K | 전체 전략 파이프라인 분석, 후속 엔진 영향 평가 |
| `--ultrathink` | ~32K | 엔진 재설계, 전략 체계 전면 수정 |

### 에러 복구
- 타임아웃 → 네이티브 분석 → 제한 사항 기록

---

## Magic — UI 컴포넌트 생성

### 용도
모던 UI 컴포넌트 생성, 디자인 시스템 통합, 반응형 설계

### 활성화 조건
- UI 컴포넌트 생성/수정 요청
- 디자인 시스템 작업
- `--magic` 플래그

### 이 에이전트에서의 사용
- **거의 사용하지 않음** — Conversion Strategy 엔진은 전략 설계 엔진
- 예외: 전략 시각화 컴포넌트 제작 시

### 에러 복구
- 생성 실패 → Context7 패턴 → 직접 구현

---

## Playwright — E2E 테스트 + 브라우저 자동화

### 용도
크로스 브라우저 E2E 테스트, 성능 모니터링, 시각적 검증

### 활성화 조건
- E2E 테스트 생성/실행
- 시각적 검증 (스크린샷)
- 성능 측정 (Core Web Vitals)
- `--play` 또는 `--playwright`

### 이 에이전트에서의 사용
- **거의 사용하지 않음** — 전략 분석 엔진이므로 브라우저 테스트 불필요
- 예외: 전체 파이프라인 E2E 흐름 테스트 시

### 에러 복구
- 연결 실패 → Bash(test:e2e) → 수동 테스트 요청

---

## 조합 패턴

| 조합 | 용도 |
|------|------|
| Sequential + Context7 | 프롬프트 설계 시 Claude SDK 패턴 + 전략 추론 |
| Sequential 단독 | 전략 유형 결정 로직 분석, JSON 파싱 에러 분석 |
| Context7 단독 | Claude SDK API 변경 확인, 비용 추적 방법 조회 |
| 전체 (--all-mcp) | 이 에이전트에서는 거의 불필요 |

## 비활성화

| 플래그 | 효과 |
|--------|------|
| `--no-mcp` | 전체 비활성화 |
| `--no-magic` | Magic만 비활성화 |
| `--no-seq` | Sequential만 비활성화 |
| `--no-c7` | Context7만 비활성화 |
| `--no-play` | Playwright만 비활성화 |

---

## MCP 효율 로그 (자동 갱신)

| MCP | 사용 횟수 | 성공률 | 가치 평가 | 마지막 사용 |
|-----|----------|--------|----------|------------|
| Context7 | 0 | - | - | - |
| Sequential | 0 | - | - | - |
| Magic | 0 | - | - | - |
| Playwright | 0 | - | - | - |

## 새 도구 탐색

> MCP 도구 탐색은 **Tool Intelligence Agent (13)**에 위임한다.
> Tool Intelligence가 `_shared/tool-broadcast.md`에 새 MCP를 공지하면, 세션 시작 프로토콜 Step 0에서 확인 후 채택/보류를 결정한다.
> 채택 시: 이 파일의 우선순위 테이블 + 효율 로그 갱신, memory.md에 채택 기록.

---

## 연동 참조

### ← tool-selection.md 호출 매핑

| tool-selection.md 작업 | 이 파일의 MCP | 활성화 조건 |
|-----------------------|-------------|-----------|
| 프롬프트 디버깅 (복잡) | Sequential | 다중 에러 연관, JSON 파싱 반복 실패 |
| 타입 호환 검증 (복잡) | Sequential | ProductBrief+UrgencyBrief→StrategyBlueprint 변환 이슈 |
| AI SDK 패턴 조회 | Context7 | Claude SDK 문서 필요 시 |
| API 라우트 구현 | Context7 | Next.js Route Handler 패턴 필요 시 |

### → skill-registry.md 자동 활성화

| MCP 활성화 시 | 연동 스킬 | 자동 동작 |
|-------------|----------|----------|
| Sequential (--seq) | /troubleshoot, /analyze | 복잡한 전략 분석 시 자동 활성화 |
| Context7 (--c7) | /implement | Claude SDK 패턴 조회 후 구현 |

## 업데이트 규칙

- 매 MCP 사용 후: 효율 로그 갱신
- 새 MCP 등록 시: 이 파일 + tools.md + tool-selection.md 동시 갱신
- MCP 제거 시: fallback 체인 업데이트
- 탐색 결과: 발견 여부와 관계없이 memory.md에 기록
