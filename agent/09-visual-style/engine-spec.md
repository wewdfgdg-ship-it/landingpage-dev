# 엔진 스펙 — Visual Style Agent

## 담당 엔진

- **번호**: ⑨
- **이름**: Visual Style
- **경로**: `src/engine/09-visual-style/`
- **AI/규칙**: 규칙 엔진 (AI 없음)
- **핵심 함수**: `runVisualStyle(brief: ProductBrief, industry: string, strategyBlueprint?: StrategyBlueprint): StyleConfig`

## 입력 타입

```typescript
interface VisualStyleInput {
  brief: ProductBrief;    // ① Product Intelligence 출력
  industry: string;       // 업종
  strategyBlueprint?: StrategyBlueprint; // ③ Conversion Strategy 출력 (권장, 무드 보정용)
}
```

**입력 제공 엔진**: ① Product Intelligence, ③ Conversion Strategy (권장)

## 출력 타입

```typescript
type MoodPreset = 'luxury' | 'clean' | 'tech' | 'natural' | 'fun_pop'
  | 'professional' | 'startup' | 'premium' | 'bold' | 'minimal';

interface StyleConfig {
  mood: MoodPreset;               // 무드 식별자 (10종 중 1종)
  moodName: string;               // 무드 이름
  moodDescription: string;        // 무드 설명
  tokens: DesignTokens;           // 디자인 토큰
  reasoning: string;              // 선택 근거
}

interface ColorPalette {
  primary: string;                // 주색 (#hex)
  primaryLight: string;           // 주색 밝음
  primaryDark: string;            // 주색 어두움
  secondary: string;              // 보조색
  accent: string;                 // 강조색
  background: string;             // 배경색
  surface: string;                // 표면색
  textPrimary: string;            // 본문 텍스트
  textSecondary: string;          // 보조 텍스트
  textMuted: string;              // 약한 텍스트
  border: string;                 // 테두리색
  error: string;                  // 에러색
}

interface TypographyScale {
  display: { size: string; weight: number; lineHeight: string };
  h1: { size: string; weight: number; lineHeight: string };
  h2: { size: string; weight: number; lineHeight: string };
  h3: { size: string; weight: number; lineHeight: string };
  h4: { size: string; weight: number; lineHeight: string };
  body: { size: string; weight: number; lineHeight: string };
  small: { size: string; weight: number; lineHeight: string };
  caption: { size: string; weight: number; lineHeight: string };
  button: { size: string; weight: number; lineHeight: string };
}

type FontFamily = 'sans' | 'serif' | 'mono';

interface SpacingScale {
  xs: number; sm: number; md: number; lg: number; xl: number; '2xl': number;
}

interface RadiusScale {
  none: number; sm: number; md: number; lg: number; xl: number; full: number;
}

type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'inner';

interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyScale;
  fontFamily: FontFamily;
  spacing: SpacingScale;
  radius: RadiusScale;
  defaultShadow: ShadowLevel;
  sectionPadding: string;         // 예: '80px 0'
}
```

**출력 수신 엔진**: Image Generation, ⑩ Code Engine

## 특수 컴포넌트

> `mood-presets.ts`, `rules.ts` 별도 파일 없음. 모든 로직이 `index.ts`에 inline 정의.

### MOOD_DEFS — 10종 무드 프리셋 (index.ts 내)

| 무드 ID | 이름 | 설명 | fontFamily | radiusPreset |
|---------|------|------|-----------|-------------|
| luxury | Luxury | 다크+골드, 세리프, 넓은 여백, 고급 질감 | serif | sharp |
| clean | Clean | 화이트+블루, 산세리프, 미니멀, 그리드 정돈 | sans | rounded |
| tech | Tech | 다크+네온, 모노스페이스, 그라디언트, 기하학 | mono | rounded |
| natural | Natural | 어스톤, 라운드, 유기적 형태, 텍스처 | sans | pill |
| fun_pop | Fun/Pop | 비비드, 볼드 타이포, 일러스트, 동적 | sans | pill |
| professional | Professional | 네이비+그레이, 클래식, 정돈된 그리드 | sans | sharp |
| startup | Startup | 밝은+퍼플, 현대적, 일러스트, 친근 | sans | rounded |
| premium | Premium | 딥블루+화이트, 고급 사진, 큰 여백 | serif | sharp |
| bold | Bold | 강렬한 대비, 큰 타이포, 블록 컬러 | sans | sharp |
| minimal | Minimal | 흑백+액센트 1색, 극도의 여백, 타이포 중심 | sans | sharp |

### INDUSTRY_MOOD_MAP — 업종 → 후보 무드 매핑 (index.ts 내)

| 업종 | 후보 무드 (우선순위) |
|------|---------------------|
| saas | tech, startup, clean |
| b2b | professional, clean, premium |
| ecommerce | clean, bold, fun_pop |
| beauty | luxury, clean, premium |
| food | natural, fun_pop, clean |
| education | clean, startup, professional |
| health | clean, natural, professional |
| finance | professional, premium, clean |
| lifestyle | minimal, clean, natural |
| other (기본) | clean, startup, professional |

### adjustByPositioning — 포지셔닝 기반 최종 무드 보정 (index.ts 내)

| 포지셔닝 키워드 | 우선 선택 |
|----------------|----------|
| 프리미엄/고급/럭셔리 | luxury → premium |
| 혁신/기술/테크 | tech → startup |
| 친근/재미/젊은 | fun_pop → startup |
| 미니멀/심플/깔끔 | minimal → clean |
| 전문/신뢰/안정 | professional → premium |
| 매칭 없음 | candidates[0] (업종 기본) |

### adjustByStrategy — 전략 유형 기반 무드 보정 (index.ts 내)

> ③ StrategyBlueprint가 있을 때만 적용. 없으면 스킵.

| strategyType | 무드 보정 | 색상 강도 보정 |
|-------------|----------|-------------|
| urgency_scarcity | bold 우선, accent 채도 ↑ | ctaUrgencyLevel 5 → primary 채도 +15% |
| logic_evidence | professional/clean 우선 | 중립 색상, 낮은 채도 |
| emotion_story | natural/lifestyle 우선 | warm 톤, 부드러운 대비 |
| social_proof | clean/professional 유지 | 신뢰 색상 (blue 계열) 강화 |
| premium_exclusive | luxury/premium 우선 | 골드/다크 강화 |
| 기타/null | 보정 없음 (positioning 결과 유지) | 보정 없음 |

### 호출 순서 (동기 실행)
```
INDUSTRY_MOOD_MAP[industry] → 후보 무드 3개
    │
    ▼
adjustByPositioning(candidates, brief.productDNA.positioning) → 1차 무드
    │
    ▼
adjustByStrategy(mood, strategyBlueprint?) → 최종 무드 (③ 없으면 스킵)
    │
    ▼
MOOD_DEFS에서 무드 정의 찾기 (fallback: clean)
    │
    ▼
DesignTokens 조합 (colors + buildTypography + buildRadius + SPACING + defaultShadow + sectionPadding)
    │
    ▼
reasoning 생성 + StyleConfig 반환
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ① Product Intelligence | ProductBrief | brief | 직접 매핑 |
| ③ Conversion Strategy | StrategyBlueprint | strategyBlueprint | 직접 매핑 (optional) |
| 파이프라인 컨텍스트 | industry | industry | 직접 매핑 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| Image Generation | StyleConfig.mood, tokens.colors | ImageInput.styleContext | 직접 매핑 |
| ⑩ Code Engine | StyleConfig.tokens | CodeInput.designTokens | 직접 매핑 |

## 출력 품질 기준

### 합격 기준
- `mood`가 MoodPreset 10종 유효값 중 하나 (luxury, clean, tech, natural, fun_pop, professional, startup, premium, bold, minimal)
- `tokens.colors` ColorPalette 12색 전부 정의 (non-null, 유효한 hex)
- `tokens.typography` TypographyScale 9레벨 전부 정의 (display, h1~h4, body, small, caption, button)
- `tokens.spacing` SpacingScale 6단계 전부 정의 (xs, sm, md, lg, xl, 2xl — number 타입)
- `tokens.fontFamily`가 FontFamily 3종 중 하나 (sans, serif, mono)
- `tokens.radius` RadiusScale 6단계 전부 정의 (none, sm, md, lg, xl, full)
- `tokens.defaultShadow`가 ShadowLevel 유효값 (none, sm, md, lg, xl, inner)

### 경고 기준
- `reasoning`이 짧음 (10자 미만)
- 무드와 업종의 매칭이 비전형적

### 불합격 기준
- `mood`가 MoodPreset 10종에 없음
- `tokens.colors` 필수 색상 누락
- `tokens.typography` 필수 레벨 누락
- `tokens.fontFamily`가 3종에 없음

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
| mood 유효 | 엔진 특화 > mood 검증 | MoodPreset 10종 중 하나 |
| colors 12색 | 엔진 특화 > ColorPalette 검증 | 12색 전부 non-null + 유효 hex |
| typography 9레벨 | 엔진 특화 > TypographyScale 검증 | 9레벨 전부 정의 (lineHeight: string) |
| spacing 6단계 | 엔진 특화 > SpacingScale 검증 | 6단계 전부 정의 (number 타입) |
| fontFamily 유효 | 엔진 특화 > FontFamily 검증 | sans/serif/mono 중 하나 |
| radius 6단계 | 엔진 특화 > RadiusScale 검증 | 6단계 전부 정의 |
| defaultShadow 유효 | 엔진 특화 > ShadowLevel 검증 | none/sm/md/lg/xl/inner 중 하나 |
| 결정론성 | 엔진 구현 > 규칙 엔진 체크 | 같은 입력 → 같은 출력 |
| AI 호출 없음 | 엔진 구현 > 규칙 엔진 체크 | AI 비용 0 |
| tsc/lint/build | 코드 변경 후 | 에러 0 |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 무드 프리셋 변경 시: index.ts MOOD_DEFS와 동기화 (별도 mood-presets.ts 없음)
- 인접 엔진 타입 변경 시: 호환 매핑 재확인

## 흡수 알림 (2026-03-09)

> ⑨ Visual Style의 기능은 26개 섹션 에이전트(agent/sections/)로 흡수되었습니다.
> 각 섹션 에이전트가 자기 섹션의 스타일을 직접 담당합니다.
> 이 엔진은 페이지 전체 디자인 토큰/무드 가이드라인을 제공하는 역할로 전환됩니다.
