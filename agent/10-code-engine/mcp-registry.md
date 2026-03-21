# MCP 레지스트리 — Code Engine Agent

## 이 에이전트의 MCP 우선순위

| 순위 | MCP 서버 | 용도 | 사용 빈도 |
|------|----------|------|----------|
| 1 | **Magic** | UI 패턴 참조, 렌더러 HTML 구조, 반응형 디자인 패턴 | 높음 |
| 2 | **Context7** | HTML/CSS 최신 패턴, Next.js SSR 호환, Tailwind 유틸리티 | 중간 |
| 3 | **Playwright** | 생성된 HTML 시각 검증, 반응형 레이아웃 테스트 | 중간 |
| 4 | Sequential | 복잡한 렌더러 로직 분석 (단순 규칙 엔진이므로 거의 불필요) | 낮음 |

## Magic — UI 컴포넌트 + 디자인 패턴

### 용도
모던 UI 패턴 참조, 반응형 HTML 구조, CSS Grid/Flexbox 패턴, 접근성 마크업

### 활성화 조건
- 새 렌더러 패턴 구현 시 (HTML 구조 참조)
- 반응형 디자인 패턴 필요 시
- `--magic` 플래그

### 이 에이전트의 주요 Magic 사용 패턴
- **렌더러 패턴 참조**: 28+ 패턴별 HTML 구조 베스트 프랙티스
- **반응형 레이아웃**: 모바일/태블릿/데스크톱 미디어 쿼리 패턴
- **접근성**: 시맨틱 HTML, aria 속성, 키보드 내비게이션

### 에러 복구
- 생성 실패 → Context7 패턴 → 직접 구현

---

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
- **HTML/CSS**: 시맨틱 마크업, 최신 CSS 기능 (container queries, :has() 등)
- **Tailwind CSS v4**: 유틸리티 클래스, 커스텀 CSS 변수 통합
- **Next.js 16**: SSR 호환 HTML 생성 패턴

### 에러 복구
- 라이브러리 못 찾음 → WebSearch → 직접 구현
- 타임아웃 → 캐시 지식 사용 → 제한 사항 기록
- 버전 불일치 → 호환 버전 탐색

---

## Playwright — E2E 테스트 + 시각 검증

### 용도
크로스 브라우저 E2E 테스트, 성능 모니터링, 시각적 검증

### 활성화 조건
- 생성된 HTML 시각 검증 필요
- 반응형 레이아웃 크로스 브라우저 테스트
- `--play` 또는 `--playwright`

### 이 에이전트에서의 사용
- **중간 빈도** — 생성된 fullHtml의 시각적 정확성 검증
- 반응형 미디어 쿼리 동작 확인 (모바일/태블릿/데스크톱)
- CSS 변수 적용 확인

### 에러 복구
- 연결 실패 → Bash(test:e2e) → 수동 테스트 요청

---

## Sequential — 복잡한 분석 + 다단계 추론

### 용도
복잡한 디버깅, 시스템 설계, 아키텍처 리뷰, 다단계 문제 해결

### 활성화 조건
- 복잡한 디버깅 (다중 파일 연관 에러)
- `--think` / `--think-hard` / `--ultrathink`
- `--seq` 또는 `--sequential`

### 이 에이전트에서의 사용
- **거의 사용하지 않음** — Code Engine은 단순 규칙 엔진
- 예외: 렌더러 간 복잡한 의존관계 분석, 대규모 리팩토링 시

### 에러 복구
- 타임아웃 → 네이티브 분석 → 제한 사항 기록

---

## 조합 패턴

| 조합 | 용도 |
|------|------|
| Magic + Context7 | 새 렌더러 패턴 구현 시 (UI 패턴 + CSS 문서) |
| Magic + Playwright | 렌더러 구현 + 시각 검증 |
| Context7 단독 | CSS/HTML 최신 기능 조회 |
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
| Magic | 0 | - | - | - |
| Context7 | 0 | - | - | - |
| Playwright | 0 | - | - | - |
| Sequential | 0 | - | - | - |

## 새 도구 탐색

> MCP 도구 탐색은 **Tool Intelligence Agent (13)**에 위임한다.
> Tool Intelligence가 `_shared/tool-broadcast.md`에 새 MCP를 공지하면, 세션 시작 프로토콜 Step 0에서 확인 후 채택/보류를 결정한다.
> 채택 시: 이 파일의 우선순위 테이블 + 효율 로그 갱신, memory.md에 채택 기록.

## 업데이트 규칙

- 매 MCP 사용 후: 효율 로그 갱신
- 새 MCP 등록 시: 이 파일 + tools.md + tool-selection.md 동시 갱신
- MCP 제거 시: fallback 체인 업데이트
- 탐색 결과: 발견 여부와 관계없이 memory.md에 기록
