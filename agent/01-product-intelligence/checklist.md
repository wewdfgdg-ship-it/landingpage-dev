# 검증 체크리스트 — Product Intelligence Agent

## 자동 실행 프로토콜

```
코드 변경 완료
    │
    ▼
1. npx tsc --noEmit → 실패 시 즉시 수정
    │
    ▼
2. npm run lint → 실패 시 즉시 수정
    │
    ▼
3. npm run build → 실패 시 원인 분석 후 수정
    │
    ▼
4. 엔진 특화 체크 → 실패 시 해당 항목만 수정
    │
    ▼
5. 전체 통과? → YES: reviewer.md로 이동
                 NO (80%+): WARN + 미통과 목록 → reviewer
                 NO (<80%): FAIL → loop.md 즉시 발동
```

## 코드 변경 후 (필수)

### 타입 안전
```bash
npx tsc --noEmit
```
- [ ] TypeScript 에러 0개
- [ ] `any` 타입 없음
- [ ] 모든 함수에 명시적 반환 타입

### 린트
```bash
npm run lint
```
- [ ] ESLint 에러 0개
- [ ] warning 5개 이하

### 빌드
```bash
npm run build
```
- [ ] 빌드 성공
- [ ] 새 warning 없음

### 코드 규칙
- [ ] import 절대경로 (`@/`) 사용
- [ ] `console.log` 없음
- [ ] `window`/`document` 직접 접근 없음 (SSR 호환)
- [ ] 한국어 UI 텍스트 (영어 금지)
- [ ] Tailwind CSS 사용 (inline style 금지)
- [ ] 서버 컴포넌트 기본 (`"use client"` 필요 시만)

## 엔진 구현 후

### 구조 체크
- [ ] `types.ts` 정의 완료 (입출력 타입)
- [ ] `index.ts`에서 `runProductIntelligence` 함수 export
- [ ] 사용자 입력(위저드) 출력 타입과 ProductIntelligenceInput 호환
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (① 최초 실행, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)
- [ ] 비용 추적 (`totalCost += result.cost`)

### AI 엔진 추가 체크 (이 엔진은 AI ×3)
- [ ] `prompts.ts` 시스템/유저 프롬프트 정의 (3개: extractProductDNA, analyzeCustomer, buildResistanceMap)
- [ ] 시스템 프롬프트가 **한국어**로 작성됨
- [ ] JSON prefill 사용 (Claude assistant 메시지에 `{` 시작)
- [ ] 재시도 로직 (max 2, 지수 백오프)
- [ ] 비용 계산 정확 (3회 호출 개별 추적 + 합산)

## 엔진 특화 체크

### confidenceScore 검증
- [ ] `confidenceScore` 범위 0~100 (범위 초과 시 Math.min(100, Math.max(0, score)) 클램핑)
- [ ] confidenceScore ≥ 70이면 PASS, 50~69이면 WARN, < 50이면 FAIL

### resistanceMap 검증
- [ ] `resistanceMap`의 5개 키 전부 존재 (price, trust, urgency, complexity, alternative)
- [ ] 각 키의 `level` 필드가 1~5 범위 (범위 초과 시 클램핑)
- [ ] 각 키의 `description` 필드가 non-null, non-empty string

### productDNA 필수 필드 검증
- [ ] `coreValue` — non-null, 10자 이상
- [ ] `uniqueSellingPoint` — non-null, 10자 이상
- [ ] `categoryPosition` — non-null
- [ ] `pricePerception` — non-null
- [ ] `brandPersonality` — non-null
- [ ] `keyBenefits` — 배열 길이 3~5개
- [ ] `emotionalHook` — non-null, 10자 이상

### customerDesire / customerFear 검증
- [ ] `primaryDesire` — non-null, non-empty
- [ ] `primaryFear` — non-null, non-empty
- [ ] `dreamOutcome` — non-null
- [ ] `worstCase` — non-null

### decisionType 검증
- [ ] 값이 `'impulse' | 'considered' | 'researched'` 중 하나

### AI 응답 파싱 검증
- [ ] 3개 AI 호출 모두 JSON 파싱 성공
- [ ] 파싱 실패 시 재시도 로직 동작 확인
- [ ] 재시도 후에도 실패 시 적절한 에러 throw

### 비용 추적 검증
- [ ] 각 AI 호출별 입력/출력 토큰 수 기록
- [ ] `totalCost` = 3회 호출 비용 합산
- [ ] 총 비용 ₩500 이하 (초과 시 경고)

## API 라우트 구현 후

- [ ] `auth()` 호출 + 미인증 시 401
- [ ] 리소스 소유권 확인
- [ ] 필수 파라미터 + 타입 + 범위 검증
- [ ] try-catch + 적절한 HTTP 상태 코드
- [ ] 에러 메시지에 민감 정보 미포함
- [ ] 응답 타입 정의 + JSON 직렬화 확인

## UI 컴포넌트 구현 후

- [ ] 시맨틱 HTML + aria 속성
- [ ] 키보드 내비게이션
- [ ] 반응형 (모바일 < 768px, 태블릿, 데스크톱)
- [ ] 불필요한 리렌더 없음
- [ ] next/image 사용

## DB 스키마 변경 후

- [ ] `npx prisma db push` 성공
- [ ] `npx prisma generate` 성공
- [ ] 기존 데이터 호환
- [ ] 인덱스 추가 (자주 조회 필드)

## 부분 통과 처리 규칙

| 통과율 | 판정 | 행동 |
|--------|------|------|
| 100% | PASS | → reviewer.md (HANDOFF_TO_REVIEWER 전달) |
| 80~99% | WARN | → reviewer.md (HANDOFF_TO_REVIEWER + 미통과 목록 전달) |
| <80% | FAIL | → loop.md 즉시 발동 (FAIL_TRIGGER 전달) |

## 핸드오프 포맷

### → reviewer.md 전달 (PASS/WARN)

```
---
[HANDOFF_TO_REVIEWER]
source: checklist.md
timestamp: {ISO 날짜}
pass_rate: {통과율}%
verdict: PASS | WARN

tsc_result: ✅ 에러 0 | ❌ 에러 N개
lint_result: ✅ 에러 0, 경고 N | ❌ 에러 N개
build_result: ✅ 성공 | ❌ 실패

engine_checks:
  confidenceScore: ✅ | ❌ {값}
  resistanceMap: ✅ | ❌ {누락 키}
  productDNA: ✅ | ❌ {null 필드}
  keyBenefits: ✅ | ❌ {길이}
  decisionType: ✅ | ❌ {값}
  ai_parsing: ✅ | ❌ {실패 함수}
  cost_tracking: ✅ | ❌ {총 비용}

failed_items: [미통과 항목 리스트] (WARN 시만)
changed_files: [변경된 파일 경로 리스트]
---
```

### → loop.md 전달 (FAIL)

```
---
[FAIL_TRIGGER]
source: checklist.md
timestamp: {ISO 날짜}
pass_rate: {통과율}%

errors:
  - type: tsc | lint | build | engine_check
    detail: {에러 메시지}
    file: {파일 경로}
    line: {라인 번호} (가능한 경우)

changed_files: [변경된 파일 경로 리스트]
---
```

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- memory.md의 실수 기록에서 자동 감지
- 새 엔진 특화 체크 발견 시: 해당 섹션에 추가
