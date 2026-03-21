# 엔진 스펙 — Trust Architecture Agent

## 담당 엔진

- **번호**: ⑥
- **이름**: Trust Architecture
- **경로**: `src/engine/06-trust-architecture/`
- **AI/규칙**: 규칙 엔진 (AI 없음)
- **핵심 함수**: `runTrustArchitecture(brief: ProductBrief, strategyBlueprint: StrategyBlueprint): TrustConfig`

## 입력 타입

```typescript
// 이전 엔진 출력을 직접 수신
interface TrustArchitectureInput {
  brief: ProductBrief;                    // ① Product Intelligence 출력
  strategyBlueprint: StrategyBlueprint;   // ③ Conversion Strategy 출력
}
```

**입력 제공 엔진**: ① Product Intelligence, ③ Conversion Strategy

## 출력 타입

```typescript
type TrustLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface TrustElement {
  level: TrustLevel;              // 신뢰 레벨 (1~6 순차)
  name: string;                   // 존재감, 전문성, 제3자검증, 사회증명, 안전장치, 동료압력
  customerPsychology: string;     // 고객 심리 ("이 브랜드 실재하는구나" 등)
  elements: string[];             // 활성화된 요소 (로고, 리뷰, 인증마크 등)
  placement: string;              // 배치 역할 (HOOK, SOLUTION, PROOF, OBJECTION, CTA)
  sectionOrder: number;           // 배치할 섹션 순서
}

interface TrustConfig {
  trustElements: TrustElement[];
  trustScore: number;             // 커버리지 점수 0~100 (활성레벨수/6*100)
}
```

**출력 수신 엔진**: Cross-Engine Bridge (Trust → Layout 반영)

## 특수 컴포넌트

### TRUST_TEMPLATES — 6레벨 순차 신뢰 구조 (index.ts 내 정의)

> `rules.ts` 별도 파일 없음. 모든 로직이 `index.ts`에 inline 정의.

| Level | Name | 고객 심리 | 요소 | 배치 역할 |
|-------|------|----------|------|----------|
| 1 | 존재감 | "이 브랜드 실재하는구나" | 브랜드 로고, 프로페셔널 디자인, 커스텀 도메인 | HOOK |
| 2 | 전문성 | "이 분야를 아는구나" | 상세 스펙, 기술 설명, 전문 용어 활용 | SOLUTION |
| 3 | 제3자 검증 | "다른 사람도 인정하는구나" | 인증 마크, 특허, 수상 경력, 미디어 소개 | PROOF |
| 4 | 사회 증명 | "많은 사람이 쓰는구나" | 고객 리뷰, 판매량, 고객사 로고, 별점 | PROOF |
| 5 | 안전장치 | "실패해도 괜찮겠구나" | 환불 보증, AS 정책, FAQ, 고객센터 | OBJECTION, CTA |
| 6 | 동료 압력 (선택적) | "다른 사람도 지금 보고 있구나" | 실시간 조회 수, 최근 구매 알림 | CTA |

**레벨6 활성 조건**: `decisionType === 'follower'` OR `resistanceMap.trust.level >= 4`

### 핵심 로직

- `selectRelevantElements()`: `resistanceMap.trust.level >= 4`이면 전체 요소 활성화, 아니면 최대 2개
- `findSectionOrder()`: `targetRoles`에 매칭되는 blueprint.structure[] 섹션의 order 반환 (중복 배치 방지)

### 호출 순서 (동기 실행)
```
TRUST_TEMPLATES 순회 (Lv1→Lv6, Lv6은 조건부)
    │
    ▼
각 레벨: findSectionOrder (targetRoles → blueprint.structure[] 매칭)
    │
    ▼
각 레벨: selectRelevantElements (trust 저항 높으면 전체, 낮으면 2개)
    │
    ▼
trustScore 산출 (활성 레벨 수 / 6 × 100, 순수 커버리지)
    │
    ▼
TrustConfig 반환
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ① Product Intelligence | ProductBrief | brief | 직접 매핑 |
| ③ Conversion Strategy | StrategyBlueprint | strategyBlueprint | 직접 매핑 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| Cross-Engine Bridge | TrustConfig.trustElements | BridgeInput.trustConfig | 직접 매핑 |

## 출력 품질 기준

### 합격 기준
- `trustElements.length` ≥ 1
- `trustScore` 범위 0~100
- 모든 trustElement의 `level` 1~6 범위
- 모든 trustElement의 `placement`가 유효한 섹션 위치
- `sectionOrder`가 strategyBlueprint.structure[] 범위 내

### 경고 기준
- `trustElements.length` === 1 (최소 수준)
- `trustScore` < 30 (낮은 신뢰도)

### 불합격 기준
- `trustElements` 빈 배열
- `level`이 1~6 범위 밖
- `sectionOrder`가 structure[] 범위 초과

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
| trustElements 비어있지 않음 | 엔진 특화 > trustElements 검증 | length ≥ 1 |
| level 범위 | 엔진 특화 > trustElements 검증 | 1~6 (클램핑) |
| sectionOrder 범위 | 엔진 특화 > sectionOrder 범위 검증 | 0 ~ structure.length-1 |
| trustScore 범위 | 엔진 특화 > trustScore 검증 | 0~100 |
| 6레벨 템플릿 매칭 | 엔진 특화 > 템플릿 매칭 검증 | 6개 TRUST_TEMPLATES 순차 생성 + Lv6 조건부 |
| 결정론성 | 엔진 구현 > 규칙 엔진 체크 | 같은 입력 → 같은 출력 |
| AI 호출 없음 | 엔진 구현 > 규칙 엔진 체크 | AI 비용 0 |
| tsc/lint/build | 코드 변경 후 | 에러 0 |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정
- 인접 엔진 타입 변경 시: 호환 매핑 재확인

## 흡수 알림 (2026-03-09)

> ⑥ Trust Architecture의 기능은 26개 섹션 에이전트(agent/sections/)로 흡수되었습니다.
> CERTIFICATION, REVIEWS, REFUND_POLICY 등 신뢰 관련 섹션 에이전트가 직접 담당합니다.
> 이 엔진은 공통 신뢰 전략 가이드라인을 제공하는 역할로 전환됩니다.
