# 검증 체크리스트 — Attention Architecture Agent

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
- [ ] `index.ts`에서 `runAttentionArchitecture` 함수 export
- [ ] 이전 엔진 출력 타입과 입력 호환 (ProductBrief, StrategyBlueprint)
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (①③ → ⑦ → ⑧, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)

### 규칙 엔진 체크 (이 엔진은 AI 없음)
- [ ] `index.ts` 내 selectHookType, GAZE_MAP, buildZones 규칙 정의 완료 (별도 rules.ts 없음)
- [ ] 모든 규칙이 결정론적 (같은 입력 → 같은 출력)
- [ ] AI 호출 없음 확인
- [ ] 비용 0 반환

## 엔진 특화 체크

### zones 검증 (4 Zone 필수)
- [ ] `zones.length` === 4
- [ ] 4개 Zone: first_view, interest, desire, action (순서대로)
- [ ] 각 zone의 `zone` 필드가 ZoneType 유효값

### pixelRange 검증
- [ ] pixelRange 연속 (zone[i].pixelRange.end === zone[i+1].pixelRange.start)
- [ ] pixelRange 겹침 없음
- [ ] pixelRange.start < pixelRange.end (모든 zone)
- [ ] zone[0].pixelRange.start === 0

### Zone 콘텐츠 비율 검증
- [ ] 각 zone에 visualRatio, textRatio, dataRatio, ctaRatio 존재
- [ ] 각 zone에 rhythm (string), interactions (string[]), restrictions (string[]) 존재

### hookType 검증
- [ ] `hookType`이 4가지 유효값 중 하나 (visual_hook, question_hook, result_hook, social_hook)

### gazePattern 검증
- [ ] `gazePattern`이 3가지 유효값 중 하나 (f_pattern, z_pattern, center_focus)

### stickyCtaEnabled / exitIntentEnabled 검증
- [ ] boolean 타입 확인
- [ ] stickyCtaEnabled: `resistanceMap.urgency.level >= 4` OR `totalSections >= 10`
- [ ] exitIntentEnabled: `resistanceMap.price.level >= 4`

## API 라우트 구현 후

- [ ] `auth()` 호출 + 미인증 시 401
- [ ] 리소스 소유권 확인
- [ ] 필수 파라미터 + 타입 + 범위 검증
- [ ] try-catch + 적절한 HTTP 상태 코드
- [ ] 에러 메시지에 민감 정보 미포함

## UI 컴포넌트 구현 후

- [ ] 시맨틱 HTML + aria 속성
- [ ] 키보드 내비게이션
- [ ] 반응형 (모바일 < 768px, 태블릿, 데스크톱)

## DB 스키마 변경 후

- [ ] `npx prisma db push` 성공
- [ ] `npx prisma generate` 성공

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
engine: ⑦
agent: Attention Architecture Agent
timestamp: {ISO 8601}
checklist_pass_rate: {통과율}%
failed_items: [{미통과 항목 목록}]
engine_specific_results:
  zones_count_valid: {PASS|FAIL}             # zones.length === 4
  zone_names_valid: {PASS|FAIL}              # first_view, interest, desire, action 순서
  pixelRange_continuous: {PASS|FAIL}          # pixelRange 연속, 겹침 없음, start=0
  hookType_valid: {PASS|FAIL}                # visual_hook/question_hook/result_hook/social_hook
  gazePattern_valid: {PASS|FAIL}             # f_pattern/z_pattern/center_focus
  deterministic_verified: {PASS|FAIL}        # 같은 입력 → 같은 출력
---
```

## [FAIL_TRIGGER] — checklist → loop.md 발동 포맷

```
---
[FAIL_TRIGGER]
source: checklist.md
type: CHECKLIST_FAIL
engine: ⑦
checklist_pass_rate: {통과율}%
failed_items: [{미통과 항목}]
engine_specific_failures: [{실패한 엔진 특화 항목}]
timestamp: {ISO 8601}
---
```

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- memory.md의 실수 기록에서 자동 감지
- reviewer.md 검수 결과 반영: 체크리스트 보강
