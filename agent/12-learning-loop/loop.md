# 반복 메커니즘 — Learning Loop Agent

## 루프 발동 조건

### 자동 발동
- reviewer.md에서 **FAIL** 판정
- `npx tsc --noEmit` 에러 > 0
- `npm run lint` 에러 > 0
- `npm run build` 실패
- 진단 로직 에러 (DiagnosisType 무효, severity 무효)
- 처방 level 범위 초과 (1-3 외)
- Level 3에 requiresApproval 누락
- AI 응답 JSON 파싱 실패
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

### 진단 정확도 미달 루프
```
잘못된 진단 감지 (오진, 누락 진단)
    │
    ▼
1. rules.ts 확인 — 진단 임계값 점검
   ├── bounceRate 임계값 (기본 70%) 적절한지?
   ├── scrollDepth 임계값 (기본 p50 < 30%) 적절한지?
   ├── CTA 클릭률 임계값 (기본 < 2%) 적절한지?
   └── 기타 임계값 합리성 확인
    │
    ▼
2. 진단 임계값 조정
   ├── 실제 메트릭 분포 기반으로 재설정
   ├── 너무 민감 → 임계값 완화
   └── 너무 둔감 → 임계값 강화
    │
    ▼
3. rules.ts 수정 적용
    │
    ▼
4. 재분석 (동일 메트릭으로 진단 재실행)
    │
    ▼
5. 진단 결과 비교
   ├── 개선됨 → 루프 탈출
   └── 미개선 → 다음 이터레이션 (AI 프롬프트 조정)
```

### A/B 테스트 교란 변수 루프
```
A/B 테스트 결과 신뢰성 의심
    │
    ▼
1. 교란 변수 점검
   ├── 동일 섹션 동시 테스트 여부
   ├── 외부 요인 (시즌, 캠페인) 영향
   ├── 트래픽 분배 불균형
   └── 샘플 크기 부족
    │
    ▼
2. 변수 통제 로직 수정
   ├── 동시 테스트 방지 강화
   ├── 외부 요인 기록 + 필터링
   ├── 트래픽 분배 재확인
   └── 최소 샘플 크기 상향
    │
    ▼
3. rules.ts 수정 적용
    │
    ▼
4. 테스트 재시작 또는 결과 재평가
```

### AI 응답 파싱 실패 루프
```
AI 진단 JSON 파싱 에러 감지
    │
    ▼
1. prompts.ts 확인 — JSON 스키마 명시 여부, prefill 형식
    │
    ▼
2. JSON 형식 재강화
   ├── 시스템 프롬프트에 "반드시 유효한 JSON" 추가
   ├── DiagnosisType enum 명시적 나열
   ├── severity 4단계 명시적 나열
   └── prefill 수정
    │
    ▼
3. prompts.ts 수정 적용
    │
    ▼
4. 재호출 테스트
    │
    ▼
5. 성공? → 루프 탈출
   실패? → 규칙 기반 진단만으로 fallback (AI 진단 스킵)
```

## 자동 수신 블록 ([FAIL_TRIGGER] 파싱)

### checklist.md FAIL 수신 시

```yaml
# CHECKLIST_FAIL 파싱 → 엔진 특화 루프 매핑
engine_specific_failures:
  diagnosis_valid: false → "진단 정확도 미달 루프" 발동
  prescription_valid: false → "처방 레벨 검증 루프" (level 범위 + diagnosisId 연결)
  ab_test_valid: false → "A/B 테스트 교란 변수 루프" 발동
  threshold_valid: false → "진단 정확도 미달 루프" (임계값 조정)
  level3_gate_valid: false → "Level 3 승인 게이트 수정" (requiresApproval 강제 설정)
  ai_parsing_valid: false → "AI 응답 파싱 실패 루프" 발동
  cost_tracked: false → "비용 추적 로직 추가" (usage 기록 + 비용 계산)
```

### reviewer.md FAIL 수신 시

```yaml
# REVIEW_FAIL 파싱 → 관점별 루프 매핑
engine_specific_failures:
  diagnosis_accuracy: "진단 정확도 미달 루프" (임계값 + AI 프롬프트 동시 점검)
  prescription_level_compliance: "처방 레벨 검증 루프" (level 분류 + 승인 게이트)
  ab_test_validity: "A/B 테스트 교란 변수 루프" (통계 + 교란 변수)
  ai_prompt_quality: "AI 응답 파싱 실패 루프" (프롬프트 + JSON 형식)
  cost_management: "비용 초과 수정" (호출 최소화 + 규칙 우선)
```

## 자동 발신 블록

### [LOOP_SYNC]

> 루프 성공 탈출 시 자동 생성 → memory.md로 전달

```yaml
type: LOOP_SYNC
engine: ⑫ Learning Loop
timestamp: <ISO 8601>
iteration_count: <이터레이션 수>
error_type: "<에러 유형>"
root_cause: "<근본 원인>"
fix_applied: "<적용된 수정>"
lesson_learned: "<학습 내용>"
```

### [ESCALATION_RECORD]

> 루프 3회 실패 시 자동 생성 → memory.md + 사용자에게 전달

```yaml
type: ESCALATION_RECORD
engine: ⑫ Learning Loop
timestamp: <ISO 8601>
error_type: "<에러 유형>"
iterations:
  - iteration: 1
    fix: "<시도한 수정>"
    result: "<결과>"
  - iteration: 2
    fix: "<시도한 수정>"
    result: "<결과>"
  - iteration: 3
    fix: "<시도한 수정>"
    result: "<결과>"
remaining_errors: "<남은 에러>"
suggestion: "<해결 방향 제안>"
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

## 업데이트 규칙

- 매 이터레이션 종료 시: 에러 패턴 DB 갱신
- 같은 에러 3회 발생 → "빠른 해결 경로"에 자동 등록
- 새로운 에러 유형 → 에러 패턴 DB에 신규 항목
- 루프 효율 메트릭 → 매 루프 완료 시 재계산
- 성공 탈출 → [LOOP_SYNC] 발신 → memory.md 동기화
- 3회 실패 → [ESCALATION_RECORD] 발신 → memory.md + 사용자 보고

## 반성 기준

- 3회 루프 후에도 미해결 → 접근법 자체를 재검토
- 같은 에러 재발 → memory.md 참조 실패 여부 확인
- 에러 증가 → 수정이 새 에러를 만드는지 확인
- 매 이터레이션 에러 감소율 < 30% → 접근법 변경 필요
