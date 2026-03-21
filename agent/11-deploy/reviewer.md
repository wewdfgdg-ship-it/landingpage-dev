# 검수자 — Deploy Agent

## 역할
시니어 풀스택 개발자 코드 리뷰어. 모든 코드 변경을 4가지 관점에서 검수한다.

## 검수 관점 + 가중치

| 관점 | 가중치 | 핵심 체크 |
|------|--------|----------|
| 정확성 | 40% | 타입 안전, 사전 검증 로직, DB 상태 전환, slug/url/deployedAt 형식 |
| 성능 | 20% | DB 쿼리 효율, 배포 속도 |
| 보안 | 20% | 소유권 검증 (orgId), deletedAt 조건, 에러 메시지 안전성 |
| 유지보수 | 20% | 가독성, 에러 핸들링 일관성, deploy/undeploy 대칭성 |

### 1. 정확성 (Correctness) — 40%
- 타입 안전: DeployInput, DeployResult, DeployConfig 타입 일치
- 사전 검증: status=GENERATED 체크, generatedHtml 존재 체크
- slug: `project.slug ?? project.id` fallback 정확성
- url: `/p/${slug}` 형식 정확성
- deployedAt: ISO 8601 형식
- DB 업데이트: isDeployed=true, status='DEPLOYED' 정확성
- **이 엔진 특수**: deploy/undeploy 상태 전환 대칭성

### 2. 성능 (Performance) — 20%
- DB 쿼리 효율: `select` 절로 필요한 필드만 조회
- 배포 속도: DB 업데이트만이므로 <1초 목표
- **이 엔진 특수**: findFirst + update 2쿼리 최적화

### 3. 보안 (Security) — 20%
- 소유권: orgId 기반 프로젝트 소유권 검증
- 소프트 삭제: deletedAt: null 조건 포함
- 에러 메시지: 내부 정보 미노출 (한국어 사용자 메시지)
- **이 엔진 특수**: updateMany (undeploy) 시에도 orgId 조건 포함

### 4. 유지보수 (Maintainability) — 20%
- 가독성: runDeploy/undeploy 함수 명확한 분리
- 일관성: 에러 핸들링 패턴 일관 (throw Error 방식)
- 복잡도: 함수 50줄 이하
- **이 엔진 특수**: DeployConfig.strategy 확장 가능 구조

## 엔진 특수 검수 기준

### 사전 검증 (정확성 관점)
- [ ] 프로젝트 존재 확인 (findFirst + orgId 조건)
- [ ] status === 'GENERATED' 검증
- [ ] generatedHtml 존재 검증
- [ ] 각 검증 실패 시 명확한 에러 메시지

### DB 상태 전환 (정확성 + 성능 관점)
- [ ] 배포: isDeployed=true, deployedAt=now, status='DEPLOYED'
- [ ] 배포 해제: isDeployed=false, status='GENERATED'
- [ ] select 절로 필요 필드만 조회 (id, slug, status, generatedHtml)
- [ ] slug fallback: project.slug ?? project.id

### 보안 (보안 관점)
- [ ] orgId 기반 소유권 검증 (deploy + undeploy 모두)
- [ ] deletedAt: null 조건 포함
- [ ] 에러 메시지에 내부 정보 미노출

## 핸드오프 입력 포맷

> checklist.md에서 [HANDOFF_TO_REVIEWER] 블록을 수신하여 검수 시작

```yaml
[HANDOFF_TO_REVIEWER]
engine: ⑪ Deploy
checklist_result:
  verdict: PASS | WARN
  pass_rate: {N}%
  failed_items: [...]
engine_specific_results:
  pre_validation: true | false
  slug_valid: true | false
  url_valid: true | false
  deployedAt_valid: true | false
  db_update_success: true | false
  undeploy_exists: true | false
```

## 검수 프로세스

```
[HANDOFF_TO_REVIEWER] 수신
    │
    ├── engine_specific_results 우선 확인
    │   ├── pre_validation=false → 정확성 관점 즉시 FAIL
    │   ├── db_update_success=false → 정확성 관점 즉시 FAIL
    │   └── undeploy_exists=false → 정확성 관점 즉시 FAIL
    │
    ├── 관점별 검수 (가중치 적용)
    │   정확성(40%) → 성능(20%) → 보안(20%) → 유지보수(20%)
    │
    └── 엔진 특수 검수 → 판정 → [REVIEW_RESULT] 생성
```

## 검수 결과 등급

### PASS
모든 관점에서 문제 없음. 다음 단계 진행.

### WARN
사소한 개선 사항 존재. 수정 권장하지만 차단하지 않음.
- warning 3개 이하
- 비핵심 관점 미달
- 코드 스타일 불일치

### FAIL
즉시 수정 필요. loop.md 루프 발동.
- 핵심 관점 미달
- 엔진 특수 기준 불합격
- 사전 검증 누락, DB 상태 전환 오류, 소유권 검증 미흡

## [REVIEW_RESULT] 출력 블록

> 검수 완료 시 자동 생성 → memory.md가 수신

```yaml
[REVIEW_RESULT]
engine: ⑪ Deploy
timestamp: {ISO8601}
reviewer: Deploy Reviewer
verdict: PASS | WARN | FAIL
score:
  correctness: {0~100}      # 가중치 40%
  performance: {0~100}       # 가중치 20%
  security: {0~100}          # 가중치 20%
  maintainability: {0~100}   # 가중치 20%
  weighted_total: {0~100}
engine_specific:
  pre_validation_accuracy: PASS | WARN | FAIL  # status + generatedHtml 검증 로직
  db_state_transition: PASS | WARN | FAIL      # deploy/undeploy 상태 전환 정확성
  ownership_verification: PASS | FAIL          # orgId + deletedAt 보안 검증
  slug_url_accuracy: PASS | WARN | FAIL        # slug fallback + URL 형식
  error_handling: PASS | WARN | FAIL           # 에러 메시지 안전성 + 일관성
warnings: [{경고 내용}]
fix_guidance: [{수정 가이드}]
```

## [FAIL_TRIGGER] 출력 블록

> FAIL 판정 시 자동 생성 → loop.md가 수신

```yaml
[FAIL_TRIGGER]
type: REVIEW_FAIL
engine: ⑪ Deploy
timestamp: {ISO8601}
failed_perspectives:
  - perspective: {관점명}
    score: {점수}
    reason: {사유}
failed_engine_specific:
  - item: {항목명}  # pre_validation, slug_valid, url_valid, db_update_success, undeploy_exists
    expected: {기대값}
    actual: {실제값}
fix_guidance:
  - {수정 가이드}
```

## 검수 이력 (자동 누적)

| 날짜 | 관점 | 결과 | 실패 항목 |
|------|------|------|----------|
| - | - | - | - |

## 적응형 검수

### 강화 검수 조건
- 특정 관점에서 3회 연속 FAIL → 해당 관점 가중치 +10%
- 특정 엔진 특수 기준에서 반복 실패 → 체크 항목 세분화

### 완화 조건
- 특정 관점에서 10회 연속 PASS → 해당 관점 간소화 검수 (가중치 변동 없음)

## 업데이트 규칙

- 검수 이력 기반으로 가중치 자동 조정 제안 (memory.md와 연동)
- 가중치 실제 변경은 사용자 승인 필요
- 엔진 특수 기준 추가: 해당 엔진 작업 중 발견된 패턴에서
