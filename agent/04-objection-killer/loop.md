# 반복 메커니즘 — Objection Killer Agent

## 루프 발동 조건

### 자동 발동

`[FAIL_TRIGGER]` 블록 수신 시 자동 발동:

```
[FAIL_TRIGGER] 파싱
    │
    ├── source: checklist.md → type: CHECKLIST_FAIL
    │   └── failed_items 기반으로 수정 대상 결정
    │
    └── source: reviewer.md → type: REVIEW_FAIL
        └── failed_perspectives + engine_specific_failures 기반으로 수정 대상 결정
```

추가 자동 발동 조건:
- `npx tsc --noEmit` 에러 > 0
- `npm run lint` 에러 > 0
- `npm run build` 실패
- 품질 게이트 미달 (유효하지 않은 ObjectionType, strategies 빈 배열)
- checklist.md 통과율 < 80%

### 수동 발동
- 사용자 `--loop` 플래그 지정
- 사용자 "다시", "개선", "수정" 등 반복 요청

## 루프 프로세스

```
FAIL 판정 또는 에러 발생
    │
    ▼
[이터레이션 N/3]

1단계 문제 식별
   ├── 에러 메시지 수집 (tsc, lint, build 출력)
   ├── 검수 피드백 수집 (reviewer.md 결과)
   ├── 에러 패턴 DB 조회 (빠른 해결 경로 있는지?)
   └── 실패 항목 목록 작성
    │
    ▼
2단계 원인 분석
   ├── 빠른 해결 경로 있음 → 즉시 해결 방법 적용
   ├── 단순 에러 → 에러 메시지에서 직접 파악
   ├── 복잡 에러 → Sequential MCP (--seq) 활용
   └── 패턴 에러 → memory.md 이전 실수 참조
    │
    ▼
3단계 수정 실행
   ├── Edit/Write로 코드 수정
   ├── 변경 내용 기록
   └── 수정 근거 기록
    │
    ▼
4단계 검증
   ├── checklist.md 재실행
   │   ├── npx tsc --noEmit
   │   ├── npm run lint
   │   └── npm run build
   └── 전부 통과?
       ├── YES → 5단계로
       └── NO → 남은 에러로 다시 1단계
    │
    ▼
5단계 재검수
   └── reviewer.md 판정
       ├── PASS → 루프 탈출
       ├── WARN → 루프 탈출 (개선 사항 기록)
       └── FAIL → 다음 이터레이션
```

## 탈출 조건

### 성공 탈출
- reviewer.md PASS 또는 WARN 판정
- checklist.md 전 항목 통과

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

### 매핑 누락 루프
```
resistanceMap 키와 ObjectionType 매핑 불일치 감지
    │
    ▼
1. rules.ts 매핑 테이블 확인 — resistanceMap 키 목록 vs OBJECTION_TYPES
    │
    ▼
2. 누락 발견 시:
   ├── resistanceMap 키에 대응하는 ObjectionType 추가
   ├── 특히 alternative → need 매핑 확인
   └── 새 키 발생 시 → 사용자 에스컬레이션 (새 타입 추가 필요)
    │
    ▼
3. rules.ts 수정 적용
    │
    ▼
4. 타입 체크 + 빌드 → 재검증
    │
    ▼
5. 성공? → 루프 탈출
   실패? → 다음 이터레이션
```

### injectAt 매핑 실패 루프
```
injectAt 형식이 "section_N_type" 규격 불일치 감지
    │
    ▼
1. determineInjectionPoints 로직 확인
    │
    ▼
2. structure[]에서 적합한 섹션 매핑 로직 수정
   ├── role 매핑 우선순위 확인 (OBJECTION > PROOF > 기타)
   ├── N 범위가 1~totalSections인지 확인
   └── type이 실제 sectionType과 일치하는지 확인
    │
    ▼
3. index.ts / rules.ts 수정 적용
    │
    ▼
4. 타입 체크 + 빌드 → 재검증
```

### strategies 빈 배열 루프
```
특정 ObjectionType에 대응 전략이 생성되지 않음
    │
    ▼
1. rules.ts의 전략 템플릿 확인
    │
    ▼
2. 해당 type의 전략 템플릿 추가
   ├── 기본 대응 전략 템플릿 정의
   ├── level에 따른 전략 강도 차별화
   └── fallback 전략 추가 (최소 1개 보장)
    │
    ▼
3. rules.ts 수정 적용 → 재검증
```

## 에러 패턴 DB (자동 누적)

| 에러 유형 | 발생 횟수 | 해결 방법 | 평균 해결 시간 | 마지막 발생 |
|----------|----------|----------|--------------|------------|
| - | - | - | - | - |

## 빠른 해결 경로 (패턴 DB에서 자동 생성)

> 같은 에러 3회 이상 발생 시 자동 등록

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

## 연동 블록 정의

### [LOOP_SYNC] — loop → memory.md 이터레이션 동기화

```
---
[LOOP_SYNC]
source: loop.md
timestamp: {ISO 날짜}
iteration: {N}/3
trigger_source: checklist.md | reviewer.md
error_type: {에러 유형}
fix_applied: "{수정 내용}"
result: resolved | ongoing | escalated
tools_used: [{사용 도구}]
---
```

### [ESCALATION_RECORD] — loop 3회 실패 → 사용자 보고

```
---
[ESCALATION_RECORD]
source: loop.md
timestamp: {ISO 날짜}
total_iterations: 3
original_error: "{최초 에러}"
attempts:
  - iteration: 1, fix: "{수정1}", result: "{결과1}"
  - iteration: 2, fix: "{수정2}", result: "{결과2}"
  - iteration: 3, fix: "{수정3}", result: "{결과3}"
remaining_errors: [{미해결 에러}]
suggested_action: "{제안}"
---
```

## 업데이트 규칙

- 매 이터레이션 종료 시: 에러 패턴 DB 갱신 + [LOOP_SYNC] → memory.md
- 같은 에러 3회 발생 → "빠른 해결 경로"에 자동 등록
- 새로운 에러 유형 → 에러 패턴 DB에 신규 항목
- 루프 효율 메트릭 → 매 루프 완료 시 재계산
- 3회 초과 미해결 → [ESCALATION_RECORD] → memory.md + 사용자 보고

## 반성 기준

- 3회 루프 후에도 미해결 → 접근법 자체를 재검토
- 같은 에러 재발 → memory.md 참조 실패 여부 확인
- 에러 증가 → 수정이 새 에러를 만드는지 확인
- 매 이터레이션 에러 감소율 < 30% → 접근법 변경 필요
