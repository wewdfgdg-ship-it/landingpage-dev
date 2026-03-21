# 검증 체크리스트 — Why Now Agent

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
- [ ] `index.ts`에서 `runWhyNow` 함수 export
- [ ] ① ProductBrief 출력 타입과 WhyNowInput 호환
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (② = ① 직후, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)
- [ ] 비용 추적 (₩0 고정, 규칙 엔진)

### 규칙 엔진 추가 체크 (이 엔진은 AI 없음)
- [ ] `rules.ts`에 규칙 매핑 테이블 정의
- [ ] 모든 urgency type이 string 상수로 관리
- [ ] 순수 함수: 부작용 없음, 동일 입력 → 동일 출력
- [ ] 기본값 fallback 존재 (매핑 실패 시)

## 엔진 특화 체크

### primaryType 검증
- [ ] `primaryType`이 5가지 유효값 중 하나 ('season' | 'trend' | 'scarcity' | 'price' | 'social_proof')
- [ ] `secondaryType`이 null 또는 5가지 유효값 중 하나
- [ ] `primaryType !== secondaryType` (동일 타입 방지)

### ctaUrgencyLevel 검증
- [ ] `ctaUrgencyLevel` 범위 1~5 (범위 초과 시 Math.min(5, Math.max(1, level)) 클램핑)
- [ ] 정수값만 허용 (Math.round 적용)

### urgencyElements 검증
- [ ] `urgencyElements.length` ≥ 1 (빈 배열 금지)
- [ ] 각 element의 `type`이 5가지 유효값 중 하나
- [ ] 각 element의 `intensity`가 1~5 범위
- [ ] 각 element의 `message`가 non-null, non-empty string (한국어)
- [ ] 각 element의 `applicableSections`가 non-empty 배열

### placement 검증
- [ ] `placement.hero` — boolean
- [ ] `placement.cta` — boolean
- [ ] `placement.footer` — boolean
- [ ] `placement.floating` — boolean

### 순수 함수 검증
- [ ] 외부 상태 접근 없음 (DB, API, 파일시스템)
- [ ] Date.now() 등 비결정적 호출 없음
- [ ] 매핑 테이블 변경 없음 (읽기만)

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
| 100% | PASS | → reviewer.md |
| 80~99% | WARN | → reviewer.md + 미통과 항목 전달 |
| <80% | FAIL | → loop.md 즉시 발동 |

## 핸드오프 포맷

### PASS/WARN → reviewer.md

```markdown
---
[HANDOFF_TO_REVIEWER]
engine: ②
agent: Why Now Agent
pass_rate: 95%
verdict: PASS | WARN
results:
  tsc: ✅ 에러 0
  lint: ✅ 에러 0, 경고 1
  build: ✅ 성공
  engine_checks:
    primaryType_valid: ✅
    ctaUrgencyLevel_range: ✅
    urgencyElements_nonempty: ✅
    placement_boolean: ✅
    pure_function: ✅
    constants_managed: ✅
failed_items: []
changed_files:
  - src/engine/02-why-now/types.ts
  - src/engine/02-why-now/rules.ts
  - src/engine/02-why-now/index.ts
---
```

### FAIL → loop.md

```markdown
---
[FAIL_TRIGGER]
source: checklist
engine: ②
agent: Why Now Agent
pass_rate: 70%
errors:
  - type: TYPE_ERROR
    detail: "TS2345: UrgencyType에 'urgency' 할당 불가"
    file: src/engine/02-why-now/rules.ts
    line: 42
  - type: ENGINE_CHECK
    detail: "ctaUrgencyLevel 범위 초과 (값: 7)"
    file: src/engine/02-why-now/index.ts
    line: 88
changed_files:
  - src/engine/02-why-now/rules.ts
  - src/engine/02-why-now/index.ts
---
```

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- memory.md의 실수 기록에서 자동 감지
- 새 엔진 특화 체크 발견 시: 해당 섹션에 추가
