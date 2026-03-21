# 엔진 스펙 — Layout Intelligence Agent

## 담당 엔진

- **번호**: ⑧
- **이름**: Layout Intelligence
- **경로**: `src/engine/08-layout-intelligence/`
- **AI/규칙**: 규칙 엔진 (AI 없음)
- **핵심 함수**: `runLayoutIntelligence(brief: ProductBrief, strategyBlueprint: StrategyBlueprint, attentionConfig: AttentionConfig): LayoutConfig`

## 입력 타입

```typescript
interface LayoutIntelligenceInput {
  brief: ProductBrief;                    // ① Product Intelligence 출력
  strategyBlueprint: StrategyBlueprint;   // ③ Conversion Strategy 출력
  attentionConfig: AttentionConfig;       // ⑦ Attention Architecture 출력
}
```

**입력 제공 엔진**: ① Product Intelligence, ③ Conversion Strategy, ⑦ Attention Architecture

## 출력 타입

```typescript
type LayoutCategory = 'hero' | 'feature' | 'social_proof' | 'pricing' | 'cta' | 'faq' | 'misc';

interface LayoutPattern {
  id: string;
  category: LayoutCategory;
  name: string;
  description: string;
  mobileScore: number;             // 0~100 모바일 친화도
  bestForDecisionTypes: string[];  // impulse, analytical 등
  bestForZones: string[];          // first_view, interest, desire, action
  minContentAmount: number;        // 최소 콘텐츠 양 (1~5)
  maxContentAmount: number;        // 최대 콘텐츠 양 (1~5)
}

interface SectionLayout {
  order: number;                   // 섹션 순서
  role: string;                    // 섹션 역할 (HOOK, SOLUTION 등)
  sectionType: string;             // 섹션 타입
  selectedPattern: string;         // LayoutPattern.id
  patternName: string;             // 패턴 한국어 이름
  score: number;                   // 선택 점수 (0~100)
  reasoning: string;               // 선택 근거
}

interface LayoutConfig {
  sections: SectionLayout[];
  diversityScore: number;          // 패턴 다양성 점수 0~100
  mobileReadyScore: number;        // 전체 모바일 적합도 0~100
}
```

**출력 수신 엔진**: Cross-Engine Bridge, ⑩ Code Engine

## 특수 컴포넌트

> `rules.ts` 별도 파일 없음. PATTERNS (42개), ROLE_CATEGORY_MAP, scorePattern, getZoneForOrder 모두 `index.ts`에 inline 정의.

### PATTERNS — 42개 레이아웃 패턴 라이브러리 (index.ts 내)

| 카테고리 | 패턴 수 | 예시 ID |
|---------|---------|---------|
| hero | 8 | hero_fullscreen_center, hero_left_right, hero_video_bg, hero_gradient, hero_split 등 |
| feature | 10 | feat_3col_grid, feat_zigzag, feat_tab, feat_accordion, feat_comparison 등 |
| social_proof | 6 | proof_review_carousel, proof_testimonial_card, proof_logo_bar 등 |
| pricing | 4 | price_3col_compare, price_single_card, price_toggle 등 |
| cta | 5 | cta_center, cta_left_right, cta_full_banner, cta_sticky_bar, cta_popup |
| faq | 3 | faq_accordion, faq_2col, faq_search |
| misc | 6 | misc_before_after, misc_timeline, misc_process_flow 등 |

### ROLE_CATEGORY_MAP — 역할→카테고리 매핑 (index.ts 내)

| 섹션 역할 | 후보 카테고리 |
|----------|-------------|
| HOOK | hero |
| PAIN | feature, misc |
| SOLUTION | feature, misc |
| PROOF | social_proof, feature |
| OBJECTION | faq, feature, misc |
| URGENCY | cta, misc |
| CTA | cta, pricing |

### scorePattern — 패턴 점수 산출 (index.ts 내)

| 기준 | 가중치 | 설명 |
|------|--------|------|
| Zone 적합성 | 30% | bestForZones 매칭 시 30점, 아니면 5점 |
| 모바일 친화도 | 25% | (mobileScore/100) × 25 |
| 의사결정 유형 | 20% | bestForDecisionTypes 매칭 시 20점, 아니면 5점 |
| 콘텐츠 양 적합 | 15% | 범위 내 15점, 근접 8점 |
| 시각적 다양성 | 10% | 중복 ID 0점, 같은 카테고리 5점, 신규 10점 |

### getZoneForOrder — 섹션 순서 기반 Zone 결정 (index.ts 내)

- order === 1 → `first_view`
- order/totalSections ≤ 0.4 → `interest`
- order/totalSections ≤ 0.75 → `desire`
- 나머지 → `action`

> 참고: attentionConfig 파라미터는 현재 미사용 (`_attention`)

### 다양성 계산
- `diversityScore` = `Math.round((uniquePatterns.size / sections.length) × 100)`
- usedPatterns Set으로 중복 ID + 카테고리 추적 (scoring 감점, 하드 reject 아님)

### mobileReadyScore 계산
- 전체 섹션 패턴의 `mobileScore` 평균

### 호출 순서 (동기 실행)
```
blueprint.structure[] 순회
    │
    ▼
각 섹션: getZoneForOrder (order → Zone 결정)
    │
    ▼
각 섹션: ROLE_CATEGORY_MAP (역할 → 후보 카테고리 필터)
    │
    ▼
각 섹션: scorePattern (후보 패턴 점수 계산 → 최고점 선택)
    │
    ▼
diversityScore + mobileReadyScore 산출
    │
    ▼
LayoutConfig 반환
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ① Product Intelligence | ProductBrief | brief | 직접 매핑 |
| ③ Conversion Strategy | StrategyBlueprint | strategyBlueprint | 직접 매핑 |
| ⑦ Attention Architecture | AttentionConfig | attentionConfig | 직접 매핑 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| Cross-Engine Bridge | LayoutConfig | BridgeInput.layoutConfig | 직접 매핑 |
| ⑩ Code Engine | LayoutConfig.sections[].selectedPattern | CodeInput.patterns | Bridge 경유 |

## 출력 품질 기준

### 합격 기준
- `diversityScore` ≥ 60
- `mobileReadyScore` ≥ 70
- 모든 section의 `selectedPattern`이 PATTERNS[] 배열에 존재하는 유효 ID
- 모든 section에 order, role, sectionType, patternName, score, reasoning 존재

### 경고 기준
- `diversityScore` 40~59 (다양성 부족)
- `mobileReadyScore` 50~69 (모바일 개선 필요)

### 불합격 기준
- `selectedPattern`이 PATTERNS[]에 미존재
- `diversityScore` < 40

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

## 체크리스트 앵커 테이블

| 항목 | checklist.md 섹션 | 합격 기준 |
|------|-------------------|----------|
| patternId 유효 | 엔진 특화 > patternId 검증 | 모든 selectedPattern이 PATTERNS[]에 존재 |
| diversityScore | 엔진 특화 > diversityScore 검증 | ≥ 60 (PASS), 40~59 (WARN), <40 (FAIL) |
| mobileReadyScore | 엔진 특화 > mobileReadyScore 검증 | ≥ 70 (PASS), 50~69 (WARN) |
| SectionLayout 필드 | 엔진 특화 > 출력 구조 검증 | order, role, sectionType, patternName, score, reasoning 존재 |
| 결정론성 | 엔진 구현 > 규칙 엔진 체크 | 같은 입력 → 같은 출력 |
| AI 호출 없음 | 엔진 구현 > 규칙 엔진 체크 | AI 비용 0 |
| tsc/lint/build | 코드 변경 후 | 에러 0 |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- renderers.ts 패턴 목록 변경 시: 규칙 재확인
- 인접 엔진 타입 변경 시: 호환 매핑 재확인

## 흡수 알림 (2026-03-09)

> ⑧ Layout Intelligence의 기능은 26개 섹션 에이전트(agent/sections/)로 흡수되었습니다.
> 각 섹션 에이전트가 자기 섹션의 레이아웃을 직접 담당합니다.
> 이 엔진은 페이지 전체 레이아웃 조화/리듬 가이드라인을 제공하는 역할로 전환됩니다.
