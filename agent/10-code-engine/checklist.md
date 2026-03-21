# 검증 체크리스트 — Code Engine Agent

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
- [ ] `index.ts`에서 `runCodeEngine` 함수 export
- [ ] 입력 타입 (CopyBlocks, LayoutConfig, StyleConfig) 호환
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (⑩ = Image Gen 이후, ⑪ 이전, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)

### 규칙 엔진 체크 (이 엔진은 AI 없음)
- [ ] AI 호출 없음 (순수 규칙 기반)
- [ ] 렌더러 함수가 순수 함수 (side effect 없음)
- [ ] 비동기 불필요 (동기 실행)

## 엔진 특화 체크

### HTML 유효성 검증
- [ ] `fullHtml` 비어있지 않음 (길이 > 0)
- [ ] 모든 HTML 태그 정상 닫힘 (열린 태그 수 == 닫힌 태그 수)
- [ ] `<script>` 태그 없음 (보안)
- [ ] 자기 닫기 태그 (`<img/>`, `<br/>`, `<hr/>`) 올바른 형식
- [ ] `totalSections` == `sections[].length`

### XSS 이스케이프 검증
- [ ] 모든 사용자 데이터에 `esc()` 적용 (productName, headline, subheadline, body, bulletPoints[], ctaText, microCopy)
- [ ] `innerHTML` 직접 할당 없음
- [ ] 이벤트 핸들러 속성(`onclick`, `onerror` 등)에 사용자 입력 없음
- [ ] URL 속성(`href`, `src`)에 사용자 입력 시 프로토콜 검증 (javascript: 차단)

### 반응형 CSS + 스타일 검증
- [ ] `globalCss`에 미디어 쿼리 포함 (모바일 < 768px)
- [ ] `globalCss`에 폰트 패밀리 설정 (tokens.fontFamily → CSS font-family)
- [ ] DesignTokens → 인라인 스타일로 정확히 적용 (tokens.colors 참조)
- [ ] 하드코딩된 색상/폰트 없음 (tokens에서 가져와야 함)

### 이미지 URL 유효성
- [ ] 각 섹션의 이미지 URL이 유효한 형식 (https:// 시작 또는 placeholder)
- [ ] 이미지 없는 섹션에 적절한 fallback 처리
- [ ] `<img>` 태그에 `alt` 속성 존재

### patternId별 렌더러 존재
- [ ] 모든 `sections[].patternId`에 대응하는 렌더러 함수 존재
- [ ] `renderByPatternId` 함수에 매핑 누락 없음
- [ ] fallback 렌더러 존재 (매핑 안 되는 patternId 처리)

### 섹션 래퍼 속성
- [ ] 모든 섹션 래퍼에 `data-section-id="s${order}"` 속성 존재
- [ ] 모든 섹션 래퍼에 `data-section-order="${order}"` 속성 존재

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

## [HANDOFF_TO_REVIEWER] 출력 블록

> 체크리스트 완료 시 자동 생성 → reviewer.md가 수신

```yaml
[HANDOFF_TO_REVIEWER]
engine: ⑩ Code Engine
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
  html_valid: true | false              # fullHtml 비어있지않음 + 태그 닫힘 + script 없음
  xss_escaped: true | false             # 모든 사용자 데이터 esc() 적용
  style_mapping_valid: true | false     # DesignTokens → 인라인 스타일 정확 적용
  responsive_valid: true | false        # 미디어 쿼리 포함 + 모바일 적합
  section_wrapper_valid: true | false   # data-section-id + data-section-order 존재
  patternId_mapped: true | false        # 모든 patternId에 렌더러 매핑
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
engine: ⑩ Code Engine
timestamp: {ISO8601}
pass_rate: {N}%
failed_items:
  - item: {항목명}
    category: type_safety | lint | build | engine_specific
    severity: error | warning
engine_specific_failures:
  - html_valid: {상세}
  - xss_escaped: {상세}
  - style_mapping_valid: {상세}
  - responsive_valid: {상세}
  - section_wrapper_valid: {상세}
  - patternId_mapped: {상세}
  - deterministic_verified: {상세}
```

## 업데이트 규칙

- 반복 실패 패턴(3회+) 발생 시: 관련 체크 항목 추가
- memory.md의 실수 기록에서 자동 감지
- 새 엔진 특화 체크 발견 시: 해당 섹션에 추가
- reviewer.md 피드백 반영: 검수에서 발견된 미체크 항목 추가
