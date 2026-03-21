# 검증 체크리스트 — Deploy Agent

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
- [ ] `types.ts` 정의 완료 (DeployResult, DeployConfig)
- [ ] `index.ts`에서 `runDeploy`, `undeploy` 함수 export
- [ ] `index.ts`에서 DeployInput 인터페이스 정의 (projectId, orgId)
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (⑪ = ⑩ 이후, ⑫ 이전, workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)

### 규칙 엔진 체크 (이 엔진은 AI 없음)
- [ ] AI 호출 없음 (순수 DB 기반)
- [ ] 비동기 처리 적절 (DB 조회 + 업데이트)
- [ ] Prisma client (`@/lib/db`) 사용

## 엔진 특화 체크

### 사전 검증
- [ ] 프로젝트 존재 확인 (`db.project.findFirst` + orgId 조건)
- [ ] `deletedAt: null` 조건 포함 (소프트 삭제 제외)
- [ ] `project.status === 'GENERATED'` 체크
- [ ] `project.generatedHtml` 존재 체크
- [ ] 각 검증 실패 시 명확한 한국어 에러 메시지

### slug + url 검증
- [ ] slug: `project.slug ?? project.id` fallback 로직
- [ ] slug 비어있지 않음
- [ ] url: `/p/${slug}` 형식
- [ ] url 비어있지 않음

### deployedAt 검증
- [ ] deployedAt ISO 8601 형식 (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- [ ] UTC 타임존 사용

### DB 상태 업데이트 검증
- [ ] 배포: `isDeployed=true, deployedAt=now, status='DEPLOYED'` 업데이트
- [ ] `db.project.update` 사용 (where: { id: projectId })
- [ ] DeployResult 올바르게 반환 (slug, url, deployedAt)

### undeploy 검증
- [ ] undeploy 함수 존재
- [ ] `isDeployed=false, status='GENERATED'` 복원
- [ ] `db.project.updateMany` 사용 (orgId + deletedAt 조건 포함)
- [ ] 반환 타입 `Promise<void>`

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

## [HANDOFF_TO_REVIEWER] 출력 블록

> 체크리스트 완료 시 자동 생성 → reviewer.md가 수신

```yaml
[HANDOFF_TO_REVIEWER]
engine: ⑪ Deploy
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
  pre_validation: true | false          # status=GENERATED + generatedHtml 존재 + orgId 검증
  slug_valid: true | false              # slug 비어있지 않음 (project.slug ?? project.id)
  url_valid: true | false               # /p/{slug} 형식
  deployedAt_valid: true | false        # ISO 8601 UTC
  db_update_success: true | false       # isDeployed=true, status='DEPLOYED' 업데이트 성공
  undeploy_exists: true | false         # undeploy 함수 존재 + 정상 동작
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
engine: ⑪ Deploy
timestamp: {ISO8601}
pass_rate: {N}%
failed_items:
  - item: {항목명}
    category: type_safety | lint | build | engine_specific
    severity: error | warning
engine_specific_failures:
  - pre_validation: {상세}
  - slug_valid: {상세}
  - url_valid: {상세}
  - deployedAt_valid: {상세}
  - db_update_success: {상세}
  - undeploy_exists: {상세}
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
- reviewer.md 피드백 반영: 검수에서 발견된 미체크 항목 추가
