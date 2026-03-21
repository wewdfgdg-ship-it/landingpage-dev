# 검증 체크리스트 — Psychological Copy Agent

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
- [ ] `index.ts`에서 `runPsychologicalCopy` 함수 export
- [ ] 이전 엔진 출력 타입과 입력 호환 (ProductBrief, UrgencyBrief, StrategyBlueprint, ObjectionMap)
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (①②③④ → ⑤, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)
- [ ] 비용 추적 (`totalCost += result.cost`)
- [ ] onRetry 콜백 연결

### AI 엔진 추가 체크 (이 엔진은 AI ×1 + retry max 2)
- [ ] `prompts.ts` 시스템/유저 프롬프트 정의 (generateCopy, buildRetryPrompt)
- [ ] 시스템 프롬프트가 **한국어**로 작성됨
- [ ] JSON prefill 사용 (Claude assistant 메시지에 `{` 시작)
- [ ] 재시도 로직 (max 2, 지수 백오프)
- [ ] 비용 계산 정확 (1+N회 호출 개별 추적 + 합산, N=재시도 횟수)

### 특수 컴포넌트 체크
- [ ] `frames.ts` — 7가지 설득 프레임 정의 완료
- [ ] `tone-matrix.ts` — 9개 업종별 톤 정의 완료
- [ ] `quality-gate.ts` — THRESHOLD=80, MAX_RETRIES=2, FRAME_WEIGHT=0.6, TONE_WEIGHT=0.4

## 엔진 특화 체크

### qualityScore 검증
- [ ] 각 섹션: `combinedScore` = frameScore × 0.6 + toneScore × 0.4
- [ ] `overallScore` = 전체 섹션 combinedScore의 평균
- [ ] overallScore ≥ 80이면 PASS, 70~79이면 WARN, < 70이면 FAIL
- [ ] `passed` = failedSections.length === 0 (개별 섹션 전부 ≥ 80)

### headline 길이 검증
- [ ] 모든 섹션의 `headline` ≤ 15자
- [ ] headline이 비어있지 않음

### 섹션 완전성 검증
- [ ] strategyBlueprint.structure[]의 모든 role이 CopyBlocks.sections에 존재
- [ ] 모든 섹션의 `copy.body`가 비어있지 않음
- [ ] 모든 섹션의 `copy.bulletPoints`가 배열이고 비어있지 않음
- [ ] 모든 섹션의 `copy.ctaText`, `copy.microCopy`, `copy.imageDirection` 존재

### 톤 일관성 검증
- [ ] `tone`이 TONE_MAP의 10개 유효 키 중 하나 (saas, ecommerce, beauty, health, food, education, finance, b2b, lifestyle, other)
- [ ] 모든 섹션의 toneScore가 일정 수준 이상 (최소 50)

### 품질 게이트 재시도 검증
- [ ] 품질 게이트 FAIL 시 buildRetryPrompt가 실패 섹션만 재생성
- [ ] mergeCopy가 성공 섹션 유지 + 재생성 섹션 교체
- [ ] 재시도 횟수 MAX_RETRIES(2) 초과 방지
- [ ] onRetry(attempt, failedCount) 콜백 정상 호출 (2인자: 실패 섹션 수)

### AI 응답 파싱 검증
- [ ] AI 호출 JSON 파싱 성공
- [ ] 파싱 실패 시 재시도 로직 동작 확인
- [ ] 재시도 후에도 실패 시 적절한 에러 throw

### 비용 추적 검증
- [ ] 각 AI 호출별 입력/출력 토큰 수 기록
- [ ] `cost` = 모든 호출(1차 + 재시도) 비용 합산
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

## 핸드오프 출력 블록

### [HANDOFF_TO_REVIEWER] — checklist → reviewer.md 전달 포맷

```
---
[HANDOFF_TO_REVIEWER]
engine: ⑤
agent: Psychological Copy Agent
checklist_pass_rate: {통과율}%
failed_items: [{미통과 항목 목록}]
engine_specific_results:
  quality_score_valid: {PASS|FAIL}    # qualityScore ≥ 80
  headline_length_valid: {PASS|FAIL}  # 모든 headline ≤ 15자
  section_completeness: {PASS|FAIL}   # 모든 role 존재
  frame_valid: {PASS|FAIL}            # 7가지 유효값 검증
  tone_valid: {PASS|FAIL}             # 9가지 유효값 검증
  cost_within_limit: {PASS|FAIL}      # 총 비용 ≤ ₩500
  json_parsing_success: {PASS|FAIL}   # AI 응답 파싱 성공
  retry_logic_correct: {PASS|FAIL}    # 재시도 로직 정상
timestamp: {ISO 8601}
---
```

### [FAIL_TRIGGER] — checklist → loop.md 발동 포맷

```
---
[FAIL_TRIGGER]
source: checklist.md
type: CHECKLIST_FAIL
engine: ⑤
failed_items: [{실패 항목 목록}]
pass_rate: {통과율}%
severity: {CRITICAL|HIGH|MEDIUM}
suggested_fix: {자동 수정 가능 여부 + 방향}
timestamp: {ISO 8601}
---
```

## 부분 통과 처리 규칙

| 통과율 | 판정 | 행동 |
|--------|------|------|
| 100% | PASS | → reviewer.md |
| 80~99% | WARN | → reviewer.md + 미통과 항목 전달 |
| <80% | FAIL | → loop.md 즉시 발동 |

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- memory.md의 실수 기록에서 자동 감지
- 새 엔진 특화 체크 발견 시: 해당 섹션에 추가
- checklist 완료 시: [HANDOFF_TO_REVIEWER] 또는 [FAIL_TRIGGER] 블록 생성 필수
