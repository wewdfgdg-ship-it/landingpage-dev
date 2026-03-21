# 메모리 — Objection Killer Agent

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
- 이 엔진은 규칙 엔진 (AI 없음, 비용 ₩0)
- 순수 함수: 부작용 없음, 동일 입력 → 동일 출력
- ObjectionType 5가지: price, trust, need, urgency, complexity
- resistanceMap.alternative → ObjectionType.need 매핑 주의
- level ≥ 3 → 활성 반론, level 1~2 → 비활성 (스킵)
- injectAt 형식: "section_N_type" (N은 양수 정수)
- 매핑 우선순위: OBJECTION role > PROOF role > 기타 (fallback)
- 실패해도 파이프라인 비차단 (Copy는 ObjectionMap 없이도 진행 가능)
- Bridge를 통해 ⑤ Psychological Copy에 반론 가이드 주입

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

## 도구 채택 이력 (TOOL_ADOPTION_LOG)

> Tool Intelligence 브로드캐스트에서 채택한 도구만 기록 (탐색은 Tool Intelligence가 담당)

| 날짜 | 도구명 | 유형 (MCP/스킬) | 브로드캐스트 ID | 채택/보류 | 사유 | 효과 |
|------|--------|---------------|---------------|----------|------|------|
| - | - | - | - | - | - | - |

## 자동 갱신 트리거 맵

### 입력 트리거 (다른 파일 → 이 파일)

| 소스 파일 | 트리거 이벤트 | 입력 블록 | 갱신 대상 섹션 |
|----------|-------------|----------|--------------|
| reviewer.md | PASS/WARN 판정 | `[REVIEW_RESULT]` | CHECKPOINT + 세션 히스토리 |
| reviewer.md | 의사결정 발생 | 검수 중 판단 | DECISIONS 로그 |
| loop.md | 이터레이션 완료 | `[LOOP_SYNC]` | LEARNINGS 에러 패턴 + CHECKPOINT |
| loop.md | 에스컬레이션 | `[ESCALATION_RECORD]` | LEARNINGS + MISTAKES + CHECKPOINT |
| loop.md | 에러 해결 | `[LOOP_SYNC]` result=resolved | LEARNINGS 도구 효율 로그 |
| tool-selection.md | 새 패턴 승격 | 학습된 패턴 등록 | LEARNINGS 도구 효율 로그 |
| tool-selection.md | 회피 패턴 등록 | 회피 패턴 등록 | MISTAKES |
| mcp-registry.md | MCP 채택 | Tool Intelligence 브로드캐스트 채택 | TOOL_ADOPTION_LOG + 업그레이드 이력 |
| skill-registry.md | 스킬 채택 | Tool Intelligence 브로드캐스트 채택 | TOOL_ADOPTION_LOG + 업그레이드 이력 |
| workflow.md | 실행 상태 갱신 | 현재 실행 상태 | CHECKPOINT |

### 출력 참조 (이 파일 → 다른 파일)

| 이 파일 섹션 | 참조하는 파일 | 용도 |
|-------------|-------------|------|
| CHECKPOINT | agent.md 세션 시작 프로토콜 | 이전 상태 복원 |
| LEARNINGS 에러 패턴 | loop.md 에러 패턴 DB | 빠른 해결 경로 참조 |
| MISTAKES | loop.md 반성 기준 | 재발 방지 |
| 도구 효율 로그 | tool-selection.md | 도구 선택 최적화 |
| 프로젝트 특이사항 | engine-spec.md, rules.md | 제약조건 보완 |

---

## 세션 시작 도구 체크

> agent.md 세션 시작 프로토콜에서 반드시 확인

```
체크 1: TOOL_ADOPTION_LOG에 미반영 채택 도구 있음?
    └── YES → 해당 파일(mcp-registry.md/skill-registry.md) 변경사항 즉시 확인 후 반영

체크 2: MCP 효율 로그에 성공률 < 70% 항목?
    └── YES → Tool Intelligence 키워드 갱신 검토

체크 3: 스킬 효율 로그에 만족도 < 60% 항목 (5회+)?
    └── YES → Tool Intelligence 키워드 갱신 검토
```

## 업데이트 규칙

| 시점 | 갱신 대상 | 입력 블록 |
|------|----------|----------|
| 작업 완료마다 | CHECKPOINT + 세션 히스토리 | `[REVIEW_RESULT]` from reviewer.md |
| 의사결정 시 | DECISIONS 로그 추가 | 직접 기록 |
| 에러 해결 시 | 학습 패턴 + 실수 기록 | `[LOOP_SYNC]` from loop.md |
| 에스컬레이션 시 | 학습 패턴 + 실수 기록 | `[ESCALATION_RECORD]` from loop.md |
| MCP/스킬 변경 시 | 업그레이드 이력 + TOOL_ADOPTION_LOG | Tool Intelligence 브로드캐스트 채택 시 |
| 도구 패턴 발견 시 | 도구 효율 로그 | tool-selection.md 패턴 승격 |
| 매 5작업 | 성장 지표 재집계 | 전체 데이터 집계 |
| 세션 시작 시 | 이 파일을 첫 번째로 읽음 | — |
