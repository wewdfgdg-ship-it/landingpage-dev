# MCP 레지스트리 — Attention Architecture Agent

## 이 에이전트의 MCP 우선순위

| 순위 | MCP 서버 | 용도 | 사용 빈도 |
|------|----------|------|----------|
| 1 | Sequential | 규칙 로직 디버깅 시 (거의 안 씀) | 낮음 |
| 2 | Context7 | 라이브러리 문서 참조 시 | 낮음 |
| 3 | Magic | UI 관련 작업 없음 (규칙 엔진) | 낮음 |
| 4 | Playwright | E2E 테스트 없음 (규칙 엔진) | 낮음 |

> 이 에이전트는 규칙 엔진(AI 없음)이므로 MCP 서버 사용 빈도가 매우 낮다.

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
