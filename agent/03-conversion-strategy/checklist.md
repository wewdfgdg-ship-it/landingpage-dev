# 검증 체크리스트 — Conversion Strategy Agent

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
- [ ] `index.ts`에서 `runConversionStrategy` 함수 export
- [ ] ① ProductBrief, ② UrgencyBrief 출력 타입과 ConversionStrategyInput 호환
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (③ = ②직후, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)
- [ ] 비용 추적 (`totalCost += result.cost`)

### AI 엔진 추가 체크 (이 엔진은 AI ×1 + 규칙)
- [ ] `prompts.ts` 시스템/유저 프롬프트 정의 (1개: generateStructure)
- [ ] 시스템 프롬프트가 **한국어**로 작성됨
- [ ] JSON prefill 사용 (Claude assistant 메시지에 `{` 시작)
- [ ] 전략 유형 5가지가 프롬프트에 명확히 정의됨
- [ ] 재시도 로직 (max 2, 지수 백오프)
- [ ] 비용 계산 정확 (1회 호출 추적)

## 엔진 특화 체크

### strategyType 검증
- [ ] `strategyType`이 5가지 유효값 중 하나 ('direct_sale' | 'lead_generation' | 'free_trial' | 'content_hook' | 'event_registration')

### structure 배열 검증
- [ ] `structure.length` > 0 (빈 배열 금지)
- [ ] `totalSections` = structure.length (일치)
- [ ] `totalSections` 5~16 범위
- [ ] 모든 `structure[].role`이 SectionRole 7가지 유효값 중 하나 ('HOOK' | 'PAIN' | 'SOLUTION' | 'PROOF' | 'OBJECTION' | 'URGENCY' | 'CTA')
- [ ] 모든 `structure[].sectionType`이 non-null, non-empty string
- [ ] 모든 `structure[].purpose`가 non-null, non-empty string (한국어)
- [ ] `structure[].order`가 1부터 시작하는 연속 번호

### ctaPositions 검증
- [ ] `ctaPositions`의 모든 값이 0 ~ totalSections-1 범위
- [ ] `ctaPositions.length` ≥ 1 (최소 1개 CTA)
- [ ] 중복 인덱스 없음

### 메트릭 검증
- [ ] `estimatedScrollDepth` non-empty string (예: "5400px")
- [ ] `targetReadTime` non-empty string (예: "5분")

### AI 응답 파싱 검증
- [ ] AI 호출의 JSON 파싱 성공
- [ ] 파싱 실패 시 재시도 로직 동작 확인
- [ ] 재시도 후에도 실패 시 규칙 기반 fallback 또는 적절한 에러 throw

### 비용 추적 검증
- [ ] AI 호출별 입력/출력 토큰 수 기록
- [ ] `cost` = 1회 호출 비용
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
| 100% | PASS | → reviewer.md |
| 80~99% | WARN | → reviewer.md + 미통과 항목 전달 |
| <80% | FAIL | → loop.md 즉시 발동 |

## 검수 핸드오프 블록

### checklist.md → reviewer.md 전달 포맷

```
---
[HANDOFF_TO_REVIEWER]
source: checklist.md
timestamp: {ISO 날짜}
verdict: PASS | WARN | FAIL
pass_rate: {통과율}%
failed_items: [{미통과 항목 리스트}]
engine_specific_results:
  strategyType_valid: true|false
  structure_valid: true|false
  ctaPositions_valid: true|false
  metrics_valid: true|false
  ai_parsing_valid: true|false
  cost_within_limit: true|false
---
```

### FAIL 시 loop.md 발동 포맷

```
---
[FAIL_TRIGGER]
source: checklist.md
timestamp: {ISO 날짜}
trigger_type: CHECKLIST_FAIL
pass_rate: {통과율}%
failed_items: [{실패 항목들}]
error_messages: [{tsc/lint/build 에러 메시지}]
suggested_fix: {자동 분석된 수정 방향}
---
```

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- memory.md의 실수 기록에서 자동 감지
- 새 엔진 특화 체크 발견 시: 해당 섹션에 추가
