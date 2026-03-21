# 엔진 스펙 — {{AGENT_NAME}}

## 담당 엔진

- **번호**: {{ENGINE_NUMBER}}
- **이름**: {{ENGINE_NAME}}
- **경로**: `src/engine/{{ENGINE_PATH}}/`
- **AI/규칙**: {{AI_OR_RULE}}
- **핵심 함수**: `{{RUN_FUNCTION}}`

## 입력 타입

```typescript
{{INPUT_TYPE_DEFINITION}}
```

**입력 제공 엔진**: {{INPUT_SOURCE_ENGINES}}

## 출력 타입

```typescript
{{OUTPUT_TYPE_DEFINITION}}
```

**출력 수신 엔진**: {{OUTPUT_TARGET_ENGINES}}

## 특수 컴포넌트

{{SPECIAL_COMPONENTS}}

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑
{{TYPE_MAPPING_IN}}

### 내 출력 → 다음 엔진 입력 매핑
{{TYPE_MAPPING_OUT}}

## 출력 품질 기준

### 합격 기준
{{PASS_CRITERIA}}

### 경고 기준
{{WARN_CRITERIA}}

### 불합격 기준
{{FAIL_CRITERIA}}

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

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정
- 인접 엔진 타입 변경 시: 호환 매핑 재확인
