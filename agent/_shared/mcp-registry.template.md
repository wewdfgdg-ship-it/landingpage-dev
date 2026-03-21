# MCP 레지스트리 — {{AGENT_NAME}}

## 이 에이전트의 MCP 우선순위

{{MCP_PRIORITY_TABLE}}

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

### 사고 깊이
| 플래그 | 토큰 | 용도 |
|--------|------|------|
| `--think` | ~4K | 모듈 레벨 분석 |
| `--think-hard` | ~10K | 시스템 전체 분석 |
| `--ultrathink` | ~32K | 크리티컬 재설계 |

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

### 에러 복구
- 연결 실패 → Bash(test:e2e) → 수동 테스트 요청

---

## 조합 패턴

| 조합 | 용도 |
|------|------|
| Sequential + Context7 | 아키텍처 분석 + 공식 패턴 대조 |
| Magic + Context7 | UI 생성 + 프레임워크 규칙 준수 |
| Sequential + Playwright | 성능 분석 + 실측 검증 |
| 전체 (--all-mcp) | 복잡도 >0.8인 종합 분석 |

## 비활성화

| 플래그 | 효과 |
|--------|------|
| `--no-mcp` | 전체 비활성화 |
| `--no-magic` | Magic만 비활성화 |
| `--no-seq` | Sequential만 비활성화 |
| `--no-c7` | Context7만 비활성화 |
| `--no-play` | Playwright만 비활성화 |

## MCP 비용 관리 (필수)

> **@../_shared/mcp-cost-rules.md** 참조

```
핵심 원칙: MCP는 기본 OFF. 필요한 순간에만 켜고 즉시 끈다.

❌ 금지: MCP 3개 이상 동시 ON
❌ 금지: 사용 안 하는 MCP가 5턴 이상 ON
✅ 필수: 작업 완료 즉시 OFF
✅ 목표: 턴당 MCP 토큰 소모 1,500 이하
```

---

## 🔑 MCP 효율 로그 (자동 갱신)

| MCP | 사용 횟수 | 성공률 | 가치 평가 | 마지막 사용 |
|-----|----------|--------|----------|------------|
| Context7 | 0 | - | - | - |
| Sequential | 0 | - | - | - |
| Magic | 0 | - | - | - |
| Playwright | 0 | - | - | - |

## 🔑 탐색 트리거

| 조건 | 행동 |
|------|------|
| 현재 MCP로 해결 못 하는 작업 2회 연속 | 새 MCP 검색 |
| 특정 MCP 성공률 < 70% (5회+ 사용 후) | 대안 검색 |
| 새 라이브러리/프레임워크 도입 | 관련 MCP 존재 여부 확인 |

## 🔑 검색 프로토콜

```
1. search_skills("MCP [키워드]") — prompts.chat
2. WebSearch("Claude Code MCP server [키워드]") — 외부
3. 발견 시:
   ├── 기능 비교 (기존 대비)
   ├── 효율 평가
   └── 사용자 승인 후 등록
```

## 업데이트 규칙

- 매 MCP 사용 후: 효율 로그 갱신
- 새 MCP 등록 시: 이 파일 + tools.md + tool-selection.md 동시 갱신
- MCP 제거 시: fallback 체인 업데이트
- 탐색 결과: 발견 여부와 관계없이 memory.md에 기록
