# 반복 메커니즘 — Visual Style Agent

## 루프 발동 조건

### 자동 발동 — [FAIL_TRIGGER] 블록 수신

> checklist.md 또는 reviewer.md에서 [FAIL_TRIGGER] 블록을 수신하면 자동 발동

```yaml
# checklist.md에서 수신
[FAIL_TRIGGER]
type: CHECKLIST_FAIL
engine: ⑨ Visual Style
failed_items: [...]
engine_specific_failures: [...]

# reviewer.md에서 수신
[FAIL_TRIGGER]
type: REVIEW_FAIL
engine: ⑨ Visual Style
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
    │   │   ├── mood_valid=false → 무드 미유효 루프
    │   │   ├── colors_complete=false → 색상 누락 루프
    │   │   ├── typography_complete=false → typography 누락 루프
    │   │   ├── spacing_complete=false → spacing 누락 루프
    │   │   ├── fontFamily_valid=false → fontFamily 미유효 루프
    │   │   └── deterministic_verified=false → 부수효과 제거 루프
    │   └── 일반 실패 → 표준 루프
    │
    └── type: REVIEW_FAIL
        ├── failed_perspectives → 관점별 수정
        ├── failed_engine_specific
        │   ├── mood_validity → 무드 매핑 로직 수정
        │   ├── token_completeness → 누락 토큰 보충
        │   ├── fontFamily_correctness → 매핑 수정
        │   └── determinism → 부수효과 제거
        └── fix_guidance → 수정 가이드 적용
```

### 기존 자동 발동 조건 (호환)
- reviewer.md에서 **FAIL** 판정
- `npx tsc --noEmit` / `npm run lint` / `npm run build` 실패
- mood 미유효값
- tokens 필수 필드 누락
- checklist.md 통과율 < 80%

## 루프 프로세스

```
FAIL 판정 → [이터레이션 N/3] → 문제 식별 → 원인 분석 → 수정 → 검증 → 재검수
```

## 탈출 조건

- 성공: PASS 또는 WARN
- 강제: **최대 반복 3회** → 에스컬레이션

## 엔진 특화 루프

### 색상 누락 루프
```
tokens.colors 필수 색상 누락
    │
    ▼
1. index.ts MOOD_DEFS 해당 무드 확인 (별도 mood-presets.ts 없음)
    │
    ▼
2. 누락 색상에 기본값 보충
    │
    ▼
3. 재검증 → ColorPalette 12색 전부 확인
```

### 무드 미존재 루프
```
mood가 MoodPreset 10종에 없음
    │
    ▼
1. INDUSTRY_MOOD_MAP + adjustByPositioning 매핑 로직 확인
    │
    ▼
2. 기본값 (clean) fallback 추가
    │
    ▼
3. 재검증 → 유효 무드 확인
```

### typography 레벨 누락 루프
```
TypographyScale 필수 레벨 누락
    │
    ▼
1. index.ts buildTypography 함수 확인
    │
    ▼
2. 누락 레벨에 기본값 보충
    │
    ▼
3. 재검증 → 9레벨 전부 확인
```

### fontFamily 미유효 루프
```
fontFamily가 FontFamily 3종(sans/serif/mono)에 없음
    │
    ▼
1. MOOD_DEFS의 fontFamily 매핑 확인
    │
    ▼
2. 기본값 (sans) fallback 추가
    │
    ▼
3. 재검증
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
engine: ⑨ Visual Style
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
engine: ⑨ Visual Style
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
