# 엔진 스펙 — Conversion Strategy Agent

## 담당 엔진

- **번호**: ③
- **이름**: Conversion Strategy
- **경로**: `src/engine/03-conversion-strategy/`
- **AI/규칙**: Claude Sonnet ×1 + 규칙
- **핵심 함수**: `runConversionStrategy(brief: ProductBrief, urgencyBrief: UrgencyBrief, pageGoal: string, industry: string): Promise<{ blueprint: StrategyBlueprint; cost: number }>`

## 입력 타입

```typescript
interface ConversionStrategyInput {
  brief: ProductBrief;              // ①의 전체 출력
  urgencyBrief: UrgencyBrief;       // ②의 전체 출력
  pageGoal: string;                 // 페이지 목표 (예: 구매전환, 리드수집, 앱설치, 상담신청)
  industry: string;                 // 산업군 (예: 화장품, 전자기기, 식품, 패션, 교육)
}
```

**입력 제공 엔진**: ① Product Intelligence (ProductBrief), ② Why Now (UrgencyBrief), 파이프라인 컨텍스트 (pageGoal, industry)

## 출력 타입

```typescript
interface StrategyBlueprint {
  strategyType: StrategyType;         // 전환 전략 유형
  totalSections: number;              // 총 섹션 수 (5~16)
  structure: StructureSection[];      // 섹션 구조 배열
  ctaPositions: number[];             // CTA 배치 위치 (섹션 인덱스)
  estimatedScrollDepth: string;       // 예상 스크롤 깊이 (예: "5400px")
  targetReadTime: string;             // 목표 읽기 시간 (예: "5분")
}

type StrategyType =
  | 'direct_sale'           // 직접 판매 (구매 전환)
  | 'lead_generation'       // 리드 수집 (문의/상담)
  | 'free_trial'            // 무료 체험 (SaaS)
  | 'content_hook'          // 콘텐츠 훅 (다운로드/뉴스레터)
  | 'event_registration';   // 이벤트 등록

interface StructureSection {
  order: number;                      // 섹션 순서 (1부터)
  role: SectionRole;                  // 섹션 역할
  sectionType: string;                // 섹션 구체 타입 (예: hero_visual, benefit_highlight)
  purpose: string;                    // 이 섹션의 목적 (한국어)
}

type SectionRole =
  | 'HOOK'           // 주의 끌기
  | 'PAIN'           // 문제 제기
  | 'SOLUTION'       // 해결책 제시
  | 'PROOF'          // 증거/신뢰
  | 'OBJECTION'      // 반론 처리
  | 'URGENCY'        // 긴급성
  | 'CTA';           // 행동 유도
```

**출력 수신 엔진**: ④ Objection Killer, ⑤ Psychological Copy, ⑦ Attention Architecture, ⑧ Layout Intelligence

## 섹션 레이어 연결 (2026-03-09 추가)

> ③ Conversion Strategy의 출력이 26개 섹션 에이전트에 분배됩니다.

### 추가 출력
- 사용할 섹션 리스트 (26개 중 선택)
- 섹션 순서
- 섹션별 전략 지시 (각 섹션 에이전트에 전달할 컨텍스트)

### 연결 대상
| 대상 | 내 출력 | 용도 |
|------|--------|------|
| S-01 ~ S-26 섹션 에이전트 | 섹션 리스트 + 전략 지시 | 각 섹션 생성 입력 |

## 특수 컴포넌트

### prompts.ts — 1개 AI 호출 프롬프트 + rules.ts 규칙

| 함수 | AI/규칙 | 입력 | 출력 | 예상 비용 |
|------|---------|------|------|----------|
| `determineStrategyType` | 규칙 | brief.decisionType, pageGoal, industry | strategyType | ₩0 |
| `generateStructure` | Claude Sonnet 1회 | brief + urgencyBrief + strategyType + pageGoal | structure[], ctaPositions, totalSections | ~₩50-100 |
| `calculateMetrics` | 규칙 | structure[], strategyType | estimatedScrollDepth, targetReadTime | ₩0 |

**총 예상 비용**: ₩50-100/회 (1 AI 호출)

### 호출 순서 (의존관계)
```
determineStrategyType (규칙: decisionType + pageGoal + industry)
    │
    ▼ strategyType 결과 전달
generateStructure (AI: brief + urgencyBrief + strategyType + pageGoal)
    │
    ▼ structure[], ctaPositions, totalSections 전달
calculateMetrics (규칙: structure[] + strategyType)
    │
    ▼ 최종 StrategyBlueprint 조립
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ① ProductBrief | 전체 | brief | 직접 매핑 |
| ② UrgencyBrief | 전체 | urgencyBrief | 직접 매핑 |
| 파이프라인 컨텍스트 | pageGoal | pageGoal | 직접 매핑 |
| 파이프라인 컨텍스트 | industry | industry | 직접 매핑 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| ④ Objection Killer | StrategyBlueprint 전체 | ObjectionInput.strategyBlueprint | 직접 매핑 |
| ⑤ Psychological Copy | structure[], strategyType | CopyInput.structure, .strategyType | 직접 매핑 |
| ⑦ Attention Architecture | structure[], ctaPositions | AttentionInput.structure, .ctaPositions | 직접 매핑 |
| ⑧ Layout Intelligence | structure[] | LayoutInput.structure | 직접 매핑 |

## 출력 품질 기준

### 합격 기준
- `structure.length` > 0
- `totalSections` 5~16 범위
- 모든 `structure` 항목에 `role`, `sectionType` 존재
- `structure[].order`가 1부터 연속 번호
- `strategyType`이 5가지 유효값 중 하나
- `ctaPositions`의 모든 값이 0 ~ totalSections-1 범위
- `estimatedScrollDepth` non-empty string
- `targetReadTime` non-empty string

### 경고 기준
- `totalSections` = 5 (최소 기준)
- `ctaPositions.length` < 2 (CTA 부족)
- `structure`에 'HOOK' role 없음
- `structure`에 'CTA' role 없음

### 불합격 기준
- `structure` 빈 배열
- `strategyType`이 유효하지 않은 값
- `totalSections` < 5 또는 > 16
- `structure[].order`가 연속이 아님 (gap 존재)
- `ctaPositions`가 totalSections 범위 초과
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

> checklist.md의 "엔진 특화 체크" 항목은 이 파일의 품질 기준에서 파생된다.

| 이 파일 기준 | checklist.md 검증 항목 | 위반 시 |
|-------------|----------------------|---------|
| strategyType 5가지 유효값 | strategyType 검증 | FAIL → loop.md |
| totalSections 5~16 | structure 배열 검증 | FAIL → loop.md |
| structure[].order 연속 번호 | structure 배열 검증 | FAIL → loop.md |
| SectionRole 7가지 유효값 | structure 배열 검증 | FAIL → loop.md |
| ctaPositions 범위 | ctaPositions 검증 | FAIL → loop.md |
| estimatedScrollDepth non-empty string | 메트릭 검증 | FAIL → loop.md |
| AI JSON 파싱 | AI 응답 파싱 검증 | FAIL → loop.md (엔진 특화 루프) |
| 비용 ₩500 이하 | 비용 추적 검증 | WARN → 사용자 승인 |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정 + checklist.md 동기화
- 인접 엔진 타입 변경 시: 호환 매핑 재확인
