# 스킬 레지스트리 — Tool Intelligence Agent

> 검증된 스킬 카탈로그 + 스킬 체인 + 스킬 라우팅 + 피드백 통합.
> Tool Intelligence의 **스킬 생태계 관리 허브**.

---

## 스킬 카탈로그

> 4단계 필터를 통과한 검증 도구만 등록된다. Tool Intelligence만 쓰기 권한.

### 등록 스키마

```yaml
SK-NNN:
  name: "스킬 이름"
  category: "information | analysis | generation | code | image | deployment | data | testing"
  type: "skill | mcp"
  status: "trial | active | deprecated"
  capability: "무엇을 할 수 있는가"
  strength: "강점"
  weakness: "약점"
  score: 70-100
  for_agents: [에이전트 번호]
  alternatives: [대안 스킬 ID]
  tags: ["태그1", "태그2"]
  usage_count: 0
  success_rate: "-"
  registered_date: "YYYY-MM-DD"
  last_used: "-"
```

### 상태 관리

```
trial (초기)
  → 5회+ 사용, 성공률 70%+ → active
  → 성공률 30% 미만 또는 3회 연속 실패 → deprecated

active (활성)
  → 30일 미사용 → 필요성 재검토
  → 성공률 급락 → deprecated 검토

deprecated (퇴역)
  → 삭제 금지 — 이력 보존
  → 대안 스킬 기록 필수
```

### 현재 카탈로그

> 아직 등록된 스킬 없음. 첫 탐색 후 채워진다.

| ID | 이름 | 카테고리 | 상태 | 점수 | 대상 에이전트 |
|----|------|---------|------|------|-------------|
| - | - | - | - | - | - |

---

## 스킬 라우팅 (문제 유형 → 스킬 매핑)

> 에이전트가 세션 시작 시 미리 파악하고, 작업 중 즉시 꺼내 쓰는 매핑 엔진.

### 8가지 문제 유형 → 스킬 조건부 매핑

```yaml
information_retrieval:
  - if 외부 라이브러리 문서 → Context7
  - if 최신 뉴스/트렌드 → WebSearch
  - if 특정 페이지 → WebFetch
  - if 내부 코드 → Grep + Read

analysis:
  - if 단순 1파일 → Read
  - if 다중 파일 패턴 → Grep + Read
  - if 복잡한 시스템 → Sequential
  - if 아키텍처 수준 → Sequential + Context7

generation:
  - if UI 컴포넌트 → Magic + Context7
  - if 백엔드 로직 → /implement + Context7
  - if AI 프롬프트 → Sequential + /implement
  - if 카피/텍스트 → /implement

code:
  - if 부분 수정 → Edit
  - if 전체 재작성 → Write (Read 먼저)
  - if 리팩터링 → /improve + /test
  - if 새 기능 → /design + /implement + /test

image:
  - if 이미지 생성 → Gemini API
  - if 이미지 분석 → Read (멀티모달)
  - if UI 패턴 참조 → Magic

deployment:
  - if 빌드 → Bash(npm run build)
  - if DB 스키마 → Bash(prisma db push)
  - if 배포 설정 → Context7

data:
  - if DB 쿼리 → Context7(Prisma)
  - if 데이터 변환 → /implement
  - if 마이그레이션 → Bash(prisma)

testing:
  - if 타입 체크 → Bash(tsc)
  - if 린트 → Bash(lint)
  - if E2E → Playwright
  - if 유닛 → /test
```

### 에이전트별 자동 태그

| 에이전트 | 문제 유형 태그 |
|---------|-------------|
| ① Product Intelligence | product-analysis, research, market, ai-prompt |
| ② Why Now | rules-engine, mapping, urgency |
| ③ Conversion Strategy | strategy, ai-prompt, structure |
| ④ Objection Killer | rules-engine, mapping, objection |
| ⑤ Psychological Copy | copywriting, persuasion, ai-prompt, korean |
| ⑥ Trust Architecture | rules-engine, trust, mapping |
| ⑦ Attention Architecture | rules-engine, attention, zone |
| ⑧ Layout Intelligence | layout, pattern, responsive, css |
| ⑨ Visual Style | design-tokens, color, typography, mood |
| ⑩ Code Engine | nextjs, component, tailwind, html, xss |
| ⑪ Deploy | deployment, r2, prisma, slug |
| ⑫ Learning Loop | analytics, ab-testing, statistics, tracking |

---

## 스킬 체인 (검증된 다단계 조합)

> 3회+ 연속 성공한 동일 순서 조합이 자동 등록된다.

### 등록 스키마

```yaml
CHAIN-NNN:
  name: "체인 이름"
  steps:
    - { order: 1, skill: "스킬명", action: "수행 내용" }
    - { order: 2, skill: "스킬명", action: "수행 내용" }
  problem_type: "문제 유형"
  for_agents: [에이전트 번호]
  success_count: 0
  success_rate: "-"
  status: "trial | active | archived"
```

### 상태 관리

```
trial (3회 성공 시 자동 등록)
  → 5회+ 성공, 성공률 70%+ → active
  → 성공률 30% 미만 → archived

active (활성)
  → 30일 미사용 → archived

archived (보관)
  → 핵심 스킬 deprecated 시 → 즉시 archived
```

### 현재 체인

| ID | 이름 | 단계 | 성공률 | 상태 |
|----|------|------|--------|------|
| - | - | - | - | - |

---

## 스킬 피드백 (사용 결과 수집)

> 모든 에이전트가 스킬 사용 후 여기에 기록한다. Tool Intelligence가 읽어서 카탈로그를 갱신한다.

### 기록 형식

```yaml
- date: "YYYY-MM-DD"
  skill_id: "SK-NNN"
  agent: "에이전트 번호"
  result: "success | fail"
  problem_type: "문제 유형"
  memo: "특이사항"
```

### Tool Intelligence 처리 규칙

| 조건 | 행동 |
|------|------|
| 3회+ 연속 성공 | success_rate 갱신, for_agents 확장 검토 |
| 3회+ 연속 실패 | deprecated 처리, 대안 탐색 트리거 |
| 실패 메모에서 키워드 추출 | 새 탐색 키워드로 활용 |
| 새 에이전트 성공 | for_agents에 추가 |
| 30일 미사용 | 필요성 재검토 |
| "해결 불가" 기록 | 즉시 탐색 트리거 (TTL 무시) |

### 7일 요약

| 기간 | 성공 | 실패 | 성공률 | 주요 실패 원인 |
|------|------|------|--------|-------------|
| - | - | - | - | - |

### 해결 불가 목록

| 날짜 | 에이전트 | 문제 유형 | 시도한 스킬 | 메모 |
|------|---------|----------|-----------|------|
| - | - | - | - | - |

---

## 빌트인 스킬 사용 패턴 (Tool Intelligence 전용)

> Tool Intelligence 자체가 사용하는 스킬 우선순위.

| 순위 | 스킬 | 빈도 | 용도 |
|------|------|------|------|
| 1 | /analyze | 높음 | 도구 적합성 분석, 품질 평가 |
| 2 | /explain | 중간 | 도구 기능 설명, 차이점 비교 |
| 3 | /document | 낮음 | 브로드캐스트 문서화 |

### Tool Intelligence가 사용하지 않는 스킬
- /implement, /build, /test — 코드 생성/빌드 안 함
- /design — 시스템 설계 안 함
- /git — 버전 관리 안 함
- /cleanup — 코드 정리 안 함

---

## 업데이트 규칙

- 스킬 사용 후: 피드백 처리 + 카탈로그 갱신
- 체인 3회 성공 시: 자동 등록
- deprecated 시: 대안 기록 필수
- 매 5회 처리 시: 라우팅 매핑 정확도 검토
- Phase 전환 시: 해당 Phase 에이전트 태그 중점 탐색
