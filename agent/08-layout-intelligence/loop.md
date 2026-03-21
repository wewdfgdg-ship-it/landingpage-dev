# 반복 메커니즘 — Layout Intelligence Agent

## 루프 발동 조건

### 자동 발동 — [FAIL_TRIGGER] 블록 수신

> checklist.md 또는 reviewer.md에서 [FAIL_TRIGGER] 블록을 수신하면 자동 발동

```yaml
# checklist.md에서 수신
[FAIL_TRIGGER]
type: CHECKLIST_FAIL
engine: ⑧ Layout Intelligence
failed_items: [...]
engine_specific_failures: [...]

# reviewer.md에서 수신
[FAIL_TRIGGER]
type: REVIEW_FAIL
engine: ⑧ Layout Intelligence
failed_perspectives: [...]
failed_engine_specific: [...]
fix_guidance: [...]
```

### [FAIL_TRIGGER] 파싱 로직

```
[FAIL_TRIGGER] 수신
    │
    ├── type: CHECKLIST_FAIL
    │   ├── engine_specific_failures 확인
    │   │   ├── patternId_valid=false → patternId 미존재 루프
    │   │   ├── diversityScore_valid=false → diversityScore 미달 루프
    │   │   ├── mobileReadyScore_valid=false → mobileReadyScore 개선 루프
    │   │   ├── sectionLayout_valid=false → 출력 구조 수정 루프
    │   │   └── deterministic_verified=false → 부수효과 제거 루프
    │   └── 일반 실패 → 표준 루프
    │
    └── type: REVIEW_FAIL
        ├── failed_perspectives → 관점별 수정
        ├── failed_engine_specific
        │   ├── pattern_validity → patternId 수정 (PATTERNS[] 42개 확인)
        │   ├── diversity_mobile_scores → 점수 개선 루프
        │   ├── sectionLayout_completeness → 출력 구조 수정
        │   └── determinism → 부수효과 제거
        └── fix_guidance → 수정 가이드 적용
```

### 기존 자동 발동 조건 (호환)
- `npx tsc --noEmit` / `npm run lint` / `npm run build` 실패
- patternId 미존재
- diversityScore < 40
- checklist.md 통과율 < 80%

## 루프 프로세스

```
FAIL 판정 → [이터레이션 N/3] → 문제 식별 → 원인 분석 → 수정 → 검증 → 재검수
```

## 탈출 조건

- 성공: PASS 또는 WARN
- 강제: **최대 반복 3회** → 에스컬레이션

## 엔진 특화 루프

### patternId 미존재 루프
```
patternId가 PATTERNS[] 배열(42개)에 없음
    │
    ▼
1. index.ts PATTERNS[] 전수 확인
    │
    ▼
2. 유사 패턴 검색 → 대체 패턴 선택
    │
    ▼
3. scorePattern 매핑 로직 수정
    │
    ▼
4. 재검증
```

### diversityScore 미달 루프
```
diversityScore < 40
    │
    ▼
1. 연속 중복 패턴 확인
    │
    ▼
2. 중복 섹션에 대안 패턴 배정
    │
    ▼
3. diversityScore 재계산
```

### SectionLayout 필드 누락 루프
```
SectionLayout 필드 누락 감지
    │
    ▼
1. 누락 필드 확인 (order/role/sectionType/selectedPattern/patternName/score/reasoning)
    │
    ▼
2. runLayoutIntelligence 출력 로직 수정
    │
    ▼
3. 재검증 → 모든 필드 존재 확인
```

## 에러 패턴 DB (자동 누적)

| 에러 유형 | 발생 횟수 | 해결 방법 | 마지막 발생 |
|----------|----------|----------|------------|
| - | - | - | - |

## 루프 효율 메트릭 (자동 갱신)

- 총 루프 횟수: 0
- 평균 이터레이션 수: -

## [LOOP_SYNC] 출력 블록

> 루프 성공 시 자동 생성 → memory.md가 수신

```yaml
[LOOP_SYNC]
engine: ⑧ Layout Intelligence
timestamp: {ISO8601}
trigger_source: CHECKLIST_FAIL | REVIEW_FAIL
iterations: {N}
error_summary:
  type: {에러 유형}
  root_cause: {근본 원인}
  fix_applied: {적용한 수정}
  lesson: {교훈}
result: RESOLVED
```

## [ESCALATION_RECORD] 출력 블록

> 루프 3회 실패 시 자동 생성 → memory.md가 수신

```yaml
[ESCALATION_RECORD]
engine: ⑧ Layout Intelligence
timestamp: {ISO8601}
trigger_source: CHECKLIST_FAIL | REVIEW_FAIL
iterations_exhausted: 3
error_summary:
  type: {에러 유형}
  root_cause: {추정 원인}
  attempted_fixes:
    - iteration_1: {시도 1}
    - iteration_2: {시도 2}
    - iteration_3: {시도 3}
  unresolved_reason: {미해결 사유}
escalation_target: 사용자
recommended_action: {권장 조치}
blocker_registered: true
```

## 업데이트 규칙

- 매 이터레이션 종료 시: 에러 패턴 DB 갱신
- 같은 에러 3회 → "빠른 해결 경로" 등록
- 루프 성공 → [LOOP_SYNC] 생성 → memory.md 전달
- 루프 실패 (3회) → [ESCALATION_RECORD] 생성 → memory.md 전달
