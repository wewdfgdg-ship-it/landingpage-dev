# 검증 체크리스트 — Learning Loop Agent

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
- [ ] `index.ts`에서 `runLearningLoop` 함수 export
- [ ] 입력 타입 (TrackingMetrics) 호환
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (⑫ = ⑪ 이후, 비동기 실행, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)
- [ ] 비용 추적 (`totalCost += result.cost`)

### AI 엔진 추가 체크 (이 엔진은 AI ×1 + 규칙)
- [ ] `prompts.ts` 시스템/유저 프롬프트 정의 (1개: diagnoseMetrics)
- [ ] 시스템 프롬프트가 **한국어**로 작성됨
- [ ] JSON prefill 사용 (Claude assistant 메시지에 `{` 시작)
- [ ] 재시도 로직 (max 2, 지수 백오프)
- [ ] 비용 계산 정확 (1회 호출 추적)

## 엔진 특화 체크

### DiagnosisType 유효값 검증
- [ ] `type` 필드가 유효값 중 하나 ('high_bounce' | 'low_scroll' | 'weak_cta' | 'slow_section' | 'drop_off' | 'low_engagement')
- [ ] `severity` 필드가 4단계 중 하나 ('critical' | 'high' | 'medium' | 'low')
- [ ] `description` 필드가 non-null, non-empty
- [ ] `evidence` 필드가 non-null (근거 데이터 포함)

### Prescription level 검증
- [ ] `level` 필드가 1-3 범위
- [ ] **Level 3에 `requiresApproval: true` 설정** (필수)
- [ ] `diagnosisId`가 유효한 진단 ID에 연결
- [ ] `action` 필드가 non-null, 구체적 행동 서술

### A/B 테스트 검증
- [ ] `variant` 필드가 'A' | 'B'
- [ ] `status` 필드가 'running' | 'completed' | 'cancelled'
- [ ] `pValue` 계산 시 통계적 유의성 로직 정확 (p < 0.05)
- [ ] `sampleSize` 최소값 확인 (500+)
- [ ] 동일 섹션에 동시 테스트 2개 이상 방지 로직

### 진단 임계값 합리성
- [ ] bounceRate 임계값 합리적 (기본 70%)
- [ ] scrollDepth 임계값 합리적 (기본 p50 < 30%)
- [ ] CTA 클릭률 임계값 합리적 (기본 < 2%)
- [ ] dwellTime 임계값 합리적 (기본 < 2초)
- [ ] 전환율 임계값 합리적 (기본 < 1%)

### Level 3 사용자 승인 게이트
- [ ] Level 3 처방 생성 시 `requiresApproval: true` 필수
- [ ] 승인 없이 Level 3 자동 적용 방지 로직 존재
- [ ] 사용자 승인 UI/API 연결 (또는 placeholder)

### WinningPattern 검증
- [ ] `testId`가 완료된(completed) ABTest ID에 연결
- [ ] `impact` 필드에 측정된 수치 포함
- [ ] `applicableContext`가 구체적 (재사용 가능 맥락)

### AI 응답 파싱 검증
- [ ] AI 호출 JSON 파싱 성공
- [ ] 파싱 실패 시 재시도 로직 동작 확인
- [ ] 재시도 후에도 실패 시 규칙 기반 진단으로 fallback

### 비용 추적 검증
- [ ] AI 호출 입력/출력 토큰 수 기록
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

## 자동 핸드오프 블록

### [HANDOFF_TO_REVIEWER]

> 체크리스트 완료 시 자동 생성 → reviewer.md로 전달

```yaml
type: CHECKLIST_RESULT
engine: ⑫ Learning Loop
timestamp: <ISO 8601>
pass_rate: <통과율 %>
total_items: <전체 항목 수>
passed_items: <통과 항목 수>
failed_items:
  - item: "<실패 항목>"
    details: "<상세>"
engine_specific_results:
  diagnosis_valid: <boolean>        # DiagnosisType + severity 유효값
  prescription_valid: <boolean>     # level 1-3 범위 + diagnosisId 연결
  ab_test_valid: <boolean>          # p-value 로직 + 샘플 크기 + 동시 테스트 방지
  threshold_valid: <boolean>        # 진단 임계값 합리성 (5개 항목)
  level3_gate_valid: <boolean>      # Level 3 requiresApproval: true 필수
  ai_parsing_valid: <boolean>       # JSON 파싱 성공 + fallback 동작
  cost_tracked: <boolean>           # 토큰 수 기록 + ₩500 이하
judgment: PASS | WARN | FAIL
```

### [FAIL_TRIGGER]

> 통과율 < 80% 시 자동 생성 → loop.md로 전달

```yaml
type: CHECKLIST_FAIL
engine: ⑫ Learning Loop
timestamp: <ISO 8601>
pass_rate: <통과율 %>
failed_items:
  - item: "<실패 항목>"
    details: "<상세>"
engine_specific_failures:
  diagnosis_valid: <false 시 상세>
  prescription_valid: <false 시 상세>
  ab_test_valid: <false 시 상세>
  threshold_valid: <false 시 상세>
  level3_gate_valid: <false 시 상세>
  ai_parsing_valid: <false 시 상세>
  cost_tracked: <false 시 상세>
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
- reviewer.md 피드백에서 체크 항목 보강 (검수 결과 반영)
