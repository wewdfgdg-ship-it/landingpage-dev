# 도구 선택 전략 — Tool Intelligence Agent

> 도구 추천 시 사용하는 7축 선택 기준, 문제 유형→도구 매핑, 소스 Tier 전략, fallback 체인.
> 이 파일은 Tool Intelligence의 **핵심 두뇌**이다.

---

## 7축 선택 기준

> 후보 도구가 여러 개일 때, 7개 축으로 점수화하여 최적을 선택한다.

| 축 | 가중치 | 측정 방법 |
|------|--------|----------|
| 최신성 (Recency) | 15% | 마지막 업데이트일, 문서 갱신 주기 |
| 정확성 (Accuracy) | 20% | 과거 성공률, 출력 품질 |
| 속도 (Speed) | 10% | 평균 실행 시간 |
| 비용 (Cost) | 15% | 토큰 소모량, API 비용 |
| 재현성 (Reproducibility) | 10% | 동일 입력 → 동일 출력 비율 |
| 구조화 출력 (Structured Output) | 15% | JSON/타입 호환 출력 여부 |
| 자동화 연결성 (Automation) | 15% | 파이프라인 연결 용이성, 체인 가능 여부 |

### 점수 산출

```
totalScore = recency * 0.15 + accuracy * 0.20 + speed * 0.10
           + cost * 0.15 + reproducibility * 0.10
           + structuredOutput * 0.15 + automation * 0.15
```

각 축은 0-100 범위. 결과도 0-100.

---

## 문제 유형 → 도구 매핑

### 8가지 문제 유형 분류

```yaml
information_retrieval:
  keywords: ["검색", "찾기", "조회", "최신", "문서"]
  primary: WebSearch → Context7
  secondary: WebFetch
  condition:
    - 외부 라이브러리 문서 → Context7
    - 최신 뉴스/트렌드 → WebSearch
    - 특정 URL → WebFetch

analysis:
  keywords: ["분석", "리뷰", "검토", "디버깅", "조사"]
  primary: Sequential
  secondary: Grep + Read
  condition:
    - 단순 1파일 → Read 직접
    - 다중 파일 → Grep + Read
    - 복잡한 시스템 → Sequential
    - 매우 복잡한 설계 → Sequential + Context7

generation:
  keywords: ["생성", "작성", "만들기", "카피", "프롬프트"]
  primary: /implement → /build
  secondary: Context7 (프레임워크 패턴)
  condition:
    - UI 컴포넌트 → Magic + Context7
    - 백엔드 로직 → Context7 + Sequential
    - AI 프롬프트 → Sequential

code:
  keywords: ["구현", "코드", "함수", "리팩터링"]
  primary: Edit / Write
  secondary: Grep (검색) → Read (이해) → Edit (수정)
  condition:
    - 부분 수정 → Edit
    - 전체 재작성 → Write (Read 먼저)
    - 다중 파일 → 병렬 Edit

image:
  keywords: ["이미지", "사진", "비주얼", "디자인"]
  primary: Gemini API (외부)
  secondary: Magic (UI 패턴 참조)
  condition:
    - 이미지 생성 → Gemini
    - 레이아웃 참조 → Magic

deployment:
  keywords: ["배포", "deploy", "빌드", "번들"]
  primary: Bash (npm run build) → /build
  secondary: Context7 (배포 패턴)
  condition:
    - 빌드 → Bash
    - 배포 설정 → Context7

data:
  keywords: ["데이터", "DB", "쿼리", "마이그레이션"]
  primary: Bash (prisma) → Context7 (Prisma 문서)
  secondary: Read (스키마 확인)
  condition:
    - 스키마 변경 → prisma db push
    - 쿼리 패턴 → Context7

testing:
  keywords: ["테스트", "검증", "E2E", "유닛"]
  primary: Bash (tsc/lint/build)
  secondary: Playwright (E2E)
  condition:
    - 타입 체크 → tsc
    - 린트 → lint
    - 빌드 → build
    - E2E → Playwright
```

---

## 에이전트 엔진 타입별 도구 필터

> 적합성 필터의 핵심 로직. 에이전트 엔진 타입에 따라 추천 가능 도구가 달라진다.

| 엔진 타입 | 추천 가능 | 추천 금지 |
|----------|----------|----------|
| AI 엔진 (01, 03, 05, 12) | Context7, Sequential, 모든 네이티브 | - |
| 규칙 엔진 (02, 04, 06, 07, 08, 09, 10, 11) | 네이티브 도구, Context7(문서) | AI 전용 MCP, Magic(대부분) |
| 하이브리드 (03, 12) | 전체 | - |

### 에이전트별 추천 우선순위

| 에이전트 | 최적 도구 조합 | MCP 우선순위 |
|---------|-------------|-------------|
| ① Product Intelligence | Context7 + Sequential | Seq > C7 |
| ② Why Now | Read + Grep | (거의 불필요) |
| ③ Conversion Strategy | Context7 + Sequential | Seq > C7 |
| ④ Objection Killer | Read + Edit | (거의 불필요) |
| ⑤ Psychological Copy | Sequential + Context7 | Seq > C7 |
| ⑥ Trust Architecture | Read + Edit | (거의 불필요) |
| ⑦ Attention Architecture | Read + Edit | (거의 불필요) |
| ⑧ Layout Intelligence | Magic + Context7 | Magic > C7 |
| ⑨ Visual Style | Magic + Context7 | Magic > C7 |
| ⑩ Code Engine | Magic + Context7 + Playwright | Magic > C7 > Play |
| ⑪ Deploy | Context7 | C7 |
| ⑫ Learning Loop | Sequential + Context7 + Playwright | Seq > C7 > Play |

---

## Fallback 체인

> Primary 도구 실패 시 자동으로 전환되는 대체 경로.

| Primary | Fallback 1 | Fallback 2 | Last Resort |
|---------|-----------|-----------|-------------|
| Context7 | WebSearch | 직접 구현 | 사용자 문의 |
| Sequential | 직접 추론 | Read + 분석 | 사용자 문의 |
| Magic | Context7 + 직접 구현 | 기본 HTML | 사용자 문의 |
| Playwright | Bash(test:e2e) | 수동 테스트 요청 | 사용자 문의 |
| WebSearch | WebFetch(직접 URL) | Context7 | 사용자 문의 |
| Agent(Explore) | Glob + Grep | Read | 사용자 문의 |

---

## 스킬 체인 설계 패턴

> 복합 작업 시 단일 도구가 아닌 체인을 추천한다.

### 검증된 체인 패턴

```yaml
new_feature:
  chain: ["/design", "/implement", "/test", "/build"]
  best_for: "새 기능 구현"
  success_rate: "-"

quality_improvement:
  chain: ["/analyze", "/improve", "/test", "/build"]
  best_for: "코드 품질 개선"
  success_rate: "-"

bug_fix:
  chain: ["/troubleshoot", "/implement", "/test", "/build"]
  best_for: "버그 수정"
  success_rate: "-"

engine_implementation:
  chain: ["/design", "/implement", "/analyze", "/test", "/build"]
  best_for: "엔진 코드 구현"
  success_rate: "-"

ai_prompt_debugging:
  chain: ["/troubleshoot", "/implement", "/analyze", "/build"]
  best_for: "AI 프롬프트 디버깅"
  success_rate: "-"

research:
  chain: ["WebSearch", "summarize", "Sequential"]
  best_for: "경쟁사/시장 조사"
  success_rate: "-"
```

---

## 선택 기록 (자동 갱신)

| 날짜 | 요청 에이전트 | 작업 유형 | 추천 도구 | 결과 | 학습 |
|------|-------------|----------|----------|------|------|
| - | - | - | - | - | - |

### 학습된 패턴 (3회 연속 성공 → 승격)

| 패턴 | 작업 유형 | 도구 조합 | 성공 횟수 |
|------|----------|----------|----------|
| - | - | - | - |

### 회피 패턴 (3회+ 실패 → 등록)

| 패턴 | 작업 유형 | 실패 도구 | 실패 횟수 | 원인 |
|------|----------|----------|----------|------|
| - | - | - | - | - |

---

## 반성 기준

- 매 5회 추천 완료 시: 선택 기록 리뷰
- 추천 정확도 <70%: 7축 기준 가중치 재검토
- 특정 에이전트 반복 실패: 해당 에이전트 전용 매핑 재설계
- 새 문제 유형 발견: 매핑 테이블에 추가
