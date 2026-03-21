# 검증 체크리스트 — Trust Architecture Agent

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
- [ ] `index.ts`에서 `runTrustArchitecture` 함수 export
- [ ] 이전 엔진 출력 타입과 입력 호환 (ProductBrief, StrategyBlueprint)
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (①③ → ⑥, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)

### 규칙 엔진 체크 (이 엔진은 AI 없음)
- [ ] `index.ts` 내 TRUST_TEMPLATES 6레벨 정의 완료 (별도 rules.ts 없음)
- [ ] 모든 규칙이 결정론적 (같은 입력 → 같은 출력)
- [ ] AI 호출 없음 확인
- [ ] 비용 0 반환

## 엔진 특화 체크

### trustElements 검증
- [ ] `trustElements.length` ≥ 1 (빈 배열이면 FAIL)
- [ ] 모든 `level`이 1~6 범위 (범위 초과 시 클램핑)
- [ ] 모든 `placement`가 유효한 섹션 위치
- [ ] 모든 `sectionOrder`가 strategyBlueprint.structure[] 범위 내

### trustScore 검증
- [ ] `trustScore` = `Math.round((trustElements.length / 6) * 100)` (커버리지 비율)
- [ ] `trustScore` 범위 0~100

### 6레벨 템플릿 매칭 검증
- [ ] TRUST_TEMPLATES Lv1~5 순차 생성 (건너뛰기 없음)
- [ ] Lv6(동료 압력) 활성 조건: `decisionType === 'follower'` OR `resistanceMap.trust.level >= 4`
- [ ] `selectRelevantElements`: trust 저항 ≥ 4이면 전체, 아니면 최대 2개
- [ ] `findSectionOrder`: targetRoles → blueprint.structure[] 매칭, 중복 방지(usedOrders Set)

### sectionOrder 범위 검증
- [ ] sectionOrder < strategyBlueprint.structure[].length
- [ ] sectionOrder ≥ 0

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

## [HANDOFF_TO_REVIEWER] — checklist → reviewer 전달 포맷

```
---
[HANDOFF_TO_REVIEWER]
engine: ⑥
agent: Trust Architecture Agent
timestamp: {ISO 8601}
checklist_pass_rate: {통과율}%
failed_items: [{미통과 항목 목록}]
engine_specific_results:
  trustElements_non_empty: {PASS|FAIL}       # trustElements.length ≥ 1
  level_range_valid: {PASS|FAIL}             # 모든 level 1~6 범위
  sectionOrder_range_valid: {PASS|FAIL}      # sectionOrder가 structure[] 범위 내
  trustScore_range_valid: {PASS|FAIL}        # trustScore 0~100
  rule_matching_correct: {PASS|FAIL}         # 6개 규칙 매칭 정확성
  deterministic_verified: {PASS|FAIL}        # 같은 입력 → 같은 출력
---
```

## [FAIL_TRIGGER] — checklist → loop.md 발동 포맷

```
---
[FAIL_TRIGGER]
source: checklist.md
type: CHECKLIST_FAIL
engine: ⑥
checklist_pass_rate: {통과율}%
failed_items: [{미통과 항목}]
engine_specific_failures: [{실패한 엔진 특화 항목}]
timestamp: {ISO 8601}
---
```

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- memory.md의 실수 기록에서 자동 감지
- 새 엔진 특화 체크 발견 시: 해당 섹션에 추가
- reviewer.md 검수 결과 반영: 체크리스트 보강
