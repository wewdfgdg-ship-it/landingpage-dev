# 검증 체크리스트 — Layout Intelligence Agent

## 자동 실행 프로토콜

```
코드 변경 완료 → tsc → lint → build → 엔진 특화 체크 → 판정
```

## 코드 변경 후 (필수)

### 타입 안전
- [ ] TypeScript 에러 0개
- [ ] `any` 타입 없음
- [ ] 모든 함수에 명시적 반환 타입

### 린트
- [ ] ESLint 에러 0개
- [ ] warning 5개 이하

### 빌드
- [ ] 빌드 성공

### 코드 규칙
- [ ] import 절대경로 (`@/`) 사용
- [ ] `console.log` 없음
- [ ] 한국어 UI 텍스트

## 엔진 구현 후

### 구조 체크
- [ ] `types.ts` 정의 완료
- [ ] `index.ts`에서 `runLayoutIntelligence` 함수 export
- [ ] 이전 엔진 출력 타입과 입력 호환

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (①③⑦ → ⑧)

### 규칙 엔진 체크
- [ ] `index.ts` 내 PATTERNS (42개), ROLE_CATEGORY_MAP, scorePattern, getZoneForOrder 정의 완료 (별도 rules.ts 없음)
- [ ] AI 호출 없음 확인
- [ ] 비용 0 반환

## 엔진 특화 체크

### patternId 유효성 검증
- [ ] 모든 `selectedPattern`이 index.ts PATTERNS[] 배열에 존재하는 유효 ID
- [ ] 미존재 패턴 사용 시 FAIL

### SectionLayout 출력 구조 검증
- [ ] 각 섹션에 order, role, sectionType, selectedPattern, patternName, score, reasoning 존재

### diversityScore 검증
- [ ] `diversityScore` 범위 0~100
- [ ] 공식: `Math.round((uniquePatterns.size / sections.length) × 100)`
- [ ] diversityScore ≥ 60이면 PASS
- [ ] diversityScore 40~59이면 WARN
- [ ] diversityScore < 40이면 FAIL

### mobileReadyScore 검증
- [ ] `mobileReadyScore` 범위 0~100
- [ ] 공식: 전체 섹션 패턴 mobileScore 평균
- [ ] mobileReadyScore ≥ 70이면 PASS
- [ ] mobileReadyScore 50~69이면 WARN

## 부분 통과 처리 규칙

| 통과율 | 판정 | 행동 |
|--------|------|------|
| 100% | PASS | → reviewer.md |
| 80~99% | WARN | → reviewer.md + 미통과 항목 전달 |
| <80% | FAIL | → loop.md 즉시 발동 |

## [HANDOFF_TO_REVIEWER] 출력 블록

> 체크리스트 완료 시 자동 생성 → reviewer.md가 수신

```yaml
[HANDOFF_TO_REVIEWER]
engine: ⑧ Layout Intelligence
timestamp: {ISO8601}
checklist_result:
  total_items: {N}
  passed: {N}
  failed: {N}
  pass_rate: {N}%
  verdict: PASS | WARN | FAIL
failed_items:
  - {실패한 체크 항목 이름}
engine_specific_results:
  patternId_valid: true | false        # 모든 selectedPattern이 PATTERNS[]에 존재
  sectionLayout_valid: true | false    # SectionLayout 필드 완전성
  diversityScore_valid: true | false    # diversityScore ≥ 60
  mobileReadyScore_valid: true | false  # mobileReadyScore ≥ 70
  deterministic_verified: true | false  # 같은 입력 → 같은 출력
code_snapshot:
  changed_files: [{파일 경로}]
  tsc_errors: {N}
  lint_errors: {N}
  build_success: true | false
```

## [FAIL_TRIGGER] 출력 블록

> 통과율 <80% 시 자동 생성 → loop.md가 수신

```yaml
[FAIL_TRIGGER]
type: CHECKLIST_FAIL
engine: ⑧ Layout Intelligence
timestamp: {ISO8601}
pass_rate: {N}%
failed_items:
  - item: {항목명}
    category: type_safety | lint | build | engine_specific
    severity: error | warning
engine_specific_failures:
  - patternId_valid: {상세}
  - sectionLayout_valid: {상세}
  - diversityScore_valid: {상세}
  - mobileReadyScore_valid: {상세}
  - deterministic_verified: {상세}
```

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- reviewer.md 피드백 반영: 검수에서 발견된 미체크 항목 추가
