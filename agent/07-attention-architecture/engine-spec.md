# 엔진 스펙 — Attention Architecture Agent

## 담당 엔진

- **번호**: ⑦
- **이름**: Attention Architecture
- **경로**: `src/engine/07-attention-architecture/`
- **AI/규칙**: 규칙 엔진 (AI 없음)
- **핵심 함수**: `runAttentionArchitecture(brief: ProductBrief, strategyBlueprint: StrategyBlueprint, industry: string): AttentionConfig`

## 입력 타입

```typescript
interface AttentionArchitectureInput {
  brief: ProductBrief;                    // ① Product Intelligence 출력
  strategyBlueprint: StrategyBlueprint;   // ③ Conversion Strategy 출력
  industry: string;                       // 업종
}
```

**입력 제공 엔진**: ① Product Intelligence, ③ Conversion Strategy

## 출력 타입

```typescript
type ZoneType = 'first_view' | 'interest' | 'desire' | 'action';
type HookType = 'visual_hook' | 'question_hook' | 'result_hook' | 'social_hook';
type GazePattern = 'f_pattern' | 'z_pattern' | 'center_focus';

interface ZoneConfig {
  zone: ZoneType;                         // Zone 종류
  pixelRange: { start: number; end: number }; // 픽셀 범위
  visualRatio: number;                    // 시각 콘텐츠 비율 (Zone 내)
  textRatio: number;                      // 텍스트 콘텐츠 비율 (Zone 내)
  dataRatio: number;                      // 데이터 콘텐츠 비율 (Zone 내)
  ctaRatio: number;                       // CTA 콘텐츠 비율 (Zone 내)
  rhythm: string;                         // 정보 리듬 패턴
  interactions: string[];                 // 인터랙션 유형
  restrictions: string[];                 // 배치 제한 사항
}

interface AttentionConfig {
  hookType: HookType;
  gazePattern: GazePattern;
  zones: ZoneConfig[];
  stickyCtaEnabled: boolean;              // 스티키 CTA 활성화
  exitIntentEnabled: boolean;             // Exit Intent 팝업 활성화
}
```

**출력 수신 엔진**: ⑧ Layout Intelligence, Cross-Engine Bridge (Zone 어노테이션)

## 특수 컴포넌트

> `rules.ts` 별도 파일 없음. 모든 로직이 `index.ts`에 inline 정의.

### selectHookType — decisionType 기반 Hook 유형 결정 (index.ts 내)

| decisionType | hookType |
|-------------|----------|
| impulse | visual_hook |
| analytical | question_hook |
| cautious | result_hook |
| follower | social_hook |
| 기타 (default) | visual_hook |

### GAZE_MAP — 업종 기반 시선 동선 패턴 (index.ts 내)

| 업종 | gazePattern |
|------|------------|
| saas, b2b, education, health, finance | f_pattern |
| ecommerce, beauty, food, other | z_pattern |
| lifestyle | center_focus |

### buildZones — 4 Zone 픽셀 기반 설계 (index.ts 내)

- 평균 섹션 높이: 600px
- totalHeight = totalSections × 600
- Zone 경계: 첫 섹션(~600px) / 40% / 75% / 100%

| Zone | pixelRange | visualRatio | textRatio | dataRatio | ctaRatio | rhythm |
|------|-----------|-------------|-----------|-----------|----------|--------|
| first_view | 0 ~ sectionHeight | 80 | 20 | 0 | 0 | 시각적 임팩트 100% — 텍스트 최소화 |
| interest | sectionHeight ~ 40% | 60 | 40 | 0 | 0 | 밀 → 소 → 밀 (정보 밀도 교차) |
| desire | 40% ~ 75% | 20 | 50 | 30 | 0 | 증거 → 감정 → 증거 → 감정 |
| action | 75% ~ 100% | 0 | 0 | 0 | 70 | 가치 요약 + 보증 + CTA + FAQ |

### stickyCtaEnabled / exitIntentEnabled 조건

| 기능 | 활성 조건 |
|------|----------|
| stickyCtaEnabled | `resistanceMap.urgency.level >= 4` OR `totalSections >= 10` |
| exitIntentEnabled | `resistanceMap.price.level >= 4` |

### 호출 순서 (동기 실행)
```
selectHookType (decisionType → HookType)
    │
    ▼
selectGazePattern (industry → GazePattern via GAZE_MAP)
    │
    ▼
buildZones (totalSections → 4 ZoneConfig[] 픽셀 경계 계산)
    │
    ▼
stickyCtaEnabled / exitIntentEnabled 결정 (resistanceMap 기반)
    │
    ▼
AttentionConfig 반환
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ① Product Intelligence | ProductBrief | brief | 직접 매핑 |
| ③ Conversion Strategy | StrategyBlueprint | strategyBlueprint | 직접 매핑 |
| 파이프라인 컨텍스트 | industry | industry | 직접 매핑 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| ⑧ Layout Intelligence | AttentionConfig | LayoutInput.attentionConfig | 직접 매핑 |
| Cross-Engine Bridge | AttentionConfig.zones | BridgeInput.zones (Zone 어노테이션) | 직접 매핑 |

## 출력 품질 기준

### 합격 기준
- `zones.length` === 4 (first_view, interest, desire, action)
- `pixelRange` 연속 (이전 zone의 end === 다음 zone의 start)
- `pixelRange.start` === 0 (첫 Zone)
- `hookType`이 4가지 유효값 중 하나 (visual_hook, question_hook, result_hook, social_hook)
- `gazePattern`이 3가지 유효값 중 하나 (f_pattern, z_pattern, center_focus)

### 경고 기준
- pixelRange 간격이 너무 작음 (< 100px)
- 특정 Zone의 콘텐츠 비율 합이 100 초과

### 불합격 기준
- zones 누락 (4개 미만)
- pixelRange 겹침 또는 간격
- hookType이 유효하지 않은 값
- gazePattern이 유효하지 않은 값

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
| zones 4개 | 엔진 특화 > zones 검증 | length === 4 |
| Zone 이름 순서 | 엔진 특화 > zones 검증 | first_view→interest→desire→action |
| pixelRange 연속 | 엔진 특화 > pixelRange 검증 | 겹침/간격 없음, start=0 |
| hookType 유효 | 엔진 특화 > hookType 검증 | visual_hook/question_hook/result_hook/social_hook |
| gazePattern 유효 | 엔진 특화 > gazePattern 검증 | f_pattern/z_pattern/center_focus |
| 콘텐츠 비율 | 엔진 특화 > Zone 콘텐츠 비율 검증 | visualRatio/textRatio/dataRatio/ctaRatio 존재 |
| 결정론성 | 엔진 구현 > 규칙 엔진 체크 | 같은 입력 → 같은 출력 |
| AI 호출 없음 | 엔진 구현 > 규칙 엔진 체크 | AI 비용 0 |
| tsc/lint/build | 코드 변경 후 | 에러 0 |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정
- 인접 엔진 타입 변경 시: 호환 매핑 재확인

## 흡수 알림 (2026-03-09)

> ⑦ Attention Architecture의 기능은 26개 섹션 에이전트(agent/sections/)로 흡수되었습니다.
> 각 섹션 에이전트가 자기 섹션의 시선 흐름을 직접 담당합니다.
> 이 엔진은 페이지 전체 시선 흐름 전략을 제공하는 역할로 전환됩니다.
