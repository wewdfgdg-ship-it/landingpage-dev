# 엔진 스펙 — Psychological Copy Agent

## 담당 엔진

- **번호**: ⑤
- **이름**: Psychological Copy
- **경로**: `src/engine/05-psychological-copy/`
- **AI/규칙**: Claude Sonnet ×1 (+retry max 2) + 규칙 + 품질 게이트
- **핵심 함수**: `runPsychologicalCopy(brief: ProductBrief, urgencyBrief: UrgencyBrief, blueprint: StrategyBlueprint, objectionMap: ObjectionMap, industry: string, onRetry?: (attempt: number, failedCount: number) => void): Promise<CopyEngineResult>`
- **반환 타입**: `CopyEngineResult { copyBlocks: CopyBlocks; cost: number; qualityGate: QualityGateResult; retryCount: number }`

## 입력 타입

```typescript
// 이전 엔진 출력을 직접 수신
interface PsychologicalCopyInput {
  brief: ProductBrief;              // ① Product Intelligence 출력
  urgencyBrief: UrgencyBrief;       // ② Why Now 출력
  strategyBlueprint: StrategyBlueprint; // ③ Conversion Strategy 출력
  objectionMap: ObjectionMap;       // ④ Objection Killer 출력
  industry: string;                 // 업종 (tone-matrix.ts 매핑용)
}
```

**입력 제공 엔진**: ① Product Intelligence, ② Why Now, ③ Conversion Strategy, ④ Objection Killer

## 출력 타입

```typescript
interface CopyBlock {
  headline: string;               // 1줄, 최대 15자
  subheadline: string;            // 1~2줄
  body: string;                   // 2~4줄
  bulletPoints: string[];         // 3~5개
  ctaText: string;                // 버튼 텍스트
  microCopy: string;              // 버튼 하단 보조
  imageDirection: string;         // 이미지 생성용 지시
  imageUrl?: string;              // 생성된 이미지 CDN URL (이미지 엔진이 주입)
}

interface SectionCopy {
  sectionOrder: number;           // 섹션 순서 (1부터)
  role: string;                   // 섹션 역할 (HOOK, PAIN, SOLUTION 등)
  sectionType: string;            // 섹션 구체 타입 (hero_visual, pain_point 등)
  copy: CopyBlock;                // 카피 블록
}

interface CopyBlocks {
  sections: SectionCopy[];        // 섹션별 카피
  tone: string;                   // 전체 톤 설명 (TONE_MAP 기반)
  qualityScore: number;           // 종합 품질 점수 (quality-gate.ts 평가)
}

interface QualityGateResult {
  overallScore: number;           // 전체 평균 점수 (0~100)
  totalSections: number;          // 전체 섹션 수
  passedSections: number;         // 통과 섹션 수
  failedSections: SectionQualityResult[]; // 실패 섹션 상세 (객체 배열)
  allResults: SectionQualityResult[];     // 전체 섹션 평가 결과
  passed: boolean;                // 전체 통과 여부 (failedSections.length === 0)
}
```

**출력 수신 엔진**: ⑥ Trust Architecture, Cross-Engine Bridge, Image Generation, ⑩ Code Engine

### Degraded Output (최소 카피 모드)

> QG 2회 재시도 후에도 overallScore < 50일 때 발동. 파이프라인 중단 방지용.

```typescript
interface DegradedCopyBlocks extends CopyBlocks {
  isDegraded: true;                    // degraded 플래그
  degradedSections: string[];          // 최소 카피로 대체된 섹션 role[]
  originalScore: number;               // 대체 전 원본 점수
}
```

**최소 카피 생성 규칙** (AI 호출 없음):
- `headline`: `brief.productDNA.coreValue` 첫 15자
- `subheadline`: `brief.productDNA.USP` 첫 30자
- `body`: `""` (빈 문자열)
- `bulletPoints`: `brief.productDNA.keyBenefits.slice(0, 3)`
- `ctaText`: `"자세히 보기"`
- `microCopy`: `""`
- `imageDirection`: `"제품 이미지"`

**후속 엔진 처리**:
- `isDegraded: true` → Bridge enrichment 스킵, ⑩ renderGenericSection 사용

## 특수 컴포넌트

### frames.ts — 7가지 SectionRole별 설득 프레임

| Role | 프레임 | 핵심 검증 요소 |
|------|--------|--------------|
| HOOK | 시선 잡기 프레임 | 임팩트 헤드라인, 감정 자극, CTA, 비주얼 디렉션 |
| PAIN | 고통점 공감 프레임 | 공감 본문, 구체적 고통 나열(불릿 3+), 전환 서브헤드라인 |
| SOLUTION | 해결책 제시 프레임 | 혜택 헤드라인, 작동 방식, 기능 불릿, 구체적 수치 |
| PROOF | 사회적 증거 프레임 | 증거 본문, 증거 항목, 신뢰 수치 |
| OBJECTION | 반론 해소 프레임 | 반박 본문, 안심 포인트, 보증 마이크로카피 |
| URGENCY | 긴급성 프레임 | 희소성 본문, 마감 요소(수치), CTA |
| CTA | 행동 유도 프레임 | 가치 요약, 강력한 CTA(3~12자), 리스크 제거 마이크로카피 |

**참고**: 매핑 안 되는 role은 DEFAULT 프레임 적용 (헤드라인, 본문, 서브헤드라인, 불릿 기본 검증)

### tone-matrix.ts — 9개 업종별 톤 + 기본

| 업종 키 | 설명 | 핵심 검증 규칙 |
|---------|------|--------------|
| saas | 명확하고 간결한, 데이터 중심 | 수치 기반, 전문 용어, 간결한 본문 |
| ecommerce | 친근하고 직관적인, 혜택 강조 | 혜택 표현, 강한 CTA, 신뢰 요소 |
| beauty | 감성적이고 트렌디한, 비주얼 중심 | 감성적 표현, 이미지 디렉션 |
| health | 신뢰감 있는, 전문적이면서 따뜻한 | 전문 표현, 신뢰 신호, 수치 근거, 감성 |
| food | 자연스럽고 건강한, 신뢰감 있는 | 감성적 표현, 신뢰 요소 |
| education | 동기부여하는, 구체적 결과 중심 | 결과 수치, 혜택 표현 |
| finance | 보수적이고 신뢰감 있는, 수치 중심 | 수치 근거, 전문 용어, 신뢰 신호 |
| b2b | 전문적이고 논리적인, ROI 중심 | 전문 표현, ROI 수치, 기능 불릿 |
| lifestyle | 감정적이고 공감하는, 스토리텔링 | 감성적 표현, 이미지 디렉션 |
| other (기본) | 명확하고 설득력 있는, 균형 잡힌 | 간결한 헤드라인, 본문, CTA, 불릿 |

### quality-gate.ts — 품질 게이트

| 상수 | 값 | 설명 |
|------|------|------|
| THRESHOLD | 80 | 합격 기준점 |
| MAX_RETRIES | 2 | 최대 재시도 횟수 |
| FRAME_WEIGHT | 0.6 | 프레임 점수 가중치 |
| TONE_WEIGHT | 0.4 | 톤 점수 가중치 |

**품질 점수 산출**: `qualityScore = (avgFrameScore × 0.6) + (avgToneScore × 0.4)`

### prompts.ts — AI 호출 프롬프트

| 함수 | AI 호출 | 입력 | 출력 | 예상 비용 |
|------|---------|------|------|----------|
| `generateCopy` | Claude Sonnet 1회 | brief + urgencyBrief + strategyBlueprint + objectionMap + industry + frames + tone | CopyBlocks | ~₩50-100 |
| `buildRetryPrompt` | (재시도용) | 실패 섹션 + 이전 결과 + 피드백 | 실패 섹션만 재생성 | ~₩30-60 |

**총 예상 비용**: ₩50-220/회 (1회 호출 + 최대 2회 재시도)

### 호출 순서 (의존관계)
```
generateCopy (1차 생성)
    │
    ▼ CopyBlocks 결과
qualityGate 평가 (규칙)
    │
    ├── PASS (≥80) → 완료
    │
    └── FAIL (<80)
        │
        ▼ buildRetryPrompt (실패 섹션만)
    generateCopy (재시도, retry 1)
        │
        ▼ mergeCopy (성공 섹션 유지 + 재생성 섹션 교체)
    qualityGate 재평가
        │
        ├── PASS → 완료
        └── FAIL → retry 2 (동일 과정) → 이후에도 FAIL → 현재 결과 반환 + 경고
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ① Product Intelligence | ProductBrief | brief | 직접 매핑 |
| ② Why Now | UrgencyBrief | urgencyBrief | 직접 매핑 |
| ③ Conversion Strategy | StrategyBlueprint | strategyBlueprint | 직접 매핑 |
| ④ Objection Killer | ObjectionMap | objectionMap | 직접 매핑 |
| 파이프라인 컨텍스트 | industry | industry | 직접 매핑 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| ⑥ Trust Architecture | CopyBlocks (참조) | TrustInput.brief (간접) | brief 경유 |
| Cross-Engine Bridge | CopyBlocks.sections | BridgeInput.copyBlocks | 직접 매핑 |
| Image Generation | CopyBlocks.sections[].copy | ImageInput.sectionCopy | 직접 매핑 |
| ⑩ Code Engine | CopyBlocks (Bridge 경유) | CodeInput.enrichedCopy | Bridge 변환 |

## 출력 품질 기준

### 합격 기준
- `overallScore` ≥ 80 (각 섹션 combinedScore = frameScore × 0.6 + toneScore × 0.4의 평균)
- `passed` === true (failedSections.length === 0)
- 모든 섹션의 `copy` 필드가 비어있지 않음
- `headline` ≤ 15자 (코드의 isShortHeadline은 18자까지 허용)

### 경고 기준
- `overallScore` 70~79
- 일부 섹션의 combinedScore < 80
- `headline` 13~15자 (길이 경계)

### 불합격 기준
- `overallScore` < 70
- 섹션 누락 (strategyBlueprint.structure에 명시된 섹션이 CopyBlocks에 없음)
- `headline` > 15자
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

| 품질 기준 | checklist.md 항목 | FAIL 시 |
|----------|------------------|---------|
| overallScore ≥ 80 | 엔진 특화 체크 → qualityScore 검증 | [FAIL_TRIGGER] → loop.md |
| headline ≤ 15자 | 엔진 특화 체크 → headline 길이 검증 | [FAIL_TRIGGER] → loop.md |
| 섹션 완전성 (role 전부 + CopyBlock 7필드) | 엔진 특화 체크 → 섹션 완전성 검증 | [FAIL_TRIGGER] → loop.md |
| SectionRole 프레임 매핑 | 엔진 특화 체크 → role→프레임 검증 | [FAIL_TRIGGER] → loop.md |
| tone 유효값 (TONE_MAP 10개 키) | 엔진 특화 체크 → tone 검증 | [FAIL_TRIGGER] → loop.md |
| 비용 ≤ ₩500 | 엔진 특화 체크 → 비용 추적 검증 | WARN → reviewer.md |
| JSON 파싱 성공 | 엔진 특화 체크 → AI 응답 파싱 검증 | [FAIL_TRIGGER] → loop.md |
| 재시도 로직 정상 | 엔진 특화 체크 → 품질 게이트 재시도 검증 | [FAIL_TRIGGER] → loop.md |
| AI 프롬프트 품질 | 엔진 특화 체크 → 프롬프트 검증 | WARN → reviewer.md |
| tsc/lint/build | 필수 체크 | [FAIL_TRIGGER] → loop.md |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정
- 인접 엔진 타입 변경 시: 호환 매핑 재확인

## 흡수 알림 (2026-03-09)

> ⑤ Psychological Copy의 기능은 26개 섹션 에이전트(agent/sections/)로 흡수되었습니다.
> 각 섹션 에이전트가 자기 섹션의 카피를 직접 담당합니다.
> 이 엔진은 공통 카피 전략/톤 가이드라인을 제공하는 역할로 전환됩니다.
