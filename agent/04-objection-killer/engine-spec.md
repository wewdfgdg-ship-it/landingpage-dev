# 엔진 스펙 — Objection Killer Agent

## 담당 엔진

- **번호**: ④
- **이름**: Objection Killer
- **경로**: `src/engine/04-objection-killer/`
- **AI/규칙**: 규칙 엔진 (AI 없음, 비용 $0)
- **핵심 함수**: `runObjectionKiller(brief: ProductBrief, strategyBlueprint: StrategyBlueprint): ObjectionMap`

## 입력 타입

```typescript
interface ObjectionKillerInput {
  brief: ProductBrief;                    // ①의 전체 출력
  strategyBlueprint: StrategyBlueprint;   // ③의 전체 출력
}
```

**입력 제공 엔진**: ① Product Intelligence (ProductBrief), ③ Conversion Strategy (StrategyBlueprint)

## 출력 타입

```typescript
interface ObjectionMap {
  activeObjections: ObjectionStrategy[];  // 활성 반론 배열
}

type ObjectionType = 'price' | 'trust' | 'need' | 'urgency' | 'complexity';

interface ObjectionStrategy {
  type: ObjectionType;                    // 반론 유형
  level: number;                          // 저항 강도 (3~5, 활성화 임계값 3)
  strategies: string[];                   // 대응 전략 목록 (예: 'daily_split', 'roi_calculator')
  injectAt: string[];                     // 주입 위치 배열 (형식: "section_N_type")
  copyDirection: string;                  // 카피 방향 가이드 (한국어)
}
```

**출력 수신 엔진**: Cross-Engine Bridge (→ ⑤ Psychological Copy에 주입)

## 특수 컴포넌트

### rules.ts — 규칙 엔진 (AI 호출 없음)

| 함수 | 입력 | 출력 | 비용 |
|------|------|------|------|
| `identifyActiveObjections` | brief.resistanceMap | ObjectionType + level 목록 | ₩0 |
| `generateStrategies` | objectionType, level, brief.productDNA | strategies[] | ₩0 |
| `determineInjectionPoints` | activeObjections, strategyBlueprint.structure | injectAt 매핑 | ₩0 |

**총 예상 비용**: ₩0/회 (규칙 엔진, AI 호출 없음)

### 호출 순서 (의존관계)
```
identifyActiveObjections (brief.resistanceMap → level 기반 필터링)
    │
    ▼ ObjectionType + level 목록 전달
generateStrategies (각 objection에 대응 전략 생성)
    │
    ▼ strategies[] 전달
determineInjectionPoints (structure[]에서 적절한 주입 위치 매핑)
    │
    ▼ 최종 ObjectionMap 조립
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ① ProductBrief | resistanceMap | brief.resistanceMap | 직접 매핑 |
| ① ProductBrief | productDNA | brief.productDNA | 직접 매핑 (전략 생성용) |
| ① ProductBrief | customerDesire | brief.customerDesire | 직접 매핑 (전략 생성용) |
| ③ StrategyBlueprint | structure[] | strategyBlueprint.structure | 직접 매핑 |
| ③ StrategyBlueprint | totalSections | strategyBlueprint.totalSections | 직접 매핑 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| Cross-Engine Bridge | ObjectionMap 전체 | BridgeInput.objectionMap | 직접 매핑 |
| (→ ⑤ Psychological Copy) | activeObjections[].strategies, .injectAt | Copy 섹션별 반론 가이드 | Bridge가 매핑 |

## 출력 품질 기준

### 합격 기준
- `activeObjections[].level`이 3~5 범위 (활성화 임계값 3)
- `activeObjections[].strategies`가 비어있지 않음 (각 반론에 최소 1개 전략)
- `activeObjections[].type`이 5가지 유효값 중 하나
- `activeObjections[].injectAt` 배열의 각 항목이 "section_N_type" 형식 (N은 양수 정수)
- `activeObjections[].copyDirection`이 non-null, non-empty string

### 경고 기준
- `activeObjections.length` = 0 (저항이 모두 낮아 활성 반론 없음 — 정상일 수 있음)
- `activeObjections[].strategies.length` = 1 (대응 전략이 단일 — 다양성 부족)

### 불합격 기준
- `activeObjections[].type`이 5가지 유효값에 포함되지 않음
- `activeObjections[].level` 범위 초과 (< 3 또는 > 5)
- `activeObjections[].strategies` 빈 배열
- `activeObjections[].injectAt` 형식이 유효하지 않음

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

## 체크리스트 연동 앵커

| 품질 기준 | checklist.md 항목 | FAIL 시 |
|----------|------------------|---------|
| ObjectionType 유효값 | 엔진 특화 체크 → ObjectionType 검증 | [FAIL_TRIGGER] → loop.md |
| level 1~5 범위 | 엔진 특화 체크 → level 검증 | [FAIL_TRIGGER] → loop.md |
| strategies 비어있지 않음 | 엔진 특화 체크 → strategies 검증 | [FAIL_TRIGGER] → loop.md |
| injectAt 형식 규격 | 엔진 특화 체크 → injectAt 검증 | [FAIL_TRIGGER] → loop.md |
| 순수 함수 검증 | 엔진 특화 체크 → 순수 함수 검증 | [FAIL_TRIGGER] → loop.md |
| 상수 관리 | 엔진 특화 체크 → 상수 관리 | WARN → reviewer.md |
| tsc/lint/build | 필수 체크 | [FAIL_TRIGGER] → loop.md |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정
- 인접 엔진 타입 변경 시: 호환 매핑 재확인
