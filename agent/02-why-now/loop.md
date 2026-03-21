# 반복 메커니즘 — Why Now Agent

## 루프 발동 조건

### 자동 발동

> `[FAIL_TRIGGER]` 블록 수신 시 자동 발동 (소스: checklist.md 또는 reviewer.md)

- checklist.md에서 `[FAIL_TRIGGER]` 수신 (pass_rate < 80%)
- reviewer.md에서 `[FAIL_TRIGGER]` 수신 (FAIL 판정)
- `npx tsc --noEmit` 에러 > 0
- `npm run lint` 에러 > 0
- `npm run build` 실패
- 품질 게이트 미달 (urgencyElements 빈 배열, ctaUrgencyLevel 범위 초과)
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

### 타입 불일치 루프
```
타입 에러 감지 (ProductBrief → UrgencyBrief)
    │
    ▼
1. rules.ts 상수 확인 — URGENCY_TYPES 정의 확인
    │
    ▼
2. types.ts 확인 — UrgencyType 정의와 상수 일치 여부
    │
    ▼
3. 불일치 발견 시:
   ├── 상수 값과 타입 리터럴 동기화
   ├── 매핑 테이블에서 사용하는 값 확인
   └── index.ts의 반환값 타입 확인
    │
    ▼
4. 수정 적용 → tsc 재실행
    │
    ▼
5. 성공? → 루프 탈출
   실패? → 다음 이터레이션
```

### 규칙 매핑 누락 루프
```
예상치 못한 industry/priceRange 값 감지
    │
    ▼
1. rules.ts 매핑 테이블 확인
    │
    ▼
2. 누락된 케이스 추가
   ├── 새 industry → urgencyType 매핑 추가
   ├── 새 priceRange → intensity 조정 추가
   └── 기본값 fallback 경로 강화
    │
    ▼
3. rules.ts 수정 적용
    │
    ▼
4. 타입 체크 + 빌드 → 재검증
```

### ctaUrgencyLevel 범위 초과 루프
```
ctaUrgencyLevel 범위 초과 감지 (< 1 또는 > 5)
    │
    ▼
1. 계산 로직 확인 (index.ts 또는 rules.ts)
    │
    ▼
2. 클램핑 로직 추가/수정
   └── Math.min(5, Math.max(1, Math.round(level)))
    │
    ▼
3. 수정 적용 → 재검증
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

## memory.md 동기화 포맷

### 이터레이션 완료 시 → memory.md

```markdown
---
[LOOP_SYNC]
engine: ②
agent: Why Now Agent
iteration: 1
trigger_source: checklist | reviewer
error:
  type: "ctaUrgencyLevel 범위 초과"
  file: src/engine/02-why-now/index.ts
  line: 88
fix:
  action: "Math.min(5, Math.max(1, Math.round(level))) 클램핑 추가"
  file: src/engine/02-why-now/index.ts
  line: 88
result: resolved | ongoing
lesson: "calculateCtaUrgencyLevel 반환값에 항상 클램핑 적용"
---
```

### 동기화 대상

| loop.md 데이터 | memory.md 섹션 | 조건 |
|---------------|---------------|------|
| 에러 유형 + 해결법 | LEARNINGS 에러 패턴 요약 | 매 이터레이션 |
| 교훈 | MISTAKES (실수 기록) | 새 실수 발견 시 |
| 루프 효율 메트릭 | 성장 지표 | 매 루프 완료 시 |
| 도구 조합 성공 | LEARNINGS 도구 효율 로그 | 새 도구 조합 시 |

### 에스컬레이션 시 → memory.md

```markdown
---
[ESCALATION_RECORD]
engine: ②
agent: Why Now Agent
problem: "industry→urgencyType 매핑 누락으로 런타임 에러"
iterations:
  - iteration: 1
    fix: "교육 산업 매핑 추가"
    result: "새 에러 발생 (priceRange 관련)"
  - iteration: 2
    fix: "priceRange 기본값 fallback 추가"
    result: "타입 에러 지속"
  - iteration: 3
    fix: "타입 정의와 상수 동기화"
    result: "tsc 에러 1개 남음"
remaining: "UrgencyType 리터럴 타입과 rules.ts 상수 불일치"
suggestion: "types.ts와 rules.ts의 urgency type 값을 전수 비교 필요"
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
