# 스킬 라우팅 — 문제유형 → 스킬 매핑 엔진

> 핵심: **미리 찾아놓고, 막힐 때 꺼내 쓴다.**
> Tool Intelligence가 사전에 스킬을 탐색·등록하고, 에이전트는 세션 시작 시 자기 스킬을 미리 파악한다.
> Tool Intelligence가 skill-catalog.md 갱신 시 이 파일도 동기화한다.

---

## 사용 프로토콜 (2-Phase)

### Phase 1: 사전 준비 (세션 시작 시)

```
에이전트 세션 시작
    │
    ▼
1. skill-catalog.md 스캔
   └── 내 엔진 번호가 for_agents에 포함된 스킬 필터
   └── status=active or trial 만 대상
    │
    ▼
2. 아래 에이전트별 자동 확인 태그로 추가 매칭
    │
    ▼
3. 내 스킬 목록 인지 완료
   └── 스킬별 trigger_when, best_use, avoid_use 숙지
   └── 관련 skill-chains.md 체인도 확인
```

### Phase 2: 즉시 사용 (작업 중)

```
작업 중 스킬이 필요한 상황 발생
    │
    ▼
1. Phase 1에서 파악한 내 스킬 목록에서 매칭
   └── trigger_when 조건과 현재 상황 비교
   └── 문제 유형 분류 (아래 매트릭스) → 매핑 스킬 확인
    │
    ▼
2. 매칭 스킬 있음 → 즉시 사용
   └── 후보 2개+ → 7축 평가로 최종 선택
    │
    ▼
3. 매칭 스킬 없음 → Fallback 전략 실행
   └── skill-catalog.md 전체 재검색
   └── 그래도 없으면 → "해결 불가" 기록 → Tool Intelligence 트리거
    │
    ▼
4. 사용 완료 → skill-feedback.md에 결과 기록
```

---

## 문제 유형 분류

| 유형 | 키워드/상황 | 예시 |
|------|-----------|------|
| 정보 검색 | 최신 정보, 공식 문서, 경쟁사, 트렌드 | "React 19 변경사항이 뭐지?" |
| 분석 | 원인 파악, 패턴 분석, 품질 평가 | "왜 이 컴포넌트가 느린지 모르겠다" |
| 생성 | 카피, 콘텐츠, 전략, 구조화 텍스트 | "설득력 있는 CTA 문구 필요" |
| 코드 | 구현, 리팩토링, 타입, API | "이 API 라우트 어떻게 짜지?" |
| 이미지 | 이미지 생성, 프롬프트, 스타일 | "섹션 배경 이미지 필요" |
| 배포 | 빌드, 배포, 인프라, CI/CD | "Vercel 배포가 실패한다" |
| 데이터 | 구조화, 변환, 집계, 정제 | "JSON 데이터를 테이블로 변환" |
| 테스트 | E2E, 단위, 성능, 시각적 | "이 폼 플로우 E2E 테스트 필요" |

---

## 문제 유형 → 스킬 매핑

> `SK-NNN`은 skill-catalog.md의 등록 ID. 등록 전에는 도구명으로 표기.

### 정보 검색

```
if 외부 라이브러리 문서 필요
  → Context7 (resolve-library-id → get-library-docs)

if 최신 웹 정보/트렌드 필요
  → WebSearch

if 특정 URL 내용 확인
  → WebFetch
```

### 분석

```
if 복잡한 다단계 분석 (복잡도 >0.7)
  → Sequential (--seq)

if 단순 코드 분석 (1~3 파일)
  → Read + Grep 직접 판단

if 성능 분석 + 실측 필요
  → Sequential + Playwright (--seq --play)
```

### 생성

```
if 심리적 카피/설득 문구
  → (skill-catalog에서 tags: [copywriting, persuasion] 매칭)

if UI 컴포넌트 생성
  → Magic (--magic)

if 일반 텍스트 생성
  → 직접 생성 (스킬 불필요)
```

### 코드

```
if 프레임워크 패턴 참조 필요
  → Context7 (--c7)

if 복잡한 로직 설계
  → Sequential (--seq)

if UI 컴포넌트 코드
  → Magic + Context7 (--magic --c7)
```

### 이미지

```
if 이미지 프롬프트 생성
  → (skill-catalog에서 tags: [image, prompt] 매칭)

if 이미지 생성
  → Gemini API (프로젝트 내장)
```

### 배포

```
if 빌드/배포 실패 분석
  → Sequential (--seq)

if 인프라 설정
  → Context7 (--c7) + WebSearch
```

### 데이터

```
if 구조화 데이터 변환
  → (skill-catalog에서 tags: [data, transform] 매칭)

if 데이터 분석
  → Sequential (--seq)
```

### 테스트

```
if E2E 테스트
  → Playwright (--play)

if 테스트 전략 설계
  → Sequential (--seq)
```

---

## 선택 평가 기준 (7축)

> 매핑 후보가 2개 이상일 때 아래 기준으로 최종 선택한다.

| 기준 | 가중치 | 판단 방법 |
|------|--------|----------|
| 최신성 | 15% | 최신 정보가 필요한가? → 검색 스킬 우선 |
| 정확성 | 20% | 높은 정확도가 필요한가? → accuracy: high 우선 |
| 속도 | 10% | 빠른 응답이 필요한가? → speed: fast 우선 |
| 비용 | 15% | 비용 제약이 있나? → cost_per_use 낮은 것 우선 |
| 재현성 | 10% | 같은 입력에 같은 결과? → reliability: high 우선 |
| 구조화 출력 | 15% | 정형화된 출력 필요? → output_format 확인 |
| 자동화 연결 | 15% | 다음 스킬/엔진에 바로 연결? → 체인 호환성 확인 |

### 평가 예시

```
상황: "경쟁사 랜딩페이지 분석 필요"
유형: 정보 검색 + 분석

후보 A: WebSearch → 최신성 ✅, 정확성 △, 구조화 ❌
후보 B: browser_mcp → 최신성 ✅, 정확성 ✅, 구조화 △
후보 C: Context7 → 최신성 ❌ (경쟁사 정보 없음)

→ 선택: 후보 A (WebSearch) + Sequential로 구조화 분석
```

---

## Fallback 전략

> primary 실패 시 자동으로 다음 단계를 시도한다.

| 문제 유형 | Primary | Secondary | 최종 대안 |
|----------|---------|-----------|----------|
| 정보 검색 | Context7 | WebSearch | 직접 구현 |
| 분석 | Sequential | 직접 추론 | 사용자에게 질문 |
| 생성 (카피) | 전용 스킬 | 직접 생성 | 사용자 입력 요청 |
| 코드 | Context7 + Magic | Context7 단독 | 직접 구현 |
| 이미지 | 전용 스킬 | Gemini 직접 | placeholder |
| 배포 | Sequential | WebSearch | 사용자에게 보고 |
| 데이터 | 전용 스킬 | 직접 변환 | 사용자 입력 |
| 테스트 | Playwright | Bash(test) | 수동 확인 요청 |

### Fallback 실행 규칙

```
1차 스킬 실패
    │
    ├── alternative 있음 (skill-catalog.md 참조)
    │   → 2차 스킬 시도
    │   → 실패 시 3차 (최종 대안)
    │
    └── alternative 없음
        → "해결 불가" → skill-feedback.md에 기록
        → Tool Intelligence 탐색 트리거 발동
```

---

## 스킬 체인 참조

> 단일 스킬보다 체인이 효과적인 경우 skill-chains.md를 참조한다.

```
에이전트 판단:
  "이 작업이 다단계인가?"
    ├── YES → skill-chains.md에서 매칭 체인 확인
    │         있으면 체인 실행 / 없으면 단일 스킬
    └── NO  → 단일 스킬 선택
```

---

## 에이전트별 자동 확인 태그

> 각 에이전트는 작업 시작 시 자기 태그에 해당하는 active 스킬을 자동 인지한다.

| 엔진 | 자동 확인 태그 |
|------|-------------|
| ① Product Intelligence | product-analysis, research, market |
| ② Why Now | urgency, timing, trigger |
| ③ Conversion Strategy | conversion, strategy, funnel |
| ④ Objection Killer | objection, persuasion, counter |
| ⑤ Psychological Copy | copywriting, persuasion, psychology, korean |
| ⑥ Trust Architecture | trust, social-proof, credibility |
| ⑦ Attention Architecture | attention, visual-hierarchy, hook |
| ⑧ Layout Intelligence | layout, grid, responsive, pattern |
| ⑨ Visual Style | style, color, typography, mood |
| ⑩ Code Engine | nextjs, component, tailwind, html |
| ⑪ Deploy | deploy, vercel, cdn, domain |
| ⑫ Learning Loop | analytics, ab-test, optimization, tracking |

---

## 업데이트 규칙

- skill-catalog.md에 새 스킬 등록 시: 해당 문제 유형 매핑에 추가
- skill-feedback.md 실패 3건+ 누적 시: fallback 체인 재검토
- skill-chains.md에 새 체인 등록 시: 체인 참조 섹션 갱신
- 새 문제 유형 발견 시: 분류 매트릭스에 추가
