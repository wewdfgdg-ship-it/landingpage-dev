# 반복 메커니즘 — Product Intelligence Agent

## 루프 발동 조건

### 자동 발동 (입력: [FAIL_TRIGGER] 블록)

> checklist.md 또는 reviewer.md에서 `[FAIL_TRIGGER]` 블록을 수신하면 루프가 시작된다.

- checklist.md에서 `[FAIL_TRIGGER]` 수신 (통과율 <80%)
- reviewer.md에서 `[FAIL_TRIGGER]` 수신 (FAIL 판정)
- `npx tsc --noEmit` 에러 > 0
- `npm run lint` 에러 > 0
- `npm run build` 실패
- 품질 게이트 미달 (confidenceScore < 50, 필수 필드 null)
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

### AI 응답 JSON 파싱 실패 루프
```
JSON 파싱 에러 감지
    │
    ▼
1. prompts.ts 확인 — JSON 스키마 명시 여부, prefill 형식 확인
    │
    ▼
2. JSON 형식 재강화
   ├── 시스템 프롬프트에 "반드시 유효한 JSON으로 응답" 추가
   ├── JSON 스키마 예시 추가/수정
   ├── prefill 수정 (더 명확한 시작 패턴)
   └── response_format 옵션 확인 (가능 시 json_object 모드)
    │
    ▼
3. prompts.ts 수정 적용
    │
    ▼
4. 재호출 테스트 (Bash 또는 직접 검증)
    │
    ▼
5. 성공? → 루프 탈출
   실패? → 다음 이터레이션 (다른 접근법 시도)
```

### confidenceScore 미달 루프
```
confidenceScore < 50 감지
    │
    ▼
1. 입력 데이터 품질 확인
   ├── deepAnswers 길이/품질 점검
   ├── basicInfo 완성도 점검
   └── 데이터 부족이 원인? → 사용자에게 추가 정보 요청 (에스컬레이션)
    │
    ▼
2. 프롬프트 개선
   ├── 더 구체적인 지시 추가
   ├── 예시 추가
   └── 부분 데이터에서도 추론하도록 유도
    │
    ▼
3. 재호출 → 점수 재확인
```

### 필수 필드 null 반환 루프
```
productDNA 필수 필드 null 감지
    │
    ▼
1. 해당 필드를 프롬프트에서 더 강조
    │
    ▼
2. JSON 스키마에 해당 필드를 required로 명시
    │
    ▼
3. 기본값 fallback 로직 추가 검토
    │
    ▼
4. 재호출 → 필드 확인
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

## memory.md 동기화 포맷

### 매 이터레이션 종료 시 → memory.md에 기록

```
---
[LOOP_SYNC]
source: loop.md
timestamp: {ISO 날짜}
iteration: {N}/3
trigger_source: checklist.md | reviewer.md

error:
  type: {에러 유형 — tsc | lint | build | json_parse | confidence | null_field | review_fail}
  detail: {에러 상세 설명}
  file: {관련 파일 경로}

fix:
  action: {수정 내용}
  files_changed: [수정한 파일 리스트]

result: resolved | partial | unresolved
lesson: {재발 방지 교훈}
---
```

### 동기화 대상 (memory.md 섹션)

| loop.md 데이터 | memory.md 대상 섹션 | 조건 |
|---------------|---------------------|------|
| 에러 + 해결 | LEARNINGS → 에러 패턴 요약 | 항상 |
| 교훈 | MISTAKES → 실수 기록 | 에러가 자체 실수인 경우 |
| 도구 사용 | LEARNINGS → 도구 효율 로그 | 새 도구 조합 발견 시 |
| 루프 완료 | CHECKPOINT | 항상 |
| 루프 완료 | 세션 히스토리 | 항상 |

### 에스컬레이션 시 → memory.md 기록

```
---
[ESCALATION_RECORD]
source: loop.md
timestamp: {ISO 날짜}
iterations: 3/3
status: UNRESOLVED

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

remaining_error: {현재 남은 에러}
suggestion: {가능한 해결 방향}
---
```

## 업데이트 규칙

- 매 이터레이션 종료 시: 에러 패턴 DB 갱신
- 같은 에러 3회 발생 → "빠른 해결 경로"에 자동 등록
- 새로운 에러 유형 → 에러 패턴 DB에 신규 항목
- 루프 효율 메트릭 → 매 루프 완료 시 재계산

## 반성 기준

- 3회 루프 후에도 미해결 → 접근법 자체를 재검토
- 같은 에러 재발 → memory.md 참조 실패 여부 확인
- 에러 증가 → 수정이 새 에러를 만드는지 확인
- 매 이터레이션 에러 감소율 < 30% → 접근법 변경 필요
