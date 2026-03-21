# 검증 체크리스트 — Visual Style Agent

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
- [ ] `index.ts`에서 `runVisualStyle` 함수 export
- [ ] 이전 엔진 출력 타입과 입력 호환

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (① → ⑨)

### 규칙 엔진 체크
- [ ] `index.ts` 내 MOOD_DEFS 10종 프리셋 + INDUSTRY_MOOD_MAP + adjustByPositioning 규칙 정의 완료 (별도 mood-presets.ts/rules.ts 없음)
- [ ] AI 호출 없음 확인
- [ ] 비용 0 반환

## 엔진 특화 체크

### mood 유효값 검증 (MoodPreset)
- [ ] `mood`가 10종 유효값 중 하나
- [ ] 10종: luxury, clean, tech, natural, fun_pop, professional, startup, premium, bold, minimal

### colors (ColorPalette) 12색 검증
- [ ] `primary` — non-null, 유효한 hex
- [ ] `primaryLight` — non-null, 유효한 hex
- [ ] `primaryDark` — non-null, 유효한 hex
- [ ] `secondary` — non-null, 유효한 hex
- [ ] `accent` — non-null, 유효한 hex
- [ ] `background` — non-null, 유효한 hex
- [ ] `surface` — non-null, 유효한 hex
- [ ] `textPrimary` — non-null, 유효한 hex
- [ ] `textSecondary` — non-null, 유효한 hex
- [ ] `textMuted` — non-null, 유효한 hex
- [ ] `border` — non-null, 유효한 hex
- [ ] `error` — non-null, 유효한 hex

### typography (TypographyScale) 9레벨 검증
- [ ] display, h1, h2, h3, h4, body, small, caption, button 전부 정의
- [ ] 각 레벨에 size(string), weight(number), lineHeight(string) 존재

### spacing (SpacingScale) 6단계 검증
- [ ] xs, sm, md, lg, xl, '2xl' 전부 정의 (number 타입)

### fontFamily (FontFamily) 검증
- [ ] `fontFamily`가 'sans' | 'serif' | 'mono' 중 하나

### radius (RadiusScale) 검증
- [ ] none, sm, md, lg, xl, full 6단계 전부 정의 (number 타입)

### defaultShadow (ShadowLevel) 검증
- [ ] `defaultShadow`가 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'inner' 중 하나

### sectionPadding 검증
- [ ] `sectionPadding` string 타입, 비어있지 않음

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
engine: ⑨ Visual Style
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
  mood_valid: true | false              # 10종 유효값 중 하나
  colors_complete: true | false         # 12색 전부 정의 + 유효 hex
  typography_complete: true | false     # 9레벨 전부 정의
  spacing_complete: true | false        # 6단계 전부 정의
  fontFamily_valid: true | false        # 3종 중 하나
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
engine: ⑨ Visual Style
timestamp: {ISO8601}
pass_rate: {N}%
failed_items:
  - item: {항목명}
    category: type_safety | lint | build | engine_specific
    severity: error | warning
engine_specific_failures:
  - mood_valid: {상세}
  - colors_complete: {상세}
  - typography_complete: {상세}
  - spacing_complete: {상세}
  - fontFamily_valid: {상세}
  - deterministic_verified: {상세}
```

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- reviewer.md 피드백 반영: 검수에서 발견된 미체크 항목 추가
