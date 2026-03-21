# 엔진 스펙 — Learning Loop Agent

## 담당 엔진

- **번호**: ⑫
- **이름**: Learning Loop
- **경로**: `src/engine/12-learning-loop/`
- **AI/규칙**: Claude Sonnet ×1 (진단) + 규칙
- **핵심 함수**: `runLearningLoop(projectId: string, metrics: TrackingMetrics): Promise<LearningLoopOutput>`

## 입력 타입

```typescript
interface TrackingMetrics {
  projectId: string;
  pageUrl: string;
  period: {
    start: string;   // ISO 8601
    end: string;      // ISO 8601
  };
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;          // 0~100
  avgTimeOnPage: number;       // 초 단위
  scrollDepth: {
    p25: number;               // 25% 스크롤 도달률 (0~100)
    p50: number;
    p75: number;
    p100: number;
  };
  clicks: {
    sectionId: string;
    elementType: 'cta' | 'link' | 'image' | 'other';
    count: number;
  }[];
  conversions: {
    type: 'cta_click' | 'form_submit' | 'purchase' | 'signup';
    count: number;
    rate: number;              // 0~100 (전환율)
  }[];
  sectionMetrics: {
    sectionId: string;
    impressions: number;
    dwellTime: number;         // 초 단위
    scrollPastRate: number;    // 0~100
  }[];
}
```

**입력 제공 엔진**: ⑪ Deploy (배포 후 트래킹 시작) + 외부 트래킹 시스템 (메트릭 수집)

## 출력 타입

```typescript
interface LearningLoopOutput {
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  activeTests: ABTest[];
  winningPatterns: WinningPattern[];
}

interface Diagnosis {
  id: string;
  type: DiagnosisType;         // 'high_bounce' | 'low_scroll' | 'weak_cta' | 'slow_section' | 'drop_off' | 'low_engagement'
  severity: 'critical' | 'high' | 'medium' | 'low';
  sectionId?: string;          // 문제 섹션 (해당 시)
  description: string;         // 진단 설명
  evidence: string;            // 근거 데이터
  suggestedAction: string;     // 권장 조치
}

interface Prescription {
  id: string;
  diagnosisId: string;         // 연결된 진단
  level: 1 | 2 | 3;           // 1=미세 조정, 2=섹션 변경, 3=구조 변경 (사용자 승인 필요)
  action: string;              // 처방 내용
  targetSectionId?: string;    // 대상 섹션
  expectedImpact: string;      // 예상 효과
  requiresApproval: boolean;   // Level 3 = true
}

interface ABTest {
  id: string;
  prescriptionId: string;
  variant: 'A' | 'B';
  status: 'running' | 'completed' | 'cancelled';
  startedAt: string;           // ISO 8601
  sampleSize: number;
  confidenceLevel: number;     // 0~100
  pValue?: number;             // 통계적 유의성 (< 0.05 = 유의)
  winner?: 'A' | 'B' | 'inconclusive';
}

interface WinningPattern {
  id: string;
  testId: string;
  pattern: string;             // 승리 패턴 설명
  impact: string;              // 측정된 효과
  applicableContext: string;   // 적용 가능한 맥락
}
```

**출력 수신 엔진**: ① Product Intelligence (피드백 루프 — WinningPattern으로 향후 생성 개선)

## 특수 컴포넌트

### prompts.ts — 1개 AI 호출 프롬프트

| 함수 | AI 호출 | 입력 | 출력 | 예상 비용 |
|------|---------|------|------|----------|
| `diagnoseMetrics` | Claude Sonnet 1회 | TrackingMetrics + 기존 winningPatterns | Diagnosis[] + Prescription[] | ~₩50-100 |

**총 예상 비용**: ₩50-100/회 (1 AI 호출)

### 규칙 기반 컴포넌트

| 함수 | 입력 | 출력 | 설명 |
|------|------|------|------|
| `evaluateThresholds` | TrackingMetrics | Diagnosis[] (규칙 기반) | 임계값 기반 자동 진단 (bounceRate > 70 등) |
| `manageCBTest` | Prescription, 현재 메트릭 | ABTest | A/B 테스트 생성/관리 |
| `checkStatisticalSignificance` | ABTest, 메트릭 | winner, pValue | 통계적 유의성 검증 (p < 0.05) |
| `extractWinningPattern` | 완료된 ABTest | WinningPattern | 승리 패턴 추출 |

### 호출 순서 (의존관계)
```
1. evaluateThresholds (규칙 기반 자동 진단) — 독립
    │
    ▼ 규칙 기반 diagnoses
2. diagnoseMetrics (AI 진단) — evaluateThresholds 결과 참조
    │
    ▼ AI 기반 diagnoses + prescriptions
3. 진단 병합 (규칙 + AI)
    │
    ▼
4. manageABTest (처방 기반 A/B 테스트 관리) — prescriptions 필요
    │
    ▼
5. checkStatisticalSignificance (진행 중 테스트 유의성 검증)
    │
    ▼
6. extractWinningPattern (완료된 테스트에서 패턴 추출)
    │
    ▼ 최종 LearningLoopOutput 조립
```

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ⑪ Deploy | DeployResult.slug | projectId 기반 조회 | DB에서 매핑 |
| ⑪ Deploy | DeployResult.url | metrics.pageUrl | 직접 매핑 |
| 트래킹 시스템 | 이벤트 데이터 | TrackingMetrics 전체 | 집계 + 변환 |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| ① Product Intelligence | winningPatterns[] | 향후 ProductBrief 생성 시 참조 | DB 저장 후 조회 |

## 출력 품질 기준

### 합격 기준
- `diagnoses[]` 각각 `severity` 유효값 ('critical' | 'high' | 'medium' | 'low')
- `diagnoses[]` 각각 `type` 유효값 (DiagnosisType enum)
- `prescriptions[]` 각각 `level` 1-3 범위
- `prescriptions[]` Level 3에는 `requiresApproval: true`
- A/B 테스트 통계적 유의성 검증 (pValue < 0.05)
- 진단 임계값이 합리적 (극단값 아님)

### 경고 기준
- 메트릭 데이터 부족 (pageViews < 100 — 통계적 의미 낮음)
- A/B 테스트 샘플 크기 부족 (sampleSize < 1000)
- 진단 0건 (데이터는 있으나 이상 없음 — 정상일 수도 있음)

### 불합격 기준
- `diagnoses[]`의 `severity`가 유효하지 않은 값
- `prescriptions[]`의 `level`이 1-3 범위 초과
- Level 3 처방에 `requiresApproval: false` (사용자 승인 게이트 누락)
- AI 응답 JSON 파싱 실패 (재시도 후에도)
- A/B 테스트 교란 변수 미통제 상태로 결론 도출

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

## Section Analytics (2026-03-09 추가)

> ⑫ Learning Loop에 섹션별 성과 분석 기능이 추가되었습니다.

### 구조
```
⑫ Learning Loop
├── Page Analytics        → 전체 전환율, 이탈률, 체류시간
└── Section Analytics     → 섹션별 성과 × 26개
```

### 공통 지표 (26개 섹션 전부)
| 지표 | 설명 |
|------|------|
| scroll_reach | 스크롤 도달률 (%) |
| dwell_time | 체류시간 (초) |
| bounce_from | 이 섹션에서 이탈률 (%) |

### 섹션별 고유 지표
| 섹션 | 고유 지표 |
|------|----------|
| HEADER_BANNER | ctr (클릭률) |
| KEY_FEATURES | feature_click (기능별 클릭) |
| BEFORE_AFTER | slider_interaction (슬라이더 조작률) |
| REVIEWS | read_more_rate (더보기 클릭률) |
| PHOTO_REVIEWS | image_tap_rate (이미지 탭률) |
| FAQ | open_rate (질문 오픈률) |
| CTA | click_rate, conversion_rate |
| COMPETITOR_COMPARE | compare_hover (항목별 호버) |
| LIMITED_OFFER | urgency_ctr (긴급성 반응) |
| PRICE_TABLE | plan_select_rate (플랜 선택률) |
| SNS_VIRAL | share_rate (공유 클릭률) |
| BUNDLE_SET | bundle_select_rate (세트 선택률) |

### 피드백 루프
```
Section Analytics 수집
    ↓
각 섹션 에이전트 memory.md에 업종별 성과 누적
    ↓
다음 생성 시 성과 높은 패턴/비중 자동 반영
```

## 체크리스트 앵커 (checklist.md 연동)

| 품질 기준 | checklist 항목 | 실패 시 loop.md 루프 |
|----------|---------------|-------------------|
| DiagnosisType 유효값만 사용 | diagnosis_valid | 진단 정확도 미달 루프 |
| severity 4단계 유효값 | diagnosis_valid | 진단 정확도 미달 루프 |
| prescriptions level 1-3 범위 | prescription_valid | 처방 레벨 검증 루프 |
| Level 3 requiresApproval: true | level3_gate_valid | Level 3 승인 게이트 수정 |
| pValue 계산 로직 정확 (p < 0.05) | ab_test_valid | A/B 테스트 교란 변수 루프 |
| 샘플 크기 500+ | ab_test_valid | A/B 테스트 교란 변수 루프 |
| 임계값 합리적 (5종) | threshold_valid | 진단 정확도 미달 루프 |
| AI JSON 파싱 성공 + fallback | ai_parsing_valid | AI 응답 파싱 실패 루프 |
| 비용 ₩500 이하 + 토큰 추적 | cost_tracked | 비용 추적 로직 추가 |
| tsc/lint/build 통과 | 기본 체크 | 일반 루프 |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정
- 인접 엔진 타입 변경 시: 호환 매핑 재확인
- 체크리스트 앵커 변경 시: checklist.md와 동기화
