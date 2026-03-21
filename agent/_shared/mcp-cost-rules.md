# MCP 비용 관리 규칙 — 전체 에이전트 공통

> **핵심 원칙**: MCP는 기본 OFF. 필요한 순간에만 켜고 즉시 끈다.

---

## MCP 비용 구조 (왜 끄는가)

```
MCP 서버 1개 ON
  → 해당 서버의 모든 도구 설명이 시스템 프롬프트에 주입
  → 도구 1개당 ~200-500 토큰 × 서버당 5~20개 도구
  → 사용 안 해도 매 턴마다 토큰 소모

예시:
  Notion MCP (10개 도구) → 매 턴 ~3,000-5,000 토큰
  100턴 대화 → 30~50만 토큰 = 순수 낭비
```

---

## 절대 규칙

### 1. 기본 상태 = 전체 OFF

```
세션 시작 시 MCP 상태:
  Context7:    OFF
  Sequential:  OFF
  Magic:       OFF
  Playwright:  OFF
```

### 2. 켜는 조건 (이것만 허용)

| MCP | ON 조건 | 구체적 상황 |
|-----|---------|-----------|
| Context7 | 외부 라이브러리 공식 문서가 필요할 때 **만** | resolve-library-id → get-library-docs 호출 직전 |
| Sequential | 복잡도 >0.7인 다단계 분석이 필요할 때 **만** | 디버깅 3파일+, 아키텍처 결정, 통계 검증 |
| Magic | UI 컴포넌트 생성이 필요할 때 **만** | 디자인 시스템 컴포넌트 생성 직전 |
| Playwright | E2E 테스트 실행이 필요할 때 **만** | 브라우저 자동화 직전 |

### 3. 끄는 타이밍 (예외 없음)

```
MCP 사용 완료
  → 해당 작업의 도구 호출 끝남
  → 즉시 OFF
  → 다음 턴부터 토큰 절약
```

### 4. 동시 활성화 제한

```
❌ 금지: MCP 3개 이상 동시 ON
✅ 허용: 최대 2개 동시 (조합 패턴 한정)

허용 조합:
  Sequential + Context7  → 아키텍처 분석 + 패턴 대조
  Magic + Context7       → UI 생성 + 프레임워크 규칙
  Sequential + Playwright → 성능 분석 + 실측 검증

금지 조합:
  전체 ON (--all-mcp)    → 복잡도 >0.9이고 사용자 명시 승인 시만 예외
```

---

## 플래그 매핑

| 상황 | 플래그 | 의미 |
|------|--------|------|
| 문서 조회 필요 | `--c7` | "이 작업에서 Context7 켜라" |
| 복잡 분석 필요 | `--seq` | "이 작업에서 Sequential 켜라" |
| UI 생성 필요 | `--magic` | "이 작업에서 Magic 켜라" |
| 테스트 필요 | `--play` | "이 작업에서 Playwright 켜라" |
| 전부 끄기 | `--no-mcp` | "MCP 전부 OFF (기본값)" |

> **중요**: 플래그는 "이 MCP가 유용하다"는 가이드이다.
> 작업이 끝나면 자동으로 OFF 상태로 복귀한다.

---

## 실전 시나리오

### ✅ 올바른 패턴

```
작업: Claude SDK 패턴 확인 후 prompts.ts 작성

1. MCP 전체 OFF (기본)
2. prompts.ts 작성 직전 → Context7 ON (--c7)
3. resolve-library-id("@anthropic-ai/sdk")
4. get-library-docs(topic: "messages, JSON mode")
5. 패턴 확인 완료 → Context7 OFF
6. prompts.ts 작성 (MCP 없이)
7. tsc --noEmit (MCP 없이)
```

### ❌ 잘못된 패턴

```
작업: Claude SDK 패턴 확인 후 prompts.ts 작성

1. 세션 시작할 때 Context7 + Sequential + Magic 전부 ON  ← 낭비
2. resolve-library-id("@anthropic-ai/sdk")
3. get-library-docs(topic: "messages, JSON mode")
4. prompts.ts 작성                                      ← Magic 불필요
5. tsc --noEmit                                          ← Sequential 불필요
6. 세션 끝날 때까지 3개 MCP 계속 ON                       ← 매 턴 토큰 낭비
```

---

## 토큰 절약 효과

| 상태 | 턴당 MCP 토큰 | 100턴 기준 |
|------|-------------|-----------|
| MCP 4개 전부 ON | ~15,000 | ~150만 토큰 낭비 |
| MCP 2개 ON | ~8,000 | ~80만 토큰 낭비 |
| MCP 1개 ON (필요 시만) | ~1,500 (평균) | ~15만 토큰 |
| MCP 전부 OFF (기본) | 0 | 0 |

> **목표: 턴당 MCP 토큰 소모를 1,500 이하로 유지**

---

## 각 에이전트 적용 방법

### workflow.md MCP 활성화 테이블 해석

```
| 단계 | MCP | 용도 |
|------|-----|------|
| Stage 3 | Context7 | Claude SDK 패턴 |

↓ 의미

Stage 3 작업 시작 직전 → Context7 ON
Stage 3 작업 완료 직후 → Context7 OFF
나머지 Stage → MCP OFF
```

### tool-selection.md 플래그 해석

```
| 작업 | MCP |
|------|-----|
| AI 프롬프트 작성 | --c7 |

↓ 의미

AI 프롬프트 작성이 필요한 그 순간만 Context7 ON
작성 끝나면 OFF
```

---

## 위반 감지 및 대응

| 위반 | 심각도 | 대응 |
|------|--------|------|
| MCP 3개 이상 동시 ON | HIGH | 즉시 불필요한 서버 OFF |
| 사용 안 하는 MCP가 5턴 이상 ON | MEDIUM | 즉시 OFF + memory.md 기록 |
| MCP 없이 해결 가능한 작업에 ON | LOW | 다음부터 OFF 패턴 적용 |
| --all-mcp 사용자 승인 없이 사용 | HIGH | 즉시 OFF + 사용자 보고 |

---

## 업데이트 규칙

- MCP 효율 로그에서 사용률 <30% → 해당 MCP 활성화 조건 강화
- 새 MCP 추가 시 → 이 파일에 ON 조건 명시 필수
- 토큰 절약 목표 미달 시 → 동시 활성화 제한 강화
