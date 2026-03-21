# 12엔진 I/O 상세 스펙

## ① Product Intelligence

- **경로**: `src/engine/01-product-intelligence/`
- **AI**: Claude Sonnet ×3
- **함수**: `runProductIntelligence(input: ProductIntelligenceInput): Promise<{ brief: ProductBrief; totalCost: number }>`

**입력: ProductIntelligenceInput**
```typescript
{
  basicInfo: {
    productName: string;
    industry: string;
    priceRange: string;
    pageGoal: string;
    targetAudience: string;
    competitorUrl: string;
  };
  images: { storageKey: string }[];
  deepAnswers: { question: string; answer: string }[];
}
```

**출력: ProductBrief**
```typescript
{
  productDNA: { coreValue, usp[], positioning, valueHierarchy };
  customerDesire: { surface, real, hidden };
  customerFear: { problem, opportunity, social };
  resistanceMap: { price/trust/need/urgency/complexity: { level: 1~5, reason } };
  decisionType: 'impulse' | 'analytical' | 'cautious' | 'follower';
  marketContext: { competitionLevel, priceSensitivity, purchaseCycle, decisionTime, primaryChannel };
  confidenceScore: 0~100;
}
```

---

## ② Why Now

- **경로**: `src/engine/02-why-now/`
- **규칙 엔진** (AI 없음)
- **함수**: `runWhyNow(brief, industry, priceRange): UrgencyBrief`

**출력: UrgencyBrief**
```typescript
{
  primaryType: 'time_based' | 'quantity_based' | 'situational' | 'emotional' | 'price_anchor';
  secondaryType: UrgencyType | null;
  urgencyElements: { type: string; message: string }[];
  ctaUrgencyLevel: 1~5;
  placement: ('mid_page' | 'final_cta' | 'sticky_bar' | 'hero' | 'pricing')[];
}
```

---

## ③ Conversion Strategy

- **경로**: `src/engine/03-conversion-strategy/`
- **AI**: Claude Sonnet ×1
- **함수**: `runConversionStrategy(brief, urgencyBrief, pageGoal, industry): Promise<{ blueprint: StrategyBlueprint; cost: number }>`

**출력: StrategyBlueprint**
```typescript
{
  strategyType: 'direct_sale' | 'lead_generation' | 'free_trial' | 'content_hook' | 'event_registration';
  totalSections: number;
  structure: { order, role: SectionRole, sectionType, purpose }[];
  ctaPositions: number[];
  estimatedScrollDepth: string;
  targetReadTime: string;
}
```
**SectionRole**: `HOOK | PAIN | SOLUTION | PROOF | OBJECTION | URGENCY | CTA`

---

## ④ Objection Killer

- **경로**: `src/engine/04-objection-killer/`
- **규칙 엔진** (AI 없음)
- **함수**: `runObjectionKiller(brief, strategyBlueprint): ObjectionMap`

**출력: ObjectionMap**
```typescript
{
  activeObjections: {
    type: 'price' | 'trust' | 'need' | 'urgency' | 'complexity';
    level: 1~5;
    strategies: string[];
    injectAt: string[];    // "section_3_pricing" 형태
    copyDirection: string;
  }[];
}
```

---

## ⑤ Psychological Copy

- **경로**: `src/engine/05-psychological-copy/`
- **AI**: Claude Sonnet ×1 (+retry max 2)
- **함수**: `runPsychologicalCopy(brief, urgencyBrief, strategyBlueprint, objectionMap, industry, onRetry?): Promise<{ copyBlocks, cost, qualityGate, retryCount }>`

**출력: CopyBlocks**
```typescript
{
  sections: {
    sectionOrder: number;
    role: string;
    sectionType: string;
    copy: {
      headline: string;       // max 15자
      subheadline: string;
      body: string;
      bulletPoints: string[];
      ctaText: string;
      microCopy: string;
      imageDirection: string;
      imageUrl?: string;      // Image Gen이 채움
    };
  }[];
  tone: string;
  qualityScore: number;
}
```

### 특수 컴포넌트

**frames.ts** — 설득 프레임 검증 (규칙)
- `getFrame(role)` → 역할별 필수 요소 + 가중치
- `scoreByFrame(role, copy)` → 0~100 점수
- 7개 프레임: HOOK, PAIN, SOLUTION, PROOF, OBJECTION, URGENCY, CTA

**tone-matrix.ts** — 톤 일관성 검증 (규칙)
- `getToneProfile(industry)` → 업종별 톤 규칙
- `scoreTone(industry, copy)` → 0~100 점수
- 9개 업종: SaaS, ecommerce, beauty, health, food, education, finance, b2b, lifestyle

**quality-gate.ts** — 품질 게이트 (규칙)
- `evaluateCopyQuality(copyBlocks, industry)` → QualityGateResult
- combined = frame(60%) + tone(40%), 기준: ≥80
- `QUALITY_THRESHOLD = 80`, `MAX_RETRIES = 2`
- `buildRetryPrompt(failedSections, originalCopy)` → 재생성 프롬프트
- `mergeCopy(original, retried)` → 결과 병합

---

## ⑥ Trust Architecture

- **경로**: `src/engine/06-trust-architecture/`
- **규칙 엔진** (AI 없음)
- **함수**: `runTrustArchitecture(brief, strategyBlueprint): TrustConfig`

**출력: TrustConfig**
```typescript
{
  trustElements: {
    level: 1~6;             // Lv1 존재감 → Lv6 동료 압력
    name: string;
    customerPsychology: string;
    elements: string[];
    placement: string;
    sectionOrder: number;
  }[];
  trustScore: 0~100;
}
```

---

## ⑦ Attention Architecture

- **경로**: `src/engine/07-attention-architecture/`
- **규칙 엔진** (AI 없음)
- **함수**: `runAttentionArchitecture(brief, strategyBlueprint, industry): AttentionConfig`

**출력: AttentionConfig**
```typescript
{
  hookType: 'visual_hook' | 'question_hook' | 'result_hook' | 'social_hook';
  gazePattern: 'f_pattern' | 'z_pattern' | 'center_focus';
  zones: {
    zone: 'first_view' | 'interest' | 'desire' | 'action';
    pixelRange: { start, end };
    visualRatio: number;
    textRatio: number;
    dataRatio: number;
    ctaRatio: number;
    rhythm: string;
    interactions: string[];
    restrictions: string[];
  }[];
  stickyCtaEnabled: boolean;
  exitIntentEnabled: boolean;
}
```

---

## ⑧ Layout Intelligence

- **경로**: `src/engine/08-layout-intelligence/`
- **규칙 엔진** (AI 없음)
- **함수**: `runLayoutIntelligence(brief, strategyBlueprint, attentionConfig): LayoutConfig`

**출력: LayoutConfig**
```typescript
{
  sections: {
    order: number;
    role: string;
    sectionType: string;
    selectedPattern: string;   // 패턴 ID (28+ 종류)
    patternName: string;
    score: 0~100;
    reasoning: string;
  }[];
  diversityScore: 0~100;
  mobileReadyScore: 0~100;
}
```

**패턴 카테고리**: hero(8), feature(10), social_proof(6), pricing(4), cta(5), faq(3), misc(6)

---

## ⑨ Visual Style

- **경로**: `src/engine/09-visual-style/`
- **규칙 엔진** (AI 없음)
- **함수**: `runVisualStyle(brief, industry): StyleConfig`

**출력: StyleConfig**
```typescript
{
  mood: MoodPreset;          // 10종: luxury, clean, tech, natural, fun_pop, ...
  moodName: string;
  moodDescription: string;
  tokens: DesignTokens;
  reasoning: string;
}
```

**DesignTokens**:
```typescript
{
  colors: ColorPalette;       // 12색 (primary, secondary, accent, bg, surface, text ...)
  typography: TypographyScale; // 9 레벨 (display ~ button)
  fontFamily: 'sans' | 'serif' | 'mono';
  spacing: { xs, sm, md, lg, xl, 2xl };
  radius: { none, sm, md, lg, xl, full };
  defaultShadow: ShadowLevel;
  sectionPadding: string;
}
```

---

## Image Generation

- **경로**: `src/engine/image-generation/`
- **AI**: Gemini 2.0 Flash ×N (병렬 3)
- **함수**: `runImageGeneration(projectId, productName, industry, mood, copyBlocks, layoutConfig): Promise<ImageGenerationOutput>`

**출력: ImageGenerationOutput**
```typescript
{
  images: { sectionOrder, cdnUrl, storageKey, cost }[];
  totalCost: number;
  totalImages: number;
  failedSections: number[];
}
```

**이미지 필요 패턴**: hero_left_right, hero_split, hero_card, hero_product_center, feat_zigzag, feat_large_img_bullets

---

## ⑩ Code Engine

- **경로**: `src/engine/10-code-engine/`
- **규칙 엔진** (AI 없음)
- **함수**: `runCodeEngine(productName, copyBlocks, layoutConfig, styleConfig, stickyCtaEnabled, projectId): GeneratedPage`

**출력: GeneratedPage**
```typescript
{
  meta: { title, description, ogImage? };
  globalCss: string;
  sections: { order, role, sectionType, patternId, html, css }[];
  fullHtml: string;
  totalSections: number;
  generatedAt: string;
}
```

**renderers.ts**: 28+ 패턴별 HTML 렌더러
- `renderByPatternId(patternId, copy, tokens, order)` → HTML string
- 유틸: `bullets()`, `ctaButton()`, `imageBlock()`, `esc()` (XSS 방지)

---

## ⑪ Deploy

- **경로**: `src/engine/11-deploy/`
- **규칙 엔진** (AI 없음)
- **함수**: `runDeploy(generatedPage, projectId): DeployResult`

**출력: DeployResult**
```typescript
{
  slug: string;
  url: string;
  deployedAt: string;
}
```

---

## ⑫ Learning Loop

- **경로**: `src/engine/12-learning-loop/`
- **AI**: Claude Sonnet ×1 (진단)
- **함수**: `runLearningLoop(projectId, metrics): Promise<LearningLoopOutput>`

**출력: LearningLoopOutput**
```typescript
{
  diagnoses: {
    type: DiagnosisType;    // hero_weak, section_dropout, cta_ignored ...
    severity: 'low' | 'medium' | 'high' | 'critical';
    details: { metric, currentValue, threshold, affectedSection?, message };
  }[];
  prescriptions: {
    level: 1 | 2 | 3;
    actions: { type, target?, description, expectedImprovement }[];
  }[];
  activeTests: ABTestResult[];
  winningPatterns: WinningPatternData[];
}
```

**최적화 3레벨**:
- Level 1: 카피/CTA/이미지 교체 (완전 자동)
- Level 2: 섹션 순서/레이아웃 변경 (A/B 자동)
- Level 3: 전체 재생성 (사용자 승인 필요)

---

## Cross-Engine Bridge

- **경로**: `src/engine/cross-engine-bridge.ts`
- **규칙 엔진** (AI 없음)
- **함수**: `runCrossEngineBridge(copyBlocks, objectionMap, trustConfig, attentionConfig, layoutConfig): CrossEngineBridgeResult`

**3가지 교차 반영**:
1. Objection → Copy: 저항 파괴 전략을 카피에 주입
2. Trust → Layout: 신뢰 요소를 레이아웃 배치에 반영
3. Attention → Zone: Zone별 인터랙션 힌트를 HTML data-* 속성으로

**출력**: enrichedCopy + enrichedLayout + zoneAnnotations + stats
