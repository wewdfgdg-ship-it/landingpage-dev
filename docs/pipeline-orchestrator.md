# Pipeline Orchestrator 설계서

> 12엔진 파이프라인의 실행 순서, 재시도, fallback, 타임아웃을 관리하는 코드 레벨 오케스트레이터.
> agent/ MD 파일이 아닌 `src/engine/pipeline.ts`에 구현한다.

## 역할

```
사용자 입력 (위저드)
    │
    ▼
Pipeline Orchestrator (pipeline.ts)
    │
    ├── 실행 순서 관리 (DAG 기반)
    ├── 엔진별 타임아웃 강제
    ├── 실패 시 fallback 경로 결정
    ├── 비용 추적 (₩ 단위 누적)
    ├── 진행률 SSE 전파
    └── 최종 결과 조합
```

## 실행 순서 (DAG)

### Phase 1: 분석 (직렬)
```
① Product Intelligence (AI×3)
    │
    ▼
② Why Now (규칙)
    │
    ▼
③ Conversion Strategy (AI×1)
    │
    ▼
④ Objection Killer (규칙)
```

### Phase 2: 생성 (부분 병렬)
```
③ 완료 후 병렬 시작:
    ├── ⑤ Psychological Copy (AI×1 + QG)  ──→ ⑥ Trust Architecture (규칙)
    ├── ⑦ Attention Architecture (규칙) ──→ ⑧ Layout Intelligence (규칙)
    └── ⑨ Visual Style (규칙, ①+③ 입력)

5개 엔진 완료 대기 → Cross-Engine Bridge (규칙)
```

### Phase 3: 이미지 (병렬)
```
Image Generation (Gemini × N, 병렬 3)
```

### Phase 4: 빌드 (직렬)
```
⑩ Code Engine (규칙) → ⑪ Deploy (규칙) → ⑫ Learning Loop (비동기)
```

## 엔진별 타임아웃

| 엔진 | 유형 | 타임아웃 | 재시도 | 비용 예상 |
|------|------|---------|--------|----------|
| ① Product Intelligence | AI×3 | 30s | 2회 | ₩100-200 |
| ② Why Now | 규칙 | 5s | 0 | ₩0 |
| ③ Conversion Strategy | AI×1 | 20s | 2회 | ₩50-100 |
| ④ Objection Killer | 규칙 | 5s | 0 | ₩0 |
| ⑤ Psychological Copy | AI×1+QG | 30s (×3) | 2회 (QG 내부) | ₩50-220 |
| ⑥ Trust Architecture | 규칙 | 5s | 0 | ₩0 |
| ⑦ Attention Architecture | 규칙 | 5s | 0 | ₩0 |
| ⑧ Layout Intelligence | 규칙 | 5s | 0 | ₩0 |
| ⑨ Visual Style | 규칙 | 5s | 0 | ₩0 |
| Bridge | 규칙 | 5s | 0 | ₩0 |
| Image Gen | Gemini×N | 90s | 1회/섹션 | ₩500-1500 |
| ⑩ Code Engine | 규칙 | 10s | 0 | ₩0 |
| ⑪ Deploy | 규칙+R2 | 30s | 3회 (지수 백오프) | ₩0 |
| ⑫ Learning Loop | AI×1 | 20s | 1회 | ₩30-60 |

**총 예상 비용**: ₩730-2,080/생성 (≈$0.50-1.50)
**총 예상 시간**: 80-190초 (Phase 1: 15-30s, Phase 2: 30-60s, Phase 3: 30-90s, Phase 4: 5-10s)

## 실패 경로 (Degraded Path Map)

### 핵심 블록 (실패 시 파이프라인 중단)

| 엔진 | 재시도 후에도 실패 | 최종 처리 |
|------|-----------------|----------|
| ① Product Intelligence | AI 3회 호출 전부 실패 | **파이프라인 중단** → 사용자 에스컬레이션 |
| ⑤ Psychological Copy | QG 2회 재시도 후 score < 50 | **최소 카피 모드** → degraded 진행 |
| ⑩ Code Engine | 렌더러 에러 | **섹션별 fallback HTML** → 부분 결과 반환 |

### 비차단 엔진 (실패 시 기본값으로 계속)

| 엔진 | fallback 값 |
|------|------------|
| ② Why Now | `{ primaryType: 'social_proof', ctaUrgencyLevel: 3 }` |
| ④ Objection Killer | `{ activeObjections: [] }` (빈 맵) |
| ⑥ Trust Architecture | `{ trustElements: [], trustScore: 0 }` |
| ⑦ Attention Architecture | 균등 4 Zone (각 0.25) |
| ⑧ Layout Intelligence | 섹션 역할별 기본 패턴 매핑 |
| ⑨ Visual Style | `{ mood: 'clean', tokens: DEFAULT_TOKENS }` |
| ⑫ Learning Loop | 학습 스킵 (페이지 정상 작동) |

### Image Generation 실패

```
이미지 생성 실패 (섹션별 독립)
    │
    ├── 개별 섹션 실패 → placeholder 삽입, 나머지 정상 진행
    ├── 전체 실패 → 모든 섹션 placeholder → ⑩ Code Engine 진행
    └── 타임아웃 → 완료된 이미지만 사용, 나머지 placeholder
```

### ⑪ Deploy 실패

```
R2 업로드 실패
    │
    ├── 재시도 1 (2s 대기) → 성공 시 완료
    ├── 재시도 2 (4s 대기) → 성공 시 완료
    ├── 재시도 3 (8s 대기) → 성공 시 완료
    └── 3회 실패 → 사용자 에스컬레이션 (GeneratedPage는 보존)
```

## 병렬 실행 맵

### Phase 2 병렬 그룹

```typescript
// Phase 2: 병렬 실행 가능한 그룹
const phase2 = await Promise.allSettled([
  // 그룹 A: Copy 체인 (직렬)
  runCopyChain(brief, urgencyBrief, blueprint, objectionMap, industry),

  // 그룹 B: Layout 체인 (직렬)
  runLayoutChain(brief, blueprint),

  // 그룹 C: Visual Style (독립)
  runVisualStyle(brief, industry, blueprint),
]);

// 그룹 A 내부: ⑤ → ⑥ (직렬)
async function runCopyChain(...) {
  const copy = await runPsychologicalCopy(...);  // ⑤
  const trust = await runTrustArchitecture(...); // ⑥
  return { copy, trust };
}

// 그룹 B 내부: ⑦ → ⑧ (직렬)
async function runLayoutChain(...) {
  const attention = await runAttentionArchitecture(...); // ⑦
  const layout = await runLayoutIntelligence(...);       // ⑧
  return { attention, layout };
}
```

### Phase 3 병렬 이미지

```typescript
// 섹션별 병렬 (동시 3개 제한)
const imageResults = await pMap(
  sections,
  (section) => generateSectionImage(section, styleConfig),
  { concurrency: 3 }
);
```

## 진행률 SSE 전파

```typescript
interface PipelineProgress {
  phase: 1 | 2 | 3 | 4;
  engine: string;           // 현재 실행 중인 엔진 이름
  step: number;             // 현재 단계 (1-based)
  totalSteps: number;       // 전체 단계 수
  percentage: number;       // 0-100
  cost: number;             // 누적 비용 (₩)
  warnings: string[];       // 경고 메시지 목록
  isDegraded: boolean;      // degraded 모드 여부
}
```

**단계별 퍼센트 매핑**:

| Phase | 단계 | 퍼센트 |
|-------|------|--------|
| 1 | ① 시작 | 5% |
| 1 | ① 완료 | 15% |
| 1 | ②③④ 완료 | 25% |
| 2 | ⑤ 시작 | 30% |
| 2 | ⑤ 완료 | 45% |
| 2 | Bridge 완료 | 55% |
| 3 | 이미지 시작 | 60% |
| 3 | 이미지 완료 | 80% |
| 4 | ⑩ 완료 | 90% |
| 4 | ⑪ 완료 | 98% |
| 4 | 완료 | 100% |

## 비용 추적

```typescript
interface CostTracker {
  engines: Record<string, number>;  // 엔진별 비용 (₩)
  images: number;                    // 이미지 생성 비용 (₩)
  total: number;                     // 총 비용 (₩)
}
```

**비용 상한**: ₩3,000/생성 — 초과 시 이미지 생성 품질 다운그레이드 (해상도 ↓)

## 구현 위치

```
src/engine/
├── pipeline.ts              ← Orchestrator 메인 (이 설계서 구현)
├── pipeline-types.ts        ← PipelineProgress, CostTracker 등
├── pipeline-fallbacks.ts    ← 엔진별 기본값, degraded 처리
├── 01-product-intelligence/
├── 02-why-now/
├── ...
└── 12-learning-loop/
```

## 업데이트 규칙

- 엔진 추가/제거 시: DAG, 타임아웃, fallback 테이블 갱신
- 의존관계 변경 시: 병렬 그룹 재구성
- 비용 변경 시: 비용 예상 테이블 갱신
- agent/ workflow.md DAG와 항상 동기화 유지
