# MCP 레지스트리 — Psychological Copy Agent

## 이 에이전트의 MCP 우선순위

| 순위 | MCP 서버 | 용도 | 사용 빈도 |
|------|----------|------|----------|
| 1 | **Sequential** | 카피 품질 분석, 프레임 적합도 평가, 프롬프트 디버깅 | 높음 |
| 2 | **Context7** | Claude AI SDK 문서, 프롬프트 엔지니어링 패턴 | 중간 |
| 3 | Magic | UI 관련 작업 거의 없음 (카피 생성 엔진) | 낮음 |
| 4 | Playwright | E2E 테스트 거의 없음 (텍스트 생성 엔진) | 낮음 |

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
- **Prisma 7**: 생성 결과 저장, 트랜잭션 패턴

### 에러 복구
- 라이브러리 못 찾음 → WebSearch → 직접 구현
- 타임아웃 → 캐시 지식 사용 → 제한 사항 기록
- 버전 불일치 → 호환 버전 탐색

---

## Sequential — 복잡한 분석 + 다단계 추론

### 용도
복잡한 디버깅, 카피 품질 분석, 프레임 적합도 평가, 프롬프트 디버깅

### 활성화 조건
- 복잡한 디버깅 (다중 파일 연관 에러)
- 카피 품질 분석 (프레임/톤 점수 분석)
- `--think` / `--think-hard` / `--ultrathink`
- `--seq` 또는 `--sequential`

### 이 에이전트의 주요 Sequential 사용 패턴
- **카피 품질 분석**: 생성된 카피의 프레임 적합도, 톤 일관성 평가
- **프롬프트 디버깅**: 카피 생성 프롬프트의 지시 정확성 분석
- **품질 게이트 실패 원인 분석**: 재시도 시 어떤 섹션이 왜 낮은 점수인지 진단
- **프레임 선택 최적화**: 섹션 역할에 가장 적합한 프레임 추론

### 사고 깊이
| 플래그 | 토큰 | 용도 |
|--------|------|------|
| `--think` | ~4K | 단일 섹션 카피 품질 분석, 프레임 적합도 |
| `--think-hard` | ~10K | 전체 섹션 카피 일관성 분석, 품질 게이트 재설계 |
| `--ultrathink` | ~32K | 카피 엔진 전체 재설계, 프레임/톤 시스템 개편 |

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
- **거의 사용하지 않음** — Psychological Copy 엔진은 텍스트 생성 엔진
- 예외: 카피 미리보기 UI 컴포넌트 제작 시

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
- **거의 사용하지 않음** — 텍스트 생성 엔진이므로 브라우저 테스트 불필요
- 예외: 카피 생성 → Bridge → 최종 페이지 E2E 흐름 테스트 시

### 에러 복구
- 연결 실패 → Bash(test:e2e) → 수동 테스트 요청

---

## 조합 패턴

| 조합 | 용도 |
|------|------|
| Sequential + Context7 | 프롬프트 설계 시 Claude SDK 패턴 + 카피 품질 분석 |
| Sequential 단독 | 품질 게이트 실패 원인 분석, 프레임 적합도 평가 |
| Context7 단독 | Claude SDK API 변경 확인, JSON 모드 패턴 조회 |
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

## 업데이트 규칙

- 매 MCP 사용 후: 효율 로그 갱신
- 새 MCP 등록 시: 이 파일 + tools.md + tool-selection.md 동시 갱신
- MCP 제거 시: fallback 체인 업데이트
- 탐색 결과: 발견 여부와 관계없이 memory.md에 기록
