# 반복 메커니즘 — Attention Architecture Agent

## 루프 발동 조건

### 자동 발동
- checklist.md에서 `[FAIL_TRIGGER]` 수신 (type: CHECKLIST_FAIL)
- reviewer.md에서 `[FAIL_TRIGGER]` 수신 (type: REVIEW_FAIL)
- `npx tsc --noEmit` 에러 > 0
- `npm run lint` 에러 > 0
- `npm run build` 실패
- zones 4개 미만
- pixelRange 겹침/간격
- hookType/gazePattern 무효값
- checklist.md 통과율 < 80%

### 수동 발동
- 사용자 `--loop` 플래그 지정

## [FAIL_TRIGGER] 파싱 로직

```
[FAIL_TRIGGER] 수신
    │
    ├── source: checklist.md (CHECKLIST_FAIL)
    │   → failed_items 파싱
    │   → engine_specific_failures 매핑:
    │       zones_count_valid → Zone 누락 루프
    │       pixelRange_continuous → pixelRange 겹침 루프
    │       hookType_valid → hookType 매핑 로직 확인
    │       gazePattern_valid → GAZE_MAP 매핑 로직 확인
    │       deterministic_verified → 부수효과 제거
    │
    └── source: reviewer.md (REVIEW_FAIL)
        → failed_perspectives 파싱 (정확성/성능/보안/유지보수)
        → failed_engine_specific 파싱 (zone_accuracy/pixelRange_validity/hookType_accuracy/gazePattern_accuracy/determinism)
        → fix_guidance 참조하여 수정 방향 결정
```

## 루프 프로세스

```
[FAIL_TRIGGER] 수신 또는 에러 발생
    │
    ▼
[이터레이션 N/3]

1~5단계: 표준 루프 프로세스
```

## 탈출 조건

### 성공 탈출
- reviewer.md PASS 또는 WARN 판정

### 강제 탈출
- **최대 반복 3회** 도달 → 에스컬레이션

## 엔진 특화 루프

### pixelRange 겹침 루프
```
pixelRange 겹침 감지
    │
    ▼
1. pixelRange 계산 로직 확인
    │
    ▼
2. 순차 계산 로직 수정
   └── buildZones 로직: totalHeight = totalSections × 600, 경계 비율 기반 재계산
    │
    ▼
3. 재검증 → 겹침 없음 확인
```

### Zone 누락 루프
```
zones < 4 감지
    │
    ▼
1. Zone 생성 로직 확인
    │
    ▼
2. 4 Zone 하드코딩 확인 (first_view, interest, desire, action)
    │
    ▼
3. 재검증 → 4개 확인
```

## 에러 패턴 DB (자동 누적)

| 에러 유형 | 발생 횟수 | 해결 방법 | 평균 해결 시간 | 마지막 발생 |
|----------|----------|----------|--------------|------------|
| - | - | - | - | - |

## 빠른 해결 경로

| 에러 패턴 | 빠른 해결 | 성공률 |
|----------|----------|--------|
| - | - | - |

## 루프 효율 메트릭 (자동 갱신)

- 총 루프 횟수: 0
- 평균 이터레이션 수: -
- 1회 해결률: -

## [LOOP_SYNC] — loop → memory.md 동기화 포맷

```
---
[LOOP_SYNC]
engine: ⑦
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
engine: ⑦
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

- 규칙 엔진 에러는 대부분 1회 루프에서 해결 가능
- ratio/pixelRange 수학 오류는 단순 수정
