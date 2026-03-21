# 스킬 카탈로그 — 검증된 도구 전체 목록

> Tool Intelligence Agent가 4단계 필터 70점+ 통과한 스킬만 등록한다.
> 에이전트가 직접 발견한 것도 등록 가능 (Tool Intelligence 사후 검증).
> 각 에이전트는 이 파일을 **읽기만** 한다. 쓰기는 Tool Intelligence만.

---

## 등록 규칙

1. Tool Intelligence 4단계 필터 70점+ 통과한 것만 등록
2. 에이전트 직접 발견 → Tool Intelligence 사후 검증 후 등록
3. 삭제 금지 — `status: deprecated`로 전환 (이력 보존)
4. MCP 유형은 반드시 `cost_per_use` 명시
5. `trigger_when`이 없으면 에이전트가 매칭할 수 없으므로 필수

## 스킬 프로필 스키마

```yaml
### SK-{NNN}
name: "스킬/MCP 이름"
category: "정보검색 | 분석 | 생성 | 코드 | 이미지 | 배포 | 데이터 | 테스트"
type: skill | mcp
status: active | trial | deprecated

# 능력
capability:
  - "할 수 있는 것 1"
  - "할 수 있는 것 2"

strength:
  - "강점 1"
  - "강점 2"

weakness:
  - "약점 1"

# 입출력
input_format: "어떤 형태의 입력을 받는지"
output_format: "어떤 형태로 결과를 내는지"

# 성능
speed: "fast | medium | slow"
accuracy: "high | medium | low"
cost_per_use: "~300 토큰 | 무료 | ~₩50"
reliability: "high | medium | low"

# 사용 맥락
trigger_when:
  - "이런 상황에서 사용"
  - "저런 상황에서 사용"

best_use:
  - "최적 사용처 1"
  - "최적 사용처 2"

avoid_use:
  - "이런 상황에서는 쓰지 마라"
  - "저런 상황에서도 쓰지 마라"

# 매핑
tags: [tag1, tag2, tag3]
for_agents: [01, 03, 05, 10]
alternative: [SK-NNN, SK-NNN]

# 설치/사용
install: "설치 방법 한 줄"
usage_example: "사용 예시 한 줄"

# 실적
score: 82
usage_count: 0
success_rate: null
last_used: null
approved_date: 2026-03-09
last_verified: 2026-03
```

---

## 등록된 스킬

> Tool Intelligence가 아래에 스킬 프로필을 추가한다. 최신 항목이 아래에.

(아직 등록된 스킬 없음)

<!-- 예시:

### SK-001
name: "context7"
category: "정보검색"
type: mcp
status: active

capability:
  - 외부 라이브러리 공식 문서 조회
  - 프레임워크 패턴/베스트 프랙티스 검색
  - 코드 예시 추출

strength:
  - 공식 문서 기반 (정확도 높음)
  - 버전별 문서 지원

weakness:
  - 마이너 라이브러리 미지원 가능
  - 한국어 문서 부족

input_format: "라이브러리 이름 + 주제 키워드"
output_format: "마크다운 문서 + 코드 예시"

speed: fast
accuracy: high
cost_per_use: "~300 토큰/턴 (ON 유지 시)"
reliability: high

trigger_when:
  - "외부 라이브러리 공식 문서가 필요할 때"
  - "프레임워크 패턴/베스트 프랙티스 확인 시"
  - "import 문에서 외부 패키지 감지 시"

best_use:
  - Next.js, Prisma, Zustand 등 주요 프레임워크 문서
  - API 사용법 확인
  - 마이그레이션 가이드

avoid_use:
  - 프로젝트 내부 코드 분석
  - 코드 생성 (문서 조회만 가능)
  - 디버깅 (Sequential이 적합)

tags: [docs, framework, library, pattern]
for_agents: [01, 03, 05, 08, 09, 10]
alternative: [WebSearch]

install: "Claude Code MCP 기본 내장"
usage_example: "resolve-library-id → get-library-docs"

score: 85
usage_count: 0
success_rate: null
last_used: null
approved_date: 2026-03-09
last_verified: 2026-03

-->

---

## 상태 관리

| 상태 | 의미 | 전환 조건 |
|------|------|----------|
| `trial` | 시험 중 (5회 미만 사용) | Tool Intelligence 등록 시 초기 상태 |
| `active` | 검증 완료 | 5회+ 사용 & 성공률 70%+ |
| `deprecated` | 퇴출 | 성공률 30%↓ 또는 3회 연속 실패 |

### 상태 전환 규칙

```
trial ──(5회+ 사용, 성공률 70%+)──→ active
trial ──(성공률 30%↓, 3회+ 사용)──→ deprecated
active ──(성공률 30%↓ 연속)──→ deprecated
deprecated ──(대체 스킬로 교체)──→ 유지 (삭제 금지)
```

---

## 통계 (Tool Intelligence가 갱신)

- 총 등록 스킬: 0
- active: 0
- trial: 0
- deprecated: 0

---

## 업데이트 규칙

- Tool Intelligence 탐색 완료 후: 70점+ 스킬 등록
- feedback 반영 시: usage_count, success_rate, last_used 갱신
- 상태 전환 시: status 변경 + memory.md에 기록
- 매 30일: last_verified 갱신 (Tool Intelligence 점검 시)
