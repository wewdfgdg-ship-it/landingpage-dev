# 루프 — Tool Intelligence Agent

> 2가지 루프를 통합 관리한다:
> 1. **추천 품질 루프** — 체크리스트/리뷰어 FAIL 시 추천 수정
> 2. **스킬 자동 업그레이드 루프** — 도구 생태계 자동 개선

---

## 루프 1: 추천 품질 루프 (다른 에이전트와 동일 구조)

### 트리거

```yaml
자동:
  - [FAIL_TRIGGER] from checklist.md (통과율 <80%)
  - [FAIL_TRIGGER] from reviewer.md (판정 FAIL)

수동:
  - 사용자 "--loop" 플래그
  - "다시", "수정", "개선" 키워드
```

### 5단계 루프 프로세스

```
반복 N/3:
  │
  ▼
1. 문제 식별
   - 실패 항목 수집
   - 에러 패턴 DB 확인 → 빠른 해결 경로 존재?
  │
  ▼
2. 원인 분석
   - 빠른 경로 있음 → 즉시 적용
   - 단순 → 직접 수정
   - 복잡 → Sequential MCP (→ 즉시 OFF)
  │
  ▼
3. 수정 실행
   - 추천 재구성
   - 필터 재적용
   - 누락 항목 보충
  │
  ▼
4. 재검증
   - checklist.md 재실행
  │
  ▼
5. 재리뷰
   - reviewer.md 재판정
   ├── PASS/WARN → 루프 종료
   └── FAIL → 다음 반복 (최대 3회)
```

### 추천 품질 전용 루프

| 실패 유형 | 수정 방법 |
|----------|----------|
| 필터 무결성 위반 | 해당 단계 필터 재적용, 부적합 도구 제거 |
| MCP 비용 경고 누락 | 경고문 추가, costWarning 필드 보충 |
| 적합성 불일치 | 에이전트 엔진 타입 재확인, 부적합 도구 교체 |
| 점수 70 미만 포함 | 미달 도구 제거, 차순위 후보로 교체 |
| fallback 부재 | fallbackTools 추가 |
| confidenceScore 이상 | 패턴 매칭 근거 재확인, 점수 재산정 |

### 최대 반복: 3회

3회 실패 시 에스컬레이션:

```yaml
[ESCALATION_RECORD]
  agent: "13-tool-intelligence"
  loop_type: "recommendation_quality"
  iterations: 3
  attempted_fixes:
    - { iteration: 1, fix: "...", result: "FAIL" }
    - { iteration: 2, fix: "...", result: "FAIL" }
    - { iteration: 3, fix: "...", result: "FAIL" }
  unresolved_reason: "..."
  recommended_action: "..."
  blocker: true
```

---

## 루프 2: 스킬 자동 업그레이드 루프

> 도구 생태계를 자동으로 개선하는 메커니즘.

### 전체 흐름

```
에이전트 작업 실행
  │
  ▼
skill-registry.md 라우팅 참조 → 스킬 선택
  │
  ▼
스킬 실행
  │
  ▼
결과 평가
  ├── PASS → skill-feedback에 ✓ 기록 → Step 6
  └── FAIL → Step 5
  │
  ▼
5. 실패 분석
  ├── alternative 존재 (skill-registry.md 카탈로그)
  │   → 스킬 교체 → Step 3 재시작
  │
  └── alternative 없음
      → "해결 불가" 기록 → 탐색 트리거 발동
  │
  ▼
6. 학습 기록
  ├── 성공 패턴 → memory.md Success Patterns
  ├── 실패 패턴 → memory.md Failure Patterns
  └── 체인 성공 3회+ → skill-chains 자동 등록
```

### 6개 탐색 트리거

| # | 트리거 | 유형 | 우선순위 |
|---|--------|------|---------|
| ① | 마지막 탐색에서 7일 경과 (캐시 TTL) | 정기 | 보통 |
| ② | 새 라이브러리 추가 (package.json 변경) | 이벤트 | 높음 |
| ③ | Phase 전환 발생 | 이벤트 | 높음 |
| ④ | 에이전트 도구 실패 보고 | 이벤트 | 높음 |
| ⑤ | skill-feedback.md 실패 누적 3건+ | 자동 | 긴급 |
| ⑥ | "해결 불가" 기록 발생 | 긴급 | 최우선 (TTL 무시) |

### ⑤번 트리거 상세

```
skill-feedback.md 스캔
  │
  ├── 동일 스킬 → 3회+ 연속 실패
  │   → 해당 스킬 status → deprecated
  │   → 실패 메모에서 키워드 추출
  │   → 해당 키워드로 즉시 탐색 시작
  │
  └── 동일 문제 유형 → 3회+ (스킬 다름)
      → 해당 문제 유형 전체 재탐색
      → "이 유형에 맞는 스킬이 부족하다" 기록
```

### ⑥번 트리거 상세

```
"해결 불가" 기록 감지
  │
  ├── 메모에서 핵심 키워드 추출
  ├── 조건 무시하고 즉시 탐색 실행 (TTL 무시)
  └── 긴급 탐색으로 분류
```

---

## 주기적 점검 (탐색 시 자동 실행)

| 점검 항목 | 행동 |
|----------|------|
| deprecated 스킬 존재 | 대체 스킬 탐색 |
| 성공률 하락 스킬 (active인데 최근 50%↓) | 원인 분석 + 대체 후보 탐색 |
| Upgrade Candidates (memory.md) | 해당 키워드로 탐색 |
| 30일 미사용 스킬 | 필요성 재검토 |
| 30일 미사용 체인 | skill-chains에서 archived 전환 |

---

## 자동 교체 프로토콜

```
deprecated 또는 성공률 급락 스킬 감지
  │
  ▼
1. skill-registry.md 카탈로그에서 같은 tags/category 검색
  │
  ├── 대체 후보 있음 (다른 active 스킬)
  │   → skill-registry.md 라우팅 매핑 업데이트
  │   → tool-broadcast에 교체 알림
  │
  └── 대체 후보 없음
      → 4단계 필터로 신규 탐색 실행
      → 발견 시: trial로 등록 → 에이전트에 알림
      → 미발견 시: memory.md에 "대체 미발견" 기록
```

---

## 에러 패턴 DB (자동 누적)

| 에러 유형 | 발생 횟수 | 해결 방법 | 평균 해결 시간 | 마지막 발생 |
|----------|----------|----------|-------------|------------|
| - | - | - | - | - |

### 빠른 해결 경로 (동일 에러 3회+ → 자동 등록)

| 에러 패턴 | 해결 경로 | 성공률 |
|----------|----------|--------|
| - | - | - |

---

## 루프 효율 메트릭 (자동 갱신)

### 추천 품질 루프
- 총 루프 발동 횟수: 0
- 평균 반복 횟수: -
- 1회차 해결률: -
- 에러 감소율: -

### 스킬 업그레이드 루프
- 총 루프 발동 횟수: 0
- 스킬 교체 성공 횟수: 0
- 평균 대체 탐색 시간: -
- 자동 등록 체인 수: 0
- 트리거별 발동 통계:
  - ① TTL: 0 / ② 패키지: 0 / ③ Phase: 0
  - ④ 실패보고: 0 / ⑤ 피드백누적: 0 / ⑥ 해결불가: 0

---

## 동기화 블록

### 루프 성공 시 → memory.md

```yaml
[LOOP_SYNC]
  loop_type: "recommendation_quality | skill_upgrade"
  iteration: N
  error_type: "..."
  root_cause: "..."
  fix_applied: "..."
  lesson_learned: "..."
```

### 루프 실패 시 → memory.md + 사용자

```yaml
[ESCALATION_RECORD]
  loop_type: "recommendation_quality | skill_upgrade"
  iterations: 3
  attempted_fixes: [...]
  unresolved_reason: "..."
  recommended_action: "..."
```

---

## 반성 기준

- 3회 루프 미해결 → 접근 방식 자체를 재검토
- 동일 에러 반복 → memory.md 참조 실패 점검
- 에러 증가 → 수정이 새 에러를 만드는지 확인
- 에러 감소율 <30%/반복 → 접근 방식 변경
