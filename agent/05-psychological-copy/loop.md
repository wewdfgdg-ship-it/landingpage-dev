# 반복 메커니즘 — Psychological Copy Agent

## 루프 발동 조건

### 자동 발동
- checklist.md에서 `[FAIL_TRIGGER]` 블록 수신 (type: CHECKLIST_FAIL)
- reviewer.md에서 `[FAIL_TRIGGER]` 블록 수신 (type: REVIEW_FAIL)
- `npx tsc --noEmit` 에러 > 0
- `npm run lint` 에러 > 0
- `npm run build` 실패
- 품질 게이트 미달 (qualityScore < 70, 섹션 누락)

### [FAIL_TRIGGER] 파싱 로직
```
[FAIL_TRIGGER] 수신
    │
    ├── source: checklist.md → failed_items 파싱 → 해당 항목 수정
    │   └── engine_specific 실패 시: quality_score, headline, section, frame, tone, cost, json, retry 각각 대응
    │
    └── source: reviewer.md → failed_perspectives + failed_engine_specific 파싱
        └── fix_guidance 참조하여 수정 방향 결정
```

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

### 품질 게이트 실패 루프
```
qualityScore < 80 감지
    │
    ▼
1. 실패 섹션 식별
   ├── frameScore < 60인 섹션
   ├── toneScore < 50인 섹션
   └── 실패 섹션 role 목록 작성
    │
    ▼
2. buildRetryPrompt 생성
   ├── 실패 섹션 목록 + 실패 사유 전달
   ├── 성공 섹션은 유지 지시
   └── 프레임/톤 개선 방향 명시
    │
    ▼
3. 실패 섹션만 재생성 (Claude Sonnet 재호출)
    │
    ▼
4. mergeCopy (성공 섹션 유지 + 재생성 섹션 교체)
    │
    ▼
5. qualityGate 재평가
   ├── PASS (≥80) → 완료
   └── FAIL → retry 2 (동일 과정)
       └── 2회 후에도 FAIL → ★ 최소 카피 모드 발동
```

### ★ 최소 카피 모드 (Degraded Copy Fallback)

> QG 2회 재시도 후에도 FAIL → 파이프라인 전면 중단 방지를 위한 비상 모드

```
QG 2회 실패 감지
    │
    ▼
1. 현재 CopyBlocks에서 사용 가능한 섹션 식별
   ├── combinedScore ≥ 50인 섹션 → 유지 (품질 부족하지만 사용 가능)
   └── combinedScore < 50인 섹션 → 최소 카피로 대체
    │
    ▼
2. 최소 카피 생성 (AI 호출 없음, 규칙 기반)
   ├── headline: brief.productDNA.coreValue 첫 15자
   ├── subheadline: brief.productDNA.USP 첫 30자
   ├── body: "" (빈 문자열)
   ├── bulletPoints: brief.productDNA.keyBenefits (최대 3개)
   ├── ctaText: "자세히 보기" (기본값)
   ├── microCopy: "" (빈 문자열)
   └── imageDirection: "제품 이미지" (기본값)
    │
    ▼
3. DegradedCopyBlocks 반환
   ├── isDegraded: true 플래그 설정
   ├── degradedSections: [대체된 섹션 role 목록]
   ├── qualityScore: 실제 점수 (경고용)
   └── 파이프라인에 ENGINE_WARNING 전파
    │
    ▼
4. 후속 엔진 동작
   ├── Bridge → degraded 섹션은 enrichment 스킵
   ├── Image Gen → degraded 섹션은 기본 제품 이미지 사용
   ├── ⑩ Code Engine → degraded 섹션은 심플 렌더러(renderGenericSection) 사용
   └── memory.md에 DEGRADED_COPY 이벤트 기록
```

**진입 조건**: QG retry 2회 소진 AND overallScore < 80
- overallScore 50~79 → 현재 결과 그대로 반환 + WARN (최소 카피 대체 안 함)
- overallScore < 50 → 최소 카피 대체 발동 + ENGINE_WARNING

### headline 초과 루프
```
headline > 15자 감지
    │
    ▼
1. 해당 섹션의 headline을 프롬프트에서 더 짧게 지시
    │
    ▼
2. buildRetryPrompt에 "headline 15자 이하 엄수" 강조
    │
    ▼
3. 재생성 → headline 길이 재확인
```

### 섹션 누락 루프
```
structure[]의 role이 CopyBlocks에 없음 감지
    │
    ▼
1. 누락 role 목록 확인
    │
    ▼
2. buildRetryPrompt에 누락 role 추가 생성 지시
    │
    ▼
3. 재생성 → 섹션 존재 확인
```

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

## 동기화 출력 블록

### [LOOP_SYNC] — loop → memory.md 동기화 포맷

```
---
[LOOP_SYNC]
engine: ⑤
loop_id: {고유 ID}
trigger_source: {checklist.md|reviewer.md}
iterations: {실행 횟수}/3
result: {resolved|escalated}
error_type: {에러 유형}
resolution: {해결 방법}
duration: {소요 시간}
learning: {재발 방지 학습}
timestamp: {ISO 8601}
---
```

### [ESCALATION_RECORD] — loop → memory.md + 사용자 에스컬레이션 포맷

```
---
[ESCALATION_RECORD]
engine: ⑤
loop_id: {고유 ID}
trigger_source: {checklist.md|reviewer.md}
iterations_completed: 3
remaining_errors: [{미해결 에러 목록}]
attempted_fixes:
  - iteration_1: {수정 내용} → {결과}
  - iteration_2: {수정 내용} → {결과}
  - iteration_3: {수정 내용} → {결과}
suggested_direction: {가능한 해결 방향}
requires_user_decision: true
timestamp: {ISO 8601}
---
```

## 업데이트 규칙

- 매 이터레이션 종료 시: 에러 패턴 DB 갱신
- 같은 에러 3회 발생 → "빠른 해결 경로"에 자동 등록
- 새로운 에러 유형 → 에러 패턴 DB에 신규 항목
- 루프 효율 메트릭 → 매 루프 완료 시 재계산
- 루프 성공 시: [LOOP_SYNC] 블록 생성 → memory.md 갱신
- 루프 실패 시: [ESCALATION_RECORD] 블록 생성 → memory.md 갱신 + 사용자 보고

## 반성 기준

- 3회 루프 후에도 미해결 → 접근법 자체를 재검토
- 같은 에러 재발 → memory.md 참조 실패 여부 확인
- 에러 증가 → 수정이 새 에러를 만드는지 확인
- 매 이터레이션 에러 감소율 < 30% → 접근법 변경 필요
