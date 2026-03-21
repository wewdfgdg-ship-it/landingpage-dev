# 검증 체크리스트 — Objection Killer Agent

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
- [ ] `index.ts`에서 `runObjectionKiller` 함수 export
- [ ] ① ProductBrief, ③ StrategyBlueprint 출력 타입과 ObjectionKillerInput 호환
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (④ = ③ 직후, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)
- [ ] 비용 추적 (₩0 고정, 규칙 엔진)

### 규칙 엔진 추가 체크 (이 엔진은 AI 없음)
- [ ] `rules.ts`에 규칙 매핑 테이블 정의
- [ ] 모든 objection type이 string 상수로 관리
- [ ] 순수 함수: 부작용 없음, 동일 입력 → 동일 출력
- [ ] 기본값 fallback 존재 (매핑 실패 시)

## 엔진 특화 체크

### ObjectionType 검증
- [ ] 모든 `activeObjections[].type`이 5가지 유효값 중 하나 ('price' | 'trust' | 'need' | 'urgency' | 'complexity')
- [ ] resistanceMap 키 → ObjectionType 매핑이 정확 (특히 alternative → need)

### level 검증
- [ ] 모든 `activeObjections[].level`이 1~5 범위 (클램핑 로직 존재)
- [ ] level ≥ 3인 것만 activeObjections에 포함

### strategies 검증
- [ ] 모든 `activeObjections[].strategies`가 비어있지 않음 (최소 1개)
- [ ] 각 strategy의 `approach`가 non-null, non-empty string (한국어)
- [ ] 각 strategy의 `copyDirection`이 non-null, non-empty string (한국어)
- [ ] 각 strategy의 `priority`가 양수 정수

### injectAt 검증
- [ ] 모든 `activeObjections[].injectAt` 형식이 "section_N_type"
- [ ] N이 1 ~ totalSections 범위
- [ ] type이 해당 섹션의 실제 sectionType과 일치
- [ ] 매핑 우선순위: OBJECTION role > PROOF role > 기타 (fallback)

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

## 핸드오프 출력 블록

### [HANDOFF_TO_REVIEWER] — checklist → reviewer.md 전달

```
---
[HANDOFF_TO_REVIEWER]
source: checklist.md
timestamp: {ISO 날짜}
pass_rate: {통과율 %}
judgement: PASS | WARN | FAIL
failed_items: [{미통과 항목 리스트}]
engine_specific_results:
  objection_type_valid: true/false
  level_range_valid: true/false
  strategies_non_empty: true/false
  inject_at_format_valid: true/false
  pure_function_verified: true/false
  constants_managed: true/false
---
```

### [FAIL_TRIGGER] — checklist FAIL 시 loop.md 즉시 발동

```
---
[FAIL_TRIGGER]
source: checklist.md
type: CHECKLIST_FAIL
timestamp: {ISO 날짜}
pass_rate: {통과율 %}
failed_items: [{미통과 항목}]
attempted_fix: false
---
```

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- memory.md의 실수 기록에서 자동 감지
- 새 엔진 특화 체크 발견 시: 해당 섹션에 추가
- checklist.md에 관련 체크 항목 추가 검토
