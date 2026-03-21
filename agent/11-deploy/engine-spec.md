# 엔진 스펙 — Deploy Agent

## 담당 엔진

- **번호**: ⑪
- **이름**: Deploy
- **경로**: `src/engine/11-deploy/`
- **AI/규칙**: 규칙 엔진 (AI 없음)
- **핵심 함수**: `runDeploy(input: DeployInput): Promise<DeployResult>`
- **보조 함수**: `undeploy(projectId: string, orgId: string): Promise<void>`

## 입력 타입

```typescript
// DeployInput — index.ts에서 인라인 정의
interface DeployInput {
  projectId: string;  // 프로젝트 ID
  orgId: string;      // 조직 ID (소유권 검증)
}

// DeployConfig — types.ts 정의
interface DeployConfig {
  strategy: 'internal'; // 향후 'r2' | 'custom_domain' 추가
}
```

**입력 제공**: 파이프라인 (projectId, orgId). generatedHtml은 DB에서 직접 조회.

## 출력 타입

```typescript
interface DeployResult {
  slug: string;         // 프로젝트 slug (project.slug ?? project.id)
  url: string;          // 공개 URL (상대 경로: /p/{slug})
  deployedAt: string;   // ISO 8601 형식 (예: "2026-03-09T12:00:00.000Z")
}
```

**출력 수신 엔진**: ⑫ Learning Loop

## 특수 컴포넌트

### 배포 프로세스 (DB 상태 전환 방식)

| 단계 | 처리 | 설명 |
|------|------|------|
| 1 | DB 조회 | `db.project.findFirst({ id, orgId, deletedAt: null })` — 프로젝트 존재 + 소유권 확인 |
| 2 | 상태 검증 | `project.status !== 'GENERATED'` → 에러, `!project.generatedHtml` → 에러 |
| 3 | DB 업데이트 | `isDeployed=true, deployedAt=now, status='DEPLOYED'` |
| 4 | URL 생성 | `slug = project.slug ?? project.id` → `url = /p/${slug}` |

### slug 규칙
- DB에 이미 저장된 `project.slug` 사용 (없으면 `project.id` fallback)
- slug 생성 로직은 이 엔진에 없음 (프로젝트 생성 시 결정)

### undeploy 함수
- `undeploy(projectId, orgId): Promise<void>`
- `isDeployed=false, status='GENERATED'`로 되돌림
- `db.project.updateMany` 사용 (소유권 조건 포함)

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| 파이프라인 | projectId | DeployInput.projectId | 직접 매핑 |
| 파이프라인 | orgId | DeployInput.orgId | 직접 매핑 |

> ⑩ Code Engine의 GeneratedPage는 직접 전달되지 않음. generatedHtml은 파이프라인에서 DB에 저장된 후, 이 엔진에서 DB 조회로 확인.

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| ⑫ Learning Loop | DeployResult.slug | LearningLoopInput.slug (페이지 식별) | 직접 매핑 |
| ⑫ Learning Loop | DeployResult.url | LearningLoopInput.pageUrl (트래킹 대상) | 직접 매핑 |

## 출력 품질 기준

### 합격 기준
- `slug` 비어있지 않음 (project.slug 또는 project.id)
- `url` `/p/{slug}` 형식
- `deployedAt` ISO 8601 형식
- DB 상태 업데이트 성공 (isDeployed=true, status='DEPLOYED')
- 사전 검증 통과 (status=GENERATED, generatedHtml 존재)

### 경고 기준
- slug가 project.id fallback 사용 (slug 미설정)
- DB 응답 지연 (>2초)

### 불합격 기준
- `slug` 빈 문자열
- `url` 빈 문자열
- `deployedAt` ISO 형식 위반
- DB 업데이트 실패
- 사전 검증 실패 (status≠GENERATED, generatedHtml 없음)

## 전체 파이프라인 타입 요약

| 엔진 | 출력 타입 | 핵심 필드 |
|------|----------|----------|
| ① Product Intelligence | ProductBrief | productDNA, customerDesire, resistanceMap |
| ② Why Now | UrgencyBrief | primaryType, urgencyElements |
| ③ Conversion Strategy | StrategyBlueprint | strategyType, structure[], ctaPositions |
| ④ Objection Killer | ObjectionMap | activeObjections[] |
| ⑤ Psychological Copy | CopyBlocks | sections[].copy, qualityScore |
| ⑥ Trust Architecture | TrustConfig | trustElements[], trustScore |
| ⑦ Attention Architecture | AttentionConfig | zones[], hookType, gazePattern |
| ⑧ Layout Intelligence | LayoutConfig | sections[].selectedPattern |
| ⑨ Visual Style | StyleConfig | mood, tokens (DesignTokens) |
| Image Gen | ImageGenerationOutput | images[].cdnUrl |
| ⑩ Code Engine | GeneratedPage | fullHtml, sections[].html |
| ⑪ Deploy | DeployResult | slug, url |
| ⑫ Learning Loop | LearningLoopOutput | diagnoses[], prescriptions[] |
| Bridge | CrossEngineBridgeResult | enrichedCopy, enrichedLayout |

## 체크리스트 앵커 (checklist.md 연동)

| # | 항목 | 검증 방법 | 실패 시 |
|---|------|----------|---------|
| 1 | 사전 검증 로직 | status=GENERATED 체크 + generatedHtml 존재 체크 | 즉시 수정 |
| 2 | slug 비어있지 않음 | `project.slug ?? project.id` 결과 확인 | loop.md (DB 조회 실패 루프) |
| 3 | url `/p/{slug}` 형식 | slug 기반 상대 URL 생성 확인 | 즉시 수정 |
| 4 | deployedAt ISO 8601 UTC | `new Date().toISOString()` 형식 | 즉시 수정 |
| 5 | DB 상태 업데이트 성공 | isDeployed=true, status='DEPLOYED', deployedAt 설정 | loop.md (DB 업데이트 실패 루프) |
| 6 | 소유권 검증 | orgId 기반 프로젝트 소유권 확인 | 즉시 수정 |
| 7 | undeploy 기능 | isDeployed=false, status='GENERATED' 복원 | 즉시 수정 |
| 8 | AI 호출 없음 | 규칙 + DB 기반 | 즉시 수정 |
| 9 | tsc/lint/build 통과 | npx tsc --noEmit, npm run lint, npm run build | 즉시 수정 후 재검증 |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정
- 인접 엔진 타입 변경 시: 호환 매핑 재확인
- 체크리스트 앵커 변경 시: checklist.md와 동기화
