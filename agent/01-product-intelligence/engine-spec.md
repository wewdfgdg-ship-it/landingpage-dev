# 엔진 스펙 — Product Intelligence Agent

## 담당 엔진

- **번호**: ①
- **이름**: Product Intelligence
- **경로**: `src/engine/01-product-intelligence/`
- **AI/규칙**: Claude Sonnet ×3
- **핵심 함수**: `runProductIntelligence(input: ProductIntelligenceInput): Promise<{ brief: ProductBrief; totalCost: number }>`

## 입력 타입

```typescript
interface ProductIntelligenceInput {
  basicInfo: {
    productName: string;        // 제품명
    category: string;           // 카테고리 (예: 화장품, 전자기기, 식품)
    price: number;              // 가격 (원)
    targetAudience: string;     // 타겟 고객 (예: 20대 여성, 직장인)
    productUrl?: string;        // 제품 URL (선택)
    brandName?: string;         // 브랜드명 (선택)
    shortDescription?: string;  // 한줄 설명 (선택)
  };
  images: string[];             // 제품 이미지 URL 배열 (0~10개)
  deepAnswers: {
    questionId: string;         // 질문 ID
    question: string;           // 질문 내용
    answer: string;             // 사용자 답변
  }[];                          // 심층 질문 답변 (최소 1개)
}
```

**입력 제공 엔진**: 사용자 입력 (위저드 3단계) — 파이프라인 외부 입력

## 출력 타입

```typescript
interface ProductBrief {
  productDNA: {
    coreValue: string;          // 핵심 가치 제안
    uniqueSellingPoint: string; // USP (차별화 포인트)
    categoryPosition: string;   // 카테고리 내 포지셔닝
    pricePerception: string;    // 가격 인식 (프리미엄/합리적/저가)
    brandPersonality: string;   // 브랜드 성격
    keyBenefits: string[];      // 핵심 혜택 (3~5개)
    emotionalHook: string;      // 감성 후킹 포인트
  };
  customerDesire: {
    primaryDesire: string;      // 1차 욕구
    secondaryDesires: string[]; // 2차 욕구들
    dreamOutcome: string;       // 꿈꾸는 결과
    triggerMoment: string;      // 구매 트리거 순간
  };
  customerFear: {
    primaryFear: string;        // 1차 공포
    secondaryFears: string[];   // 2차 공포들
    worstCase: string;          // 최악의 시나리오
    statusQuoRisk: string;      // 현 상태 유지 위험
  };
  resistanceMap: {
    price: { level: number; description: string };       // 가격 저항 (1~5)
    trust: { level: number; description: string };       // 신뢰 저항 (1~5)
    urgency: { level: number; description: string };     // 긴급성 저항 (1~5)
    complexity: { level: number; description: string };  // 복잡성 저항 (1~5)
    alternative: { level: number; description: string }; // 대안 저항 (1~5)
  };
  decisionType: 'impulse' | 'considered' | 'researched'; // 의사결정 유형
  marketContext: {
    seasonality: string;        // 시즌성 (연중/시즌/이벤트)
    trendAlignment: string;     // 트렌드 부합도
    competitiveLandscape: string; // 경쟁 환경
    marketMaturity: string;     // 시장 성숙도
  };
  confidenceScore: number;      // 신뢰도 점수 (0~100)
}
```

**출력 수신 엔진**: ② Why Now, ③ Conversion Strategy, ⑤ Psychological Copy

## 특수 컴포넌트

### prompts.ts — 3개 AI 호출 프롬프트

| 함수 | AI 호출 | 입력 | 출력 | 예상 비용 |
|------|---------|------|------|----------|
| `extractProductDNA` | Claude Sonnet 1회 | basicInfo + images + deepAnswers | productDNA + decisionType + marketContext | ~₩50-80 |
| `analyzeCustomer` | Claude Sonnet 1회 | basicInfo + deepAnswers + productDNA | customerDesire + customerFear | ~₩40-60 |
| `buildResistanceMap` | Claude Sonnet 1회 | basicInfo + productDNA + customerDesire + customerFear | resistanceMap + confidenceScore | ~₩30-50 |

**총 예상 비용**: ₩120-190/회 (3 AI 호출 합산)

### 호출 순서 (의존관계)
```
extractProductDNA (독립)
    │
    ▼ productDNA 결과 전달
analyzeCustomer (productDNA 필요)
    │
    ▼ customerDesire + customerFear 전달
buildResistanceMap (productDNA + customerDesire + customerFear 필요)
    │
    ▼ 최종 ProductBrief 조립
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| 위저드 Step 1 | formData.productName | basicInfo.productName | 직접 매핑 |
| 위저드 Step 1 | formData.category | basicInfo.category | 직접 매핑 |
| 위저드 Step 1 | formData.price | basicInfo.price | number로 변환 |
| 위저드 Step 1 | formData.targetAudience | basicInfo.targetAudience | 직접 매핑 |
| 위저드 Step 2 | uploadedImages[] | images[] | URL 배열 |
| 위저드 Step 3 | answers[] | deepAnswers[] | questionId + answer 매핑 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| ② Why Now | productDNA, marketContext | WhyNowInput.productDNA, .marketContext | 직접 매핑 |
| ③ Conversion Strategy | ProductBrief 전체 | StrategyInput.brief | 직접 매핑 |
| ⑤ Psychological Copy | customerDesire, customerFear, resistanceMap | CopyInput.desire, .fear, .resistance | 직접 매핑 |

## 출력 품질 기준

### 합격 기준
- `confidenceScore` ≥ 70
- `productDNA`의 모든 필수 필드 (coreValue, uniqueSellingPoint, categoryPosition, pricePerception, brandPersonality, keyBenefits, emotionalHook) non-null
- `customerDesire.primaryDesire` non-null
- `customerFear.primaryFear` non-null
- `resistanceMap`의 모든 5개 키 존재 + 각 `level` 1~5 범위
- `decisionType`이 3개 유효값 중 하나
- `keyBenefits` 배열 길이 3~5개

### 경고 기준
- `confidenceScore` 50~69 (데이터 부족 가능성)
- `keyBenefits` 배열 길이 1~2개 (부족)
- `marketContext` 일부 필드가 generic/vague한 내용

### 불합격 기준
- `confidenceScore` < 50
- `productDNA` 필수 필드 중 하나라도 null/undefined
- `resistanceMap` 키 누락 또는 level 범위 초과
- `decisionType`이 유효하지 않은 값
- AI 응답 JSON 파싱 실패 (재시도 후에도)

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

> checklist.md의 엔진 특화 체크 항목은 이 파일의 품질 기준에서 파생된다.

| 이 파일 기준 | checklist.md 항목 | 검증 방법 |
|-------------|-------------------|----------|
| confidenceScore ≥70 PASS | confidenceScore 검증 | 값 범위 + 클램핑 로직 존재 |
| resistanceMap 5키 + level 1~5 | resistanceMap 검증 | 키 존재 + level 범위 |
| productDNA 필수 필드 non-null | productDNA 필수 필드 검증 | null 체크 로직 존재 |
| keyBenefits 3~5개 | keyBenefits 배열 길이 | 배열 길이 검증 |
| decisionType 유효값 | decisionType 검증 | 3개 값 중 하나 |
| 3 AI 호출 순차 | AI 응답 파싱 검증 | JSON 파싱 + 재시도 |
| 비용 ₩120-190/회 | 비용 추적 검증 | 개별 추적 + 합산 + ₩500 경고 |

> 이 파일의 품질 기준이 변경되면 checklist.md도 반드시 동기화한다.

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정 + **checklist.md 동기화 필수**
- 인접 엔진 타입 변경 시: 호환 매핑 재확인
