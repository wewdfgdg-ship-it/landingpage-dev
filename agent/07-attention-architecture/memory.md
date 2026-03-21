# 메모리 — Attention Architecture Agent

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

### 프로젝트 특이사항
- 이 엔진은 순수 규칙 엔진 (AI 호출 없음, 비용 0)
- 4 Zone 필수: first_view, interest, desire, action
- ratio 합 === 1.0 정규화 필수
- pixelRange 연속성 필수 (겹침/간격 금지)
- hookType 4가지: visual-shock, question-hook, benefit-first, story-open
- 실패 시 ⑧ 레이아웃 최적화 제한 (치명적이지 않음)

---

## 실수 기록 (MISTAKES)

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
- 도구 선택 정확도: -
- MCP/스킬 업그레이드 횟수: 0

---

## 도구 채택 이력 (TOOL_ADOPTION_LOG)

> Tool Intelligence 브로드캐스트에서 채택한 도구만 기록 (탐색은 Tool Intelligence가 담당)

| 날짜 | 도구명 | 유형 (MCP/스킬) | 브로드캐스트 ID | 채택/보류 | 사유 | 효과 |
|------|--------|---------------|---------------|----------|------|------|
| - | - | - | - | - | - | - |

## 자동 갱신 트리거 맵

### 입력 블록 → 갱신 대상

| 입력 블록 | 소스 | 갱신 대상 | 갱신 내용 |
|----------|------|----------|----------|
| [REVIEW_RESULT] | reviewer.md | 세션 히스토리 + CHECKPOINT | 검수 결과, 점수 |
| [REVIEW_RESULT] verdict=WARN | reviewer.md | 학습 패턴 | 개선 사항 기록 |
| [LOOP_SYNC] | loop.md | 에러 패턴 요약 + 실수 기록 | 에러/원인/해결/교훈 |
| [ESCALATION_RECORD] | loop.md | 실수 기록 + CHECKPOINT | 미해결 문제, 블로커 등록 |
| [FAIL_TRIGGER] | checklist/reviewer | (직접 갱신 안 함) | loop.md가 처리 |
| [HANDOFF_TO_REVIEWER] | checklist.md | (직접 갱신 안 함) | reviewer.md가 처리 |
| Tool Intelligence 브로드캐스트 | tool-broadcast.md | TOOL_ADOPTION_LOG | 도구 채택/보류 기록 |

### 출력 참조

| 이 파일 섹션 | 참조하는 문서 | 용도 |
|-------------|-------------|------|
| CHECKPOINT | agent.md (세션 시작) | 이전 상태 복원 |
| 에러 패턴 요약 | loop.md (빠른 해결) | 에러 해결 가속 |
| DECISIONS 로그 | reviewer.md (적응형 검수) | 가중치 조정 근거 |
| TOOL_ADOPTION_LOG | agent.md (세션 시작 도구 점검) | 미평가 도구 확인 |
| 성장 지표 | workflow.md (실행 상태) | 성공률 동기화 |

## 세션 시작 도구 점검

| 점검 항목 | 확인 대상 | 액션 |
|----------|----------|------|
| 미평가 도구 | TOOL_ADOPTION_LOG에 채택/보류 미기록 | 평가 후 기록 |
| MCP 효율 | mcp-registry.md 효율 <70% | 대안 검토 |
| 스킬 만족도 | skill-registry.md 만족도 <60% | 교체 검토 |

## 업데이트 규칙

| 시점 | 갱신 대상 | 입력 블록 |
|------|----------|----------|
| 작업 완료마다 | CHECKPOINT + 세션 히스토리 | [REVIEW_RESULT] |
| 의사결정 시 | DECISIONS 로그 추가 | - |
| 에러 해결 시 | 학습 패턴 + 실수 기록 | [LOOP_SYNC] |
| 루프 실패 시 | 실수 기록 + 블로커 등록 | [ESCALATION_RECORD] |
| 매 5작업 | 성장 지표 재집계 | - |
| 세션 시작 시 | 이 파일을 첫 번째로 읽음 | Tool Intelligence 브로드캐스트 |
| 도구 채택 시 | TOOL_ADOPTION_LOG | Tool Intelligence [NEW_TOOL] |
