# MCP 레지스트리 — Layout Intelligence Agent

## 이 에이전트의 MCP 우선순위

| 순위 | MCP 서버 | 용도 | 사용 빈도 |
|------|----------|------|----------|
| 1 | **Magic** | UI 패턴 참조, 레이아웃 컴포넌트 구조 | 중간 |
| 2 | Context7 | Tailwind 패턴, CSS Grid/Flexbox 문서 | 낮음 |
| 3 | Sequential | 복잡한 패턴 매핑 분석 시 | 낮음 |
| 4 | Playwright | E2E 테스트 (거의 안 씀) | 낮음 |

## Magic — UI 컴포넌트 생성

### 이 에이전트의 주요 Magic 사용 패턴
- **레이아웃 패턴 참조**: 28+ 패턴의 실제 UI 구조 참고
- **모바일 레이아웃 검증**: 반응형 패턴이 모바일에서 작동하는지 확인

## Context7 — 라이브러리 문서

### 이 에이전트의 주요 Context7 조회 대상
- **Tailwind CSS v4**: Grid, Flexbox, 반응형 유틸리티 패턴
- **Next.js 16**: 서버 컴포넌트에서의 레이아웃 패턴

---

## MCP 효율 로그 (자동 갱신)

| MCP | 사용 횟수 | 성공률 | 가치 평가 | 마지막 사용 |
|-----|----------|--------|----------|------------|
| Magic | 0 | - | - | - |
| Context7 | 0 | - | - | - |
| Sequential | 0 | - | - | - |
| Playwright | 0 | - | - | - |

## 새 도구 탐색

> MCP 도구 탐색은 **Tool Intelligence Agent (13)**에 위임한다.
> Tool Intelligence가 `_shared/tool-broadcast.md`에 새 MCP를 공지하면, 세션 시작 프로토콜 Step 0에서 확인 후 채택/보류를 결정한다.
> 채택 시: 이 파일의 우선순위 테이블 + 효율 로그 갱신, memory.md에 채택 기록.

## 업데이트 규칙

- 매 MCP 사용 후: 효율 로그 갱신
