# 검증된 스킬 체인 — 자동 축적

> 동일 순서로 3회+ 성공한 스킬 조합이 자동 등록된다.
> 에이전트는 다단계 작업 시 이 파일에서 검증된 체인을 우선 사용한다.
> **쓰기**: Tool Intelligence (자동 등록) + 에이전트 (성공 체인 제안)
> **읽기**: 모든 에이전트

---

## 체인 등록 규칙

1. **자동 등록**: skill-feedback.md에서 동일 순서 3회+ 성공 감지 시
2. **수동 제안**: 에이전트가 성공한 조합을 Tool Intelligence에게 제안 → Tool Intelligence 검증 후 등록
3. **삭제 금지**: `status: archived`로 전환 (이력 보존)
4. **체인 내 스킬 deprecated**: 해당 체인 즉시 재검토 → 대체 스킬로 교체 or archived

## 체인 프로필 스키마

```yaml
### CHAIN-{NNN}
name: "체인 이름"
status: active | trial | archived
steps:
  - step: 1
    skill: "SK-NNN 또는 도구명"
    action: "이 단계에서 하는 일"
  - step: 2
    skill: "SK-NNN 또는 도구명"
    action: "이 단계에서 하는 일"
  - step: 3
    skill: "SK-NNN 또는 도구명"
    action: "이 단계에서 하는 일"

problem_type: "정보검색+분석 | 생성+코드 | ..."
primary_agent: "주 사용 엔진 번호"
for_agents: [01, 03, 05]

success_count: 3
success_rate: 91%
avg_duration: "~30초"

registered_date: 2026-03-10
last_used: null
```

---

## 등록된 체인

> 자동 등록 또는 Tool Intelligence 검증 후 추가. 최신 항목이 아래에.

(아직 등록된 체인 없음)

<!-- 예시:

### CHAIN-001
name: "Research Chain"
status: active
steps:
  - step: 1
    skill: "WebSearch"
    action: "최신 웹 정보 검색"
  - step: 2
    skill: "직접 처리"
    action: "검색 결과 요약 + 핵심 추출"
  - step: 3
    skill: "Sequential (--seq)"
    action: "구조화 인사이트 도출"

problem_type: "정보검색 + 분석"
primary_agent: "01-product-intelligence"
for_agents: [01, 03, 12]

success_count: 5
success_rate: 91%
avg_duration: "~45초"

registered_date: 2026-03-10
last_used: 2026-03-12

---

### CHAIN-002
name: "Copy Chain"
status: active
steps:
  - step: 1
    skill: "Sequential (--seq)"
    action: "심리 분석 (타겟 고객 동기/저항)"
  - step: 2
    skill: "SK-005"
    action: "설득 카피 생성"
  - step: 3
    skill: "직접 처리"
    action: "카피 정제 + 품질 게이트"

problem_type: "분석 + 생성"
primary_agent: "05-psychological-copy"
for_agents: [04, 05, 06]

success_count: 4
success_rate: 85%
avg_duration: "~60초"

registered_date: 2026-03-11
last_used: 2026-03-13

---

### CHAIN-003
name: "Image Chain"
status: trial
steps:
  - step: 1
    skill: "직접 처리"
    action: "이미지 프롬프트 생성"
  - step: 2
    skill: "Gemini API"
    action: "이미지 생성"
  - step: 3
    skill: "직접 처리"
    action: "이미지 품질 검증 + 재생성"

problem_type: "이미지"
primary_agent: "09-visual-style"
for_agents: [09, 10]

success_count: 3
success_rate: 78%
avg_duration: "~90초"

registered_date: 2026-03-12
last_used: 2026-03-12

-->

---

## 상태 관리

| 상태 | 의미 | 전환 조건 |
|------|------|----------|
| `trial` | 3회 성공으로 자동 등록됨 | 자동 등록 시 초기 상태 |
| `active` | 검증 완료 | 5회+ 성공 & 성공률 70%+ |
| `archived` | 보관 | 30일 미사용 또는 핵심 스킬 deprecated |

### 상태 전환 규칙

```
자동 감지 (3회 동일 순서 성공)
    │
    ▼
trial ──(5회+ 성공, 성공률 70%+)──→ active
trial ──(성공률 50%↓)──→ archived
active ──(30일 미사용)──→ archived
active ──(핵심 스킬 deprecated)──→ 재검토
                                    ├── 대체 스킬 있음 → 스킬 교체, active 유지
                                    └── 대체 없음 → archived
archived ──(재사용 3회+ 성공)──→ trial로 복귀
```

---

## 체인 사용 프로토콜 (에이전트용)

```
다단계 작업 감지
    │
    ▼
1. 이 파일에서 problem_type 매칭
    │
    ├── 매칭 체인 있음 (status=active or trial)
    │   └── for_agents에 내 번호 포함?
    │       ├── YES → 체인 실행
    │       └── NO → 단일 스킬로 처리
    │
    └── 매칭 체인 없음
        → 단일 스킬로 처리
        → 성공 시 skill-feedback.md에 순서 기록
        → 3회 반복 시 자동 체인 등록 제안
```

---

## 통계 (Tool Intelligence가 갱신)

- 총 등록 체인: 0
- active: 0
- trial: 0
- archived: 0
- 평균 성공률: -

---

## 업데이트 규칙

- skill-feedback.md에서 3회 동일 순서 감지 시: 자동 등록 (trial)
- 체인 사용 후: success_count, success_rate, last_used 갱신
- 체인 내 스킬 상태 변경 시: 즉시 재검토
- 매 30일: 미사용 체인 archived 전환
