# 반복 메커니즘 — Trust Architecture Agent

## 루프 발동 조건

### 자동 발동
- checklist.md에서 `[FAIL_TRIGGER]` 수신 (type: CHECKLIST_FAIL)
- reviewer.md에서 `[FAIL_TRIGGER]` 수신 (type: REVIEW_FAIL)
- `npx tsc --noEmit` 에러 > 0
- `npm run lint` 에러 > 0
- `npm run build` 실패
- trustElements 빈 배열
- level 범위 초과 (클램핑 로직 누락)
- checklist.md 통과율 < 80%

### 수동 발동
- 사용자 `--loop` 플래그 지정
- 사용자 "다시", "개선", "수정" 등 반복 요청

## [FAIL_TRIGGER] 파싱 로직

```
[FAIL_TRIGGER] 수신
    │
    ├── source: checklist.md (CHECKLIST_FAIL)
    │   → failed_items 파싱
    │   → engine_specific_failures 매핑:
    │       trustElements_non_empty → trustElements 빈 배열 루프
    │       level_range_valid → level 범위 초과 루프
    │       sectionOrder_range_valid → sectionOrder 범위 초과 루프
    │       rule_matching_correct → 6레벨 템플릿 매칭 로직 확인
    │       deterministic_verified → 부수효과 제거
    │
    └── source: reviewer.md (REVIEW_FAIL)
        → failed_perspectives 파싱 (정확성/성능/보안/유지보수)
        → failed_engine_specific 파싱 (rule_matching_accuracy/range_validation/determinism)
        → fix_guidance 참조하여 수정 방향 결정
```

## 루프 프로세스

```
[FAIL_TRIGGER] 수신 또는 에러 발생
    │
    ▼
[이터레이션 N/3]

1~5단계: 표준 루프 프로세스 (agent ① 동일)
```

## 탈출 조건

### 성공 탈출
- reviewer.md PASS 또는 WARN 판정

### 강제 탈출
- **최대 반복 3회** 도달 → 에스컬레이션

### 에스컬레이션 보고 포맷
```
루프 3회 반복 후에도 미해결

문제: [에러 내용]
시도한 수정:
  - 이터레이션 1: [수정 내용] → [결과]
  - 이터레이션 2: [수정 내용] → [결과]
  - 이터레이션 3: [수정 내용] → [결과]

남은 에러: [현재 상태]
제안: [가능한 해결 방향]
```

## 엔진 특화 루프

### level 범위 초과 루프
```
level이 1~6 범위 밖 감지
    │
    ▼
1. index.ts TRUST_TEMPLATES의 level 정의 확인 (TrustLevel 타입이 1|2|3|4|5|6 유니온)
    │
    ▼
2. 클램핑 로직 추가/수정
   └── Math.min(6, Math.max(1, level))
    │
    ▼
3. 재검증 → 범위 확인
```

### sectionOrder 범위 초과 루프
```
sectionOrder가 structure[] 범위 밖
    │
    ▼
1. placement → sectionOrder 매핑 로직 확인
    │
    ▼
2. 클램핑 로직 추가/수정
   └── Math.min(structure.length - 1, Math.max(0, order))
    │
    ▼
3. 재검증 → 범위 확인
```

### trustElements 빈 배열 루프
```
trustElements가 빈 배열
    │
    ▼
1. TRUST_TEMPLATES 순회 로직 확인 — maxLevel 조건 확인
   └── Lv6 비활성이어도 Lv1~5는 항상 생성되어야 함
    │
    ▼
2. findSectionOrder 확인 — blueprint.structure[]에 targetRoles 매칭되는 섹션 존재?
   └── 매칭 실패 시에도 blueprint.totalSections 폴백으로 요소 생성됨
    │
    ▼
3. 재검증 → 배열 비어있지 않음 확인
```

## 에러 패턴 DB (자동 누적)

| 에러 유형 | 발생 횟수 | 해결 방법 | 평균 해결 시간 | 마지막 발생 |
|----------|----------|----------|--------------|------------|
| - | - | - | - | - |

## 빠른 해결 경로 (패턴 DB에서 자동 생성)

| 에러 패턴 | 빠른 해결 | 성공률 |
|----------|----------|--------|
| - | - | - |

## 루프 효율 메트릭 (자동 갱신)

- 총 루프 횟수: 0
- 평균 이터레이션 수: -
- 1회 해결률: -
- 에러 감소율: -

## 학습 누적 규칙

매 이터레이션 종료 시:
```markdown
### 루프 기록 [날짜]
- **에러**: [에러 설명]
- **원인**: [근본 원인]
- **해결**: [수정 내용]
- **교훈**: [재발 방지 학습]
```

→ memory.md에도 동기화

## [LOOP_SYNC] — loop → memory.md 동기화 포맷

```
---
[LOOP_SYNC]
engine: ⑥
iteration: {N}/3
trigger_source: {checklist.md|reviewer.md}
trigger_type: {CHECKLIST_FAIL|REVIEW_FAIL}
error: {에러 설명}
root_cause: {근본 원인}
fix_applied: {수정 내용}
result: {SUCCESS|PARTIAL|FAIL}
lesson: {재발 방지 학습}
timestamp: {ISO 8601}
---
```

## [ESCALATION_RECORD] — loop → memory.md + 사용자 보고 포맷

```
---
[ESCALATION_RECORD]
engine: ⑥
total_iterations: 3
trigger_source: {최초 트리거 소스}
problem: {미해결 문제}
attempts:
  - iteration: 1
    fix: {수정 내용}
    result: {결과}
  - iteration: 2
    fix: {수정 내용}
    result: {결과}
  - iteration: 3
    fix: {수정 내용}
    result: {결과}
remaining_errors: [{현재 남은 에러}]
suggested_resolution: {가능한 해결 방향}
severity: {CRITICAL|HIGH|MEDIUM}
timestamp: {ISO 8601}
---
```

## 업데이트 규칙

- 매 이터레이션 종료 시: 에러 패턴 DB 갱신
- 루프 성공 탈출 시: [LOOP_SYNC] → memory.md 전달
- 루프 실패 (3회) 시: [ESCALATION_RECORD] → memory.md + 사용자 보고
- 같은 에러 3회 발생 → "빠른 해결 경로"에 자동 등록
- 새로운 에러 유형 → 에러 패턴 DB에 신규 항목

## 반성 기준

- 3회 루프 후에도 미해결 → 접근법 자체를 재검토
- 규칙 엔진 에러는 대부분 1회 루프에서 해결 가능
