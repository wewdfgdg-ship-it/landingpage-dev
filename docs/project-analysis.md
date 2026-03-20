# 프로젝트 분석 보고서

> 분석일: 2026-03-20 | 총 소스파일: 163개 TS/TSX

---

## 1. 프로젝트 현황 요약

| 카테고리 | 완성도 | 파일 수 | 총 라인 |
|----------|--------|---------|---------|
| 12엔진 파이프라인 | **100%** | 20+ | ~2,884L |
| API Routes | **100%** | 28+ | — |
| DB 스키마 (Prisma) | **100%** | 22+ 모델 | — |
| 대시보드 페이지 | **70%** | 7 페이지 | ~2,118L |
| 컴포넌트 | **95%** | 32+ | ~3,639L |
| Zustand 스토어 | **50%** | 4 | — |
| 라이브러리 (lib/) | **90%** | 15 | ~1,488L |
| E2E 테스트 | **30%** | 3 | 235L |

**전체 구현율: ~90%**

---

## 2. 구현 완료 영역

### 12엔진 파이프라인 (100%)
모든 엔진 `index.ts` + `types.ts` 구현 완료. `pipeline.ts`에서 순차 실행.

| 엔진 | AI 사용 | 추가 파일 |
|------|---------|-----------|
| 01-product-intelligence | Claude ×3 | — |
| 02-why-now | 규칙 기반 | — |
| 03-conversion-strategy | Claude ×1 | — |
| 04-objection-killer | 규칙 기반 | — |
| 05-psychological-copy | Claude + 재시도 | `quality-gate.ts`, `tone-matrix.ts`, `frames.ts` |
| 06-trust-architecture | 규칙 기반 | — |
| 07-attention-architecture | 규칙 기반 | — |
| 08-layout-intelligence | 규칙 기반 (42패턴) | — |
| 09-visual-style | 규칙 기반 | — |
| 10-code-engine | HTML/CSS 생성 | `renderers.ts` |
| 11-deploy | 배포 기록 | — |
| 12-learning-loop | 분석+진단 | `tracking-script.ts` |
| image-generation | Gemini | — |

추가: `cross-engine-bridge.ts` (엔진간 데이터 통합), `pipeline.ts` (순차 실행)

### API Routes (28+개, 100%)
- 프로젝트 CRUD, 생성(동기/SSE), 배포, 미리보기
- 분석, 진단, A/B 테스트
- 결제(구독/크레딧/쿠폰/환불), 웹훅
- 관리자(플랜/쿠폰/크레딧)
- Cron(구독만료/일일진단/사용량알림)
- 위자드, 트래킹, 업로드, 인증

### 대시보드 페이지 (완성된 것)
| 페이지 | 라인 | 상태 |
|--------|------|------|
| admin | 738L | ✅ 완성 |
| billing | 568L | ✅ 완성 |
| projects/[id] | 422L | ✅ 완성 |
| projects/[id]/editor | 199L | ✅ 완성 |
| projects/new | 174L | ✅ 완성 |

### 라이브러리 (lib/)
- `billing.ts` (299L), `payapp.ts` (240L), `email.ts` (230L), `credit.ts` (221L) — 완성
- `vercel.ts`, `coupon.ts`, `queue.ts`, `sse.ts`, `r2.ts` — 완성
- `auth.ts` + `auth.config.ts`, `db.ts`, `admin.ts` — 완성
- `ai/claude.ts`, `ai/gemini.ts`, `ai/types.ts` — 완성

### Zustand 스토어 (완성된 것)
- `wizard-store.ts` (5,206B) — 4단계 위자드 상태 관리
- `editor-store.ts` (4,926B) — 섹션 편집 상태 관리

---

## 3. 미구현/스텁 영역

### 높은 우선순위
| 파일 | 현황 | 필요 작업 |
|------|------|-----------|
| `(dashboard)/projects/page.tsx` | **10줄 스텁** | 프로젝트 목록 카드 그리드, 검색/필터, 상태 뱃지 |
| `(dashboard)/settings/page.tsx` | **7줄 스텁** | 프로필 수정, 조직 관리, 알림 설정 |

### 중간 우선순위
| 파일 | 현황 | 필요 작업 |
|------|------|-----------|
| `stores/project-store.ts` | **1줄 (주석)** | 프로젝트 목록 fetch, CRUD, 필터 상태 |
| `stores/ui-store.ts` | **1줄 (주석)** | 사이드바 토글, 모달, 토스트 상태 |
| `lib/analytics.ts` | **1줄 (주석)** | 트래킹 유틸, 집계 쿼리, 전환율 계산 |
| 엔진 `rules.ts` ×12 | **미존재** | CLAUDE.md 규칙: 각 엔진에 rules.ts 필요 |
| 엔진 `prompts.ts` ×12 | **미존재** | CLAUDE.md 규칙: 각 엔진에 prompts.ts 필요 |
| `lib/utils.ts` | **6줄** | 공통 유틸리티 함수 |

### 낮은 우선순위
| 파일 | 현황 | 필요 작업 |
|------|------|-----------|
| `12-learning-loop/index.ts:457` | `'hero_weak'` 하드코딩 | 동적 진단 타입 |
| E2E 테스트 (3파일, 235L) | 기본 구조만 | 핵심 플로우 테스트 보강 |

---

## 4. 세션 분할 계획

> 1세션 = 1커밋+푸시, 컨텍스트 윈도우 50% 이내

### 세션 1: 프로젝트 목록 페이지 + Zustand 스토어 구현
**목표:** 대시보드 진입 시 가장 먼저 보이는 빈 페이지 해결

- `(dashboard)/projects/page.tsx` — 프로젝트 카드 그리드, 상태(생성중/완료/배포됨) 뱃지, 검색·정렬 기능
- `stores/project-store.ts` — 프로젝트 목록 fetch, 필터링, 로딩 상태
- `stores/ui-store.ts` — 사이드바 토글, 모달 열림/닫힘, 토스트 알림

**예상 파일:** 3개 수정 | **난이도:** 중

---

### 세션 2: 설정 페이지 + analytics 유틸 구현
**목표:** 나머지 빈 페이지 + 분석 인프라 기초

- `(dashboard)/settings/page.tsx` — 프로필 수정(이름/이미지), 조직 설정, 플랜 정보 표시
- `lib/analytics.ts` — 이벤트 트래킹 헬퍼, 일별 집계 쿼리, 전환율·이탈률 계산 함수
- `lib/utils.ts` — cn() 함수, 날짜 포맷, 숫자 포맷 등 공통 유틸

**예상 파일:** 3개 수정 | **난이도:** 중

---

### 세션 3: 엔진 rules.ts 추출 (01~06)
**목표:** CLAUDE.md 구조 규칙 준수 — 비즈니스 규칙을 rules.ts로 분리

- 엔진 01~06의 `index.ts`에서 상수/설정/매핑 테이블을 `rules.ts`로 추출
- `index.ts`에서 `rules.ts` import로 변경

**예상 파일:** 6개 생성 + 6개 수정 | **난이도:** 중

---

### 세션 4: 엔진 rules.ts 추출 (07~12)
**목표:** 나머지 엔진 rules.ts 분리

- 엔진 07~12 동일 작업
- 12-learning-loop의 `'hero_weak'` 하드코딩 → 동적 진단 타입으로 수정

**예상 파일:** 6개 생성 + 6개 수정 | **난이도:** 중

---

### 세션 5: 엔진 prompts.ts 추출 (01~06)
**목표:** AI 프롬프트를 prompts.ts로 분리

- AI 사용 엔진 (01, 03, 05)의 인라인 프롬프트 → `prompts.ts`로 추출
- 비AI 엔진 (02, 04, 06)은 빈 `prompts.ts` 생성 (구조 통일)

**예상 파일:** 6개 생성 + 3개 수정 | **난이도:** 중

---

### 세션 6: 엔진 prompts.ts 추출 (07~12)
**목표:** 나머지 엔진 prompts.ts 분리

- image-generation의 Gemini 프롬프트도 prompts.ts로 분리
- 비AI 엔진은 빈 prompts.ts

**예상 파일:** 7개 생성 + 1~2개 수정 | **난이도:** 중

---

### 세션 7: 에디터 기능 보강
**목표:** 에디터 UX 개선

- `editor/page.tsx` (199L) — 섹션 드래그 앤 드롭 정렬
- `edit-panel.tsx` ↔ `preview-panel.tsx` 실시간 양방향 연동 강화
- `section-list.tsx` — 섹션 추가/삭제/복제 기능

**예상 파일:** 3~4개 수정 | **난이도:** 고

---

### 세션 8: E2E 테스트 보강
**목표:** 핵심 사용자 플로우 테스트 커버

- `e2e/landing.spec.ts` (92L) — 랜딩페이지 렌더링 테스트 보강
- 프로젝트 생성 플로우 테스트 신규 작성
- 대시보드 네비게이션 테스트

**예상 파일:** 3~5개 수정/생성 | **난이도:** 중

---

### 세션 9: 린트·타입 정리
**목표:** 빌드 품질 개선

- `npx tsc --noEmit` 에러 0개 달성
- `npm run lint` 경고 정리
- non-null assertion (`!`) → 안전한 패턴으로 교체

**예상 파일:** 다수 소규모 수정 | **난이도:** 저

---

### 세션 10: 최종 QA + 배포 점검
**목표:** 프로덕션 준비 완료

- `npm run build` 성공 확인
- 환경변수 누락 체크
- Vercel/Railway 배포 설정 검증
- 전체 통합 테스트

**예상 파일:** 최소 수정 | **난이도:** 저

---

## 5. 추천 실행 순서

```
세션 1 (목록 페이지) → 세션 2 (설정+유틸) → 세션 3~4 (rules) → 세션 5~6 (prompts) → 세션 7 (에디터) → 세션 8 (테스트) → 세션 9 (린트) → 세션 10 (QA)
```

**이유:** 사용자에게 보이는 빈 페이지(세션 1~2)부터 해결 → 내부 구조 정리(세션 3~6) → 기능 보강(세션 7) → 품질(세션 8~10)
