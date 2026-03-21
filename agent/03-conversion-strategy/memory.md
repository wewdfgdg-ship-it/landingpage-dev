# 메모리 — Conversion Strategy Agent

> 세션 시작 시 반드시 이 파일을 첫 번째로 읽는다. 작업 완료마다 갱신한다.

---

## 현재 상태 (CHECKPOINT)

- **마지막 완료 작업**: 초기 설정 (에이전트 문서 11개 생성)
- **다음 실행 작업**: 미정 (사용자 지시 대기)
- **블로커/미결 이슈**: 없음
- **현재 Phase**: Phase 0 완료 상태

---

## 의사결정 로그 (DECISIONS)

| 날짜 | 결정 | 근거 | 대안 | 결과 |
|------|------|------|------|------|
| - | - | - | - | - |

---

## 학습 패턴 (LEARNINGS)

### 도구 효율 로그
> 최적 조합: [작업 유형 → 도구 시퀀스]

| 작업 유형 | 최적 도구 조합 | 성공률 | 비고 |
|----------|--------------|--------|------|
| - | - | - | - |

### 에러 패턴 요약
> loop.md 에러 패턴 DB와 연동

| 에러 유형 | 빠른 해결 | 발생 횟수 |
|----------|----------|----------|
| - | - | - |

### MCP/스킬 업그레이드 이력

| 날짜 | 유형 | 이름 | 행동 | 효과 |
|------|------|------|------|------|
| - | - | - | - | - |

### 프로젝트 특이사항
- 이 엔진은 Claude Sonnet ×1 + 규칙 하이브리드 엔진
- determineStrategyType(규칙) → generateStructure(AI) → calculateMetrics(규칙) 순차 의존
- 한국어 시스템 프롬프트 + JSON prefill 필수
- 전략 유형 5가지: direct_conversion, nurture_conversion, social_proof_led, education_first, urgency_driven
- SectionRole 7가지: hook, problem, solution, proof, benefit, objection, action
- structure[].order는 1부터 시작하는 연속 번호 보장 필수
- 실패 시 ④⑦⑧ 직접 블록, ⑤ 간접 영향 — 영향 범위가 넓은 핵심 엔진
- 비용 1회 호출 ₩50-100 예상

---

## 실수 기록 (MISTAKES)

> 같은 실수를 반복하지 않는다.

| 날짜 | 실수 | 원인 | 재발 방지 |
|------|------|------|----------|
| - | - | - | - |

---

## 세션 히스토리

| 날짜 | 작업 | 결과 | 학습 |
|------|------|------|------|
| 2026-03-09 | agent/ 파일 초기 생성 (11개) | 완료 | - |

---

## 성장 지표 (자동 집계)

- 총 작업 수: 0
- 성공률: -
- 평균 루프 이터레이션: -
- 도구 선택 정확도: - (1차 선택으로 해결한 비율)
- MCP/스킬 업그레이드 횟수: 0

---

## 자동 갱신 트리거 맵

> 다른 파일에서 이벤트 발생 시 이 파일의 어떤 섹션을 갱신하는지 정의한다.

### 입력 트리거 (다른 파일 → 이 파일)

| 소스 파일 | 트리거 이벤트 | 입력 블록 | 갱신 대상 섹션 |
|----------|-------------|----------|---------------|
| reviewer.md | PASS/WARN 판정 | `[REVIEW_RESULT]` | CHECKPOINT + 세션 히스토리 |
| reviewer.md | 의사결정 발생 | 검수 중 판단 | DECISIONS 로그 |
| loop.md | 이터레이션 완료 | `[LOOP_SYNC]` | LEARNINGS 에러 패턴 + CHECKPOINT |
| loop.md | 에스컬레이션 | `[ESCALATION_RECORD]` | LEARNINGS + MISTAKES + CHECKPOINT |
| loop.md | 에러 해결 | `[LOOP_SYNC]` result=resolved | LEARNINGS 도구 효율 로그 (새 도구 조합 시) |
| tool-selection.md | 새 패턴 승격 | 학습된 패턴 등록 | LEARNINGS 도구 효율 로그 |
| tool-selection.md | 회피 패턴 등록 | 회피 패턴 등록 | MISTAKES |
| mcp-registry.md | MCP 추가/제거 | 효율 로그 변경 | MCP/스킬 업그레이드 이력 |
| skill-registry.md | 스킬 추가/제거 | 효율 로그 변경 | MCP/스킬 업그레이드 이력 |
| workflow.md | 실행 상태 갱신 | 현재 실행 상태 | CHECKPOINT |

### 출력 참조 (이 파일 → 다른 파일)

| 이 파일 섹션 | 참조하는 파일 | 용도 |
|-------------|-------------|------|
| CHECKPOINT | agent.md 세션 시작 프로토콜 | 이전 상태 복원 |
| LEARNINGS 에러 패턴 | loop.md 에러 패턴 DB | 빠른 해결 경로 참조 |
| MISTAKES | loop.md 반성 기준 | 재발 방지 |
| 도구 효율 로그 | tool-selection.md | 도구 선택 최적화 |
| 프로젝트 특이사항 | engine-spec.md, rules.md | 제약조건 보완 |

## 도구 채택 이력 (TOOL_ADOPTION_LOG)

> Tool Intelligence 브로드캐스트에서 채택한 도구만 기록 (탐색은 Tool Intelligence가 담당)

| 날짜 | 도구명 | 유형 (MCP/스킬) | 브로드캐스트 ID | 채택/보류 | 사유 | 효과 |
|------|--------|---------------|---------------|----------|------|------|
| - | - | - | - | - | - | - |

## 업데이트 규칙

| 시점 | 갱신 대상 | 입력 블록 |
|------|----------|----------|
| 작업 완료마다 | CHECKPOINT + 세션 히스토리 | `[REVIEW_RESULT]` from reviewer.md |
| 의사결정 시 | DECISIONS 로그 추가 | 직접 기록 |
| 에러 해결 시 | 학습 패턴 + 실수 기록 | `[LOOP_SYNC]` from loop.md |
| 에스컬레이션 시 | 학습 패턴 + 실수 기록 | `[ESCALATION_RECORD]` from loop.md |
| MCP/스킬 변경 시 | 업그레이드 이력 | mcp-registry.md/skill-registry.md 변경 |
| 도구 패턴 발견 시 | 도구 효율 로그 | tool-selection.md 패턴 승격 |
| 매 5작업 | 성장 지표 재집계 | 전체 데이터 집계 |
| 세션 시작 시 | 이 파일을 첫 번째로 읽음 | — |
