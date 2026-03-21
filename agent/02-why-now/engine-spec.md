# 엔진 스펙 — Why Now Agent

## 담당 엔진

- **번호**: ②
- **이름**: Why Now
- **경로**: `src/engine/02-why-now/`
- **AI/규칙**: 규칙 엔진 (AI 없음, 비용 $0)
- **핵심 함수**: `runWhyNow(brief: ProductBrief, industry: string, priceRange: string): UrgencyBrief`

## 입력 타입

```typescript
// ProductBrief는 ① Product Intelligence 출력 (전체 타입은 01-product-intelligence/types.ts 참조)
// 이 엔진이 사용하는 필드:
interface WhyNowInput {
  brief: ProductBrief;       // ①의 전체 출력
  industry: string;          // 산업군 (예: 화장품, 전자기기, 식품, 패션, 교육)
  priceRange: string;        // 가격대 (예: 저가, 중가, 고가, 프리미엄)
}
```

**입력 제공 엔진**: ① Product Intelligence — ProductBrief + 파이프라인 컨텍스트(industry, priceRange)

## 출력 타입

```typescript
interface UrgencyBrief {
  primaryType: UrgencyType;           // 주요 긴급성 유형
  secondaryType: UrgencyType | null;  // 보조 긴급성 유형 (없으면 null)
  urgencyElements: UrgencyElement[];  // 긴급성 요소 배열 (1개 이상)
  ctaUrgencyLevel: number;            // CTA 긴급도 레벨 (1~5)
  placement: UrgencyPlacement;        // 긴급성 배치 위치
}

type UrgencyType = 'season' | 'trend' | 'scarcity' | 'price' | 'social_proof';

interface UrgencyElement {
  type: UrgencyType;                  // 긴급성 유형
  message: string;                    // 긴급성 메시지 (한국어)
  intensity: number;                  // 강도 (1~5)
  applicableSections: string[];       // 적용 가능 섹션 타입
}

interface UrgencyPlacement {
  hero: boolean;                      // 히어로 섹션에 배치 여부
  cta: boolean;                       // CTA 근처에 배치 여부
  footer: boolean;                    // 푸터에 배치 여부
  floating: boolean;                  // 플로팅 배너로 배치 여부
}
```

**출력 수신 엔진**: ③ Conversion Strategy

## 특수 컴포넌트

### rules.ts — 규칙 엔진 (AI 호출 없음)

| 함수 | 입력 | 출력 | 비용 |
|------|------|------|------|
| `determineUrgencyType` | brief.marketContext, industry | primaryType, secondaryType | ₩0 |
| `buildUrgencyElements` | brief, industry, priceRange, urgencyTypes | urgencyElements[] | ₩0 |
| `calculateCtaUrgencyLevel` | urgencyElements, brief.resistanceMap | ctaUrgencyLevel (1~5) | ₩0 |
| `determinePlacement` | primaryType, ctaUrgencyLevel | UrgencyPlacement | ₩0 |

**총 예상 비용**: ₩0/회 (규칙 엔진, AI 호출 없음)

### 호출 순서 (의존관계)
```
determineUrgencyType (brief.marketContext + industry)
    │
    ▼ primaryType, secondaryType 결과 전달
buildUrgencyElements (brief + industry + priceRange + urgencyTypes)
    │
    ▼ urgencyElements[] 전달
calculateCtaUrgencyLevel (urgencyElements + brief.resistanceMap)
    │
    ▼ ctaUrgencyLevel 전달
determinePlacement (primaryType + ctaUrgencyLevel)
    │
    ▼ 최종 UrgencyBrief 조립
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ① ProductBrief | productDNA | brief.productDNA | 직접 매핑 |
| ① ProductBrief | marketContext | brief.marketContext | 직접 매핑 |
| ① ProductBrief | resistanceMap | brief.resistanceMap | 직접 매핑 |
| ① ProductBrief | decisionType | brief.decisionType | 직접 매핑 |
| 파이프라인 컨텍스트 | industry | industry | 직접 매핑 |
| 파이프라인 컨텍스트 | priceRange | priceRange | 직접 매핑 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| ③ Conversion Strategy | UrgencyBrief 전체 | StrategyInput.urgencyBrief | 직접 매핑 |

## 출력 품질 기준

### 합격 기준
- `urgencyElements.length` ≥ 1
- `ctaUrgencyLevel` 1~5 범위
- `primaryType`이 5가지 유효값 중 하나 ('season' | 'trend' | 'scarcity' | 'price' | 'social_proof')
- `placement`의 모든 필드가 boolean
- 모든 `urgencyElements[].intensity`가 1~5 범위

### 경고 기준
- `urgencyElements.length` = 1 (최소 기준, 다양성 부족)
- `secondaryType`이 null (보조 긴급성 없음)
- `ctaUrgencyLevel` = 1 (매우 낮은 긴급도)

### 불합격 기준
- `urgencyElements` 빈 배열
- `ctaUrgencyLevel` 범위 초과 (< 1 또는 > 5)
- `primaryType`이 5가지 유효값에 포함되지 않음
- `urgencyElements[].intensity` 범위 초과

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

> 이 파일의 품질 기준은 checklist.md의 검증 항목으로 자동 반영된다.

| 이 파일 기준 | checklist.md 항목 | 자동 검증 |
|-------------|-------------------|----------|
| urgencyElements.length ≥ 1 | urgencyElements 검증 | 빈 배열 체크 |
| ctaUrgencyLevel 1~5 | ctaUrgencyLevel 검증 | Math.min/max 로직 존재 |
| primaryType 5가지 유효값 | primaryType 검증 | 타입 리터럴 매칭 |
| intensity 1~5 범위 | urgencyElements 검증 | 클램핑 로직 존재 |
| placement 모든 필드 boolean | placement 검증 | 타입 체크 |
| 순수 함수 | 순수 함수 검증 | 부작용/비결정 호출 없음 |
| UrgencyBrief 완전성 | 구조 체크 | 모든 필수 필드 존재 |

> 이 파일에 새 품질 기준 추가 시 checklist.md에도 검증 항목 추가 여부를 검토한다.

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영 + **checklist.md 동기화 필수**
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정
- 인접 엔진 타입 변경 시: 호환 매핑 재확인
